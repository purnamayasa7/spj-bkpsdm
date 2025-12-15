<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Illuminate\Support\Facades\Artisan;

class BackupController extends Controller
{
    public function index()
    {
        $files = Storage::disk('local')->files('Laravel');

        $lastBackup = null;
        $lastSize = null;

        if (!empty($files)) {
            $lastFile = collect($files)->sort()->last();

            // Timestamp
            $timestamp = Storage::disk('local')->lastModified($lastFile);
            $lastBackup = \Carbon\Carbon::createFromTimestamp($timestamp)
                ->setTimezone(config('app.timezone'));

            // File size
            $lastSize = Storage::disk('local')->size($lastFile);
        }

        return view('pages.spj.backup', compact('lastBackup', 'lastSize'));
    }

    public function runBackup()
    {
        $dbHost = env('DB_HOST');
        $dbPort = env('DB_PORT');
        $dbUser = env('DB_USERNAME');
        $dbPass = env('DB_PASSWORD');
        $dbName = env('DB_DATABASE');

        // Nama file
        $fileName = 'backup-' . $dbName . '-' . date('Y-m-d-H-i-s') . '.sql';
        $zipName  = $fileName . '.zip';

        // Lokasi sementara
        $tempPath = storage_path('app/temp-backup/');
        if (!file_exists($tempPath)) mkdir($tempPath, 0777, true);

        $sqlPath = $tempPath . $fileName;
        $zipPath = $tempPath . $zipName;

        // Command mysqldump
        $command = sprintf(
            'mysqldump --host=%s --port=%s --user=%s --password="%s" %s > %s',
            $dbHost,
            $dbPort,
            $dbUser,
            $dbPass,
            $dbName,
            $sqlPath
        );

        // Jalankan backup
        exec($command, $output, $returnVar);

        if ($returnVar !== 0) {
            return back()->with('error', 'Gagal menjalankan mysqldump. Periksa konfigurasi server.');
        }

        // ZIP file
        $zip = new \ZipArchive;
        if ($zip->open($zipPath, \ZipArchive::CREATE) === TRUE) {
            $zip->addFile($sqlPath, $fileName);
            $zip->close();
        } else {
            return back()->with('error', 'Gagal membuat ZIP backup.');
        }

        // Hapus file SQL setelah di-zip
        unlink($sqlPath);

        // Download ZIP
        return response()->download($zipPath)->deleteFileAfterSend(true);
    }



    // public function runBackup()
    // {
    //     $backupFolder = 'Laravel';

    //     // 1. Hapus backup lama sebelum membuat backup baru
    // $oldBackups = Storage::disk('local')->files($backupFolder);
    // foreach ($oldBackups as $file) {
    //     Storage::disk('local')->delete($file);
    // }

    //     Artisan::call('backup:run --only-db');

    //     // Tunggu sebentar agar file benar-benar dibuat (Spatie butuh 1–2 detik)
    //     sleep(2);



    //     $files = Storage::disk('local')->files($backupFolder);

    //     if (empty($files)) {
    //         return redirect()->back()->with('error', 'Backup gagal dibuat.');
    //     }

    //     $latest = collect($files)->sort()->last();

    //     $filePath = storage_path('app/private/' . $latest);

    //     if (!file_exists($filePath)) {
    //         return redirect()->back()->with('error', 'File backup tidak ditemukan.');
    //     }

    //     return response()->download($filePath, basename($latest));
    // }


    // public function runBackup2()
    // {
    //     // Folder backup default SPATIE
    //     $backupFolder = 'Laravel';

    //     // 1. Hapus backup lama
    //     $oldBackups = Storage::disk('local')->files($backupFolder);
    //     foreach ($oldBackups as $file) {
    //         Storage::disk('local')->delete($file);
    //     }

    //     Artisan::call('backup:run --only-db');

    //     return redirect()->back()->with('success', 'Backup database berhasil dibuat!');
    // }

    public function getLastBackup()
    {
        $disk = Storage::disk('private');

        $files = collect($disk->files('laravel'));

        if ($files->isEmpty()) {
            return null;
        }

        $latest = $files->sortByDesc(function ($file) use ($disk) {
            return $disk->lastModified($file);
        })->first();

        return [
            'file' => $latest,
            'time' => Carbon::createFromTimestamp($disk->lastModified($latest)),
            'size' => $disk->size($latest)
        ];
    }
}
