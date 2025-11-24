import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const orderId = data.get('tran_id');

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order/failed?orderId=${orderId}`);
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('tran_id');

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order/failed?orderId=${orderId}`);
}