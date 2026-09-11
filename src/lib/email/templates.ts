/**
 * Deshi Flex Luxury Streetwear Responsive HTML Email Templates
 * Styled with signature dark aesthetic, metallic gold accents, and bulletproof inline CSS.
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://deshiflex.com';
const BRAND_TAGLINE = 'Wear Your Culture • Flex Your Style';
const OFFICIAL_PHONE = '01710793841';
const OFFICIAL_WHATSAPP = 'https://wa.me/8801710793841';
const OFFICIAL_FB = 'https://www.facebook.com/deshiflex12';
const OFFICIAL_IG = 'https://www.instagram.com/deshiflex12/';

// Shared layout wrapper for email consistency
function wrapEmailLayout(content: string, preheader: string = ''): string {
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
      background-color: #050505;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    table { border-collapse: collapse; }
    img { border: 0; display: block; max-width: 100%; }
    a { color: #10b981; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 12px !important; }
      .p-mobile { padding: 20px 16px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; color: #f5f5f5;">
  <!-- Hidden Preheader -->
  <div style="display: none; font-size: 1px; color: #050505; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader}
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #050505; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width: 600px; max-width: 600px; background-color: #0c0c0c; border: 1px solid #222222; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.8);">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 32px 30px 24px 30px; text-align: center; border-bottom: 1px solid #1a1a1a; background: linear-gradient(180deg, #141414 0%, #0c0c0c 100%);">
              <a href="${APP_URL}" target="_blank" style="display: inline-block;">
                <span style="font-size: 28px; font-weight: 900; letter-spacing: 0.25em; color: #ffffff; text-transform: uppercase;">
                  DESHI<span style="color: #10b981;">FLEX</span>
                </span>
              </a>
              <div style="font-size: 10px; color: #888888; letter-spacing: 0.3em; text-transform: uppercase; margin-top: 6px; font-weight: 600;">
                ${BRAND_TAGLINE}
              </div>
            </td>
          </tr>

          <!-- Dynamic Body Content -->
          <tr>
            <td class="p-mobile" style="padding: 36px 36px;">
              ${content}
            </td>
          </tr>

          <!-- Luxury Streetwear Footer -->
          <tr>
            <td style="padding: 28px 30px; background-color: #080808; border-top: 1px solid #1a1a1a; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <a href="${OFFICIAL_WHATSAPP}" target="_blank" style="display: inline-block; margin: 0 10px; font-size: 11px; color: #10b981; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;">WhatsApp Concierge</a>
                    <span style="color: #333333;">•</span>
                    <a href="${OFFICIAL_FB}" target="_blank" style="display: inline-block; margin: 0 10px; font-size: 11px; color: #aaaaaa; letter-spacing: 0.15em; text-transform: uppercase;">Facebook</a>
                    <span style="color: #333333;">•</span>
                    <a href="${OFFICIAL_IG}" target="_blank" style="display: inline-block; margin: 0 10px; font-size: 11px; color: #aaaaaa; letter-spacing: 0.15em; text-transform: uppercase;">Instagram</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 11px; color: #555555; line-height: 1.6; padding-bottom: 8px;">
                    Hotline: <strong style="color: #888888;">${OFFICIAL_PHONE}</strong> | Support: <a href="mailto:support@deshiflex.com" style="color: #888888;">support@deshiflex.com</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 10px; color: #444444; letter-spacing: 0.1em; text-transform: uppercase;">
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
 * 1. WELCOME EMAIL TEMPLATE
 */
export function getWelcomeEmailHtml(params: { name?: string; email: string; discountCode?: string }): string {
  const customerName = params.name ? params.name.trim() : 'Flex Enthusiast';
  const code = params.discountCode || 'FLEXDROP';

  const body = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 4px 14px; background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 999px; font-size: 11px; font-weight: 700; color: #10b981; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 16px;">
        VIP ACCESS GRANTED
      </div>
      <h1 style="font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 12px 0;">
        WELCOME TO THE MOVEMENT
      </h1>
      <p style="font-size: 14px; color: #999999; line-height: 1.6; max-width: 480px; margin: 0 auto;">
        Salutations, <strong style="color: #ffffff;">${customerName}</strong>. You have entered the inner circle of Deshi Flex — where modern high-fashion streetwear unites with raw Bangladeshi culture.
      </p>
    </div>

    <!-- Exclusive Voucher Card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #121212; border: 1px dashed #10b981; border-radius: 16px; margin: 24px 0; text-align: center; padding: 24px;">
      <tr>
        <td>
          <div style="font-size: 11px; font-weight: 700; color: #888888; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px;">
            YOUR EXCLUSIVE WELCOME REWARD
          </div>
          <div style="font-size: 24px; font-weight: 900; color: #10b981; letter-spacing: 0.25em; font-family: monospace; background-color: #000000; display: inline-block; padding: 10px 24px; border-radius: 8px; border: 1px solid #333333; margin-bottom: 8px;">
            ${code}
          </div>
          <div style="font-size: 12px; color: #aaaaaa;">
            Enjoy <strong style="color: #ffffff;">15% OFF</strong> on your first order. Apply at checkout.
          </div>
        </td>
      </tr>
    </table>

    <div style="margin: 28px 0; font-size: 13px; color: #888888; line-height: 1.7;">
      <p style="margin-bottom: 12px;">Here is what awaits you:</p>
      <ul style="padding-left: 20px; margin: 0; color: #cccccc;">
        <li style="margin-bottom: 8px;"><strong>Limited Edition Heavyweight Drops:</strong> Engineered with 240+ GSM premium cotton & luxury drop-shoulder tailoring.</li>
        <li style="margin-bottom: 8px;"><strong>Custom Flex Apparel:</strong> Design your own bespoke oversized tees with 3D live mockups.</li>
        <li style="margin-bottom: 8px;"><strong>Nationwide Fast Dispatch:</strong> Cash on Delivery across all 64 districts.</li>
      </ul>
    </div>

    <!-- Call to Action Button -->
    <div style="text-align: center; margin-top: 32px;">
      <a href="${APP_URL}/shop" target="_blank" style="display: inline-block; background-color: #10b981; color: #000000; font-weight: 800; font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; padding: 16px 36px; border-radius: 12px; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);">
        EXPLORE THE LATEST DROP &rarr;
      </a>
    </div>
  `;

  return wrapEmailLayout(body, 'Welcome to Deshi Flex Streetwear! Your exclusive 15% VIP code inside.');
}

/**
 * 2. ORDER CONFIRMATION & DETAILS EMAIL TEMPLATE
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
      <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a;">
        <div style="font-size: 13px; font-weight: 700; color: #ffffff;">${item.name}</div>
        <div style="font-size: 11px; color: #888888; margin-top: 3px;">
          ${item.size ? `Size: <strong style="color: #cccccc;">${item.size}</strong> | ` : ''}
          Qty: <strong style="color: #cccccc;">${item.quantity}</strong>
        </div>
      </td>
      <td align="right" style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; font-size: 13px; font-weight: 700; color: #10b981; font-family: monospace;">
        ${(item.price * item.quantity).toLocaleString()} BDT
      </td>
    </tr>
  `).join('');

  const body = `
    <!-- Success Header Badge -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 5px 16px; background-color: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 999px; font-size: 11px; font-weight: 800; color: #10b981; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 14px;">
        ✓ ORDER CONFIRMED
      </div>
      <h1 style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 8px 0;">
        THANK YOU FOR YOUR ORDER
      </h1>
      <p style="font-size: 13px; color: #999999; margin: 0;">
        Dear <strong style="color: #ffffff;">${params.fullName}</strong>, we have received your reservation and our concierge team has queued it for verification.
      </p>
    </div>

    <!-- Order Tracking ID Box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #121212; border: 1px solid #222222; border-radius: 14px; margin-bottom: 24px; padding: 18px 20px;">
      <tr>
        <td>
          <div style="font-size: 10px; color: #777777; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 4px;">Order Tracking ID</div>
          <div style="font-size: 18px; font-weight: 900; color: #10b981; font-family: monospace; letter-spacing: 0.05em;">
            ${params.orderId}
          </div>
        </td>
        <td align="right">
          <div style="font-size: 10px; color: #777777; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 4px;">Estimated Arrival</div>
          <div style="font-size: 13px; font-weight: 700; color: #ffffff;">
            ${deliveryTimeline}
          </div>
        </td>
      </tr>
    </table>

    <!-- Itemized Breakdown -->
    <div style="margin-bottom: 24px;">
      <div style="font-size: 11px; font-weight: 800; color: #888888; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 12px; border-bottom: 1px solid #222222; padding-bottom: 8px;">
        Order Details
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        ${itemsRows}
      </table>
    </div>

    <!-- Financial / COD Split Table -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #121212; border: 1px solid #222222; border-radius: 14px; padding: 18px 20px; margin-bottom: 24px; font-size: 12px;">
      <tr>
        <td style="color: #888888; padding: 4px 0;">Subtotal / Total Value:</td>
        <td align="right" style="color: #ffffff; font-weight: 700; font-family: monospace;">${totalAmount.toLocaleString()} BDT</td>
      </tr>
      <tr>
        <td style="color: #888888; padding: 4px 0;">
          Advance Paid (${params.trxId ? `TrxID: ${params.trxId}` : 'bKash/Nagad'}):
        </td>
        <td align="right" style="color: #10b981; font-weight: 700; font-family: monospace;">- ${params.advancePaid.toLocaleString()} BDT</td>
      </tr>
      <tr>
        <td style="color: #ffaa00; font-weight: 800; padding: 8px 0 0 0; border-top: 1px solid #222222;">
          Payable on Delivery (Cash on Delivery):
        </td>
        <td align="right" style="color: #ffaa00; font-weight: 900; font-size: 15px; font-family: monospace; padding: 8px 0 0 0; border-top: 1px solid #222222;">
          ${params.remainingBalance.toLocaleString()} BDT
        </td>
      </tr>
    </table>

    <!-- Shipping Destination Info -->
    <div style="background-color: #0f0f0f; border-left: 3px solid #10b981; padding: 14px 18px; border-radius: 4px 10px 10px 4px; margin-bottom: 28px; font-size: 12px; line-height: 1.6;">
      <div style="font-size: 10px; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 4px;">
        Shipping Destination
      </div>
      <div style="color: #ffffff; font-weight: 600;">${params.fullName} (${params.phone})</div>
      <div style="color: #aaaaaa;">${params.address}</div>
      <div style="color: #888888;">Division/District: <strong style="color: #cccccc;">${params.region}</strong></div>
      ${params.specialNotes ? `<div style="color: #777777; margin-top: 4px; font-style: italic;">Notes: "${params.specialNotes}"</div>` : ''}
    </div>

    <!-- Live Track Order CTA -->
    <div style="text-align: center; margin-top: 24px;">
      <a href="${APP_URL}/track-order?id=${params.orderId}" target="_blank" style="display: inline-block; background-color: #10b981; color: #000000; font-weight: 800; font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; padding: 16px 36px; border-radius: 12px; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);">
        TRACK YOUR ORDER LIVE &rarr;
      </a>
      <div style="margin-top: 14px;">
        <a href="${OFFICIAL_WHATSAPP}" target="_blank" style="font-size: 11px; color: #888888; text-decoration: underline;">
          Need to modify your order? Chat with WhatsApp Concierge (01710793841)
        </a>
      </div>
    </div>
  `;

  return wrapEmailLayout(body, `Order ${params.orderId} confirmed! Details and tracking information inside.`);
}

/**
 * 3. PRODUCT LOCATION & SHIPMENT TRACKING / DISPATCH UPDATE
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
      <div style="display: inline-block; padding: 4px 14px; background-color: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 999px; font-size: 11px; font-weight: 800; color: #60a5fa; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 14px;">
        🚚 SHIPMENT EN ROUTE
      </div>
      <h1 style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 8px 0;">
        PARCEL DISPATCHED &amp; TRACKING LIVE
      </h1>
      <p style="font-size: 13px; color: #999999; margin: 0;">
        Hello <strong style="color: #ffffff;">${params.fullName}</strong>, your Deshi Flex package has been packed, sealed, and handed over to our logistics partner.
      </p>
    </div>

    <!-- Live Parcel Status Card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #121212; border: 1px solid #222222; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
      <tr>
        <td style="padding-bottom: 12px; border-bottom: 1px solid #1f1f1f;">
          <div style="font-size: 10px; color: #777777; text-transform: uppercase; letter-spacing: 0.15em;">Current Status</div>
          <div style="font-size: 16px; font-weight: 800; color: #60a5fa; margin-top: 3px;">
            ${params.currentStatus}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #1f1f1f;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <div style="font-size: 10px; color: #777777; text-transform: uppercase; letter-spacing: 0.15em;">Logistics Partner</div>
                <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-top: 2px;">${courier}</div>
              </td>
              ${params.trackingNumber ? `
                <td align="right">
                  <div style="font-size: 10px; color: #777777; text-transform: uppercase; letter-spacing: 0.15em;">Consignment Code</div>
                  <div style="font-size: 13px; font-weight: 800; color: #10b981; font-family: monospace; margin-top: 2px;">${params.trackingNumber}</div>
                </td>
              ` : ''}
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding-top: 12px;">
          <div style="font-size: 10px; color: #777777; text-transform: uppercase; letter-spacing: 0.15em;">Destination Address</div>
          <div style="font-size: 12px; color: #cccccc; margin-top: 2px;">${params.destination}</div>
        </td>
      </tr>
    </table>

    ${params.remainingCOD > 0 ? `
      <!-- COD Reminder Notice -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: rgba(255, 170, 0, 0.08); border: 1px solid rgba(255, 170, 0, 0.3); border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;">
        <tr>
          <td>
            <div style="font-size: 11px; font-weight: 700; color: #ffaa00; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">
              Cash on Delivery (COD) Amount
            </div>
            <div style="font-size: 12px; color: #dddddd;">
              Please keep <strong style="color: #ffaa00; font-family: monospace; font-size: 14px;">${params.remainingCOD.toLocaleString()} BDT</strong> exact cash ready for the delivery rider upon handover.
            </div>
          </td>
        </tr>
      </table>
    ` : ''}

    <!-- Live Tracking CTA -->
    <div style="text-align: center; margin-top: 28px;">
      <a href="${liveTrackingUrl}" target="_blank" style="display: inline-block; background-color: #60a5fa; color: #000000; font-weight: 800; font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; padding: 16px 36px; border-radius: 12px; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);">
        TRACK PARCEL LOCATION &rarr;
      </a>
    </div>
  `;

  return wrapEmailLayout(body, `Shipment Update: Order ${params.orderId} is dispatched and on its way.`);
}

/**
 * 4. PASSWORD / PASSCODE RESET CODE OTP EMAIL
 */
export function getResetCodeEmailHtml(params: {
  resetCode: string;
  email: string;
  expiresInMinutes?: number;
  ipAddress?: string;
}): string {
  const expiry = params.expiresInMinutes || 15;

  const body = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 4px 14px; background-color: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: 999px; font-size: 11px; font-weight: 800; color: #f87171; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 14px;">
        🔐 SECURITY VERIFICATION
      </div>
      <h1 style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 8px 0;">
        PASSWORD RESET CODE
      </h1>
      <p style="font-size: 13px; color: #999999; margin: 0;">
        We received a request to reset access credentials for <strong style="color: #ffffff;">${params.email}</strong>. Use the one-time verification code below.
      </p>
    </div>

    <!-- Glowing OTP Box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #121212; border: 1px solid #10b981; border-radius: 16px; margin: 28px 0; text-align: center; padding: 28px;">
      <tr>
        <td>
          <div style="font-size: 10px; color: #777777; text-transform: uppercase; letter-spacing: 0.25em; margin-bottom: 10px;">
            ONE-TIME VERIFICATION CODE (OTP)
          </div>
          <div style="font-size: 38px; font-weight: 900; color: #10b981; letter-spacing: 0.35em; font-family: monospace; padding: 12px 20px; background-color: #000000; display: inline-block; border-radius: 10px; border: 1px solid #333333;">
            ${params.resetCode}
          </div>
          <div style="font-size: 11px; color: #f87171; margin-top: 12px; font-weight: 600;">
            ⚠️ Valid for the next ${expiry} minutes only.
          </div>
        </td>
      </tr>
    </table>

    <div style="font-size: 12px; color: #777777; line-height: 1.6; background-color: #0e0e0e; padding: 14px 18px; border-radius: 8px; border: 1px solid #1c1c1c;">
      <p style="margin: 0 0 6px 0;"><strong style="color: #aaaaaa;">Did not request this?</strong> You can safely disregard this email. Your credentials remain completely secure.</p>
      ${params.ipAddress ? `<p style="margin: 0; font-size: 11px; color: #555555;">Request originated from IP: ${params.ipAddress}</p>` : ''}
    </div>
  `;

  return wrapEmailLayout(body, `Your Deshi Flex one-time reset code is: ${params.resetCode}`);
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
      <div style="display: inline-block; padding: 4px 14px; background-color: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 999px; font-size: 11px; font-weight: 800; color: #10b981; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 14px;">
        SUPPORT TICKET RECEIVED
      </div>
      <h1 style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 8px 0;">
        WE ARE ON IT
      </h1>
      <p style="font-size: 13px; color: #999999; margin: 0;">
        Hello <strong style="color: #ffffff;">${params.fullName}</strong>, our support team has received your ticket and assigned a concierge specialist to assist you.
      </p>
    </div>

    <!-- Ticket Summary Card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #121212; border: 1px solid #222222; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
      <tr>
        <td style="padding-bottom: 10px; border-bottom: 1px solid #1f1f1f;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <div style="font-size: 10px; color: #777777; text-transform: uppercase; letter-spacing: 0.15em;">Ticket Reference</div>
                <div style="font-size: 15px; font-weight: 800; color: #10b981; font-family: monospace; margin-top: 2px;">${params.ticketId}</div>
              </td>
              <td align="right">
                <div style="font-size: 10px; color: #777777; text-transform: uppercase; letter-spacing: 0.15em;">Avg. Response Time</div>
                <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-top: 2px;">&lt; 2 Hours</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #1f1f1f;">
          <div style="font-size: 10px; color: #777777; text-transform: uppercase; letter-spacing: 0.15em;">Subject</div>
          <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-top: 3px;">${params.subject}</div>
        </td>
      </tr>
      <tr>
        <td style="padding-top: 12px;">
          <div style="font-size: 10px; color: #777777; text-transform: uppercase; letter-spacing: 0.15em;">Your Message</div>
          <div style="font-size: 12px; color: #aaaaaa; margin-top: 4px; line-height: 1.6; font-style: italic; background-color: #090909; padding: 10px 14px; border-radius: 8px;">
            "${params.message}"
          </div>
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin-top: 28px;">
      <a href="${OFFICIAL_WHATSAPP}" target="_blank" style="display: inline-block; background-color: #10b981; color: #000000; font-weight: 800; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; padding: 14px 32px; border-radius: 12px;">
        INSTANT WHATSAPP CHAT (01710793841) &rarr;
      </a>
    </div>
  `;

  return wrapEmailLayout(body, `Support Ticket ${params.ticketId} received. Our team will get back to you shortly.`);
}

/**
 * 6. ADMIN NEW ORDER ALERT NOTIFICATION (Sent to deshiflex12@gmail.com)
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
      <div style="display: inline-block; padding: 4px 12px; background-color: #10b981; color: #000000; font-weight: 900; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; border-radius: 4px;">
        NEW ORDER SUBMITTED
      </div>
      <h2 style="font-size: 22px; font-weight: 900; color: #ffffff; margin: 10px 0 4px 0;">
        Order #${params.orderId}
      </h2>
      <div style="font-size: 12px; color: #888888;">Customer: <strong style="color: #ffffff;">${params.fullName}</strong></div>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #121212; border: 1px solid #262626; border-radius: 12px; padding: 16px; font-size: 12px; line-height: 1.8; margin-bottom: 20px;">
      <tr><td style="color: #888888;">Phone:</td><td style="color: #ffffff; font-weight: 700; font-family: monospace;">${params.phone}</td></tr>
      <tr><td style="color: #888888;">Email:</td><td style="color: #ffffff;">${params.email || 'None'}</td></tr>
      <tr><td style="color: #888888;">Delivery Address:</td><td style="color: #ffffff;">${params.address}, ${params.region}</td></tr>
      <tr><td style="color: #888888;">Items Count:</td><td style="color: #ffffff;">${params.itemsCount} item(s)</td></tr>
      <tr><td style="color: #888888;">Advance Paid:</td><td style="color: #10b981; font-weight: 700;">${params.advancePaid} BDT (TrxID: ${params.trxId || 'N/A'})</td></tr>
      <tr><td style="color: #888888;">Payable on COD:</td><td style="color: #ffaa00; font-weight: 700;">${params.remainingBalance} BDT</td></tr>
    </table>

    <div style="text-align: center;">
      <a href="${APP_URL}/df-control-vault" target="_blank" style="display: inline-block; background-color: #ffffff; color: #000000; font-weight: 800; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; padding: 12px 28px; border-radius: 8px;">
        OPEN ADMIN VAULT &rarr;
      </a>
    </div>
  `;

  return wrapEmailLayout(body, `[New Order] #${params.orderId} from ${params.fullName} (${params.phone})`);
}
