<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\DaftarPenerimaanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KelengkapanController;
use App\Http\Controllers\KuitansiController;
use App\Http\Controllers\LampiranSpdController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\SpjController;
use App\Http\Controllers\SpjFileController;
use App\Http\Controllers\SpjHistoryController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {

    Route::get('/', [AuthController::class, 'login']);

    Route::get('/login', [AuthController::class, 'login'])
        ->name('login');

    Route::post('/login', [AuthController::class, 'authenticate'])
        ->name('login.post');
});

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

/*
|--------------------------------------------------------------------------
| SHARED ROUTES
| Keuangan & Bidang
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:Keuangan,Bidang'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/dashboard/data', [DashboardController::class, 'data'])
        ->name('dashboard.data');

    /*
    |--------------------------------------------------------------------------
    | Profile
    |--------------------------------------------------------------------------
    */

    Route::get('/profile', [UserController::class, 'profile_view'])
        ->name('profile');

    Route::post('/profile/{id}', [UserController::class, 'update_profile'])
        ->name('profile.update');

    Route::get('/change-password', [UserController::class, 'change_password_view'])
        ->name('password.change');

    Route::post('/change-password/{id}', [UserController::class, 'change_password'])
        ->name('password.update');

    /*
    |--------------------------------------------------------------------------
    | SPJ Shared
    |--------------------------------------------------------------------------
    */

    Route::get('/spj/{id}/download-zip', [SpjController::class, 'downloadZip'])
        ->name('spj.downloadZip');

    Route::get('/spj/search-results', [SpjController::class, 'searchResults'])
        ->name('spj.searchResults');

    Route::get('/spj/export/pdf', [SpjController::class, 'exportPdf'])
        ->name('spj.export.pdf');

    Route::get('/spj/export/excel', [SpjController::class, 'exportExcel'])
        ->name('spj.export.excel');

    /*
    |--------------------------------------------------------------------------
    | Activity
    |--------------------------------------------------------------------------
    */

    Route::get('/activity', [ActivityController::class, 'index'])
        ->name('activity.index');

    Route::get('/activity/export/pdf', [ActivityController::class, 'exportPDF'])
        ->name('activity.export.pdf');

    Route::get('/activity/export/excel', [ActivityController::class, 'exportExcel'])
        ->name('activity.export.excel');

    /*
    |--------------------------------------------------------------------------
    | Calendar
    |--------------------------------------------------------------------------
    */

    Route::get('/calendar/spj', [CalendarController::class, 'index'])
        ->name('calendar.spj');

    Route::get('/calendar/spj/events', [CalendarController::class, 'events'])
        ->name('calendar.events');

    /*
    |--------------------------------------------------------------------------
    | Notifications
    |--------------------------------------------------------------------------
    */

    Route::prefix('notifications')
        ->name('notifications.')
        ->group(function () {

            Route::get('/', [NotificationController::class, 'index'])
                ->name('index');

            Route::post('/read-all', [NotificationController::class, 'markAllAsRead'])
                ->name('readAll');

            Route::post('/{id}/read', [NotificationController::class, 'markAsRead'])
                ->name('read');

            Route::get('/{id}/open', [NotificationController::class, 'open'])
                ->name('open');
        });

    /*
    |--------------------------------------------------------------------------
    | SPJ File & History
    |--------------------------------------------------------------------------
    */

    Route::get('/spj/{id}/pdf/{index}', [SpjFileController::class, 'view'])
        ->name('spj.pdf');

    Route::get('/spj/file/{kelengkapan}', [SpjController::class, 'viewFile'])
        ->name('spj.file.view');

    Route::get('/spj-history', [SpjHistoryController::class, 'index'])
        ->name('spj.history.index');

    Route::get('/spj/{spj}/history', [SpjHistoryController::class, 'show'])
        ->name('spj.history.show');
});

/*
|--------------------------------------------------------------------------
| KEUANGAN ROUTES
|--------------------------------------------------------------------------
*/

Route::prefix('keuangan')
    ->name('keuangan.')
    ->middleware(['auth', 'role:Keuangan'])
    ->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Register & User
        |--------------------------------------------------------------------------
        */

        Route::get('/register', [AuthController::class, 'registerView'])
            ->name('register');

        Route::post('/register', [AuthController::class, 'register'])
            ->name('register.store');

        Route::get('/user', [UserController::class, 'index'])
            ->name('user.index');

        /*
        |--------------------------------------------------------------------------
        | SPJ
        |--------------------------------------------------------------------------
        */

        Route::prefix('spj')
            ->name('spj.')
            ->group(function () {

                Route::get('/', [SpjController::class, 'indexKeuangan'])
                    ->name('index');

                Route::get('/disetujui', [SpjController::class, 'indexKeuanganDisetujui'])
                    ->name('disetujui');

                Route::get('/{id}/review', [SpjController::class, 'review'])
                    ->name('review');

                Route::post('/{id}/review', [SpjController::class, 'submitReview'])
                    ->name('review.submit');

                Route::get('/{id}/checklist-pdf', [SpjController::class, 'checklistPdf'])
                    ->name('checklist.pdf');
            });

        /*
        |--------------------------------------------------------------------------
        | Backup
        |--------------------------------------------------------------------------
        */

        Route::prefix('backup')
            ->name('backup.')
            ->group(function () {

                Route::get('/', [BackupController::class, 'index'])
                    ->name('index');

                Route::get('/run', [BackupController::class, 'runBackup'])
                    ->name('run');

                Route::get('/download', [BackupController::class, 'download'])
                    ->name('download');
            });

        /*
        |--------------------------------------------------------------------------
        | Pegawai
        |--------------------------------------------------------------------------
        */

        Route::prefix('pegawai')
            ->name('pegawai.')
            ->group(function () {

                Route::get('/', [PegawaiController::class, 'index'])
                    ->name('index');

                Route::get('/create', [PegawaiController::class, 'create'])
                    ->name('create');

                Route::post('/', [PegawaiController::class, 'store'])
                    ->name('store');

                Route::post('/assign-user', [PegawaiController::class, 'assignUser'])
                    ->name('assign-user');

                Route::post('/unassign-user', [PegawaiController::class, 'unassignUser'])
                    ->name('unassign-user');

                Route::post('/check-nip-user', [PegawaiController::class, 'checkUserByNip'])
                    ->name('check-nip-user');

                Route::get('/{pegawai}', [PegawaiController::class, 'show'])
                    ->name('show');

                Route::get('/{pegawai}/edit', [PegawaiController::class, 'edit'])
                    ->name('edit');

                Route::put('/{pegawai}', [PegawaiController::class, 'update'])
                    ->name('update');

                Route::delete('/{pegawai}', [PegawaiController::class, 'destroy'])
                    ->name('destroy');
            });
    });

/*
|--------------------------------------------------------------------------
| BIDANG ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:Bidang'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | SPJ
    |--------------------------------------------------------------------------
    */

    Route::prefix('spj')
        ->name('spj.')
        ->group(function () {

            Route::get('/', [SpjController::class, 'index'])
                ->name('index');

            Route::get('/create', [SpjController::class, 'create'])
                ->name('create');

            Route::post('/', [SpjController::class, 'store'])
                ->name('store');

            Route::get('/{id}', [SpjController::class, 'show'])
                ->name('show');

            Route::get('/{id}/edit', [SpjController::class, 'edit'])
                ->name('edit');

            Route::put('/{id}', [SpjController::class, 'update'])
                ->name('update');

            Route::delete('/{id}', [SpjController::class, 'delete'])
                ->name('delete');
        });

    /*
    |--------------------------------------------------------------------------
    | Preview
    |--------------------------------------------------------------------------
    */

    Route::post('/kuitansi/preview', [KuitansiController::class, 'preview'])
        ->name('kuitansi.preview');

    Route::post('/daftar-penerimaan/preview', [DaftarPenerimaanController::class, 'preview'])
        ->name('daftar-penerimaan.preview');

    Route::post('/lampiran-spd/preview', [LampiranSpdController::class, 'preview'])
        ->name('lampiran-spd.preview');

    /*
    |--------------------------------------------------------------------------
    | Pegawai Search
    |--------------------------------------------------------------------------
    */

    Route::get('/pegawai/search', [PegawaiController::class, 'search'])
        ->name('pegawai.search');

    /*
    |--------------------------------------------------------------------------
    | Kelengkapan
    |--------------------------------------------------------------------------
    */

    Route::prefix('kelengkapan')
        ->name('kelengkapan.')
        ->group(function () {

            Route::post('/', [KelengkapanController::class, 'store'])
                ->name('store');

            Route::put('/{id}', [KelengkapanController::class, 'update'])
                ->name('update');

            Route::delete('/{id}', [KelengkapanController::class, 'delete'])
                ->name('delete');
        });
});