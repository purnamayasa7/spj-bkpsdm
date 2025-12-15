<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $user = User::all();
        return view('pages.spj.user', compact('user'));
    }

    public function update_profile(Request $request, $userId)
    {
        $validatedData = $request->validate([
            'name' => 'required',
            'email' => 'required',
            'bidang' => 'required',
        ]);

        $user = User::findOrFail($userId);
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->bidang = $request->input('bidang');
        $user->save();

        return redirect('/dashboard')->with('success', 'Berhasil mengubah data');
    }

    public function profile_view()
    {
        return view('pages.profile.index');
    }

    public function change_password_view()
    {
        return view('pages.profile.change-password');
    }

    public function change_password(Request $request, $userId)
    {
        $request->validate([
            'old_password' => 'required',
            'new_password' => 'required',
        ]);

        $user = User::findOrFail($userId);

    
    if (!Hash::check($request->input('old_password'), $user->password)) {
        return back()->with('error', 'Password lama tidak sesuai.');
    }

    $user->password = Hash::make($request->input('new_password'));
    $user->save();

    return redirect('/dashboard')->with('success', 'Password berhasil diubah.');
    }
}
