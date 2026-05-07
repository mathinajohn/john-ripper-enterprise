"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('activeUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('activeUser');
        setUser(null);
        window.location.reload();
    };

    return (
        <nav className="flex justify-between items-center px-10 py-6 border-b border-slate-100 bg-white sticky top-0 z-50">
            <div className="text-2xl font-black italic tracking-tighter uppercase">
                ENTERPRISE <span className="text-orange-600">FASHION</span>
            </div>

            <div className="flex items-center gap-6">
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase text-slate-400">
                            Operator: <span className="text-slate-900">{user.name}</span>
                        </span>
                        <button
                            onClick={handleSignOut}
                            className="text-[10px] font-black uppercase text-red-500 border border-red-100 px-4 py-2 rounded-lg hover:bg-red-50"
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">
                            Sign In
                        </Link>
                        <Link href="/signup" className="bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}