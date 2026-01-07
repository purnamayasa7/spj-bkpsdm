<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td,
        th {
            border: 1px solid #000;
            padding: 4px;
            vertical-align: top;
        }

        .no-border td {
            border: none;
        }

        .checkbox {
            border: 1px solid #000;
            width: 13px;
            height: 13px;
            display: inline-block;
            text-align: center;
        }

        .center {
            text-align: center;
        }
    </style>
</head>

<body>

    <h3 class="center">CHECK LIST KELENGKAPAN DOKUMEN</h3>

    <table class="no-border">
        <tr>
            <td width="25%">ID SPJ</td>
            <td>{{ $spj->id }}</td>
        </tr>
        <tr>
            <td>Bidang</td>
            <td>{{ $spj->bidang }}</td>
        </tr>
        <tr>
            <td>Jenis SPJ</td>
            <td>{{ $spj->jenis }}</td>
        </tr>
        <tr>
            <td>PPTK</td>
            <td>{{ $spj->pptk }}</td>
        </tr>
        <tr>
            <td>Kegiatan</td>
            <td>{{ $spj->kegiatan }}</td>
        </tr>
        <tr>
            <td>Belanja</td>
            <td>{{ $spj->belanja }}</td>
        </tr>
        <tr>
            <td>Nilai</td>
            <td>Rp {{ number_format($spj->nilai, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td>Sumber Dana</td>
            <td>{{ $spj->sumber_dana }}</td>
        </tr>
    </table>

    <br>

    <table>
        <tr>
            <th width="50%">Tanggal SPJ: {{ $spj->tanggal_spj }}</th>
            <th>Tanggal Terima SPJ: {{ $spj->tanggal_terima_spj }}</th>
        </tr>
    </table>

    <br>

    <table>
        <tr>
            <th width="50%">KELENGKAPAN SPJ</th>
            <th>CATATAN</th>
        </tr>
        <tr>
        <td height="50%">
            <ol >
                @foreach ($spj->kelengkapans as $file)
                    <li>{{ $file->nama_dokumen }}</li>
                @endforeach
            </ol>
        </td>
            
            <td>
                {!! nl2br(e($spj->keterangan)) !!}
            </td>
        </tr>
    </table>

    <br>

    <table>
        <tr>
             <th colspan="3" style="text-align:center;">PARAF / TANGGAL</th>
        </tr>
        <tr>
            <th>VERIFIKASI</th>
            <th>TRANSFER</th>
            <th>OTORISASI</th>
        </tr>
        <tr>
            <td height="50px"></td>
            <td></td>
            <td></td>
        </tr>
    </table>

</body>

</html>
