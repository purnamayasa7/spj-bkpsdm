<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

Carbon::setLocale('id');

class KuitansiController extends Controller
{
    public function preview(Request $request)
    {
        $nilai = (int) $request->nilai;

        /** KODE REKENING
         */
        $rekening_boxes = preg_split(
            '/\s+/',
            trim($request->kode_rekening)
        );

        return Pdf::loadView('pages.spj.export.kuitansi', [
            'nomor_rekening'  => $request->nomor_rekening,
            'kode_rekening'    => $request->kode_rekening,
            'rekening_boxes'  => $rekening_boxes,

            'spj'              => $request->jenis_spj,
            'tahun'            => Carbon::parse($request->tanggal_spj)->year,
            'tanggal_spj'      => Carbon::parse($request->tanggal_spj)->translatedFormat('d F Y'),          
            'sumber_dana'      => $request->sumber_dana,

            'nilai'            => $nilai,
            'terbilang'        => ucfirst(trim(terbilang($nilai))) . ' Rupiah',

            'untuk_pembayaran' => $request->untuk_pembayaran,
            'pptk'             => $request->pptk,
            'penerima'         => $request->penerima,

            'sudah_terima_dari' => 'Bendahara Pengeluaran BKPSDM Kab. Buleleng',
            'setuju_dibayar'   => 'I Made Dwi Adnyana, S.STP., M.A.P',
            'bendahara'        => 'Kadek Meilani, S.E',
        ])
            ->setPaper('A4', 'potrait')
            ->stream('kuitansi.pdf');
    }
}
