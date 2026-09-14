<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

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

        return Inertia::render('Backup/Index', [
            'lastBackup' => $lastBackup ? $lastBackup->format('d-m-Y H:i') : null,
            'lastSize'   => $lastSize ? round($lastSize / 1024, 2) : null,
        ]);
    }

    public function runBackup()
    {
        $dbHost = config('database.connections.mysql.host', '127.0.0.1');
        $dbPort = config('database.connections.mysql.port', '3306');
        $dbUser = config('database.connections.mysql.username', 'root');
        $dbPass = config('database.connections.mysql.password', '');
        $dbName = config('database.connections.mysql.database');

        if (empty($dbName)) {
            return back()->with('error', 'Nama basis data tidak ditemukan dalam konfigurasi sistem.');
        }

        // Cari lokasi binary mysqldump jika di Linux
        $dumpBinary = 'mysqldump';
        if (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN') {
            foreach (['/usr/bin/mysqldump', '/usr/local/bin/mysqldump', '/usr/bin/mariadb-dump'] as $binaryPath) {
                if (file_exists($binaryPath) && is_executable($binaryPath)) {
                    $dumpBinary = $binaryPath;
                    break;
                }
            }
        }

        // Nama file
        $fileName = 'backup-' . $dbName . '-' . date('Y-m-d-H-i-s') . '.sql';
        $zipName  = $fileName . '.zip';

        // Lokasi sementara
        $tempPath = storage_path('app/temp-backup/');
        if (!file_exists($tempPath)) {
            mkdir($tempPath, 0775, true);
        }

        $sqlPath      = $tempPath . $fileName;
        $zipPath      = $tempPath . $zipName;
        $errorLogPath = $tempPath . 'dump-error.log';

        $cmd = [
            $dumpBinary,
            '--host=' . $dbHost,
            '--port=' . (string) $dbPort,
            '--user=' . $dbUser,
            '--no-tablespaces',
            $dbName,
        ];

        $descriptorspec = [
            0 => ['pipe', 'r'],
            1 => ['file', $sqlPath, 'w'],
            2 => ['file', $errorLogPath, 'w'],
        ];

        // Gunakan variabel lingkungan MYSQL_PWD agar password tidak bocor ke process list
        // dan tidak rusak akibat karakter khusus shell
        putenv("MYSQL_PWD={$dbPass}");
        $process = proc_open($cmd, $descriptorspec, $pipes, null, null);

        $returnVar = -1;
        if (is_resource($process)) {
            if (isset($pipes[0]) && is_resource($pipes[0])) {
                fclose($pipes[0]);
            }
            $returnVar = proc_close($process);
        }

        if ($returnVar !== 0 || !file_exists($sqlPath) || filesize($sqlPath) === 0) {
            $errorMsg = file_exists($errorLogPath) ? trim(file_get_contents($errorLogPath)) : '';
            if (empty($errorMsg)) {
                $errorMsg = 'Pastikan utilitas mysqldump terpasang di server (misal: sudo apt install mysql-client) dan user database memiliki hak akses.';
            }

            @unlink($sqlPath);
            @unlink($errorLogPath);

            return back()->with('error', 'Gagal menjalankan mysqldump: ' . $errorMsg);
        }

        @unlink($errorLogPath);

        // ZIP file
        $zip = new \ZipArchive;
        if ($zip->open($zipPath, \ZipArchive::CREATE) === TRUE) {
            $zip->addFile($sqlPath, $fileName);
            $zip->close();
        } else {
            @unlink($sqlPath);
            return back()->with('error', 'Gagal membuat berkas arsip ZIP backup.');
        }

        // Hapus file SQL setelah di-zip
        @unlink($sqlPath);

        // Simpan juga salinan di storage/app/Laravel agar riwayat backup di dashboard ter-update
        try {
            Storage::disk('local')->makeDirectory('Laravel');
            Storage::disk('local')->put('Laravel/' . $zipName, file_get_contents($zipPath));
        } catch (\Exception $e) {}

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
