import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const where: any = {};
    if (productId) where.productId = productId;
    if (type && type !== 'All') where.type = type;

    const logs = await prisma.stockLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error('Error fetching stock logs:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
