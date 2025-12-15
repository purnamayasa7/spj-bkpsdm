@extends('layouts.app')

@section('content')
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Dashboard - {{ $roleLabel }}</h1>
    </div>

    <!-- CARD STATUS -->
    <div class="row">
        <!-- Dikirim -->
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body d-flex align-items-center">
                    <div class="mr-3">
                        <i class="fas fa-paper-plane fa-2x text-success"></i>
                    </div>
                    <div>
                        <div class="text-xs font-weight-bold text-success text-uppercase mb-1">SPJ Dikirim</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">{{ $totalDikirim }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dikoreksi -->
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body d-flex align-items-center">
                    <div class="mr-3">
                        <i class="fas fa-edit fa-2x text-warning"></i>
                    </div>
                    <div>
                        <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">SPJ Dikoreksi</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">{{ $totalDikoreksi }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Disetujui -->
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body d-flex align-items-center">
                    <div class="mr-3">
                        <i class="fas fa-check-circle fa-2x text-primary"></i>
                    </div>
                    <div>
                        <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">SPJ Disetujui</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">{{ $totalDisetujui }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Ditolak -->
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-secondary shadow h-100 py-2">
                <div class="card-body d-flex align-items-center">
                    <div class="mr-3">
                        <i class="fas fa-times-circle fa-2x text-secondary"></i>
                    </div>
                    <div>
                        <div class="text-xs font-weight-bold text-secondary text-uppercase mb-1">SPJ Ditolak</div>
                        <div class="h5 mb-0 font-weight-bold text-gray-800">{{ $totalDitolak }}</div>
                    </div>
                </div>
            </div>
        </div>
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
                Tren Jumlah SPJ per Bulan - Tahun {{ date('Y') }}
            </h6>
        </div>
        <div class="card-body">
            <div class="chart-area" style="height: 300px;">
                <canvas id="rekapBulananChart"></canvas>
            </div>
            <hr>
            <span class="text-gray-800 small">
                Menampilkan jumlah total SPJ (semua status) per bulan selama tahun {{ date('Y') }}.
            </span>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        const ctxBulanan = document.getElementById('rekapBulananChart');
        const dataBulanan = {!! json_encode($rekapData) !!};
        const maxBulanan = Math.max(...dataBulanan, 0);
        const limitBulanan = maxBulanan <= 10 ? 10 : (maxBulanan <= 20 ? 20 : Math.ceil(maxBulanan * 1.2));

        new Chart(ctxBulanan, {
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
                    x: {
                        title: {
                            display: true,
                            text: 'Bulan'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: limitBulanan,
                        ticks: {
                            stepSize: 2,
                            callback: value => value + ' SPJ'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => `${ctx.label}: ${ctx.parsed.y} SPJ`
                        }
                    }
                }
            }
        });


        const labels = @json($rekapBidang->pluck('bidang'));
        const values = @json($rekapBidang->pluck('total'));

        const ctx = document.getElementById("rekapBidangChart");

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: "Jumlah SPJ",
                    data: values,
                    backgroundColor: "rgba(78, 115, 223, 0.8)", // biru SB Admin 2
                    borderColor: "rgba(78, 115, 223, 1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(78, 115, 223, 1)",
                    hoverBorderColor: "rgba(78, 115, 223, 1)",
                    maxBarThickness: 40, // agar bar tidak terlalu lebar
                }],
            },
            options: {
                maintainAspectRatio: false,
                animation: {
                    duration: 1500, // durasi animasi 1,5 detik
                    easing: 'easeOutBounce',
                },
                scales: {
                    y: {
                        beginAtZero: true,

                        // ★ MAX Y SELALU SAMA DENGAN NILAI BAR TERTINGGI
                        max: Math.max(...values) + 1,
                        ticks: {
                            stepSize: 1,
                            padding: 10,
                            font: {
                                size: 11
                            },
                        },
                        grid: {
                            drawBorder: false,
                            color: "rgba(234, 236, 244, 1)",
                            zeroLineColor: "rgba(234, 236, 244, 1)",
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
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
    </script>
@endsection
