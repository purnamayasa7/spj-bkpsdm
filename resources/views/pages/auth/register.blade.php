@extends('layouts.app')

@section('content')
<div class="container-fluid">

    <!-- Page Heading -->
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Registrasi User</h1>
        <a href="/dashboard" class="btn btn-outline-secondary btn-sm">
            <i class="fas fa-arrow-left"></i> Kembali
        </a>
    </div>
    

    {{-- Card Utama --}}
    <div class="row">
        <div class="col-12">
            <div class="card shadow mb-4">
                <div class="card-body">
                    <form id="formRegister" method="POST" action="/register">
                        @csrf
                        <div class="mb-3">
                            <label for="nip" class="form-label">NIP</label>
                            <input type="text" name="nip" id="nip" maxlength="18"
                                   class="form-control"
                                   placeholder="Masukkan NIP Anda" required
                                   value="{{ old('nip') }}">
                        </div>

                        <div class="mb-3">
                            <label for="name" class="form-label">Nama Lengkap</label>
                            <input type="text" name="name" id="name"
                                   class="form-control"
                                   placeholder="Masukkan nama lengkap" required
                                   value="{{ old('name') }}">
                        </div>

                        <div class="mb-3">
                            <label for="email" class="form-label">Alamat Email</label>
                            <input type="email" name="email" id="email"
                                   class="form-control"
                                   placeholder="Masukkan email aktif" required
                                   value="{{ old('email') }}">
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label">Kata Sandi</label>
                            <input type="password" name="password" id="password"
                                   class="form-control"
                                   placeholder="Masukkan password" required>
                        </div>

                        <div class="mb-3">
                            <label for="vpassword" class="form-label">Verifikasi Kata Sandi</label>
                            <input type="password" name="vpassword" id="vpassword"
                                   class="form-control"
                                   placeholder="Masukkan password" required>
                        </div>

                        <div class="mb-3">
                            <label for="bidang">Bidang</label>
                            <select name="bidang" id="bidang" class="form-control" required>
                                <option value="">-- Pilih Bidang --</option>
                                <option value="PKA" {{ old('bidang') == 'PKA' ? 'selected' : '' }}>PKA</option>
                                <option value="PKAP" {{ old('bidang') == 'PKAP' ? 'selected' : '' }}>PKAP</option>
                                <option value="MP" {{ old('bidang') == 'MP' ? 'selected' : '' }}>MP</option>
                                <option value="PPI" {{ old('bidang') == 'PPI' ? 'selected' : '' }}>PPI</option>
                                <option value="Sekretariat" {{ old('bidang') == 'Sekretariat' ? 'selected' : '' }}>Sekretariat</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="role_id">Role</label>
                            <select name="role_id" id="role_id" class="form-control" required>
                                <option value="">-- Pilih Role --</option>
                                <option value="Keuangan" {{ old('role_id') == 'Keuangan' ? 'selected' : '' }}>Keuangan</option>
                                <option value="Bidang" {{ old('role_id') == 'Bidang' ? 'selected' : '' }}>Bidang</option>
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
document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('btnSimpan');
    const form = document.getElementById('formRegister');

    btn.addEventListener('click', function (e) {
        e.preventDefault();

        // Daftar field wajib diisi (ID harus sesuai elemen form)
        const requiredFields = ['nip','name','email','password','vpassword','role_id'];

        // Cek kosong
        for (const field of requiredFields) {
            const el = document.getElementById(field);
            if (!el) {
                console.warn('Element not found:', field);
                continue;
            }
            // trim only for text-like inputs
            const val = (el.value || '').toString().trim();
            if (!val) {
                const label = document.querySelector(`label[for="${field}"]`);
                Swal.fire({
                    icon: 'warning',
                    title: 'Field belum lengkap!',
                    text: `Mohon isi bagian "${label ? label.innerText : field}" terlebih dahulu.`,
                    confirmButtonColor: '#3085d6',
                });
                return;
            }
        }

        // Cek kecocokan password
        const pw = document.getElementById('password').value;
        const vpw = document.getElementById('vpassword').value;
        if (pw !== vpw) {
            Swal.fire({
                icon: 'error',
                title: 'Password tidak cocok',
                text: 'Pastikan password dan verifikasinya sesuai.',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        // Konfirmasi sebelum submit
        Swal.fire({
            title: 'Anda yakin membuat user ini?',
            text: "Pastikan semua data sudah benar sebelum disimpan.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, simpan!',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                // Tampilkan loading lalu submit
                Swal.fire({
                    title: 'Menyimpan...',
                    html: 'Mohon tunggu',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                        // Submit form sedikit delay agar loading muncul (opsional)
                        setTimeout(() => form.submit(), 400);
                    }
                });
            }
        });
    });
});
</script>
@endsection