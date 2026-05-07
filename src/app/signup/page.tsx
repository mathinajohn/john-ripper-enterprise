"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // DEBUG: Check if the button is even firing
        console.log("Registration attempt started for:", formData.email);

        // 1. Validation Checks
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!formData.acceptTerms) {
            setError("You must accept the Terms & Conditions to proceed.");
            return;
        }

        // 2. Database Simulation
        const existingUsersJson = localStorage.getItem('registeredUsers');
        const users = existingUsersJson ? JSON.parse(existingUsersJson) : [];

        // 3. Check if email already exists
        const userExists = users.find((u: any) => u.email === formData.email);
        if (userExists) {
            setError("Identity already exists. Please use a different email or sign in.");
            return;
        }

        // 4. Create New User Entry
        const newUser = {
            id: `USR-${Date.now()}`,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            timestamp: new Date().toISOString()
        };

        // 5. Update Storage
        const updatedUsers = [...users, newUser];
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        localStorage.setItem('activeUser', JSON.stringify(newUser));

        console.log("New operator registered successfully.");

        // 6. Success Feedback & Redirect
        setIsRegistered(true);

        setTimeout(() => {
            router.push('/'); // Redirects to your selection hub
        }, 2500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            {!isRegistered ? (
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                    <div className="bg-slate-900 p-8 text-center border-b-4 border-orange-600">
                        <h2 className="text-white text-2xl font-black uppercase tracking-tighter">Create Account</h2>
                        <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Join John Ripper Co. Ltd</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-4">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-[10px] font-black uppercase italic animate-bounce">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-black uppercase text-slate-500 mb-1">Full Name</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-600 outline-none transition text-slate-900"
                                placeholder="John Doe"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase text-slate-500 mb-1">Email Address</label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-600 outline-none transition text-slate-900"
                                placeholder="name@company.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-500 mb-1">Password</label>
                                <input
                                    required
                                    type="password"
                                    value={formData.password}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-600 outline-none transition text-slate-900"
                                    placeholder="••••••••"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-500 mb-1">Confirm Password</label>
                                <input
                                    required
                                    type="password"
                                    value={formData.confirmPassword}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-600 outline-none transition text-slate-900"
                                    placeholder="••••••••"
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 py-2">
                            <input
                                required
                                type="checkbox"
                                id="terms"
                                checked={formData.acceptTerms}
                                className="mt-1 h-4 w-4 accent-orange-600 cursor-pointer"
                                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                            />
                            <label htmlFor="terms" className="text-[11px] text-slate-500 leading-tight">
                                I agree to the <span className="text-orange-600 font-bold underline cursor-pointer">Terms of Service</span> and <span className="text-orange-600 font-bold underline cursor-pointer">Privacy Policy</span>.
                            </label>
                        </div>

                        <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-orange-600 transition shadow-lg active:scale-95 uppercase tracking-widest text-sm">
                            Register Account
                        </button>

                        <p className="text-center text-sm text-slate-500">
                            Already have an account? <Link href="/login" className="text-orange-600 font-bold hover:underline">Sign In</Link>
                        </p>
                    </form>
                </div>
            ) : (
                <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-2xl border-b-8 border-orange-600 text-center animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase italic">Welcome!</h2>
                    <p className="text-slate-500 font-bold mt-2">Account Sector Created Successfully.</p>

                    <div className="mt-10">
                        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Redirecting to Control Center...</p>
                    </div>
                </div>
            )}
        </div>
    );
}