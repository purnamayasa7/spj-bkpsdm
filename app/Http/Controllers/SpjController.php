<?php

namespace App\Http\Controllers;

use App\Models\Spj;
use App\Models\Kelengkapan;
use App\Models\User;
use Illuminate\Http\Request;
use App\Notifications\SpjStatusChanged;
use App\Notifications\SpjCreatedNotification;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Exports\SpjExport;
use Maatwebsite\Excel\Facades\Excel;

class SpjController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $year = $request->year ?? now()->year;

        if (!in_array($year, [2025, 2026])) {
            $year = now()->year;
        }

        $spj = Spj::where('bidang', $user->bidang)
            ->whereYear('created_at', $year)
            ->latest()
            ->get();

        return view('pages.spj.index', compact('spj', 'year'));
    }

    public function create()
    {
        // SPJ ID
        $tanggal = now()->format('dmY');

        $lastSpj = Spj::where('id', 'like', "SPJ{$tanggal}%")->orderBy('id', 'desc')->first();

        if ($lastSpj) {
            $lastNumber = (int) substr($lastSpj->id, -3); // ambil 3 digit terakhir
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        $previewId = 'SPJ' . $tanggal . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        return view('pages.spj.create', ['previewId' => $previewId]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            //'id' => ['required', 'string', 'min:14', 'max:14'],
            'bidang' => ['required', 'max:11'],
            'jenis' => ['required', Rule::in(['GU', 'LS', 'UP'])],
            'pptk' => ['required', 'max:100'],
            'kegiatan' => ['required', 'max:100'],
            'belanja' => ['required', 'max:100'],
            'nilai' => ['required', 'integer'],
            'sumber_dana' => ['required', 'max:50'],
            'tanggal_spj' => ['required', 'string'],
            'tanggal_terima_spj' => ['required', 'string'],
            'kelengkapan_spj' => ['nullable', 'string'],
            'kelengkapan_spk' => ['nullable', 'string'],
            'keterangan' => ['nullable', 'string'],
            'status' => ['required', 'max:10'],
        ]);

        $tanggal = now()->format('dmY');

        DB::beginTransaction();

        try {
            $lastSpj = Spj::where('id', 'like', "SPJ{$tanggal}%")
                ->lockForUpdate()
                ->orderBy('id', 'desc')
                ->first();

            if ($lastSpj) {
                $lastNumber = (int) substr($lastSpj->id, -3);
                $nextNumber = $lastNumber + 1;
            } else {
                $nextNumber = 1;
            }

            $newId = 'SPJ' . $tanggal . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

            $validated['id'] = $newId;

            $spj = Spj::create($validated);

            logActivity('Create', "Membuat SPJ ID {$spj->id}", 'spj');

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        //$spj = Spj::create($validated);

        // Simpan dokumen kelengkapan
        $uploadedNames = [];

        if ($request->hasFile('dokumen')) {
            foreach ($request->file('dokumen') as $namaDokumen => $file) {
                if ($file) {
                    // Ambil ID SPJ
                    $spjId = $spj->id;

                    // Buat folder berdasarkan ID SPJ
                    $folderPath = "spj/{$spjId}";

                    // Buat nama file unik (bisa tambahkan timestamp)
                    $filename = Str::slug($namaDokumen) . '_' . time() . '.' . $file->getClientOriginalExtension();

                    // Simpan ke folder sesuai ID SPJ
                    $path = $file->storeAs($folderPath, $filename, 'public');

                    // Simpan ke database
                    Kelengkapan::create([
                        'spj_id' => $spjId,
                        'nama_dokumen' => $namaDokumen,
                        'file_path' => $path,
                        'status' => 'Belum Diverifikasi',
                        'alasan' => '-',
                        'upload_by' => Auth::user()->name,
                        'tanggal_upload' => now(),
                    ]);
                    $uploadedNames[] = $namaDokumen;
                }
            }
        }

        // Update field kelengkapan_spj di tabel spjs
        if (!empty($uploadedNames)) {
            $spj->kelengkapan_spj = implode(', ', $uploadedNames);
            $spj->save();
        }

        $keuanganUsers = User::where('role_id', '1')->get();

        if ($keuanganUsers->isNotEmpty()) {
            Notification::send($keuanganUsers, new SpjCreatedNotification($spj, Auth::user()->bidang));
        }

        return redirect('/spj')->with('success', 'SPJ berhasil dibuat dengan ID ' . $spj->id . '.');
    }

    public function edit($id)
    {
        $spj = Spj::with('kelengkapans')->findOrFail($id);
        $kelengkapan = $spj->kelengkapans;

        // Daftar master dokumen
        $allDokumens = [
            'Kuitansi',
            'Bukti Pembelian',
            'BAST dan Lampiran',
            'BAP dan Lampiran',
            'Nota Permintaan Barang/Jasa',
            'Surat Permintaan Barang/Jasa',
            'Berita Acara Penyerahan Barang/Jasa',
            'Riwayat Negoisasi',
            'Surat Pesanan',
            'Invoice Beserta Lampiran',
            'Nota Dinas',
            'Dokumen Persiapan Pengadaan (DPP)',
            'Surat Perintah Pengiriman (SPP)/(SPMK)',
            'Daftar Penerimaan',
            'Surat Tugas',
            'SPD Lampiran',
            'Rincian Biaya',
            'Daftar Hadir',
            'Laporan + Dokumentasi',
            'Dokumentasi Pajak',
            'Lain-lain'
        ];

        $uploadedNames = $kelengkapan->pluck('nama_dokumen')->toArray();

        $dokumens = array_values(array_diff($allDokumens, $uploadedNames));

        return view('pages.spj.edit', compact('spj', 'kelengkapan', 'dokumens'));
    }


    public function update(Request $request, $id)
    {
        $spj = Spj::findOrFail($id);

        $request->validate([
            'nama_dokumen_baru.*' => 'nullable|string|max:100',
            'dokumen_baru.*' => 'nullable|file|mimes:pdf|max:5120', // hanya izinkan PDF maks 5MB
        ]);

        $oldStatus = $spj->status;

        // Update SPJ
        $spj->update($request->only([
            'bidang',
            'jenis',
            'pptk',
            'kegiatan',
            'belanja',
            'nilai',
            'sumber_dana',
            'tanggal_spj',
            'tanggal_terima_spj',
            'kelengkapan_spk',
            'keterangan'
        ]));

        // Update Kelengkapan
        if ($request->has('kelengkapan')) {
            foreach ($request->kelengkapan as $kelengkapanId => $data) {
                $kelengkapan = Kelengkapan::find($kelengkapanId);
                if (!$kelengkapan) continue;

                // Only process if the current status is "Tidak Valid"
                if ($kelengkapan->status === 'Tidak Valid' || $spj->status === 'Disetujui') {

                    if ($request->hasFile("kelengkapan.$kelengkapanId.file_path")) {
                        $file = $request->file("kelengkapan.$kelengkapanId.file_path");
                        $timestamp = now()->timestamp;
                        $filename = strtolower(str_replace(' ', '_', $kelengkapan->nama_dokumen)) . "_{$timestamp}.pdf";
                        $path = $file->storeAs("spj/{$spj->id}", $filename, 'public');

                        // Hapus old lama
                        if ($kelengkapan->file_path && Storage::disk('public')->exists($kelengkapan->file_path)) {
                            Storage::disk('public')->delete($kelengkapan->file_path);
                        }

                        // Update new files, version and status
                        $kelengkapan->file_path = $path;
                        $kelengkapan->versi = $kelengkapan->versi + 1;
                        $kelengkapan->tanggal_upload = now();
                        $kelengkapan->upload_by = Auth::user()->name;

                        if ($spj->status !== 'Disetujui') {
                            $kelengkapan->status = 'Belum Diverifikasi';
                        }
                    }
                    $kelengkapan->save();
                }
            }
        }

        // Tambah dokumen baru
        if ($request->has('dokumen_baru')) {
            $newNames = [];

            foreach ($request->dokumen_baru as $index => $file) {
                if ($request->hasFile("dokumen_baru.$index")) {
                    $namaDokumen = $request->input("nama_dokumen_baru.$index");
                    if (!$namaDokumen) continue;

                    $filename = strtolower(str_replace(' ', '_', $namaDokumen))
                        . "_" . now()->timestamp . ".pdf";

                    $path = $file->storeAs("spj/{$spj->id}", $filename, 'public');

                    Kelengkapan::create([
                        'spj_id' => $spj->id,
                        'nama_dokumen' => $namaDokumen,
                        'file_path' => $path,
                        'status' => 'Belum Diverifikasi',
                        'versi' => 1,
                        'tanggal_upload' => now(),
                        'upload_by' => Auth::user()->name,
                    ]);

                    $newNames[] = $namaDokumen;
                }
            }

            // Updatekelengkapan_spj
            if (!empty($newNames)) {
                $existingNames = array_map('trim', explode(',', $spj->kelengkapan_spj ?? ''));

                $mergedNames = array_unique(array_filter(array_map('trim', array_merge($existingNames, $newNames))));
                $spj->kelengkapan_spj = implode(', ', $mergedNames);
                $spj->save();
            }
        }

        if ($spj->status === 'Dikoreksi') {
            $spj->status = 'Dikirim';
            $spj->save();

            $keuanganUsers = User::where('role_id', '1')->get(); // role 1 = Keuangan
            if ($keuanganUsers->isNotEmpty()) {
                Notification::send($keuanganUsers, new SpjStatusChanged(
                    $spj,
                    $oldStatus,
                    $spj->status
                ));
            }
        } elseif ($spj->status === 'Disetujui') {
            $spj->touch();
        }

        logActivity('Update', "Revisi SPJ ID {$spj->id}", 'spj');

        return redirect('/spj')->with('success', 'SPJ dan dokumen berhasil diperbarui dan dikirim ulang.');
    }

    public function show($id)
    {
        $spj = Spj::findOrFail($id);
        $kelengkapan = Kelengkapan::where('spj_id', $id)->get();

        return view('pages.spj.show', compact('spj', 'kelengkapan'));

        //return view('spj.show', compact('spj', 'kelengkapan'));
    }

    public function destroy($id)
    {
        $spj = Spj::findOrFail($id);
        $spj->delete();

        return redirect('/spj')->with('success', 'Data SPJ berhasil dihapus.');
    }

    //Function Keuangan Role    
    public function indexKeuangan()
    {
        $spj = Spj::with('kelengkapans')
            ->where('status', 'Dikirim')
            ->latest()
            ->get();

        $isDisetujui = false;

        return view('pages.spj.keuangan.index', compact('spj', 'isDisetujui'));
    }

    public function indexKeuanganDisetujui(Request $request)
    {
        $year = $request->year ?? now()->year;

        if (!in_array((int)$year, [2025, 2026])) {
            $year = now()->year;
        }

        $spj = Spj::with('kelengkapans')
            ->where('status', 'Disetujui')
            ->whereYear('created_at', $year)
            ->latest()
            ->get();

        $isDisetujui = true;

        return view('pages.spj.keuangan.index', compact('spj', 'year', 'isDisetujui'));
    }



    public function review($id)
    {
        $spj = Spj::findOrFail($id);
        $kelengkapan = Kelengkapan::where('spj_id', $id)->get();

        return view('pages.spj.keuangan.review', compact('spj', 'kelengkapan'));
    }

    public function submitReview(Request $request, $id)
    {
        $spj = Spj::findOrFail($id);
        $oldStatus = $spj->status;

        // Tolak SPJ
        if ($request->action_type === 'tolak') {

            $spj->update([
                'status' => 'Ditolak',
                'keterangan' => $request->alasan_penolakan,
            ]);

            $bidangUsers = User::where('role_id', 2)
                ->where('bidang', $spj->bidang)
                ->get();

            if ($bidangUsers->isNotEmpty()) {
                Notification::send($bidangUsers, new SpjStatusChanged(
                    $spj,
                    $oldStatus,
                    'Ditolak'
                ));
            }

            logActivity('Reject', "Menolak SPJ ID {$spj->id}", 'spj');

            return redirect()
                ->route('spj.keuangan.index')
                ->with('success', 'SPJ berhasil ditolak.');
        }

        $kelengkapanList = Kelengkapan::where('spj_id', $id)->get();

        foreach ($kelengkapanList as $file) {
            $status = $request->input("status.{$file->id}") ?? 'Belum Diverifikasi';
            $alasan = $request->input("alasan_{$file->id}");

            $file->update([
                'status' => $status,
                'alasan' => $alasan,
            ]);
        }

        $semuaValid = Kelengkapan::where('spj_id', $id)
            ->where('status', '!=', 'Valid')
            ->count() === 0;

        $spj->status = $semuaValid ? 'Disetujui' : 'Dikoreksi';
        $spj->save();

        // Notifikasi ke Bidang
        $bidangUsers = User::where('role_id', 2)
            ->where('bidang', $spj->bidang)
            ->get();

        if ($bidangUsers->isNotEmpty()) {
            Notification::send($bidangUsers, new SpjStatusChanged(
                $spj,
                $oldStatus,
                $spj->status
            ));
        }

        if ($spj->status === 'Disetujui') {
            logActivity('Approve', "Menyetujui SPJ ID {$spj->id}", 'spj');
        } else {
            logActivity('Update', "Merevisi SPJ ID {$spj->id}", 'spj');
        }

        return redirect()
            ->route('spj.keuangan.index')
            ->with('success', 'Review SPJ berhasil disimpan.');
    }

    public function searchResults(Request $request)
    {
        $user = Auth::user();
        $query = $request->query('query');

        $spj = Spj::query();

        if ($user->role_id == 2) {
            $spj->where('bidang', $user->bidang);
        }

        // Filter pencarian
        $spj->where(function ($q) use ($query) {
            $q->where('id', 'like', "%{$query}%")
                ->orWhere('tanggal_spj', 'like', "%{$query}%")
                ->orWhere('status', 'like', "%{$query}%")
                ->orWhere('kegiatan', 'like', "%{$query}%")
                ->orWhere('bidang', 'like', "%{$query}%");
        });

        $spj = $spj->orderBy('created_at', 'desc')->paginate(10);

        return view('pages.spj.search-results', compact('spj', 'query'));
    }

    public function export(Request $request)
    {
        $from = $request->from;
        $to = $request->to;
        $status = $request->status;

        $query = Spj::query();

        $query->whereBetween('tanggal_spj', [$from, $to]);

        if (!empty($status)) {
            $query->where('status', $status);
        }

        if (Auth::user()->role_id == 2) {
            $query->where('bidang', Auth::user()->bidang);
        }

        $data = $query->get();

        return view('spj.export', compact('data', 'from', 'to', 'status'));
    }

    public function exportPdf(Request $request)
    {
        $data = Spj::query();

        if ($request->filled('dariTanggal') && $request->filled('sampaiTanggal')) {
            $data->whereBetween('tanggal_spj', [$request->dariTanggal, $request->sampaiTanggal]);
        }

        if ($request->filled('status')) {
            $data->where('status', $request->status);
        }

        if (Auth::user()->role_id == 1) {
            if ($request->filled('bidang')) {
                $data->where('bidang', $request->bidang);
            }
        }

        if (Auth::user()->role_id == 2) {
            $data->where('bidang', Auth::user()->bidang);
        }

        $spj = $data->get();

        $pdf = PDF::loadView('pages.spj.export.export-pdf', [
            'spj' => $spj,
            'dariTanggal' => $request->dariTanggal,
            'sampaiTanggal' => $request->sampaiTanggal,
            'status' => $request->status,
        ])->setPaper('a4', 'landscape');
        return $pdf->stream('laporan-spj.pdf');
    }

    public function exportExcel(Request $request)
    {
        return Excel::download(new SpjExport($request), 'laporan-spj.xlsx');
    }

    private function filterSpj($request)
    {
        $query = Spj::query();

        $query->whereBetween('tanggal_spj', [
            $request->dariTanggal,
            $request->sampaiTanggal
        ]);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if (Auth::user()->role_id == 2) {
            $query->where('bidang', Auth::user()->bidang);
        }

        return $query->get();
    }

    public function downloadZip($id)
    {
        $folderPath = storage_path('app/public/spj/' . $id);

        if (!is_dir($folderPath)) {
            return back()->with('error', 'Dokumen SPJ tidak ditemukan.');
        }

        $files = glob($folderPath . '/*.pdf');
        if (empty($files)) {
            return back()->with('error', 'Dokumen SPJ masih kosong.');
        }

        $zipFileName = "spj-{$id}.zip";
        $zipPath = storage_path("app/public/{$zipFileName}");

        if (file_exists($zipPath)) {
            unlink($zipPath);
        }

        $zip = new \ZipArchive();
        if ($zip->open($zipPath, \ZipArchive::CREATE) !== TRUE) {
            return back()->with('error', 'Gagal membuat file ZIP.');
        }

        foreach ($files as $file) {
            $zip->addFile($file, basename($file));
        }

        $zip->close();

        return response()->download($zipPath)->deleteFileAfterSend(true);
    }

    public function viewFile(Kelengkapan $kelengkapan)
    {
        $user = Auth::user();
        $spj  = Spj::findOrFail($kelengkapan->spj_id);
        
        if (
            $user->role_id !== 1 &&
            ($user->role_id !== 2 || $user->bidang !== $spj->bidang)
        ) {
            abort(403);
        }

        $fullPath = storage_path('app/public/' . $kelengkapan->file_path);

        if (!file_exists($fullPath)) {
            abort(404);
        }

        return response()->file($fullPath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline',
            'Cache-Control' => 'private, no-store, no-cache',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
