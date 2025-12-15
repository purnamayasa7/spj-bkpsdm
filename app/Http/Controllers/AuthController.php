<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login()
    {
        if (Auth::check()) {
            return redirect('/dashboard');
        }

        return view('pages.auth.login');
    }
    
    public function authenticate(Request $request)
    {
        if (Auth::check()) {
        return back();
    }

    $credentials = $request->validate([
        'nip' => 'required|digits:18',
        'password' => 'required',
    ]);

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();

        $user = Auth::user();
        $roleName = $user->role->name ?? '';

      
        return redirect()->intended('/dashboard');
    }

    return back()->withErrors([
        'nip' => 'Terjadi kesalahan, periksa kembali username atau password anda.',
    ])->onlyInput('nip');
    }

    public function registerView(){
        return view('pages.auth.register');
    }

    public function register(Request $request){
       

        $validated = $request->validate([
        'nip' => 'required',
        'name' => 'required',
        'email' => 'required|email',
        'password' => 'required',
        'role_id' => 'required',
        'bidang' => 'required',
    ]);

    // Konversi manual
    $role_id = match ($request->input('role_id')) {
        'Keuangan' => 1,
        'Bidang' => 2,
        default => null,
    };

    if (!$role_id) {
        return back()->withErrors(['role_id' => 'Role tidak valid']);
    }

    $user = new User();
    $user->nip = $request->nip;
    $user->name = $request->name;
    $user->email = $request->email;
    $user->password = Hash::make($request->password);
    $user->role_id = $role_id;
    $user->bidang = $request->bidang;
    $user->save();

    logActivity('Create', "Membuat User Baru {$user->nip}", 'spj');

    return redirect('/register')->with('success', 'Berhasil mendaftarkan akun');
    }

    public function logout(Request $request)
    {  
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
