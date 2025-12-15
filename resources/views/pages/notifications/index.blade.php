@extends('layouts.app')

@section('title', 'Notifikasi')

@section('content')
    <div class="container mt-4">
        <h3 class="mb-4">Notifikasi</h3>

        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        @if ($notifications->isEmpty())
            <div class="alert alert-info">Belum ada notifikasi.</div>
        @else
            <div class="d-flex justify-content-end mb-3">
                <form action="{{ route('notifications.readAll') }}" method="POST">
                    @csrf
                    <button type="submit" class="btn btn-sm btn-primary">
                        Tandai Semua Sudah Dibaca
                    </button>
                </form>
            </div>

            <ul class="list-group shadow-sm">
                @foreach ($notifications as $notification)
                    @php
                        $status = $notification->data['status'] ?? 'unknown';
                        $icon = 'fa-info-circle';
                        $color = 'text-secondary';

                        switch ($status) {
                            case 'Dikirim':
                                $icon = 'fa-paper-plane';
                                $color = 'text-success';
                                break;
                            case 'Dikoreksi':
                                $icon = 'fa-exclamation-triangle';
                                $color = 'text-warning';
                                break;
                            case 'Disetujui':
                                $icon = 'fa-check-circle';
                                $color = 'text-primary';
                                break;
                        }
                    @endphp

                    <li
                        class="list-group-item d-flex justify-content-between align-items-center 
                    {{ is_null($notification->read_at) ? 'list-group-item-light' : '' }}">
                        <div class="d-flex align-items-start">
                            <i class="fas {{ $icon }} {{ $color }} fa-lg me-3 mt-1"></i>
                            <div>
                                <strong>{{ $notification->data['title'] ?? 'Notifikasi' }}</strong><br>
                                <small>{{ $notification->data['message'] ?? '-' }}</small><br>
                                <small class="text-muted">{{ $notification->created_at->diffForHumans() }}</small>
                            </div>
                        </div>
                        <div>
                            @if (is_null($notification->read_at))
                                <form action="{{ route('notifications.read', $notification->id) }}" method="POST"
                                    class="d-inline">
                                    @csrf
                                    <button type="submit" class="btn btn-sm btn-outline-success">
                                        Tandai Dibaca
                                    </button>
                                </form>
                            @endif
                        </div>
                    </li>
                @endforeach
            </ul>
        @endif
    </div>
@endsection
