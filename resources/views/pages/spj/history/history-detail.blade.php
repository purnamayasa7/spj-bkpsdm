@extends('layouts.app')

@section('content')
    <div class="container-fluid">

        {{-- Header --}}
        <div class="card shadow mb-4">
            <div class="card-body">
                <h5 class="mb-1"><strong>Detail Riwayat SPJ</strong></h5>
                <small class="text-muted">ID SPJ: {{ $spj->id }}</small>
                <hr>
                <div class="row">
                    <div class="col-md-6">
                        <strong>Bidang:</strong> {{ $spj->bidang }} <br>
                        <strong>PPTK:</strong> {{ $spj->pptk }} <br>
                        <strong>Kegiatan:</strong> {{ $spj->kegiatan }}
                    </div>
                    <div class="col-md-6">
                        <strong>Nilai:</strong> Rp {{ number_format($spj->nilai, 0, ',', '.') }} <br>
                        <strong>Status Saat Ini:</strong>
                        @if ($spj->status === 'Dikirim')
                            <span class="badge bg-success text-white px-3 py-2">Dikirim</span>
                        @elseif ($spj->status === 'Dikoreksi')
                            <span class="badge bg-warning text-dark px-3 py-2">Dikoreksi</span>
                        @elseif ($spj->status === 'Disetujui')
                            <span class="badge bg-primary text-white px-3 py-2">Disetujui</span>
                        @elseif ($spj->status === 'Ditolak')
                            <span class="badge bg-danger text-white px-3 py-2">Ditolak</span>
                        @else
                            <span class="badge bg-secondary text-white px-3 py-2">{{ $spj->status }}</span>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        {{-- Timeline --}}
        <div class="card shadow">
            <div class="card-body">
                <ul class="timeline list-unstyled">
                    @foreach ($histories as $history)
                        <li class="mb-4">
                            <div class="d-flex">
                                <div class="me-3">
                                    @php
                                        $color = match ($history->aksi) {
                                            'Create' => 'success',
                                            'Update' => 'warning',
                                            'Approve' => 'primary',
                                            'Reject' => 'danger',
                                            default => 'primary',
                                        };
                                    @endphp

                                    <span
                                        class="badge bg-{{ $color }} text-white rounded-circle d-flex align-items-center justify-content-center"
                                        style="width:30px;height:30px;margin-right: 10px;">
                                        {{ $loop->iteration }}
                                    </span>
                                </div>
                                <div>
                                    <strong>{{ $history->aksi }}</strong>
                                    <div class="text-muted small">
                                        {{ $history->created_at->format('d-m-Y H:i') }}
                                        • oleh {{ $history->actor->name ?? '-' }}
                                        ({{ $history->actor_role }})
                                    </div>

                                    <div class="mt-2">
                                        <div>
                                            <span class="badge bg-light text-dark">
                                                {{ $history->status_sebelum ?? '-' }}
                                            </span>
                                            →
                                            <span class="badge bg-info text-white">
                                                {{ $history->status_sesudah ?? '-' }}
                                            </span>
                                        </div>

                                        @if ($history->keterangan)
                                            <div class="mt-2 text-muted">
                                                <i class="fas fa-comment-dots"></i>
                                                {{ $history->keterangan }}
                                            </div>
                                        @endif
                                    </div>
                                </div>
                            </div>
                            <hr>
                        </li>
                    @endforeach
                </ul>
            </div>
        </div>

        {{-- Back --}}
        <div class="mt-3">
            <a href="{{ url()->previous() }}" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i> Kembali
            </a>
        </div>

    </div>
@endsection
