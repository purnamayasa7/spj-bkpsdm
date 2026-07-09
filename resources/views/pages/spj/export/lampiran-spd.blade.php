<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 11px;
        }

        .header {
            border: 1px solid #000;
            padding: 6px 10px;
            display: inline-block;
            font-size: 11px;
        }

        .header img {
            width: 60px;
        }

        .title-header {
            font-size: 14px;
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

        .no-border-table {
            border-collapse: collapse;
        }

        .no-border-table td,
        .no-border-table th {
            border: none;
            padding: 2px 4px;
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

        hr {
            border: 1px solid black;
        }

        .ttd {
            margin-left: auto;
            width: 250px;
        }

        .ttd td {
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="header">
        Lampiran SPD <br>
        Nomor : {{ $nomor_lampiran }}, Tanggal {{ $tanggal_lampiran }}
    </div>

    <br><br>

    <table class="no-border-table">
        <tr>
            <td width="20%">Daftar Peserta Kegiatan</td>
            <td width="80%">: {{ $daftar_peserta }}</td>
        </tr>
        <tr>
            <td>Tanggal Penyelenggaraan</td>
            <td>: {{ $tgl_penyelenggaraan }}</td>
        </tr>
        <tr>
            <td>Kota Tempat Penyelenggaraan</td>
            <td>: {{ $kota }}</td>
        </tr>
        <tr>
            <td>Satuan Kerja</td>
            <td>: {{ $satuan_kerja }}</td>
        </tr>
    </table>

    <br>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Pelaksana SPD/NIP</th>
                <th>Pangkat/Golongan</th>
                <th>Jabatan</th>
                <th>Tempat Kedudukan Asal</th>
                <th>Tingkat Biaya Perjalanan Dinas</th>
                <th>Alat Angkutan Yang Digunakan</th>
                <th colspan="2">Surat Tugas</th>
                <th colspan="2">Tanggal</th>
                <th>Lamanya Perjalanan</th>
                <th>Ket</th>
            </tr>

            <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th>Nomor</th>
                <th>Tanggal</th>
                <th>Keberangkatan Dari</th>
                <th>Tiba Kembali</th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            @foreach ($items as $i => $row)
                <tr>
                    <td class="center">{{ $i + 1 }}</td>
                    <td>
                        {{ $row->nama }}<br>
                        NIP. {{ $row->nip }}
                    </td>
                    <td>{{ $row->jabatan }}</td>
                    <td>{{ $row->pangkat }}</td>
                    <td class="center">{{ $row->tempat_kedudukan }}</td>
                    <td class="center">{{ number_format($row->tingkat_biaya, 0, ',', '.') }}</td>
                    <td class="center">{{ $row->alat_angkut }}</td>
                    <td class="center">{{ $row->no_surat_tugas }}</td>
                    <td class="center">{{ $row->tgl_surat_tugas }}</td>
                    <td class="center">{{ $row->tanggal_mulai }}</td>
                    <td class="center">{{ $row->tanggal_selesai }}</td>
                    <td class="center">{{ $row->lama_hari }}</td>
                    <td class="center">{{ $row->keterangan }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <br><br>

    <table class="no-border ttd">
        <tr>
            <td>
                Singaraja, {{ $tanggal_cetak }}
                <br>
                Pejabat Pembuat Komitmen
                <br><br><br><br>

                <strong>{{ $nama_kepala }}</strong>

                <br>

                NIP. {{ $nip_kepala }}
            </td>
        </tr>
    </table>
</body>

</html>
