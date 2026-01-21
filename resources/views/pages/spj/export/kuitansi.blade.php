<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Kuitansi</title>
    <style>
        body {
            font-size: 12px;
        }

        table {
            border-collapse: collapse;
        }
    </style>
</head>

<body>
    <div style="border:2px solid #000; padding:15px;">
        <table width="100%">
            <tr>
                <td width="30%">Nomor</td>
                <td width="70%">: {{ $nomor_rekening }}</td>
            </tr>
        </table>

        <br>

        <table width="100%">
            <tr>
                <td width="30%">Kode Rekening</td>
                <td width="70%">
                    <table cellpadding="2" cellspacing="0">
                        <tr>
                            @foreach ($rekening_boxes as $box)
                                <td
                                    style="
                            min-width:30px;
                            border:1px solid #000;
                            text-align:center;
                            vertical-align:middle;
                            font-size:11pt;
                        ">
                                    {{ $box }}
                                </td>
                            @endforeach
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>SPJ</td>
                <td>: {{ $spj }}</td>
            </tr>
            <tr>
                <td>Tahun Anggaran</td>
                <td>: {{ $tahun }}</td>
            </tr>
            <tr>
                <td>Sumber Dana</td>
                <td>: {{ $sumber_dana }}</td>
            </tr>
        </table>

        <br>

        <h2 style="text-align:center;"><u>KUITANSI</u></h2>

        <table width="100%">
            <tr>
                <td width="30%">Sudah terima dari</td>
                <td width="70%">: {{ $sudah_terima_dari }}</td>
            </tr>
            <tr>
                <td>Banyaknya uang</td>
                <td>: <strong><i>{{ $terbilang }}</i></strong></td>
            </tr>
            <tr>
                <td>Untuk pembayaran</td>
                <td>: {{ $untuk_pembayaran }}</td>
            </tr>
        </table>

        <br>

        <table width="100%">
            <tr>
                <td width="30%" style="font-size: 18px"><strong><i>Terbilang</i></strong></td>
                <td width="60%">
                    <div
                        style="
        display:inline-block;
        padding:4px 30px;
        border:2px solid #000;
        transform: skew(-40deg);
    ">
                        <div
                            style="
            transform: skew(40deg);
            font-size:18px;
            font-weight:bold;
        ">
                            <i>Rp {{ number_format($nilai, 0, ',', '.') }},-</i>
                        </div>
                    </div>
                </td>

            </tr>
        </table>

        <br><br>

        <table width="100%" style="text-align:center;">
            <tr>
                <td>Setuju dibayar</td>
                <td>PPTK</td>
                <td>Lunas dibayar</td>
                <td>{{ $tanggal_spj }}</td>
            </tr>
            <tr>
                <td>Pengguna Anggaran</td>
                <td></td>
                <td>Bendahara</td>
                <td>Yang Menerima</td>
            </tr>
            <tr>
                <td colspan="4" style="height:60px;"></td>
            </tr>
            <tr>
                <td>{{ $setuju_dibayar }}</td>
                <td>{{ $pptk }}</td>
                <td>{{ $bendahara }}</td>
                <td>{{ $penerima }}</td>
            </tr>
            <tr>
                <td>NIP. 197612281996011001</td>
                <td>
                    @if ($pptk == 'Ni Komang Sutrisni, S.Pd')
                        NIP. 197207061993032012
                        @elseif ($pptk == 'Made Herry Hermawan, S.STP., M.A.P')
                        NIP. 198702052006021001
                        @elseif ($pptk == 'I Gede Arsana, S.Sos')
                        NIP. 196802022006041021
                        @elseif ($pptk == 'I Gusti Kade Ria Prisahatna, SH')
                        NIP. 198703122015031005
                    @endif
                </td>
                <td>NIP. 198205022009022001</td>
                <td>
                    @if ($penerima == 'Ni Komang Sutrisni, S.Pd')
                        NIP. 197207061993032012
                        @elseif ($penerima == 'Made Herry Hermawan, S.STP., M.A.P')
                        NIP. 198702052006021001
                        @elseif ($penerima == 'I Gede Arsana, S.Sos')
                        NIP. 196802022006041021
                        @elseif ($penerima == 'I Gusti Kade Ria Prisahatna, SH')
                        NIP. 198703122015031005
                        @elseif ($penerima == 'Kadek Meilani, S.E')
                        NIP. 198205022009022001
                        @else
                    @endif
                </td>
            </tr>
        </table>
    </div>
</body>

</html>
