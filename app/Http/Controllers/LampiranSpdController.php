<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;

class LampiranSpdController extends Controller
{
    public function preview(Request $request){
        $data = [
            'nomor_lampiran' => $request->nomor_lampiran,
            'tanggal_lampiran' => $request->tanggal_lampiran,

            'daftar_peserta' => $request->daftar_peserta,
            'tgl_penyelenggaraan' => $request->tgl_penyelenggaraan,
            'kota' => $request->kota,
            'satuan_kerja' => 'BKPSDM Kab. Buleleng',

            'nama' => $request->nama,
            'nip' => $request->nip,
            'jabatan' => $request->jabatan,
            'pangkat' => $request->pangkat,

            'tempat_kedudukan' => $request->tempat_kedudukan,
            'tingkat_biaya' => $request->tingkat_biaya,
            'alat_angkut' => $request->alat_angkut,

            'no_surat_tugas' => $request->no_surat_tugas,
            'tgl_surat_tugas' => $request->tgl_surat_tugas,

            'tanggal_mulai' => Carbon::parse($request->tanggal_mulai)->translatedFormat('d F Y'),
            'tanggal_selesai' => Carbon::perse($request->tanggal_selesai)->translatedFormat('d F Y'),

            'lama_hari' => $request->lama_hari,
            'keterangan' => $request->keterangan,

            'tanggal_cetak' => Carbon::now()->translatedFormat('d F Y'),

            'nama_kepala' => 'I Made Dwi Adnyana, S.STP., M.A.P',
            'nip_kepala' => '197612281996011001',
        ];

        return Pdf::loadView(
            'pages.spj.export.lampiran-spd', $data
            )
            ->setPaper('A4', 'landscape')
            ->stream('lampiran-spd.pdf');
    }
}
