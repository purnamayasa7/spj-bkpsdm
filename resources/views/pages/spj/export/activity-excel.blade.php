<table>
    <thead>
        <tr>
            <th>Tanggal</th>
            <th>User</th>
            <th>Bidang</th>
            <th>Aksi</th>
            <th>Deskripsi</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($activities as $a)
            <tr>
                <td>{{ $a->created_at }}</td>
                <td>{{ $a->user->name }}</td>
                <td>{{ $a->bidang }}</td>
                <td>{{ $a->action }}</td>
                <td>{{ $a->description }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
