import { Product, Review } from './types';

// Import image assets so Vite compiles, hashes, and bundles them into the final dist folder
import heroImg from './assets/images/rutujas_hero_image_1784454985142.jpg';
import singleHibiscusImg from './assets/images/single_hibiscus_flower_1784454998358.jpg';
import hibiscusGarlandImg from './assets/images/hibiscus_garland_1784455059554.jpg';
import marigoldGarlandImg from './assets/images/marigold_garland_1784455013443.jpg';
import chafaGarlandImg from './assets/images/chafa_garland_1784455027973.jpg';

export const HERO_IMAGE = heroImg;

export const PRODUCTS: Product[] = [
  {
    id: "single-hibiscus",
    name: "Handcrafted Single Hibiscus Flower",
    category: "flower",
    flowerType: "hibiscus",
    price: 149,
    description: "A beautifully crafted single red hibiscus flower made of premium pipe cleaners. Features dynamic flexible petals, a realistic yellow-dusted stamen, and a supportive green leaf base. Perfect as a desk accent, bookmark, hair accessory, or simple handcrafted gift.",
    imageUrl: singleHibiscusImg,
    rating: 4.8,
    reviewsCount: 34,
    tags: ["Best Seller", "Gift Favorite"],
    specs: {
      flowerCount: 1,
      materials: ["Premium Chenille Stems", "Florist Wire", "Eco Glue"],
      durability: "Everlasting, flexible stems"
    }
  },
  {
    id: "hibiscus-garland-5",
    name: "Classic Hibiscus Garland (5 Flowers)",
    category: "garland",
    flowerType: "hibiscus",
    price: 549,
    description: "A premium 2.5-foot garland featuring 5 exquisitely detailed red hibiscus flowers interspersed with rich green leaves. Perfectly sized for small home shrines, car dashboards, or mirror decorations.",
    imageUrl: hibiscusGarlandImg,
    rating: 4.9,
    reviewsCount: 18,
    tags: ["Home Decor", "Festive Accent"],
    specs: {
      flowerCount: 5,
      length: "2.5 Feet",
      materials: ["Chenille Stems", "Satin Ribbon", "Floral Tape"],
      durability: "Durable, shape-retaining"
    }
  },
  {
    id: "hibiscus-garland-7",
    name: "Auspicious Hibiscus Garland (7 Flowers)",
    category: "garland",
    flowerType: "hibiscus",
    price: 749,
    description: "An elegant 3.5-foot handmade garland with 7 vibrant pipe cleaner hibiscus blossoms. Features high density and flexible joints, ideal for decorating entryways, large photo frames, or temple mandirs.",
    imageUrl: hibiscusGarlandImg,
    rating: 4.9,
    reviewsCount: 22,
    tags: ["Festive Special", "Highly Rated"],
    specs: {
      flowerCount: 7,
      length: "3.5 Feet",
      materials: ["Chenille Stems", "Satin Ribbon", "Reinforced Cord"],
      durability: "Bendable, lightweight, colorfast"
    }
  },
  {
    id: "hibiscus-garland-11",
    name: "Grand Celebration Hibiscus Garland (11 Flowers)",
    category: "garland",
    flowerType: "hibiscus",
    price: 1149,
    description: "Our grandest hibiscus garland! Spans 5.5 feet and hosts 11 densely clustered, magnificent pipe cleaner hibiscus flowers. Makes a breathtaking statement for pooja rooms, festivals, or wedding arches.",
    imageUrl: hibiscusGarlandImg,
    rating: 5.0,
    reviewsCount: 15,
    tags: ["Premium Craft", "Signature Collection"],
    specs: {
      flowerCount: 11,
      length: "5.5 Feet",
      materials: ["Extra Plush Chenille Stems", "Satin Ribbon", "Heavy Duty Core"],
      durability: "Highly durable, dust-resistant"
    }
  },
  {
    id: "marigold-garland",
    name: "Fluffy Marigold (Genda) Festive Garland",
    category: "garland",
    flowerType: "marigold",
    price: 499,
    description: "A dazzling 4-foot traditional garland made of fluffy, ultra-dense orange and yellow pipe cleaner marigolds. Accented with tiny green leaf clusters to match real genda phool perfectly. Unlike real flowers, they never wither, maintain their plump shape forever, and are water-resistant.",
    imageUrl: marigoldGarlandImg,
    rating: 4.9,
    reviewsCount: 47,
    tags: ["Festive Essential", "Eco-Friendly"],
    specs: {
      length: "4 Feet",
      materials: ["Premium High-Density Chenille", "Beads", "Nylon Core"],
      durability: "Fluff-retaining, lightweight"
    }
  },
  {
    id: "chafa-garland",
    name: "Elegant Chafa (Frangipani) Traditional Garland",
    category: "garland",
    flowerType: "chafa",
    price: 599,
    description: "A serene 4-foot white-and-yellow Chafa (Plumeria/Frangipani) garland. Crafted with meticulous layering for a realistic five-petal flower structure, representing peace, purity, and aesthetic beauty. Excellent for traditional pooja, housewarming decor, or elegant backdrop hangings.",
    imageUrl: chafaGarlandImg,
    rating: 4.8,
    reviewsCount: 29,
    tags: ["Premium Elegant", "Unique Craft"],
    specs: {
      length: "4 Feet",
      materials: ["Chenille Stems", "Handmade Paper Accents", "Satin Twine"],
      durability: "Delicate appearance, sturdy construction"
    }
  }
];

export const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Meera Deshmukh",
    rating: 5,
    comment: "Absolutely gorgeous marigold garland! I bought it for my home temple, and it looks so lifelike. My guests couldn't believe it was made of pipe cleaners. Durable and so easy to clean!",
    date: "2026-06-12",
    verified: true
  },
  {
    id: "r2",
    name: "Aditya Joshi",
    rating: 5,
    comment: "Ordered the 11-flower hibiscus garland for Ganesh Chaturthi. The craftsmanship is flawless. It gave such an elegant, premium look to the decor. Highly recommended!",
    date: "2026-07-04",
    verified: true
  },
  {
    id: "r3",
    name: "Pooja Vartak",
    rating: 5,
    comment: "The Chafa (Frangipani) garland is extremely elegant. The white and yellow coloring is spot on. I also got a single hibiscus flower to keep on my office desk—it brings me so much joy every day.",
    date: "2026-07-15",
    verified: true
  },
  {
    id: "r4",
    name: "Sneha Patil",
    rating: 4,
    comment: "Very neatly done! The garlands are light and easily bendable, which made hanging them a breeze. Best part is they are eco-friendly and reusable for every festival.",
    date: "2026-05-30",
    verified: true
  }
];

export const FAQS = [
  {
    q: "What materials are used to make these flowers?",
    a: "All our flowers are handcrafted using premium, extra-plush chenille stems (commonly known as pipe cleaners), high-grade flexible florist wires, and satin ribbons for a clean, professional finish."
  },
  {
    q: "Can I get a custom length or a different combination of flowers?",
    a: "Yes! Rutuja's Art Collection specializes in fully custom creations. You can customize the flower types, lengths, color themes, or specific counts of flowers in your garlands. Use our 'Custom Inquiry' form or message us directly on WhatsApp to discuss your vision."
  },
  {
    q: "How do I maintain and clean the garlands?",
    a: "They are extremely low maintenance! Since they are made of chenille stems, simply blow off any dust with a hairdryer on cold/low speed, or gently shake them. Avoid washing them in water to keep the wire core dry."
  },
  {
    q: "How long does it take to deliver my order?",
    a: "As each piece is meticulously handcrafted by Rutuja, standard catalog items take 3-5 days to prepare. Custom orders might take 5-10 days depending on complexity and order size, plus standard shipping time."
  }
];
