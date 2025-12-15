@extends('layouts.app')

@section('content')
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Lihat Data SPJ</h1>

        <div class="d-flex gap-4">
            {{-- Tombol Kembali --}}
            @if (Auth::user()->role_id === 1)
                <a href="{{ route('spj.keuangan.index') }}" class="btn btn-outline-secondary btn-sm"
                    style="margin-right: 10px">
                    <i class="fas fa-arrow-left"></i> Kembali
                </a>
            @elseif (Auth::user()->role_id === 2)
                <a href="{{ route('spj.index') }}" class="btn btn-outline-secondary btn-sm" style="margin-right: 10px">
                    <i class="fas fa-arrow-left"></i> Kembali
                </a>
            @endif

            {{-- Tombol Koreksi (hanya muncul jika status = Dikoreksi & role = Bidang) --}}
            @if ($spj->status === 'Dikoreksi' && Auth::user()->role_id === 2)
                <a href="{{ route('spj.edit', $spj->id) }}" class="btn btn-warning btn-sm text-white">
                    <i class="fas fa-edit"></i> Koreksi
                </a>
            @elseif ($spj->status === 'Dikirim' && Auth::user()->role_id === 1)
                <a href="{{ route('spj.keuangan.review', $spj->id) }}" class="btn btn-warning btn-sm text-white">
                    <i class="fas fa-edit"></i> Review
                </a>
            @endif
        </div>
    </div>

    <div class="card shadow mb-4">
        <div class="card-body">
            {{-- =========================
        DATA SPJ UTAMA
    ========================== --}}
            <h5 class="mb-3 text-primary">Data SPJ</h5>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label>ID SPJ</label>
                    <input type="text" class="form-control" value="{{ $spj->id }}" readonly>
                </div>
                <div class="col-md-6 mb-3">
                    <label>Bidang</label>
                    <input type="text" class="form-control" value="{{ $spj->bidang }}" readonly>
                </div>

                <div class="col-md-6 mb-3">
                    <label>Jenis</label>
                    <input type="text" class="form-control" value="{{ $spj->jenis }}" readonly>
                </div>
                <div class="col-md-6 mb-3">
                    <label>PPTK</label>
                    <input type="text" class="form-control" value="{{ $spj->pptk }}" readonly>
                </div>

                <div class="col-md-6 mb-3">
                    <label>Kegiatan</label>
                    <input type="text" class="form-control" value="{{ $spj->kegiatan }}" readonly>
                </div>
                <div class="col-md-6 mb-3">
                    <label>Belanja</label>
                    <input type="text" class="form-control" value="{{ $spj->belanja }}" readonly>
                </div>

                <div class="col-md-6 mb-3">
                    <label>Nilai</label>
                    <input type="text" class="form-control" value="{{ number_format($spj->nilai, 0, ',', '.') }}"
                        readonly>
                </div>
                <div class="col-md-6 mb-3">
                    <label>Sumber Dana</label>
                    <input type="text" class="form-control" value="{{ $spj->sumber_dana }}" readonly>
                </div>

                <div class="col-md-6 mb-3">
                    <label>Tanggal SPJ</label>
                    <input type="text" class="form-control" value="{{ $spj->tanggal_spj }}" readonly>
                </div>
                <div class="col-md-6 mb-3">
                    <label>Tanggal Terima SPJ</label>
                    <input type="text" class="form-control" value="{{ $spj->tanggal_terima_spj }}" readonly>
                </div>

                <div class="col-md-12 mb-3">
                    <label>Kelengkapan SPK</label>
                    <textarea class="form-control" rows="3" readonly>{{ $spj->kelengkapan_spk }}</textarea>
                </div>

                <div class="col-md-12 mb-3">
                    <label>Keterangan</label>
                    <textarea class="form-control" rows="3" readonly>{{ $spj->keterangan }}</textarea>
                </div>

                <div class="col-md-6 mb-3">
                    <label>Status</label>
                    <input type="text" class="form-control" value="{{ $spj->status }}" readonly>
                </div>
            </div>

            <hr>

            {{-- =========================
        DOKUMEN KELENGKAPAN
    ========================== --}}
            <h5 class="mb-3 text-primary">Kelengkapan Dokumen</h5>

            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead class="thead-light">
                        <tr>
                            <th style="width: 5%">No</th>
                            <th style="width: 20%">Nama Dokumen</th>
                            <th style="width: 15%">Status</th>
                            <th style="width: 20%">Alasan</th>
                            <th style="width: 15%">Lihat PDF</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($kelengkapan as $index => $file)
                            <tr>
                                <td>{{ $index + 1 }}</td>
                                <td>{{ $file->nama_dokumen }}</td>
                                <td>
                                    @php
                                        $statusColor = match ($file->status) {
                                            'Valid' => 'bg-success',
                                            'Tidak Valid' => 'bg-danger',
                                            default => 'bg-secondary',
                                        };
                                    @endphp
                                    <span class="badge {{ $statusColor }} text-white">{{ $file->status }}</span>
                                </td>
                                <td>
                                    <label class="form-check-label ms-2">{{ $file->alasan }}</label>
                                </td>
                                <td>
                                    @php
                                        $folder = "/home/ppispj/spj_uploads/spj/{$spj->kode}";
                                        $files = is_dir($folder) ? glob($folder . '/*.pdf') : [];
                                    @endphp

                                    @if (!empty($files) && isset($files[$index]))
                                        <a href="{{ route('spj.pdf', [$spj->id, $index]) }}" target="_blank"
                                            class="btn btn-sm btn-success">
                                            <i class="fas fa-file-pdf"></i> Lihat PDF
                                        </a>
                                    @else
                                        <span class="text-muted">Tidak ada file</span>
                                    @endif
                                </td>

                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
@endsection
