@if ($errors->any())
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

@extends('layouts.app')

@section('content')
    <div class="container-fluid">

        <!-- Page Heading -->
        <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">Tambah Pegawai</h1>
            <a href="{{ url()->previous() }}" class="btn btn-outline-secondary btn-sm">
                <i class="fas fa-arrow-left"></i> Kembali
            </a>
        </div>

        {{-- Card Utama --}}
        <div class="row">
            <div class="col-12">
                <div class="card shadow mb-4">
                    <div class="card-body">
                        <form id="formRegister" method="POST" action="{{ route('keuangan.pegawai.store') }}">
                            @csrf
                            <div class="mb-3">
                                <label for="nip" class="form-label">NIP</label>
                                <input type="text" name="nip" id="nip" maxlength="18" class="form-control"
                                    placeholder="Masukkan NIP Anda" required value="{{ old('nip') }}">
                            </div>

                            <div class="mb-3">
                                <label for="nama" class="form-label">Nama Lengkap</label>
                                <input type="text" name="nama" id="nama" class="form-control"
                                    placeholder="Masukkan nama lengkap beserta gelar" required value="{{ old('nama') }}">
                            </div>

                            <div class="mb-3">
                                <label for="jabatan" class="form-label">Jabatan</label>
                                <input type="text" name="jabatan" id="jabatan" class="form-control"
                                    placeholder="Masukkan Jabatan Lengkap" required value="{{ old('jabatan') }}">
                            </div>

                            <div class="mb-3">
                                <label for="golongan" class="form-label">Golongan</label>
                                <select name="golongan" id="golongan" class="form-control" required>
                                    <option value="">-- Pilih Golongan --</option>
                                    <option value="I/a" {{ old('golongan') == 'I/a' ? 'selected' : '' }}>I/a</option>
                                    <option value="I/b" {{ old('golongan') == 'I/b' ? 'selected' : '' }}>I/b</option>
                                    <option value="I/c" {{ old('golongan') == 'I/c' ? 'selected' : '' }}>I/c</option>
                                    <option value="I/d" {{ old('golongan') == 'I/d' ? 'selected' : '' }}>I/d</option>
                                    <option value="II/a" {{ old('golongan') == 'II/a' ? 'selected' : '' }}>II/a</option>
                                    <option value="II/b" {{ old('golongan') == 'II/b' ? 'selected' : '' }}>II/b</option>
                                    <option value="II/c" {{ old('golongan') == 'II/c' ? 'selected' : '' }}>II/c</option>
                                    <option value="II/d" {{ old('golongan') == 'II/d' ? 'selected' : '' }}>II/d</option>
                                    <option value="III/a" {{ old('golongan') == 'III/a' ? 'selected' : '' }}>III/a
                                    </option>
                                    <option value="III/b" {{ old('golongan') == 'III/b' ? 'selected' : '' }}>III/b
                                    </option>
                                    <option value="III/c" {{ old('golongan') == 'III/c' ? 'selected' : '' }}>III/c
                                    </option>
                                    <option value="III/d" {{ old('golongan') == 'III/d' ? 'selected' : '' }}>III/d
                                    </option>
                                    <option value="IV/a" {{ old('golongan') == 'IV/a' ? 'selected' : '' }}>IV/a</option>
                                    <option value="IV/b" {{ old('golongan') == 'IV/b' ? 'selected' : '' }}>IV/b</option>
                                    <option value="IV/c" {{ old('golongan') == 'IV/c' ? 'selected' : '' }}>IV/c</option>
                                    <option value="IV/d" {{ old('golongan') == 'IV/d' ? 'selected' : '' }}>IV/d</option>
                                    <option value="IV/e" {{ old('golongan') == 'IV/e' ? 'selected' : '' }}>IV/e</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="pangkat" class="form-label">Pangkat</label>
                                <input type="text" name="pangkat" id="pangkat" class="form-control" readonly>
                            </div>

                            <div class="mb-3">
                                <label for="bidang" class="form-label">Bidang</label>
                                <select name="bidang" id="bidang" class="form-control" required>
                                    <option value="">-- Pilih Bidang --</option>
                                    <option value="PKA" {{ old('bidang') == 'PKA' ? 'selected' : '' }}>PKA</option>
                                    <option value="PKAP" {{ old('bidang') == 'PKAP' ? 'selected' : '' }}>PKAP</option>
                                    <option value="PPI" {{ old('bidang') == 'PPI' ? 'selected' : '' }}>PPI</option>
                                    <option value="MP" {{ old('bidang') == 'MP' ? 'selected' : '' }}>MP</option>
                                    <option value="Sekretariat" {{ old('bidang') == 'Sekretariat' ? 'selected' : '' }}>
                                        Sekretariat</option>
                                </select>
                            </div>

                            <div class="d-flex justify-content-end">
                                <button id="btnSimpan" type="button" class="btn btn-primary px-4">
                                    <i class="fas fa-save me-2"></i> Daftar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- pastikan SweetAlert2 sudah dimuat sebelum skrip ini -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function() {

            /* ===============================
             * ELEMENTS
             * =============================== */
            const form = document.getElementById('formRegister');
            const btnSimpan = document.getElementById('btnSimpan');

            const el = {
                nip: document.getElementById('nip'),
                golongan: document.getElementById('golongan'),
                pangkat: document.getElementById('pangkat'),
            };

            /* ===============================
             * PANGKAT MAP
             * =============================== */
            const pangkatMap = {
                'I/a': 'Juru Muda',
                'I/b': 'Juru Muda Tingkat I',
                'I/c': 'Juru',
                'I/d': 'Juru Tingkat I',

                'II/a': 'Pengatur Muda',
                'II/b': 'Pengatur Muda Tingkat I',
                'II/c': 'Pengatur',
                'II/d': 'Pengatur Tingkat I',

                'III/a': 'Penata Muda',
                'III/b': 'Penata Muda Tingkat I',
                'III/c': 'Penata',
                'III/d': 'Penata Tingkat I',

                'IV/a': 'Pembina',
                'IV/b': 'Pembina Tingkat I',
                'IV/c': 'Pembina Utama Muda',
                'IV/d': 'Pembina Utama Madya',
                'IV/e': 'Pembina Utama',
            };

            /* ===============================
             * EVENT: GOLONGAN CHANGE
             * =============================== */
            el.golongan.addEventListener('change', function() {
                el.pangkat.value = pangkatMap[this.value] ?? '';
            });

            /* ===============================
             * EVENT: SIMPAN
             * =============================== */
            btnSimpan.addEventListener('click', function(e) {
                e.preventDefault();

                const nip = el.nip.value.trim();

                if (!nip) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'NIP wajib diisi',
                    });
                    return;
                }

                checkNipUser(nip);
            });

            /* ===============================
             * CHECK NIP KE USER
             * =============================== */
            function checkNipUser(nip) {
                fetch("{{ route('keuangan.pegawai.check-nip-user') }}", {
                        method: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': '{{ csrf_token() }}',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            nip
                        }),
                    })
                    .then(res => {
                        if (!res.ok) throw new Error('Server error');
                        return res.json();
                    })
                    .then(res => {
                        if (res.exists) {
                            showNipExistsModal(res.data);
                        } else {
                            confirmSubmit();
                        }
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal memeriksa NIP',
                            text: 'Silakan coba beberapa saat lagi.',
                        });
                    });
            }

            /* ===============================
             * MODAL: NIP SUDAH ADA
             * =============================== */
            function showNipExistsModal(data) {
                Swal.fire({
                    icon: 'warning',
                    title: 'NIP ini sudah ada pada data User!',
                    html: `
                <div class="text-left">
                    <p><strong>NIP:</strong> ${data.nip}</p>
                    <p><strong>Nama:</strong> ${data.nama}</p>
                    <p><strong>Bidang:</strong> ${data.bidang}</p>
                    <hr>
                    <small>
                        User dengan NIP ini sudah terdaftar.
                        Jika Anda melanjutkan, sistem akan otomatis
                        menghubungkan user tersebut ke pegawai.
                    </small>
                </div>
            `,
                    showCancelButton: true,
                    confirmButtonText: 'Simpan',
                    cancelButtonText: 'Batal',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                }).then(result => {
                    if (result.isConfirmed) {
                        doSubmit();
                    }
                });
            }

            /* ===============================
             * KONFIRMASI SIMPAN
             * =============================== */
            function confirmSubmit() {
                Swal.fire({
                    title: 'Anda yakin membuat pegawai ini?',
                    text: 'Pastikan semua data sudah benar sebelum disimpan.',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Ya, simpan!',
                    cancelButtonText: 'Batal',
                    reverseButtons: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                }).then(result => {
                    if (result.isConfirmed) {
                        doSubmit();
                    }
                });
            }

            /* ===============================
             * SUBMIT FORM
             * =============================== */
            function doSubmit() {
                Swal.fire({
                    title: 'Menyimpan...',
                    html: 'Mohon tunggu',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                        form.submit();
                    },
                });
            }

        });
    </script>
@endsection
