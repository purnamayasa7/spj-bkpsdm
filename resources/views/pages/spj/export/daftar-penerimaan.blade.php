@extends('layouts.pdf')

@section('content')
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 11px;
        }

        .header {
            text-align: center;
        }

        .header img {
            width: 80px;
        }

        .title {
            font-weight: bold;
            text-align: center;
            margin-top: 10px;
            text-decoration: underline;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 4px;
            vertical-align: top;
        }

        th {
            text-align: center;
        }

        .no-border td {
            border: none;
        }

        .center {
            text-align: center;
        }

        .right {
            text-align: right;
        }
    </style>

    <div class="header">
        <img src="{{ public_path('logo.png') }}" alt="Logo">
        <div><strong>PEMERINTAH KABUPATEN BULELENG</strong></div>
        <div><strong>BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</strong></div>
        <div>Alamat: Jalan Laksamana (LC) Baktiseraga, Singaraja, Bali</div>
    </div>

    <hr>

    <div class="title">DAFTAR PENERIMAAN PERJALANAN DINAS</div>

    <p style="text-align:center;">
        Dalam Rangka {{ $dalam_rangka }} <br>
        Pada Tanggal {{ $tanggal_mulai }} s.d {{ $tanggal_selesai }}
    </p>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Jabatan</th>
                <th>Pangkat/Gol</th>
                <th>Lamanya Hari</th>
                <th colspan="5">Uang yang Diterima</th>
                <th>Jumlah</th>
                <th>Tanda Tangan</th>
            </tr>
            <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th>Penginapan</th>
                <th>Uang Harian</th>
                <th>Uang Representasi</th>
                <th>Transportasi</th>
                <th>Tiket</th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            @foreach ($items as $i => $row)
                <tr>
                    <td class="center">{{ $i + 1 }}</td>
                    <td>{{ $row->nama }}<br>NIP. {{ $row->nip }}</td>
                    <td>{{ $row->jabatan }}</td>
                    <td>{{ $row->pangkat }}</td>
                    <td class="center">{{ $row->lama_hari }}</td>
                    <td class="right">{{ number_format($row->penginapan, 0, ',', '.') }}</td>
                    <td class="right">{{ number_format($row->uang_harian, 0, ',', '.') }}</td>
                    <td class="right">{{ number_format($row->uang_representasi, 0, ',', '.') }}</td>
                    <td class="right">{{ number_format($row->transportasi, 0, ',', '.') }}</td>
                    <td class="right">{{ number_format($row->tiket, 0, ',', '.') }}</td>
                    <td class="right">{{ number_format($row->jumlah, 0, ',', '.') }}</td>
                    <td></td>
                </tr>
            @endforeach
            <tr>
                <td colspan="10" class="center"><strong>JUMLAH</strong></td>
                <td class="right"><strong>{{ number_format($total, 0, ',', '.') }}</strong></td>
                <td></td>
            </tr>
        </tbody>
    </table>

    <br><br>

    <table class="no-border">
        <tr>
            <td class="center">Mengetahui,<br>Pengguna
                Anggaran<br><br><br><strong>{{ $pengguna_anggaran }}</strong><br>NIP. {{ $nip_pengguna_anggaran }}</td>
            <td></td>
            <td class="center">Singaraja, {{ $tanggal_cetak }}<br>Yang
                Menerima<br><br><br><strong>{{ $yang_menerima }}</strong><br>NIP. {{ $nip_penerima }}</td>
        </tr>
        <tr>
            <td></td>
            <td class="center">PPTK Pengadaan, Pemberhentian dan
                Informasi<br><br><br><strong>{{ $pptk }}</strong><br>NIP. {{ $nip_pptk }}</td>
            <td></td>
        </tr>
    </table>
@endsection
