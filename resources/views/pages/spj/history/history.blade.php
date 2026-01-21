@extends('layouts.app')

@section('content')
    <style>
        .dots::after {
            content: '';
            animation: dots 1.5s steps(4, end) infinite;
        }

        @keyframes dots {

            0%,
            20% {
                content: '';
            }

            40% {
                content: '.';
            }

            60% {
                content: '..';
            }

            80%,
            100% {
                content: '...';
            }
        }
    </style>

    <!-- Page Heading -->
    <div id="loadingText" style="text-align: center; padding: 20px; font-size: 16px; color: #555;">
        <div class="spinner-border text-secondary" role="status"
            style="width: 1.5rem; height: 1.5rem; vertical-align: middle;">
        </div>
        <span class="ms-2">Memuat data</span><span class="dots"></span>
    </div>

    <div class="row align-items-center mb-4">

        <!-- KIRI: JUDUL -->
        <div class="col-md-4 text-left">
            <h1 class="h3 mb-0 text-gray-800">Riwayat SPJ</h1>
        </div>

        <!-- TENGAH: PERIODE -->
        <div class="col-md-4 d-flex justify-content-center">
            <div class="form-inline">
                <label class="mr-2 font-weight-bold text-muted">Periode Tahun</label>

                <select class="form-control form-control-sm"
                    onchange="window.location.href='{{ request()->fullUrlWithQuery(['year' => '__YEAR__']) }}'.replace('__YEAR__', this.value)">
                    <option value="2025" {{ $year == 2025 ? 'selected' : '' }}>2025</option>
                    <option value="2026" {{ $year == 2026 ? 'selected' : '' }}>2026</option>
                </select>
            </div>
        </div>
    </div>

    {{-- Table --}}
    <div class="row">
        <div class="col">
            <div class="card shadow">
                <div class="card-body">
                    <table id="spjTable" class="table table-responsive table-bordered table-hovered"
                        style="font-size: 0.877rem; display:none;">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Bidang</th>
                                <th>Jenis</th>
                                <th>PPTK</th>
                                <th>Kegiatan</th>
                                <th>Belanja</th>
                                <th>Nilai</th>
                                <th>Sumber Dana</th>
                                <th>Tanggal SPJ</th>
                                <th style="display: none;">Created At</th>
                                <th>Tgl Terima SPJ</th>
                                <th>Keterangan</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($spj as $item)
                                <tr>
                                    <td>{{ $item->id }}</td>
                                    <td>{{ $item->bidang }}</td>
                                    <td>{{ $item->jenis }}</td>
                                    <td>{{ $item->pptk }}</td>
                                    <td>{{ $item->kegiatan }}</td>
                                    <td>{{ $item->belanja }}</td>
                                    <td>{{ number_format($item->nilai, 0, ',', '.') }}</td>
                                    <td>{{ $item->sumber_dana }}</td>
                                    <td>{{ $item->tanggal_spj ? date('d-m-Y', strtotime($item->tanggal_spj)) : '-' }}</td>
                                    <td style="display: none;">{{ $item->created_at }}</td>
                                    <td>{{ $item->tanggal_terima_spj ? date('d-m-Y', strtotime($item->tanggal_terima_spj)) : '-' }}
                                    </td>
                                    <td>{{ $item->keterangan }}</td>
                                    <td class="text-center">
                                        @if ($item->status === 'Dikirim')
                                            <span class="badge bg-success text-white px-3 py-2">Dikirim</span>
                                        @elseif ($item->status === 'Dikoreksi')
                                            <span class="badge bg-warning text-dark px-3 py-2">Dikoreksi</span>
                                        @elseif ($item->status === 'Disetujui')
                                            <span class="badge bg-primary text-white px-3 py-2">Disetujui</span>
                                        @elseif ($item->status === 'Ditolak')
                                            <span class="badge bg-danger text-white px-3 py-2">Ditolak</span>
                                        @else
                                            <span
                                                class="badge bg-secondary text-white px-3 py-2">{{ $item->status }}</span>
                                        @endif
                                    </td>
                                    <td>
                                        <div class="d-flex">
                                            <a href="{{ route('spj.history.show', $item->id) }}"
                                                class="btn btn-sm btn-info" title="Lihat History SPJ">
                                                <i class="fas fa-history"></i>
                                            </a>
                                        </div>
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
