"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const fashionInventory = Array.from({ length: 22 }, (_, i) => {
    const suitNumber = i + 2;
    return {
        id: suitNumber,
        name: `Signature Suit Vol. ${suitNumber}`,
        price: (500 + (suitNumber - 1) * 15).toFixed(2),
        views: [
            `/suit${suitNumber}.jpg`,
            `/suit${suitNumber}_2.jpg`,
            `/suit${suitNumber}_3.jpg`
        ]
    };
});

export default function FashionMarket() {
    const router = useRouter();
    const [userName, setUserName] = useState("Guest");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({});
    const [activeViews, setActiveViews] = useState<{ [key: number]: string }>({});
    const [paymentMethods, setPaymentMethods] = useState<{ [key: number]: string }>({});

    // PAYMENT & GATEKEEPER STATES
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [activeTransaction, setActiveTransaction] = useState<any>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    // WATCHER EFFECT: Polling for Payment Approval
    useEffect(() => {
        if (!isProcessingPayment || !activeTransaction) return;

        const checkPaymentStatus = () => {
            // Log for debugging - remove in production
            console.log("Searching for approval of order:", activeTransaction.id);

            const orders = JSON.parse(localStorage.getItem('ordersList') || '[]');

            // Logic: Find the order matching the current transaction ID that the Worker marked as "Paid"
            const approvedOrder = orders.find((o: any) =>
                o.id === activeTransaction.id &&
                o.paymentStatus === "Paid"
            );

            if (approvedOrder) {
                console.log("PAYMENT VERIFIED: Unlocking Tracking.");
                localStorage.setItem('activeOrder', JSON.stringify(approvedOrder));
                setIsProcessingPayment(false);
                router.push('/tracking');
            }
        };

        // Faster polling (1 second) for better UX
        const interval = setInterval(checkPaymentStatus, 1000);
        return () => clearInterval(interval);
    }, [isProcessingPayment, activeTransaction, router]);

    const handleSignOut = () => {
        localStorage.removeItem('activeUser');
        setUserName("Guest");
        setIsLoggedIn(false);
        router.refresh();
    };

    const completeOrder = (orderData: any) => {
        const isMobileMoney = orderData.payment === "Mobile Money";

        const pendingOrder = {
            ...orderData,
            status: isMobileMoney ? "Awaiting PIN Entry" : "Awaiting Verification",
            paymentStatus: isMobileMoney ? "Pending" : "COD",
            step: 1,
            customerPhone: phoneNumber
        };

        // Save to Global Orders List
        const existingOrders = JSON.parse(localStorage.getItem('ordersList') || '[]');
        const updatedOrdersList = [pendingOrder, ...existingOrders];
        localStorage.setItem('ordersList', JSON.stringify(updatedOrdersList));

        // CRITICAL: Manually trigger storage event for this tab to react
        window.dispatchEvent(new Event("storage"));

        setShowPaymentModal(false);

        if (isMobileMoney) {
            // Keep the activeTransaction state in sync
            setActiveTransaction(pendingOrder);
            setIsProcessingPayment(true);
        } else {
            localStorage.setItem('activeOrder', JSON.stringify(pendingOrder));
            router.push('/tracking');
        }
    };

    const handlePurchase = (item: any) => {
        const size = selectedSizes[item.id];
        const payment = paymentMethods[item.id];

        if (!isLoggedIn) {
            alert("IDENTITY NOT VERIFIED: Please Sign In to purchase.");
            router.push('/login');
            return;
        }

        if (!size || !payment) {
            alert("Please select a size and Payment Protocol.");
            return;
        }

        const today = new Date();
        const deliveryStart = new Date();
        deliveryStart.setDate(today.getDate() + 3);
        const deliveryEnd = new Date();
        deliveryEnd.setDate(today.getDate() + 7);

        const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit' };
        const dateRange = `${deliveryStart.toLocaleDateString('en-US', options)} — ${deliveryEnd.toLocaleDateString('en-US', options)}`.toUpperCase();

        const orderData = {
            id: `ENT-${Math.floor(1000 + Math.random() * 9000)}`,
            name: item.name,
            price: `$${item.price}`,
            size: size,
            payment: payment,
            image: activeViews[item.id] || item.views[0],
            status: "Confirmed",
            step: 1,
            date: dateRange
        };

        if (payment === "Mobile Money") {
            setActiveTransaction(orderData);
            setShowPaymentModal(true);
        } else {
            completeOrder(orderData);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <header className="bg-slate-900 text-white py-6 px-8 flex justify-between items-center sticky top-0 z-50 shadow-xl">
                <div>
                    <h1 className="text-2xl font-black uppercase italic tracking-tighter">
                        John Ripper <span className="text-orange-600">Market</span>
                    </h1>
                    <p className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase">
                        Operator: <span className="text-orange-500">{userName}</span>
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/tracking" className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-6 py-2 rounded-full hover:bg-orange-600 transition-all">
                                Track Orders
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="text-[10px] font-black uppercase tracking-widest bg-red-600/10 text-red-500 border border-red-500/20 px-6 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link href="/signup" className="text-[10px] font-black uppercase tracking-widest bg-orange-600 px-6 py-2 rounded-full hover:bg-orange-700 transition-all">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-12 px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {fashionInventory.map((item) => (
                        <div key={item.id} className="group border border-slate-200 rounded-[2.5rem] p-6 bg-white shadow-sm hover:shadow-2xl transition-all duration-500">
                            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden mb-4 bg-slate-100 border border-slate-100">
                                <img
                                    src={activeViews[item.id] || item.views[0]}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                    alt={item.name}
                                />
                            </div>

                            {/* View Selectors */}
                            <div className="grid grid-cols-3 gap-2 mb-6">
                                {item.views.map((imgUrl, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveViews(prev => ({ ...prev, [item.id]: imgUrl }))}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all 
                                            ${(activeViews[item.id] || item.views[0]) === imgUrl
                                                ? 'border-orange-600 shadow-md scale-95'
                                                : 'border-transparent hover:border-slate-300'}`}
                                    >
                                        <img src={imgUrl} className="w-full h-full object-cover" alt={`Angle ${idx + 1}`} />
                                    </button>
                                ))}
                            </div>

                            <div className="px-2">
                                <h3 className="text-lg font-black uppercase italic text-slate-900 leading-tight">{item.name}</h3>
                                <p className="text-orange-600 font-black text-xl mt-1">${item.price}</p>

                                {/* Size Selector */}
                                <div className="mt-6">
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">Dimensions</p>
                                    <div className="flex gap-2">
                                        {['S', 'M', 'L', 'XL'].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSizes(prev => ({ ...prev, [item.id]: size }))}
                                                className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all border-2 
                                                    ${selectedSizes[item.id] === size
                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                                        : 'bg-transparent text-slate-900 border-slate-100 hover:border-slate-300'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Selector */}
                                <div className="mt-6">
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">Payment Protocol</p>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => setPaymentMethods(prev => ({ ...prev, [item.id]: "Mobile Money" }))}
                                            className={`w-full py-3 px-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-tight flex justify-between items-center transition-all
                                            ${paymentMethods[item.id] === "Mobile Money"
                                                    ? 'bg-orange-50 border-orange-600 text-orange-600 shadow-sm'
                                                    : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                        >
                                            <span>📱 Mobile Money</span>
                                            {paymentMethods[item.id] === "Mobile Money" && <span>✓</span>}
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethods(prev => ({ ...prev, [item.id]: "Pay After Delivery" }))}
                                            className={`w-full py-3 px-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-tight flex justify-between items-center transition-all
                                            ${paymentMethods[item.id] === "Pay After Delivery"
                                                    ? 'bg-orange-50 border-orange-600 text-orange-600 shadow-sm'
                                                    : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                                        >
                                            <span>🤝 Pay After Delivery</span>
                                            {paymentMethods[item.id] === "Pay After Delivery" && <span>✓</span>}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handlePurchase(item)}
                                    className="mt-8 w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-600 transition-all shadow-lg active:scale-95 shadow-slate-200"
                                >
                                    Purchase Acquisition
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* MOBILE MONEY PAYMENT MODAL */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md">
                    <div className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="bg-orange-600 p-8 text-white">
                            <p className="text-[10px] font-black uppercase tracking-[.3em] mb-2 opacity-80">Secure Checkout</p>
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Mobile Money</h2>
                        </div>

                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Payable</p>
                                    <p className="text-2xl font-black text-slate-900">{activeTransaction?.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Merchant Account</p>
                                    <p className="text-[10px] font-black text-slate-900 uppercase">JR-LOGISTICS-7721</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-2 block">Provider Number</label>
                                    <input
                                        type="tel"
                                        placeholder="Enter Phone Number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-900 focus:border-orange-600 outline-none transition-all"
                                    />
                                </div>

                                <div className="bg-slate-900 p-5 rounded-[2rem] text-white">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-orange-500 mb-2">Instructions</p>
                                    <p className="text-[10px] font-bold leading-relaxed opacity-80">
                                        Once you authorize, a push request will be sent to your device. Funds will be directed to John Ripper Co. Ltd corporate account.
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowPaymentModal(false)}
                                        className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (phoneNumber.length < 10) return alert("Please enter a valid phone number.");
                                            completeOrder(activeTransaction);
                                        }}
                                        className="flex-[2] py-4 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-500 transition-all shadow-lg"
                                    >
                                        Authorize Payment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* GATEKEEPER OVERLAY */}
            {isProcessingPayment && (
                <div className="fixed inset-0 z-[200] bg-slate-900 flex items-center justify-center p-6 text-center">
                    <div className="max-w-sm">
                        <div className="w-20 h-20 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Processing Protocol</h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                            STK Push sent to <span className="text-orange-500">{phoneNumber}</span>.<br />
                            Waiting for PIN confirmation to unlock tracking...
                        </p>
                        <div className="mt-8 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Merchant ID: JR-LOGISTICS-7721</p>
                            <p className="text-[9px] font-black text-orange-500 uppercase mt-2">Order ID: {activeTransaction?.id}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}