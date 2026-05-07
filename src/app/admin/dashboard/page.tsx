"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [orders, setOrders] = useState<any[]>([]);

    // 1. DATA SYNC: Pull orders from system memory with live polling
    useEffect(() => {
        const fetchOrders = () => {
            const savedOrder = localStorage.getItem('activeOrder');
            const savedUser = localStorage.getItem('activeUser');

            if (savedOrder) {
                const orderData = JSON.parse(savedOrder);
                const userData = savedUser ? JSON.parse(savedUser) : null;

                // Sync order data and ensure operator name is present
                setOrders([{ ...orderData, operator: userData?.name || "SYSTEM" }]);
            }
        };

        // Poll for updates every 2 seconds to catch new customer ratings
        const interval = setInterval(fetchOrders, 2000);
        fetchOrders();

        return () => clearInterval(interval);
    }, []);

    // 2. LOGISTICS CONTROL: Update the order step (1 to 4)
    const updateStatus = (id: string, newStep: number) => {
        const updatedOrders = orders.map(order => {
            if (order.id === id) {
                const updated = { ...order, step: newStep };
                // Update storage so the user's tracking page reflects the change
                localStorage.setItem('activeOrder', JSON.stringify(updated));
                return updated;
            }
            return order;
        });
        setOrders(updatedOrders);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8">
            {/* Header Sector */}
            <div className="max-w-6xl mx-auto flex justify-between items-end mb-12 border-b border-slate-800 pb-8">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
                        Logistics <span className="text-orange-600">Command Center</span>
                    </h1>
                    <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mt-2">
                        INTERNAL WORKER INTERFACE • SESSION: ACTIVE
                    </p>
                </div>
                <Link href="/fashion" className="text-[10px] font-black border border-slate-700 px-4 py-2 rounded hover:bg-white hover:text-black transition-all">
                    VIEW MARKETPLACE
                </Link>
            </div>

            {/* Orders Table */}
            <div className="max-w-6xl mx-auto">
                <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#0f172a] text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <tr>
                                <th className="p-6">Order Reference</th>
                                <th className="p-6">Operator</th>
                                <th className="p-6 text-center">Feedback</th> {/* NEW FEEDBACK COLUMN */}
                                <th className="p-6">Current Phase</th>
                                <th className="p-6 text-right">Dispatch Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {orders.length > 0 ? orders.map((order) => (
                                <tr key={order.id} className="hover:bg-[#1e293b]/50 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <img src={order.image} className="w-12 h-12 rounded bg-slate-800 object-cover border border-slate-700" alt="" />
                                            <div>
                                                <p className="text-white font-bold text-sm">#{order.id}</p>
                                                <p className="text-[10px] text-slate-500">{order.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-[10px] font-black bg-slate-800 px-2 py-1 rounded text-orange-500">
                                            {order.operator || "SYSTEM"}
                                        </span>
                                    </td>

                                    {/* 3. LIVE FEEDBACK CELL */}
                                    <td className="p-6 text-center">
                                        {order.customerRating ? (
                                            <div className="flex justify-center gap-1 text-orange-500 animate-in fade-in zoom-in duration-500">
                                                {[...Array(order.customerRating)].map((_, i) => (
                                                    <span key={i} className="text-sm">★</span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-[9px] text-slate-600 uppercase font-bold italic">
                                                Awaiting Feedback
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${order.step === 4 ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></span>
                                            <p className="text-[10px] font-black uppercase">
                                                {order.step === 1 && "Confirmed"}
                                                {order.step === 2 && "In Tailoring"}
                                                {order.step === 3 && "Out for Dispatch"}
                                                {order.step === 4 && "Delivered"}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            {order.step < 4 ? (
                                                <button
                                                    onClick={() => updateStatus(order.id, order.step + 1)}
                                                    className="bg-orange-600 hover:bg-orange-500 text-white text-[9px] font-black px-4 py-2 rounded transition-all uppercase tracking-tighter"
                                                >
                                                    Progress to Next Phase →
                                                </button>
                                            ) : (
                                                <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-4 py-2 rounded border border-green-500/20">
                                                    LOGISTICS COMPLETE
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">
                                        No active logistics requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}