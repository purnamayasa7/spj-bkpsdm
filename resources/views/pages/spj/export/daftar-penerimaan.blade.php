<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <title>Daftar Penerimaan Perjalanan Dinas</title>
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

        /* Judul & Subtitle */
        .title-section {
            text-align: center;
            margin-bottom: 8px;
        }

        .title-text {
            font-size: 10pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #111827;
            text-decoration: underline;
        }

        .subtitle-text {
            font-size: 7.5pt;
            color: #374151;
            margin-top: 2px;
        }

        /* Tabel Penerimaan (100% width, table-layout: fixed) */
        .penerimaan-table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
            font-size: 7pt;
        }

        .penerimaan-table th,
        .penerimaan-table td {
            border: 0.75pt solid #1f2937;
            padding: 2.5px 3px;
            vertical-align: middle;
            word-wrap: break-word;
            overflow: hidden;
        }

        .penerimaan-table thead th {
            background-color: #f3f4f6;
            color: #111827;
            font-weight: bold;
            text-align: center;
            font-size: 7pt;
        }

        .penerimaan-table thead .col-number th {
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

        .tfoot-total td {
            background-color: #f9fafb;
            font-weight: bold;
            font-size: 7.5pt;
            border-top: 1.5pt solid #111827;
            border-bottom: 1.5pt solid #111827;
        }

        /* Tanda Tangan */
        .ttd-section {
            width: 100%;
            margin-top: 12px;
            page-break-inside: avoid;
        }

        .ttd-table {
            width: 100%;
            border-collapse: collapse;
            text-align: center;
            font-size: 8pt;
        }

        .ttd-table td {
            border: none;
            vertical-align: top;
            width: 33.33%;
            padding: 0 6px;
        }

        .ttd-title {
            font-weight: bold;
            color: #111827;
            height: 25px;
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

    {{-- JUDUL & INFORMASI KEGIATAN --}}
    <div class="title-section">
        <div class="title-text">DAFTAR PENERIMAAN BIAYA PERJALANAN DINAS</div>
        <div class="subtitle-text">
            Dalam Rangka: <strong>{{ $dalam_rangka }}</strong> &bull;
            Tanggal Pelaksanaan: <strong>{{ $tanggal_mulai }} s.d. {{ $tanggal_selesai }}</strong>
        </div>
    </div>

    {{-- TABEL DATA PENERIMAAN (12 KOLOM PRESISI DENGAN TABLE-LAYOUT FIXED) --}}
    <table class="penerimaan-table">
        <thead>
            <tr>
                <th rowspan="2" style="width: 3%;">No</th>
                <th rowspan="2" style="width: 17%;">Nama Pelaksana / NIP</th>
                <th rowspan="2" style="width: 13%;">Jabatan</th>
                <th rowspan="2" style="width: 7%;">Pangkat / Gol</th>
                <th rowspan="2" style="width: 4%;">Hari</th>
                <th colspan="5" style="width: 39%;">Rincian Uang yang Diterima (Rp)</th>
                <th rowspan="2" style="width: 9%;">Jumlah (Rp)</th>
                <th rowspan="2" style="width: 8%;">Tanda Tangan</th>
            </tr>
            <tr>
                <th style="width: 8%;">Penginapan</th>
                <th style="width: 8%;">Uang Harian</th>
                <th style="width: 8%;">Representasi</th>
                <th style="width: 8%;">Transportasi</th>
                <th style="width: 7%;">Tiket</th>
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
                <td>{{ $row->jabatan ?: '-' }}</td>
                <td class="center">{{ $row->pangkat ?: '-' }}</td>
                <td class="center">{{ $row->lama_hari }}</td>
                <td class="right">{{ $row->penginapan > 0 ? number_format($row->penginapan, 0, ',', '.') : '-' }}</td>
                <td class="right">{{ $row->uang_harian > 0 ? number_format($row->uang_harian, 0, ',', '.') : '-' }}</td>
                <td class="right">{{ $row->uang_representasi > 0 ? number_format($row->uang_representasi, 0, ',', '.') : '-' }}</td>
                <td class="right">{{ $row->transportasi > 0 ? number_format($row->transportasi, 0, ',', '.') : '-' }}</td>
                <td class="right">{{ $row->tiket > 0 ? number_format($row->tiket, 0, ',', '.') : '-' }}</td>
                <td class="right" style="font-weight: bold; color: #111827;">
                    {{ number_format($row->jumlah, 0, ',', '.') }}
                </td>
                <td style="font-size: 6.5pt; color: #6b7280; padding-left: 4px;">
                    @if ($i % 2 === 0)
                    {{ $i + 1 }}. ............
                    @else
                    &nbsp;&nbsp;&nbsp;&nbsp;{{ $i + 1 }}. ............
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="12" class="center" style="padding: 10px; color: #6b7280; font-style: italic;">
                    Tidak ada rincian penerima yang dimasukkan.
                </td>
            </tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr class="tfoot-total">
                <td colspan="10" class="center" style="letter-spacing: 0.5px;">
                    JUMLAH TOTAL
                </td>
                <td class="right" style="font-size: 7.5pt;">
                    Rp {{ number_format($total, 0, ',', '.') }}
                </td>
                <td></td>
            </tr>
        </tfoot>
    </table>

    {{-- BLOK 3 TANDA TANGAN (PA, PPTK, YANG MENERIMA) --}}
    <div class="ttd-section">
        <table class="ttd-table">
            <tr>
                <td>
                    <div class="ttd-title">
                        Mengetahui,<br>
                        Pengguna Anggaran
                    </div>
                    <div class="ttd-space"></div>
                    <div class="ttd-name">{{ $pengguna_anggaran }}</div>
                    <div class="ttd-nip">NIP. {{ $nip_pengguna_anggaran }}</div>
                </td>
                <td>
                    <div class="ttd-title">
                        Pejabat Pelaksana Teknis<br>
                        Kegiatan (PPTK)
                    </div>
                    <div class="ttd-space"></div>
                    <div class="ttd-name">{{ $pptk }}</div>
                    <div class="ttd-nip">{{ $nip_pptk ? 'NIP. ' . $nip_pptk : '-' }}</div>
                </td>
                <td>
                    <div class="ttd-title">
                        Singaraja, {{ $tanggal_cetak }}<br>
                        Yang Menerima / Perwakilan
                    </div>
                    <div class="ttd-space"></div>
                    <div class="ttd-name">{{ $yang_menerima }}</div>
                    <div class="ttd-nip">{{ $nip_penerima ? 'NIP. ' . $nip_penerima : '' }}</div>
                </td>
            </tr>
        </table>
    </div>
</body>

</html>