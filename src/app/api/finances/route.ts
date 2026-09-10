import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const period = searchParams.get('period') || 'all';

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

    // 1. Fetch Expenses
    const expenseWhere: any = {};
    if (category && category !== 'All') {
      expenseWhere.category = category;
    }
    if (startDate) {
      expenseWhere.date = { gte: startDate };
    }

    const expenses = await prisma.expenseLog.findMany({
      where: expenseWhere,
      orderBy: { date: 'desc' },
    });

    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    const expensesByCategory: Record<string, number> = {
      'Fabric/Materials': 0,
      'Printing/Dyeing': 0,
      'Packaging': 0,
      'Marketing/Ads': 0,
      'Delivery/Courier': 0,
      'Operational/Rent': 0,
      'Other': 0,
    };

    expenses.forEach((e) => {
      const cat = expensesByCategory[e.category] !== undefined ? e.category : 'Other';
      expensesByCategory[cat] = (expensesByCategory[cat] || 0) + e.amount;
    });

    // 2. Fetch Sales and calculate Revenue & COGS
    const saleLogWhere: any = {};
    if (startDate) saleLogWhere.date = { gte: startDate };

    const sales = await prisma.saleLog.findMany({
      where: saleLogWhere,
    });

    const orderWhere: any = {
      deleted: false,
      status: { in: ['Delivered', 'Processing', 'Shipped'] },
    };
    if (startDate) orderWhere.date = { gte: startDate };

    const orders = await prisma.order.findMany({
      where: orderWhere,
    });

    const recordedOrderIds = new Set(sales.map((s) => s.orderId).filter(Boolean));

    let totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
    let totalCOGS = sales.reduce((acc, s) => acc + s.costAmount, 0);

    orders.forEach((o) => {
      if (!recordedOrderIds.has(o.id)) {
        const orderRev = (o.advancePaid || 0) + (o.remainingBalance || 0);
        totalRevenue += orderRev;
        totalCOGS += Math.round(orderRev * 0.52);
      }
    });

    const grossProfit = totalRevenue - totalCOGS;
    const netProfit = grossProfit - totalExpenses;
    const netMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

    // 3. Calculate Stock Asset Valuation
    const products = await prisma.product.findMany({
      select: { totalStock: true, stockCount: true, price: true, costPrice: true },
    });

    let stockValuationCost = 0;
    let stockValuationRetail = 0;
    let totalStockUnits = 0;

    products.forEach((p) => {
      const stock = p.totalStock ?? p.stockCount ?? 0;
      const cost = p.costPrice || 0;
      const retail = p.price;
      stockValuationCost += stock * cost;
      stockValuationRetail += stock * retail;
      totalStockUnits += stock;
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalRevenue,
        totalCOGS,
        grossProfit,
        totalExpenses,
        netProfit,
        netMargin,
        stockValuationCost,
        stockValuationRetail,
        totalStockUnits,
      },
      expensesByCategory,
      expenses,
    });
  } catch (error: any) {
    console.error('Error fetching finances:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, category, amount, paymentMethod = 'Cash', date, note } = data;

    if (!title || amount === undefined || isNaN(Number(amount))) {
      return NextResponse.json(
        { success: false, error: 'Title and a valid Amount are required.' },
        { status: 400 }
      );
    }

    const expense = await prisma.expenseLog.create({
      data: {
        title,
        category: category || 'Other',
        amount: Number(amount),
        paymentMethod,
        date: date ? new Date(date) : new Date(),
        note: note || null,
      },
    });

    return NextResponse.json({ success: true, expense });
  } catch (error: any) {
    console.error('Error adding expense:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Expense ID is required.' }, { status: 400 });
    }

    await prisma.expenseLog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Expense deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
