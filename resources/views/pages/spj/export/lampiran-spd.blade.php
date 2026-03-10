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
            text-align: left;
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
    </style>
</head>

<body>
    <div class="header">
        Lampiran SPD <br>
        Nomor : {{ $nomor_lampiran }}, Tanggal {{ $tanggal_lampiran }}
    </div>

    <br>

    <table>
        <tr>
            <td width="30%">Daftar Peserta Kegiatan</td>
            <td width="70%">: {{ $daftar_peserta }}</td>
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
            @foreach ( as )
                
            @endforeach
        </tbody>
    </table>
    
</body>

</html>
