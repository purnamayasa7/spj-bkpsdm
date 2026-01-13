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
            <h1 class="h3 mb-0 text-gray-800">Data SPJ</h1>
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

        <!-- KANAN: AKSI -->
        <div class="col-md-4 d-flex justify-content-end align-items-center">

            <a href="/spj/create" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-2">
                <i class="fas fa-plus fa-sm text-white-50"></i> Buat SPJ
            </a>

            <div class="dropdown d-none d-sm-inline-block">
                <button class="btn btn-sm btn-success shadow-sm dropdown-toggle" type="button" id="exportDropdown"
                    data-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-download fa-sm text-white-50"></i> Export
                </button>

                <div class="dropdown-menu dropdown-menu-right shadow fade" aria-labelledby="exportDropdown">

                    <a class="dropdown-item" href="#" data-toggle="modal" data-target="#filterModalPDF">
                        <i class="fas fa-file-pdf fa-sm fa-fw mr-2 text-danger"></i> PDF
                    </a>

                    <a class="dropdown-item" href="#" data-toggle="modal" data-target="#filterModalExcel">
                        <i class="fas fa-file-excel fa-sm fa-fw mr-2 text-success"></i> Excel
                    </a>
                </div>
            </div>

        </div>
    </div>

    <!-- Modal untuk Filter PDF -->
    <div class="modal fade" id="filterModalPDF" tabindex="-1" role="dialog" aria-labelledby="filterModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title" id="filterModalLabel">Pilih Rentang Tanggal</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span>&times;</span>
                    </button>
                </div>

                <form action="{{ route('spj.export.pdf') }}" method="GET" target="_blank">
                    <div class="modal-body">

                        <div class="form-group">
                            <label>Dari Tanggal:</label>
                            <input type="date" name="dariTanggal" class="form-control" required>
                        </div>

                        <div class="form-group">
                            <label>Sampai Tanggal:</label>
                            <input type="date" name="sampaiTanggal" class="form-control" required>
                        </div>

                        @if (Auth::user()->role_id == 1)
                            <div class="form-group">
                                <label>Bidang</label>
                                <select name="bidang" class="form-control">
                                    <option value="">Semua Bidang</option>
                                    <option value="PKA">PKA</option>
                                    <option value="PKAP">PKAP</option>
                                    <option value="MP">MP</option>
                                    <option value="PPI">PPI</option>
                                    <option value="Sekretariat">Sekretariat</option>
                                </select>
                            </div>
                        @endif

                        <div class="form-group">
                            <label>Status SPJ</label>
                            <select name="status" class="form-control">
                                <option value="">Semua Status</option>
                                <option value="Dikirim">Dikirim</option>
                                <option value="Dikoreksi">Dikoreksi</option>
                                <option value="Disetujui">Disetujui</option>
                                <option value="Ditolak">Ditolak</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary">Export PDF</button>
                    </div>

                </form>
            </div>
        </div>
    </div>

    <!-- Modal untuk Filter Excel -->
    <div class="modal fade" id="filterModalExcel" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">

            <form action="{{ route('spj.export.excel') }}" method="GET">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title">Pilih Rentang Tanggal</h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">

                        <label>Dari Tanggal:</label>
                        <input type="date" name="dariTanggal" class="form-control" required>

                        <label class="mt-2">Sampai Tanggal:</label>
                        <input type="date" name="sampaiTanggal" class="form-control" required>

                        @if (Auth::user()->role_id == 1)
                            <label class="mt-2">Bidang</label>
                            <select name="bidang" class="form-control">
                                <option value="">Semua Bidang</option>
                                <option value="PKA">PKA</option>
                                <option value="PKAP">PKAP</option>
                                <option value="MP">MP</option>
                                <option value="PPI">PPI</option>
                                <option value="Sekretariat">Sekretariat</option>
                            </select>
                        @endif

                        <label class="mt-2">Status SPJ:</label>
                        <select name="status" class="form-control">
                            <option value="">Semua Status</option>
                            <option value="Dikirim">Dikirim</option>
                            <option value="Dikoreksi">Dikoreksi</option>
                            <option value="Disetujui">Disetujui</option>
                            <option value="Ditolak">Ditolak</option>
                        </select>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-success">Export Excel</button>
                    </div>

                </div>
            </form>
        </div>
    </div>

    <script>
        function submitExport(type) {
            let form = document.getElementById('exportForm');
            let query = new URLSearchParams(new FormData(form)).toString();

            if (type === 'pdf') {
                window.location.href = "/spj/export/pdf?" + query;
            } else {
                window.location.href = "/spj/export/excel?" + query;
            }
        }
    </script>

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
                                    <td>{{ $item->tanggal_terima_spj ? date('d-m-Y', strtotime($item->tanggal_terima_spj)) : '-' }}</td>
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
                                            <a href="/spj/{{ $item->id }}"
                                                class="d-inline-block mr-2 btn btn-sm btn-info" title="Lihat SPJ">
                                                <i class="fas fa-eye"></i>
                                            </a>

                                            @if (in_array($item->status, ['Dikoreksi', 'Disetujui']))
                                                <a href="{{ url('/spj/' . $item->id . '/edit') }}"
                                                    class="d-inline-block mr-2 btn btn-sm btn-warning me-2"
                                                    title="Edit SPJ">
                                                    <i class="fas fa-pen"></i>
                                                </a>
                                            @else
                                                <button class="d-inline-block mr-2 btn btn-sm btn-secondary me-2" disabled
                                                    title="SPJ belum bisa diedit">
                                                    <i class="fas fa-pen"></i>
                                                </button>
                                            @endif

                                            <a href="{{ route('spj.downloadZip', $item->id) }}"
                                                class="btn btn-success btn-sm" title="Unduh Dokumen">
                                                <i class="fas fa-file-download"></i>
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
