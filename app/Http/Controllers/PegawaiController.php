<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Pegawai;
use Illuminate\Foundation\Auth\User as AuthUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PegawaiController extends Controller
{
    public function index()
    {
        // $pegawais = Pegawai::orderBy('nama')->get();

        $pegawais = Pegawai::with('user')
            ->orderBy('id')
            ->get();

        return view('pages.pegawai.pegawai', compact('pegawais'));
    }

    public function create()
    {
        return view('pages.pegawai.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nip' => 'required|unique:pegawais,nip',
            'nama' => 'required',
            'jabatan' => 'required',
            'golongan' => 'required',
            'pangkat' => 'required',
            'bidang' => 'required',
        ]);

        DB::beginTransaction();

        try {
            $pegawai = Pegawai::create([
                'nip'      => $request->nip,
                'nama'     => $request->nama,
                'jabatan'  => $request->jabatan,
                'golongan' => $request->golongan,
                'pangkat'  => $request->pangkat,
                'bidang'   => $request->bidang,
                'aktif'    => true,
            ]);

            $user = User::where('nip', $request->nip)->first();

            if ($user && !$user->pegawai_id) {
                $user->pegawai_id = $pegawai->id;
                $user->save();
            }

            DB::commit();

            return redirect()
                ->route('keuangan.pegawai.index')
                ->with(
                    'success',
                    $user
                        ? 'Pegawai berhasil ditambahkan & user otomatis terhubung'
                        : 'Pegawai berhasil ditambahkan'
                );
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()->with('error', 'Terjadi kesalahan saat menyimpan data');
        }
    }

    public function show(Pegawai $pegawai)
    {
        return view('pegawai.show', compact('pegawai'));
    }

    public function update(Request $request, Pegawai $pegawai)
    {
        $request->validate([
            'nip'       => 'required|unique:pegawais,nip,' . $pegawai->id,
            'nama'      => 'required',
            'jabatan'   => 'required',
            'golongan'  => 'required',
            'pangkat'   => 'required',
            'bidang'    => 'required',
            'aktif'     => 'required',
            'ttd_path'  => 'required',
        ]);

        $pegawai->update([
            'nip'       => $request->nip,
            'nama'      => $request->nama,
            'jabatan'   => $request->jabaran,
            'golongan'  => $request->golongan,
            'pangkat'   => $request->pangkat,
            'bidang'    => $request->bidang,
            'aktif'     => $request->aktif,
            'ttd_path'  => $request->ttd_path,
        ]);

        return redirect()->route('pegawai.index')->with('success', 'Data pegawai berhasil diperbarui');
    }

    public function destroy(Pegawai $pegawai)
    {
        $pegawai->delete();

        return redirect()->route('pegawai.index')->with('success', 'Data pegawai berhasil dihapus');
    }

    public function assignUser(Request $request)
    {
        $request->validate([
            'pegawai_id' => 'required|exists:pegawais,id',
            'user_id'    => 'required|exists:users,id',
        ]);

        $pegawai = Pegawai::with('user')->findOrFail($request->pegawai_id);

        if ($pegawai->user) {
            return back()->with('error', 'Pegawai ini sudah memiliki user');
        }

        $user = User::findOrFail($request->user_id);

        if ($user->pegawai_id) {
            return back()->with('error', 'User sudah terhubung dengan pegawai lain');
        }

        $user->pegawai_id = $pegawai->id;
        $user->save();

        return back()->with('success', 'User berhasil dihubungkan ke pegawai');
    }

    public function unassignUser(Request $request)
    {
        $request->validate([
            'pegawai_id' => 'required|exists:pegawais,id',
        ]);

        $pegawai = Pegawai::with('user')->findOrFail($request->pegawai_id);

        if (!$pegawai->user) {
            return back()->with('error', 'Pegawai ini belum memiliki user');
        }

        $pegawai->user->pegawai_id = null;
        $pegawai->user->save();

        return back()->with('success', 'User berhasil dilepas dari pegawai');
    }

    public function checkUserByNip(Request $request)
    {
        $request->validate([
            'nip' => 'required'
        ]);

        $user = User::where('nip', $request->nip)->first();

        if ($user) {
            return response()->json([
                'exists' => true,
                'data' => [
                    'nip' => $user->nip,
                    'nama' => $user->name,
                    'bidang' => $user->bidang ?? '-',
                ]
            ]);
        }

        return response()->json([
            'exists' => false
        ]);
    }
}
