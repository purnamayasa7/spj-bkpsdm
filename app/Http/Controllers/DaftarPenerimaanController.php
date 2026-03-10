<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DaftarPenerimaanController extends Controller
{

    public function preview(Request $request)
    {

        $items = [];
        $total = 0;

        if ($request->nama) {

            foreach ($request->nama as $i => $nama) {

                $penginapan = (int)$request->penginapan[$i];
                $uang_harian = (int)$request->uang_harian[$i];
                $uang_representasi = (int)$request->uang_representasi[$i];
                $transportasi = (int)$request->transportasi[$i];
                $tiket = (int)$request->tiket[$i];

                $jumlah =
                    $penginapan +
                    $uang_harian +
                    $uang_representasi +
                    $transportasi +
                    $tiket;

                $total += $jumlah;

                $items[] = (object)[

                    'nama' => $nama,
                    'nip' => $request->nip[$i],
                    'jabatan' => $request->jabatan[$i],
                    'pangkat' => $request->pangkat[$i],
                    'lama_hari' => $request->lama_hari[$i],

                    'penginapan' => $penginapan,
                    'uang_harian' => $uang_harian,
                    'uang_representasi' => $uang_representasi,
                    'transportasi' => $transportasi,
                    'tiket' => $tiket,

                    'jumlah' => $jumlah

                ];
            }
        }

        $pptkpegawai = Pegawai::where('nama', $request->pptk)->first();
        $nip_pptk = $pptkpegawai ? $pptkpegawai->nip : '';

        $data = [

            'dalam_rangka' => $request->dalam_rangka,

            'tanggal_mulai' =>
            Carbon::parse($request->tanggal_mulai)
                ->translatedFormat('d F Y'),

            'tanggal_selesai' =>
            Carbon::parse($request->tanggal_selesai)
                ->translatedFormat('d F Y'),

            'items' => $items,

            'total' => $total,

            'pengguna_anggaran' => 'I Made Dwi Adnyana, S.STP., M.A.P',

            'nip_pengguna_anggaran' => '197612281996011001',

            'pptk' => $request->pptk,

            'nip_pptk' => $nip_pptk,

            'yang_menerima' => $request->yang_menerima,

            'nip_penerima' => $request->nip_penerima,

            'tanggal_cetak' =>
            Carbon::now()
                ->translatedFormat('d F Y')
        ];


        return Pdf::loadView(
            'pages.spj.export.daftar-penerimaan',
            $data
        )
            ->setPaper('A4', 'landscape')
            ->stream('daftar-penerimaan.pdf');
    }
}
