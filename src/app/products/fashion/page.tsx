"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Inventory using your specific naming: suit1.jpg, suit1_2.jpg, suit1_3.jpg
const fashionInventory = Array.from({ length: 12 }, (_, i) => {
    const suitNumber = i + 1;
    return {
        id: suitNumber,
        name: `Signature Suit Vol. ${suitNumber.toString().padStart(3, '0')}`,
        price: (500 + (suitNumber - 1) * 25).toFixed(2),
        tag: suitNumber === 1 ? "Founder's Edition" : "Core Collection",
        views: {
            main: `/suit${suitNumber}.jpg`,
            detail: `/suit${suitNumber}_2.jpg`,
            action: `/suit${suitNumber}_3.jpg`
        }
    };
});

export default function FashionMarket() {
    const router = useRouter();
    const [userName, setUserName] = useState("Guest");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({});
    const [activeViewType, setActiveViewType] = useState<{ [key: number]: string }>({});
    const [paymentMethods, setPaymentMethods] = useState<{ [key: number]: string }>({});

    // PAYMENT MODAL STATES
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [activeTransaction, setActiveTransaction] = useState<any>(null);
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
        const checkUser = () => {
            const storedUser = localStorage.getItem('activeUser');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserName(parsedUser.name.split(' ')[0]);
                setIsLoggedIn(true);
            } else {
                setUserName("Guest");
                setIsLoggedIn(false);
            }
        };
        checkUser();
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('activeUser');
        router.push('/login');
    };

    const completeOrder = (orderData: any) => {
        const pendingOrder = { ...orderData, status: "Awaiting Verification", step: 1, customerPhone: phoneNumber };
        const existingOrders = JSON.parse(localStorage.getItem('ordersList') || '[]');
        localStorage.setItem('ordersList', JSON.stringify([pendingOrder, ...existingOrders]));
        setShowPaymentModal(false);
        router.push('/tracking');
    };

    const handlePurchase = (item: any) => {
        const size = selectedSizes[item.id];
        const payment = paymentMethods[item.id];
        if (!isLoggedIn) return router.push('/login');
        if (!size || !payment) return alert("Please select size and payment.");

        const activeType = activeViewType[item.id] || 'main';
        const activeImageUrl = (item.views as any)[activeType];

        const orderData = {
            id: `ENT-${Math.floor(1000 + Math.random() * 9000)}`,
            name: item.name,
            price: `$${item.price}`,
            size,
            payment,
            image: activeImageUrl,
            date: "3-7 DAYS"
        };

        if (payment === "Mobile Money") {
            setActiveTransaction(orderData);
            setShowPaymentModal(true);
        } else {
            completeOrder(orderData);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header */}
            <header className="bg-slate-900 text-white py-4 px-8 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <Link href="/">
                        <h1 className="text-xl font-black uppercase italic italic tracking-tighter leading-none">
                            JR <span className="text-orange-600">MARKET</span>
                        </h1>
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <button onClick={handleSignOut} className="text-[10px] font-black uppercase text-red-500">Sign Out</button>
                    ) : (
                        <Link href="/login" className="text-[10px] font-black uppercase bg-orange-600 px-6 py-2 rounded-full">Sign In</Link>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-12 px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {fashionInventory.map((item) => {
                        const currentType = activeViewType[item.id] || 'main';
                        const currentImg = (item.views as any)[currentType];

                        return (
                            <div key={item.id} className="border border-slate-200 rounded-[2.5rem] p-6 bg-white flex flex-col">
                                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden mb-4 bg-slate-50 relative">
                                    <img
                                        src={currentImg}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x600?text=Suit+Image"; }}
                                    />
                                </div>

                                {/* View Switcher */}
                                <div className="grid grid-cols-3 gap-2 mb-6">
                                    {['main', 'detail', 'action'].map((v) => (
                                        <button
                                            key={v}
                                            onClick={() => setActiveViewType(prev => ({ ...prev, [item.id]: v }))}
                                            className={`py-2 rounded-lg text-[8px] font-black uppercase border-2 ${currentType === v ? 'border-orange-600 text-orange-600' : 'border-slate-100 text-slate-400'}`}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex-grow">
                                    <h3 className="text-lg font-black uppercase italic text-slate-900">{item.name}</h3>
                                    <p className="text-2xl font-black text-slate-900 mt-1">${item.price}</p>

                                    {/* Sizes */}
                                    <div className="mt-4 flex gap-2">
                                        {['S', 'M', 'L', 'XL'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setSelectedSizes(prev => ({ ...prev, [item.id]: s }))}
                                                className={`flex-1 py-2 rounded-lg text-[10px] font-black border-2 ${selectedSizes[item.id] === s ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-100'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Payment */}
                                    {/* Restored Payment Protocols */}
                                    <div className="mt-4 space-y-2">
                                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1 ml-1">Payment Protocol</p>

                                        {/* Mobile Money Option */}
                                        <button
                                            onClick={() => setPaymentMethods(prev => ({ ...prev, [item.id]: "Mobile Money" }))}
                                            className={`w-full py-2.5 px-4 rounded-xl border-2 text-[10px] font-black uppercase flex justify-between items-center transition-all 
        ${paymentMethods[item.id] === "Mobile Money" ? 'border-orange-600 text-orange-600 bg-orange-50' : 'border-slate-100 text-slate-400'}`}
                                        >
                                            <span>📱 Mobile Money</span>
                                            {paymentMethods[item.id] === "Mobile Money" && <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></div>}
                                        </button>

                                        {/* Post-Delivery Option */}
                                        <button
                                            onClick={() => setPaymentMethods(prev => ({ ...prev, [item.id]: "Pay After Delivery" }))}
                                            className={`w-full py-2.5 px-4 rounded-xl border-2 text-[10px] font-black uppercase flex justify-between items-center transition-all 
        ${paymentMethods[item.id] === "Pay After Delivery" ? 'border-orange-600 text-orange-600 bg-orange-50' : 'border-slate-100 text-slate-400'}`}
                                        >
                                            <span>🤝 Post-Delivery</span>
                                            {paymentMethods[item.id] === "Pay After Delivery" && <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></div>}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handlePurchase(item)}
                                    className="mt-6 w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-600"
                                >
                                    Purchase
                                </button>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* PAYMENT MODAL */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
                    <div className="bg-white w-full max-w-md rounded-[3rem] p-8">
                        <h2 className="text-2xl font-black uppercase mb-6">Payment Details</h2>
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 mb-6 outline-none focus:border-orange-600"
                        />
                        <div className="flex gap-4">
                            <button onClick={() => setShowPaymentModal(false)} className="flex-1 font-black uppercase text-slate-400">Back</button>
                            <button onClick={() => completeOrder(activeTransaction)} className="flex-2 py-4 bg-orange-600 text-white font-black uppercase rounded-2xl w-full">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}