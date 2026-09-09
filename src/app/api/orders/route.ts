import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getClientIp, checkIpOrderLimit, recordIpOrder, sanitizeInput } from '@/lib/rateLimit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || searchParams.get('search') || searchParams.get('phone') || searchParams.get('email') || searchParams.get('id');
    const status = searchParams.get('status');
    const includeDeleted = searchParams.get('deleted') === 'true';

    const where: any = {};

    if (query && query.trim()) {
      const q = query.trim();
      where.OR = [
        { id: { contains: q } },
        { phone: { contains: q } },
        { email: { contains: q } },
        { fullName: { contains: q } },
      ];
    }

    if (status && status !== 'All') {
      where.status = status;
    }
    if (!includeDeleted && !query) {
      where.deleted = false;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    const parsedOrders = orders.map((o: any) => ({
      ...o,
      frontImagePos: o.frontImagePos ? JSON.parse(o.frontImagePos) : undefined,
      backImagePos: o.backImagePos ? JSON.parse(o.backImagePos) : undefined,
      cartItems: o.cartItems ? JSON.parse(o.cartItems) : [],
    }));

    return NextResponse.json({ success: true, orders: parsedOrders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // ANTI-CHEAT / ANTI-SPAM PROTECTION: Limit maximum 3 orders per IP address
    const { allowed, currentCount, limit } = await checkIpOrderLimit(clientIp, 3);
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Order limit reached. Maximum ${limit} orders allowed per IP address (${clientIp}) to prevent order spamming.`,
          currentCount,
          limit,
        },
        { status: 429 }
      );
    }

    const data = await request.json();

    if (!data.fullName || !data.phone || !data.address) {
      return NextResponse.json(
        { success: false, error: 'Full Name, Phone Number, and Address are required.' },
        { status: 400 }
      );
    }

    const orderId = data.id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await prisma.order.create({
      data: {
        id: orderId,
        type: sanitizeInput(data.type) || 'Direct Checkout',
        fullName: sanitizeInput(data.fullName),
        email: data.email ? sanitizeInput(data.email) : null,
        phone: sanitizeInput(data.phone),
        address: sanitizeInput(data.address),
        region: sanitizeInput(data.region) || 'Dhaka',
        ipAddress: clientIp,
        designType: data.designType ? sanitizeInput(data.designType) : null,
        referenceImage: data.referenceImage || null,
        frontImageName: data.frontImageName || null,
        backImageName: data.backImageName || null,
        frontImagePos: data.frontImagePos ? JSON.stringify(data.frontImagePos) : null,
        backImagePos: data.backImagePos ? JSON.stringify(data.backImagePos) : null,
        frontPrintSize: data.frontPrintSize || null,
        backPrintSize: data.backPrintSize || null,
        color: data.color || null,
        materials: data.materials ? sanitizeInput(data.materials) : null,
        description: data.description ? sanitizeInput(data.description) : null,
        itemId: data.itemId ? sanitizeInput(data.itemId) : null,
        quantity: data.quantity ? Number(data.quantity) : 1,
        specialNotes: data.specialNotes ? sanitizeInput(data.specialNotes) : null,
        cartItems: data.cartItems ? JSON.stringify(data.cartItems) : null,
        advancePaid: Number(data.advancePaid || 0),
        trxId: data.trxId ? sanitizeInput(data.trxId) : '',
        remainingBalance: Number(data.remainingBalance || 0),
        status: data.status || 'Pending Verification',
        statusNote: data.statusNote ? sanitizeInput(data.statusNote) : null,
        deleted: false,
      },
    });

    // Record order placement for this IP address
    recordIpOrder(clientIp);

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
