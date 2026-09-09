import { Product } from "@/types";

// Helper to generate dynamic SVGs for products to ensure premium, high-fidelity visual representations without placeholders
const generateSvgPlaceholder = (
  type: "tee" | "hoodie" | "jersey" | "pants" | "beanie" | "tote",
  primaryColor: string,
  accentColor: string,
  graphicText: string
) => {
  const base64 = typeof window === "undefined" 
    ? "" 
    : ""; // Fallback

  // Standard inline SVG data URL
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
      <defs>
        <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#141414" />
          <stop offset="100%" stop-color="#050505" />
        </linearGradient>
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="50%" stop-color="#e4e4e7" />
          <stop offset="100%" stop-color="#a1a1aa" />
        </linearGradient>
        <linearGradient id="silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="50%" stop-color="#e4e4e7" />
          <stop offset="100%" stop-color="#a1a1aa" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="15" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="400" height="500" fill="url(#bg-grad)" />
      <rect width="390" height="490" x="5" y="5" rx="15" fill="none" stroke="#222222" stroke-width="1.5" />
      
      <!-- Grid overlay for technical streetwear aesthetic -->
      <path d="M 0,100 L 400,100 M 0,200 L 400,200 M 0,300 L 400,300 M 0,400 L 400,400 M 100,0 L 100,500 M 200,0 L 200,500 M 300,0 L 300,500" stroke="#1c1c1c" stroke-width="0.5" />

      <!-- Shadow under the apparel -->
      <ellipse cx="200" cy="420" rx="100" ry="15" fill="black" opacity="0.6" filter="blur(8px)" />

      ${
        type === "tee"
          ? `
          <!-- T-Shirt Body -->
          <path d="M 110,140 L 140,145 L 120,230 L 155,235 L 155,400 L 245,400 L 245,235 L 280,230 L 260,145 L 290,140 L 260,95 L 235,102 C 235,102 200,120 165,102 L 140,95 Z" fill="${primaryColor}" stroke="#1f1f1f" stroke-width="2" />
          <!-- Neck rib -->
          <path d="M 165,102 C 180,115 220,115 235,102 C 230,96 170,96 165,102 Z" fill="#111111" stroke="${accentColor}" stroke-width="1" />
          <!-- Sleeve hems -->
          <path d="M 120,230 L 155,235 M 280,230 L 245,235" stroke="${accentColor}" stroke-width="1" />
          <!-- Streetwear graphic print -->
          <rect x="160" y="170" width="80" height="100" fill="#111111" rx="5" stroke="#222" />
          <text x="200" y="210" font-family="'Bebas Neue', Arial" font-size="24" fill="url(#silver-grad)" text-anchor="middle" letter-spacing="1">DESHI</text>
          <text x="200" y="235" font-family="'Bebas Neue', Arial" font-size="28" fill="#ffffff" text-anchor="middle" letter-spacing="2">FLEX</text>
          <text x="200" y="255" font-family="sans-serif" font-size="8" fill="${accentColor}" text-anchor="middle" letter-spacing="3">${graphicText}</text>
          `
          : ""
      }
    </svg>
  `;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const PRODUCTS: Product[] = [
  {
    id: "ds-black",
    name: "Classic Drop Shoulder - Black",
    slug: "classic-drop-shoulder-black",
    price: 850,
    originalPrice: 1000,
    description: "The essential classic drop shoulder t-shirt in deep black. Crafted for comfort and everyday wear with a clean, minimalist aesthetic.",
    images: [
      generateSvgPlaceholder("tee", "#111111", "#e4e4e7", "BLACK")
    ],
    category: "drop-shoulder",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [{ name: "Black", hex: "#111111" }],
    inventory: {
      "Black": { "M": 4, "L": 5, "XL": 4, "XXL": 1 }
    },
    rating: 4.9,
    reviewsCount: 156,
    inStock: true,
    stockCount: 14,
    isNew: true,
    isSale: true,
    tagline: "Your daily essential.",
    details: ["220 GSM premium combed cotton", "Relaxed drop shoulder fit", "Soft-touch fabric finish"],
    reviews: []
  },
  {
    id: "ds-white",
    name: "Classic Drop Shoulder - White",
    slug: "classic-drop-shoulder-white",
    price: 850,
    originalPrice: 1000,
    description: "The essential classic drop shoulder t-shirt in pure white.",
    images: [
      generateSvgPlaceholder("tee", "#f5f5f7", "#111111", "WHITE")
    ],
    category: "drop-shoulder",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [{ name: "White", hex: "#f5f5f7" }],
    inventory: {
      "White": { "M": 3, "L": 3, "XL": 4, "XXL": 1 }
    },
    rating: 4.9,
    reviewsCount: 120,
    inStock: true,
    stockCount: 11,
    isNew: true,
    isSale: true,
    tagline: "Pure and clean.",
    details: ["220 GSM premium combed cotton", "Relaxed drop shoulder fit", "Soft-touch fabric finish"],
    reviews: []
  },
  {
    id: "ds-offwhite",
    name: "Classic Drop Shoulder - Off-White",
    slug: "classic-drop-shoulder-off-white",
    price: 850,
    originalPrice: 1000,
    description: "The essential classic drop shoulder t-shirt in vintage off-white.",
    images: [
      generateSvgPlaceholder("tee", "#f8f4e6", "#111111", "OFF-WHITE")
    ],
    category: "drop-shoulder",
    sizes: ["XL"],
    colors: [{ name: "Off-White", hex: "#f8f4e6" }],
    inventory: {
      "Off-White": { "XL": 1 }
    },
    rating: 4.9,
    reviewsCount: 45,
    inStock: true,
    stockCount: 1,
    isNew: true,
    isSale: true,
    tagline: "Vintage aesthetic.",
    details: ["220 GSM premium combed cotton", "Relaxed drop shoulder fit", "Soft-touch fabric finish"],
    reviews: []
  },
  {
    id: "ds-olive",
    name: "Classic Drop Shoulder - Olive",
    slug: "classic-drop-shoulder-olive",
    price: 850,
    originalPrice: 1000,
    description: "The essential classic drop shoulder t-shirt in military olive.",
    images: [
      generateSvgPlaceholder("tee", "#4b5320", "#e4e4e7", "OLIVE")
    ],
    category: "drop-shoulder",
    sizes: ["M", "L", "XL"],
    colors: [{ name: "Olive", hex: "#4b5320" }],
    inventory: {
      "Olive": { "M": 1, "L": 2, "XL": 2 }
    },
    rating: 4.8,
    reviewsCount: 88,
    inStock: true,
    stockCount: 5,
    isNew: true,
    isSale: true,
    tagline: "Earthy tones.",
    details: ["220 GSM premium combed cotton", "Relaxed drop shoulder fit", "Soft-touch fabric finish"],
    reviews: []
  },
  {
    id: "ds-cream",
    name: "Classic Drop Shoulder - Cream",
    slug: "classic-drop-shoulder-cream",
    price: 850,
    originalPrice: 1000,
    description: "The essential classic drop shoulder t-shirt in soft cream.",
    images: [
      generateSvgPlaceholder("tee", "#fffdd0", "#111111", "CREAM")
    ],
    category: "drop-shoulder",
    sizes: ["M", "L", "XL"],
    colors: [{ name: "Cream", hex: "#fffdd0" }],
    inventory: {
      "Cream": { "M": 1, "L": 2, "XL": 2 }
    },
    rating: 4.8,
    reviewsCount: 92,
    inStock: true,
    stockCount: 5,
    isNew: true,
    isSale: true,
    tagline: "Smooth luxury.",
    details: ["220 GSM premium combed cotton", "Relaxed drop shoulder fit", "Soft-touch fabric finish"],
    reviews: []
  },
  {
    id: "ds-navy",
    name: "Classic Drop Shoulder - Navy Blue",
    slug: "classic-drop-shoulder-navy-blue",
    price: 850,
    originalPrice: 1000,
    description: "The essential classic drop shoulder t-shirt in deep navy blue.",
    images: [
      generateSvgPlaceholder("tee", "#1c2e4a", "#ffffff", "NAVY")
    ],
    category: "drop-shoulder",
    sizes: ["M", "L", "XL"],
    colors: [{ name: "Navy Blue", hex: "#1c2e4a" }],
    inventory: {
      "Navy Blue": { "M": 1, "L": 2, "XL": 2 }
    },
    rating: 4.9,
    reviewsCount: 105,
    inStock: true,
    stockCount: 5,
    isNew: true,
    isSale: true,
    tagline: "Deep ocean vibes.",
    details: ["220 GSM premium combed cotton", "Relaxed drop shoulder fit", "Soft-touch fabric finish"],
    reviews: []
  },
  {
    id: "ds-maroon",
    name: "Classic Drop Shoulder - Maroon",
    slug: "classic-drop-shoulder-maroon",
    price: 850,
    originalPrice: 1000,
    description: "The essential classic drop shoulder t-shirt in rich maroon.",
    images: [
      generateSvgPlaceholder("tee", "#630f0f", "#e4e4e7", "MAROON")
    ],
    category: "drop-shoulder",
    sizes: ["M", "L", "XL"],
    colors: [{ name: "Maroon", hex: "#630f0f" }],
    inventory: {
      "Maroon": { "M": 1, "L": 2, "XL": 2 }
    },
    rating: 4.7,
    reviewsCount: 67,
    inStock: true,
    stockCount: 5,
    isNew: true,
    isSale: true,
    tagline: "Rich and bold.",
    details: ["220 GSM premium combed cotton", "Relaxed drop shoulder fit", "Soft-touch fabric finish"],
    reviews: []
  },
  {
    id: "ds-coffee",
    name: "Classic Drop Shoulder - Coffee",
    slug: "classic-drop-shoulder-coffee",
    price: 850,
    originalPrice: 1000,
    description: "The essential classic drop shoulder t-shirt in warm coffee brown.",
    images: [
      generateSvgPlaceholder("tee", "#4a2c2a", "#e4e4e7", "COFFEE")
    ],
    category: "drop-shoulder",
    sizes: ["M", "L", "XL"],
    colors: [{ name: "Coffee", hex: "#4a2c2a" }],
    inventory: {
      "Coffee": { "M": 1, "L": 2, "XL": 2 }
    },
    rating: 4.8,
    reviewsCount: 54,
    inStock: true,
    stockCount: 5,
    isNew: true,
    isSale: true,
    tagline: "Warm aesthetics.",
    details: ["220 GSM premium combed cotton", "Relaxed drop shoulder fit", "Soft-touch fabric finish"],
    reviews: []
  },
  {
    id: "cds-black",
    name: "Custom Drop Shoulder - Black",
    slug: "custom-drop-shoulder-black",
    price: 1250,
    originalPrice: 1500,
    description: "Upload your own graphics or choose from our custom design library. Printed on our premium black drop shoulder blanks.",
    images: [generateSvgPlaceholder("tee", "#111111", "#e4e4e7", "CUSTOM BLACK")],
    category: "custom-drop-shoulder",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [{ name: "Black", hex: "#111111" }],
    inventory: { "Black": { "M": 4, "L": 5, "XL": 4, "XXL": 1 } },
    rating: 5.0, reviewsCount: 42, inStock: true, stockCount: 14, isNew: true, tagline: "Wear your imagination.",
    details: ["High-fidelity DTF custom printing", "220 GSM drop shoulder blank"], reviews: []
  },
  {
    id: "cds-white",
    name: "Custom Drop Shoulder - White",
    slug: "custom-drop-shoulder-white",
    price: 1250,
    originalPrice: 1500,
    description: "Upload your own graphics or choose from our custom design library. Printed on our premium white drop shoulder blanks.",
    images: [generateSvgPlaceholder("tee", "#f5f5f7", "#111111", "CUSTOM WHITE")],
    category: "custom-drop-shoulder",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [{ name: "White", hex: "#f5f5f7" }],
    inventory: { "White": { "M": 3, "L": 3, "XL": 4, "XXL": 1 } },
    rating: 4.9, reviewsCount: 30, inStock: true, stockCount: 11, isNew: true, tagline: "Wear your imagination.",
    details: ["High-fidelity DTF custom printing", "220 GSM drop shoulder blank"], reviews: []
  },
  {
    id: "cds-offwhite",
    name: "Custom Drop Shoulder - Off-White",
    slug: "custom-drop-shoulder-off-white",
    price: 1250,
    originalPrice: 1500,
    description: "Upload your own graphics or choose from our custom design library. Printed on our premium off-white drop shoulder blanks.",
    images: [generateSvgPlaceholder("tee", "#f8f4e6", "#111111", "CUSTOM OFF-WHITE")],
    category: "custom-drop-shoulder",
    sizes: ["XL"],
    colors: [{ name: "Off-White", hex: "#f8f4e6" }],
    inventory: { "Off-White": { "XL": 1 } },
    rating: 4.8, reviewsCount: 12, inStock: true, stockCount: 1, isNew: true, tagline: "Wear your imagination.",
    details: ["High-fidelity DTF custom printing", "220 GSM drop shoulder blank"], reviews: []
  },
  {
    id: "cds-olive",
    name: "Custom Drop Shoulder - Olive",
    slug: "custom-drop-shoulder-olive",
    price: 1250,
    originalPrice: 1500,
    description: "Upload your own graphics or choose from our custom design library. Printed on our premium olive drop shoulder blanks.",
    images: [generateSvgPlaceholder("tee", "#4b5320", "#e4e4e7", "CUSTOM OLIVE")],
    category: "custom-drop-shoulder",
    sizes: ["M", "L", "XL"],
    colors: [{ name: "Olive", hex: "#4b5320" }],
    inventory: { "Olive": { "M": 1, "L": 2, "XL": 2 } },
    rating: 4.9, reviewsCount: 22, inStock: true, stockCount: 5, isNew: true, tagline: "Wear your imagination.",
    details: ["High-fidelity DTF custom printing", "220 GSM drop shoulder blank"], reviews: []
  },
  {
    id: "cds-cream",
    name: "Custom Drop Shoulder - Cream",
    slug: "custom-drop-shoulder-cream",
    price: 1250,
    originalPrice: 1500,
    description: "Upload your own graphics or choose from our custom design library. Printed on our premium cream drop shoulder blanks.",
    images: [generateSvgPlaceholder("tee", "#fffdd0", "#111111", "CUSTOM CREAM")],
    category: "custom-drop-shoulder",
    sizes: ["M", "L", "XL"],
    colors: [{ name: "Cream", hex: "#fffdd0" }],
    inventory: { "Cream": { "M": 1, "L": 2, "XL": 2 } },
    rating: 4.7, reviewsCount: 18, inStock: true, stockCount: 5, isNew: true, tagline: "Wear your imagination.",
    details: ["High-fidelity DTF custom printing", "220 GSM drop shoulder blank"], reviews: []
  },
  {
    id: "cds-navy",
    name: "Custom Drop Shoulder - Navy Blue",
    slug: "custom-drop-shoulder-navy-blue",
    price: 1250,
    originalPrice: 1500,
    description: "Upload your own graphics or choose from our custom design library. Printed on our premium navy blue drop shoulder blanks.",
    images: [generateSvgPlaceholder("tee", "#1c2e4a", "#ffffff", "CUSTOM NAVY")],
    category: "custom-drop-shoulder",
    sizes: ["M", "L", "XL"],
    colors: [{ name: "Navy Blue", hex: "#1c2e4a" }],
    inventory: { "Navy Blue": { "M": 1, "L": 2, "XL": 2 } },
    rating: 4.9, reviewsCount: 25, inStock: true, stockCount: 5, isNew: true, tagline: "Wear your imagination.",
    details: ["High-fidelity DTF custom printing", "220 GSM drop shoulder blank"], reviews: []
  },
  {
    id: "cds-maroon",
    name: "Custom Drop Shoulder - Maroon",
    slug: "custom-drop-shoulder-maroon",
    price: 1250,
    originalPrice: 1500,
    description: "Upload your own graphics or choose from our custom design library. Printed on our premium maroon drop shoulder blanks.",
    images: [generateSvgPlaceholder("tee", "#630f0f", "#e4e4e7", "CUSTOM MAROON")],
    category: "custom-drop-shoulder",
    sizes: ["M", "L", "XL"],
    colors: [{ name: "Maroon", hex: "#630f0f" }],
    inventory: { "Maroon": { "M": 1, "L": 2, "XL": 2 } },
    rating: 4.8, reviewsCount: 19, inStock: true, stockCount: 5, isNew: true, tagline: "Wear your imagination.",
    details: ["High-fidelity DTF custom printing", "220 GSM drop shoulder blank"], reviews: []
  },
  {
    id: "cds-coffee",
    name: "Custom Drop Shoulder - Coffee",
    slug: "custom-drop-shoulder-coffee",
    price: 1250,
    originalPrice: 1500,
    description: "Upload your own graphics or choose from our custom design library. Printed on our premium coffee drop shoulder blanks.",
    images: [generateSvgPlaceholder("tee", "#4a2c2a", "#e4e4e7", "CUSTOM COFFEE")],
    category: "custom-drop-shoulder",
    sizes: ["M", "L", "XL"],
    colors: [{ name: "Coffee", hex: "#4a2c2a" }],
    inventory: { "Coffee": { "M": 1, "L": 2, "XL": 2 } },
    rating: 5.0, reviewsCount: 28, inStock: true, stockCount: 5, isNew: true, tagline: "Wear your imagination.",
    details: ["High-fidelity DTF custom printing", "220 GSM drop shoulder blank"], reviews: []
  },
  {
    id: "wds-rose",
    name: "Women Drop Shoulder - Dusty Rose",
    slug: "women-drop-shoulder-dusty-rose",
    price: 850,
    originalPrice: 1000,
    description: "Tailored specifically for women, offering the relaxed vibe of a drop shoulder with a feminine dusty rose hue.",
    images: [generateSvgPlaceholder("tee", "#d6b5b5", "#111111", "DUSTY ROSE")],
    category: "women-drop-shoulder",
    sizes: ["S", "M", "L"],
    colors: [{ name: "Dusty Rose", hex: "#d6b5b5" }],
    inventory: { "Dusty Rose": { "S": 5, "M": 5, "L": 5 } },
    rating: 4.9, reviewsCount: 56, inStock: true, stockCount: 15, isNew: true, tagline: "Relaxed elegance.",
    details: ["200 GSM breathable cotton", "Feminine drop shoulder cut"], reviews: []
  },
  {
    id: "wds-lavender",
    name: "Women Drop Shoulder - Lavender",
    slug: "women-drop-shoulder-lavender",
    price: 850,
    originalPrice: 1000,
    description: "Tailored specifically for women, offering the relaxed vibe of a drop shoulder with a soft lavender hue.",
    images: [generateSvgPlaceholder("tee", "#e6e6fa", "#111111", "LAVENDER")],
    category: "women-drop-shoulder",
    sizes: ["S", "M", "L"],
    colors: [{ name: "Lavender", hex: "#e6e6fa" }],
    inventory: { "Lavender": { "S": 5, "M": 5, "L": 5 } },
    rating: 5.0, reviewsCount: 42, inStock: true, stockCount: 15, isNew: true, tagline: "Relaxed elegance.",
    details: ["200 GSM breathable cotton", "Feminine drop shoulder cut"], reviews: []
  },
  {
    id: "wds-sage",
    name: "Women Drop Shoulder - Sage Green",
    slug: "women-drop-shoulder-sage",
    price: 850,
    originalPrice: 1000,
    description: "Tailored specifically for women, offering the relaxed vibe of a drop shoulder with an earthy sage green hue.",
    images: [generateSvgPlaceholder("tee", "#9dc183", "#111111", "SAGE GREEN")],
    category: "women-drop-shoulder",
    sizes: ["S", "M", "L"],
    colors: [{ name: "Sage Green", hex: "#9dc183" }],
    inventory: { "Sage Green": { "S": 5, "M": 5, "L": 5 } },
    rating: 4.8, reviewsCount: 38, inStock: true, stockCount: 15, isNew: true, tagline: "Relaxed elegance.",
    details: ["200 GSM breathable cotton", "Feminine drop shoulder cut"], reviews: []
  },
  {
    id: "ods-black",
    name: "Oversize Drop Shoulder - Black",
    slug: "oversize-drop-shoulder-black",
    price: 950,
    originalPrice: 1100,
    description: "Built for maximum volume. Featuring an exaggerated boxy fit and ultra-heavyweight cotton for the true streetwear silhouette.",
    images: [generateSvgPlaceholder("tee", "#111111", "#e4e4e7", "OVERSIZE BLACK")],
    category: "over-size-drop-shoulder",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [{ name: "Black", hex: "#111111" }],
    inventory: { "Black": { "M": 4, "L": 5, "XL": 4, "XXL": 1 } },
    rating: 4.8, reviewsCount: 112, inStock: true, stockCount: 14, isNew: true, tagline: "Maximum volume.",
    details: ["280 GSM heavyweight cotton", "Exaggerated boxy oversized fit", "Thick ribbed collar"], reviews: []
  },
  {
    id: "ods-white",
    name: "Oversize Drop Shoulder - White",
    slug: "oversize-drop-shoulder-white",
    price: 950,
    originalPrice: 1100,
    description: "Built for maximum volume. Featuring an exaggerated boxy fit and ultra-heavyweight cotton for the true streetwear silhouette.",
    images: [generateSvgPlaceholder("tee", "#f5f5f7", "#111111", "OVERSIZE WHITE")],
    category: "over-size-drop-shoulder",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [{ name: "White", hex: "#f5f5f7" }],
    inventory: { "White": { "M": 3, "L": 3, "XL": 4, "XXL": 1 } },
    rating: 4.7, reviewsCount: 98, inStock: true, stockCount: 11, isNew: true, tagline: "Maximum volume.",
    details: ["280 GSM heavyweight cotton", "Exaggerated boxy oversized fit", "Thick ribbed collar"], reviews: []
  },
  {
    id: "ds-05",
    name: "Acid Wash Drop Shoulder",
    slug: "acid-wash-drop-shoulder",
    price: 1100,
    originalPrice: 1300,
    description: "Premium acid-washed drop shoulder tee. Each piece has a unique vintage fade and texture, providing a worn-in feel right out of the box.",
    images: [
      generateSvgPlaceholder("tee", "#333333", "#e4e4e7", "ACID WASH"),
    ],
    category: "acid-wash-drop-shoulder",
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#111111" }
    ],
    rating: 4.9,
    reviewsCount: 78,
    inStock: true,
    stockCount: 65,
    isNew: true,
    tagline: "Unique character.",
    details: [
      "240 GSM acid-washed cotton",
      "Unique vintage fade on every piece",
      "Relaxed drop shoulder fit"
    ],
    reviews: []
  },
  {
    id: "ds-06",
    name: "Custom Acid Wash Drop Shoulder",
    slug: "custom-acid-wash-drop-shoulder",
    price: 1450,
    originalPrice: 1650,
    description: "Combine the unique vintage aesthetic of our acid wash blanks with your own custom graphic prints for a truly one-of-a-kind streetwear piece.",
    images: [
      generateSvgPlaceholder("tee", "#4a4a4a", "#111111", "CUSTOM ACID"),
    ],
    category: "custom-acid-wash-drop-shoulder",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#111111" }
    ],
    rating: 5.0,
    reviewsCount: 34,
    inStock: true,
    stockCount: 25,
    isNew: true,
    tagline: "Vintage custom.",
    details: [
      "DTF custom printing on acid wash blank",
      "240 GSM premium cotton",
      "Custom distress options available"
    ],
    reviews: []
  }
];
