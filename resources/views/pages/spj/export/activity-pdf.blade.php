<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #333; padding: 6px; text-align: left; }
        th { background: #eee; }
    </style>
</head>
<body>

<h3>Laporan Aktivitas User</h3>

<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>User</th>
            <th>Bidang</th>
            <th>Aksi</th>
            <th>Deskripsi</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($activities as $index => $a)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $a->created_at->format('d-m-Y H:i') }}</td>
                <td>{{ $a->user->name }}</td>
                <td>{{ $a->bidang }}</td>
                <td>{{ ucfirst($a->action) }}</td>
                <td>{{ $a->description }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

</body>
</html>
