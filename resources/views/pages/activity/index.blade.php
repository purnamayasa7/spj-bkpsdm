@extends('layouts.app')

@section('content')
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Aktivitas User</h1>
    </div>

    <div class="row">
        <div class="col">
            <div class="card-shadow">
                <form method="GET" class="row g-3 mb-3">
                    <div class="col-md-3">
                        <label>Dari Tanggal</label>
                        <input type="date" name="date_from" class="form-control" value="{{ request('date_from') }}">
                    </div>

                    <div class="col-md-3">
                        <label>Sampai Tanggal</label>
                        <input type="date" name="date_to" class="form-control" value="{{ request('date_to') }}">
                    </div>

                    <div class="col-md-3 d-flex align-items-end">
                        <button class="btn btn-primary w-50">Tampilkan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col">
            <div class="card shadow">

                <div class="card-body">
                    <button class="btn btn-sm btn-success shadow-sm dropdown-toggle" type="button" id="exportDropdown"
                        data-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-download fa-sm text-white-50"></i> Export
                    </button>

                    <div class="dropdown-menu dropdown-menu-right shadow fade" aria-labelledby="exportDropdown">

                        <!-- Export PDF -->
                        <a class="dropdown-item" href="{{ route('activity.export.pdf', request()->query()) }}" target="_blank">
                            <i class="fas fa-file-pdf fa-sm fa-fw mr-2 text-danger"></i>
                            PDF
                        </a>

                        <!-- Export Excel -->
                        <a class="dropdown-item" href="{{ route('activity.export.excel', request()->query()) }}">
                            <i class="fas fa-file-excel fa-sm fa-fw mr-2 text-success"></i>
                            Excel
                        </a>
                    </div>


                    {{-- PESAN JIKA TIDAK ADA DATA --}}
                    @if ($activities->count() === 0)
                        <div class="alert alert-info">
                            Silakan filter tanggal lalu klik <b>Tampilkan</b>.
                        </div>
                    @endif

                    <table id="spjActivity" class="table table-bordered table-hover" style="width:100%;">
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
                                    <td>{{ $a->created_at->format('d-m-Y H:i') }}</td>
                                    <td>{{ $a->user->name }}</td>
                                    <td>{{ $a->bidang }}</td>
                                    <td>{{ ucfirst($a->action) }}</td>
                                    <td>{{ $a->description }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection
