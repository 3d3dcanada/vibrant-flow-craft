import { MaterialType } from "@/config/pricing";

export interface PromoProduct {
  id: string;
  name: string;
  category: "Office" | "Utility";
  description: string;
  image: string;
  moqs: number[];
  // Quote presets
  defaultMaterial: MaterialType;
  gramsPerUnit: number;
  minutesPerUnit: number;
  logoTextMaxChars: number;
}

export const PROMO_PRODUCTS: PromoProduct[] = [
  // Office Items
  {
    id: "keychain-custom",
    category: "Office",
    name: "Custom Logo Keychain",
    description: "Durable keychain with your company logo. Perfect for trade shows and client gifts.",
    image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
    defaultMaterial: "PLA_STANDARD",
    gramsPerUnit: 8,
    minutesPerUnit: 12,
    logoTextMaxChars: 20,
  },
  {
    id: "business-card-holder",
    category: "Office",
    name: "Business Card Holder",
    description: "Elegant desktop card holder. Showcase your brand on every desk.",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
    defaultMaterial: "PLA_STANDARD",
    gramsPerUnit: 25,
    minutesPerUnit: 35,
    logoTextMaxChars: 25,
  },
  {
    id: "pen-holder",
    category: "Office",
    name: "Branded Pen Holder",
    description: "Sleek pen organizer with custom branding. Keep desks tidy and branded.",
    image: "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
    defaultMaterial: "PLA_STANDARD",
    gramsPerUnit: 35,
    minutesPerUnit: 45,
    logoTextMaxChars: 30,
  },
  {
    id: "phone-stand",
    category: "Office",
    name: "Phone Stand",
    description: "Adjustable phone stand for desks. Your logo visible all day.",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
    defaultMaterial: "PETG",
    gramsPerUnit: 30,
    minutesPerUnit: 40,
    logoTextMaxChars: 20,
  },
  {
    id: "cable-organizer",
    category: "Office",
    name: "Cable Organizer",
    description: "Desktop cable management clip. Practical daily-use item.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
    defaultMaterial: "TPU",
    gramsPerUnit: 5,
    minutesPerUnit: 8,
    logoTextMaxChars: 15,
  },
  // Utility Items
  {
    id: "bottle-opener",
    category: "Utility",
    name: "Bottle Opener",
    description: "Custom branded bottle opener keychain. Great for events.",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
    defaultMaterial: "PETG",
    gramsPerUnit: 15,
    minutesPerUnit: 18,
    logoTextMaxChars: 20,
  },
  {
    id: "shopping-cart-token",
    category: "Utility",
    name: "Shopping Cart Token",
    description: "Reusable cart coin with your logo. Daily brand exposure.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
    defaultMaterial: "PLA_STANDARD",
    gramsPerUnit: 4,
    minutesPerUnit: 6,
    logoTextMaxChars: 15,
  },
  {
    id: "luggage-tag",
    category: "Utility",
    name: "Luggage Tag",
    description: "Durable travel luggage tag. Perfect for corporate travel kits.",
    image: "https://images.unsplash.com/photo-1553531384-411a247ccd73?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
    defaultMaterial: "PETG",
    gramsPerUnit: 12,
    minutesPerUnit: 15,
    logoTextMaxChars: 25,
  },
  {
    id: "coaster",
    category: "Utility",
    name: "Branded Coaster",
    description: "Custom coasters for offices and events. Protects surfaces, promotes brands.",
    image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
    defaultMaterial: "PLA_STANDARD",
    gramsPerUnit: 18,
    minutesPerUnit: 22,
    logoTextMaxChars: 30,
  },
  {
    id: "chip-clip",
    category: "Utility",
    name: "Chip Clip",
    description: "Useful snack bag clip with branding. Kitchen staple with your logo.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    moqs: [25, 50, 100],
    defaultMaterial: "TPU",
    gramsPerUnit: 10,
    minutesPerUnit: 14,
    logoTextMaxChars: 20,
  },
];

export const getPromoProductById = (id: string): PromoProduct | undefined => {
  return PROMO_PRODUCTS.find(p => p.id === id);
};
