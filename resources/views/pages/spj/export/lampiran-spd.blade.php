<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <title>Lampiran SPD - {{ $nomor_lampiran ?: 'BKPSDM' }}</title>
    <style>
        @page {
            margin: 8mm 10mm;
            size: A4 landscape;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 7.5pt;
            line-height: 1.25;
            color: #111827;
            background: #ffffff;
            margin: 0;
            padding: 0;
        }

        /* Kop Surat Resmi Terpusat (Logo di samping kiri teks + space) */
        .kop-container {
            text-align: center;
            margin-bottom: 4px;
        }

        .kop-table {
            margin: 0 auto;
            border-collapse: collapse;
            border: none;
        }

        .kop-table td {
            vertical-align: middle;
            border: none;
            padding: 0;
        }

        .kop-logo {
            width: 50px;
            text-align: center;
            vertical-align: middle;
        }

        .kop-logo img {
            width: 50px;
            height: auto;
            display: block;
        }

        .kop-spacer {
            width: 12px;
            min-width: 12px;
        }

        .kop-text {
            text-align: center;
            vertical-align: middle;
        }

        .kop-text .instansi-1 {
            font-size: 10.5pt;
            font-weight: bold;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #111827;
        }

        .kop-text .instansi-2 {
            font-size: 11pt;
            font-weight: bold;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #111827;
        }

        .kop-text .instansi-addr {
            font-size: 7pt;
            color: #374151;
            margin-top: 2px;
        }

        .kop-divider {
            border-top: 2pt solid #111827;
            border-bottom: 0.75pt solid #111827;
            height: 2px;
            margin-top: 4px;
            margin-bottom: 8px;
        }

        /* Header Lampiran Box */
        .header-meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
            font-size: 7.5pt;
        }

        .header-meta-table td {
            border: none;
            padding: 1.5px 0;
            vertical-align: top;
        }

        .badge-lampiran {
            display: inline-block;
            border: 1pt solid #1f2937;
            padding: 3px 8px;
            background-color: #f9fafb;
            font-weight: bold;
            font-size: 7.5pt;
            float: right;
            text-align: left;
        }

        /* Tabel Utama Matrix Pelaksana SPD (100% width, table-layout: fixed) */
        .spd-table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
            font-size: 7pt;
            margin-top: 4px;
        }

        .spd-table th,
        .spd-table td {
            border: 0.75pt solid #1f2937;
            padding: 2.5px 3px;
            vertical-align: middle;
            word-wrap: break-word;
            overflow: hidden;
        }

        .spd-table thead th {
            background-color: #f3f4f6;
            color: #111827;
            font-weight: bold;
            text-align: center;
            font-size: 7pt;
        }

        .spd-table thead .col-number th {
            background-color: #ffffff;
            font-size: 6pt;
            font-weight: normal;
            color: #4b5563;
            padding: 1px 0;
        }

        .center {
            text-align: center;
        }

        .right {
            text-align: right;
        }

        /* Blok Tanda Tangan */
        .ttd-wrapper {
            width: 100%;
            margin-top: 12px;
            page-break-inside: avoid;
        }

        .ttd-table {
            margin-left: auto;
            width: 250px;
            border-collapse: collapse;
            text-align: center;
            font-size: 8pt;
        }

        .ttd-table td {
            border: none;
            padding: 0;
        }

        .ttd-space {
            height: 42px;
        }

        .ttd-name {
            font-weight: bold;
            text-decoration: underline;
            color: #111827;
        }

        .ttd-nip {
            font-size: 7pt;
            color: #4b5563;
            margin-top: 1px;
        }
    </style>
</head>

<body>
    {{-- KOP SURAT TERPUSAT DENGAN LOGO DI SAMPING KIRI --}}
    <div class="kop-container">
        <table class="kop-table">
            <tr>
                <td class="kop-logo">
                    <img src="{{ public_path('images/KabBuleleng.png') }}" alt="Logo Buleleng">
                </td>
                <td class="kop-spacer">&nbsp;</td>
                <td class="kop-text">
                    <div class="instansi-1">Pemerintah Kabupaten Buleleng</div>
                    <div class="instansi-2">Badan Kepegawaian dan Pengembangan Sumber Daya Manusia</div>
                    <div class="instansi-addr">
                        Jalan Laksamana (LC) Baktiseraga, Singaraja, Bali &bull; Telp: (0362) 21124 &bull; Kode Pos: 81119
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div class="kop-divider"></div>

    {{-- METADATA LAMPIRAN & KEGIATAN --}}
    <table class="header-meta-table">
        <tr>
            <td width="55%">
                <table width="100%" cellpadding="0" cellspacing="0" style="border:none;">
                    <tr>
                        <td width="28%"><strong>Daftar Peserta</strong></td>
                        <td width="3%">:</td>
                        <td width="69%">{{ $daftar_peserta }}</td>
                    </tr>
                    <tr>
                        <td><strong>Tgl. Pelaksanaan</strong></td>
                        <td>:</td>
                        <td>{{ $tgl_penyelenggaraan }}</td>
                    </tr>
                    <tr>
                        <td><strong>Tempat / Kota</strong></td>
                        <td>:</td>
                        <td>{{ $kota }}</td>
                    </tr>
                    <tr>
                        <td><strong>Satuan Kerja</strong></td>
                        <td>:</td>
                        <td>{{ $satuan_kerja }}</td>
                    </tr>
                </table>
            </td>
            <td width="45%" align="right">
                <div class="badge-lampiran">
                    <div><strong>LAMPIRAN SPD</strong></div>
                    <div style="font-size: 7pt; font-weight: normal; margin-top: 1px;">
                        Nomor: {{ $nomor_lampiran }}<br>
                        Tanggal: {{ $tanggal_lampiran }}
                    </div>
                </div>
            </td>
        </tr>
    </table>

    {{-- TABEL MATRIX PELAKSANA SPD (13 KOLOM DENGAN TABLE-LAYOUT FIXED) --}}
    <table class="spd-table">
        <thead>
            <tr>
                <th rowspan="2" style="width: 3%;">No</th>
                <th rowspan="2" style="width: 16%;">Nama Pelaksana SPD / NIP</th>
                <th rowspan="2" style="width: 7%;">Pangkat / Gol</th>
                <th rowspan="2" style="width: 13%;">Jabatan</th>
                <th rowspan="2" style="width: 8%;">Tempat Kedudukan</th>
                <th rowspan="2" style="width: 8%;">Biaya Perjadin</th>
                <th rowspan="2" style="width: 8%;">Alat Angkut</th>
                <th colspan="2" style="width: 16%;">Surat Tugas</th>
                <th colspan="2" style="width: 14%;">Tanggal Pelaksanaan</th>
                <th rowspan="2" style="width: 3%;">Lama</th>
                <th rowspan="2" style="width: 4%;">Ket</th>
            </tr>
            <tr>
                <th style="width: 9%;">Nomor</th>
                <th style="width: 7%;">Tanggal</th>
                <th style="width: 7%;">Berangkat</th>
                <th style="width: 7%;">Tiba</th>
            </tr>
            <tr class="col-number">
                <th>(1)</th>
                <th>(2)</th>
                <th>(3)</th>
                <th>(4)</th>
                <th>(5)</th>
                <th>(6)</th>
                <th>(7)</th>
                <th>(8)</th>
                <th>(9)</th>
                <th>(10)</th>
                <th>(11)</th>
                <th>(12)</th>
                <th>(13)</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($items as $i => $row)
            <tr>
                <td class="center">{{ $i + 1 }}</td>
                <td>
                    <strong style="color: #111827;">{{ $row->nama }}</strong><br>
                    <span style="color: #4b5563; font-size: 6.5pt;">NIP. {{ $row->nip ?: '-' }}</span>
                </td>
                <td class="center">{{ $row->pangkat ?: '-' }}</td>
                <td>{{ $row->jabatan ?: '-' }}</td>
                <td class="center">{{ $row->tempat_kedudukan }}</td>
                <td class="right">
                    @if ($row->tingkat_biaya > 0)
                    Rp {{ number_format($row->tingkat_biaya, 0, ',', '.') }}
                    @else
                    -
                    @endif
                </td>
                <td class="center">{{ $row->alat_angkut }}</td>
                <td class="center" style="font-size: 6.5pt;">{{ $row->no_surat_tugas }}</td>
                <td class="center">{{ $row->tgl_surat_tugas }}</td>
                <td class="center">{{ $row->tanggal_mulai }}</td>
                <td class="center">{{ $row->tanggal_selesai }}</td>
                <td class="center">{{ $row->lama_hari }}</td>
                <td class="center">{{ $row->keterangan }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="13" class="center" style="padding: 10px; color: #6b7280; font-style: italic;">
                    Tidak ada data pelaksana SPD yang dilampirkan.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    {{-- TANDA TANGAN PEJABAT PEMBUAT KOMITMEN (PPK) --}}
    <div class="ttd-wrapper">
        <table class="ttd-table">
            <tr>
                <td>
                    <div>Singaraja, {{ $tanggal_cetak }}</div>
                    <div style="font-weight: bold; margin-top: 1px;">Pejabat Pembuat Komitmen (PPK)</div>
                    <div class="ttd-space"></div>
                    <div class="ttd-name">{{ $nama_kepala }}</div>
                    <div class="ttd-nip">NIP. {{ $nip_kepala }}</div>
                </td>
            </tr>
        </table>
    </div>
</body>

</html>