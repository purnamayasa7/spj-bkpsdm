@extends('layouts.app')

@section('content')
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Edit Data SPJ</h1>
        <a href="/spj" class="btn btn-outline-secondary btn-sm">
            <i class="fas fa-arrow-left"></i> Kembali
        </a>
    </div>

    <div class="card shadow mb-4">
        <div class="card-body">
            <form id="formSpj" action="{{ route('spj.update', $spj->id) }}" method="POST" enctype="multipart/form-data">
                @csrf

                <h5 class="mb-3 text-primary">Data SPJ</h5>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label>ID SPJ</label>
                        <input type="text" name="id" class="form-control" value="{{ $spj->id }}" readonly>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label>Bidang</label>
                        <input type="text" name="bidang" class="form-control" value="{{ $spj->bidang }}">
                    </div>

                    <div class="col-md-6 mb-3">
                        <label>Jenis</label>
                        <input type="text" name="jenis" class="form-control" value="{{ $spj->jenis }}">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label>PPTK</label>
                        <input type="text" name="pptk" class="form-control" value="{{ $spj->pptk }}">
                    </div>

                    <div class="col-md-6 mb-3">
                        <label>Kegiatan</label>
                        <input type="text" name="kegiatan" class="form-control" value="{{ $spj->kegiatan }}">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label>Belanja</label>
                        <input type="text" name="belanja" class="form-control" value="{{ $spj->belanja }}">
                    </div>

                    <div class="col-md-6 mb-3">
                        <label>Nilai</label>
                        <input type="number" name="nilai" class="form-control" value="{{ $spj->nilai }}">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label>Sumber Dana</label>
                        <input type="text" name="sumber_dana" class="form-control" value="{{ $spj->sumber_dana }}">
                    </div>

                    <div class="col-md-6 mb-3">
                        <label>Tanggal SPJ</label>
                        <input type="date" name="tanggal_spj" class="form-control" value="{{ $spj->tanggal_spj }}">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label>Tanggal Terima SPJ</label>
                        <input type="date" name="tanggal_terima_spj" class="form-control"
                            value="{{ $spj->tanggal_terima_spj }}">
                    </div>

                    <div class="col-md-12 mb-3">
                        <label>Kelengkapan SPK</label>
                        <textarea name="kelengkapan_spk" class="form-control" rows="3">{{ $spj->kelengkapan_spk }}</textarea>
                    </div>

                    <div class="col-md-12 mb-3">
                        <label>Keterangan</label>
                        <textarea name="keterangan" class="form-control" rows="3">{{ $spj->keterangan }}</textarea>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label>Status SPJ</label>
                        <input type="text" name="status" class="form-control" value="{{ $spj->status }}" readonly>
                    </div>
                </div>

                <hr>

                {{-- Kelengkapan Dokumen --}}
                <h5 class="mb-3 text-primary">Kelengkapan Dokumen</h5>

                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead class="thead-light">
                            <tr>
                                <th style="width: 5%">No</th>
                                <th style="width: 20%">Nama Dokumen</th>
                                <th style="width: 15%">Status</th>
                                <th style="width: 20%">Alasan</th>
                                <th style="width: 15%">File Saat Ini</th>
                                <th style="width: 25%">Upload Ulang</th>
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
                                    <td>
                                        <label class="form-check-label ms-2">{{ $file->alasan }}</label>
                                    </td>

                                    <td>
                                        @if ($file->file_path)
                                            <a href="{{ Storage::url($file->file_path) }}" target="_blank"
                                                class="btn btn-sm btn-success">
                                                <i class="fas fa-file-pdf"></i> Lihat PDF
                                            </a>
                                        @else
                                            <span class="text-muted">Tidak ada file</span>
                                        @endif
                                    </td>
                                    <td>
                                        <input type="file" accept="application/pdf*"
                                            name="kelengkapan[{{ $file->id }}][file_path]"
                                            class="form-control-file file-input" data-doc="{{ $file->nama_dokumen }}">
                                        <small class="text-danger d-none file-warning">
                                            Ukuran file PDF melebihi dari 2 MB.
                                        </small>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                @if ($spj->status !== 'Disetujui')
                    <hr>
                    <h5 class="mt-4 text-primary">Tambah Dokumen Baru (Jika Dibutuhkan)</h5>
                    <p class="text-muted">Pilih dokumen baru dan upload file PDF.</p>

                    <div id="dokumenBaruContainer">
                        <div class="row mb-3 dokumenBaruItem">
                            <div class="col-md-5">
                                <select name="nama_dokumen_baru[]" class="form-control" required>
                                    <option value="">-- Pilih Dokumen --</option>
                                    @foreach ($dokumens as $dok)
                                        <option value="{{ $dok }}">{{ $dok }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-4">
                                <input type="file" name="dokumen_baru[]" class="form-control file-input"
                                    accept="application/pdf*" data-doc="Dokumen Baru" required>
                            </div>
                            <div class="col-md-2">
                                <button type="button" class="btn btn-danger removeDokumenBaru">
                                    <i class="fas fa-trash-alt"></i> Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                    <button type="button" id="addDokumenBaru" class="btn btn-sm btn-success mt-2">
                        <i class="fas fa-plus"></i> Tambah Dokumen
                    </button>
                @endif

                <div class="text-right mt-3">
                    <button id="btnSimpan" type="button" class="btn btn-primary">
                        <i class="fas fa-save"></i> Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {

            const MAX_SIZE = 2 * 1024 * 1024;
            const fileInputs = document.querySelectorAll('.file-input');
            const btn = document.getElementById('btnSimpan');
            const form = document.getElementById('formSpj');

            // Warning Files > 2 MB
            document.addEventListener('change', function(e) {
                if (!e.target.classList.contains('file-input')) return;

                const warning = e.target.nextElementSibling;

                if (!e.target.files.length) {
                    warning.classList.add('d-none');
                    return;
                }

                if (e.target.files[0].size > MAX_SIZE) {
                    warning.classList.remove('d-none');
                } else {
                    warning.classList.add('d-none');
                }
            });


            btn.addEventListener('click', function(e) {
                e.preventDefault();

                // Validasi field wajib
                const requiredFields = [
                    'bidang', 'jenis', 'pptk', 'kegiatan',
                    'belanja', 'nilai', 'sumber_dana',
                    'tanggal_spj', 'tanggal_terima_spj'
                ];

                for (const field of requiredFields) {
                    const el = document.querySelector(`[name="${field}"]`);
                    if (el && !el.value.trim()) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Field belum lengkap!',
                            text: `Mohon isi bagian "${field}" terlebih dahulu.`,
                        });
                        return;
                    }
                }

                // Validasi file > 2 MB
                let largeFiles = [];

                document.querySelectorAll('.file-input').forEach(input => {
                    if (input.files.length && input.files[0].size > MAX_SIZE) {
                        largeFiles.push(input.dataset.doc || 'Dokumen');
                    }
                });

                if (largeFiles.length > 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'File melebihi 2 MB',
                        html: `
                <p>Dokumen berikut melebihi batas ukuran:</p>
                <ul style="text-align:left">
                    ${largeFiles.map(f => `<li>${f}</li>`).join('')}
                </ul>
                <p>Silakan unggah ulang dokumen.</p>
            `,
                        confirmButtonText: 'Tutup',
                        confirmButtonColor: '#3085d6'
                    });
                    return;
                }

                // Konfirmasi update
                Swal.fire({
                    title: 'Konfirmasi Update SPJ',
                    text: 'Apakah Anda yakin ingin menyimpan perubahan ini?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Ya, simpan perubahan!',
                    cancelButtonText: 'Batal',
                    reverseButtons: true
                }).then(result => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: 'Memproses...',
                            text: 'Perubahan sedang disimpan.',
                            icon: 'success',
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            timer: 1500,
                            didClose: () => form.submit()
                        });
                    }
                });
            });
        });


        document.addEventListener('DOMContentLoaded', function() {
            const container = document.getElementById('dokumenBaruContainer');
            const addButton = document.getElementById('addDokumenBaru');

            addButton?.addEventListener('click', function() {
                const firstItem = container.querySelector('.dokumenBaruItem');
                const newItem = firstItem.cloneNode(true);
                newItem.querySelector('select').value = '';
                newItem.querySelector('input[type=file]').value = '';
                container.appendChild(newItem);
            });

            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('removeDokumenBaru')) {
                    const items = container.querySelectorAll('.dokumenBaruItem');
                    if (items.length > 1) {
                        e.target.closest('.dokumenBaruItem').remove();
                    }
                }
            });
        });
    </script>
@endsection
