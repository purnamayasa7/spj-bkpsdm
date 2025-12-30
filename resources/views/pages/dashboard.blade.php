@extends('layouts.app')

@section('content')
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Dashboard 
            {{-- - {{ $roleLabel }} --}}
            <small class="text-muted d-block mt-1" style="font-size: 16px">
                {{ \Carbon\Carbon::now()->translatedFormat('l, d F Y') }}
            </small>
        </h1>
        <div class="form-inline">
            <label class="mr-2 font-weight-bold text-muted">Periode Tahun</label>

            <select class="form-control form-control-sm" onchange="loadDashboardData(this.value)">
                <option value="2025" {{ $year == 2025 ? 'selected' : '' }}>2025</option>
                <option value="2026" {{ $year == 2026 ? 'selected' : '' }}>2026</option>
            </select>
        </div>
    </div>

    <!-- CARD STATUS -->
    <div class="row">
        @php
            $cards = [
                [
                    'id' => 'card-dikirim',
                    'label' => 'SPJ Dikirim',
                    'icon' => 'paper-plane',
                    'color' => 'success',
                    'value' => $totalDikirim,
                ],
                [
                    'id' => 'card-dikoreksi',
                    'label' => 'SPJ Dikoreksi',
                    'icon' => 'edit',
                    'color' => 'warning',
                    'value' => $totalDikoreksi,
                ],
                [
                    'id' => 'card-disetujui',
                    'label' => 'SPJ Disetujui',
                    'icon' => 'check-circle',
                    'color' => 'primary',
                    'value' => $totalDisetujui,
                ],
                [
                    'id' => 'card-ditolak',
                    'label' => 'SPJ Ditolak',
                    'icon' => 'times-circle',
                    'color' => 'secondary',
                    'value' => $totalDitolak,
                ],
            ];
        @endphp

        @foreach ($cards as $c)
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-{{ $c['color'] }} shadow h-100 py-2">
                    <div class="card-body d-flex align-items-center">
                        <div class="mr-3">
                            <i class="fas fa-{{ $c['icon'] }} fa-2x text-{{ $c['color'] }}"></i>
                        </div>
                        <div>
                            <div class="text-xs font-weight-bold text-{{ $c['color'] }} text-uppercase mb-1">
                                {{ $c['label'] }}
                            </div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800" id="{{ $c['id'] }}">
                                {{ $c['value'] }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>

    <div class="row">
        <!-- Chart Rekap Bidang -->
        <div class="col-lg-6 mb-4">

            @if ($user->role_id === 1)
                <div class="card shadow h-100">
                    <div class="card-header py-3">
                        <h6 class="m-0 font-weight-bold text-muted">Rekap Jumlah SPJ per Bidang</h6>
                    </div>

                    <div class="card-body">

                        <div class="chart-area" style="position: relative; height: 260px;">
                            <canvas id="rekapBidangChart"></canvas>
                        </div>

                    </div>
                </div>
            @endif
        </div>

        <!-- Kolom kanan: Timeline -->
        <div class="col-lg-6 mb-4">

            @if ($user->role_id === 1)
                <div class="card shadow h-100">
                    <div class="card-header py-3 d-flex justify-content-between align-items-center">
                        <h6 class="m-0 font-weight-bold text-muted">Aktivitas Terkini</h6>

                        <a href="{{ route('activity.index') }}" class="text-primary"
                            style="font-size: 14px; text-decoration: underline; cursor: pointer;">
                            Lihat Data Lainnya
                        </a>
                    </div>

                    <div class="card-body activity-scroll">

                        <ul class="list-group list-group-flush">

                            @foreach ($recentActivities as $act)
                                @php
                                    $map = [
                                        'approve' => 'bg-primary',
                                        'update' => 'bg-warning',
                                        'create' => 'bg-success',
                                    ];
                                    $bg = $map[strtolower($act->action)] ?? 'bg-secondary';
                                @endphp

                                <li class="list-group-item px-0 activity-item">

                                    <div class="d-flex align-items-center">

                                        <!-- CIRCLE -->
                                        <div class="activity-dot {{ $bg }} mr-3"></div>

                                        <!-- TEXT -->
                                        <div class="text-muted small">
                                            {{ $act->created_at->diffForHumans() }}
                                            — <b>{{ $act->user->name ?? 'User' }}</b>, Dari Bidang
                                            <b>{{ $act->bidang }}</b> {{ $act->description }}
                                        </div>
                                    </div>
                                </li>
                            @endforeach

                        </ul>
                    </div>
                </div>
            @endif
        </div>
    </div>


    <!-- Grafik Bulanan -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-muted">
                Tren Jumlah SPJ per Bulan - Tahun {{ $year }}
            </h6>
        </div>
        <div class="card-body">
            <div class="chart-area" style="height: 300px;">
                <canvas id="rekapBulananChart"></canvas>
            </div>
            <hr>
            <span class="text-gray-800 small">
                Menampilkan jumlah total SPJ (semua status) per bulan selama tahun {{ $year }}.
            </span>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        let bulananChart = null;
        let bidangChart = null;

        /* CHART BULAN */
        const ctxBulanan = document.getElementById('rekapBulananChart');
        const dataBulanan = {!! json_encode($rekapData) !!};

        bulananChart = new Chart(ctxBulanan, {
            type: 'line',
            data: {
                labels: {!! json_encode($bulanLabels) !!},
                datasets: [{
                    label: 'Total SPJ',
                    data: dataBulanan,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 4,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(255,255,255,0.8)",
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: Math.max(...dataBulanan, 0) + 1
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        /* BIDANG */
        const ctxBidang = document.getElementById('rekapBidangChart');

        const initLabels = @json($rekapBidang->pluck('bidang'));
        const initValues = @json($rekapBidang->pluck('total'));

        bidangChart = new Chart(ctxBidang, {
            type: 'bar',
            data: {
                labels: initLabels,
                datasets: [{
                    label: "Jumlah SPJ",
                    data: initValues,
                    backgroundColor: "rgba(78, 115, 223, 0.8)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    borderWidth: 1,
                    maxBarThickness: 40,
                }]
            },
            options: {
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: Math.max(...initValues, 0) + 1,
                        ticks: {
                            stepSize: 1
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: "rgb(255,255,255)",
                        bodyColor: "#858796",
                        titleColor: '#6e707e',
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        titleMarginBottom: 10,
                        padding: 10,
                        displayColors: false,
                    }

                }
            }
        });

        function loadDashboardData(year) {
            fetch("{{ route('dashboard.data') }}?year=" + year)
                .then(res => res.json())
                .then(res => {

                    document.getElementById('card-dikirim').innerText = res.cards.dikirim;
                    document.getElementById('card-dikoreksi').innerText = res.cards.dikoreksi;
                    document.getElementById('card-disetujui').innerText = res.cards.disetujui;
                    document.getElementById('card-ditolak').innerText = res.cards.ditolak;

                    bulananChart.data.datasets[0].data = res.bulanan;
                    bulananChart.options.scales.y.max =
                        Math.max(...res.bulanan, 0) + 1;
                    bulananChart.update();

                    if (res.bidang) {
                        const labels = res.bidang.map(b => b.bidang);
                        const values = res.bidang.map(b => b.total);

                        bidangChart.data.labels = labels;
                        bidangChart.data.datasets[0].data = values;
                        bidangChart.options.scales.y.max =
                            Math.max(...values, 0) + 1;

                        bidangChart.update();
                    }
                });
        }
    </script>

@endsection
