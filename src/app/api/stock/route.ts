import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || searchParams.get('search');
    const category = searchParams.get('category');
    const lowStockOnly = searchParams.get('lowStock') === 'true';

    const where: any = {};
    if (category && category !== 'All') {
      where.categorySlug = category;
    }
    if (query && query.trim()) {
      where.OR = [
        { name: { contains: query.trim() } },
        { slug: { contains: query.trim() } },
        { id: { contains: query.trim() } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
      include: { category: true },
    });

    const parsedItems = products.map((p) => {
      let inventoryObj: Record<string, Record<string, number>> = {};
      try {
        inventoryObj = p.inventory ? JSON.parse(p.inventory) : {};
      } catch (e) {
        inventoryObj = {};
      }

      let imagesArr: string[] = [];
      try {
        imagesArr = p.images ? JSON.parse(p.images) : [];
      } catch (e) {
        imagesArr = [];
      }

      let colorsArr: any[] = [];
      try {
        colorsArr = p.colors ? JSON.parse(p.colors) : [];
      } catch (e) {
        colorsArr = [];
      }

      let sizesArr: string[] = [];
      try {
        sizesArr = p.sizes ? JSON.parse(p.sizes) : [];
      } catch (e) {
        sizesArr = [];
      }

      const costPrice = p.costPrice || 0;
      const price = p.price;
      const totalStock = p.totalStock ?? p.stockCount ?? 0;
      const lowStockAlert = p.lowStockAlert ?? 5;
      const unitProfit = price - costPrice;
      const marginPercent = price > 0 ? Math.round((unitProfit / price) * 100) : 0;
      const valuationCost = totalStock * costPrice;
      const valuationRetail = totalStock * price;
      const isLowStock = totalStock > 0 && totalStock <= lowStockAlert;
      const isOutOfStock = totalStock <= 0;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category ? p.category.name : (p.categorySlug || 'Uncategorized'),
        categorySlug: p.categorySlug,
        photoUrl: p.photoUrl || (imagesArr.length > 0 ? imagesArr[0] : null),
        images: imagesArr,
        colors: colorsArr,
        sizes: sizesArr,
        inventory: inventoryObj,
        costPrice,
        price,
        originalPrice: p.originalPrice,
        totalStock,
        stockCount: p.stockCount,
        lowStockAlert,
        unitProfit,
        marginPercent,
        valuationCost,
        valuationRetail,
        inStock: p.inStock && totalStock > 0,
        isLowStock,
        isOutOfStock,
        updatedAt: p.updatedAt,
      };
    });

    const filteredItems = lowStockOnly
      ? parsedItems.filter((item) => item.isLowStock || item.isOutOfStock)
      : parsedItems;

    const summary = {
      totalProducts: filteredItems.length,
      totalUnitsInStock: filteredItems.reduce((acc, curr) => acc + curr.totalStock, 0),
      totalValuationCost: filteredItems.reduce((acc, curr) => acc + curr.valuationCost, 0),
      totalValuationRetail: filteredItems.reduce((acc, curr) => acc + curr.valuationRetail, 0),
      lowStockCount: filteredItems.filter((i) => i.isLowStock).length,
      outOfStockCount: filteredItems.filter((i) => i.isOutOfStock).length,
    };

    return NextResponse.json({
      success: true,
      items: filteredItems,
      summary,
    });
  } catch (error: any) {
    console.error('Error fetching stock:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { productId, changeType, quantity, costPerUnit, note, variant } = data;

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Product ID and quantity are required.' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found.' },
        { status: 404 }
      );
    }

    const previousStock = product.totalStock ?? product.stockCount ?? 0;
    const qtyChange = Number(quantity); // can be positive or negative
    const newStock = Math.max(0, previousStock + qtyChange);

    // Update variant inventory if specified
    let updatedInventory = product.inventory;
    if (variant && variant.color && variant.size) {
      try {
        const invMap = product.inventory ? JSON.parse(product.inventory) : {};
        if (!invMap[variant.color]) invMap[variant.color] = {};
        const currentVariantQty = invMap[variant.color][variant.size] || 0;
        invMap[variant.color][variant.size] = Math.max(0, currentVariantQty + qtyChange);
        updatedInventory = JSON.stringify(invMap);
      } catch (e) {
        console.error('Error parsing variant inventory:', e);
      }
    }

    const updatePayload: any = {
      totalStock: newStock,
      stockCount: newStock,
      inStock: newStock > 0,
      inventory: updatedInventory,
    };

    if (costPerUnit !== undefined && costPerUnit !== null && Number(costPerUnit) > 0) {
      updatePayload.costPrice = Number(costPerUnit);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updatePayload,
    });

    // Create audit log
    const stockLog = await prisma.stockLog.create({
      data: {
        productId,
        productName: product.name,
        type: changeType || (qtyChange >= 0 ? 'RESTOCK' : 'ADJUSTMENT'),
        quantity: qtyChange,
        previousStock,
        newStock,
        costPerUnit: costPerUnit ? Number(costPerUnit) : product.costPrice,
        note: note || (qtyChange >= 0 ? `Stock restock: +${qtyChange} units` : `Stock adjustment: ${qtyChange} units`),
      },
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      log: stockLog,
    });
  } catch (error: any) {
    console.error('Error modifying stock:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const { productId, costPrice, price, lowStockAlert, totalStock } = data;

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required.' }, { status: 400 });
    }

    const updatePayload: any = {};
    if (costPrice !== undefined) updatePayload.costPrice = Number(costPrice);
    if (price !== undefined) updatePayload.price = Number(price);
    if (lowStockAlert !== undefined) updatePayload.lowStockAlert = Number(lowStockAlert);
    if (totalStock !== undefined) {
      updatePayload.totalStock = Number(totalStock);
      updatePayload.stockCount = Number(totalStock);
      updatePayload.inStock = Number(totalStock) > 0;
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: updatePayload,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error('Error updating stock item fields:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
