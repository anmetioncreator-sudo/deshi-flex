import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // 'today' | '7d' | '30d' | 'month' | 'all'

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

    // 1. Fetch Products
    const products = await prisma.product.findMany({
      include: { category: true },
    });

    let totalStockUnits = 0;
    let stockValuationCost = 0;
    let stockValuationRetail = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    const lowStockItems: any[] = [];

    products.forEach((p) => {
      const stock = p.totalStock ?? p.stockCount ?? 0;
      const cost = p.costPrice || 0;
      const threshold = p.lowStockAlert ?? 5;

      totalStockUnits += stock;
      stockValuationCost += stock * cost;
      stockValuationRetail += stock * p.price;

      if (stock <= 0) {
        outOfStockCount++;
        lowStockItems.push({
          id: p.id,
          name: p.name,
          category: p.category ? p.category.name : p.categorySlug,
          totalStock: stock,
          lowStockAlert: threshold,
          price: p.price,
          costPrice: cost,
          status: 'OUT_OF_STOCK',
        });
      } else if (stock <= threshold) {
        lowStockCount++;
        lowStockItems.push({
          id: p.id,
          name: p.name,
          category: p.category ? p.category.name : p.categorySlug,
          totalStock: stock,
          lowStockAlert: threshold,
          price: p.price,
          costPrice: cost,
          status: 'LOW_STOCK',
        });
      }
    });

    // 2. Fetch Recorded Sales
    const saleLogWhere: any = {};
    if (startDate) saleLogWhere.date = { gte: startDate };

    const recordedSales = await prisma.saleLog.findMany({
      where: saleLogWhere,
      orderBy: { date: 'desc' },
    });

    // 3. Fetch Orders
    const orderWhere: any = { deleted: false };
    if (startDate) orderWhere.date = { gte: startDate };

    const orders = await prisma.order.findMany({
      where: orderWhere,
      orderBy: { date: 'desc' },
    });

    // Order status counts
    const orderStatusCounts: Record<string, number> = {
      'Pending Verification': 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    orders.forEach((o) => {
      orderStatusCounts[o.status] = (orderStatusCounts[o.status] || 0) + 1;
    });

    // 4. Calculate Unified Sales Metrics & Product Sales
    const productSalesMap: Record<
      string,
      { id: string; name: string; unitsSold: number; revenue: number; profit: number; currentStock: number }
    > = {};

    products.forEach((p) => {
      productSalesMap[p.id] = {
        id: p.id,
        name: p.name,
        unitsSold: 0,
        revenue: 0,
        profit: 0,
        currentStock: p.totalStock ?? p.stockCount ?? 0,
      };
    });

    let totalRevenue = 0;
    let totalCOGS = 0;
    let totalUnitsSold = 0;

    // Process recorded sales
    recordedSales.forEach((s) => {
      totalRevenue += s.totalAmount;
      totalCOGS += s.costAmount;
      try {
        const items = s.items ? JSON.parse(s.items) : [];
        items.forEach((it: any) => {
          const qty = it.quantity || 1;
          totalUnitsSold += qty;
          const pid = it.productId;
          if (pid && productSalesMap[pid]) {
            productSalesMap[pid].unitsSold += qty;
            productSalesMap[pid].revenue += (it.unitPrice || 0) * qty;
            productSalesMap[pid].profit += ((it.unitPrice || 0) - (it.costPrice || 0)) * qty;
          }
        });
      } catch (e) {}
    });

    // Process valid online orders
    const recordedOrderIds = new Set(recordedSales.map((s) => s.orderId).filter(Boolean));
    const validOrders = orders.filter(
      (o) => !recordedOrderIds.has(o.id) && ['Delivered', 'Processing', 'Shipped'].includes(o.status)
    );

    validOrders.forEach((o) => {
      const orderRev = (o.advancePaid || 0) + (o.remainingBalance || 0);
      const orderCost = Math.round(orderRev * 0.52);
      totalRevenue += orderRev;
      totalCOGS += orderCost;

      try {
        if (o.cartItems) {
          const cart = JSON.parse(o.cartItems);
          if (Array.isArray(cart)) {
            cart.forEach((c: any) => {
              const qty = c.quantity || 1;
              totalUnitsSold += qty;
              const pid = c.product?.id || c.id;
              if (pid && productSalesMap[pid]) {
                productSalesMap[pid].unitsSold += qty;
                productSalesMap[pid].revenue += (c.product?.price || 850) * qty;
                productSalesMap[pid].profit +=
                  ((c.product?.price || 850) - (c.product?.costPrice || Math.round((c.product?.price || 850) * 0.52))) * qty;
              }
            });
          }
        } else {
          totalUnitsSold += o.quantity || 1;
          if (o.itemId && productSalesMap[o.itemId]) {
            const qty = o.quantity || 1;
            productSalesMap[o.itemId].unitsSold += qty;
            productSalesMap[o.itemId].revenue += orderRev;
            productSalesMap[o.itemId].profit += orderRev - orderCost;
          }
        }
      } catch (e) {}
    });

    // 5. Fetch Expenses for Net Profit calculation
    const expenseWhere: any = {};
    if (startDate) expenseWhere.date = { gte: startDate };

    const expenses = await prisma.expenseLog.findMany({
      where: expenseWhere,
    });
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    const grossProfit = totalRevenue - totalCOGS;
    const netProfit = grossProfit - totalExpenses;
    const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

    // 6. Generate Sales Trend Data (last 7 or 14 periods)
    const trendMap: Record<string, { label: string; revenue: number; profit: number; orders: number }> = {};
    const daysCount = period === 'today' ? 24 : period === '7d' ? 7 : 14;

    if (period === 'today') {
      for (let h = 0; h < 24; h += 3) {
        const lbl = `${h}:00`;
        trendMap[lbl] = { label: lbl, revenue: 0, profit: 0, orders: 0 };
      }
    } else {
      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().split('T')[0];
        const lbl = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        trendMap[key] = { label: lbl, revenue: 0, profit: 0, orders: 0 };
      }
    }

    // Populate trend from recorded sales
    recordedSales.forEach((s) => {
      const sDate = new Date(s.date);
      if (period === 'today') {
        const h = Math.floor(sDate.getHours() / 3) * 3;
        const lbl = `${h}:00`;
        if (trendMap[lbl]) {
          trendMap[lbl].revenue += s.totalAmount;
          trendMap[lbl].profit += s.profitAmount;
          trendMap[lbl].orders += 1;
        }
      } else {
        const key = sDate.toISOString().split('T')[0];
        if (trendMap[key]) {
          trendMap[key].revenue += s.totalAmount;
          trendMap[key].profit += s.profitAmount;
          trendMap[key].orders += 1;
        }
      }
    });

    // Populate trend from valid orders
    validOrders.forEach((o) => {
      const oDate = new Date(o.date);
      const rev = (o.advancePaid || 0) + (o.remainingBalance || 0);
      const profit = Math.round(rev * 0.48);

      if (period === 'today') {
        const h = Math.floor(oDate.getHours() / 3) * 3;
        const lbl = `${h}:00`;
        if (trendMap[lbl]) {
          trendMap[lbl].revenue += rev;
          trendMap[lbl].profit += profit;
          trendMap[lbl].orders += 1;
        }
      } else {
        const key = oDate.toISOString().split('T')[0];
        if (trendMap[key]) {
          trendMap[key].revenue += rev;
          trendMap[key].profit += profit;
          trendMap[key].orders += 1;
        }
      }
    });

    const salesTrend = Object.values(trendMap);

    // 7. Top Selling Products
    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // 8. Recent Sales Feed (last 5 sales)
    const recentRecorded = recordedSales.slice(0, 5).map((s) => ({
      id: s.id,
      channel: s.channel,
      customerName: s.customerName,
      totalAmount: s.totalAmount,
      profitAmount: s.profitAmount,
      date: s.date,
      paymentMethod: s.paymentMethod,
    }));

    return NextResponse.json({
      success: true,
      summary: {
        totalRevenue,
        grossProfit,
        netProfit,
        profitMargin,
        totalUnitsSold,
        totalOrdersCount: recordedSales.length + validOrders.length,
        totalStockUnits,
        stockValuationCost,
        stockValuationRetail,
        lowStockCount,
        outOfStockCount,
        totalExpenses,
      },
      salesTrend,
      orderStatusCounts,
      topProducts,
      lowStockItems,
      recentSales: recentRecorded,
    });
  } catch (error: any) {
    console.error('Error calculating analytics:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
