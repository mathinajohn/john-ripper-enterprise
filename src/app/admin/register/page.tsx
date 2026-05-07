"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// 1. Ensure you use "export default"
export default function AdminPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '' });

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        // Save to LocalStorage for the Market to "see" the user
        localStorage.setItem('activeUser', JSON.stringify({
            name: formData.name,
            email: formData.email,
            role: 'Operator'
        }));

        alert("IDENTITY CREATED: Access Granted.");
        router.push('/'); // Go back to Market
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
            <form onSubmit={handleRegister} className="bg-white p-10 rounded-[2rem] w-full max-w-md">
                <h2 className="text-2xl font-black uppercase italic mb-6">Create Operator Profile</h2>
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-4 border mb-4 rounded-xl"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Professional Email"
                    className="w-full p-4 border mb-6 rounded-xl"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <button className="w-full py-4 bg-orange-600 text-white font-black uppercase rounded-xl hover:bg-slate-800 transition-all">
                    Initialize Identity
                </button>
            </form>
        </div>
    );
}