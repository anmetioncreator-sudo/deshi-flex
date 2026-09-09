const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const defaultCategories = [
  {
    id: "cat-1",
    name: "Drop Shoulder",
    slug: "drop-shoulder",
    desc: "The essential classic fit",
    bg: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "cat-2",
    name: "Custom Drop Shoulder",
    slug: "custom-drop-shoulder",
    desc: "Wear your imagination",
    bg: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "cat-3",
    name: "Over Size Drop Shoulder",
    slug: "over-size-drop-shoulder",
    desc: "Maximum volume streetwear",
    bg: "https://images.unsplash.com/photo-1580087442658-005d5fb5f0c0?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "cat-4",
    name: "Women Drop Shoulder",
    slug: "women-drop-shoulder",
    desc: "Relaxed feminine elegance",
    bg: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "cat-5",
    name: "Acid Wash Drop Shoulder",
    slug: "acid-wash-drop-shoulder",
    desc: "Unique vintage fades",
    bg: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "cat-6",
    name: "Custom Acid Wash",
    slug: "custom-acid-wash-drop-shoulder",
    desc: "Vintage blanks, your art",
    bg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
  },
];

const defaultProducts = [
  {
    id: "ds-black",
    name: "Classic Drop Shoulder - Black",
    slug: "classic-drop-shoulder-black",
    price: 850,
    originalPrice: 1000,
    description: "The essential classic drop shoulder t-shirt in deep black. Crafted for comfort and everyday wear with a clean, minimalist aesthetic.",
    categorySlug: "drop-shoulder",
    sizes: JSON.stringify(["M", "L", "XL", "XXL"]),
    colors: JSON.stringify([{ name: "Black", hex: "#111111" }]),
    inventory: JSON.stringify({ "Black": { "M": 4, "L": 5, "XL": 4, "XXL": 1 } }),
    rating: 4.9,
    reviewsCount: 156,
    inStock: true,
    stockCount: 14,
    totalStock: 14,
    isNew: true,
    isSale: true,
    tagline: "Your daily essential.",
    details: JSON.stringify(["220 GSM premium combed cotton", "Relaxed drop shoulder fit", "Soft-touch fabric finish"]),
    images: JSON.stringify(["/mockup-front.png?v=2"])
  },
  {
    id: "ds-white",
    name: "Classic Drop Shoulder - White",
    slug: "classic-drop-shoulder-white",
    price: 850,
    originalPrice: 1000,
    description: "The essential classic drop shoulder t-shirt in pure white.",
    categorySlug: "drop-shoulder",
    sizes: JSON.stringify(["M", "L", "XL", "XXL"]),
    colors: JSON.stringify([{ name: "White", hex: "#f5f5f7" }]),
    inventory: JSON.stringify({ "White": { "M": 3, "L": 3, "XL": 4, "XXL": 1 } }),
    rating: 4.9,
    reviewsCount: 120,
    inStock: true,
    stockCount: 11,
    totalStock: 11,
    isNew: true,
    isSale: true,
    tagline: "Pure and clean.",
    details: JSON.stringify(["220 GSM premium combed cotton", "Relaxed drop shoulder fit", "Soft-touch fabric finish"]),
    images: JSON.stringify(["/mockup-front.png?v=2"])
  },
  {
    id: "ds-olive",
    name: "Classic Drop Shoulder - Olive",
    slug: "classic-drop-shoulder-olive",
    price: 850,
    originalPrice: 1000,
    description: "The essential classic drop shoulder t-shirt in military olive.",
    categorySlug: "drop-shoulder",
    sizes: JSON.stringify(["M", "L", "XL"]),
    colors: JSON.stringify([{ name: "Olive", hex: "#4b5320" }]),
    inventory: JSON.stringify({ "Olive": { "M": 1, "L": 2, "XL": 2 } }),
    rating: 4.8,
    reviewsCount: 88,
    inStock: true,
    stockCount: 5,
    totalStock: 5,
    isNew: true,
    isSale: true,
    tagline: "Earthy tones.",
    details: JSON.stringify(["220 GSM premium combed cotton", "Relaxed drop shoulder fit", "Soft-touch fabric finish"]),
    images: JSON.stringify(["/mockup-front.png?v=2"])
  },
  {
    id: "ods-black",
    name: "Oversize Drop Shoulder - Black",
    slug: "oversize-drop-shoulder-black",
    price: 950,
    originalPrice: 1100,
    description: "Built for maximum volume. Featuring an exaggerated boxy fit and ultra-heavyweight cotton for the true streetwear silhouette.",
    categorySlug: "over-size-drop-shoulder",
    sizes: JSON.stringify(["M", "L", "XL", "XXL"]),
    colors: JSON.stringify([{ name: "Black", hex: "#111111" }]),
    inventory: JSON.stringify({ "Black": { "M": 4, "L": 5, "XL": 4, "XXL": 1 } }),
    rating: 4.8,
    reviewsCount: 112,
    inStock: true,
    stockCount: 14,
    totalStock: 14,
    isNew: true,
    isSale: false,
    tagline: "Maximum volume.",
    details: JSON.stringify(["280 GSM heavyweight cotton", "Exaggerated boxy oversized fit", "Thick ribbed collar"]),
    images: JSON.stringify(["/mockup-front.png?v=2"])
  },
  {
    id: "ds-05",
    name: "Acid Wash Drop Shoulder",
    slug: "acid-wash-drop-shoulder",
    price: 1100,
    originalPrice: 1300,
    description: "Premium acid-washed drop shoulder tee. Each piece has a unique vintage fade and texture, providing a worn-in feel right out of the box.",
    categorySlug: "acid-wash-drop-shoulder",
    sizes: JSON.stringify(["M", "L", "XL", "XXL"]),
    colors: JSON.stringify([{ name: "Black", hex: "#111111" }]),
    inventory: JSON.stringify({ "Black": { "M": 20, "L": 25, "XL": 15, "XXL": 5 } }),
    rating: 4.9,
    reviewsCount: 78,
    inStock: true,
    stockCount: 65,
    totalStock: 65,
    isNew: true,
    isSale: false,
    tagline: "Unique character.",
    details: JSON.stringify(["240 GSM acid-washed cotton", "Unique vintage fade on every piece", "Relaxed drop shoulder fit"]),
    images: JSON.stringify(["/mockup-front.png?v=2"])
  }
];

async function main() {
  console.log('🌱 Seeding database...');

  // Upsert Categories
  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`✓ Seeded ${defaultCategories.length} categories.`);

  // Upsert Products
  for (const prod of defaultProducts) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
  }
  console.log(`✓ Seeded ${defaultProducts.length} products.`);

  // Upsert Site Setting
  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      heroImages: JSON.stringify([
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1600&auto=format&fit=crop",
      ]),
      forHimImage: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1000&auto=format&fit=crop",
      forHerImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop",
    }
  });
  console.log('✓ Seeded site settings.');

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
