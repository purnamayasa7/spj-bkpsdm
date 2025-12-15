@extends('layouts.app')

@section('content')
    <div class="container">
        <h3>Backup Database</h3>

        <div class="card mt-3">
            <div class="card-body">

                <p>
                    <strong>Terakhir Backup:</strong>
                    {{ $lastBackup ? $lastBackup->format('d-m-Y H:i') : 'Belum Pernah Backup' }}
                </p>

                @if ($lastBackup)
                    <p><strong>Ukuran Backup DB:</strong>
                        {{ number_format($lastSize / 1024, 2) }} KB
                    </p>
                @endif

                <form action="{{ route('backup.run') }}" method="POST">
                    @csrf
                    <button class="btn btn-primary">
                        Backup
                    </button>
                </form>
            </div>
        </div>

        @if (session('success'))
            <div class="alert alert-success mt-3">
                {{ session('success') }}
            </div>
        @endif
    </div>
@endsection
