"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EnterpriseLanding() {
  const [firstName, setFirstName] = useState("GUEST");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('activeUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Handles both full names and single names safely
      const nameToDisplay = parsedUser.name ? parsedUser.name.split(' ')[0].toUpperCase() : "USER";
      setFirstName(nameToDisplay);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('activeUser');
    setIsLoggedIn(false);
    setFirstName("GUEST");
    router.push('/login');
  };

  // Helper to prevent guests from entering markets
  const protectedNavigation = (e: React.MouseEvent, path: string) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white flex flex-col relative overflow-hidden">

      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* HEADER */}
      <header className="w-full p-10 flex justify-between items-center z-20 relative">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-2xl font-black italic tracking-tighter leading-none">
            JOHN RIPPER
          </h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mt-1 uppercase">Co. Ltd</p>
        </Link>

        <nav className="hidden md:flex gap-8 items-center">
          <Link
            href="/products/fashion"
            onClick={(e) => protectedNavigation(e, '/products/fashion')}
            className="px-6 py-2 border-2 border-orange-600 rounded-xl text-[11px] font-black tracking-widest bg-orange-600 text-white hover:bg-transparent transition-all"
          >
            FASHION
          </Link>
          <Link
            href="/products/machinery"
            onClick={(e) => protectedNavigation(e, '/products/machinery')}
            className="text-[11px] font-black tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            MACHINERY
          </Link>

          <div className="h-4 w-[1px] bg-slate-700 mx-2"></div>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-black tracking-widest text-green-500">ONLINE: {firstName}</span>
              <button
                onClick={handleLogout}
                className="text-[10px] font-bold text-slate-500 hover:text-red-500 transition-colors"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/login" className="text-[11px] font-black tracking-widest text-slate-400 hover:text-white transition-colors">
                SIGN IN
              </Link>
              <Link href="/signup" className="text-[11px] font-black tracking-widest text-orange-500 hover:text-orange-400 transition-colors">
                SIGN UP
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="flex-grow flex flex-col justify-center px-12 relative z-10">
        <div className="max-w-6xl">
          <h2 className="text-[8vw] font-black uppercase italic leading-[0.85] tracking-tighter mb-8 animate-in slide-in-from-left duration-700">
            MULTI-SECTOR <br />
            <span className="text-orange-600">ENTERPRISE</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mt-4">
            {/* Fashion Portal */}
            <Link
              href="/products/fashion"
              onClick={(e) => protectedNavigation(e, '/products/fashion')}
              className="group p-8 border border-slate-800 bg-slate-900/50 rounded-3xl hover:border-orange-600 transition-all duration-500 hover:shadow-[0_0_30px_rgba(234,88,12,0.2)]"
            >
              <p className="text-orange-600 font-black tracking-widest text-xs mb-2 italic">SECTOR 01</p>
              <h3 className="text-3xl font-black italic mb-4">PREMIUM FASHION</h3>
              <p className="text-slate-400 text-sm font-bold leading-relaxed mb-6">
                Access the exclusive John Ripper suit collection and order tracking systems.
              </p>
              <div className="inline-block px-6 py-2 bg-white text-black font-black text-[10px] tracking-widest rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                ENTER MARKETPLACE
              </div>
            </Link>

            {/* Machinery Portal - NOW ACTIVE */}
            <Link
              href="/products/machinery"
              onClick={(e) => protectedNavigation(e, '/products/machinery')}
              className="group p-8 border border-slate-800 bg-slate-900/50 rounded-3xl hover:border-blue-500 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            >
              <p className="text-blue-500 font-black tracking-widest text-xs mb-2 italic">SECTOR 02</p>
              <h3 className="text-3xl font-black italic mb-4">HEAVY MACHINERY</h3>
              <p className="text-slate-400 text-sm font-bold leading-relaxed mb-6">
                Industrial logistics, hardware distribution, and heavy-duty equipment procurement.
              </p>
              <div className="inline-block px-6 py-2 bg-white text-black font-black text-[10px] tracking-widest rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                ENTER INDUSTRIAL
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER STATUS */}
      <footer className="p-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-2 h-2 rounded-full animate-pulse ${isLoggedIn ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">
            {isLoggedIn ? `Verified Identity: ${firstName}` : 'Guest Access Only - Identification Required'}
          </p>
        </div>
        <p className="text-[10px] font-black text-slate-700 tracking-[0.2em]">
          EST. 2026 // GLOBAL LOGISTICS
        </p>
      </footer>
    </div>
  );
}