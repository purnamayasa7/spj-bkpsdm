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
        <a href="{{ url()->previous() }}" class="btn btn-outline-secondary btn-sm">
            <i class="fas fa-arrow-left"></i> Kembali
        </a>
    </div>

    {{-- Modal Cetak Kuitansi --}}
    <div class="modal fade" id="modalKuitansi" tabindex="-1" role="dialog" aria-labelledby="filterModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <form id="formKuitansi" method="POST" target="_blank" action="{{ route('kuitansi.preview') }}">

                @csrf

                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Cetak Kuitansi</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span>&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Nomor</label>
                            <input type="text" name="nomor_rekening" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Kode Rekening</label>
                            <input type="text" name="kode_rekening" id="kode_rekening" class="form-control"
                                placeholder="Ketik Kode Rekening (12 Digit)" autocomplete="off" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Untuk Pembayaran</label>
                            <textarea name="untuk_pembayaran" class="form-control" rows="7" placeholder="Deskripsikan Keterangan Untuk Pembayaran" required></textarea>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Yang Menerima</label>
                            <input type="text" name="penerima" class="form-control" required>
                        </div>

                        <input type="hidden" name="jenis_spj" id="k_jenis">
                        <input type="hidden" name="tanggal_spj" id="k_tanggal">
                        <input type="hidden" name="sumber_dana" id="k_sumber">
                        <input type="hidden" name="nilai" id="k_nilai">
                        <input type="hidden" name="pptk" id="k_pptk">
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary py-1"><i class="fas fa-print"></i> Cetak</button>
                    </div>
                </div>
            </form>
        </div>
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
                        <label>Bidang</label>
                        <input type="text" class="form-control" value="{{ $bidangUser }}" readonly>
                        <input type="hidden" name="bidang" id="bidang" value="{{ $bidangUser }}">
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
                        <input type="text" name="pptk" id="pptk" class="form-control" readonly>
                    </div>

                    {{-- <div class="col-md-6 mb-3">
                        <label for="pptk">PPTK</label>
                        <select name="pptk" id="pptk" class="form-control" required>
                            <option value="">-- Pilih PPTK --</option>
                            <option value="Ni Komang Sutrisni, S.Pd">Ni Komang Sutrisni, S.Pd</option>
                            <option value="Made Herry Hermawan, S.STP., M.A.P">Made Herry Hermawan, S.STP., M.A.P</option>
                            <option value="I Gede Arsana, S.Sos">I Gede Arsana, S.Sos</option>
                            <option value="I Gusti Kade Ria Prisahatna, SH">I Gusti Kade Ria Prisahatna, SH</option>
                        </select>
                    </div> --}}

                    <div class="col-md-6 mb-3">
                        <label for="kegiatan">Kegiatan</label>
                        <input type="text" name="kegiatan" id="kegiatan" class="form-control"
                            value="{{ old('kegiatan') }}" required>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="belanja">Belanja</label>
                        <input type="text" name="belanja" id="belanja" class="form-control"
                            value="{{ old('belanja') }}" required>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="nilai">Nilai</label>
                        <input type="number" name="nilai" id="nilai" class="form-control"
                            value="{{ old('nilai') }}" required inputmode="numeric" pattern="[0-9]*">
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="sumber_dana">Sumber Dana</label>
                        <input type="text" name="sumber_dana" id="sumber_dana" class="form-control"
                            value="{{ old('sumber_dana') }}" required>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="tanggal_spj">Tanggal SPJ</label>
                        <input type="date" name="tanggal_spj" id="tanggal_spj" class="form-control"
                            value="{{ old('tanggal_spj') }}" required>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="tanggal_terima_spj">Tanggal Terima SPJ</label>
                        <input type="date" name="tanggal_terima_spj" id="tanggal_terima_spj" class="form-control"
                            value="{{ old('tanggal_terima_spj') }}" required>
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
                                    'Lain-lain',
                                ];
                            @endphp

                            @foreach ($dokumens as $index => $dokumen)
                                <tr>
                                    <td>{{ $index + 1 }}</td>
                                    <td>{{ $dokumen }}</td>
                                    <td>
                                        <div class="d-flex gap-2">
                                            <input type="file" name="dokumen[{{ $dokumen }}]"
                                                class="form-control file-input" data-doc="{{ $dokumen }}"
                                                accept="application/pdf">
                                            <small class="text-danger d-none file-warning">
                                                Ukuran file PDF melebihi dari 2 MB.
                                            </small>

                                            @if ($dokumen === 'Kuitansi')
                                                <button type="button" class="btn btn-sm btn-outline-primary"
                                                    onclick="openModalKuitansi()">
                                                    Cetak
                                                </button>
                                            @endif
                                        </div>
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
        document.addEventListener('DOMContentLoaded', function() {
            // Check Bidang & PPTK User
            const bidang = document.getElementById('bidang').value;
            const pptkInput = document.getElementById('pptk');

            const pptkMap = {
                'PKA': 'Ni Komang Sutrisni, S.Pd',
                'PPI': 'Made Herry Hermawan, S.STP., M.A.P',
                'MP': 'I Gede Arsana, S.Sos',
                'PKAP': 'I Gusti Kade Ria Prisahatna, SH',
                'Sekretariat': 'Made Herry Hermawan, S.STP., M.A.P'
            };

            if (pptkMap[bidang]) {
                pptkInput.value = pptkMap[bidang];
            }

            const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
            const fileInputs = document.querySelectorAll('.file-input');
            const btn = document.getElementById('btnSimpan');
            const form = document.getElementById('formSpj');

            // WARNING FILE > 2 MB
            fileInputs.forEach(input => {
                input.addEventListener('change', function() {
                    const warning = this.nextElementSibling;

                    if (!this.files.length) {
                        warning.classList.add('d-none');
                        return;
                    }

                    if (this.files[0].size > MAX_SIZE) {
                        warning.classList.remove('d-none');
                    } else {
                        warning.classList.add('d-none');
                    }
                });
            });

            btn.addEventListener('click', function(e) {
                e.preventDefault();
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

                // CEK FIELD KOSONG
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

                let largeFiles = [];

                fileInputs.forEach(input => {
                    if (input.files.length && input.files[0].size > MAX_SIZE) {
                        largeFiles.push(input.dataset.doc || 'Dokumen');
                    }
                });

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

                    if (!result.isConfirmed) return;

                    if (largeFiles.length > 0) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'File melebihi 2 MB',
                            html: `
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
                    submitForm();
                });
            });

            function submitForm() {
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

        // document.getElementById('bidang').addEventListener('change', function() {
        //     const bidang = this.value;

        //     if (bidang === 'PKA') {
        //         document.getElementById('pptk').value = 'Ni Komang Sutrisni, S.Pd';
        //     }

        //     if (bidang === 'PPI') {
        //         document.getElementById('pptk').value = 'Made Herry Hermawan, S.STP., M.A.P';
        //     }

        //     if (bidang === 'MP') {
        //         document.getElementById('pptk').value = 'I Gede Arsana, S.Sos';
        //     }

        //     if (bidang === 'PKAP') {
        //         document.getElementById('pptk').value = 'I Gusti Kade Ria Prisahatna, SH';
        //     }

        //     if (bidang === 'Sekretariat') {
        //         document.getElementById('pptk').value = 'Made Herry Hermawan, S.STP., M.A.P';
        //     }
        // });

        function openModalKuitansi() {

            document.getElementById('k_jenis').value =
                document.getElementById('jenis').value;

            document.getElementById('k_tanggal').value =
                document.getElementById('tanggal_spj').value;

            document.getElementById('k_sumber').value =
                document.getElementById('sumber_dana').value;

            document.getElementById('k_nilai').value =
                document.getElementById('nilai').value;

            document.getElementById('k_pptk').value =
                document.getElementById('pptk').value;

            new bootstrap.Modal(document.getElementById('modalKuitansi')).show();
        }

        document.getElementById('kode_rekening').addEventListener('input', function() {
            // hanya angka
            let raw = this.value.replace(/\D/g, '');

            // pola segmen rekening
            const pattern = [1, 2, 2, 1, 2, 4, 1, 1, 2, 2, 2, 4];

            let result = [];
            let index = 0;

            for (let p of pattern) {
                if (raw.length > index) {
                    result.push(raw.substr(index, p));
                    index += p;
                }
            }

            this.value = result.join(' ');
        });
        document.getElementById('nilai').addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    </script>
@endsection
