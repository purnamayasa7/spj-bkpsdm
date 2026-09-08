<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pegawai;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

Carbon::setLocale('id');

class KuitansiController extends Controller
{
    public function preview(Request $request)
    {
        $nilai = (int) ($request->nilai ?? 0);

        /** KODE REKENING
         */
        $rekening_boxes = preg_split(
            '/\s+/',
            trim($request->kode_rekening ?? '')
        );

        $pptk_pegawai = Pegawai::where('nama', $request->pptk)->first();
        $nip_pptk = $request->nip_pptk ?? ($pptk_pegawai?->nip ?? '');

        $penerima_pegawai = Pegawai::where('nama', $request->penerima)->first();
        $nip_penerima = $request->nip_penerima ?? ($penerima_pegawai?->nip ?? '');

        return Pdf::loadView('pages.spj.export.kuitansi', [
            'nomor_rekening'   => $request->nomor_rekening ?? '',
            'kode_rekening'    => $request->kode_rekening ?? '',
            'rekening_boxes'   => $rekening_boxes ?: [],

            'spj'              => $request->jenis_spj ?? 'GU',
            'tahun'            => !empty($request->tanggal_spj) ? Carbon::parse($request->tanggal_spj)->year : Carbon::now()->year,
            'tanggal_spj'      => !empty($request->tanggal_spj) ? Carbon::parse($request->tanggal_spj)->translatedFormat('d F Y') : Carbon::now()->translatedFormat('d F Y'),          
            'sumber_dana'      => $request->sumber_dana ?? 'DAU',

            'nilai'            => $nilai,
            'terbilang'        => ucfirst(trim(terbilang($nilai))) . ' Rupiah',

            'untuk_pembayaran' => $request->untuk_pembayaran ?? '',
            'pptk'             => $request->pptk ?? '',
            'nip_pptk'         => $nip_pptk,
            'penerima'         => $request->penerima ?? '',
            'nip_penerima'     => $nip_penerima,

            'sudah_terima_dari'   => 'Bendahara Pengeluaran BKPSDM Kab. Buleleng',
            'setuju_dibayar'     => 'I Made Dwi Adnyana, S.STP., M.A.P',
            'nip_setuju_dibayar' => '197612281996011001',
            'bendahara'          => 'Kadek Meilani, S.E',
            'nip_bendahara'      => '198205022009022001',
        ])
            ->setPaper('A4', 'portrait')
            ->stream('kuitansi.pdf');
    }
}
