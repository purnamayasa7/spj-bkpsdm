@extends('layouts.app')

@section('content')
<div class="container-fluid">
  <div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800">Ubah Password</h1>
    <a href="/dashboard" class="btn btn-outline-secondary btn-sm">
            <i class="fas fa-arrow-left"></i> Kembali
    </a>
  </div>

<div class="row">
  <div class="col-12">
    <div class="card shadow mb-4">
  <div class="card-body">

    <form id="formProfile" action="/change-password/{{ auth()->user()->id }}" method="POST">
      @csrf
        <div class="mb-3">
          <label for="old_password">Password Lama</label>
          <input type="password" name="old_password" id="old_password" class="form-control">
        </div>

        <div class="mb-3">
          <label for="new_password">Password Baru</label>
          <input type="password" name="new_password" id="new_password" class="form-control">
        </div>

      <div class="text-right">
        <button id="btnSimpan" type="button" class="btn btn-primary">
          <i class="fas fa-save"></i> Simpan Perubahan
        </button>
      </div>
    </form>
  </div>
</div>
  </div>
  
</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('btnSimpan');
    const form = document.getElementById('formProfile');

    btn.addEventListener('click', function (e) {
        e.preventDefault();

        const requiredFields = ['old_password', 'new_password'];
        let emptyField = null;

        for (const field of requiredFields) {
            const el = document.querySelector(`[name="${field}"]`);
            if (el && !el.value.trim()) {
                emptyField = field;
                break;
            }
        }

        if (emptyField) {
            Swal.fire({
                icon: 'warning',
                title: 'Field belum lengkap!',
                text: `Mohon isi bagian "${emptyField.replace('_', ' ')}" terlebih dahulu.`,
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        Swal.fire({
            title: 'Konfirmasi Ubah Password',
            text: "Apakah Anda yakin ingin menyimpan password baru?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, simpan!',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                form.submit(); // langsung kirim, biar backend yang validasi
            }
        });
    });

    // 🔹 SweetAlert dari backend
    @if (session('success'))
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: '{{ session('success') }}',
            confirmButtonColor: '#3085d6'
        });
    @elseif (session('error'))
        Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: '{{ session('error') }}',
            confirmButtonColor: '#d33'
        });
    @endif
});
</script>


@endsection
