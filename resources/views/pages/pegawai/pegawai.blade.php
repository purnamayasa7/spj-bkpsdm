@extends('layouts.app')

@section('content')
    <style>
        .dots::after {
            content: '';
            animation: dots 1.5s steps(4, end) infinite;
        }

        @keyframes dots {

            0%,
            20% {
                content: '';
            }

            40% {
                content: '.';
            }

            60% {
                content: '..';
            }

            80%,
            100% {
                content: '...';
            }
        }
    </style>

    <!-- Page Heading -->
    <div id="loadingText" style="text-align: center; padding: 20px; font-size: 16px; color: #555;">
        <div class="spinner-border text-secondary" role="status"
            style="width: 1.5rem; height: 1.5rem; vertical-align: middle;">
        </div>
        <span class="ms-2">Memuat data</span><span class="dots"></span>
    </div>

    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Data Pegawai</h1>
        <a href="pegawai/create" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-2">
            <i class="fas fa-plus fa-sm text-white-50"></i> Tambah Pegawai
        </a>
    </div>

    <div class="modal fade" id="assignUserModal" tabindex="-1">
        <div class="modal-dialog">
            <form id="assignForm" method="POST" action="{{ route('keuangan.pegawai.assign-user') }}">
                @csrf
                <input type="hidden" name="pegawai_id" id="pegawai_id">

                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Assign User ke Pegawai</h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">
                        <p class="mb-2">
                            Pegawai: <strong id="pegawai_nama"></strong>
                        </p>

                        <p class="mb-2">
                            NIP: <strong id="pegawai_nip"></strong>
                        </p>

                        <div class="mb-3">
                            <label class="form-label">Pilih User</label>
                            <select name="user_id" class="form-control" required>
                                <option value="">-- Pilih User --</option>
                                @foreach (\App\Models\User::whereNull('pegawai_id')->get() as $user)
                                    <option value="{{ $user->id }}">
                                        {{ $user->name }} ({{ $user->email }})
                                    </option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" id="btnOpenConfirmAssign">
                            Hubungkan
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <div class="modal fade" id="confirmAssignModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-body text-center">
                    Apakah anda yakin ingin menghubungkan user dengan pegawai ini?
                </div>

                <div class="modal-footer justify-content-center">
                    <button class="btn btn-secondary" data-dismiss="modal">
                        Kembali
                    </button>
                    <button class="btn btn-primary" id="btnSubmitAssign">
                        Hubungkan
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="unassignUserModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <form method="POST" action="{{ route('keuangan.pegawai.unassign-user') }}">
                @csrf
                <input type="hidden" name="pegawai_id" id="unassign_pegawai_id">

                <div class="modal-content">
                    <div class="modal-body text-center">
                        Apakah anda yakin ingin melepas user dari pegawai
                        <strong id="unassign_pegawai_nama"></strong>?
                    </div>

                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">
                            Kembali
                        </button>
                        <button type="submit" class="btn btn-danger">
                            Lepas User
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>


    {{-- Table --}}
    <div class="row">
        <div class="col">
            <div class="card shadow">
                <div class="card-body">
                    <table id="pegawaiTable" class="table table-responsive table-bordered table-hovered w-100"
                        style="font-size: 0.877rem; display:none;">
                        <thead>
                            <tr>
                                <th>NIP</th>
                                <th>Nama</th>
                                <th>Jabatan</th>
                                <th>Golongan</th>
                                <th>Pangkat</th>
                                <th>Bidang</th>
                                <th>Status Akun</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($pegawais as $item)
                                <tr>
                                    <td>{{ $item->nip }}</td>
                                    <td>{{ $item->nama }}</td>
                                    <td>{{ $item->jabatan }}</td>
                                    <td>{{ $item->golongan }}</td>
                                    <td>{{ $item->pangkat }}</td>
                                    <td>{{ $item->bidang }}</td>
                                    <td class="text-center">
                                        @if ($item->user)
                                            <span class="badge bg-success text-white px-3 py-2">Akun Terhubung</span>
                                        @else
                                            <span class="badge bg-secondary text-white px-3 py-2">Tidak Terhubung</span>
                                        @endif
                                    </td>
                                    <td>
                                        <div class="d-flex">
                                            <a href="#" class="btn btn-sm btn-warning mr-2" title="Edit">
                                                <i class="fas fa-pen"></i>
                                            </a>

                                            @if (!$item->user)
                                                {{-- ASSIGN --}}
                                                <button class="btn btn-sm btn-info mr-2 btn-open-assign"
                                                    data-id="{{ $item->id }}" data-nama="{{ $item->nama }}"
                                                    data-nip="{{ $item->nip }}" data-toggle="modal"
                                                    data-target="#assignUserModal">
                                                    <i class="fas fa-user-plus"></i>
                                                </button>
                                            @else
                                                {{-- DISABLED --}}
                                                {{-- <button class="btn btn-sm btn-secondary mr-2" disabled
                                                    title="Sudah Terhubung">
                                                    <i class="fas fa-user-check"></i>
                                                </button> --}}

                                                {{-- LEPAS --}}
                                                <button class="btn btn-sm btn-danger btn-open-unassign"
                                                    data-id="{{ $item->id }}" data-nama="{{ $item->nama }}"
                                                    data-toggle="modal" data-target="#unassignUserModal">
                                                    <i class="fas fa-user-slash"></i>
                                                </button>
                                            @endif
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', function() {

            //ASSIGN
            document.querySelectorAll('.btn-open-assign').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.getElementById('pegawai_id').value = this.dataset.id;
                    document.getElementById('pegawai_nama').innerText = this.dataset.nama;
                    document.getElementById('pegawai_nip').innerText = this.dataset.nip;
                });
            });

            // buka modal konfirmasi assign
            document.getElementById('btnOpenConfirmAssign')?.addEventListener('click', function() {
                $('#assignUserModal').modal('hide');
                $('#confirmAssignModal').modal('show');
            });

            // submit assign
            document.getElementById('btnSubmitAssign')?.addEventListener('click', function() {
                document.getElementById('assignForm').submit();
            });

            //UNASSIGN
            document.querySelectorAll('.btn-open-unassign').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.getElementById('unassign_pegawai_id').value = this.dataset.id;
                    document.getElementById('unassign_pegawai_nama').innerText = this.dataset.nama;
                });
            });

        });
    </script>
@endsection
