import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const parsedOrder = {
      ...order,
      frontImagePos: order.frontImagePos ? JSON.parse(order.frontImagePos) : undefined,
      backImagePos: order.backImagePos ? JSON.parse(order.backImagePos) : undefined,
      cartItems: order.cartItems ? JSON.parse(order.cartItems) : [],
    };

    return NextResponse.json({ success: true, order: parsedOrder });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updateData: any = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.statusNote !== undefined) updateData.statusNote = data.statusNote;
    if (data.deleted !== undefined) updateData.deleted = Boolean(data.deleted);

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Order permanently deleted' });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
