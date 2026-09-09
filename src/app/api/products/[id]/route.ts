import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        reviews: true,
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const parsedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      colors: product.colors ? JSON.parse(product.colors) : [],
      sizes: product.sizes ? JSON.parse(product.sizes) : [],
      inventory: product.inventory ? JSON.parse(product.inventory) : {},
      details: product.details ? JSON.parse(product.details) : [],
    };

    return NextResponse.json({ success: true, product: parsedProduct });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.originalPrice !== undefined) updateData.originalPrice = Number(data.originalPrice);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.categorySlug !== undefined) updateData.categorySlug = data.categorySlug;
    if (data.inStock !== undefined) updateData.inStock = Boolean(data.inStock);
    if (data.stockCount !== undefined) updateData.stockCount = Number(data.stockCount);
    if (data.totalStock !== undefined) updateData.totalStock = Number(data.totalStock);
    if (data.isNew !== undefined) updateData.isNew = Boolean(data.isNew);
    if (data.isSale !== undefined) updateData.isSale = Boolean(data.isSale);
    if (data.tagline !== undefined) updateData.tagline = data.tagline;

    if (data.images !== undefined) updateData.images = JSON.stringify(data.images);
    if (data.colors !== undefined) updateData.colors = JSON.stringify(data.colors);
    if (data.sizes !== undefined) updateData.sizes = JSON.stringify(data.sizes);
    if (data.inventory !== undefined) updateData.inventory = JSON.stringify(data.inventory);
    if (data.details !== undefined) updateData.details = JSON.stringify(data.details);

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
