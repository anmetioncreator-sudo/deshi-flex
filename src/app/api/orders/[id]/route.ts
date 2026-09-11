import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail, EMAIL_SENDERS } from '@/lib/email/resend';
import { getShipmentTrackingEmailHtml } from '@/lib/email/templates';

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

    // When status changes to Shipped, dispatch courier tracking notification to customer
    const customerEmail = order.email;
    if (data.status === 'Shipped' && customerEmail && customerEmail.includes('@')) {
      (async () => {
        try {
          const html = getShipmentTrackingEmailHtml({
            orderId: order.id,
            fullName: order.fullName,
            courierName: 'Steadfast Express BD',
            trackingNumber: `STDF-${order.id}`,
            currentStatus: 'Dispatched from Tejgaon Sorting Hub → En Route for Delivery',
            destination: `${order.address}, ${order.region}`,
            remainingCOD: order.remainingBalance || 0,
          });

          await sendEmail({
            to: customerEmail,
            from: EMAIL_SENDERS.orders,
            subject: `🚚 Shipment Dispatched: Order #${order.id} is On The Way - Deshi Flex`,
            html,
          });
        } catch (emailErr) {
          console.error('[Shipment Email Dispatch Failed]:', emailErr);
        }
      })();
    }

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
