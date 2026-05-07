import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { phone, amount } = await req.json();

        // Clean phone number: converts 07... or +254... to 2547...
        const formattedPhone = phone.replace(/^0/, '254').replace(/^\+/, '');

        // 1. Get OAuth Token from Safaricom
        const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');

        const tokenRes = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
            headers: { Authorization: `Basic ${auth}` }
        });

        const tokenData = await tokenRes.json();

        // --- ADDED: Error Handling for Auth ---
        if (!tokenData.access_token) {
            console.error("❌ Safaricom Auth Failed! Response:", tokenData);
            return NextResponse.json({
                error: "Safaricom Authentication Failed",
                details: tokenData
            }, { status: 401 });
        }

        const access_token = tokenData.access_token;

        // 2. Generate Password and Timestamp
        const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
        const password = Buffer.from(`${process.env.MPESA_BUSINESS_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

        // 3. Send the M-Pesa Express (STK Push) Request
        const stkRes = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                BusinessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: Math.round(amount), // Ensure amount is an integer
                PartyA: formattedPhone,
                PartyB: process.env.MPESA_BUSINESS_SHORTCODE,
                PhoneNumber: formattedPhone,
                CallBackURL: process.env.MPESA_CALLBACK_URL || "https://example.com/callback",
                AccountReference: "JR-LOGISTICS-7721",
                TransactionDesc: "Logistics Payment"
            }),
        });

        const data = await stkRes.json();

        // --- ADDED: STK Push Error Logging ---
        if (data.ResponseCode !== "0") {
            console.error("❌ STK Push Rejected:", data);
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error("❌ Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}