<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;

Carbon::setLocale('id');

class LampiranSpdController extends Controller
{
    public function preview(Request $request)
    {
        $items = [];

        if ($request->nama && is_array($request->nama)) {
            foreach ($request->nama as $i => $nama) {
                if (empty($nama)) continue;
                $items[] = (object)[
                    'nama' => $nama,
                    'nip' => $request->nip[$i] ?? '',
                    'jabatan' => $request->jabatan[$i] ?? '',
                    'pangkat' => $request->pangkat[$i] ?? '',
                    'tempat_kedudukan' => $request->tempat_kedudukan[$i] ?? 'Singaraja',
                    'tingkat_biaya' => (int) ($request->tingkat_biaya[$i] ?? 0),
                    'alat_angkut' => $request->alat_angkut[$i] ?? 'Kendaraan Dinas / Umum',
                    'no_surat_tugas' => $request->no_surat_tugas ?? '',
                    'tgl_surat_tugas' => !empty($request->tgl_surat_tugas) ? Carbon::parse($request->tgl_surat_tugas)->translatedFormat('d F Y') : '-',
                    'tanggal_mulai' => !empty($request->tanggal_mulai) ? Carbon::parse($request->tanggal_mulai)->translatedFormat('d F Y') : '-',
                    'tanggal_selesai' => !empty($request->tanggal_selesai) ? Carbon::parse($request->tanggal_selesai)->translatedFormat('d F Y') : '-',
                    'lama_hari' => $request->lama_hari[$i] ?? $request->lama_perjalanan ?? '1',
                    'keterangan' => $request->keterangan[$i] ?? '-',
                ];
            }
        }

        $data = [
            'items' => $items,
            'nomor_lampiran' => $request->nomor_lampiran ?? '-',
            'tanggal_lampiran' => !empty($request->tanggal_lampiran) ? Carbon::parse($request->tanggal_lampiran)->translatedFormat('d F Y') : Carbon::now()->translatedFormat('d F Y'),
            'daftar_peserta' => $request->daftar_peserta ?? '-',
            'tgl_penyelenggaraan' => !empty($request->tgl_penyelenggaraan) ? Carbon::parse($request->tgl_penyelenggaraan)->translatedFormat('d F Y') : Carbon::now()->translatedFormat('d F Y'),
            'kota' => $request->kota ?? '-',
            'satuan_kerja' => $request->satuan_kerja ?? 'BKPSDM Kab. Buleleng',
            'tanggal_cetak' => Carbon::now()->translatedFormat('d F Y'),
            'nama_kepala' => 'I Made Dwi Adnyana, S.STP., M.A.P',
            'nip_kepala' => '197612281996011001',
        ];

        return Pdf::loadView('pages.spj.export.lampiran-spd', $data)
            ->setPaper('A4', 'landscape')
            ->stream('lampiran-spd.pdf');
    }
}
