@extends('layouts.app')

@section('content')
<div class="container-fluid">
  <div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800">Detail Profil</h1>
    <a href="/dashboard" class="btn btn-outline-secondary btn-sm">
            <i class="fas fa-arrow-left"></i> Kembali
    </a>
  </div>

@if ($errors->any())
  <div class="alert alert-danger">
    <ul>
      @foreach ($errors->all() as $error)
        <li>{{ $error }}</li>
      @endforeach
    </ul>
  </div>
@endif

<div class="row">
  <div class="col-12">
    <div class="card shadow mb-4">
  <div class="card-body">

    <form id="formProfile" action="/profile/{{ auth()->user()->id }}" method="POST">
      @csrf
        <div class="mb-3">
          <label>NIP</label>
          <input type="text" name="nip" class="form-control" value="{{ old('nip', auth()->user()->nip) }}" readonly>
        </div>

        <div class="mb-3">
          <label>Nama Lengkap</label>
          <input type="text" name="name" class="form-control" value="{{ old('name', auth()->user()->name) }}">
        </div>

        <div class="mb-3">
          <label>Email</label>
          <input type="email" name="email" class="form-control" value="{{ old('email', auth()->user()->email) }}">
        </div>

        <div class="mb-3">
          <label for="bidang">Bidang</label>
          <select name="bidang" id="bidang" class="form-control" value="{{ old('bidang', auth()->user()->bidang) }}">
            <option value="PKA" {{ auth()->user()->bidang == 'PKA' ? 'selected' : ''}} >PKA</option>
            <option value="PKAP" {{ auth()->user()->bidang == 'PKAP' ? 'selected' : ''}} >PKAP</option>
            <option value="MP" {{ auth()->user()->bidang == 'MP' ? 'selected' : ''}} >MP</option>
            <option value="PPI" {{ auth()->user()->bidang == 'PPI'? 'selected' : ''}} >PPI</option>
            <option value="Sekretariat">Sekretariat</option>
          </select></div>
     
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
    const form = document.getElementById('formProfile'); // Pastikan id form sesuai!

    btn.addEventListener('click', function (e) {
        e.preventDefault();

        // Field wajib (opsional bisa dikurangi)
        const requiredFields = [
            'nip',
            'name',
            'email',
            'bidang'
        ];

        // Validasi isi field
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
                text: `Mohon isi bagian "${emptyField}" terlebih dahulu.`,
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        // Konfirmasi sebelum update
        Swal.fire({
            title: 'Konfirmasi Update Profil',
            text: "Apakah Anda yakin ingin menyimpan perubahan ini?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, simpan perubahan!',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                // Alert memproses dengan auto close
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
</script>
@endsection
