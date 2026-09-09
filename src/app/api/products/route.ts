import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const isFeatured = searchParams.get('featured');

    const where: any = {};
    if (categorySlug) {
      where.categorySlug = categorySlug;
    }
    if (isFeatured === 'true') {
      where.isNew = true;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        reviews: true,
      },
    });

    const parsedProducts = products.map((p: any) => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : [],
      colors: p.colors ? JSON.parse(p.colors) : [],
      sizes: p.sizes ? JSON.parse(p.sizes) : [],
      inventory: p.inventory ? JSON.parse(p.inventory) : {},
      details: p.details ? JSON.parse(p.details) : [],
    }));

    return NextResponse.json({ success: true, products: parsedProducts });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const product = await prisma.product.create({
      data: {
        id: data.id || `prod-${Date.now()}`,
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        description: data.description || '',
        categorySlug: data.categorySlug || data.category || null,
        photoUrl: data.photoUrl || null,
        images: Array.isArray(data.images) ? JSON.stringify(data.images) : '[]',
        colors: Array.isArray(data.colors) ? JSON.stringify(data.colors) : '[]',
        sizes: Array.isArray(data.sizes) ? JSON.stringify(data.sizes) : '[]',
        inventory: data.inventory ? JSON.stringify(data.inventory) : '{}',
        totalStock: Number(data.totalStock || data.stockCount || 0),
        stockCount: Number(data.stockCount || 0),
        inStock: data.inStock ?? true,
        rating: Number(data.rating || 5.0),
        reviewsCount: Number(data.reviewsCount || 0),
        isNew: data.isNew ?? false,
        isSale: data.isSale ?? false,
        tagline: data.tagline || null,
        details: Array.isArray(data.details) ? JSON.stringify(data.details) : '[]',
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
