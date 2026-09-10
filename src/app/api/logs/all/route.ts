import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export interface UnifiedLogItem {
  id: string;
  timestamp: string;
  category: 'stock' | 'sales' | 'finances' | 'orders' | 'security';
  action: string;
  actor: string;
  title: string;
  description: string;
  amount?: number;
  profit?: number;
  quantity?: number;
  direction: 'inflow' | 'outflow' | 'neutral';
  referenceId?: string;
  metadata?: any;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const period = searchParams.get('period') || 'all';
    const query = (searchParams.get('query') || '').trim().toLowerCase();
    const limit = parseInt(searchParams.get('limit') || '300', 10);

    // Calculate date filter
    let dateThreshold: Date | null = null;
    const now = new Date();
    if (period === 'today') {
      dateThreshold = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === '7d') {
      dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === '30d') {
      dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const unifiedLogs: UnifiedLogItem[] = [];

    // 1. Stock Logs
    if (category === 'all' || category === 'stock' || category === 'security') {
      const stockLogs = await prisma.stockLog.findMany({
        where: dateThreshold ? { createdAt: { gte: dateThreshold } } : undefined,
        orderBy: { createdAt: 'desc' },
        take: 200,
      });

      for (const item of stockLogs) {
        if (item.type === 'AUDIT_MEMO') {
          unifiedLogs.push({
            id: `sec-${item.id}`,
            timestamp: item.createdAt.toISOString(),
            category: 'security',
            action: 'OWNER AUDIT MEMO',
            actor: 'Platform Owner',
            title: 'Official Owner Audit Memo',
            description: item.note || 'Manual audit note recorded by store owner',
            direction: 'neutral',
            referenceId: item.id,
            metadata: { note: item.note },
          });
        } else {
          const isRestock = item.type === 'RESTOCK';
          const isDamage = item.type === 'DAMAGE';
          unifiedLogs.push({
            id: `stk-${item.id}`,
            timestamp: item.createdAt.toISOString(),
            category: 'stock',
            action: item.type,
            actor: 'Warehouse Terminal',
            title: `${item.type}: ${item.productName}`,
            description: `${item.quantity > 0 ? '+' : ''}${item.quantity} units (Balance: ${item.previousStock} → ${item.newStock} pcs)${item.note ? ` • ${item.note}` : ''}`,
            quantity: Math.abs(item.quantity),
            amount: item.costPerUnit ? item.costPerUnit * Math.abs(item.quantity) : undefined,
            direction: isRestock ? 'inflow' : isDamage ? 'outflow' : 'neutral',
            referenceId: item.productId,
            metadata: {
              productId: item.productId,
              costPerUnit: item.costPerUnit,
              previousStock: item.previousStock,
              newStock: item.newStock,
              note: item.note,
            },
          });
        }
      }
    }

    // 2. Sales Logs (POS Counter & Online checkouts recorded in SaleLog)
    if (category === 'all' || category === 'sales') {
      const saleLogs = await prisma.saleLog.findMany({
        where: dateThreshold ? { date: { gte: dateThreshold } } : undefined,
        orderBy: { date: 'desc' },
        take: 200,
      });

      for (const s of saleLogs) {
        let parsedItems: any[] = [];
        try {
          parsedItems = JSON.parse(s.items || '[]');
        } catch {}

        const itemsSummary = parsedItems.map((i: any) => `${i.name || 'Item'} (x${i.quantity || 1})`).join(', ');

        unifiedLogs.push({
          id: `sal-${s.id}`,
          timestamp: (s.date || s.createdAt).toISOString(),
          category: 'sales',
          action: s.channel === 'Direct / POS' ? 'POS COUNTER SALE' : 'ONLINE SALE',
          actor: s.customerName || 'Walk-in Customer',
          title: `${s.channel}: ৳${s.totalAmount.toLocaleString()} • ${s.customerName}`,
          description: `${itemsSummary ? `${itemsSummary} • ` : ''}${s.paymentMethod} (${s.paymentStatus})${s.customerPhone ? ` • ${s.customerPhone}` : ''}${s.note ? ` • Note: ${s.note}` : ''}`,
          amount: s.totalAmount,
          profit: s.profitAmount,
          direction: 'inflow',
          referenceId: s.orderId || s.id,
          metadata: {
            channel: s.channel,
            customerName: s.customerName,
            customerPhone: s.customerPhone,
            paymentMethod: s.paymentMethod,
            paymentStatus: s.paymentStatus,
            costAmount: s.costAmount,
            profitAmount: s.profitAmount,
            items: parsedItems,
          },
        });
      }
    }

    // 3. Operational Expenses
    if (category === 'all' || category === 'finances') {
      const expenseLogs = await prisma.expenseLog.findMany({
        where: dateThreshold ? { date: { gte: dateThreshold } } : undefined,
        orderBy: { date: 'desc' },
        take: 200,
      });

      for (const e of expenseLogs) {
        unifiedLogs.push({
          id: `exp-${e.id}`,
          timestamp: (e.date || e.createdAt).toISOString(),
          category: 'finances',
          action: 'EXPENSE OUTFLOW',
          actor: 'Treasury / Admin',
          title: `Expense: ${e.title} (৳${e.amount.toLocaleString()})`,
          description: `Category: ${e.category} • Method: ${e.paymentMethod}${e.note ? ` • Note: ${e.note}` : ''}`,
          amount: e.amount,
          direction: 'outflow',
          referenceId: e.id,
          metadata: {
            category: e.category,
            paymentMethod: e.paymentMethod,
            note: e.note,
          },
        });
      }
    }

    // 4. Customer Orders (Storefront Orders with status events)
    if (category === 'all' || category === 'orders') {
      const orders = await prisma.order.findMany({
        where: {
          deleted: false,
          ...(dateThreshold ? { createdAt: { gte: dateThreshold } } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: 150,
      });

      for (const o of orders) {
        let cartItems: any[] = [];
        try {
          cartItems = JSON.parse(o.cartItems || '[]');
        } catch {}

        const itemNames = cartItems.map((ci: any) => `${ci.product?.name || ci.name || 'Item'} (x${ci.quantity || 1})`).join(', ');

        unifiedLogs.push({
          id: `ord-${o.id}`,
          timestamp: o.createdAt.toISOString(),
          category: 'orders',
          action: `ORDER ${o.status.toUpperCase()}`,
          actor: o.fullName,
          title: `Order #${o.id} • ${o.status}`,
          description: `Customer: ${o.fullName} (${o.phone}) • ${o.region || 'BD'} • Items: ${itemNames || o.type || 'Custom Order'}${o.statusNote ? ` • Note: ${o.statusNote}` : ''}`,
          amount: o.advancePaid + o.remainingBalance,
          direction: o.status === 'Cancelled' ? 'neutral' : 'inflow',
          referenceId: o.id,
          metadata: {
            type: o.type,
            status: o.status,
            fullName: o.fullName,
            phone: o.phone,
            address: o.address,
            region: o.region,
            advancePaid: o.advancePaid,
            remainingBalance: o.remainingBalance,
            trxId: o.trxId,
          },
        });
      }
    }

    // Sort descending by timestamp
    unifiedLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Filter by search query if present
    const filteredLogs = query
      ? unifiedLogs.filter((l) => {
          return (
            l.title.toLowerCase().includes(query) ||
            l.description.toLowerCase().includes(query) ||
            l.actor.toLowerCase().includes(query) ||
            l.action.toLowerCase().includes(query) ||
            (l.referenceId && l.referenceId.toLowerCase().includes(query))
          );
        })
      : unifiedLogs;

    // Apply limit
    const finalLogs = filteredLogs.slice(0, limit);

    // Compute Executive Stats across filtered dataset
    let grossRevenueLogged = 0;
    let totalProfitLogged = 0;
    let totalExpensesLogged = 0;
    let totalStockUnitsMoved = 0;

    for (const log of filteredLogs) {
      if (log.category === 'sales' && log.amount) {
        grossRevenueLogged += log.amount;
        if (log.profit) totalProfitLogged += log.profit;
      }
      if (log.category === 'finances' && log.amount) {
        totalExpensesLogged += log.amount;
      }
      if (log.category === 'stock' && log.quantity) {
        totalStockUnitsMoved += log.quantity;
      }
    }

    return NextResponse.json({
      success: true,
      logs: finalLogs,
      stats: {
        totalEvents: filteredLogs.length,
        grossRevenueLogged,
        totalProfitLogged,
        totalExpensesLogged,
        totalStockUnitsMoved,
      },
    });
  } catch (error: any) {
    console.error('Error fetching unified master logs:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, note, action } = body;

    if (!note && !title) {
      return NextResponse.json({ success: false, error: 'Note or title required' }, { status: 400 });
    }

    // Persist as a formal system audit memo in StockLog with special type
    const newMemo = await prisma.stockLog.create({
      data: {
        productId: 'owner-audit',
        productName: title || 'Owner Audit Note',
        type: 'AUDIT_MEMO',
        quantity: 0,
        previousStock: 0,
        newStock: 0,
        note: `${action || 'AUDIT'}: ${title ? `${title} - ` : ''}${note}`,
      },
    });

    return NextResponse.json({ success: true, memo: newMemo });
  } catch (error: any) {
    console.error('Error creating owner audit log:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
