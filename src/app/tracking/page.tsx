"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TrackingPage() {
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        const checkOrder = () => {
            const savedOrder = localStorage.getItem('activeOrder');
            if (savedOrder) {
                setOrder(JSON.parse(savedOrder));
            }
        };
        checkOrder();
        window.addEventListener('storage', checkOrder);
        const interval = setInterval(checkOrder, 2000);
        return () => {
            window.removeEventListener('storage', checkOrder);
            clearInterval(interval);
        };
    }, []);

    if (!order) return null;

    const steps = [
        { id: 1, label: "Placed" },
        { id: 2, label: "Confirmed" },
        { id: 3, label: "Shipped" },
        { id: 4, label: "Delivered" }
    ];

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 flex flex-col h-[85vh]">

                {/* NAVY HEADER */}
                <div className="bg-[#0f172a] p-8 text-white flex justify-between items-center shrink-0">
                    <div>
                        <p className="text-orange-500 text-[10px] font-black uppercase tracking-[.3em] mb-1">Live Tracking</p>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase">{order.id}</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated Delivery</p>
                        <p className="text-sm font-black uppercase italic text-orange-500">
                            {order.date}
                        </p>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">

                    {/* LEFT SIDE: PRODUCT SECTION */}
                    <div className="w-[45%] h-full bg-slate-50 flex flex-col p-8 gap-6 border-r border-slate-100 overflow-y-auto">

                        {/* HIGH VISIBILITY BACK BUTTON */}
                        <Link href="/fashion" className="group flex items-center justify-center gap-3 py-3 px-6 border-2 border-orange-600 rounded-xl bg-white hover:bg-orange-600 transition-all duration-300 shadow-sm">
                            <span className="text-orange-600 group-hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                                ← Back to Market
                            </span>
                        </Link>

                        {/* PRODUCT IMAGE CONTAINER */}
                        <div className="aspect-[4/3] rounded-[2.5rem] bg-white border border-slate-200 shadow-inner overflow-hidden relative group shrink-0">
                            <img
                                src={order.image}
                                className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-700"
                                alt={order.name}
                            />
                        </div>

                        {/* NEW: PAYMENT STATUS CARD */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">Transaction Protocol</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-lg">
                                        {order.payment === 'Mobile Money' ? '📱' : '🤝'}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase text-slate-900 leading-tight">
                                            {order.payment || "Verification Required"}
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                                            {order.payment === 'Mobile Money' ? 'Electronic Settlement' : 'Cash Settlement'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${order.payment === 'Mobile Money' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        {order.payment === 'Mobile Money' ? 'Verified' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: TRACKING */}
                    <div className="w-[55%] flex flex-col justify-center p-16 bg-white">
                        <div className="mb-16">
                            <h3 className="text-4xl font-black uppercase italic text-slate-900 tracking-tighter leading-none">
                                {order.name}
                            </h3>
                            <div className="flex items-center gap-4 mt-4">
                                <span className="px-3 py-1 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded">
                                    Size {order.size}
                                </span>
                                <span className="text-2xl font-black text-slate-900 italic">
                                    {order.price}
                                </span>
                            </div>
                        </div>

                        <div className="relative w-full">
                            {/* Process Track */}
                            <div className="absolute top-[12px] left-0 w-full h-[4px] bg-slate-100 rounded-full" />
                            <div
                                className="absolute top-[12px] left-0 h-[4px] bg-orange-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(234,88,12,0.3)]"
                                style={{ width: `${((order.step - 1) / (steps.length - 1)) * 100}%` }}
                            />

                            <div className="relative flex justify-between">
                                {steps.map((step) => (
                                    <div key={step.id} className="flex flex-col items-center">
                                        <div className={`z-10 w-7 h-7 rounded-full border-[5px] transition-all duration-500 
                                            ${order.step >= step.id ? 'bg-orange-600 border-white shadow-xl scale-110' : 'bg-white border-slate-100'}`}
                                        />
                                        <h4 className={`mt-6 text-[11px] font-black tracking-widest uppercase transition-colors
                                            ${order.step >= step.id ? 'text-slate-900' : 'text-slate-200'}`}>
                                            {step.label}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SMALL BOTTOM SPAN */}
                <div className="bg-slate-50 py-3 text-center shrink-0 border-t border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[.5em]">
                        Enterprise Logistics Management System v3.1
                    </p>
                </div>
            </div>
        </div>
    );
}