import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    let setting = await prisma.siteSetting.findUnique({
      where: { id: 'default' },
    });

    if (!setting) {
      setting = await prisma.siteSetting.create({
        data: {
          id: 'default',
          heroImages: JSON.stringify([
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1600&auto=format&fit=crop",
          ]),
          forHimImage: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1000&auto=format&fit=crop",
          forHerImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop",
        },
      });
    }

    const parsedSetting = {
      ...setting,
      heroImages: setting.heroImages ? JSON.parse(setting.heroImages) : [],
    };

    return NextResponse.json({ success: true, settings: parsedSetting });
  } catch (error: any) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const updateData: any = {};
    if (data.heroImages !== undefined) updateData.heroImages = JSON.stringify(data.heroImages);
    if (data.forHimImage !== undefined) updateData.forHimImage = data.forHimImage;
    if (data.forHerImage !== undefined) updateData.forHerImage = data.forHerImage;

    const setting = await prisma.siteSetting.upsert({
      where: { id: 'default' },
      update: updateData,
      create: {
        id: 'default',
        heroImages: data.heroImages ? JSON.stringify(data.heroImages) : '[]',
        forHimImage: data.forHimImage || null,
        forHerImage: data.forHerImage || null,
      },
    });

    return NextResponse.json({
      success: true,
      settings: {
        ...setting,
        heroImages: setting.heroImages ? JSON.parse(setting.heroImages) : [],
      },
    });
  } catch (error: any) {
    console.error('Error updating site settings:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
