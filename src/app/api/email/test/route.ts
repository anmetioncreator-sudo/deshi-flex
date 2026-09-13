import { NextResponse } from 'next/server';
import { sendEmail, EMAIL_SENDERS } from '@/lib/email/resend';
import {
  getWelcomeEmailHtml,
  getOrderConfirmationEmailHtml,
  getShipmentTrackingEmailHtml,
  getResetCodeEmailHtml,
  getResetCodeEmailText,
  getSupportInquiryEmailHtml,
  getAdminOrderAlertEmailHtml,
} from '@/lib/email/templates';

// GET: Returns raw HTML for visual iframe preview
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const template = searchParams.get('template') || 'order-confirmation';

  let html = '';
  switch (template) {
    case 'welcome':
      html = getWelcomeEmailHtml({
        name: 'Tanzid Ahmed',
        email: 'customer@example.com',
        discountCode: 'FLEXDROP',
      });
      break;

    case 'order-confirmation':
      html = getOrderConfirmationEmailHtml({
        orderId: 'ORD-882419',
        fullName: 'Tahmid Khan',
        email: 'tahmid@example.com',
        phone: '01710793841',
        address: 'House 42, Road 11, Banani Block D',
        region: 'Dhaka',
        advancePaid: 300,
        remainingBalance: 1550,
        trxId: '9K2M8LPQ10',
        specialNotes: 'Please ring bell twice upon arrival.',
        items: [
          {
            id: 'PROD-01',
            name: 'Cyber Samurai Heavyweight Drop Shoulder Tee (240 GSM)',
            size: 'XL',
            quantity: 1,
            price: 1150,
          },
          {
            id: 'PROD-02',
            name: 'Gothic Dhaka Chrome Oversized Acid Wash T-Shirt',
            size: 'L',
            quantity: 1,
            price: 700,
          },
        ],
      });
      break;

    case 'shipment-tracking':
      html = getShipmentTrackingEmailHtml({
        orderId: 'ORD-882419',
        fullName: 'Tahmid Khan',
        courierName: 'Steadfast Courier Express',
        trackingNumber: 'STDF-99482710-BD',
        currentStatus: 'Dispatched from Tejgaon Central Sorting Hub → Out for Delivery',
        destination: 'House 42, Road 11, Banani Block D, Dhaka',
        remainingCOD: 1550,
      });
      break;

    case 'reset-code':
      html = getResetCodeEmailHtml({
        resetCode: '749102',
        email: 'user@deshiflex.com',
        expiresInMinutes: 15,
        ipAddress: '103.145.132.88',
      });
      break;

    case 'support-inquiry':
      html = getSupportInquiryEmailHtml({
        ticketId: 'TCK-2026-914',
        fullName: 'Sadman Sakib',
        email: 'sadman@example.com',
        subject: 'Inquiry regarding custom drop shoulder GSM & screen printing',
        message: 'Hello, I want to order 50 custom drop shoulder t-shirts for our university crew with front and back puff print. Can you share bulk quotation?',
      });
      break;

    case 'admin-alert':
      html = getAdminOrderAlertEmailHtml({
        orderId: 'ORD-882419',
        fullName: 'Tahmid Khan',
        email: 'tahmid@example.com',
        phone: '01710793841',
        address: 'House 42, Road 11, Banani Block D',
        region: 'Dhaka',
        advancePaid: 300,
        remainingBalance: 1550,
        trxId: '9K2M8LPQ10',
        itemsCount: 2,
      });
      break;

    default:
      return NextResponse.json({ error: 'Unknown template' }, { status: 400 });
  }

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

// POST: Live dispatch of selected template to a specified recipient email
export async function POST(request: Request) {
  try {
    const { to, template, senderType } = await request.json();

    if (!to || !to.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid recipient email required.' }, { status: 400 });
    }

    const fromSender = senderType === 'support' ? EMAIL_SENDERS.support : EMAIL_SENDERS.orders;

    let html = '';
    let text = '';
    let subject = '';

    switch (template) {
      case 'welcome':
        subject = 'Welcome to the Movement — Deshi Flex Streetwear (15% Inside)';
        html = getWelcomeEmailHtml({
          name: 'VIP Member',
          email: to,
          discountCode: 'FLEXDROP',
        });
        break;

      case 'order-confirmation':
        subject = 'Order Confirmed: #ORD-882419 - Deshi Flex Official';
        html = getOrderConfirmationEmailHtml({
          orderId: 'ORD-882419',
          fullName: 'VIP Customer',
          email: to,
          phone: '01710793841',
          address: 'Dhanmondi 27, Dhaka',
          region: 'Dhaka',
          advancePaid: 300,
          remainingBalance: 1850,
          trxId: '9K2M8LPQ10',
          items: [
            {
              name: 'Cyber Samurai Heavyweight Drop Shoulder Tee (240 GSM)',
              size: 'XL',
              quantity: 1,
              price: 1150,
            },
            {
              name: 'Signature Chrome DF Drop Tee',
              size: 'L',
              quantity: 1,
              price: 1000,
            },
          ],
        });
        break;

      case 'shipment-tracking':
        subject = '🚚 Shipment Dispatched: Order #ORD-882419 En Route';
        html = getShipmentTrackingEmailHtml({
          orderId: 'ORD-882419',
          fullName: 'VIP Customer',
          courierName: 'Steadfast Courier Express',
          trackingNumber: 'STDF-99482710-BD',
          currentStatus: 'Dispatched & In Transit to Destination Hub',
          destination: 'Dhanmondi 27, Dhaka',
          remainingCOD: 1850,
        });
        break;

      case 'reset-code':
        const testCode = Math.floor(100000 + Math.random() * 900000).toString();
        subject = `Your Deshi Flex verification code: ${testCode}`;
        html = getResetCodeEmailHtml({
          resetCode: testCode,
          email: to,
          expiresInMinutes: 15,
        });
        text = getResetCodeEmailText({
          resetCode: testCode,
          email: to,
          expiresInMinutes: 15,
        });
        break;

      case 'support-inquiry':
        subject = 'Support Ticket Received: #TCK-2026-914 - Deshi Flex Support';
        html = getSupportInquiryEmailHtml({
          ticketId: 'TCK-2026-914',
          fullName: 'Valued Customer',
          email: to,
          subject: 'Order sizing inquiry & custom streetwear drop',
          message: 'Can you advise on the fit for the oversized 240 GSM drop shoulder tee?',
        });
        break;

      default:
        return NextResponse.json({ success: false, error: 'Unknown template' }, { status: 400 });
    }

    const result = await sendEmail({
      to,
      from: fromSender,
      subject,
      html,
      text: text || undefined,
    });

    return NextResponse.json({
      success: result.success,
      id: result.id,
      simulated: result.simulated,
      from: fromSender,
      error: result.error,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ success: false, error: error.message || 'Failed to dispatch email' }, { status: 500 });
  }
}
