import React from 'react';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-blue-950 flex flex-col justify-center items-center p-4 sm:p-6">
            <div className="w-full max-w-md">
                {/* Header Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex flex-col items-center">
                        <img
                            src="https://raw.githubusercontent.com/purnamayasa7/Images/main/KabBuleleng.png"
                            alt="Logo Kabupaten Buleleng"
                            className="w-16 h-16 object-contain mb-3 drop-shadow-md"
                        />
                        <h1 className="text-2xl font-bold text-white tracking-wide">
                            E-SPJ BKPSDM Buleleng
                        </h1>
                    </Link>
                </div>

                {/* Card Container */}
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/60 p-6 sm:p-8">
                    {title && (
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center mb-6">
                            {title}
                        </h2>
                    )}
                    {children}
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-slate-400 mt-6">
                    &copy; {new Date().getFullYear()} BKPSDM Kabupaten Buleleng. All rights reserved.
                </p>
            </div>
        </div>
    );
}
