"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// CRITICAL: This must be "export default" to fix your error
export default function AdminDashboard() {
    const [adminName, setAdminName] = useState("ADMIN_OPERATOR");

    useEffect(() => {
        const storedUser = localStorage.getItem('activeUser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setAdminName(parsedUser.name.toUpperCase());
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            {/* Admin Header */}
            <header className="bg-[#0b0f1a] text-white p-6 flex justify-between items-center shadow-xl">
                <div>
                    <h1 className="text-xl font-black italic tracking-tighter">
                        JOHN RIPPER <span className="text-orange-600">ADMIN</span>
                    </h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        System Overseer: {adminName}
                    </p>
                </div>
                <Link href="/" className="text-xs font-bold border border-slate-700 px-4 py-2 rounded-lg hover:bg-white hover:text-black transition-all">
                    BACK TO SITE
                </Link>
            </header>

            <main className="p-8 max-w-7xl mx-auto w-full">
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Stats Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Fashion Orders</p>
                        <h3 className="text-3xl font-black mt-2 text-slate-900">124</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Machinery Units</p>
                        <h3 className="text-3xl font-black mt-2 text-slate-900">12</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-500 text-xs font-black uppercase tracking-widest">System Status</p>
                        <h3 className="text-3xl font-black mt-2 text-green-600 italic">EXCELLENT</h3>
                    </div>
                </div>

                {/* Placeholder for Order Tracking Table */}
                <div className="mt-8 bg-white rounded-3xl p-10 border border-slate-200 min-h-[400px] flex items-center justify-center">
                    <p className="text-slate-400 font-bold italic uppercase tracking-tighter text-xl">
                        [ SECURE ACCESS: Order Management Matrix Ready ]
                    </p>
                </div>
            </main>
        </div>
    );
}