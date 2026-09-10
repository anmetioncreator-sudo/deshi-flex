import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // 'today' | '7d' | '30d' | 'month' | 'all'
    const channel = searchParams.get('channel');
    const query = searchParams.get('query') || searchParams.get('search');

    let startDate: Date | null = null;
    const now = new Date();

    if (period === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // 1. Fetch manual & offline sales from SaleLog
    const saleLogWhere: any = {};
    if (startDate) {
      saleLogWhere.date = { gte: startDate };
    }
    if (channel && channel !== 'All') {
      saleLogWhere.channel = channel;
    }
    if (query && query.trim()) {
      saleLogWhere.OR = [
        { customerName: { contains: query.trim() } },
        { customerPhone: { contains: query.trim() } },
        { id: { contains: query.trim() } },
        { orderId: { contains: query.trim() } },
      ];
    }

    const recordedSales = await prisma.saleLog.findMany({
      where: saleLogWhere,
      orderBy: { date: 'desc' },
    });

    const parsedRecordedSales = recordedSales.map((s) => {
      let itemsList: any[] = [];
      try {
        itemsList = s.items ? JSON.parse(s.items) : [];
      } catch (e) {
        itemsList = [];
      }
      return {
        id: s.id,
        orderId: s.orderId,
        channel: s.channel,
        customerName: s.customerName,
        customerPhone: s.customerPhone,
        items: itemsList,
        totalAmount: s.totalAmount,
        costAmount: s.costAmount,
        profitAmount: s.profitAmount,
        paymentMethod: s.paymentMethod,
        paymentStatus: s.paymentStatus,
        note: s.note,
        date: s.date,
        createdAt: s.createdAt,
        isStoreOrder: false,
      };
    });

    // 2. Fetch delivered or processed orders from Order table if channel matches
    let parsedOnlineOrders: any[] = [];
    if (!channel || channel === 'All' || channel.includes('Online')) {
      const orderWhere: any = {
        deleted: false,
        status: { in: ['Delivered', 'Processing', 'Shipped'] },
      };
      if (startDate) {
        orderWhere.date = { gte: startDate };
      }
      if (query && query.trim()) {
        orderWhere.OR = [
          { fullName: { contains: query.trim() } },
          { phone: { contains: query.trim() } },
          { id: { contains: query.trim() } },
        ];
      }

      const onlineOrders = await prisma.order.findMany({
        where: orderWhere,
        orderBy: { date: 'desc' },
      });

      // Avoid duplicating orders already logged in SaleLog
      const loggedOrderIds = new Set(recordedSales.map((r) => r.orderId).filter(Boolean));

      parsedOnlineOrders = onlineOrders
        .filter((o) => !loggedOrderIds.has(o.id))
        .map((o) => {
          let items: any[] = [];
          try {
            if (o.cartItems) {
              const raw = JSON.parse(o.cartItems);
              if (Array.isArray(raw)) {
                items = raw.map((item: any) => ({
                  productId: item.product?.id || item.id || 'custom',
                  name: item.product?.name || item.name || 'Custom Apparel',
                  size: item.selectedSize || item.size || 'M',
                  color: item.selectedColor?.name || item.color || 'Standard',
                  quantity: item.quantity || 1,
                  unitPrice: item.product?.price || item.price || 850,
                  costPrice: item.product?.costPrice || Math.round((item.product?.price || 850) * 0.52),
                }));
              }
            } else {
              items = [
                {
                  productId: o.itemId || 'custom-order',
                  name: o.type || 'Custom Order',
                  size: 'Free',
                  color: o.color || 'Custom',
                  quantity: o.quantity || 1,
                  unitPrice: (o.advancePaid || 0) + (o.remainingBalance || 0),
                  costPrice: Math.round(((o.advancePaid || 0) + (o.remainingBalance || 0)) * 0.5),
                },
              ];
            }
          } catch (e) {
            items = [];
          }

          const totalAmount = (o.advancePaid || 0) + (o.remainingBalance || 0);
          const costAmount = items.reduce(
            (acc, it) => acc + (it.costPrice || Math.round(it.unitPrice * 0.52)) * (it.quantity || 1),
            0
          );
          const profitAmount = totalAmount - costAmount;

          return {
            id: `sale-${o.id}`,
            orderId: o.id,
            channel: 'Online Store',
            customerName: o.fullName,
            customerPhone: o.phone,
            items,
            totalAmount,
            costAmount,
            profitAmount,
            paymentMethod: o.trxId ? 'bKash / MFS' : 'COD',
            paymentStatus: o.status === 'Delivered' ? 'Paid' : 'Partial',
            note: `Online Order #${o.id} - Status: ${o.status}`,
            date: o.date,
            createdAt: o.createdAt,
            isStoreOrder: true,
          };
        });
    }

    // Combine and sort by date descending
    const allSales = [...parsedRecordedSales, ...parsedOnlineOrders].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const totalRevenue = allSales.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalCost = allSales.reduce((acc, curr) => acc + curr.costAmount, 0);
    const totalProfit = allSales.reduce((acc, curr) => acc + curr.profitAmount, 0);
    const totalUnitsSold = allSales.reduce(
      (acc, curr) => acc + curr.items.reduce((sAcc: number, it: any) => sAcc + (it.quantity || 1), 0),
      0
    );
    const marginPercent = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;
    const aov = allSales.length > 0 ? Math.round(totalRevenue / allSales.length) : 0;

    return NextResponse.json({
      success: true,
      sales: allSales,
      summary: {
        totalSalesCount: allSales.length,
        totalUnitsSold,
        totalRevenue,
        totalCost,
        totalProfit,
        marginPercent,
        aov,
      },
    });
  } catch (error: any) {
    console.error('Error fetching sales:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      customerName,
      customerPhone,
      channel = 'Store Counter / POS',
      items = [],
      paymentMethod = 'Cash',
      paymentStatus = 'Paid',
      note = '',
      date,
    } = data;

    if (!customerName || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer Name and at least one item are required.' },
        { status: 400 }
      );
    }

    let totalAmount = 0;
    let costAmount = 0;

    const validatedItems = [];

    // Process each sold item and update product stock
    for (const it of items) {
      const qty = Number(it.quantity || 1);
      const unitPrice = Number(it.unitPrice || 0);
      let costPrice = it.costPrice !== undefined ? Number(it.costPrice) : 0;

      if (it.productId && it.productId !== 'custom') {
        const prod = await prisma.product.findUnique({
          where: { id: it.productId },
        });

        if (prod) {
          if (!costPrice) costPrice = prod.costPrice || Math.round(prod.price * 0.52);

          const previousStock = prod.totalStock ?? prod.stockCount ?? 0;
          const newStock = Math.max(0, previousStock - qty);

          // Update variant inventory if size/color specified
          let updatedInventory = prod.inventory;
          if (it.color && it.size && prod.inventory) {
            try {
              const invMap = JSON.parse(prod.inventory);
              if (invMap[it.color] && invMap[it.color][it.size] !== undefined) {
                invMap[it.color][it.size] = Math.max(0, (invMap[it.color][it.size] || 0) - qty);
                updatedInventory = JSON.stringify(invMap);
              }
            } catch (e) {}
          }

          // Deduct stock from product
          await prisma.product.update({
            where: { id: prod.id },
            data: {
              totalStock: newStock,
              stockCount: newStock,
              inStock: newStock > 0,
              inventory: updatedInventory,
            },
          });

          // Log stock deduction
          await prisma.stockLog.create({
            data: {
              productId: prod.id,
              productName: prod.name,
              type: 'SALE',
              quantity: -qty,
              previousStock,
              newStock,
              costPerUnit: costPrice,
              note: `Sold to ${customerName} via ${channel} (${it.size || ''} ${it.color || ''})`,
            },
          });
        }
      }

      totalAmount += unitPrice * qty;
      costAmount += costPrice * qty;

      validatedItems.push({
        productId: it.productId || 'custom',
        name: it.name || 'Custom Item',
        size: it.size || 'M',
        color: it.color || 'Standard',
        quantity: qty,
        unitPrice,
        costPrice,
      });
    }

    const profitAmount = totalAmount - costAmount;
    const saleId = `SL-${Math.floor(100000 + Math.random() * 900000)}`;

    const saleRecord = await prisma.saleLog.create({
      data: {
        id: saleId,
        channel,
        customerName,
        customerPhone: customerPhone || null,
        items: JSON.stringify(validatedItems),
        totalAmount,
        costAmount,
        profitAmount,
        paymentMethod,
        paymentStatus,
        note,
        date: date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      sale: {
        ...saleRecord,
        items: validatedItems,
      },
    });
  } catch (error: any) {
    console.error('Error creating sale record:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
