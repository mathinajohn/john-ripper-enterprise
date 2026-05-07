"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WorkerPortal() {
    const [ordersList, setOrdersList] = useState<any[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    // Load all orders from storage
    useEffect(() => {
        const loadOrders = () => {
            const saved = localStorage.getItem('ordersList');
            if (saved) {
                const parsed = JSON.parse(saved);
                setOrdersList(parsed);
                if (parsed.length > 0 && !selectedOrderId) {
                    setSelectedOrderId(parsed[0].id);
                }
            }
        };

        loadOrders();
        window.addEventListener('storage', loadOrders);
        return () => window.removeEventListener('storage', loadOrders);
    }, [selectedOrderId]);

    // --- NEW: STK PUSH HANDLER ---
    const initiateSTKPush = async (order: any) => {
        setLoadingId(order.id);
        try {
            // Clean the price (remove $ and commas) to get a raw number
            const rawAmount = typeof order.price === 'string'
                ? order.price.replace(/[^0-9.]/g, '')
                : order.price;

            const response = await fetch('/api/stkpush', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: order.customerPhone,
                    amount: Math.round(parseFloat(rawAmount)) || 1 // Defaults to 1 if parsing fails
                }),
            });

            const data = await response.json();

            if (data.ResponseCode === "0") {
                alert(`🚀 Success! STK Push sent to ${order.customerPhone}. Ask the client to enter their PIN.`);
            } else {
                alert(`❌ M-Pesa Error: ${data.ResponseDescription || "Check your API credentials"}`);
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("Failed to connect to the payment server. Check your local console.");
        } finally {
            setLoadingId(null);
        }
    };

    const activeOrder = ordersList.find(o => o.id === selectedOrderId);

    const updateStatus = (orderId: string, step: number, statusText?: string) => {
        const updatedList = ordersList.map(order => {
            if (order.id === orderId) {
                const updatedOrder = {
                    ...order,
                    step,
                    status: statusText || order.status,
                    lastUpdated: new Date().toLocaleTimeString()
                };

                if (step === 2) {
                    updatedOrder.paymentStatus = "Paid";
                }

                return updatedOrder;
            }
            return order;
        });

        setOrdersList(updatedList);
        localStorage.setItem('ordersList', JSON.stringify(updatedList));
        window.dispatchEvent(new Event('storage'));
    };

    if (ordersList.length === 0) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-10 font-sans">
                <div className="text-center p-12 border border-slate-800 rounded-[3rem] bg-slate-900/50 backdrop-blur-xl">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6"><span className="text-3xl">📦</span></div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">No Active Pipeline</h2>
                    <Link href="/fashion" className="mt-8 inline-block bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-orange-500 transition-all">Open Marketplace</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-black text-white italic">JR</div>
                            <h1 className="text-xl font-black italic tracking-tight text-white uppercase">Worker<span className="text-orange-600">Portal</span></h1>
                        </div>
                        <p className="text-[9px] font-bold text-slate-500 tracking-[0.4em] mt-1 uppercase">Global Logistics Command</p>
                    </div>
                    <Link href="/fashion" className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors text-xs font-bold uppercase tracking-widest text-slate-400">Exit System</Link>
                </header>

                <section className="mb-12">
                    <h3 className="text-[10px] font-black uppercase text-orange-500 tracking-[0.3em] mb-4 ml-2">Verification Queue (M-Pesa)</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {ordersList.filter(o => o.payment === "Mobile Money" && o.step < 2).map(order => (
                            <div key={order.id} className="min-w-[320px] bg-slate-900/80 border border-orange-500/30 p-6 rounded-[2.5rem] flex flex-col justify-between shadow-xl shadow-orange-950/20">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{order.id}</span>
                                        <span className="bg-orange-600/20 text-orange-500 text-[8px] font-black px-3 py-1 rounded-full uppercase border border-orange-500/30">Payment Pending</span>
                                    </div>
                                    <p className="text-lg font-black text-white uppercase mb-1">{order.customerPhone || "STK PUSH READY"}</p>
                                    <div className="flex gap-2 text-[9px] font-bold text-slate-500 uppercase">
                                        <span>Value: {order.price}</span>
                                        <span>•</span>
                                        <span>Ref: JR-LOG-7721</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-6">
                                    <button
                                        onClick={() => initiateSTKPush(order)}
                                        disabled={loadingId === order.id}
                                        className={`py-3 text-[8px] font-black uppercase rounded-xl border transition-all ${loadingId === order.id ? 'bg-slate-700 text-slate-500 border-slate-600 animate-pulse' : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-orange-600'}`}
                                    >
                                        {loadingId === order.id ? 'Processing...' : 'Resend PIN'}
                                    </button>
                                    <button
                                        onClick={() => updateStatus(order.id, 2, "Payment Verified")}
                                        className="py-3 bg-orange-600 text-white text-[8px] font-black uppercase rounded-xl hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/40"
                                    >
                                        Confirm Receipt
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid lg:grid-cols-12 gap-8">
                    <aside className="lg:col-span-4 space-y-3">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-4 mb-2">Order Manifest</p>
                        <div className="space-y-2 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {ordersList.map(order => (
                                <button
                                    key={order.id}
                                    onClick={() => setSelectedOrderId(order.id)}
                                    className={`w-full text-left p-5 rounded-3xl border-2 transition-all ${selectedOrderId === order.id ? 'bg-slate-800 border-orange-600 shadow-lg' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'}`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black text-slate-500 uppercase">{order.id}</span>
                                        <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase ${order.step >= 3 ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>Step 0{order.step}</span>
                                    </div>
                                    <p className="text-xs font-black text-white uppercase truncate">{order.name}</p>
                                    <p className="text-[9px] font-bold text-slate-500 mt-1">{order.status || "In Pipeline"}</p>
                                </button>
                            ))}
                        </div>
                    </aside>

                    <div className="lg:col-span-8 space-y-6">
                        {activeOrder ? (
                            <>
                                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <span className="text-8xl font-black italic text-white uppercase">{activeOrder.id.split('-')[1]}</span>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                                            <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Active Intelligence</p>
                                        </div>
                                        <h2 className="text-5xl font-black italic text-white tracking-tighter mb-8">{activeOrder.id}</h2>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-slate-800 pt-8">
                                            <div>
                                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">SKU</p>
                                                <p className="text-sm font-black text-white uppercase">{activeOrder.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Protocol</p>
                                                <p className="text-sm font-black text-white uppercase">{activeOrder.payment}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Status</p>
                                                <p className={`text-sm font-black uppercase ${activeOrder.paymentStatus === 'Paid' ? 'text-green-500' : 'text-orange-500'}`}>
                                                    {activeOrder.paymentStatus === 'Paid' ? 'Verified' : 'Pending'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { id: 2, label: "Confirm Payment", icon: "💰", status: "Payment Verified" },
                                        { id: 3, label: "Dispatch Goods", icon: "🚛", status: "Package in Transit" },
                                        { id: 4, label: "Finalize Delivery", icon: "🎯", status: "Mission Accomplished" }
                                    ].map((btn) => (
                                        <button
                                            key={btn.id}
                                            onClick={() => updateStatus(activeOrder.id, btn.id, btn.status)}
                                            className={`flex items-center gap-4 p-6 rounded-3xl border-2 transition-all ${activeOrder.step === btn.id ? 'bg-orange-600 border-orange-400 text-white translate-y-[-4px] shadow-xl shadow-orange-900/40' : 'bg-slate-900/80 border-slate-800 text-slate-500 hover:border-slate-600'}`}
                                        >
                                            <span className="text-2xl">{btn.icon}</span>
                                            <div className="text-left">
                                                <p className="font-black uppercase tracking-widest text-[10px] leading-none mb-1">{btn.label}</p>
                                                <p className="text-[8px] font-bold uppercase">{activeOrder.step === btn.id ? 'Status: Active' : 'Waiting'}</p>
                                            </div>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const filtered = ordersList.filter(o => o.id !== activeOrder.id);
                                            setOrdersList(filtered);
                                            localStorage.setItem('ordersList', JSON.stringify(filtered));
                                            setSelectedOrderId(null);
                                        }}
                                        className="flex items-center gap-4 p-6 rounded-3xl border-2 border-red-900/30 bg-red-950/20 text-red-500 hover:bg-red-950/40 transition-all"
                                    >
                                        <span className="text-2xl">🗑️</span>
                                        <div className="text-left">
                                            <p className="font-black uppercase tracking-widest text-[10px] leading-none mb-1">Archive Order</p>
                                            <p className="text-[8px] font-bold uppercase">Purge from Portal</p>
                                        </div>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-800 rounded-[3rem]">
                                <p className="text-slate-600 text-xs font-black uppercase tracking-[0.4em]">Select an order to manage</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}