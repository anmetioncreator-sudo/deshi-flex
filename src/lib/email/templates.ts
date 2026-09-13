/**
 * Deshi Flex Luxury Streetwear Responsive HTML & Plain Text Email Templates
 * Designed for maximum inbox deliverability, spam filter compliance, and clean luxury aesthetic.
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.deshiflex.shop';
const BRAND_TAGLINE = 'Wear Your Culture • Flex Your Style';
const OFFICIAL_PHONE = '01710793841';
const OFFICIAL_WHATSAPP = 'https://wa.me/8801710793841';
const OFFICIAL_FB = 'https://www.facebook.com/deshiflex12';
const OFFICIAL_IG = 'https://www.instagram.com/deshiflex12/';

// Shared layout wrapper for email consistency
export function wrapEmailLayout(content: string, preheader: string = ''): string {
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Deshi Flex</title>
  <!--[if mso]>
  <style>
    body, table, td, p, a, span { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f6f7fb;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    table { border-collapse: collapse; }
    img { border: 0; display: block; max-width: 100%; }
    a { color: #059669; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; border-radius: 0 !important; }
      .p-mobile { padding: 24px 18px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f7fb; color: #18181b;">
  ${preheader ? `
  <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all;">
    ${preheader}
  </div>` : ''}

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f6f7fb; padding: 32px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table class="container" width="560" cellpadding="0" cellspacing="0" border="0" style="width: 560px; max-width: 560px; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 28px 30px 20px 30px; text-align: center; border-bottom: 1px solid #f4f4f5; background-color: #ffffff;">
              <a href="${APP_URL}" target="_blank" style="display: inline-block; text-decoration: none;">
                <span style="font-size: 24px; font-weight: 900; letter-spacing: 0.22em; color: #09090b; text-transform: uppercase;">
                  DESHI<span style="color: #059669;">FLEX</span>
                </span>
              </a>
              <div style="font-size: 10px; color: #71717a; letter-spacing: 0.25em; text-transform: uppercase; margin-top: 5px; font-weight: 700;">
                ${BRAND_TAGLINE}
              </div>
            </td>
          </tr>

          <!-- Dynamic Body Content -->
          <tr>
            <td class="p-mobile" style="padding: 32px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Clean Luxury Streetwear Footer -->
          <tr>
            <td style="padding: 24px 30px; background-color: #fafafa; border-top: 1px solid #f4f4f5; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <a href="${OFFICIAL_WHATSAPP}" target="_blank" style="display: inline-block; margin: 0 8px; font-size: 11px; color: #059669; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">WhatsApp</a>
                    <span style="color: #d4d4d8;">•</span>
                    <a href="${OFFICIAL_FB}" target="_blank" style="display: inline-block; margin: 0 8px; font-size: 11px; color: #52525b; letter-spacing: 0.12em; text-transform: uppercase;">Facebook</a>
                    <span style="color: #d4d4d8;">•</span>
                    <a href="${OFFICIAL_IG}" target="_blank" style="display: inline-block; margin: 0 8px; font-size: 11px; color: #52525b; letter-spacing: 0.12em; text-transform: uppercase;">Instagram</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 11px; color: #71717a; line-height: 1.6; padding-bottom: 6px;">
                    Hotline: <strong style="color: #27272a;">${OFFICIAL_PHONE}</strong> | Support: <a href="mailto:support@deshiflex.shop" style="color: #059669; font-weight: 600;">support@deshiflex.shop</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 10px; color: #a1a1aa; letter-spacing: 0.08em; text-transform: uppercase;">
                    &copy; ${new Date().getFullYear()} Deshi Flex. All rights reserved. Dhaka, Bangladesh.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * 1. VERIFICATION CODE / PASSCODE RESET OTP EMAIL TEMPLATE
 * Designed to bypass spam heuristics with clean luxury typography, no alarmist red warnings,
 * no IP address stamps, and clear sender alignment.
 */
export function getResetCodeEmailHtml(params: {
  resetCode: string;
  email: string;
  expiresInMinutes?: number;
  ipAddress?: string;
}): string {
  const expiry = params.expiresInMinutes || 10;

  const body = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 5px 16px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 999px; font-size: 11px; font-weight: 700; color: #047857; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 14px;">
        Account Verification
      </div>
      <h1 style="font-size: 24px; font-weight: 800; color: #09090b; letter-spacing: -0.02em; margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        Your Verification Code
      </h1>
      <p style="font-size: 14px; color: #52525b; line-height: 1.6; max-width: 440px; margin: 0 auto;">
        Please use the 6-digit verification code below to verify your Deshi Flex account.
      </p>
    </div>

    <!-- Clean Luxury Code Card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; margin: 24px 0; text-align: center; padding: 26px 16px;">
      <tr>
        <td align="center">
          <div style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px;">
            One-Time Code
          </div>
          <div style="font-size: 38px; font-weight: 800; color: #09090b; letter-spacing: 0.32em; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; padding: 14px 28px; background-color: #ffffff; display: inline-block; border-radius: 12px; border: 2px solid #059669; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.08);">
            ${params.resetCode}
          </div>
          <div style="font-size: 12px; color: #64748b; margin-top: 14px; font-weight: 500;">
            This code will expire in <strong style="color: #09090b;">${expiry} minutes</strong>.
          </div>
        </td>
      </tr>
    </table>

    <div style="font-size: 12px; color: #71717a; line-height: 1.6; background-color: #fcfcfc; padding: 14px 18px; border-radius: 10px; border: 1px solid #f4f4f5; text-align: center;">
      If you did not request this verification code, you can safely disregard this email. No changes have been made to your account.
    </div>
  `;

  return wrapEmailLayout(body, `Your Deshi Flex verification code is ${params.resetCode}`);
}

/**
 * Plain text fallback for OTP verification emails
 * Crucial for spam score reduction (MIME multipart/alternative)
 */
export function getResetCodeEmailText(params: {
  resetCode: string;
  email: string;
  expiresInMinutes?: number;
}): string {
  const expiry = params.expiresInMinutes || 10;
  return `Deshi Flex Verification Code\n\n` +
    `Your verification code is: ${params.resetCode}\n\n` +
    `This code will expire in ${expiry} minutes.\n\n` +
    `If you did not request this code, you can safely disregard this email. No changes have been made to your account.\n\n` +
    `---\n` +
    `Deshi Flex Support\n` +
    `Support Email: support@deshiflex.shop\n` +
    `WhatsApp Concierge: ${OFFICIAL_WHATSAPP}\n` +
    `Website: https://www.deshiflex.shop\n`;
}

/**
 * 2. WELCOME EMAIL TEMPLATE
 */
export function getWelcomeEmailHtml(params: { name?: string; email: string; discountCode?: string }): string {
  const customerName = params.name ? params.name.trim() : 'Flex Enthusiast';
  const code = params.discountCode || 'FLEXDROP';

  const body = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 5px 16px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 999px; font-size: 11px; font-weight: 700; color: #047857; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 14px;">
        VIP ACCESS GRANTED
      </div>
      <h1 style="font-size: 24px; font-weight: 800; color: #09090b; letter-spacing: -0.01em; margin: 0 0 10px 0;">
        WELCOME TO THE MOVEMENT
      </h1>
      <p style="font-size: 14px; color: #52525b; line-height: 1.6; max-width: 460px; margin: 0 auto;">
        Welcome, <strong style="color: #09090b;">${customerName}</strong>. You have entered the inner circle of Deshi Flex — where modern streetwear unites with Bangladeshi cultural heritage.
      </p>
    </div>

    <!-- Exclusive Voucher Card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 2px dashed #059669; border-radius: 16px; margin: 24px 0; text-align: center; padding: 24px;">
      <tr>
        <td>
          <div style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 8px;">
            YOUR EXCLUSIVE WELCOME VOUCHER
          </div>
          <div style="font-size: 26px; font-weight: 900; color: #059669; letter-spacing: 0.25em; font-family: monospace; background-color: #ffffff; display: inline-block; padding: 10px 24px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 8px;">
            ${code}
          </div>
          <div style="font-size: 13px; color: #52525b;">
            Enjoy <strong style="color: #09090b;">15% OFF</strong> on your first order. Apply at checkout.
          </div>
        </td>
      </tr>
    </table>

    <div style="margin: 24px 0; font-size: 13px; color: #52525b; line-height: 1.7;">
      <p style="margin-bottom: 10px; font-weight: 700; color: #09090b;">What makes Deshi Flex different:</p>
      <ul style="padding-left: 20px; margin: 0; color: #52525b;">
        <li style="margin-bottom: 6px;"><strong style="color: #09090b;">240+ GSM Heavyweight Cotton:</strong> Custom engineered luxury drop-shoulder silhouettes.</li>
        <li style="margin-bottom: 6px;"><strong style="color: #09090b;">Interactive 3D Studio:</strong> Design your bespoke apparel live before purchasing.</li>
        <li style="margin-bottom: 6px;"><strong style="color: #09090b;">Fast Dispatch:</strong> Cash on Delivery available nationwide across Bangladesh.</li>
      </ul>
    </div>

    <!-- Call to Action Button -->
    <div style="text-align: center; margin-top: 28px;">
      <a href="${APP_URL}/shop" target="_blank" style="display: inline-block; background-color: #059669; color: #ffffff; font-weight: 700; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; padding: 15px 34px; border-radius: 12px; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.25);">
        EXPLORE THE COLLECTION &rarr;
      </a>
    </div>
  `;

  return wrapEmailLayout(body, 'Welcome to Deshi Flex! Your exclusive 15% VIP discount code is inside.');
}

/**
 * Plain text fallback for welcome email
 */
export function getWelcomeEmailText(params: { name?: string; discountCode?: string }): string {
  const customerName = params.name ? params.name.trim() : 'Flex Enthusiast';
  const code = params.discountCode || 'FLEXDROP';

  return `Welcome to Deshi Flex, ${customerName}!\n\n` +
    `Your exclusive 15% welcome discount code is: ${code}\n\n` +
    `Apply this code at checkout on your first order at https://www.deshiflex.shop/shop\n\n` +
    `Deshi Flex Support\n` +
    `Email: support@deshiflex.shop\n` +
    `Hotline: ${OFFICIAL_PHONE}\n`;
}

/**
 * 3. ORDER CONFIRMATION & DETAILS EMAIL TEMPLATE
 */
export interface OrderEmailItem {
  id?: string;
  name: string;
  size?: string;
  quantity: number;
  price: number;
  image?: string;
}

export function getOrderConfirmationEmailHtml(params: {
  orderId: string;
  fullName: string;
  email?: string;
  phone: string;
  address: string;
  region: string;
  items: OrderEmailItem[];
  advancePaid: number;
  remainingBalance: number;
  trxId?: string;
  specialNotes?: string;
}): string {
  const isDhaka = params.region.toLowerCase().includes('dhaka');
  const deliveryTimeline = isDhaka ? '24 - 48 Hours' : '3 - 5 Days Nationwide';
  const totalAmount = params.advancePaid + params.remainingBalance;

  const itemsRows = params.items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5;">
        <div style="font-size: 13px; font-weight: 700; color: #09090b;">${item.name}</div>
        <div style="font-size: 11px; color: #71717a; margin-top: 3px;">
          ${item.size ? `Size: <strong style="color: #27272a;">${item.size}</strong> | ` : ''}
          Qty: <strong style="color: #27272a;">${item.quantity}</strong>
        </div>
      </td>
      <td align="right" style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; font-size: 13px; font-weight: 700; color: #059669; font-family: monospace;">
        ${(item.price * item.quantity).toLocaleString()} BDT
      </td>
    </tr>
  `).join('');

  const body = `
    <!-- Success Header Badge -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 5px 16px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 999px; font-size: 11px; font-weight: 700; color: #047857; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 14px;">
        Order Confirmed
      </div>
      <h1 style="font-size: 24px; font-weight: 800; color: #09090b; letter-spacing: -0.01em; margin: 0 0 8px 0;">
        Thank You For Your Order
      </h1>
      <p style="font-size: 13px; color: #52525b; margin: 0;">
        Dear <strong style="color: #09090b;">${params.fullName}</strong>, we have received your order and our fulfillment team is preparing it.
      </p>
    </div>

    <!-- Order Tracking ID Box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; margin-bottom: 24px; padding: 18px 20px;">
      <tr>
        <td>
          <div style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 4px;">Order Number</div>
          <div style="font-size: 18px; font-weight: 800; color: #059669; font-family: monospace; letter-spacing: 0.05em;">
            ${params.orderId}
          </div>
        </td>
        <td align="right">
          <div style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 4px;">Estimated Arrival</div>
          <div style="font-size: 13px; font-weight: 700; color: #09090b;">
            ${deliveryTimeline}
          </div>
        </td>
      </tr>
    </table>

    <!-- Itemized Breakdown -->
    <div style="margin-bottom: 24px;">
      <div style="font-size: 11px; font-weight: 800; color: #71717a; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px; border-bottom: 1px solid #f4f4f5; padding-bottom: 8px;">
        Order Items
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        ${itemsRows}
      </table>
    </div>

    <!-- Financial / COD Split Table -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 20px; margin-bottom: 24px; font-size: 12px;">
      <tr>
        <td style="color: #64748b; padding: 5px 0;">Order Total:</td>
        <td align="right" style="color: #09090b; font-weight: 700; font-family: monospace;">${totalAmount.toLocaleString()} BDT</td>
      </tr>
      <tr>
        <td style="color: #64748b; padding: 5px 0;">
          Advance Paid (${params.trxId ? `TrxID: ${params.trxId}` : 'Online'}):
        </td>
        <td align="right" style="color: #059669; font-weight: 700; font-family: monospace;">- ${params.advancePaid.toLocaleString()} BDT</td>
      </tr>
      <tr>
        <td style="color: #b45309; font-weight: 800; padding: 8px 0 0 0; border-top: 1px solid #e2e8f0;">
          Payable on Delivery (Cash on Delivery):
        </td>
        <td align="right" style="color: #b45309; font-weight: 900; font-size: 15px; font-family: monospace; padding: 8px 0 0 0; border-top: 1px solid #e2e8f0;">
          ${params.remainingBalance.toLocaleString()} BDT
        </td>
      </tr>
    </table>

    <!-- Shipping Destination Info -->
    <div style="background-color: #fcfcfc; border-left: 3px solid #059669; padding: 14px 18px; border-radius: 4px 10px 10px 4px; margin-bottom: 28px; font-size: 12px; line-height: 1.6; border: 1px solid #f4f4f5; border-left: 3px solid #059669;">
      <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 4px;">
        Delivery Address
      </div>
      <div style="color: #09090b; font-weight: 600;">${params.fullName} (${params.phone})</div>
      <div style="color: #52525b;">${params.address}</div>
      <div style="color: #71717a;">Division/District: <strong style="color: #27272a;">${params.region}</strong></div>
      ${params.specialNotes ? `<div style="color: #71717a; margin-top: 4px; font-style: italic;">Notes: "${params.specialNotes}"</div>` : ''}
    </div>

    <!-- Live Track Order CTA -->
    <div style="text-align: center; margin-top: 24px;">
      <a href="${APP_URL}/track-order?id=${params.orderId}" target="_blank" style="display: inline-block; background-color: #059669; color: #ffffff; font-weight: 700; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; padding: 15px 34px; border-radius: 12px; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.2);">
        TRACK ORDER STATUS &rarr;
      </a>
      <div style="margin-top: 14px;">
        <a href="${OFFICIAL_WHATSAPP}" target="_blank" style="font-size: 11px; color: #64748b; text-decoration: underline;">
          Questions? Chat with WhatsApp Concierge (${OFFICIAL_PHONE})
        </a>
      </div>
    </div>
  `;

  return wrapEmailLayout(body, `Order #${params.orderId} confirmed. Details and tracking information inside.`);
}

/**
 * Plain text fallback for order confirmation email
 */
export function getOrderConfirmationEmailText(params: {
  orderId: string;
  fullName: string;
  phone: string;
  address: string;
  region: string;
  items: OrderEmailItem[];
  advancePaid: number;
  remainingBalance: number;
}): string {
  const itemsText = params.items
    .map(i => `- ${i.name} (Qty: ${i.quantity}${i.size ? `, Size: ${i.size}` : ''}) - ${(i.price * i.quantity).toLocaleString()} BDT`)
    .join('\n');

  return `Order Confirmed: #${params.orderId}\n\n` +
    `Hello ${params.fullName},\n` +
    `Thank you for shopping with Deshi Flex. Your order has been received.\n\n` +
    `Items:\n${itemsText}\n\n` +
    `Advance Paid: ${params.advancePaid.toLocaleString()} BDT\n` +
    `Cash on Delivery Due: ${params.remainingBalance.toLocaleString()} BDT\n\n` +
    `Delivery Address: ${params.address}, ${params.region}\n` +
    `Contact Phone: ${params.phone}\n\n` +
    `Track your order: https://www.deshiflex.shop/track-order?id=${params.orderId}\n\n` +
    `Deshi Flex Support\n` +
    `Email: support@deshiflex.shop\n` +
    `Hotline: ${OFFICIAL_PHONE}\n`;
}

/**
 * 4. SHIPMENT TRACKING / DISPATCH UPDATE EMAIL
 */
export function getShipmentTrackingEmailHtml(params: {
  orderId: string;
  fullName: string;
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  currentStatus: string;
  destination: string;
  remainingCOD: number;
}): string {
  const courier = params.courierName || 'Steadfast Courier';
  const liveTrackingUrl = params.trackingUrl || `${APP_URL}/track-order?id=${params.orderId}`;

  const body = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 5px 16px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 999px; font-size: 11px; font-weight: 700; color: #1d4ed8; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 14px;">
        Shipment Dispatched
      </div>
      <h1 style="font-size: 24px; font-weight: 800; color: #09090b; letter-spacing: -0.01em; margin: 0 0 8px 0;">
        Your Package Is On Its Way
      </h1>
      <p style="font-size: 13px; color: #52525b; margin: 0;">
        Hello <strong style="color: #09090b;">${params.fullName}</strong>, your Deshi Flex order has been dispatched with our delivery partner.
      </p>
    </div>

    <!-- Live Parcel Status Card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
      <tr>
        <td style="padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">
          <div style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em;">Current Status</div>
          <div style="font-size: 15px; font-weight: 700; color: #1d4ed8; margin-top: 3px;">
            ${params.currentStatus}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <div style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em;">Courier Partner</div>
                <div style="font-size: 13px; font-weight: 700; color: #09090b; margin-top: 2px;">${courier}</div>
              </td>
              ${params.trackingNumber ? `
                <td align="right">
                  <div style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em;">Tracking Code</div>
                  <div style="font-size: 13px; font-weight: 800; color: #059669; font-family: monospace; margin-top: 2px;">${params.trackingNumber}</div>
                </td>
              ` : ''}
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding-top: 12px;">
          <div style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em;">Destination</div>
          <div style="font-size: 12px; color: #52525b; margin-top: 2px;">${params.destination}</div>
        </td>
      </tr>
    </table>

    ${params.remainingCOD > 0 ? `
      <!-- COD Reminder Notice -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;">
        <tr>
          <td>
            <div style="font-size: 11px; font-weight: 700; color: #b45309; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">
              Cash on Delivery (COD) Amount
            </div>
            <div style="font-size: 12px; color: #78350f;">
              Please keep <strong style="color: #b45309; font-family: monospace; font-size: 14px;">${params.remainingCOD.toLocaleString()} BDT</strong> exact cash ready for the delivery rider.
            </div>
          </td>
        </tr>
      </table>
    ` : ''}

    <!-- Live Tracking CTA -->
    <div style="text-align: center; margin-top: 28px;">
      <a href="${liveTrackingUrl}" target="_blank" style="display: inline-block; background-color: #059669; color: #ffffff; font-weight: 700; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; padding: 15px 34px; border-radius: 12px; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.2);">
        TRACK SHIPMENT &rarr;
      </a>
    </div>
  `;

  return wrapEmailLayout(body, `Order #${params.orderId} has been dispatched. Track your delivery status.`);
}

/**
 * 5. CUSTOMER SUPPORT & INQUIRY ACKNOWLEDGMENT
 */
export function getSupportInquiryEmailHtml(params: {
  ticketId: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
}): string {
  const body = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 5px 16px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 999px; font-size: 11px; font-weight: 700; color: #047857; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 14px;">
        Ticket Received
      </div>
      <h1 style="font-size: 24px; font-weight: 800; color: #09090b; letter-spacing: -0.01em; margin: 0 0 8px 0;">
        We Received Your Message
      </h1>
      <p style="font-size: 13px; color: #52525b; margin: 0;">
        Hello <strong style="color: #09090b;">${params.fullName}</strong>, our support team has received your ticket and will assist you shortly.
      </p>
    </div>

    <!-- Ticket Summary Card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
      <tr>
        <td style="padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <div style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em;">Ticket Reference</div>
                <div style="font-size: 15px; font-weight: 800; color: #059669; font-family: monospace; margin-top: 2px;">${params.ticketId}</div>
              </td>
              <td align="right">
                <div style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em;">Avg. Response</div>
                <div style="font-size: 13px; font-weight: 700; color: #09090b; margin-top: 2px;">Within 2-4 Hours</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
          <div style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em;">Subject</div>
          <div style="font-size: 13px; font-weight: 700; color: #09090b; margin-top: 3px;">${params.subject}</div>
        </td>
      </tr>
      <tr>
        <td style="padding-top: 12px;">
          <div style="font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em;">Your Message</div>
          <div style="font-size: 12px; color: #52525b; margin-top: 4px; line-height: 1.6; font-style: italic; background-color: #ffffff; padding: 12px 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
            "${params.message}"
          </div>
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin-top: 28px;">
      <a href="${OFFICIAL_WHATSAPP}" target="_blank" style="display: inline-block; background-color: #059669; color: #ffffff; font-weight: 700; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; padding: 14px 32px; border-radius: 12px;">
        INSTANT WHATSAPP CHAT (${OFFICIAL_PHONE}) &rarr;
      </a>
    </div>
  `;

  return wrapEmailLayout(body, `Support ticket ${params.ticketId} received. Our team will get back to you shortly.`);
}

/**
 * 6. ADMIN NEW ORDER ALERT NOTIFICATION (Sent to store admin)
 */
export function getAdminOrderAlertEmailHtml(params: {
  orderId: string;
  fullName: string;
  email?: string;
  phone: string;
  address: string;
  region: string;
  advancePaid: number;
  remainingBalance: number;
  trxId?: string;
  itemsCount: number;
}): string {
  const body = `
    <div style="margin-bottom: 20px;">
      <div style="display: inline-block; padding: 4px 12px; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-weight: 800; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; border-radius: 4px;">
        NEW ORDER SUBMITTED
      </div>
      <h2 style="font-size: 22px; font-weight: 900; color: #09090b; margin: 10px 0 4px 0;">
        Order #${params.orderId}
      </h2>
      <div style="font-size: 12px; color: #64748b;">Customer: <strong style="color: #09090b;">${params.fullName}</strong></div>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; font-size: 12px; line-height: 1.8; margin-bottom: 20px;">
      <tr><td style="color: #64748b;">Phone:</td><td style="color: #09090b; font-weight: 700; font-family: monospace;">${params.phone}</td></tr>
      <tr><td style="color: #64748b;">Email:</td><td style="color: #09090b;">${params.email || 'None'}</td></tr>
      <tr><td style="color: #64748b;">Delivery Address:</td><td style="color: #09090b;">${params.address}, ${params.region}</td></tr>
      <tr><td style="color: #64748b;">Items Count:</td><td style="color: #09090b;">${params.itemsCount} item(s)</td></tr>
      <tr><td style="color: #64748b;">Advance Paid:</td><td style="color: #059669; font-weight: 700;">${params.advancePaid} BDT (TrxID: ${params.trxId || 'N/A'})</td></tr>
      <tr><td style="color: #64748b;">Payable on COD:</td><td style="color: #b45309; font-weight: 700;">${params.remainingBalance} BDT</td></tr>
    </table>

    <div style="text-align: center;">
      <a href="${APP_URL}/df-control-vault" target="_blank" style="display: inline-block; background-color: #09090b; color: #ffffff; font-weight: 700; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; padding: 12px 28px; border-radius: 8px;">
        OPEN ADMIN DASHBOARD &rarr;
      </a>
    </div>
  `;

  return wrapEmailLayout(body, `[New Order] #${params.orderId} from ${params.fullName} (${params.phone})`);
}
