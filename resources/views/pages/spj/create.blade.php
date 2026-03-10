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
                            <textarea name="untuk_pembayaran" class="form-control" rows="7"
                                placeholder="Deskripsikan Keterangan Untuk Pembayaran" required></textarea>
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

    {{-- Modal Cetak Daftar Penerimaan --}}
    {{-- <div class="modal fade" id="modalDaftarPenerimaan1" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-xl" role="document">
            <form method="POST" target="_blank" action="{{ route('daftar-penerimaan.preview') }}">
                @csrf
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title">Cetak Daftar Penerimaan</h5>
                        <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                    </div>

                    <div class="modal-body">
                        <div class="mb-3">
                            <label>Dalam Rangka</label>
                            <input type="text" name="dalam_rangka" class="form-control" required>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <label>Tanggal Mulai</label>
                                <input type="date" name="tanggal_mulai" class="form-control" required>
                            </div>

                            <div class="col-md-6">
                                <label>Tanggal Selesai</label>
                                <input type="date" name="tanggal_selesai" class="form-control" required>
                            </div>
                        </div>

                        <hr>

                        <table class="table table-bordered" id="tablePenerimaan">
                            <thead>
                                <tr>
                                    <th width="5%">No</th>
                                    <th width="20%">NIP</th>
                                    <th width="20%">Nama</th>
                                    <th>Jabatan</th>
                                    <th>Pangkat</th>
                                    <th>Hari</th>
                                    <th>Penginapan</th>
                                    <th>Uang Harian</th>
                                    <th>Representasi</th>
                                    <th>Transport</th>
                                    <th>Tiket</th>
                                    <th>Jumlah</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>

                            </tbody>
                        </table>

                        <button type="button" class="btn btn-success btn-sm" onclick="addRow()">
                            + Tambah Pegawai
                        </button>

                        <hr>

                        <div class="mb-3">
                            <label>Yang Menerima</label>
                            <input type="text" name="yang_menerima" class="form-control" required>
                        </div>

                        <input type="hidden" name="pptk" id="d_pptk">
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary py-1"><i class="fas fa-print"></i>Cetak</button>
                    </div>
                </div>
            </form>
        </div>
    </div> --}}

    <div class="modal fade" id="modalDaftarPenerimaan">
        <div class="modal-dialog modal-xl">
            <form method="POST" target="_blank" action="{{ route('daftar-penerimaan.preview') }}">
                @csrf
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Buat Daftar Penerimaan
                        </h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <label>Dalam Rangka</label>
                                <input type="text" name="dalam_rangka" id="dalam_rangka" class="form-control" required>
                            </div>

                            <div class="col-md-3">
                                <label>Tanggal Mulai</label>
                                <input type="date" name="tanggal_mulai" class="form-control" required>
                            </div>

                            <div class="col-md-3">
                                <label>Tanggal Selesai</label>
                                <input type="date" name="tanggal_selesai" class="form-control" required>
                            </div>
                        </div>

                        <hr>

                        <div class="table-scroll">
                            <table class="table table-bordered" id="tablePegawai">
                                <thead>
                                    <tr>
                                        <th>Nama / NIP</th>
                                        <th>Hari</th>
                                        <th>Penginapan</th>
                                        <th>Uang Harian</th>
                                        <th>Uang Representasi</th>
                                        <th>Transport</th>
                                        <th>Tiket</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                        </div>

                        <button type="button" class="btn btn-success" onclick="addPegawai()">
                            Tambah Pegawai
                        </button>

                        <hr>

                        <div class="row">
                            <div class="col-md-6">
                                <label>Yang Menerima</label>
                                <input type="text" class="form-control" id="searchPenerima" autocomplete="off"
                                    required>
                                <input type="hidden" name="yang_menerima" id="nama_penerima">
                                <input type="hidden" name="nip_penerima" id="nip_penerima">
                                <div class="list-group pegawai-list" id="list-penerima"></div>
                            </div>
                        </div>

                        <input type="hidden" name="pptk" id="d_pptk">
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary">
                            Cetak PDF
                        </button>
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
                                    'Daftar Penerimaan',
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

                                            {{-- @if ($dokumen === 'Daftar Penerimaan')
                                                <button type="button" class="btn btn-sm btn-outline-primary"
                                                    onclick="openModalDaftarPenerimaan()">
                                                    Cetak
                                                </button>
                                            @endif --}}
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

    <style>
        .pegawai-list {
            position: absolute;
            top: 100%;
            left: 0;
            width: 500px;
            z-index: 9999;
            max-height: 200px;
            overflow-y: auto;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .table-scroll {
            width: 100%;
            overflow-x: auto;
        }

        .table-scroll table {
            min-width: 1400px;
        }

        #tablePegawai th,
        #tablePegawai td {
            white-space: nowrap;
        }

        #tablePegawai input {
            min-width: 120px;
        }

        #list-penerima {
            position: absolute;
            z-index: 999999;
            width: 500px;
            max-height: 200px;
            overflow-y: auto;
        }
    </style>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Check Bidang & PPTK User
            const bidang = document.getElementById('bidang').value;
            const pptkInput = document.getElementById('pptk');

            const pptkMap = {
                'PKA': 'Ni Komang Sutrisni, S.Pd',
                'PPI': 'Putu Ayu Willy Indah Sari, SE.,M.A.P',
                'MP': 'Luh Putu Teni Wulandari, SE, MAP',
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

        function openModalDaftarPenerimaan() {
            document.getElementById('d_pptk').value =
                document.getElementById('pptk').value;

            new bootstrap.Modal(document.getElementById('modalDaftarPenerimaan')).show();

            // let kegiatan = document.getElementById('kegitan').value;

            // document.getElementById('dalam_rangka').value = kegiatan;
        }

        function addPegawai() {

            let id = Date.now();

            let html = `
<tr>

<td>

<input type="text"
class="form-control searchPegawai"
data-id="${id}"
autocomplete="off">

<input type="hidden" name="nama[]">
<input type="hidden" name="nip[]">
<input type="hidden" name="jabatan[]">
<input type="hidden" name="pangkat[]">

</td>


<td>
<input type="number"
name="lama_hari[]"
class="form-control">
</td>


<td>
<input type="number"
name="penginapan[]"
class="form-control">
</td>


<td>
<input type="number"
name="uang_harian[]"
class="form-control">
</td>


<td>
<input type="number"
name="uang_representasi[]"
class="form-control">
</td>


<td>
<input type="number"
name="transportasi[]"
class="form-control">
</td>


<td>
<input type="number"
name="tiket[]"
class="form-control">
</td>


<td>

<button
type="button"
class="btn btn-danger"
onclick="removeRow(this)">

X

</button>

</td>


</tr>
`;

            $('#tablePegawai tbody').append(html);

            $('body').append(`
<div class="pegawai-list list-group" id="list-${id}"></div>
`);

        }

        function removeRow(btn) {
            $(btn).closest('tr').remove();
        }

        $(document).on('keyup', '.searchPegawai', function() {
            let input = $(this);
            let id = input.data('id');
            let list = $('#list-' + id);
            let offset = input.offset();

            list.css({
                top: offset.top + input.outerHeight(),
                left: offset.left,
                width: input.outerWidth() + 300
            }).show();

            $.get(
                "{{ route('pegawai.search') }}", {
                    q: input.val()
                },
                function(res) {
                    let html = '';
                    res.forEach(p => {
                        html += `
<a href="#"
class="list-group-item list-group-item-action pilih"
data-id="${id}"
data-nama="${p.nama}"
data-nip="${p.nip}"
data-jabatan="${p.jabatan}"
data-pangkat="${p.pangkat}">

<div style="display:flex; justify-content:space-between;">

<span>${p.nama}</span>

<span>${p.nip}</span>

</div>

</a>
`;

                    });
                    list.html(html);
                }
            );
        });

        $('#searchPenerima').on('keyup', function() {
            let input = this;
            let rect = input.getBoundingClientRect();
            let list = $('#list-penerima');

            list.css({
                position: 'fixed',
                top: rect.bottom,
                left: rect.left,
                width: rect.width,
                zIndex: 999999
            }).show();

            $.get("{{ route('pegawai.search') }}", {
                q: input.value
            }, function(res) {
                let html = '';
                res.forEach(p => {
                    html += `
<a href="#"
class="list-group-item list-group-item-action pilih-penerima"
data-nama="${p.nama}"
data-nip="${p.nip}">

<div style="display:flex; justify-content:space-between;">
<span>${p.nama}</span>
<span>${p.nip}</span>
</div>

</a>
`;

                });
                list.html(html);
            });
        });

        // Get kegiatan value
        $('#kegiatan').on('keyup change', function() {
            $('#dalam_rangka').val($(this).val());
        });

        $(document).on('click', '.pilih', function(e) {
            e.preventDefault();
            let id = $(this).data('id');
            let input = $('.searchPegawai[data-id="' + id + '"]');
            let row = input.closest('tr');

            row.find('[name="nama[]"]').val($(this).data('nama'));
            row.find('[name="nip[]"]').val($(this).data('nip'));
            row.find('[name="jabatan[]"]').val($(this).data('jabatan'));
            row.find('[name="pangkat[]"]').val($(this).data('pangkat'));
            input.val($(this).data('nama'));

            $('#list-' + id).hide();
        });

        $(document).on('click', '.pilih-penerima', function(e) {
            e.preventDefault();
            $('#searchPenerima').val($(this).data('nama'));
            $('#nama_penerima').val($(this).data('nama'));
            $('#nip_penerima').val($(this).data('nip'));
            $('#list-penerima').hide();
        });

        $(document).click(function(e) {
            if (!$(e.target).closest('.searchPegawai, .pegawai-list').length) {
                $('.pegawai-list').hide();
            }
        });
    </script>
@endsection
