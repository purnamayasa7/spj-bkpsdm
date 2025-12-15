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
        @foreach($spj as $row)
        <tr>
            <td>{{ $loop->iteration }}</td>
            <td>{{ $row->id }}</td>
            <td>{{ $row->bidang }}</td>
            <td>{{ $row->kegiatan }}</td>
            <td>{{ $row->nilai }}</td>
            <td>{{ $row->status }}</td>
            <td>{{ $row->tanggal_spj }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
