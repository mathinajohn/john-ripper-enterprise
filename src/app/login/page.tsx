"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 1. Fetch the list of users
        const usersJson = localStorage.getItem('registeredUsers');
        const users = usersJson ? JSON.parse(usersJson) : [];

        // 2. Validate credentials
        const validUser = users.find(
            (u: any) => u.email === email && u.password === password
        );

        if (validUser) {
            // Success: Set this user as the active session
            localStorage.setItem('activeUser', JSON.stringify(validUser));

            // Trigger a storage event so the Home Page header updates immediately
            window.dispatchEvent(new Event('storage'));

            console.log("Access Authorized for:", validUser.name);

            // --- THE FIX IS HERE ---
            // Redirect to the Root Selection Hub instead of straight to Fashion
            router.push('/');

        } else {
            setError("ACCESS DENIED: No registered account found with these credentials.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a] px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                <div className="bg-slate-900 p-8 text-center border-b-4 border-orange-600">
                    <h2 className="text-white text-2xl font-black tracking-tighter uppercase italic">
                        John Ripper <span className="text-orange-600">Market</span>
                    </h2>
                    <div className="h-1 w-12 bg-orange-600 mx-auto mt-2"></div>
                    <p className="text-slate-400 text-[10px] font-bold mt-4 tracking-[0.3em] uppercase">
                        Secure Gateway Access
                    </p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-[10px] font-black uppercase italic animate-pulse">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-black uppercase text-slate-500 mb-2 tracking-widest">Operator Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-600 transition text-slate-900 font-medium"
                            placeholder="name@johnripper.co"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Security Key</label>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-600 transition text-slate-900"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white font-black py-5 rounded-xl hover:bg-orange-600 transition shadow-lg active:scale-[0.95] uppercase tracking-[0.2em] text-xs"
                    >
                        Authorize Access
                    </button>

                    <div className="pt-4 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">
                            New Operator? <Link href="/signup" className="text-orange-600 hover:underline ml-1">Initialize Registration</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}