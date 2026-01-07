@extends('layouts.app')

@section('content')
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Review Data SPJ</h1>
        @if (Auth::user()->role_id === 1)
            <a href="{{ route('spj.keuangan.index') }}" class="btn btn-outline-secondary btn-sm" style="margin-right: 10px">
                <i class="fas fa-arrow-left"></i> Kembali
            </a>
        @elseif (Auth::user()->role_id === 2)
            <a href="{{ route('spj.index') }}" class="btn btn-outline-secondary btn-sm" style="margin-right: 10px">
                <i class="fas fa-arrow-left"></i> Kembali
            </a>
        @endif

    </div>

    <form id="formReview" method="POST" action="{{ route('spj.keuangan.review.submit', $spj->id) }}">
        @csrf

        {{-- Hidden Input --}}
        <input type="hidden" name="action_type" id="action_type">
        <input type="hidden" name="alasan_penolakan" id="alasan_penolakan">


        <div class="card shadow mb-4">
            <div class="card-body">

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
                        <textarea class="form-control" rows="3" name="keterangan">{{ $spj->keterangan }}</textarea>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label>Status Saat Ini</label>
                        <input type="text" class="form-control" value="{{ $spj->status }}" readonly>
                    </div>
                </div>

                <hr>

                <h5 class="mb-3 text-primary">Kelengkapan Dokumen</h5>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead class="thead-light">
                            <tr>
                                <th>No</th>
                                <th>Nama Dokumen</th>
                                <th>Status</th>
                                <th>Alasan (jika dikoreksi)</th>
                                <th>Lihat PDF</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($kelengkapan as $index => $file)
                                <tr>
                                    <td>{{ $index + 1 }}</td>
                                    <td>{{ $file->nama_dokumen }}</td>
                                    <td class="text-center">
                                        <select name="status[{{ $file->id }}]" class="form-control"
                                            style="width: 130px; margin: 0 auto;">

                                            <option value="Valid" {{ $file->status === 'Valid' ? 'selected' : '' }}>Valid
                                            </option>
                                            <option value="Tidak Valid" {{ $file->status !== 'Valid' ? 'selected' : '' }}>
                                                Tidak Valid</option>
                                        </select>
                                    </td>

                                    <td>
                                        <textarea name="alasan_{{ $file->id }}" class="form-control" rows="2">{{ $file->alasan }}</textarea>
                                    </td>
                                    <td>
                                        @if ($file->file_path)
                                            <a href="{{ route('spj.file.view', $file->id) }}" target="_blank"
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

                <div class="text-right mt-3">
                    <button type="button" id="btnTolak" class="btn btn-danger">
                        <i class="fas fa-times"></i> Tolak SPJ
                    </button>
                    <button type="button" id="btnSimpan" class="btn btn-primary">
                        <i class="fas fa-save"></i> Simpan
                    </button>
                </div>
            </div>
        </div>
    </form>

    <script>
        document.querySelectorAll('.status-select').forEach(select => {
            const updateColor = (el) => {
                if (el.value === 'Valid') {
                    el.style.backgroundColor = '#d1e7dd'; // hijau muda
                    el.style.color = '#0f5132';
                } else {
                    el.style.backgroundColor = '#f8d7da'; // merah muda
                    el.style.color = '#842029';
                }
            };
            updateColor(select); // set warna awal
            select.addEventListener('change', e => updateColor(e.target));
        });
    </script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const btn = document.getElementById('btnSimpan');
            const btnTolak = document.getElementById('btnTolak');
            const form = document.getElementById('formReview');

            btn.addEventListener('click', function(e) {
                Swal.fire({
                    title: 'Anda yakin sudah mereview SPJ?',
                    text: "Pastikan semua data sudah direview sebelum disimpan.",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Ya, simpan!',
                    cancelButtonText: 'Batal',
                    reverseButtons: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33'
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: 'Menyimpan...',
                            text: 'SPJ sedang diproses, mohon tunggu.',
                            icon: 'success',
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            timer: 1500,
                            didClose: () => form.submit()
                        });
                    }
                });
            });

            btnTolak.addEventListener('click', function() {
                Swal.fire({
                    title: 'Tolak SPJ',
                    text: 'Silakan isi alasan penolakan SPJ',
                    icon: 'warning',
                    input: 'textarea',
                    inputPlaceholder: 'Masukkan alasan penolakan SPJ...',
                    inputAttributes: {
                        'aria-label': 'Alasan Penolakan'
                    },
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Alasan penolakan wajib diisi!';
                        }
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Tolak SPJ',
                    cancelButtonText: 'Batal',
                    confirmButtonColor: '#d33',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        document.getElementById('action_type').value = 'tolak';
                        document.getElementById('alasan_penolakan').value = result.value;

                        Swal.fire({
                            title: 'Memproses...',
                            text: 'SPJ sedang ditolak',
                            icon: 'success',
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            timer: 1200,
                            didClose: () => form.submit()
                        });
                    }
                });
            });
        });
    </script>
@endsection
