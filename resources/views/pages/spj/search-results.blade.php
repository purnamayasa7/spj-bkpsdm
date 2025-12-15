@extends('layouts.app')

@section('content')

<style>
        .dots::after{
            content: '';
            animation: dots 1.5s steps(4, end) infinite;
        }

        @keyframes dots {
            0%, 20% {content: '';}
            40% {content: '.';}
            60% {content: '..';}
            80%, 100% {content: '...';}
        }
</style>

    <h4 class="mb-3">Hasil Pencarian: "{{ $query }}"</h4>

    @if ($spj->count() == 0)
        <div class="alert alert-warning">
            Tidak ada data SPJ yang cocok dengan pencarian.
        </div>
    @endif

    
    <div class="row">
        <div class="col">
            <div class="card shadow">
                <div class="card-body">

                    <table id="spjSearch" class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>ID SPJ</th>
                                <th>Bidang</th>
                                <th>Status</th>
                                <th>Tanggal SPJ</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            @foreach ($spj as $item)
                                <tr>
                                    <td>{{ $item->id }}</td>
                                    <td>{{ $item->bidang }}</td>
                                    <td>{{ $item->status }}</td>
                                    <td>{{ $item->tanggal_spj }}</td>
                                    <td>
                                        <a href="{{ route('spj.show', $item->id) }}" class="btn btn-sm btn-info">
                                            Lihat
                                        </a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection
