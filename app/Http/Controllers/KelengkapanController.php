<?php

namespace App\Http\Controllers;

use App\Models\Kelengkapan;
use App\Models\Spj;
use Illuminate\Http\Request;

class KelengkapanController extends Controller
{
    public function index()
    {
        $kelengkapan = Kelengkapan::with('spj')->get();

        return view('pages.kelengkapan.index', [
            'kelengkapan' => $kelengkapan,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'spj_id' => ['required', 'string', 'max:14'],
            'nama_dokumen' => ['required', 'string', 'max:100'],
            'file' => ['nullable', 'mimes:pdf', 'max:2048'],
        ]);

        // Tentukan folder penyimpanan
        $folder = 'uploads/' . $validated['spj_id'];

        // Buat folder jika belum ada
        if (!file_exists(public_path($folder))) {
            mkdir(public_path($folder), 0777, true);
        }

        $filePath = null;

        // Jika user upload file baru
        if ($request->hasFile('file')) {
            $filename = strtolower(str_replace(' ', '_', $validated['nama_dokumen'])) . '.pdf';
            $request->file('file')->move(public_path($folder), $filename);
            $filePath = $folder . '/' . $filename;
        }

        // Cek apakah dokumen dengan nama dan spj_id yang sama sudah ada (untuk overwrite)
        $existing = Kelengkapan::where('spj_id', $validated['spj_id'])
            ->where('nama_dokumen', $validated['nama_dokumen'])
            ->first();

        if ($existing) {
            // Overwrite dokumen lama
            $existing->update([
                'file_path' => $filePath ?? $existing->file_path,
                'versi' => $existing->versi + 1,
                'tanggal_upload' => now(),
                'upload_by' => 'System',
            ]);
        } else {
            Kelengkapan::create([
                'spj_id' => $validated['spj_id'],
                'nama_dokumen' => $validated['nama_dokumen'],
                'file_path' => $filePath,
                'versi' => 1,
                'tanggal_upload' => now(),
                'upload_by' => 'System',
            ]);
        }

        return redirect('/kelengkapan')->with('success', 'Dokumen berhasil diunggah.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'spj_id' => ['required', 'string', 'max:14'],
            'nama_dokumen' => ['required', 'string', 'max:100'],
            'file' => ['nullable', 'mimes:pdf', 'max:2048'],
        ]);

        $kelengkapan = Kelengkapan::findOrFail($id);
        $folder = 'uploads/' . $validated['spj_id'];

        if (!file_exists(public_path($folder))) {
            mkdir(public_path($folder), 0777, true);
        }

        if ($request->hasFile('file')) {
            $filename = strtolower(str_replace(' ', '_', $validated['nama_dokumen'])) . '.pdf';
            $request->file('file')->move(public_path($folder), $filename);
            $validated['file_path'] = $folder . '/' . $filename;
        }

        $validated['versi'] = $kelengkapan->versi + 1;
        $validated['tanggal_upload'] = now();
        $validated['upload_by'] = 'System';

        $kelengkapan->update($validated);

        return redirect('/kelengkapan')->with('success', 'Data dokumen berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $kelengkapan = Kelengkapan::findOrFail($id);
        $kelengkapan->delete();

        return redirect('/kelengkapan')->with('success', 'Dokumen berhasil dihapus.');
    }
}
