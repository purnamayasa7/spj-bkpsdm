<!DOCTYPE html>
<html>
<head>
    <title>Export PDF</title>
    <style>
        @page {
            margin: 50px 30px 50px 30px;
        }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #000; padding: 6px; }

        .pagenum::before{
            content: counter(page);
        }
    </style>
</head>
<body>
    <h3 style="text-align:center; font-size: 15px;">Laporan SPJ</h3>
    <h3 style="text-align:center; font-size: 15px;">Per tanggal: {{ $dariTanggal}} sd {{ $sampaiTanggal }}</h3>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>ID</th>
                <th>Bidang</th>
                <th>Kegiatan</th>
                <th>Nilai</th>
                <th>Status</th>
                <th>Tanggal SPJ</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($spj as $index => $row)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $row->id }}</td>
                <td>{{ $row->bidang }}</td>
                <td>{{ $row->kegiatan }}</td>
                <td>Rp {{ number_format($row->nilai, 0, ',', '.') }}</td>
                <td>{{ $row->status }}</td>
                <td>{{ $row->tanggal_spj }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div style="position: fixed; bottom: 0; right: 0; font-size: 12px;">
        Halaman <span class="pagenum"></span>
    </div>
</body>
</html>
