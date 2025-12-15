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
<div class="d-sm-flex align-items-center justify-content-between mb-4">
  <h1 class="h3 mb-0 text-gray-800">Buat SPJ</h1>
  <a href="/spj" class="btn btn-outline-secondary btn-sm">
      <i class="fas fa-arrow-left"></i> Kembali
  </a>
</div>

<div class="card shadow mb-4">
  <div class="card-body">
    <form id="formSpj" action="{{ url('/spj') }}" method="POST" enctype="multipart/form-data">
      @csrf

      {{-- DATA SPJ UTAMA --}}
      <h5 class="mb-3 text-primary">Data SPJ</h5>
      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="id">ID SPJ</label>
          <input type="text" class="form-control" value="{{ $previewId }}" readonly>
        </div>

        <div class="col-md-6 mb-3">
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

        <div class="col-md-6 mb-3">
          <label for="jenis">Jenis</label>
          <select name="jenis" id="jenis" class="form-control" required>
            <option value="">-- Pilih Jenis --</option>
            <option value="GU" {{ old('jenis') == 'GU' ? 'selected' : '' }}>GU</option>
            <option value="LS" {{ old('jenis') == 'LS' ? 'selected' : '' }}>LS</option>
            <option value="UP" {{ old('jenis') == 'UP' ? 'selected' : '' }}>UP</option>
          </select>
        </div>

        <div class="col-md-6 mb-3">
          <label for="pptk">PPTK</label>
          <input type="text" name="pptk" id="pptk" class="form-control" value="{{ old('pptk') }}" required>
        </div>

        <div class="col-md-6 mb-3">
          <label for="kegiatan">Kegiatan</label>
          <input type="text" name="kegiatan" id="kegiatan" class="form-control" value="{{ old('kegiatan') }}" required>
        </div>

        <div class="col-md-6 mb-3">
          <label for="belanja">Belanja</label>
          <input type="text" name="belanja" id="belanja" class="form-control" value="{{ old('belanja') }}" required>
        </div>

        <div class="col-md-6 mb-3">
          <label for="nilai">Nilai</label>
          <input type="number" name="nilai" id="nilai" class="form-control" value="{{ old('nilai') }}" required>
        </div>

        <div class="col-md-6 mb-3">
          <label for="sumber_dana">Sumber Dana</label>
          <input type="text" name="sumber_dana" id="sumber_dana" class="form-control" value="{{ old('sumber_dana') }}" required>
        </div>

        <div class="col-md-6 mb-3">
          <label for="tanggal_spj">Tanggal SPJ</label>
          <input type="date" name="tanggal_spj" id="tanggal_spj" class="form-control" value="{{ old('tanggal_spj') }}" required>
        </div>

        <div class="col-md-6 mb-3">
          <label for="tanggal_terima_spj">Tanggal Terima SPJ</label>
          <input type="date" name="tanggal_terima_spj" id="tanggal_terima_spj" class="form-control" value="{{ old('tanggal_terima_spj') }}" required>
        </div>
        
        <div class="col-md-12 mb-3">
          <label for="kelengkapan_spk">Kelengkapan SPK</label>
          <textarea name="kelengkapan_spk" id="kelengkapan_spk" class="form-control" rows="3">{{ old('kelengkapan_spk') }}</textarea>
        </div>

        <div class="col-md-12 mb-3">
          <label for="keterangan">Keterangan</label>
          <textarea name="keterangan" id="keterangan" class="form-control" rows="3">{{ old('keterangan') }}</textarea>
        </div>

        <div class="col-md-6 mb-3">
          <label for="status">Status</label>
          <input type="text" class="form-control" value="Dikirim" readonly>
          <input type="hidden" name="status" value="Dikirim">
        </div>
      </div>

      <hr>

      {{-- DOKUMEN KELENGKAPAN --}}
      <h5 class="mb-3 text-primary">Upload Kelengkapan Dokumen</h5>
      <div class="table-responsive">
        <table class="table table-bordered">
          <thead class="thead-light">
            <tr>
              <th style="width: 5%">No</th>
              <th>Nama Dokumen</th>
              <th style="width: 40%">Upload File</th>
            </tr>
          </thead>
          <tbody>
            @php
              $dokumens = [
                  'Kuitansi',
                  'Bukti Pembelian',
                  'BAST dan Lampiran',
                  'BAP dan Lampiran',
                  'Nota Permintaan Barang/Jasa',
                  'Surat Permintaan Barang/Jasa',
                  'Berita Acara Penyerahan Barang/Jasa',
                  'Riwayat Negoisasi',
                  'Surat Pesanan',
                  'Invoice Beserta Lampiran',
                  'Nota Dinas',
                  'Dokumen Persiapan Pengadaan (DPP)',
                  'Surat Perintah Pengiriman (SPP)/(SPMK)',
                  'Daftar Penerimaan',
                  'Surat Tugas',
                  'SPD Lampiran',
                  'Rincian Biaya',
                  'Daftar Hadir',
                  'Laporan + Dokumentasi',
                  'Dokumentasi Pajak',
                  'Lain-lain'
              ];
            @endphp

            @foreach ($dokumens as $index => $dokumen)
            <tr>
              <td>{{ $index + 1 }}</td>
              <td>{{ $dokumen }}</td>
              <td>
                <input type="file" name="dokumen[{{ $dokumen }}]" class="form-control" accept="application/pdf,image/*">
              </td>
            </tr>
            @endforeach
          </tbody>
        </table>
      </div>

      <div class="text-right">
        <button type="button" id="btnSimpan" class="btn btn-primary">
          <i class="fas fa-save"></i> Simpan SPJ
        </button>
      </div>
    </form>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('btnSimpan');
    const form = document.getElementById('formSpj');

    btn.addEventListener('click', function (e) {
        e.preventDefault();

        // Daftar field wajib diisi
        const requiredFields = [
            'bidang',
            'jenis',
            'pptk',
            'kegiatan',
            'belanja',
            'nilai',
            'sumber_dana',
            'tanggal_spj',
            'tanggal_terima_spj'
        ];

        // Cek apakah ada yang kosong
        let emptyField = null;
        for (const field of requiredFields) {
            const el = document.getElementById(field);
            if (el && !el.value.trim()) {
                emptyField = field;
                break;
            }
        }

        if (emptyField) {
            const label = document.querySelector(`label[for="${emptyField}"]`);
            Swal.fire({
                icon: 'warning',
                title: 'Field belum lengkap!',
                text: `Mohon isi bagian "${label ? label.innerText : emptyField}" terlebih dahulu.`,
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        // Jika semua field terisi, tampilkan konfirmasi
        Swal.fire({
            title: 'Anda yakin membuat SPJ ini?',
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
});
</script>

@endsection
