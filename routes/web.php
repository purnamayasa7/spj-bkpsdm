<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KelengkapanController;
use App\Http\Controllers\SpjController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SpjFileController;
use App\Models\Kelengkapan;
use App\Models\Spj;
use Illuminate\Routing\RouteRegistrar;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

/*
| Route Auth
*/

Route::get('/', [AuthController::class, 'login']);
Route::get('/login', [AuthController::class, 'login'])->name('login');
Route::post('/login', [AuthController::class, 'authenticate'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

/*
| Route Register & User Management - Keuangan
*/

Route::get('/register', [AuthController::class, 'registerView'])->middleware('role:Keuangan');
Route::post('/register', [AuthController::class, 'register'])->middleware('role:Keuangan');
Route::get('/user', [UserController::class, 'index'])->middleware('role:Keuangan');
Route::get('/profile', [UserController::class, 'profile_view'])->middleware('role:Keuangan,Bidang');
Route::post('/profile/{id}', [UserController::class, 'update_profile'])->middleware('role:Keuangan,Bidang');
Route::get('/change-password', [UserController::class, 'change_password_view'])->middleware('role:Keuangan,Bidang');
Route::post('/change-password/{id}', [UserController::class, 'change_password'])->middleware('role:Keuangan,Bidang');

/*
| Dashboard (Bisa untuk dua role)
*/

Route::get('/dashboard', function () {
    return view('pages.dashboard');
})->middleware('role:Keuangan,Bidang');

Route::get('/spj/{id}/download-zip', [SpjController::class, 'downloadZip'])->name('spj.downloadZip')->middleware('role:Keuangan,Bidang');

Route::get('/spj/search-results', [SpjController::class, 'searchResults'])
    ->name('spj.searchResults');

Route::get('/spj/export/pdf', [SpjController::class, 'exportPdf'])->name('spj.export.pdf');
Route::get('/spj/export/excel', [SpjController::class, 'exportExcel'])->name('spj.export.excel');
Route::get('/activity', [ActivityController::class, 'index'])->name('activity.index');
Route::get('/activity/export/pdf', [ActivityController::class, 'exportPDF'])->name('activity.export.pdf');
Route::get('/activity/export/excel', [ActivityController::class, 'exportExcel'])->name('activity.export.excel');
Route::get('/calendar/spj', [CalendarController::class, 'index'])->name('calendar.spj');
Route::get('/calendar/spj/events', [CalendarController::class, 'events'])->name('calendar.events');



/*
| Route SPJ - Keuangan
*/
Route::prefix('keuangan')->middleware('role:Keuangan')->group(function () {
    Route::get('/spj', [SpjController::class, 'indexKeuangan'])->name('spj.keuangan.index');
    Route::get('/spj/disetujui', [SpjController::class, 'indexKeuanganDisetujui'])->name('spj.keuangan.disetujui');
    Route::get('/spj/{id}/review', [SpjController::class, 'review'])->name('spj.keuangan.review');
    Route::post('/spj/{id}/review', [SpjController::class, 'submitReview'])->name('spj.keuangan.review.submit');
    Route::get('/backup', [BackupController::class, 'index'])->name('backup.index');
    Route::get('/backup/run', [BackupController::class, 'runBackup'])->name('backup.run');
    // Route::post('/backup/run', [BackupController::class, 'runBackup'])->name('backup.run');
    Route::get('/backup/download', [BackupController::class, 'download'])->name('backup.download');
});


/*
| Route SPJ - Bidang
*/

Route::get('/spj', [SpjController::class, 'index'])->middleware('role:Bidang')->name('spj.index');
Route::get('/spj/create', [SpjController::class, 'create']);
Route::post('/spj', [SpjController::class, 'store']);
Route::put('/spj/{id}', [SpjController::class, 'update']);
Route::delete('/spj/{id}', [SpjController::class, 'delete']);
Route::get('/spj/{id}/edit', [SpjController::class, 'edit'])->name('spj.edit');
Route::post('/spj/{id}/update', [SpjController::class, 'update'])->name('spj.update');
Route::get('/spj/{id}', [SpjController::class, 'show'])->name('spj.show');


/*
| Route SPJ - Kelengkapan
*/
Route::post('/kelengkapan', [KelengkapanController::class, 'store']);
Route::put('/kelengkapan/{id}', [KelengkapanController::class, 'update']);
Route::delete('/kelengkapan/{id}', [KelengkapanController::class, 'delete']);

Route::middleware(['auth'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.readAll');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::get('/notifications/{id}/open', [NotificationController::class, 'open'])->name('notifications.open');
    Route::get('spj/{id}/pdf/{index}', [SpjFileController::class, 'view'])->name('spj.pdf');
});

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
