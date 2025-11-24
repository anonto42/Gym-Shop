import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { orderId, amount, customerInfo } = await request.json();

        // SSL Commerz configuration
        const storeId = process.env.SSLCOMMERZ_STORE_ID || 'testbox';
        const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD || 'qwerty';
        const isLive = process.env.NODE_ENV === 'production';

        // Prepare payment data with ALL required fields
        const paymentData = {
            // Store credentials
            store_id: storeId,
            store_passwd: storePassword,

            // Transaction details
            total_amount: amount.toFixed(2),
            currency: 'BDT',
            tran_id: orderId,

            // Callback URLs
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/sslcommerz/success`,
            fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/sslcommerz/fail`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/sslcommerz/cancel`,
            ipn_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/sslcommerz/ipn`,

            // Customer information (required)
            cus_name: customerInfo.name,
            cus_email: customerInfo.email,
            cus_phone: customerInfo.phone,
            cus_add1: customerInfo.address,
            cus_add2: customerInfo.address, // Sometimes required
            cus_city: customerInfo.city,
            cus_state: customerInfo.city, // Use city as state
            cus_postcode: customerInfo.postalCode || '1200', // Default if missing
            cus_country: 'Bangladesh',
            cus_fax: customerInfo.phone,

            // Shipping information (required when shipping_method is YES)
            shipping_method: 'YES',
            num_of_item: '1', // Number of items
            ship_name: customerInfo.name,
            ship_add1: customerInfo.address,
            ship_add2: customerInfo.address,
            ship_city: customerInfo.city,
            ship_state: customerInfo.city,
            ship_postcode: customerInfo.postalCode || '1200', // This was missing!
            ship_country: 'Bangladesh',

            // Product information
            product_name: 'Gym Products',
            product_category: 'General',
            product_profile: 'general',

            // Additional required fields
            value_a: 'ref001',
            value_b: 'ref002',
            value_c: 'ref003',
            value_d: 'ref004'
        };

        // SSL Commerz API URL
        const sslUrl = isLive
            ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
            : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

        // Send request to SSL Commerz
        const formData = new URLSearchParams();
        Object.entries(paymentData).forEach(([key, value]) => {
            formData.append(key, value as string);
        });

        console.log('Sending to SSL Commerz with order:', orderId, 'amount:', amount);

        const response = await fetch(sslUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });

        const result = await response.json();
        console.log('SSL Commerz response:', result);

        if (result.status === 'SUCCESS') {
            return NextResponse.json({
                success: true,
                paymentUrl: result.GatewayPageURL,
                sessionKey: result.sessionkey
            });
        } else {
            return NextResponse.json({
                success: false,
                error: result.failedreason || 'Payment initiation failed',
                sslResponse: result
            }, { status: 400 });
        }

    } catch (error) {
        console.error('SSL Commerz error:', error);
        return NextResponse.json({
            success: false,
            error: 'Payment gateway error',
        }, { status: 500 });
    }
}