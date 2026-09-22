import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  Star,
  MapPin,
  Menu,
  X,
  ShieldCheck,
  Lock,
  User,
  Check,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Package,
  PackageSearch,
  ShoppingBag,
  Tag,
  Users,
  Server,
  KeyRound,
  Edit3,
  Trash2,
  Plus,
  RefreshCw,
  Truck,
  RotateCcw,
  Sparkles,
  Save,
  Printer,
  Globe,
  CreditCard,
  Headphones,
  Watch,
  Armchair,
  Briefcase,
  Coffee,
  Footprints,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Radio,
  Minus,
  ArrowRight,
  Volume2,
  VolumeX,
  ZoomIn,
  ArrowUp,
  Flame,
  Eye,
  Upload,
  Bot,
  MessageSquare,
  Send,
  Scale,
  Gift,
  Sun,
  Moon,
  Mic,
  MicOff,
  Navigation,
  PartyPopper,
  Zap,
  Award,
  Phone,
  Clock,
  Play,
  Pause,
  Layers,
  Maximize2,
  Calculator,
  FileText,
  QrCode,
  Share2,
  CheckSquare,
  Square,
  Tv,
  Camera,
  Scan,
  LineChart,
  TrendingDown,
  Bell
} from 'lucide-react';

const CURRENCY_CONFIG = {
  INR: { symbol: '₹', rate: 1.0, locale: 'en-IN', code: 'INR' },
  USD: { symbol: '$', rate: 0.012, locale: 'en-US', code: 'USD' },
  EUR: { symbol: '€', rate: 0.011, locale: 'de-DE', code: 'EUR' },
  GBP: { symbol: '£', rate: 0.0095, locale: 'en-GB', code: 'GBP' },
  CAD: { symbol: 'CA$', rate: 0.016, locale: 'en-CA', code: 'CAD' }
};

let globalCurrency = 'INR';

function formatCurrency(value, currency = globalCurrency) {
  const conf = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
  const baseValue = (value || 0);
  const inrValue = baseValue > 1000 ? baseValue : baseValue * 83.5;
  const converted = inrValue * conf.rate;
  return new Intl.NumberFormat(conf.locale, {
    style: 'currency',
    currency: conf.code,
    maximumFractionDigits: 0
  }).format(converted);
}

function playAudioChime(type = 'click', enabled = true) {
  if (!enabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'add') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  } catch (e) {
    // Audio fallback
  }
}

function renderStars(rating = 4.5, size = 13) {
  const full = Math.round(Number(rating) || 4.5);
  return (
    <span className="stars-gold" title={`${rating} out of 5 stars`} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', verticalAlign: 'middle' }}>
      {[1, 2, 3, 4, 5].map((idx) => {
        const isFilled = idx <= full;
        return (
          <Star
            key={idx}
            size={size}
            fill={isFilled ? '#de7921' : 'none'}
            color={isFilled ? '#de7921' : '#cbd5e1'}
            strokeWidth={isFilled ? 0 : 1.5}
          />
        );
      })}
    </span>
  );
}

const CATEGORY_SMART_IMAGES = {
  sunglasses: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
  glasses: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
  watch: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
  smartwatch: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  speaker: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
  football_boots: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80",
  shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  derby_shoes: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
  clothing: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80",
  fashion: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
  luggage: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=600&q=80",
  chair: "https://images.unsplash.com/photo-1580481077197-25e985ba46a8?auto=format&fit=crop&w=600&q=80",
  furniture: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
  lamp: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
  bedsheet: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
  laptop: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
  phone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
  gaming: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
  camera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
  perfume: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
  beauty: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
  jewelry: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
  coffee: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80",
  cookware: "https://images.unsplash.com/photo-1584990347449-397a6f235b2e?auto=format&fit=crop&w=600&q=80",
  cable: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
  vacuum: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80",
  tools: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=600&q=80"
};

function getSmartProductFallback(title = '', category = '', rawUrl = '') {
  const combined = (String(title || '') + ' ' + String(category || '') + ' ' + String(rawUrl || '')).toLowerCase();

  // 1. Sunglasses / Eyewear / Shades
  if (
    combined.includes('sunglass') || 
    combined.includes('sun-glass') || 
    combined.includes('sun glass') || 
    combined.includes('goggle') || 
    combined.includes('shades') || 
    combined.includes('spectacle') || 
    combined.includes('optics') || 
    combined.includes('rayban') || 
    combined.includes('aviator') || 
    combined.includes('wayfarer') ||
    (combined.includes('glasses') && !combined.includes('sunglasses'))
  ) {
    return CATEGORY_SMART_IMAGES.sunglasses;
  }

  // 2. Football Boots / Cleats
  if (combined.includes('boot') || combined.includes('cleat') || combined.includes('football') || combined.includes('soccer') || combined.includes('predator') || combined.includes('studs') || combined.includes('mercurial')) {
    return CATEGORY_SMART_IMAGES.football_boots;
  }

  // 3. Shoes / Sneakers / Footwear
  if (combined.includes('derby') || combined.includes('formal shoe') || combined.includes('leather shoe') || combined.includes('oxford')) {
    return CATEGORY_SMART_IMAGES.derby_shoes;
  }
  if (combined.includes('shoe') || combined.includes('sneaker') || combined.includes('runner') || combined.includes('footwear') || combined.includes('pegasus') || combined.includes('loafers') || combined.includes('sandals') || combined.includes('slippers') || combined.includes('heels') || combined.includes('trainers')) {
    return CATEGORY_SMART_IMAGES.shoes;
  }

  // 4. Smartwatches & Watches
  if (combined.includes('smartwatch') || combined.includes('apple watch') || combined.includes('galaxy watch') || combined.includes('fitness band') || combined.includes('fitbit') || combined.includes('smart band')) {
    return CATEGORY_SMART_IMAGES.smartwatch;
  }
  if (combined.includes('chrono') || combined.includes('analog watch') || combined.includes('luxury watch') || combined.includes('timepiece') || combined.includes('rolex') || combined.includes('fossil') || (combined.includes('watch') && !combined.includes('stopwatch'))) {
    return CATEGORY_SMART_IMAGES.watch;
  }

  // 5. Audio / Headphones / Earbuds / Speakers
  if (combined.includes('speaker') || combined.includes('soundbar') || combined.includes('partybox') || combined.includes('echo dot') || combined.includes('subwoofer') || combined.includes('jbl')) {
    return CATEGORY_SMART_IMAGES.speaker;
  }
  if (combined.includes('headphone') || combined.includes('earbud') || combined.includes('earphone') || combined.includes('airpod') || combined.includes('headset') || combined.includes('anc') || combined.includes('tws') || combined.includes('ear piece')) {
    return CATEGORY_SMART_IMAGES.headphones;
  }

  // 6. Mobile Phones & Smartphones
  if (combined.includes('phone') || combined.includes('mobile') || combined.includes('smartphone') || combined.includes('iphone') || combined.includes('android') || combined.includes('galaxy') || combined.includes('oneplus') || combined.includes('redmi') || combined.includes('pixel')) {
    return CATEGORY_SMART_IMAGES.phone;
  }

  // 7. Laptops & Computers
  if (combined.includes('laptop') || combined.includes('macbook') || combined.includes('computer') || combined.includes('notebook') || combined.includes('pc') || combined.includes('thinkpad') || combined.includes('desktop')) {
    return CATEGORY_SMART_IMAGES.laptop;
  }

  // 8. Gaming & Peripherals
  if (combined.includes('gaming') || combined.includes('mouse') || combined.includes('keyboard') || combined.includes('joystick') || combined.includes('controller') || combined.includes('playstation') || combined.includes('xbox')) {
    return CATEGORY_SMART_IMAGES.gaming;
  }

  // 9. Cameras & Photography
  if (combined.includes('camera') || combined.includes('dslr') || combined.includes('lens') || combined.includes('gopro') || combined.includes('canon') || combined.includes('nikon') || combined.includes('webcam')) {
    return CATEGORY_SMART_IMAGES.camera;
  }

  // 10. Furniture, Chairs & Home Decor
  if (combined.includes('chair') || combined.includes('ergonomic') || combined.includes('office chair') || combined.includes('recliner') || combined.includes('stool')) {
    return CATEGORY_SMART_IMAGES.chair;
  }
  if (combined.includes('lamp') || combined.includes('light') || combined.includes('chandelier') || combined.includes('lantern') || combined.includes('bulb')) {
    return CATEGORY_SMART_IMAGES.lamp;
  }
  if (combined.includes('bedsheet') || combined.includes('bed sheet') || combined.includes('pillow') || combined.includes('blanket') || combined.includes('duvet') || combined.includes('cushion') || combined.includes('bedding') || combined.includes('curtain')) {
    return CATEGORY_SMART_IMAGES.bedsheet;
  }
  if (combined.includes('furniture') || combined.includes('table') || combined.includes('desk') || combined.includes('sofa') || combined.includes('couch') || combined.includes('planter') || combined.includes('pot') || combined.includes('wardrobe') || combined.includes('shelf') || combined.includes('home decor')) {
    return CATEGORY_SMART_IMAGES.furniture;
  }

  // 11. Vacuum Cleaners & Appliances
  if (combined.includes('vacuum') || combined.includes('cleaner') || combined.includes('turboclean') || combined.includes('hepa')) {
    return CATEGORY_SMART_IMAGES.vacuum;
  }

  // 12. Tools & Hardware
  if (combined.includes('stripper') || combined.includes('crimper') || combined.includes('pliers') || combined.includes('tool') || combined.includes('drill') || combined.includes('wrench') || combined.includes('hardware')) {
    return CATEGORY_SMART_IMAGES.tools;
  }

  // 13. Cables & Fast Chargers
  if (combined.includes('cable') || combined.includes('charger') || combined.includes('usb-c') || combined.includes('adapter') || combined.includes('power delivery') || combined.includes('cord')) {
    return CATEGORY_SMART_IMAGES.cable;
  }

  // 14. Kitchen & Dining & Coffee
  if (combined.includes('cookware') || combined.includes('pan') || combined.includes('pot') || combined.includes('tri-ply') || combined.includes('induction') || combined.includes('utensil') || combined.includes('knife')) {
    return CATEGORY_SMART_IMAGES.cookware;
  }
  if (combined.includes('coffee') || combined.includes('espresso') || combined.includes('mug') || combined.includes('bottle') || combined.includes('kitchen') || combined.includes('blender') || combined.includes('mixer') || combined.includes('juicer') || combined.includes('flask')) {
    return CATEGORY_SMART_IMAGES.coffee;
  }

  // 15. Luggage, Bags & Backpacks
  if (combined.includes('luggage') || combined.includes('suitcase') || combined.includes('trolley') || combined.includes('backpack') || combined.includes('tote') || combined.includes('handbag') || combined.includes('purse') || combined.includes('wallet') || combined.includes('bag') || combined.includes('duffel')) {
    return CATEGORY_SMART_IMAGES.luggage;
  }

  // 16. Perfume, Beauty & Skincare
  if (combined.includes('perfume') || combined.includes('fragrance') || combined.includes('cologne') || combined.includes('scent') || combined.includes('deodorant')) {
    return CATEGORY_SMART_IMAGES.perfume;
  }
  if (combined.includes('serum') || combined.includes('lipstick') || combined.includes('makeup') || combined.includes('cosmetic') || combined.includes('skincare') || combined.includes('lotion') || combined.includes('cream') || combined.includes('beauty') || combined.includes('face') || combined.includes('glow')) {
    return CATEGORY_SMART_IMAGES.beauty;
  }

  // 17. Jewelry
  if (combined.includes('jewelry') || combined.includes('necklace') || combined.includes('ring') || combined.includes('bracelet') || combined.includes('gold') || combined.includes('diamond') || combined.includes('silver') || combined.includes('pendant')) {
    return CATEGORY_SMART_IMAGES.jewelry;
  }

  // 18. Clothing & Fashion Apparel
  if (combined.includes('shirt') || combined.includes('jersey') || combined.includes('jacket') || combined.includes('cloth') || combined.includes('puffer') || combined.includes('hoodie') || combined.includes('dress') || combined.includes('saree') || combined.includes('kurta') || combined.includes('jeans') || combined.includes('pants') || combined.includes('trouser') || combined.includes('apparel') || combined.includes('fashion') || combined.includes('wear') || combined.includes('sweater')) {
    return CATEGORY_SMART_IMAGES.clothing;
  }

  // 19. Category based fallbacks when no specific keyword hit
  const cat = String(category || '').toLowerCase();
  if (cat.includes('electr')) {
    return CATEGORY_SMART_IMAGES.headphones;
  }
  if (cat.includes('fash') || cat.includes('cloth') || cat.includes('apparel')) {
    return CATEGORY_SMART_IMAGES.clothing;
  }
  if (cat.includes('furn') || cat.includes('home') || cat.includes('living')) {
    return CATEGORY_SMART_IMAGES.furniture;
  }
  if (cat.includes('trav') || cat.includes('lugg') || cat.includes('bag')) {
    return CATEGORY_SMART_IMAGES.luggage;
  }
  if (cat.includes('sport') || cat.includes('fit')) {
    return CATEGORY_SMART_IMAGES.shoes;
  }
  if (cat.includes('beaut') || cat.includes('care') || cat.includes('health')) {
    return CATEGORY_SMART_IMAGES.beauty;
  }

  // Safe default: Professional Headphones
  return CATEGORY_SMART_IMAGES.headphones;
}

function autoResolveImageUrl(rawUrl = '', title = '', category = '') {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  // 1. Amazon webpage URL auto-extraction (ASIN -> high-res image CDN)
  const asinMatch = trimmed.match(/\/(?:dp|gp\/product|ASIN)\/([A-Z0-9]{10})/i);
  if (asinMatch && asinMatch[1]) {
    const asin = asinMatch[1].toUpperCase();
    return `https://m.media-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_SX500_.jpg`;
  }

  // 2. If the user pasted an explicit HTML webpage product link (like naaptol.com/.../metal-sun-glasses-ssg/p/12615720.html)
  // and NOT a direct image link or base64 data, resolve using keyword context:
  const isWebpageHtml = (trimmed.endsWith('.html') || trimmed.endsWith('.htm') || trimmed.includes('.html?') || trimmed.includes('/p/1') || trimmed.includes('/product/')) && !trimmed.match(/\.(jpg|jpeg|png|webp|gif|svg|avif)($|\?)/i) && !trimmed.startsWith('data:image');
  if (isWebpageHtml) {
    return getSmartProductFallback(title, category, trimmed);
  }

  // 3. For all valid image URLs (Unsplash, CDNs, Flipkart, Myntra, Shopify, base64 data, local /images/ paths, etc.), return as-is!
  return trimmed;
}

const DEFAULT_PRODUCT_FALLBACK = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";

function handleImageError(e, title = '', category = '', rawUrl = '') {
  if (e && e.target) {
    if (e.target.getAttribute('data-error-handled')) return;
    e.target.setAttribute('data-error-handled', 'true');
    const attemptedUrl = rawUrl || e.target.getAttribute('data-original-src') || e.target.src || '';
    e.target.src = getSmartProductFallback(title, category, attemptedUrl);
  }
}

const PRODUCT_SPECS = {
  "Electronics": {
    "Brand": "Big Deal Audio Pro",
    "Model Name": "Acoustic Prime ANC",
    "Colour": "Matte Black / Cyber Titanium",
    "Form Factor": "Over Ear / Wireless Ergonomic",
    "Connectivity": "Bluetooth 5.3 & USB-C Fast Charge",
    "Battery Life": "Up to 40 Hours Playtime",
    "Special Feature": "Active Noise Cancellation, Hi-Res Audio"
  },
  "Furniture": {
    "Brand": "ErgoPro Luxury",
    "Material": "Reinforced Steel Alloy & High-Density Foam",
    "Max Weight": "350 lbs (160 kg)",
    "Warranty": "5-Year Structural Guarantee",
    "Assembly": "Tools & Manual Included (15 mins)"
  },
  "Travel": {
    "Brand": "Voyager Prime",
    "Material": "Polycarbonate Diamond Shell",
    "Lock Type": "TSA Approved 3-Digit Recessed Lock",
    "Wheels": "360° Silent Glide Double-Spinners",
    "Warranty": "3-Year International Warranty"
  },
  "Default": {
    "Brand": "Big Deal Essentials",
    "Quality": "Certified Grade-A Manufacturing",
    "Return Policy": "7-Day Replacement / 30-Day Return",
    "Warranty": "1-Year Manufacturer Warranty",
    "Delivery": "Ships in 24 Hours with Prime Tracking"
  }
};

// Curated Showcase Product Catalog for all Amazon Banner Tiles
const FEATURED_DEALS = [
  {
    id: 101,
    title: "AeroPulse Chrono Precision Analog Watch",
    category: "Electronics",
    price: 499,
    description: "Water-resistant stainless steel luxury timepiece with date window and scratch-proof sapphire crystal glass.",
    image_url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
    stock: 12,
    average_rating: 4.8,
    reviews_count: 342,
    images: [
      { id: 1011, image_url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80" },
      { id: 1012, image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 102,
    title: "Nordic Ceramic Indoor Planter & Gold Metal Stand Set",
    category: "Furniture",
    price: 799,
    description: "Handcrafted minimalist ceramic pots with corrosion-resistant tier metal stand. Perfect for living rooms, balconies and office desks.",
    image_url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
    stock: 8,
    average_rating: 4.9,
    reviews_count: 512,
    images: [
      { id: 1021, image_url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80" },
      { id: 1022, image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 103,
    title: "TurboClean Pro Handheld Cordless Vacuum Cleaner",
    category: "Electronics",
    price: 2199,
    description: "High-suction 12000Pa motor with HEPA filtration, multi-surface attachments, and rechargeable fast-charge battery.",
    image_url: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80",
    stock: 5,
    average_rating: 4.7,
    reviews_count: 219,
    images: [
      { id: 1031, image_url: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 104,
    title: "100% Pure Egyptian Cotton Double Bedsheet with 2 Pillow Covers",
    category: "Furniture",
    price: 489,
    description: "Breathable 400 thread count ultra-soft cotton bedsheet. Fade resistant, hypoallergenic, and machine washable.",
    image_url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
    stock: 24,
    average_rating: 4.6,
    reviews_count: 890,
    images: [
      { id: 1041, image_url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 105,
    title: "Heavy-Duty Multi-Tool Wire Stripper & Crimper Pliers",
    category: "Electronics",
    price: 1489,
    description: "Precision engineered chrome vanadium steel tool with ergonomic non-slip grip for electrical repairs.",
    image_url: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=600&q=80",
    stock: 15,
    average_rating: 4.8,
    reviews_count: 144,
    images: [
      { id: 1051, image_url: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 106,
    title: "Handcrafted Italian Leather Formal Derby Shoes",
    category: "Travel",
    price: 3389,
    description: "Premium full-grain genuine leather with cushioned insole and anti-skid rubber sole for all-day elegance.",
    image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
    stock: 9,
    average_rating: 4.9,
    reviews_count: 320,
    images: [
      { id: 1061, image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 107,
    title: "JBL Wireless PartyBox RGB Bluetooth Speaker",
    category: "Electronics",
    price: 3499,
    description: "100W massive sound with deep bass boost, dynamic light sync show, and IPX4 splashproof rating.",
    image_url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
    stock: 6,
    average_rating: 4.8,
    reviews_count: 678,
    images: [
      { id: 1071, image_url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 108,
    title: "Echo Dot (5th Gen) Smart Speaker with Alexa",
    category: "Electronics",
    price: 2999,
    description: "Deeper bass, clearer vocals, and smart home voice automation with motion detection and temperature sensor.",
    image_url: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=600&q=80",
    stock: 18,
    average_rating: 4.9,
    reviews_count: 1420,
    images: [
      { id: 1081, image_url: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 109,
    title: "Truly Wireless Active Noise Cancelling Earbuds",
    category: "Electronics",
    price: 1899,
    description: "40dB hybrid ANC, quad-mic ENC for crystal-clear calls, 36 hours total battery, and fast USB-C charge.",
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    stock: 14,
    average_rating: 4.7,
    reviews_count: 980,
    images: [
      { id: 1091, image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 110,
    title: "3-Piece Tri-Ply Stainless Steel Cookware Set with Glass Lids",
    category: "Furniture",
    price: 1299,
    description: "Induction and gas compatible cookware with aluminum core for even heat distribution and stay-cool handles.",
    image_url: "https://images.unsplash.com/photo-1584990347449-397a6f235b2e?auto=format&fit=crop&w=600&q=80",
    stock: 11,
    average_rating: 4.8,
    reviews_count: 420,
    images: [
      { id: 1101, image_url: "https://images.unsplash.com/photo-1584990347449-397a6f235b2e?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 111,
    title: "Windproof Thermal Winter Puffer Jacket",
    category: "Travel",
    price: 499,
    description: "Ultralight water-repellent jacket with insulated fleece lining and dual zip secure pockets for extreme cold weather.",
    image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    stock: 15,
    average_rating: 4.7,
    reviews_count: 240,
    images: [
      { id: 1111, image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 112,
    title: "Designer Vegan Leather Everyday Shoulder Tote Bag",
    category: "Travel",
    price: 489,
    description: "Spacious multi-compartment shoulder tote with gold-tone hardware and water-resistant nylon lining.",
    image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
    stock: 20,
    average_rating: 4.8,
    reviews_count: 310,
    images: [
      { id: 1121, image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 113,
    title: "Nordic Wooden Ambient Warm Bedside Table Lamp",
    category: "Furniture",
    price: 399,
    description: "Minimalist solid wood base bedside desk lamp with textured fabric drum shade and 3-way touch dimmer control.",
    image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    stock: 18,
    average_rating: 4.9,
    reviews_count: 530,
    images: [
      { id: 1131, image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 114,
    title: "Breathable Quick-Dry Athletic Sports Jersey",
    category: "Travel",
    price: 299,
    description: "Athletic moisture-wicking stretch fabric shirt engineered for gym workouts, running, cycling, and sports.",
    image_url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80",
    stock: 35,
    average_rating: 4.6,
    reviews_count: 189,
    images: [
      { id: 1141, image_url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 115,
    title: "Organic Vitamin C Radiant Glow Anti-Aging Face Serum",
    category: "Travel",
    price: 349,
    description: "20% Vitamin C concentrated serum with Hyaluronic Acid and Ferulic Acid for radiant glow, dark spot reduction, and skin hydration.",
    image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    stock: 22,
    average_rating: 4.8,
    reviews_count: 760,
    images: [
      { id: 1151, image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 116,
    title: "Fast Charging Braided 100W USB-C Cable (2m)",
    category: "Electronics",
    price: 199,
    description: "100W Power Delivery nylon braided fast charge & 480Mbps data transfer cable compatible with phones, laptops, and tablets.",
    image_url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
    stock: 50,
    average_rating: 4.9,
    reviews_count: 1250,
    images: [
      { id: 1161, image_url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80" }
    ]
  },
  {
    id: 117,
    title: "Luxury Velvet Matte Lipstick & Eye Shadow Palette Set",
    category: "Travel",
    price: 449,
    description: "12 vibrant blendable eye shadows with waterproof nude matte lipstick for daily elegance and glamorous evenings.",
    image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    stock: 25,
    average_rating: 4.7,
    reviews_count: 410,
    images: [
      { id: 1171, image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80" }
    ]
  }
];

const POPULAR_INDIAN_PINCODES = [
  { city: "Chennai", pincode: "600053", state: "Tamil Nadu", tag: "Same-Day Prime" },
  { city: "Bengaluru", pincode: "560001", state: "Karnataka", tag: "Same-Day Prime" },
  { city: "Mumbai", pincode: "400001", state: "Maharashtra", tag: "Same-Day Prime" },
  { city: "New Delhi", pincode: "110001", state: "Delhi", tag: "Same-Day Prime" },
  { city: "Hyderabad", pincode: "500081", state: "Telangana", tag: "Same-Day Prime" },
  { city: "Pune", pincode: "411001", state: "Maharashtra", tag: "Next-Day Prime" },
  { city: "Kolkata", pincode: "700001", state: "West Bengal", tag: "Next-Day Prime" },
  { city: "Ahmedabad", pincode: "380001", state: "Gujarat", tag: "Next-Day Prime" }
];

const LIVE_PURCHASE_STREAM = [
  { id: 1, name: "Rahul Sharma", city: "Mumbai", state: "MH", product: "AeroPulse Chrono Precision Watch", time: "2 mins ago", price: 499, avatar: "👨‍💼", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=300&q=80" },
  { id: 2, name: "Pooja Hegde", city: "Bengaluru", state: "KA", product: "Nordic Ceramic Planter Set", time: "4 mins ago", price: 799, avatar: "👩‍💻", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80" },
  { id: 3, name: "Ananya Iyer", city: "Chennai", state: "TN", product: "TurboClean Pro Cordless Vacuum", time: "7 mins ago", price: 2199, avatar: "👩‍⚕️", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=300&q=80" },
  { id: 4, name: "Arjun Verma", city: "New Delhi", state: "DL", product: "Wireless ANC Headphones", time: "9 mins ago", price: 1899, avatar: "👨‍🎓", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&q=80" },
  { id: 5, name: "Sneha Patel", city: "Ahmedabad", state: "GJ", product: "Tri-Ply Stainless Cookware Set", time: "12 mins ago", price: 1299, avatar: "👩‍💼", image: "https://images.unsplash.com/photo-1584990347449-397a6f235b2e?auto=format&fit=crop&w=300&q=80" },
  { id: 6, name: "Karthik Raja", city: "Hyderabad", state: "TS", product: "Fast Charging 100W USB-C Cable", time: "15 mins ago", price: 199, avatar: "👨‍💻", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80" },
  { id: 7, name: "Meera Nair", city: "Kochi", state: "KL", product: "Vitamin C Radiant Face Serum", time: "19 mins ago", price: 349, avatar: "👩‍🎨", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&q=80" },
  { id: 8, name: "Vikram Sen", city: "Kolkata", state: "WB", product: "Italian Leather Derby Shoes", time: "24 mins ago", price: 3389, avatar: "👨‍💼", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80" }
];

const LENS_SAMPLE_PRESETS = [
  { label: "Luxury Chrono Watch", category: "watch", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80", tag: "Timepieces & Luxury" },
  { label: "ANC Studio Headphones", category: "headphone", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80", tag: "Wireless Audio" },
  { label: "Ergonomic Office Chair", category: "chair", image: "https://images.unsplash.com/photo-1580481077197-25e985ba46a8?auto=format&fit=crop&w=400&q=80", tag: "Workplace Furniture" },
  { label: "Full-Grain Derby Shoes", category: "shoe", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80", tag: "Footwear & Leather" },
  { label: "Stainless Cookware Trio", category: "cookware", image: "https://images.unsplash.com/photo-1584990347449-397a6f235b2e?auto=format&fit=crop&w=400&q=80", tag: "Kitchen & Dining" },
  { label: "Nordic Ceramic Planter", category: "planter", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=80", tag: "Living Decor" }
];

function App() {
  const [products, setProducts] = useState(FEATURED_DEALS);
  const [filteredProducts, setFilteredProducts] = useState(FEATURED_DEALS);
  const [health, setHealth] = useState('Checking backend...');
  const [activeView, setActiveView] = useState('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState(['Electronics', 'Furniture', 'Travel']);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState('featured');
  const [currency, setCurrency] = useState('INR');
  const [soundEnabled, setSoundEnabled] = useState(true);
  globalCurrency = currency;
  
  // Real-World Pincode & Hyperlocal Logistics State
  const [deliveryPincode, setDeliveryPincode] = useState('600053');
  const [pincodeDetails, setPincodeDetails] = useState({
    city: 'Chennai',
    state: 'Tamil Nadu',
    tier: 1,
    same_day: true,
    estimated_days: 1,
    courier_partner: 'BlueDart Express Prime',
    fulfillment_hub: 'Amazon Chennai South FC',
    cod_available: true
  });
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('600053');
  const [deliveryLocation, setDeliveryLocation] = useState('Chennai 600053');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [tempPincode, setTempPincode] = useState('600053');

  // Real-Time Urgency & Social Proof State
  const [liveActivityIndex, setLiveActivityIndex] = useState(0);
  const [isActivityDismissed, setIsActivityDismissed] = useState(false);
  const [viewerCount, setViewerCount] = useState(18);
  const [cutoffCountdown, setCutoffCountdown] = useState({ hours: 3, minutes: 24, seconds: 15 });

  // Big Deal Lens (Visual Image Search) State
  const [isLensOpen, setIsLensOpen] = useState(false);
  const [lensSelectedImg, setLensSelectedImg] = useState(null);
  const [isLensScanning, setIsLensScanning] = useState(false);
  const [lensMatches, setLensMatches] = useState([]);
  const [lensDetectedTag, setLensDetectedTag] = useState('');

  // Historical Price Trend & Price Drop Alerts State
  const [priceHistoryRange, setPriceHistoryRange] = useState('90d');
  const [isPriceAlertOpen, setIsPriceAlertOpen] = useState(false);
  const [priceAlertEmail, setPriceAlertEmail] = useState('alex.rivera@example.com');
  const [priceAlertThreshold, setPriceAlertThreshold] = useState('');
  const [isPriceAlertSet, setIsPriceAlertSet] = useState(false);

  // Filter Facets
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [primeOnly, setPrimeOnly] = useState(false);

  // Cart & Wishlist State
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Modal State
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modalReviews, setModalReviews] = useState([]);
  const [newReviewForm, setNewReviewForm] = useState({ username: '', rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Auth State
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ name: '', email: 'demo@example.com', password: 'secret123' });
  const [accountSubTab, setAccountSubTab] = useState('orders');

  // Multi-step Checkout State
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingData, setShippingData] = useState({
    fullName: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    address: 'Flat 402, Anna Nagar 2nd Avenue',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zipCode: '600053',
    phone: '+91 98765 43210'
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    number: '4111 5678 9012 4242',
    name: 'ALEX RIVERA',
    expiry: '12/28',
    cvc: '888'
  });
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState(null);

  // Recently Viewed & Command Palette
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFlashBanner, setShowFlashBanner] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');

  // Flash Deals Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  // Toast System State
  const [toasts, setToasts] = useState([]);

  // Admin Authentication State (Product addition restricted to Admin only)
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('bigdeal_admin_token') || '');
  const [isLoggingInAdmin, setIsLoggingInAdmin] = useState(false);
  const [adminLoginForm, setAdminLoginForm] = useState({ username: 'admin', password: '' });

  // Add Product Modal & Catalog Management State
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    category: 'Electronics',
    customCategory: '',
    price: '',
    stock: 10,
    description: '',
    image_url: '',
    extraImages: ''
  });

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isSavingProductEdit, setIsSavingProductEdit] = useState(false);
  const [editProductForm, setEditProductForm] = useState({
    title: '',
    category: 'Electronics',
    customCategory: '',
    price: '',
    stock: 10,
    description: '',
    image_url: '',
    extraImages: ''
  });

  // Unified Admin Panel Workspaces State
  const [adminActiveTab, setAdminActiveTab] = useState('products');
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminPromos, setAdminPromos] = useState([]);
  const [adminStats, setAdminStats] = useState({
    total_products: 0,
    low_stock_count: 0,
    total_orders: 0,
    gross_revenue: 0,
    total_users: 0,
    active_promos: 0
  });
  const [adminCatalogFilter, setAdminCatalogFilter] = useState('all');
  const [adminCatalogSearch, setAdminCatalogSearch] = useState('');
  const [newPromoForm, setNewPromoForm] = useState({
    code: '',
    discount_type: 'percent',
    discount_value: '10'
  });
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);

  // 1. Dark/Light Theme Switcher State
  const [theme, setTheme] = useState(() => localStorage.getItem('bigdeal_theme') || 'light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bigdeal_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    showToast(`Switched to ${next === 'dark' ? 'Midnight Luxury Dark' : 'Classic Day'} Mode`, 'info');
    playAudioChime('click', soundEnabled);
  };

  // 2. Product Comparison Matrix State
  const [comparedProducts, setComparedProducts] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const toggleCompareProduct = (product) => {
    setComparedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed "${product.title.slice(0, 24)}..." from comparison`, 'info');
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        showToast('You can compare up to 4 products at a time', 'warning');
        return prev;
      }
      showToast(`Added "${product.title.slice(0, 24)}..." to comparison`, 'success');
      playAudioChime('click', soundEnabled);
      return [...prev, product];
    });
  };

  const clearCompareProducts = () => {
    setComparedProducts([]);
    setIsCompareModalOpen(false);
    showToast('Cleared product comparison list', 'info');
  };

  // 3. AI Shopping Assistant ("BigDeal Genius AI") State
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Hello! I'm **BigDeal Genius AI**, your personal shopping assistant. Ask me to find deals under your budget, compare specs, or recommend top-rated picks!",
      recommendations: []
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  const handleAiSend = (presetText = null) => {
    const query = (presetText || aiInput).trim();
    if (!query) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setAiMessages((prev) => [...prev, userMsg]);
    if (!presetText) setAiInput('');
    setIsAiTyping(true);
    playAudioChime('click', soundEnabled);

    setTimeout(() => {
      const q = query.toLowerCase();
      let matched = [];
      let botReply = "";

      const budgetMatch = q.match(/(?:under|below|less than|budget)\s*(?:₹|\$|inr)?\s*(\d+)/i);
      const budget = budgetMatch ? parseInt(budgetMatch[1], 10) : null;

      if (budget) {
        matched = products.filter((p) => p.price <= budget).slice(0, 3);
        if (matched.length > 0) {
          botReply = `Here are the best deals matching your budget under ${formatCurrency(budget)}:`;
        } else {
          matched = products.slice(0, 3);
          botReply = `I couldn't find items under ${formatCurrency(budget)}, but check out these value deals:`;
        }
      } else if (q.includes('headphone') || q.includes('audio') || q.includes('sound') || q.includes('speaker')) {
        matched = products.filter((p) => (p.category === 'Electronics') && (p.title.toLowerCase().includes('headphone') || p.title.toLowerCase().includes('sound') || p.title.toLowerCase().includes('speaker'))).slice(0, 3);
        if (matched.length === 0) matched = products.filter(p => p.category === 'Electronics').slice(0, 3);
        botReply = "Here are our top-rated wireless audio systems with active noise cancellation:";
      } else if (q.includes('watch') || q.includes('chrono') || q.includes('fitness')) {
        matched = products.filter((p) => p.title.toLowerCase().includes('watch') || p.title.toLowerCase().includes('chrono')).slice(0, 3);
        botReply = "Here are our precision analog luxury timepieces and smart fitness watches:";
      } else if (q.includes('chair') || q.includes('furniture') || q.includes('desk') || q.includes('decor')) {
        matched = products.filter((p) => p.category === 'Furniture').slice(0, 3);
        botReply = "Here are our highest-comfort ergonomic chairs and modern home furnishings:";
      } else if (q.includes('travel') || q.includes('luggage') || q.includes('shoe') || q.includes('bag')) {
        matched = products.filter((p) => p.category === 'Travel').slice(0, 3);
        botReply = "Here are top-tier durable travel gear, hardside spinners and premium footwear:";
      } else if (q.includes('best') || q.includes('top') || q.includes('deal') || q.includes('recommend') || q.includes('discount')) {
        matched = [...products].sort((a, b) => (b.average_rating || 4.5) - (a.average_rating || 4.5)).slice(0, 3);
        botReply = "Here are today's verified customer favorites with Prime 24-hour fast delivery:";
      } else {
        matched = products.filter((p) => p.title.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q))).slice(0, 3);
        if (matched.length === 0) matched = products.slice(0, 3);
        botReply = `Based on your interest in "${query}", I recommend these authentic items:`;
      }

      setAiMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botReply,
          recommendations: matched
        }
      ]);
      setIsAiTyping(false);
      playAudioChime('add', soundEnabled);
    }, 550);
  };

  // 4. Gamified Spin to Win Lucky Wheel State & Handlers
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wonReward, setWonReward] = useState(null);

  const WHEEL_PRIZES = [
    { text: "FLAT 25% OFF", code: "BIGDEAL25", discount: 25, color: "#ef4444" },
    { text: "₹500 CASHBACK", code: "CASH500", discount: 500, color: "#3b82f6" },
    { text: "FREE PRIME EXP", code: "FREESHIP", discount: 100, color: "#10b981" },
    { text: "MEGA 35% OFF", code: "MEGA35", discount: 35, color: "#8b5cf6" },
    { text: "LUCKY ₹200 OFF", code: "LUCKY200", discount: 200, color: "#f59e0b" },
    { text: "VIP PRIME PASS", code: "PRIME100", discount: 50, color: "#ec4899" }
  ];

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonReward(null);
    playAudioChime('click', soundEnabled);

    const prizeIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const segmentAngle = 360 / WHEEL_PRIZES.length;
    const extraTurns = 5 * 360;
    const targetAngle = extraTurns + (WHEEL_PRIZES.length - prizeIndex) * segmentAngle - (segmentAngle / 2);
    setWheelRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const reward = WHEEL_PRIZES[prizeIndex];
      setWonReward(reward);
      playAudioChime('add', soundEnabled);
      showToast(`🎉 You won ${reward.text}! Coupon ${reward.code} ready to apply.`, 'success');
    }, 4000);
  };

  const claimRewardPromo = () => {
    if (!wonReward) return;
    setAppliedPromo({
      code: wonReward.code,
      discount_type: wonReward.code.includes('CASH') || wonReward.code.includes('200') ? 'flat' : 'percent',
      discount_value: wonReward.discount,
      description: `${wonReward.text} (Lucky Spin Reward)`
    });
    showToast(`🎉 Coupon ${wonReward.code} applied to your cart!`, 'success');
    setIsSpinWheelOpen(false);
  };

  // 5. Voice Search State & Handlers
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  const handleVoiceSearchToggle = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      showToast('Voice search is not supported in this browser. Please type your search.', 'warning');
      return;
    }

    if (isListeningVoice) {
      setIsListeningVoice(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListeningVoice(true);
      showToast('🎙️ Listening... Speak your search query now', 'info');
      playAudioChime('click', soundEnabled);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListeningVoice(false);
        showToast(`Voice Search: "${transcript}"`, 'success');
        playAudioChime('add', soundEnabled);
      };

      recognition.onerror = (event) => {
        setIsListeningVoice(false);
        showToast('Could not detect voice: ' + (event.error || 'Please try again'), 'warning');
      };

      recognition.onend = () => {
        setIsListeningVoice(false);
      };

      recognition.start();
    } catch (err) {
      setIsListeningVoice(false);
      showToast('Could not start microphone listener', 'warning');
    }
  };

  // 6. Live Delivery Tracking Simulation State
  const [driverCalling, setDriverCalling] = useState(false);

  const handleCallDriver = () => {
    setDriverCalling(true);
    showToast('📞 Connecting to Delivery Executive Rajesh Kumar (+91 98401 22334)...', 'info');
    setTimeout(() => {
      setDriverCalling(false);
      showToast('Delivery Partner says: "I am 10 minutes away near your main gate!"', 'success');
    }, 2800);
  };

  // Phase 2: Feature 1 - 360 Turntable & AR Inspection
  const [turntableAngle, setTurntableAngle] = useState(0);
  const [isDraggingTurntable, setIsDraggingTurntable] = useState(false);
  const [turntableStartX, setTurntableStartX] = useState(0);
  const [arRoom, setArRoom] = useState('studio');
  const [is360Active, setIs360Active] = useState(false);

  const handleTurntableMouseDown = (e) => {
    setIsDraggingTurntable(true);
    setTurntableStartX(e.clientX || (e.touches && e.touches[0].clientX) || 0);
  };

  const handleTurntableMouseMove = (e) => {
    if (!isDraggingTurntable) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const delta = clientX - turntableStartX;
    setTurntableAngle((prev) => (prev + delta * 0.9) % 360);
    setTurntableStartX(clientX);
  };

  const handleTurntableMouseUp = () => {
    setIsDraggingTurntable(false);
  };

  // Phase 2: Feature 2 - Frequently Bought Together Bundle Builder
  const [bundleChecked, setBundleChecked] = useState({ main: true, item1: true, item2: true });

  // Phase 2: Feature 3 - Interactive EMI & BNPL Calculator
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
  const [selectedEmiBank, setSelectedEmiBank] = useState('HDFC');

  const EMI_BANK_PLANS = {
    'HDFC': [
      { months: 3, rate: 0, noCost: true },
      { months: 6, rate: 0, noCost: true },
      { months: 9, rate: 14, noCost: false },
      { months: 12, rate: 15, noCost: false }
    ],
    'ICICI': [
      { months: 3, rate: 0, noCost: true },
      { months: 6, rate: 0, noCost: true },
      { months: 9, rate: 13.5, noCost: false },
      { months: 12, rate: 14.5, noCost: false }
    ],
    'SBI': [
      { months: 3, rate: 0, noCost: true },
      { months: 6, rate: 13, noCost: false },
      { months: 9, rate: 14, noCost: false },
      { months: 12, rate: 15, noCost: false }
    ],
    'AXIS': [
      { months: 3, rate: 0, noCost: true },
      { months: 6, rate: 0, noCost: true },
      { months: 9, rate: 14, noCost: false },
      { months: 12, rate: 15.5, noCost: false }
    ],
    'AMAZON_PAY': [
      { months: 1, rate: 0, noCost: true },
      { months: 3, rate: 0, noCost: true },
      { months: 6, rate: 12, noCost: false }
    ]
  };

  // Phase 2: Feature 4 - Big Deal miniTV Live Video Showcase
  const [isMiniTvOpen, setIsMiniTvOpen] = useState(false);
  const [miniTvProduct, setMiniTvProduct] = useState(null);
  const [isPlayingMiniTv, setIsPlayingMiniTv] = useState(true);

  // Phase 2: Feature 5 - Printable GST Tax Invoice
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Interactive Image Zoom & Floating Dock States
  const [zoomState, setZoomState] = useState({ active: false, x: 50, y: 50 });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll listener for floating mini-dock
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 280);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live Dispatch Cutoff Countdown Timer (Daily 5:00 PM cutoff target)
  useEffect(() => {
    const calcCutoff = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(17, 0, 0, 0);
      if (now.getTime() >= target.getTime()) {
        target.setDate(target.getDate() + 1);
      }
      const diff = target.getTime() - now.getTime();
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCutoffCountdown({ hours, minutes, seconds });
    };
    calcCutoff();
    const timer = setInterval(calcCutoff, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-Time Social Proof Activity Feed Streamer (Rotates every 9s)
  useEffect(() => {
    const streamTimer = setInterval(() => {
      setLiveActivityIndex((prev) => (prev + 1) % LIVE_PURCHASE_STREAM.length);
    }, 9000);
    return () => clearInterval(streamTimer);
  }, []);

  // Hyperlocal Pincode Serviceability & Courier Estimator Handler
  const handleCheckPincode = async (targetPin = null, silent = false) => {
    const pin = String(targetPin || pincodeInput || '').trim();
    if (!pin || pin.length !== 6 || !/^\d+$/.test(pin)) {
      if (!silent) showToast('Please enter a valid 6-digit Indian postal PIN code (e.g. 600053, 560001)', 'warning');
      return;
    }
    setIsCheckingPincode(true);
    try {
      const res = await fetch(`/api/pincode/check/${pin}`);
      if (res.ok) {
        const data = await res.json();
        setPincodeDetails(data);
        setDeliveryPincode(pin);
        setPincodeInput(pin);
        setTempPincode(pin);
        setDeliveryLocation(`${data.city} ${pin}`);
        if (!silent) showToast(`📍 Delivery confirmed for ${data.city} via ${data.courier_partner}!`, 'success');
        playAudioChime('add', soundEnabled);
        return;
      }
    } catch (err) {
      // API fallback
    } finally {
      setIsCheckingPincode(false);
    }

    // Client-side fallback mapping
    const matchedCity = POPULAR_INDIAN_PINCODES.find(p => p.pincode === pin);
    const cityName = matchedCity ? matchedCity.city : `City Hub ${pin.slice(0, 3)}xxx`;
    const isTier1 = ['600', '560', '400', '110', '500', '700', '411'].some(prefix => pin.startsWith(prefix));
    const stateName = matchedCity ? matchedCity.state : 'India';
    const fallbackDetails = {
      serviceable: true,
      pincode: pin,
      city: cityName,
      state: stateName,
      tier: isTier1 ? 1 : 2,
      same_day: isTier1,
      estimated_days: isTier1 ? 1 : 2,
      courier_partner: isTier1 ? 'BlueDart Express Prime' : 'Delhivery Surface Express',
      fulfillment_hub: isTier1 ? `Amazon ${cityName} Prime FC` : 'Regional Logistics FC',
      cod_available: true,
      message: `Serviceable at ${cityName}, ${stateName}`
    };
    setPincodeDetails(fallbackDetails);
    setDeliveryPincode(pin);
    setPincodeInput(pin);
    setTempPincode(pin);
    setDeliveryLocation(`${cityName} ${pin}`);
    if (!silent) showToast(`📍 Delivery serviceable at ${cityName} ${pin}!`, 'success');
    playAudioChime('click', soundEnabled);
  };

  // Big Deal Lens Visual Scanner & Match Engine
  const handleRunLensSearch = (imageUrl, categoryKeyword = '') => {
    if (!imageUrl) return;
    setLensSelectedImg(imageUrl);
    setIsLensScanning(true);
    playAudioChime('click', soundEnabled);

    setTimeout(() => {
      setIsLensScanning(false);
      const combinedKey = (categoryKeyword || '').toLowerCase();
      let matched = [];
      let detected = "General Retail Item";

      if (combinedKey.includes('watch') || imageUrl.includes('watch') || imageUrl.includes('chrono')) {
        detected = "Precision Analog Timepieces & Smart Fitness Wearables";
        matched = products.filter(p => p.title.toLowerCase().includes('watch') || p.category === 'Electronics').slice(0, 4);
      } else if (combinedKey.includes('headphone') || imageUrl.includes('headphone') || imageUrl.includes('audio') || combinedKey.includes('earbud')) {
        detected = "Wireless Audio Acoustics • Active Noise Cancellation ANC";
        matched = products.filter(p => p.title.toLowerCase().includes('headphone') || p.title.toLowerCase().includes('earbud') || p.title.toLowerCase().includes('sound') || p.category === 'Electronics').slice(0, 4);
      } else if (combinedKey.includes('shoe') || imageUrl.includes('shoe') || imageUrl.includes('derby') || imageUrl.includes('footwear')) {
        detected = "Footwear & Athletic Shoes • Full-Grain / Breathable Stretch";
        matched = products.filter(p => p.title.toLowerCase().includes('shoe') || p.title.toLowerCase().includes('derby') || p.category === 'Travel').slice(0, 4);
      } else if (combinedKey.includes('chair') || imageUrl.includes('chair') || imageUrl.includes('furniture')) {
        detected = "Ergonomic Office Furniture • High-Back Lumbar Support";
        matched = products.filter(p => p.title.toLowerCase().includes('chair') || p.category === 'Furniture').slice(0, 4);
      } else if (combinedKey.includes('cookware') || imageUrl.includes('cookware') || imageUrl.includes('planter') || imageUrl.includes('lamp')) {
        detected = "Home Furnishings & Kitchen Living • Tri-Ply Stainless Steel";
        matched = products.filter(p => p.category === 'Furniture').slice(0, 4);
      } else {
        detected = "Catalog Showcase Item • High Similarity Visual Match";
        matched = products.slice(0, 4);
      }

      if (matched.length === 0) matched = products.slice(0, 4);

      const similarityScores = [98, 95, 91, 87];
      const enriched = matched.map((m, idx) => ({
        ...m,
        matchScore: similarityScores[idx] || 85,
        visualTags: idx === 0 ? 'Exact Visual Match' : idx === 1 ? 'Similar Silhouette & Color' : 'Related Style & Department'
      }));

      setLensMatches(enriched);
      setLensDetectedTag(detected);
      playAudioChime('add', soundEnabled);
      showToast(`🎯 Big Deal Lens found ${enriched.length} visually matching products!`, 'success');
    }, 1200);
  };

  // Price Drop Alert Tool Handler
  const handleSetPriceAlert = (e, product) => {
    if (e) e.preventDefault();
    if (!priceAlertEmail.trim()) {
      showToast('Please enter your email for price drop alerts', 'warning');
      return;
    }
    setIsPriceAlertSet(true);
    setIsPriceAlertOpen(false);
    playAudioChime('add', soundEnabled);
    const target = priceAlertThreshold ? formatCurrency(Number(priceAlertThreshold)) : formatCurrency(Math.round(product.price * 0.9));
    showToast(`🔔 Price Drop Alert activated! We'll email ${priceAlertEmail} when price drops below ${target}`, 'success');
  };

  const handleImageZoom = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomState({ active: true, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleImageZoomLeave = () => {
    setZoomState({ active: false, x: 50, y: 50 });
  };


  const PRODUCT_TEMPLATES = [
    {
      name: 'Wireless Headphones',
      icon: <Headphones size={15} style={{ verticalAlign: 'middle' }} />,
      title: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
      category: 'Electronics',
      price: 24999,
      stock: 15,
      description: 'Industry-leading noise canceling with two processors and 8 microphones. Up to 30-hour battery life with quick charging and crystal clear hands-free calling.',
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Smart Watch',
      icon: <Watch size={15} style={{ verticalAlign: 'middle' }} />,
      title: 'Apple Watch Series 9 GPS 45mm Midnight Aluminium',
      category: 'Electronics',
      price: 41900,
      stock: 8,
      description: 'Powerful health sensors including Blood Oxygen, ECG, and Temperature sensing. Fast charging and water resistant 50m with always-on Retina OLED display.',
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Ergo Chair',
      icon: <Armchair size={15} style={{ verticalAlign: 'middle' }} />,
      title: 'Ergonomic Mesh High-Back Executive Chair with Lumbar Support',
      category: 'Furniture',
      price: 14999,
      stock: 20,
      description: 'Breathable Korean mesh back, 3D adjustable armrests, heavy duty aluminum base and pneumatic seat height adjustment for all-day posture comfort.',
      image_url: 'https://images.unsplash.com/photo-1580481077197-25e985ba46a8?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Travel Luggage',
      icon: <Briefcase size={15} style={{ verticalAlign: 'middle' }} />,
      title: 'American Tourister Polycarbonate Hardside Spinner 75cm',
      category: 'Travel',
      price: 6499,
      stock: 12,
      description: 'Scratch-resistant polycarbonate shell, recessed TSA combination lock, 360-degree dual silent spinner wheels, expandable packing volume.',
      image_url: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Espresso Maker',
      icon: <Coffee size={15} style={{ verticalAlign: 'middle' }} />,
      title: "De'Longhi Dedica Deluxe Automatic Espresso & Cappuccino Machine",
      category: 'Furniture',
      price: 22490,
      stock: 10,
      description: '15-bar professional pump, stainless steel slim design, manual milk frother for rich creamy foam, customizable coffee temperature.',
      image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Running Shoes',
      icon: <Footprints size={15} style={{ verticalAlign: 'middle' }} />,
      title: 'Nike Air Zoom Pegasus 40 Running Shoes',
      category: 'Travel',
      price: 9995,
      stock: 25,
      description: 'Engineered mesh upper for breathability, dual Zoom Air units for responsive cushioning, durable waffle-inspired outsole for all-weather traction.',
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'
    }
  ];


  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Keyboard Shortcuts (Ctrl+K for Command Palette)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsAddProductModalOpen(false);
        setIsEditProductModalOpen(false);
        setIsLocationModalOpen(false);
        setIsCurrencyModalOpen(false);
        setActiveModalProduct(null);
        setActiveReceiptOrder(null);
        setIsCartOpen(false);
        setIsSideMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Flash deal countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch initial app data
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(data.message))
      .catch(() => setHealth('Backend offline'));

    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        const backendList = Array.isArray(data) ? data : [];
        const mergedMap = new Map();
        backendList.forEach((item) => mergedMap.set(item.id, item));
        FEATURED_DEALS.forEach((deal) => {
          if (!mergedMap.has(deal.id)) {
            mergedMap.set(deal.id, deal);
          }
        });
        const fullList = Array.from(mergedMap.values());
        setProducts(fullList);
        setFilteredProducts(fullList);
      })
      .catch(() => {
        setProducts(FEATURED_DEALS);
        setFilteredProducts(FEATURED_DEALS);
      });

    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        const catSet = new Set(Array.isArray(data) ? data : ['Electronics', 'Furniture', 'Travel']);
        FEATURED_DEALS.forEach(d => { if (d.category) catSet.add(d.category); });
        setCategories(Array.from(catSet));
      })
      .catch(() => setCategories(['Electronics', 'Furniture', 'Travel']));

    fetch('/api/price-range')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.min === 'number' && typeof data.max === 'number') {
          setPriceRange(data);
        }
      })
      .catch(() => {});

    try {
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlist(savedWishlist);
      const savedRecent = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
      setRecentlyViewed(savedRecent);
    } catch (e) {}
  }, []);

  // Filter & Search Logic
  useEffect(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const tokens = q.split(/\s+/).filter(Boolean);
      result = result.filter((p) => {
        const title = (p.title || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const full = `${title} ${desc} ${cat}`;
        return tokens.every((tok) => full.includes(tok));
      });
    }

    if (selectedCategory) {
      result = result.filter((p) => (p.category || '').toLowerCase() === selectedCategory.toLowerCase());
    }

    if (minPrice > 0) {
      result = result.filter((p) => (p.price || 0) >= minPrice);
    }
    if (maxPrice < 100000 && maxPrice > 0) {
      result = result.filter((p) => (p.price || 0) <= maxPrice);
    }

    if (minRatingFilter > 0) {
      result = result.filter((p) => (p.average_rating || 0) >= minRatingFilter);
    }

    if (inStockOnly) {
      result = result.filter((p) => (p.stock || 0) > 0);
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, minPrice, maxPrice, minRatingFilter, inStockOnly]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low-high') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high-low') return list.sort((a, b) => b.price - a.price);
    if (sortBy === 'top-rated') return list.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
    if (sortBy === 'alphabetical') return list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [filteredProducts, sortBy]);

  // Cart calculations
  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  const shippingCost = useMemo(() => {
    if (cartTotal === 0) return 0;
    if (shippingMethod === 'overnight') return 199;
    if (shippingMethod === 'express') return 99;
    return cartTotal >= 499 ? 0 : 40;
  }, [cartTotal, shippingMethod]);

  const addToCart = (product, qty = 1) => {
    if (!product) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    playAudioChime('add', soundEnabled);
    showToast(`Added "${product.title}" to your Shopping Cart`);
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      const next = exists ? prev.filter((item) => item.id !== product.id) : [...prev, product];
      localStorage.setItem('wishlist', JSON.stringify(next));
      showToast(exists ? `Removed "${product.title}" from Wish List` : `Added "${product.title}" to Wish List`);
      return next;
    });
  };

  // Robust Product Opener
  const openProductDetails = (productOrTitle) => {
    if (!productOrTitle) return;

    let target = null;
    if (typeof productOrTitle === 'object') {
      target = { ...productOrTitle };
    } else if (typeof productOrTitle === 'string') {
      const found = products.find(p => p.title.toLowerCase().includes(productOrTitle.toLowerCase())) ||
                    FEATURED_DEALS.find(p => p.title.toLowerCase().includes(productOrTitle.toLowerCase()));
      if (found) target = { ...found };
    }

    if (!target) {
      target = {
        id: Date.now(),
        title: typeof productOrTitle === 'string' ? productOrTitle : 'Big Deal Featured Product',
        category: 'Electronics',
        price: 999,
        description: 'Prime verified genuine Big Deal product with 1-year warranty, fast delivery, and premium build quality.',
        image_url: DEFAULT_PRODUCT_FALLBACK,
        stock: 10,
        average_rating: 4.8,
        reviews_count: 240,
        images: [{ id: 1, image_url: DEFAULT_PRODUCT_FALLBACK }]
      };
    }

    const smartFallback = getSmartProductFallback(target.title, target.category, target.image_url);
    const resolvedPrimary = autoResolveImageUrl(target.image_url, target.title, target.category) || smartFallback;
    target.image_url = resolvedPrimary;

    if (!target.images || target.images.length === 0) {
      target.images = [{ id: 0, image_url: resolvedPrimary }];
    } else {
      target.images = target.images.map((img, idx) => {
        if (typeof img === 'string') return { id: idx, image_url: autoResolveImageUrl(img, target.title, target.category) || resolvedPrimary };
        return { id: img.id || idx, image_url: autoResolveImageUrl(img.image_url, target.title, target.category) || resolvedPrimary };
      });
    }

    setActiveModalProduct(target);
    setSelectedImageIndex(0);
    setViewerCount(Math.floor(Math.random() * 16) + 14);
    setIsPriceAlertSet(false);
    setIsPriceAlertOpen(false);

    // Track recently viewed
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== target.id);
      const next = [target, ...filtered].slice(0, 10);
      localStorage.setItem('recently_viewed', JSON.stringify(next));
      return next;
    });

    // Load reviews
    if (target.id && target.id <= 100) {
      fetch(`/api/products/${target.id}/reviews`)
        .then((res) => res.json())
        .then((data) => setModalReviews(data && data.length > 0 ? data : [
          { id: 1, username: 'Vikram Sharma', rating: 5, comment: 'Exceptional build quality and sound clarity. Delivered in less than 24 hours with Prime!', created_at: new Date().toISOString() },
          { id: 2, username: 'Pooja Iyer', rating: 5, comment: 'Totally worth every rupee! Best deal on Big Deal.', created_at: new Date().toISOString() }
        ]))
        .catch(() => setModalReviews([
          { id: 1, username: 'Vikram Sharma', rating: 5, comment: 'Exceptional build quality and sound clarity. Delivered in less than 24 hours with Prime!', created_at: new Date().toISOString() }
        ]));
    } else {
      setModalReviews([
        { id: 1, username: 'Ananya Deshmukh', rating: 5, comment: 'High quality genuine product. The finish and materials feel extremely premium.', created_at: new Date().toISOString() },
        { id: 2, username: 'Rahul Verma', rating: 4, comment: 'Value for money deal. Packaging was secure and delivery was super fast.', created_at: new Date().toISOString() }
      ]);
    }
  };

  const handleApplyPromo = async (codeToUse) => {
    const code = (codeToUse || promoCodeInput).trim().toUpperCase();
    if (!code) return;
    try {
      const res = await fetch(`/api/promos/validate?code=${code}&cart_total=${cartTotal}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Invalid voucher code');
      setAppliedPromo(data);
      setPromoError('');
      showToast(`Voucher "${code}" applied! You saved ${formatCurrency(data.discount_amount)}`);
    } catch (e) {
      setPromoError(e.message);
      showToast(e.message, 'error');
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const q = searchQuery.trim();
    if (q) {
      showToast(`Showing results for "${q}"`);
    } else {
      showToast('Showing all products');
    }
  };

  const handleCreateReview = (e) => {
    e.preventDefault();
    if (!newReviewForm.comment.trim()) return;
    setIsSubmittingReview(true);
    setTimeout(() => {
      const newRev = {
        id: Date.now(),
        username: newReviewForm.username.trim() || 'Verified Buyer',
        rating: newReviewForm.rating,
        comment: newReviewForm.comment.trim(),
        created_at: new Date().toISOString()
      };
      setModalReviews((prev) => [newRev, ...prev]);
      setNewReviewForm({ username: '', rating: 5, comment: '' });
      setIsSubmittingReview(false);
      showToast('Thank you! Your verified review has been published.');
    }, 400);
  };

  // Multi-step Checkout Submission
  const handleCheckout = async (event) => {
    event.preventDefault();
    if (cart.length === 0) {
      showToast('Your shopping cart is empty!', 'error');
      return;
    }
    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: shippingData.fullName,
          customer_email: shippingData.email,
          items: cart,
          promo_code: appliedPromo ? appliedPromo.code : null,
          shipping_method: shippingMethod,
          shipping_cost: shippingCost
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Checkout process failed');

      const trackingNumber = `BD-IN-${Math.floor(100000 + Math.random() * 900000)}`;
      const estDelivery = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'short', month: 'short', day: 'numeric'
      });
      const finalTotal = (appliedPromo ? Math.max(0, cartTotal - appliedPromo.discount_amount) : cartTotal) + shippingCost;

      const orderReceipt = {
        order_id: data.order_id,
        tracking_number: trackingNumber,
        carrier: 'Big Deal Express Logistics (BD Logistics India)',
        est_delivery: estDelivery,
        customer_name: shippingData.fullName,
        customer_email: shippingData.email,
        shipping_address: `${shippingData.address}, ${shippingData.city}, ${shippingData.state} ${shippingData.zipCode}`,
        shipping_method: shippingMethod,
        shipping_cost: shippingCost,
        items: [...cart],
        subtotal: cartTotal,
        discount_amount: appliedPromo ? appliedPromo.discount_amount : 0,
        promo_code: appliedPromo ? appliedPromo.code : null,
        total: finalTotal,
        payment_method: paymentMethod === 'card' ? `Credit Card (•••• ${cardData.number.slice(-4)})` : paymentMethod === 'cod' ? 'Cash on Delivery / UPI Pay on Delivery' : 'Big Deal Pay / NetBanking',
        created_at: new Date().toISOString(),
        status: 'Placed'
      };

      setLastPlacedOrder(orderReceipt);
      setCheckoutStep(4);
      setCart([]);
      setAppliedPromo(null);
      setPromoCodeInput('');
      showToast(`Order #${data.order_id} placed successfully!`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Auth Submit
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Authentication failed');
      setUser(data.user);
      showToast(`Hello, ${data.user.name}! Signed in successfully.`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Admin Authentication Handlers
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoggingInAdmin(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: adminLoginForm.username.trim(),
          password: adminLoginForm.password.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Invalid admin credentials');
      
      localStorage.setItem('bigdeal_admin_token', data.token);
      setAdminToken(data.token);
      setAdminLoginForm({ username: 'admin', password: '' });
      showToast('Welcome back, Administrator! Operations console active.', 'success');
      playAudioChime('add', soundEnabled);
      fetchAdminData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoggingInAdmin(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('bigdeal_admin_token');
    setAdminToken('');
    showToast('Admin session logged out.', 'info');
  };

  const openAddProductModal = () => {
    if (!adminToken) {
      showToast('Admin authorization required to add products.', 'info');
      setActiveView('admin');
    } else {
      setIsAddProductModalOpen(true);
    }
  };

  // Add Product Action Handlers
  const applyProductTemplate = (tpl) => {
    setNewProductForm({
      title: tpl.title,
      category: tpl.category,
      customCategory: '',
      price: tpl.price,
      stock: tpl.stock,
      description: tpl.description,
      image_url: tpl.image_url,
      extraImages: ''
    });
    showToast(`Loaded "${tpl.name}" template details!`, 'info');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!adminToken) {
      showToast('Admin authorization required to add products.', 'error');
      setActiveView('admin');
      return;
    }

    const categoryFinal = (newProductForm.category === '__custom__' ? newProductForm.customCategory : newProductForm.category).trim();
    if (!newProductForm.title.trim()) {
      showToast('Please enter a product title', 'error');
      return;
    }
    if (!categoryFinal) {
      showToast('Please select or specify a category', 'error');
      return;
    }
    if (!newProductForm.price || isNaN(parseFloat(newProductForm.price))) {
      showToast('Please enter a valid price', 'error');
      return;
    }
    if (!newProductForm.description.trim()) {
      showToast('Please provide a product description', 'error');
      return;
    }

    const extraImgs = newProductForm.extraImages
      ? newProductForm.extraImages.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];

    const primaryImg = autoResolveImageUrl(newProductForm.image_url) || getSmartProductFallback(newProductForm.title, categoryFinal);
    const resolvedGallery = [primaryImg, ...extraImgs.map(autoResolveImageUrl)].filter(Boolean);

    setIsSubmittingProduct(true);
    try {
      const payload = {
        title: newProductForm.title.trim(),
        category: categoryFinal,
        price: parseFloat(newProductForm.price),
        stock: parseInt(newProductForm.stock, 10) || 10,
        description: newProductForm.description.trim(),
        image_url: primaryImg,
        images: resolvedGallery
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      const createdProduct = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setAdminToken('');
          localStorage.removeItem('bigdeal_admin_token');
          setActiveView('admin');
        }
        throw new Error(createdProduct.detail || 'Failed to add product');
      }

      // Prepend newly created product to state so it immediately appears in store & admin
      setProducts((prev) => [createdProduct, ...prev.filter((p) => p.id !== createdProduct.id)]);
      setFilteredProducts((prev) => [createdProduct, ...prev.filter((p) => p.id !== createdProduct.id)]);
      setCategories((prev) => Array.from(new Set([...prev, categoryFinal])));
      setIsAddProductModalOpen(false);
      showToast(`"${createdProduct.title}" added to store catalog!`, 'success');
      playAudioChime('add', soundEnabled);

      // Reset form
      setNewProductForm({
        title: '',
        category: 'Electronics',
        customCategory: '',
        price: '',
        stock: 10,
        description: '',
        image_url: '',
        extraImages: ''
      });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId, title) => {
    if (!adminToken) {
      showToast('Admin authorization required to delete products.', 'error');
      setActiveView('admin');
      return;
    }

    if (!window.confirm(`Are you sure you want to remove "${title}" from the catalog?`)) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setAdminToken('');
          localStorage.removeItem('bigdeal_admin_token');
          setActiveView('admin');
        }
        throw new Error(data.detail || 'Failed to delete product');
      }

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setFilteredProducts((prev) => prev.filter((p) => p.id !== productId));
      setCart((prev) => prev.filter((item) => item.id !== productId));
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
      showToast(`"${title}" removed from catalog.`, 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Open Edit Product Modal
  const openEditProductModal = (product) => {
    if (!adminToken) {
      showToast('Only Admin can modify products. Please sign in to Admin Panel.', 'info');
      setActiveView('admin');
      return;
    }

    const isExistingCat = categories.includes(product.category) || ['Electronics', 'Furniture', 'Travel', 'Fashion', 'Beauty', 'Sports', 'Books'].includes(product.category);
    const extraUrls = (product.images || [])
      .map((img) => (typeof img === 'string' ? img : img.image_url))
      .filter((u) => u && u !== product.image_url)
      .join('\n');

    setEditProductForm({
      title: product.title || '',
      category: isExistingCat ? product.category : '__custom__',
      customCategory: isExistingCat ? '' : product.category,
      price: product.price !== undefined ? String(product.price) : '',
      stock: product.stock !== undefined ? product.stock : 10,
      description: product.description || '',
      image_url: product.image_url || '',
      extraImages: extraUrls
    });
    setEditingProduct(product);
    setIsEditProductModalOpen(true);
  };

  // Handle Save Product Edit
  const handleSaveProductEdit = async (e) => {
    e.preventDefault();
    if (!adminToken) {
      showToast('Admin authorization required to modify products.', 'error');
      setActiveView('admin');
      return;
    }
    if (!editingProduct) return;

    const categoryFinal = (editProductForm.category === '__custom__' ? editProductForm.customCategory : editProductForm.category).trim();
    if (!editProductForm.title.trim()) {
      showToast('Please enter a product title', 'error');
      return;
    }
    if (!categoryFinal) {
      showToast('Please select or specify a category', 'error');
      return;
    }
    if (!editProductForm.price || isNaN(parseFloat(editProductForm.price))) {
      showToast('Please enter a valid price', 'error');
      return;
    }
    if (!editProductForm.description.trim()) {
      showToast('Please provide a product description', 'error');
      return;
    }

    const extraImgs = editProductForm.extraImages
      ? editProductForm.extraImages.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];

    const primaryImg = autoResolveImageUrl(editProductForm.image_url) || editingProduct.image_url || getSmartProductFallback(editProductForm.title, categoryFinal);
    const resolvedGallery = [primaryImg, ...extraImgs.map(autoResolveImageUrl)].filter(Boolean);

    setIsSavingProductEdit(true);
    try {
      const payload = {
        title: editProductForm.title.trim(),
        category: categoryFinal,
        price: parseFloat(editProductForm.price),
        stock: parseInt(editProductForm.stock, 10) || 10,
        description: editProductForm.description.trim(),
        image_url: primaryImg,
        images: resolvedGallery
      };

      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      const updatedProduct = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setAdminToken('');
          localStorage.removeItem('bigdeal_admin_token');
          setActiveView('admin');
        }
        throw new Error(updatedProduct.detail || 'Failed to update product');
      }

      // Update in state
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...updatedProduct } : p)));
      setFilteredProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...updatedProduct } : p)));
      setCategories((prev) => Array.from(new Set([...prev, categoryFinal])));
      
      // Update cart and wishlist if item present
      setCart((prev) => prev.map((it) => (it.id === editingProduct.id ? { ...it, title: updatedProduct.title, price: updatedProduct.price, image_url: updatedProduct.image_url } : it)));
      setWishlist((prev) => prev.map((it) => (it.id === editingProduct.id ? { ...it, title: updatedProduct.title, price: updatedProduct.price, image_url: updatedProduct.image_url } : it)));

      setIsEditProductModalOpen(false);
      setEditingProduct(null);
      showToast(`"${updatedProduct.title}" updated successfully!`, 'success');
      playAudioChime('add', soundEnabled);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSavingProductEdit(false);
    }
  };

  // Unified Admin Data Fetcher
  const fetchAdminData = async () => {
    if (!adminToken) return;
    const headers = {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    };

    try {
      const [statsRes, ordersRes, usersRes, promosRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }).then((r) => (r.ok ? r.json() : null)),
        fetch('/api/admin/orders', { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch('/api/admin/users', { headers }).then((r) => (r.ok ? r.json() : [])),
        fetch('/api/admin/promos', { headers }).then((r) => (r.ok ? r.json() : []))
      ]);

      if (statsRes) setAdminStats(statsRes);
      if (Array.isArray(ordersRes)) setAdminOrders(ordersRes);
      if (Array.isArray(usersRes)) setAdminUsers(usersRes);
      if (Array.isArray(promosRes)) setAdminPromos(promosRes);
    } catch (e) {
      console.error('Failed to load admin telemetry', e);
    }
  };

  useEffect(() => {
    if (activeView === 'admin' && adminToken) {
      fetchAdminData();
    }
  }, [activeView, adminToken]);

  // Order Status Updater
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (!adminToken) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to update order status');

      setAdminOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      showToast(`Order #${orderId} status set to "${newStatus}"!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Promo Code Creator
  const handleCreatePromo = async (e) => {
    e.preventDefault();
    if (!adminToken) return;
    if (!newPromoForm.code.trim()) {
      showToast('Please enter a promo code name', 'error');
      return;
    }
    setIsCreatingPromo(true);
    try {
      const res = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: newPromoForm.code.trim().toUpperCase(),
          discount_type: newPromoForm.discount_type,
          discount_value: parseFloat(newPromoForm.discount_value) || 10,
          active: true
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to create promo code');

      setAdminPromos((prev) => [data.promo, ...prev.filter((p) => p.code !== data.promo.code)]);
      setNewPromoForm({ code: '', discount_type: 'percent', discount_value: '10' });
      showToast(`Promo code "${data.promo.code}" created!`, 'success');
      playAudioChime('add', soundEnabled);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsCreatingPromo(false);
    }
  };

  // Delete Promo Code
  const handleDeletePromo = async (code) => {
    if (!adminToken) return;
    if (!window.confirm(`Are you sure you want to remove promo code "${code}"?`)) return;
    try {
      const res = await fetch(`/api/admin/promos/${code}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete promo code');
      setAdminPromos((prev) => prev.filter((p) => p.code !== code));
      showToast(`Deleted promo code "${code}".`, 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Quick Inline Stock Adjustment
  const handleQuickStockChange = async (product, delta) => {
    if (!adminToken) return;
    const nextStock = Math.max(0, (product.stock || 10) + delta);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: product.title,
          category: product.category,
          price: product.price,
          description: product.description,
          image_url: product.image_url,
          stock: nextStock
        })
      });
      const updated = await res.json();
      if (res.ok) {
        setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, stock: nextStock } : p)));
        setFilteredProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, stock: nextStock } : p)));
        showToast(`Updated stock for "${product.title}" to ${nextStock} units.`, 'info');
      }
    } catch (e) {
      console.error(e);
    }
  };





  // Search auto-suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products
      .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())))
      .slice(0, 6);
  }, [products, searchQuery]);

  return (
    <div className="app-shell">
      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
              {t.type === 'success' && <CheckCircle2 size={16} color="#007600" />}
              {t.type === 'error' && <AlertCircle size={16} color="#cc0c39" />}
              {t.type === 'info' && <Info size={16} color="#007185" />}
            </span>
            <span className="toast-message">{t.message}</span>
          </div>
        ))}
      </div>

      {/* Top Flash Ticker Banner */}
      {showFlashBanner && (
        <div className="flash-deals-banner">
          <div className="flash-banner-inner">
            <div className="flash-tag">
              <Sparkles size={14} style={{ verticalAlign: 'middle' }} />
              <strong>GREAT INDIAN FESTIVAL</strong>
            </div>
            <p className="flash-text">
              Mega Deals on Mobiles, Laptops, Home & Fashion • Extra <strong>10% Instant Discount</strong> on Bank Cards!
            </p>
            <div className="flash-countdown-box">
              <span>Deals end in:</span>
              <div className="countdown-digits">
                <span>{String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
            <button 
              type="button" 
              className="flash-action-btn"
              onClick={() => {
                handleApplyPromo('WELCOME10');
                setIsCartOpen(true);
              }}
            >
              Apply WELCOME10 (-10%)
            </button>
            <button 
              type="button" 
              className="flash-close-btn" 
              onClick={() => setShowFlashBanner(false)}
              title="Close Banner"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* PRIMARY AMAZON TOP HEADER (DARK NAVY #131921) */}
      <header className="amazon-header">
        <div className="amazon-nav-top">
          {/* Logo with Amazon style curved smile */}
          <div className="nav-box-hover amazon-logo-wrap" onClick={() => { setActiveView('shop'); setSelectedCategory(''); }}>
            <div className="amazon-logo-brand">
              <span>bigdeal<span className="domain">.in</span></span>
              <span className="amazon-smile-arrow"></span>
            </div>
          </div>

          {/* Delivery Location Selector */}
          <div className="nav-box-hover nav-location-btn" onClick={() => setIsLocationModalOpen(true)}>
            <span className="nav-location-pin" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <MapPin size={15} />
            </span>
            <div className="nav-location-text">
              <span className="nav-location-line1">Delivering to {deliveryLocation}</span>
              <span className="nav-location-line2">Update location</span>
            </div>
          </div>

          {/* Amazon Integrated Search Bar */}
          <form className="amazon-search-bar" onSubmit={handleSearchSubmit}>
            <select 
              className="search-category-dropdown"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className="search-input-wrap">
              <input 
                type="text" 
                className="amazon-search-input"
                placeholder={isListeningVoice ? "Listening... speak now" : "Search Big Deal.in (e.g. Sony headphones, watch)"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
              />

              {/* Voice Search Microphone Trigger */}
              <button 
                type="button" 
                className={`voice-search-btn ${isListeningVoice ? 'listening' : ''}`} 
                onClick={handleVoiceSearchToggle}
                title={isListeningVoice ? "Stop voice listening" : "Search with Voice"}
              >
                {isListeningVoice ? <MicOff size={17} color="#ef4444" /> : <Mic size={17} />}
              </button>

              {/* Big Deal Lens Visual Search Trigger */}
              <button 
                type="button" 
                className="lens-search-btn" 
                onClick={() => {
                  setIsLensOpen(true);
                  playAudioChime('click', soundEnabled);
                }}
                title="Search with Big Deal Lens (Visual Image Search)"
              >
                <Camera size={17} />
              </button>

              {searchQuery && (
                <button type="button" className="search-clear-btn" onClick={() => setSearchQuery('')} title="Clear search">
                  <X size={14} />
                </button>
              )}

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="amazon-suggestions-list">
                  {/* Trending Search Chips Header */}
                  <div className="search-trending-section">
                    <span className="search-trending-title">
                      <Flame size={13} color="#f08804" style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      Popular Searches & Departments
                    </span>
                    <div className="search-trending-chips">
                      {[
                        { label: 'Sony Headphones', cat: 'Electronics' },
                        { label: 'Apple Watch', cat: 'Electronics' },
                        { label: 'Ergo Chair', cat: 'Furniture' },
                        { label: 'Travel Luggage', cat: 'Travel' },
                        { label: 'Espresso Maker', cat: 'Furniture' },
                        { label: 'Running Shoes', cat: 'Travel' }
                      ].map((chip) => (
                        <button
                          key={chip.label}
                          type="button"
                          className="search-trending-chip"
                          onMouseDown={() => {
                            setSearchQuery(chip.label);
                            setSelectedCategory(chip.cat);
                            setShowSuggestions(false);
                          }}
                        >
                          <Search size={11} color="#007185" style={{ marginRight: 4 }} />
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {searchSuggestions.length > 0 && (
                    <ul className="suggestions-items-ul">
                      {searchSuggestions.map((item) => (
                        <li 
                          key={item.id} 
                          className="amazon-suggestion-item"
                          onMouseDown={() => {
                            openProductDetails(item);
                            setSearchQuery('');
                            setShowSuggestions(false);
                          }}
                        >
                          <img src={item.image_url} alt={item.title} className="suggestion-thumb" />
                          <div className="suggestion-text-wrap">
                            <span className="suggestion-title">{item.title}</span>
                            <span className="suggestion-sub">in {item.category}</span>
                          </div>
                          <span className="suggestion-price">{formatCurrency(item.price)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="search-submit-btn" 
              title="Search"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Search size={18} />
            </button>
          </form>

          {/* Theme Switcher */}
          <div 
            className="nav-box-hover nav-theme-btn" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Midnight Luxury Dark' : 'Classic Day'} Mode`}
          >
            {theme === 'light' ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Moon size={15} />
                <span className="nav-theme-label">Dark</span>
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#febd69' }}>
                <Sun size={15} />
                <span className="nav-theme-label">Light</span>
              </span>
            )}
          </div>

          {/* Language / Flag Switcher */}
          <div 
            className="nav-box-hover nav-lang-btn" 
            title="Change Currency / Language"
            onClick={() => setIsCurrencyModalOpen(true)}
          >
            <span className="nav-flag-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Globe size={15} />
            </span>
            <span>{currency}</span>
            <span className="nav-dropdown-arrow">▼</span>
          </div>

          {/* Account & Lists */}
          <div 
            className="nav-box-hover nav-account-btn" 
            onClick={() => setActiveView('account')}
          >
            <span className="nav-account-line1">
              {user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}
            </span>
            <span className="nav-account-line2">
              Account & Lists <span className="nav-dropdown-arrow">▼</span>
            </span>
          </div>

          {/* Returns & Orders */}
          <div 
            className="nav-box-hover nav-orders-btn" 
            onClick={() => {
              setActiveView('account');
              setAccountSubTab('orders');
            }}
          >
            <span className="nav-orders-line1">Returns</span>
            <span className="nav-orders-line2">& Orders</span>
          </div>

          {/* Shopping Cart */}
          <div 
            className="nav-box-hover nav-cart-btn" 
            onClick={() => {
              setIsCartOpen(true);
              playAudioChime('click', soundEnabled);
            }}
          >
            <div className="cart-icon-container" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <ShoppingCart size={22} />
              <span className="cart-badge-count">{cartCount}</span>
            </div>
            <span className="nav-cart-label">Cart</span>
          </div>
        </div>

        {/* SECONDARY SUB-NAVBAR (DARK SLATE #232f3e) */}
        <div className="amazon-subnav">
          <div className="subnav-left-links">
            <button 
              type="button" 
              className="subnav-hamburger-btn"
              onClick={() => setIsSideMenuOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Menu size={16} />
              <strong>All</strong>
            </button>
            <button 
              type="button" 
              className="subnav-link subnav-spin-pill" 
              onClick={() => setIsSpinWheelOpen(true)}
              title="Spin the Lucky Wheel for instant promo codes!"
            >
              <PartyPopper size={14} />
              <span>Spin & Win</span>
            </button>
            <button 
              type="button" 
              className="subnav-link" 
              style={{ color: '#60a5fa', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              onClick={() => setIsAIOpen(true)}
              title="Chat with BigDeal Genius AI Shopping Assistant"
            >
              <Bot size={15} />
              <span>Genius AI</span>
            </button>
            <button 
              type="button" 
              className="subnav-link" 
              style={{ color: '#f472b6', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              onClick={() => {
                setMiniTvProduct(products[0]);
                setIsMiniTvOpen(true);
                playAudioChime('click', soundEnabled);
              }}
              title="Watch Big Deal miniTV interactive video product showcases"
            >
              <Tv size={15} />
              <span>miniTV Live</span>
            </button>
            <button type="button" className="subnav-link" onClick={() => { setActiveView('shop'); setSelectedCategory('Electronics'); }}>
              Mobiles
            </button>
            <button type="button" className="subnav-link" onClick={() => { setActiveView('shop'); setSelectedCategory('Electronics'); }}>
              Electronics
            </button>
            <button type="button" className="subnav-link" onClick={() => { setActiveView('shop'); setSelectedCategory('Furniture'); }}>
              Home & Kitchen
            </button>
            <button type="button" className="subnav-link" onClick={() => { setActiveView('shop'); setSelectedCategory('Travel'); }}>
              Travel & Luggage
            </button>
            <button type="button" className="subnav-link" onClick={() => { setActiveView('shop'); setMinRatingFilter(4); }}>
              Bestsellers
            </button>
            <button type="button" className="subnav-link" onClick={() => {
              const el = document.getElementById('todays-deals-rail');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Today's Deals
            </button>
            <button type="button" className="subnav-link" onClick={() => setActiveView('account')}>
              Customer Service
            </button>
            <button 
              type="button" 
              className={`subnav-link ${activeView === 'admin' ? 'active' : ''}`} 
              onClick={() => setActiveView('admin')}
              style={adminToken ? { color: '#febd69', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' } : { display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <ShieldCheck size={14} /> Admin Workspace {adminToken && <span style={{ fontSize: '0.72rem', background: '#007600', color: '#fff', padding: '1px 6px', borderRadius: '10px', marginLeft: '4px' }}>Active</span>}
            </button>
          </div>

          <div 
            className="subnav-promo-banner" 
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setPrimeOnly(true);
              setActiveView('shop');
              showToast('Big Deal Prime filter applied! Free Express Delivery enabled.', 'info');
              playAudioChime('click', soundEnabled);
            }}
            title="Click to view Big Deal Prime exclusive deals"
          >
            <span className="prime-promo-tag">THE REVOLUTIONARIES</span>
            <span>|</span>
            <span className="prime-promo-sub">Join Prime Lite at ₹67/month*</span>
          </div>
        </div>
      </header>

      {/* SIDEBAR HAMBURGER MENU DRAWER */}
      {isSideMenuOpen && (
        <div className="side-drawer-backdrop" onClick={() => setIsSideMenuOpen(false)}>
          <div className="side-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="side-drawer-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={22} />
              <span>{user ? `Hello, ${user.name}` : 'Hello, Sign in'}</span>
            </div>

            <div className="side-drawer-section">
              <div className="side-drawer-section-title">Trending</div>
              <div className="side-drawer-item" onClick={() => { setActiveView('shop'); setIsSideMenuOpen(false); }}>
                <span>Bestsellers</span>
                <span>›</span>
              </div>
              <div className="side-drawer-item" onClick={() => { setActiveView('shop'); setIsSideMenuOpen(false); }}>
                <span>New Releases</span>
                <span>›</span>
              </div>
              <div className="side-drawer-item" onClick={() => { setActiveView('shop'); setIsSideMenuOpen(false); }}>
                <span>Movers and Shakers</span>
                <span>›</span>
              </div>
            </div>

            <div className="side-drawer-section">
              <div className="side-drawer-section-title">Shop by Category</div>
              {categories.map((cat) => (
                <div 
                  key={cat} 
                  className="side-drawer-item"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setActiveView('shop');
                    setIsSideMenuOpen(false);
                  }}
                >
                  <span>{cat}</span>
                  <span>›</span>
                </div>
              ))}
            </div>

            <div className="side-drawer-section">
              <div className="side-drawer-section-title">Programs & Features</div>
              <div className="side-drawer-item" onClick={() => { setActiveView('account'); setIsSideMenuOpen(false); }}>
                <span>Your Account & Orders</span>
                <span>›</span>
              </div>
              <div className="side-drawer-item" onClick={() => { setActiveView('admin'); setIsSideMenuOpen(false); }}>
                <span>Admin Operations Center</span>
                <span>›</span>
              </div>
              <div className="side-drawer-item" onClick={() => { setIsCartOpen(true); setIsSideMenuOpen(false); }}>
                <span>Shopping Cart ({cartCount})</span>
                <span>›</span>
              </div>
            </div>
          </div>
          <button type="button" className="side-drawer-close-btn" onClick={() => setIsSideMenuOpen(false)} title="Close Menu">
            <X size={20} />
          </button>
        </div>
      )}

      {/* MAIN BODY CONTENT CONTAINER */}
      <main className="main-content">
        {activeView === 'shop' && (
          <>
            {/* Show Hero Showcase & Deal Rails ONLY on homepage (when NOT actively searching) */}
            {!searchQuery.trim() && (
              <>
                {/* HERO SHOWCASE TOP ROW (MATCHING SCREENSHOT 1) */}
            <div className="amazon-hero-container">
              <div className="hero-cards-grid">
                
                {/* 1) Everything under ₹499 (Orange Card) */}
                <div className="amazon-deal-card card-orange-feature">
                  <div>
                    <h3 className="deal-card-title">Everything under ₹499</h3>
                    <p className="deal-card-subtitle">Fashion, home & more</p>
                    <div className="orange-badges-row">
                      <span className="orange-badge-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Truck size={13} /> Free Delivery
                      </span>
                      <span className="orange-badge-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <RotateCcw size={13} /> Quick Refunds
                      </span>
                    </div>

                    <div className="orange-tiles-grid">
                      {[
                        { name: 'Watches', img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=300&q=80', deal: FEATURED_DEALS[0] },
                        { name: 'Jackets', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=300&q=80', deal: { title: 'Windproof Thermal Winter Jacket', price: 499, category: 'Travel', image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80' } },
                        { name: 'Cookware', img: 'https://images.unsplash.com/photo-1584990347449-397a6f235b2e?auto=format&fit=crop&w=300&q=80', deal: FEATURED_DEALS[9] },
                        { name: 'Handbags', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80', deal: { title: 'Designer Vegan Leather Tote Bag', price: 489, category: 'Travel', image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80' } },
                        { name: 'Gadgets', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80', deal: FEATURED_DEALS[8] },
                        { name: 'Lamps', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=300&q=80', deal: { title: 'Nordic Wooden Ambient Table Lamp', price: 399, category: 'Furniture', image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80' } },
                        { name: 'Jerseys', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=300&q=80', deal: { title: 'Breathable Dry-Fit Sports Jersey', price: 299, category: 'Travel', image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80' } },
                        { name: 'Skincare', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&q=80', deal: { title: 'Organic Vitamin C Radiant Face Serum', price: 349, category: 'Travel', image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80' } },
                        { name: 'Essentials', img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80', deal: { title: 'Fast Charging Braided USB-C Cable (2m)', price: 199, category: 'Electronics', image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80' } }
                      ].map((tile, i) => (
                        <div key={i} className="orange-tile-item" onClick={() => openProductDetails(tile.deal)}>
                          <img src={tile.img} alt={tile.name} className="orange-tile-img" />
                          <div className="orange-tile-label">{tile.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="deal-card-footer-link" style={{ color: '#ffffff', cursor: 'pointer' }} onClick={() => openProductDetails(FEATURED_DEALS[0])}>
                    See all offers ›
                  </span>
                </div>

                {/* 2) Pots & planters (Large Image Banner Card) */}
                <div className="amazon-deal-card">
                  <div>
                    <h3 className="deal-card-title">Up to 70% off | Pots & planters</h3>
                    <p className="deal-card-subtitle">Give your plants a stylish home</p>
                    <div className="card-large-image-wrap" onClick={() => openProductDetails(FEATURED_DEALS[1])}>
                      <img 
                        src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80" 
                        alt="Pots and Planters" 
                        className="card-large-image" 
                      />
                      <div className="bank-discount-sticker">
                        <CreditCard size={14} />
                        <span className="bank-tag-text">10% Instant Discount* On Credit Card EMI</span>
                      </div>
                    </div>
                  </div>
                  <span className="deal-card-footer-link" style={{ cursor: 'pointer' }} onClick={() => openProductDetails(FEATURED_DEALS[1])}>
                    See more
                  </span>
                </div>

                {/* 3) 3 Months FREE Amazon Music Unlimited (Dark Card) */}
                <div className="amazon-deal-card card-dark-feature">
                  <div className="dark-feature-content">
                    <div>
                      <h3 className="deal-card-title">3 months FREE</h3>
                      <p className="deal-card-subtitle" style={{ color: '#cccccc' }}>Unlimited music, ad-free</p>
                      <div className="dark-feature-bg-graphic" onClick={() => openProductDetails(FEATURED_DEALS[6])}>
                        <Headphones size={36} color="#00a8e1" />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>bigdeal music Unlimited</div>
                      <span style={{ fontSize: '0.72rem', color: '#888888' }}>*Terms apply. Renews automatically.</span>
                    </div>
                  </div>
                  <span className="deal-card-footer-link" style={{ color: '#00a8e1', cursor: 'pointer' }} onClick={() => openProductDetails(FEATURED_DEALS[6])}>
                    Try now for free ›
                  </span>
                </div>

                {/* 4) Under ₹499 Deals on Eye Makeup */}
                <div className="amazon-deal-card">
                  <div>
                    <h3 className="deal-card-title">Under ₹499</h3>
                    <p className="deal-card-subtitle">Deals on beauty & cosmetics</p>
                    <div className="card-large-image-wrap" onClick={() => openProductDetails({ title: 'Luxury Eye Shadow & Velvet Lipstick Palette', price: 449, category: 'Travel', image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80', description: 'Long-lasting smudge-proof matte pigment colors for party and everyday styling.' })}>
                      <img 
                        src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80" 
                        alt="Deals on Makeup" 
                        className="card-large-image" 
                      />
                      <div className="bank-discount-sticker">
                        <Tag size={14} />
                        <span className="bank-tag-text">Unlimited 5%* cashback with ICICI Bank Card</span>
                      </div>
                    </div>
                  </div>
                  <span className="deal-card-footer-link" style={{ cursor: 'pointer' }} onClick={() => openProductDetails({ title: 'Luxury Eye Shadow & Velvet Lipstick Palette', price: 449, category: 'Travel', image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80' })}>
                    See all offers
                  </span>
                </div>

                {/* 5) Shop popular deals (4-Grid with exact prices) */}
                <div className="amazon-deal-card">
                  <div>
                    <h3 className="deal-card-title">
                      Shop popular deals
                      <span className="chevron-link">›</span>
                    </h3>
                    <div className="deal-2x2-grid">
                      <div className="deal-2x2-tile" onClick={() => openProductDetails(FEATURED_DEALS[2])}>
                        <div className="tile-img-container">
                          <img src={FEATURED_DEALS[2].image_url} alt="Vacuum" className="tile-img" />
                        </div>
                        <div className="tile-price-text">₹2,199.00</div>
                        <span className="tile-discount-tag">Save 35%</span>
                      </div>
                      <div className="deal-2x2-tile" onClick={() => openProductDetails(FEATURED_DEALS[3])}>
                        <div className="tile-img-container">
                          <img src={FEATURED_DEALS[3].image_url} alt="Bedsheet" className="tile-img" />
                        </div>
                        <div className="tile-price-text">₹489.00</div>
                        <span className="tile-discount-tag">Save 50%</span>
                      </div>
                      <div className="deal-2x2-tile" onClick={() => openProductDetails(FEATURED_DEALS[4])}>
                        <div className="tile-img-container">
                          <img src={FEATURED_DEALS[4].image_url} alt="Tool" className="tile-img" />
                        </div>
                        <div className="tile-price-text">₹1,489.00</div>
                        <span className="tile-discount-tag">Save 28%</span>
                      </div>
                      <div className="deal-2x2-tile" onClick={() => openProductDetails(FEATURED_DEALS[5])}>
                        <div className="tile-img-container">
                          <img src={FEATURED_DEALS[5].image_url} alt="Shoes" className="tile-img" />
                        </div>
                        <div className="tile-price-text">₹3,389.00</div>
                        <span className="tile-discount-tag">Save 40%</span>
                      </div>
                    </div>
                  </div>
                  <span className="deal-card-footer-link" style={{ cursor: 'pointer' }} onClick={() => openProductDetails(FEATURED_DEALS[2])}>
                    Explore all deals
                  </span>
                </div>

              </div>
            </div>

            {/* 4-COLUMN MULTI-GRID SECTIONS (MATCHING SCREENSHOT 2) */}
            <div className="amazon-sections-stack">
              {/* Row 1 */}
              <div className="deal-quad-grid">
                
                {/* Quad 1: Buy office electronics */}
                <div className="amazon-deal-card">
                  <div>
                    <h3 className="deal-card-title">Buy office electronics at wholesale prices + 10% cashback</h3>
                    <div className="deal-2x2-grid">
                      <div className="deal-2x2-tile" onClick={() => openProductDetails({ title: 'ASUS 27-inch All-in-One Desktop PC (Core i7, 16GB)', price: 44999, category: 'Electronics', image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80' })}>
                        <div className="tile-img-container">
                          <img src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=300&q=80" alt="Desktop" className="tile-img" />
                        </div>
                        <span className="tile-label-text">Up to 50% off on Desktops</span>
                      </div>
                      <div className="deal-2x2-tile" onClick={() => openProductDetails({ title: 'Ultra-Slim OLED Gaming Laptop (RTX 4060, 1TB SSD)', price: 68999, category: 'Electronics', image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80' })}>
                        <div className="tile-img-container">
                          <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80" alt="Laptop" className="tile-img" />
                        </div>
                        <span className="tile-label-text">Up to 40% off on Laptops</span>
                      </div>
                      <div className="deal-2x2-tile" onClick={() => openProductDetails({ title: 'All-in-One Wireless EcoTank Color Printer & Scanner', price: 11999, category: 'Electronics', image_url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80' })}>
                        <div className="tile-img-container">
                          <img src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=300&q=80" alt="Printer" className="tile-img" />
                        </div>
                        <span className="tile-label-text">Up to 60% off on Printers</span>
                      </div>
                      <div className="deal-2x2-tile" onClick={() => openProductDetails(FEATURED_DEALS[0])}>
                        <div className="tile-img-container" style={{ background: '#fff3e0' }}>
                          <span style={{ fontSize: '2rem' }}>🏢</span>
                        </div>
                        <span className="tile-label-text">For Business purchases</span>
                      </div>
                    </div>
                  </div>
                  <span className="deal-card-footer-link" style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('Electronics')}>
                    See all offers
                  </span>
                </div>

                {/* Quad 2: Deals on Bluetooth speakers */}
                <div className="amazon-deal-card">
                  <div>
                    <h3 className="deal-card-title">Deals on Bluetooth speakers for your home</h3>
                    <div className="deal-2x2-grid">
                      <div className="deal-2x2-tile" onClick={() => openProductDetails(FEATURED_DEALS[6])}>
                        <div className="tile-img-container">
                          <img src={FEATURED_DEALS[6].image_url} alt="JBL Party" className="tile-img" />
                        </div>
                        <span className="tile-label-text">JBL Wireless Bluetooth...</span>
                      </div>
                      <div className="deal-2x2-tile" onClick={() => openProductDetails(FEATURED_DEALS[7])}>
                        <div className="tile-img-container">
                          <img src={FEATURED_DEALS[7].image_url} alt="Echo Dot" className="tile-img" />
                        </div>
                        <span className="tile-label-text">Echo Dot with Alexa</span>
                      </div>
                      <div className="deal-2x2-tile" onClick={() => openProductDetails({ title: 'ZEBRONICS Portable Wireless Boombox Speaker with Mic', price: 1799, category: 'Electronics', image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80' })}>
                        <div className="tile-img-container">
                          <img src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=300&q=80" alt="Zebronics" className="tile-img" />
                        </div>
                        <span className="tile-label-text">ZEBRONICS Bluetooth...</span>
                      </div>
                      <div className="deal-2x2-tile" onClick={() => openProductDetails({ title: 'Echo Dot Max High-Fidelity Smart Speaker with Spatial Audio', price: 4999, category: 'Electronics', image_url: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=600&q=80' })}>
                        <div className="tile-img-container">
                          <img src="https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=300&q=80" alt="Echo Max" className="tile-img" />
                        </div>
                        <span className="tile-label-text">Echo Dot Max with Alexa</span>
                      </div>
                    </div>
                  </div>
                  <span className="deal-card-footer-link" style={{ cursor: 'pointer' }} onClick={() => openProductDetails(FEATURED_DEALS[6])}>
                    See all deals
                  </span>
                </div>

                {/* Quad 3: Up to 75% off Earbuds */}
                <div className="amazon-deal-card">
                  <div>
                    <h3 className="deal-card-title">Up to 75% off | Most loved earbuds & audio</h3>
                    <div className="deal-2x2-grid">
                      <div className="deal-2x2-tile" onClick={() => openProductDetails(FEATURED_DEALS[8])}>
                        <div className="tile-img-container">
                          <img src={FEATURED_DEALS[8].image_url} alt="TWS" className="tile-img" />
                        </div>
                        <span className="tile-label-text">Truly wireless earbuds</span>
                      </div>
                      <div className="deal-2x2-tile" onClick={() => openProductDetails({ title: 'boAt Rockerz Bluetooth Neckband with Fast Charge (30 hrs)', price: 899, category: 'Electronics', image_url: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=600&q=80' })}>
                        <div className="tile-img-container">
                          <img src="https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=300&q=80" alt="Neckband" className="tile-img" />
                        </div>
                        <span className="tile-label-text">Bluetooth Neckbands</span>
                      </div>
                      <div className="deal-2x2-tile" onClick={() => openProductDetails(products[0] || FEATURED_DEALS[8])}>
                        <div className="tile-img-container">
                          <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80" alt="Headphones" className="tile-img" />
                        </div>
                        <span className="tile-label-text">Over ear headphones</span>
                      </div>
                      <div className="deal-2x2-tile" onClick={() => openProductDetails({ title: 'Hi-Res In-Ear Wired Earphones with Mic & Tangle-Free Cable', price: 349, category: 'Electronics', image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80' })}>
                        <div className="tile-img-container">
                          <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80" alt="Wired" className="tile-img" />
                        </div>
                        <span className="tile-label-text">Wired earphones</span>
                      </div>
                    </div>
                  </div>
                  <span className="deal-card-footer-link" style={{ cursor: 'pointer' }} onClick={() => openProductDetails(FEATURED_DEALS[8])}>
                    Explore all
                  </span>
                </div>

                {/* Quad 4: Starting ₹299 Home essentials */}
                <div className="amazon-deal-card">
                  <div>
                    <h3 className="deal-card-title">Starting ₹299 | Home essentials</h3>
                    <div className="deal-2x2-grid">
                      <div className="deal-2x2-tile" onClick={() => openProductDetails(FEATURED_DEALS[9])}>
                        <div className="tile-img-container">
                          <img src={FEATURED_DEALS[9].image_url} alt="Kitchen" className="tile-img" />
                        </div>
                        <span className="tile-label-text">Starting ₹229 | Kitchen...</span>
                      </div>
                      <div className="deal-2x2-tile" onClick={() => openProductDetails({ title: 'Foldable Fabric Laundry Hamper & Toy Organizer', price: 299, category: 'Furniture', image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80' })}>
                        <div className="tile-img-container">
                          <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80" alt="Storage" className="tile-img" />
                        </div>
                        <span className="tile-label-text">Min. 50% off | Storage</span>
                      </div>
                      <div className="deal-2x2-tile" onClick={() => openProductDetails(FEATURED_DEALS[3])}>
                        <div className="tile-img-container">
                          <img src={FEATURED_DEALS[3].image_url} alt="Furnishing" className="tile-img" />
                        </div>
                        <span className="tile-label-text">Starting ₹299 | Furnishing</span>
                      </div>
                      <div className="deal-2x2-tile" onClick={() => openProductDetails(FEATURED_DEALS[1])}>
                        <div className="tile-img-container">
                          <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=300&q=80" alt="Decor" className="tile-img" />
                        </div>
                        <span className="tile-label-text">Starting ₹129 | Decor</span>
                      </div>
                    </div>
                  </div>
                  <span className="deal-card-footer-link" style={{ cursor: 'pointer' }} onClick={() => openProductDetails(FEATURED_DEALS[9])}>
                    See all
                  </span>
                </div>

              </div>

              {/* Row 2 */}
              <div className="deal-quad-grid">
                
                <div className="amazon-deal-card">
                  <div>
                    <h3 className="deal-card-title">Starting ₹149 | Bestselling audio & accessories</h3>
                    <div className="card-large-image-wrap" onClick={() => openProductDetails(products[0] || FEATURED_DEALS[8])}>
                      <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" alt="Audio" className="card-large-image" />
                    </div>
                  </div>
                  <span className="deal-card-footer-link" style={{ cursor: 'pointer' }} onClick={() => openProductDetails(products[0] || FEATURED_DEALS[8])}>
                    See all offers
                  </span>
                </div>

                <div className="amazon-deal-card">
                  <div>
                    <h3 className="deal-card-title">Up to 60% off | Bestselling stationery & supplies</h3>
                    <div className="card-large-image-wrap" onClick={() => openProductDetails({ title: 'Premium Hardcover Ruled Journal & Rollerball Pen Set', price: 299, category: 'Furniture', image_url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80' })}>
                      <img src="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80" alt="Stationery" className="card-large-image" />
                    </div>
                  </div>
                  <span className="deal-card-footer-link" style={{ cursor: 'pointer' }} onClick={() => openProductDetails({ title: 'Premium Hardcover Ruled Journal & Rollerball Pen Set', price: 299, category: 'Furniture', image_url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80' })}>
                    See more
                  </span>
                </div>

                <div className="amazon-deal-card">
                  <div>
                    <h3 className="deal-card-title">Up to 60% off | Bestselling Printers & routers</h3>
                    <div className="card-large-image-wrap" onClick={() => openProductDetails({ title: 'Dual-Band Wi-Fi 6 Gigabit Router (3000 Mbps High Speed)', price: 2499, category: 'Electronics', image_url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80' })}>
                      <img src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80" alt="Printers" className="card-large-image" />
                    </div>
                  </div>
                  <span className="deal-card-footer-link" style={{ cursor: 'pointer' }} onClick={() => openProductDetails({ title: 'Dual-Band Wi-Fi 6 Gigabit Router (3000 Mbps High Speed)', price: 2499, category: 'Electronics', image_url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80' })}>
                    Explore offers
                  </span>
                </div>

                <div className="amazon-deal-card">
                  <div>
                    <h3 className="deal-card-title">Premium accessories from top brands</h3>
                    <div className="card-large-image-wrap" onClick={() => openProductDetails(FEATURED_DEALS[0])}>
                      <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80" alt="Accessories" className="card-large-image" />
                    </div>
                  </div>
                  <span className="deal-card-footer-link" style={{ cursor: 'pointer' }} onClick={() => openProductDetails(FEATURED_DEALS[0])}>
                    Shop now
                  </span>
                </div>

              </div>
            </div>

            {/* HORIZONTAL TODAY'S DEALS PRODUCT CAROUSEL RAIL */}
            <section className="amazon-rail-section" id="todays-deals-rail">
              <div className="rail-header-row">
                <h3 className="rail-title">
                  <span>Today's Deals</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#565959' }}>Limited time offers on top rated products</span>
                </h3>
                <span className="deal-card-footer-link" style={{ cursor: 'pointer' }} onClick={() => {
                  const target = document.getElementById('catalog-results-target');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  See all deals
                </span>
              </div>

              <div className="rail-scroll-container">
                {products.map((p) => (
                  <div key={p.id} className="rail-product-card" onClick={() => openProductDetails(p)}>
                    <div className="rail-img-wrap">
                      <img src={p.image_url} alt={p.title} className="rail-img" onError={(e) => handleImageError(e, p.title, p.category, p.image_url)} />
                    </div>
                    <div>
                      <span className="deal-pill-tag">Up to 40% off</span>
                      <span className="deal-pill-limited">Deal of the Day</span>
                    </div>
                    <div className="rail-price-row">
                      <span className="rail-deal-price">{formatCurrency(p.price)}</span>
                      <span className="rail-orig-price">{formatCurrency(p.price * 1.4)}</span>
                    </div>
                    <p className="rail-product-title">{p.title}</p>
                  </div>
                ))}
              </div>
            </section>
            </>
            )}

            {/* MAIN CATALOG WITH AMAZON FILTER SIDEBAR & PRODUCT LISTINGS */}
            <div className="catalog-page-layout" id="catalog-results-target">
              
              {/* Left Amazon Filter Sidebar */}
              <aside className="amazon-filter-sidebar">
                <div className="filter-block">
                  <h4 className="filter-block-title">Delivery Day</h4>
                  <div className="filter-options-list">
                    <label className="filter-checkbox-label">
                      <input type="checkbox" defaultChecked />
                      <span>Get It by Tomorrow</span>
                    </label>
                    <label className="filter-checkbox-label">
                      <input type="checkbox" />
                      <span>Get It in 2 Days</span>
                    </label>
                  </div>
                </div>

                <div className="filter-block">
                  <h4 className="filter-block-title">Big Deal Prime</h4>
                  <label className="filter-checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={primeOnly}
                      onChange={(e) => setPrimeOnly(e.target.checked)}
                    />
                    <span className="prime-filter-badge">
                      <Check size={11} strokeWidth={3.5} style={{ marginRight: 2 }} />prime
                    </span>
                  </label>
                </div>

                <div className="filter-block">
                  <h4 className="filter-block-title">Category</h4>
                  <div className="filter-options-list">
                    <div 
                      className={`rating-filter-link ${!selectedCategory ? 'font-bold' : ''}`}
                      onClick={() => setSelectedCategory('')}
                    >
                      All Categories ({products.length})
                    </div>
                    {categories.map((c) => (
                      <div 
                        key={c}
                        className={`rating-filter-link ${selectedCategory === c ? 'font-bold text-orange' : ''}`}
                        onClick={() => setSelectedCategory(c)}
                      >
                        {c} ({products.filter(p => p.category === c).length})
                      </div>
                    ))}
                  </div>
                </div>

                <div className="filter-block">
                  <h4 className="filter-block-title">Avg. Customer Review</h4>
                  <div className="filter-options-list">
                    {[4, 3, 2].map((r) => (
                      <div 
                        key={r}
                        className="rating-filter-link"
                        onClick={() => setMinRatingFilter(minRatingFilter === r ? 0 : r)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center' }}>{renderStars(r)}</span>
                        <span>& Up</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="filter-block">
                  <h4 className="filter-block-title">Price</h4>
                  <div className="filter-options-list">
                    <div className="rating-filter-link" onClick={() => { setMinPrice(0); setMaxPrice(500); }}>Under ₹500</div>
                    <div className="rating-filter-link" onClick={() => { setMinPrice(500); setMaxPrice(1000); }}>₹500 - ₹1,000</div>
                    <div className="rating-filter-link" onClick={() => { setMinPrice(1000); setMaxPrice(5000); }}>₹1,000 - ₹5,000</div>
                    <div className="rating-filter-link" onClick={() => { setMinPrice(5000); setMaxPrice(100000); }}>Over ₹5,000</div>
                  </div>
                  <div className="price-range-inputs">
                    <input 
                      type="number" 
                      placeholder="₹ Min" 
                      className="price-box-input"
                      value={minPrice || ''}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                    />
                    <span>-</span>
                    <input 
                      type="number" 
                      placeholder="₹ Max" 
                      className="price-box-input"
                      value={maxPrice || ''}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                    <button type="button" className="price-go-btn" onClick={() => showToast('Price range applied', 'info')}>Go</button>
                  </div>
                </div>

                <div className="filter-block">
                  <h4 className="filter-block-title">Availability</h4>
                  <label className="filter-checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    <span>Include Out of Stock</span>
                  </label>
                </div>
              </aside>

              {/* Right Catalog Results Column */}
              <div className="catalog-results-panel">
                <div className="results-top-bar">
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span className="results-count-text">
                      {sortedProducts.length > 0 ? (
                        <>1-{sortedProducts.length} of {products.length} results for <strong>{searchQuery.trim() ? `"${searchQuery}"` : (selectedCategory || 'All Essentials')}</strong></>
                      ) : (
                        <>0 results for <strong>"{searchQuery}"</strong></>
                      )}
                    </span>
                    {searchQuery.trim() && (
                      <span className="search-active-pill">
                        Search: "{searchQuery}"
                        <button type="button" onClick={() => setSearchQuery('')} title="Clear search filter">
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {selectedCategory && (
                      <span className="search-active-pill">
                        Category: {selectedCategory}
                        <button type="button" onClick={() => setSelectedCategory('')} title="Clear category filter">
                          <X size={12} />
                        </button>
                      </span>
                    )}
                  </div>

                  <div className="sort-dropdown-wrap">
                    <span style={{ fontSize: '0.85rem', color: '#565959' }}>Sort by:</span>
                    <select 
                      className="sort-select-amazon"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low-high">Price: Low to High</option>
                      <option value="price-high-low">Price: High to Low</option>
                      <option value="top-rated">Avg. Customer Review</option>
                      <option value="alphabetical">Newest Arrivals</option>
                    </select>
                  </div>
                </div>

                {/* If no matching products, show helpful Amazon Search empty state */}
                {sortedProducts.length === 0 ? (
                  <div className="no-results-container">
                    <div className="no-results-icon">
                      <PackageSearch size={48} strokeWidth={1.5} color="#888c8c" />
                    </div>
                    <h3 className="no-results-title">No products found matching "{searchQuery}"</h3>
                    <p className="no-results-subtitle">
                      Try checking your spelling, using more general keywords, or explore popular items below:
                    </p>
                    <div className="no-results-chips-wrap">
                      {['Watch', 'Headphones', 'Planter', 'Vacuum', 'Shoes', 'Speaker', 'Earbuds', 'Cookware', 'Jacket', 'Lamp', 'Serum'].map((chip) => (
                        <button 
                          key={chip} 
                          type="button" 
                          className="no-results-chip"
                          onClick={() => {
                            setSearchQuery(chip);
                            setSelectedCategory('');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          <Search size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} /> {chip}
                        </button>
                      ))}
                    </div>
                    <button 
                      type="button" 
                      className="amazon-yellow-btn" 
                      style={{ maxWidth: '240px', margin: '0 auto' }}
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('');
                        setMinRatingFilter(0);
                        setPrimeOnly(false);
                      }}
                    >
                      Browse All Products ({products.length})
                    </button>
                  </div>
                ) : (
                  /* Amazon Product Listing Cards Grid */
                  <div className="amazon-product-grid">
                  {sortedProducts.map((product, idx) => {
                    const isWish = wishlist.some(w => w.id === product.id);
                    const isTop = (product.average_rating || 0) >= 4.5 || idx === 0;

                    return (
                      <article 
                        key={product.id} 
                        className="amazon-listing-card"
                        onClick={() => openProductDetails(product)}
                      >
                        {/* Amazon Badge */}
                        <div className="listing-badge-container">
                          {isTop ? (
                            <div className="badge-bestseller">#1 Best Seller</div>
                          ) : idx % 2 === 0 ? (
                            <div className="badge-amazon-choice">BigDeal's <span>Choice</span></div>
                          ) : null}
                        </div>

                        {/* Wishlist Heart */}
                        <button 
                          type="button" 
                          className={`listing-heart-btn ${isWish ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          title="Save to Wish List"
                        >
                          <Heart 
                            size={16} 
                            fill={isWish ? "#e11d48" : "transparent"} 
                            color={isWish ? "#e11d48" : "#565959"} 
                            strokeWidth={isWish ? 0 : 2} 
                          />
                        </button>

                        {/* Product Image */}
                        <div className="listing-img-frame">
                          <img 
                            src={product.image_url} 
                            alt={product.title} 
                            className="listing-img" 
                            loading="lazy" 
                            onError={(e) => handleImageError(e, product.title, product.category, product.image_url)}
                          />
                          <div className="listing-quick-view-bar">
                            <span className="listing-quick-view-btn">
                              <Eye size={13} /> Quick Preview
                            </span>
                          </div>
                        </div>

                        {/* Title & Ratings */}
                        <div>
                          <h4 className="listing-title">{product.title}</h4>
                          <div className="listing-rating-row">
                            {renderStars(product.average_rating || 4.5)}
                            <span className="listing-review-count">({product.reviews_count || 128})</span>
                          </div>
                          <div className="listing-bought-sub">500+ bought in past month</div>

                          {/* Stock Scarcity Alert */}
                          {(product.stock || 10) <= 5 && (
                            <div className="listing-scarcity-alert">
                              <Flame size={12} color="#b91c1c" />
                              <span>Only {(product.stock || 10)} left in stock - order soon</span>
                            </div>
                          )}

                          {/* Price Display */}
                          <div className="listing-price-block">
                            <div className="listing-price-main">
                              <span className="listing-price-symbol">₹</span>
                              <span>{formatCurrency(product.price).replace(/[^0-9,]/g, '')}</span>
                              <span className="listing-price-fraction">00</span>
                            </div>
                            <span className="listing-mrp-strike">{formatCurrency(product.price * 1.35)}</span>
                            <span className="listing-discount-pct">(35% off)</span>
                          </div>

                          {/* Prime & Delivery */}
                          <div className="listing-delivery-tag">
                            <span className="prime-check">
                              <Check size={11} strokeWidth={3.5} style={{ marginRight: 2 }} />prime
                            </span>
                            <span>FREE Delivery by <strong>Tomorrow</strong></span>
                          </div>
                        </div>

                        {/* Action Buttons: Add to Cart & Compare */}
                        <div style={{ display: 'flex', gap: '6px', width: '100%', marginTop: '0.4rem' }}>
                          <button 
                            type="button" 
                            className="amazon-yellow-btn"
                            style={{ flex: 1 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            disabled={product.stock === 0}
                          >
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </button>
                          <button
                            type="button"
                            className={`compare-toggle-btn ${comparedProducts.some((p) => p.id === product.id) ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCompareProduct(product);
                            }}
                            title={comparedProducts.some((p) => p.id === product.id) ? "Remove from comparison" : "Compare specs"}
                          >
                            <Scale size={14} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                  </div>
                )}
              </div>

            </div>
          </>
        )}

        {/* USER ACCOUNT & ORDERS VIEW */}
        {activeView === 'account' && (
          <div className="single-view-container">
            {!user ? (
              <div style={{ maxWidth: '400px', margin: '2rem auto', border: '1px solid #d5d9d9', borderRadius: '8px', padding: '1.8rem', background: '#ffffff' }}>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', fontWeight: 600 }}>Sign in</h2>
                <form onSubmit={handleAuthSubmit}>
                  {authMode === 'register' && (
                    <div className="amazon-form-group">
                      <label>Your name</label>
                      <input 
                        type="text" 
                        className="amazon-form-input" 
                        value={authForm.name}
                        onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                        required
                      />
                    </div>
                  )}
                  <div className="amazon-form-group">
                    <label>Email or mobile phone number</label>
                    <input 
                      type="email" 
                      className="amazon-form-input" 
                      value={authForm.email}
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="amazon-form-group">
                    <label>Password</label>
                    <input 
                      type="password" 
                      className="amazon-form-input" 
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="amazon-yellow-btn" style={{ marginTop: '0.8rem' }}>
                    {authMode === 'login' ? 'Sign in' : 'Create your Big Deal account'}
                  </button>
                </form>

                <div style={{ marginTop: '1.2rem', paddingTop: '1.2rem', borderTop: '1px solid #e7e7e7', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#565959' }}>
                    {authMode === 'login' ? 'New to Big Deal?' : 'Already have an account?'}
                  </span>
                  <button 
                    type="button" 
                    className="amazon-orange-btn" 
                    style={{ marginTop: '0.6rem' }}
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  >
                    {authMode === 'login' ? 'Create your Big Deal account' : 'Sign in to existing account'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e7e7e7', paddingBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 600 }}>Your Account</h2>
                    <p style={{ color: '#565959' }}>{user.name} ({user.email})</p>
                  </div>
                  <button type="button" className="price-go-btn" onClick={() => { setUser(null); showToast('Signed out'); }}>
                    Sign Out
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <button type="button" className={`price-go-btn ${accountSubTab === 'orders' ? 'font-bold' : ''}`} onClick={() => setAccountSubTab('orders')}>
                    Your Orders
                  </button>
                  <button type="button" className={`price-go-btn ${accountSubTab === 'wishlist' ? 'font-bold' : ''}`} onClick={() => setAccountSubTab('wishlist')}>
                    Your Wish List ({wishlist.length})
                  </button>
                </div>

                {accountSubTab === 'orders' && (
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Past Orders & Live Tracking</h3>
                    {lastPlacedOrder ? (
                      <div style={{ border: '1px solid #d5d9d9', borderRadius: '8px', padding: '1.2rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e7e7e7', paddingBottom: '0.6rem', flexWrap: 'wrap', gap: '0.6rem' }}>
                          <div>
                            <span style={{ fontSize: '0.78rem', color: '#565959' }}>ORDER PLACED</span>
                            <div style={{ fontWeight: 600 }}>{new Date().toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.78rem', color: '#565959' }}>TOTAL</span>
                            <div style={{ fontWeight: 600 }}>{formatCurrency(lastPlacedOrder.total)}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.78rem', color: '#565959' }}>SHIP TO</span>
                            <div style={{ fontWeight: 600 }}>{lastPlacedOrder.customer_name}</div>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.78rem', color: '#565959' }}>ORDER # {lastPlacedOrder.order_id}</span>
                            <div>
                              <button 
                                type="button"
                                style={{ color: 'var(--amazon-link)', fontWeight: 600, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                onClick={() => {
                                  setInvoiceOrder(lastPlacedOrder);
                                  setIsInvoiceModalOpen(true);
                                  playAudioChime('click', soundEnabled);
                                }}
                              >
                                <FileText size={13} />
                                <span>GST Tax Invoice</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Order Stepper */}
                        <div className="order-tracking-stepper">
                          {["Order Placed", "Shipped", "Out for Delivery", "Delivered"].map((st, i) => (
                            <div key={st} className={`tracking-step-node ${i <= 1 ? 'completed' : i === 2 ? 'active' : ''}`}>
                              <div className="tracking-step-dot">{i <= 1 ? <Check size={12} strokeWidth={3} /> : i + 1}</div>
                              <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{st}</span>
                            </div>
                          ))}
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                          <strong>Arriving {lastPlacedOrder.est_delivery}</strong>
                          <p style={{ fontSize: '0.85rem', color: '#565959' }}>Carrier: {lastPlacedOrder.carrier} • Tracking: {lastPlacedOrder.tracking_number}</p>
                        </div>

                        {/* Interactive Live GPS Delivery Route Simulation */}
                        <div className="gps-live-tracker-box">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.92rem' }}>
                              <Radio size={16} color="#059669" />
                              <span>Live GPS Delivery Tracking</span>
                              <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '1px 8px', borderRadius: '12px', fontWeight: 800 }}>LIVE EN ROUTE</span>
                            </div>
                            <span style={{ fontSize: '0.82rem', color: '#475569' }}>
                              <Clock size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                              ETA: <strong>18 mins away</strong>
                            </span>
                          </div>

                          <div className="gps-map-simulation">
                            {/* Simulated Route Path SVG */}
                            <svg className="gps-route-svg" viewBox="0 0 600 180" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#3b82f6" />
                                  <stop offset="50%" stopColor="#f59e0b" />
                                  <stop offset="100%" stopColor="#10b981" />
                                </linearGradient>
                              </defs>
                              <line x1="0" y1="45" x2="600" y2="45" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="1" />
                              <line x1="0" y1="90" x2="600" y2="90" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="1" />
                              <line x1="0" y1="135" x2="600" y2="135" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="1" />
                              <path 
                                d="M 40 90 Q 180 30, 300 90 T 560 90" 
                                fill="none" 
                                stroke="#94a3b8" 
                                strokeWidth="8" 
                                strokeLinecap="round" 
                              />
                              <path 
                                d="M 40 90 Q 180 30, 300 90 T 560 90" 
                                fill="none" 
                                stroke="url(#routeGrad)" 
                                strokeWidth="4" 
                                strokeDasharray="6 4"
                                strokeLinecap="round" 
                              />
                              <circle cx="40" cy="90" r="8" fill="#2563eb" />
                              <text x="40" y="125" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700">Hub: BLR-04</text>
                              <circle cx="560" cy="90" r="8" fill="#10b981" />
                              <text x="560" y="125" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="700">Your Doorstep</text>
                            </svg>

                            {/* Moving Truck Icon */}
                            <div className="gps-truck-marker" title="Delivery van on the move">
                              <Truck size={20} />
                            </div>
                          </div>

                          <div className="gps-driver-info-row">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#334155' }}>
                                RK
                              </div>
                              <div>
                                <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Rajesh Kumar</div>
                                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Prime Delivery Partner • ★ 4.9 (1,240 deliveries)</div>
                              </div>
                            </div>

                            <button 
                              type="button" 
                              className="price-go-btn"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0284c7', color: '#ffffff', borderColor: '#0284c7', padding: '6px 14px' }}
                              onClick={handleCallDriver}
                              disabled={driverCalling}
                            >
                              <Phone size={14} />
                              <span>{driverCalling ? 'Calling...' : 'Call Partner'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p style={{ color: '#565959' }}>No recent orders found. Browse products to start shopping!</p>
                    )}
                  </div>
                )}

                {accountSubTab === 'wishlist' && (
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Your Wish List</h3>
                    <div className="amazon-product-grid">
                      {wishlist.map((item) => (
                        <div key={item.id} className="amazon-listing-card" onClick={() => openProductDetails(item)}>
                          <img src={item.image_url} alt={item.title} className="listing-img" style={{ height: '160px' }} />
                          <h4 className="listing-title">{item.title}</h4>
                          <strong style={{ fontSize: '1.2rem' }}>{formatCurrency(item.price)}</strong>
                          <button 
                            type="button" 
                            className="amazon-yellow-btn" 
                            style={{ marginTop: '0.8rem' }} 
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(item);
                            }}
                          >
                            Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CHECKOUT EXPERIENCE VIEW */}
        {activeView === 'checkout' && (
          <div className="single-view-container">
            <h2 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '1.5rem' }}>Checkout</h2>
            
            <div className="checkout-grid">
              <div>
                <div className="checkout-stepper-header">
                  <div className={`checkout-step-pill ${checkoutStep === 1 ? 'active' : checkoutStep > 1 ? 'completed' : ''}`} onClick={() => setCheckoutStep(1)}>
                    <span>1. Delivery Address</span>
                  </div>
                  <ChevronRight size={14} color="#888c8c" />
                  <div className={`checkout-step-pill ${checkoutStep === 2 ? 'active' : checkoutStep > 2 ? 'completed' : ''}`} onClick={() => setCheckoutStep(2)}>
                    <span>2. Delivery Speed</span>
                  </div>
                  <ChevronRight size={14} color="#888c8c" />
                  <div className={`checkout-step-pill ${checkoutStep === 3 ? 'active' : ''}`} onClick={() => setCheckoutStep(3)}>
                    <span>3. Payment</span>
                  </div>
                </div>

                {checkoutStep === 1 && (
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Select a delivery address</h3>
                    <div className="amazon-form-group">
                      <label>Full name</label>
                      <input type="text" className="amazon-form-input" value={shippingData.fullName} onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })} />
                    </div>
                    <div className="amazon-form-group">
                      <label>Street address</label>
                      <input type="text" className="amazon-form-input" value={shippingData.address} onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="amazon-form-group">
                        <label>City</label>
                        <input type="text" className="amazon-form-input" value={shippingData.city} onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })} />
                      </div>
                      <div className="amazon-form-group">
                        <label>PIN Code</label>
                        <input type="text" className="amazon-form-input" value={shippingData.zipCode} onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })} />
                      </div>
                    </div>
                    <button type="button" className="amazon-yellow-btn" style={{ maxWidth: '240px', marginTop: '1rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onClick={() => setCheckoutStep(2)}>
                      <span>Use this address</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Choose your delivery options</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      <label className="filter-checkbox-label" style={{ padding: '0.8rem', border: '1px solid #d5d9d9', borderRadius: '4px' }}>
                        <input type="radio" name="speed" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} />
                        <div>
                          <strong>FREE Standard Delivery</strong>
                          <div style={{ fontSize: '0.8rem', color: '#565959' }}>Get it in 2-3 business days</div>
                        </div>
                      </label>
                      <label className="filter-checkbox-label" style={{ padding: '0.8rem', border: '1px solid #d5d9d9', borderRadius: '4px' }}>
                        <input type="radio" name="speed" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
                        <div>
                          <strong>₹99 Express Next-Day Delivery</strong>
                          <div style={{ fontSize: '0.8rem', color: '#565959' }}>Guaranteed delivery by Tomorrow 11 AM</div>
                        </div>
                      </label>
                    </div>
                    <button type="button" className="amazon-yellow-btn" style={{ maxWidth: '240px', marginTop: '1rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onClick={() => setCheckoutStep(3)}>
                      <span>Continue to Payment</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}

                {checkoutStep === 3 && (
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Select a payment method</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                      <label className="filter-checkbox-label" style={{ padding: '0.8rem', border: '1px solid #d5d9d9', borderRadius: '4px' }}>
                        <input type="radio" name="pay" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                        <div>
                          <strong>Credit / Debit Card (Visa, MasterCard, RuPay)</strong>
                          <div style={{ fontSize: '0.8rem', color: '#565959' }}>Save extra 10% with Bank offers</div>
                        </div>
                      </label>
                      <label className="filter-checkbox-label" style={{ padding: '0.8rem', border: '1px solid #d5d9d9', borderRadius: '4px' }}>
                        <input type="radio" name="pay" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                        <div>
                          <strong>Cash on Delivery (Pay at Doorstep / UPI QR)</strong>
                        </div>
                      </label>
                    </div>
                    <button 
                      type="button" 
                      className="amazon-yellow-btn" 
                      style={{ maxWidth: '280px' }}
                      disabled={isCheckingOut || cart.length === 0}
                      onClick={handleCheckout}
                    >
                      {isCheckingOut ? 'Placing your order...' : `Place your order in INR • ${formatCurrency((appliedPromo ? Math.max(0, cartTotal - appliedPromo.discount_amount) : cartTotal) + shippingCost)}`}
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary Box */}
              <div style={{ border: '1px solid #d5d9d9', borderRadius: '8px', padding: '1.2rem', background: '#f8f8f8', height: 'fit-content' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.8rem' }}>Order Summary</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                  <span>Items ({cartCount}):</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                  <span>Delivery:</span>
                  <span>{shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}</span>
                </div>
                {appliedPromo && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem', color: '#007600' }}>
                    <span>Promotion Applied:</span>
                    <span>-{formatCurrency(appliedPromo.discount_amount)}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid #d5d9d9', paddingTop: '0.6rem', marginTop: '0.6rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, color: 'var(--amazon-price-red)' }}>
                  <span>Order Total:</span>
                  <span>{formatCurrency((appliedPromo ? Math.max(0, cartTotal - appliedPromo.discount_amount) : cartTotal) + shippingCost)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* UNIFIED EXECUTIVE ADMIN DASHBOARD */}
        {activeView === 'admin' && (
          <div className="single-view-container" style={{ padding: '1rem 0' }}>
            {!adminToken ? (
              <div className="admin-login-card-container">
                <div className="admin-login-card">
                  <div className="admin-login-card-header">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.4rem' }}>
                      <ShieldCheck size={44} color="#007185" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.4rem 0' }}>Big Deal Admin Panel</h2>
                    <p style={{ color: '#565959', fontSize: '0.88rem', margin: 0 }}>
                      Sign in to manage catalog products, live orders, promo codes & store telemetry
                    </p>
                  </div>

                  <div className="admin-credentials-hint">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <KeyRound size={15} color="#0f1111" /> Admin Credentials:
                      </strong>
                      <button 
                        type="button" 
                        className="quick-fill-creds-btn"
                        onClick={() => setAdminLoginForm({ username: 'admin', password: 'admin123' })}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Sparkles size={13} /> Auto-Fill Credentials
                      </button>
                    </div>
                    <div>
                      Username: <code>admin</code> | Password: <code>admin123</code>
                    </div>
                  </div>

                  <form onSubmit={handleAdminLogin}>
                    <div className="amazon-form-group">
                      <label>Admin Username</label>
                      <input 
                        type="text" 
                        className="amazon-form-input" 
                        value={adminLoginForm.username}
                        onChange={(e) => setAdminLoginForm({ ...adminLoginForm, username: e.target.value })}
                        placeholder="admin"
                        required
                      />
                    </div>

                    <div className="amazon-form-group">
                      <label>Admin Password</label>
                      <input 
                        type="password" 
                        className="amazon-form-input" 
                        placeholder="••••••••"
                        value={adminLoginForm.password}
                        onChange={(e) => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.4rem' }}>
                      <button 
                        type="submit" 
                        className="amazon-yellow-btn"
                        style={{ width: '100%', height: '42px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        disabled={isLoggingInAdmin}
                      >
                        <span>{isLoggingInAdmin ? 'Authenticating...' : 'Sign In to Admin Panel'}</span>
                        {!isLoggingInAdmin && <ArrowRight size={15} />}
                      </button>
                      <button 
                        type="button" 
                        className="price-go-btn"
                        onClick={() => setActiveView('shop')}
                      >
                        Return to Store
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="admin-panel-shell">
                {/* 1. HERO HEADER WITH QUICK ACTIONS */}
                <div className="admin-dashboard-hero">
                  <div>
                    <h2>
                      <ShieldCheck size={22} color="#f59e0b" style={{ verticalAlign: 'middle', marginRight: 6 }} />
                      Big Deal Executive Admin Center
                    </h2>
                    <p>All-in-One Operations Console: Catalog, Live Orders, Promo Coupons, Users & Telemetry</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button 
                      type="button" 
                      className="btn-add-product-pill"
                      onClick={() => setIsAddProductModalOpen(true)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Plus size={14} /> Add New Product
                    </button>
                    <button 
                      type="button" 
                      className="price-go-btn"
                      style={{ background: '#ffffff', color: '#131921', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      onClick={fetchAdminData}
                      title="Sync live telemetry data"
                    >
                      <RefreshCw size={13} /> Refresh Data
                    </button>
                    <button 
                      type="button" 
                      className="price-go-btn"
                      style={{ background: '#fff0f0', borderColor: '#ffcccc', color: '#cc0c39', fontWeight: 600 }}
                      onClick={handleAdminLogout}
                    >
                      Logout Admin
                    </button>
                    <button 
                      type="button" 
                      className="amazon-yellow-btn" 
                      style={{ maxWidth: '140px' }} 
                      onClick={() => setActiveView('shop')}
                    >
                      ← Storefront
                    </button>
                  </div>
                </div>

                {/* 2. LIVE TELEMETRY KPI TILES */}
                <div className="admin-kpi-grid">
                  <div className="admin-kpi-card">
                    <div className="kpi-title">
                      <DollarSign size={16} color="#007600" style={{ marginRight: 4 }} /> Gross Revenue
                    </div>
                    <div className="kpi-value" style={{ color: '#007600' }}>
                      {formatCurrency(adminStats.gross_revenue || products.reduce((acc, p) => acc + p.price * 2, 8540))}
                    </div>
                  </div>

                  <div className="admin-kpi-card">
                    <div className="kpi-title">
                      <Package size={16} color="#007185" style={{ marginRight: 4 }} /> Active Catalog
                    </div>
                    <div className="kpi-value">
                      {products.length} Items
                    </div>
                  </div>

                  <div className="admin-kpi-card">
                    <div className="kpi-title">
                      <AlertTriangle size={16} color="#d97706" style={{ marginRight: 4 }} /> Low Stock Alerts
                    </div>
                    <div className="kpi-value" style={{ color: products.filter(p => (p.stock || 10) <= 3).length > 0 ? '#b45309' : '#007600' }}>
                      {products.filter(p => (p.stock || 10) <= 3).length} Items
                    </div>
                  </div>

                  <div className="admin-kpi-card">
                    <div className="kpi-title">
                      <ShoppingBag size={16} color="#007185" style={{ marginRight: 4 }} /> Total Orders
                    </div>
                    <div className="kpi-value">
                      {adminOrders.length || 1} Orders
                    </div>
                  </div>

                  <div className="admin-kpi-card">
                    <div className="kpi-title">
                      <Users size={16} color="#007185" style={{ marginRight: 4 }} /> Registered Users
                    </div>
                    <div className="kpi-value">
                      {adminUsers.length || 1} Buyers
                    </div>
                  </div>

                  <div className="admin-kpi-card">
                    <div className="kpi-title">
                      <Tag size={16} color="#005bb5" style={{ marginRight: 4 }} /> Active Promos
                    </div>
                    <div className="kpi-value" style={{ color: '#005bb5' }}>
                      {adminPromos.length || 2} Active
                    </div>
                  </div>
                </div>

                {/* 3. WORKSPACE TABS SWITCHER */}
                <div className="admin-workspace-tabs">
                  <button 
                    type="button" 
                    className={`admin-workspace-tab ${adminActiveTab === 'products' ? 'active' : ''}`}
                    onClick={() => setAdminActiveTab('products')}
                  >
                    <Package size={15} style={{ marginRight: 6 }} /> Products & Inventory ({products.length})
                  </button>
                  <button 
                    type="button" 
                    className={`admin-workspace-tab ${adminActiveTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setAdminActiveTab('orders')}
                  >
                    <ShoppingBag size={15} style={{ marginRight: 6 }} /> Orders & Fulfillment ({adminOrders.length})
                  </button>
                  <button 
                    type="button" 
                    className={`admin-workspace-tab ${adminActiveTab === 'promos' ? 'active' : ''}`}
                    onClick={() => setAdminActiveTab('promos')}
                  >
                    <Tag size={15} style={{ marginRight: 6 }} /> Promo Codes & Discounts ({adminPromos.length})
                  </button>
                  <button 
                    type="button" 
                    className={`admin-workspace-tab ${adminActiveTab === 'users' ? 'active' : ''}`}
                    onClick={() => setAdminActiveTab('users')}
                  >
                    <Users size={15} style={{ marginRight: 6 }} /> Customer Accounts ({adminUsers.length})
                  </button>
                  <button 
                    type="button" 
                    className={`admin-workspace-tab ${adminActiveTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setAdminActiveTab('settings')}
                  >
                    <Server size={15} style={{ marginRight: 6 }} /> System & Diagnostics
                  </button>
                </div>

                {/* 4. TAB 1: PRODUCTS & INVENTORY WORKSPACE */}
                {adminActiveTab === 'products' && (
                  <div className="admin-tab-body">
                    <div className="admin-filter-toolbar">
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#565959' }}>Filter Stock:</span>
                        {[
                          { id: 'all', label: `All (${products.length})`, icon: null },
                          { id: 'low_stock', label: `Low Stock (${products.filter(p => (p.stock || 10) <= 3 && (p.stock || 10) > 0).length})`, icon: <AlertTriangle size={12} color="#d97706" style={{ marginRight: 4 }} /> },
                          { id: 'out_of_stock', label: `Out of Stock (${products.filter(p => (p.stock || 10) === 0).length})`, icon: <AlertCircle size={12} color="#cc0c39" style={{ marginRight: 4 }} /> },
                          { id: 'in_stock', label: `In Stock (${products.filter(p => (p.stock || 10) > 3).length})`, icon: <Check size={12} color="#15803d" style={{ marginRight: 4 }} /> }
                        ].map((flt) => (
                          <button
                            key={flt.id}
                            type="button"
                            className={`template-chip ${adminCatalogFilter === flt.id ? 'active' : ''}`}
                            style={{
                              background: adminCatalogFilter === flt.id ? '#0073e6' : '#ffffff',
                              color: adminCatalogFilter === flt.id ? '#ffffff' : '#0f172a',
                              borderColor: adminCatalogFilter === flt.id ? '#0073e6' : '#cbd5e1',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                            onClick={() => setAdminCatalogFilter(flt.id)}
                          >
                            {flt.icon}
                            <span>{flt.label}</span>
                          </button>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                        <div className="admin-search-box">
                          <Search size={14} color="#888c8c" />
                          <input 
                            type="text" 
                            placeholder="Filter by title or department..." 
                            value={adminCatalogSearch}
                            onChange={(e) => setAdminCatalogSearch(e.target.value)}
                          />
                          {adminCatalogSearch && (
                            <button type="button" onClick={() => setAdminCatalogSearch('')} style={{ color: '#888', display: 'flex', alignItems: 'center' }}>
                              <X size={12} />
                            </button>
                          )}
                        </div>

                        <button 
                          type="button" 
                          className="btn-add-product-pill"
                          onClick={() => setIsAddProductModalOpen(true)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Plus size={14} /> Add Product
                        </button>
                      </div>
                    </div>

                    <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Thumbnail</th>
                            <th>Product Title & Department</th>
                            <th>Base Price</th>
                            <th>Stock Management</th>
                            <th>Rating</th>
                            <th>Administrative Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products
                            .filter((p) => {
                              if (adminCatalogFilter === 'low_stock') return (p.stock || 10) <= 3 && (p.stock || 10) > 0;
                              if (adminCatalogFilter === 'out_of_stock') return (p.stock || 10) === 0;
                              if (adminCatalogFilter === 'in_stock') return (p.stock || 10) > 3;
                              return true;
                            })
                            .filter((p) => {
                              if (!adminCatalogSearch.trim()) return true;
                              const q = adminCatalogSearch.toLowerCase();
                              return p.title.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q));
                            })
                            .map((p) => (
                              <tr key={p.id}>
                                <td>
                                  <img 
                                    src={p.image_url} 
                                    alt={p.title} 
                                    style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }} 
                                    onError={(e) => handleImageError(e, p.title, p.category, p.image_url)}
                                  />
                                </td>
                                <td>
                                  <strong style={{ fontSize: '0.92rem' }}>{p.title}</strong>
                                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                    Dept: <span style={{ color: '#0f172a', fontWeight: 600 }}>{p.category}</span> • ID #{p.id}
                                  </div>
                                </td>
                                <td style={{ fontWeight: 700, color: 'var(--amazon-price-red)', fontSize: '0.95rem' }}>
                                  {formatCurrency(p.price)}
                                </td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <button 
                                      type="button" 
                                      className="price-go-btn" 
                                      style={{ padding: '2px 6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                      onClick={() => handleQuickStockChange(p, -1)}
                                      title="Decrease stock by 1"
                                    >
                                      <Minus size={11} />
                                    </button>
                                    <span style={{ 
                                      fontWeight: 700, 
                                      minWidth: '55px', 
                                      textAlign: 'center',
                                      color: (p.stock || 10) === 0 ? '#b91c1c' : (p.stock || 10) <= 3 ? '#d97706' : '#15803d' 
                                    }}>
                                      {(p.stock || 10)} units
                                    </span>
                                    <button 
                                      type="button" 
                                      className="price-go-btn" 
                                      style={{ padding: '2px 6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                      onClick={() => handleQuickStockChange(p, 1)}
                                      title="Increase stock by 1"
                                    >
                                      <Plus size={11} />
                                    </button>
                                  </div>
                                </td>
                                <td>
                                  <div style={{ fontSize: '0.82rem' }}>
                                    {renderStars(p.average_rating || 4.5)}
                                    <span style={{ color: '#64748b', marginLeft: '4px' }}>({p.reviews_count || 12})</span>
                                  </div>
                                </td>
                                <td>
                                  <button type="button" className="price-go-btn" onClick={() => openProductDetails(p)} title="Preview in Buy Box">
                                    Preview
                                  </button>
                                  <button 
                                    type="button" 
                                    className="btn-edit-action"
                                    onClick={() => openEditProductModal(p)}
                                    title="Edit product details, pricing, and photos"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <Edit3 size={13} /> Edit
                                  </button>
                                  <button 
                                    type="button" 
                                    className="btn-delete-action"
                                    onClick={() => handleDeleteProduct(p.id, p.title)}
                                    title="Remove from store catalog"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <Trash2 size={13} /> Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. TAB 2: ORDERS & FULFILLMENT WORKSPACE */}
                {adminActiveTab === 'orders' && (
                  <div className="admin-tab-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                        Live Customer Orders & Logistics ({adminOrders.length} records)
                      </h3>
                      <button type="button" className="price-go-btn" onClick={fetchAdminData} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <RefreshCw size={13} /> Refresh Orders
                      </button>
                    </div>

                    {adminOrders.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
                          <ShoppingBag size={44} strokeWidth={1.5} color="#94a3b8" />
                        </div>
                        <h4>No Customer Orders Placed Yet</h4>
                        <p style={{ color: '#64748b', fontSize: '0.88rem' }}>When customers complete checkout, their orders, address, and live fulfillment pipeline appear here.</p>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Order ID & Date</th>
                              <th>Customer Details</th>
                              <th>Items Summary</th>
                              <th>Total Amount</th>
                              <th>Status Pipeline</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {adminOrders.map((ord) => (
                              <tr key={ord.id}>
                                <td>
                                  <strong>#{ord.id}</strong>
                                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                    {new Date(ord.created_at || Date.now()).toLocaleDateString('en-IN', {
                                      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                  </div>
                                </td>
                                <td>
                                  <strong>{ord.customer_name}</strong>
                                  <div style={{ fontSize: '0.78rem', color: '#005bb5' }}>{ord.customer_email}</div>
                                </td>
                                <td>
                                  <span style={{ fontWeight: 600 }}>{(ord.items || []).length} items</span>
                                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                    {(ord.items || []).map(it => `${it.title} (x${it.quantity})`).slice(0, 2).join(', ')}
                                  </div>
                                </td>
                                <td style={{ fontWeight: 800, color: 'var(--amazon-price-red)' }}>
                                  {formatCurrency(ord.total)}
                                  {ord.promo_code && (
                                    <div style={{ fontSize: '0.72rem', color: '#15803d' }}>Coupon: {ord.promo_code}</div>
                                  )}
                                </td>
                                <td>
                                  <select
                                    className={`order-status-dropdown status-badge-${(ord.status || 'placed').toLowerCase()}`}
                                    value={ord.status || 'Placed'}
                                    onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                  >
                                    <option value="Placed">Placed</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="price-go-btn"
                                    onClick={() => setActiveReceiptOrder({
                                      order_id: ord.id,
                                      customer_name: ord.customer_name,
                                      customer_email: ord.customer_email,
                                      shipping_address: 'Standard Delivery Address',
                                      payment_method: 'Verified Checkout',
                                      tracking_number: `BD-IN-${ord.id}9821`,
                                      carrier: 'Big Deal Logistics',
                                      items: ord.items || [],
                                      total: ord.total
                                    })}
                                  >
                                    View Receipt
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 6. TAB 3: PROMO CODES & MARKETING WORKSPACE */}
                {adminActiveTab === 'promos' && (
                  <div className="admin-tab-body">
                    {/* Create New Promo Form */}
                    <div className="admin-promo-creator-card">
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Tag size={18} color="#005bb5" />
                        <span>Generate New Discount Coupon</span>
                      </h4>
                      <form onSubmit={handleCreatePromo} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 160px', gap: '1rem', alignItems: 'flex-end' }}>
                        <div className="amazon-form-group" style={{ margin: 0 }}>
                          <label>Coupon Code (e.g. FESTIVAL20)</label>
                          <input 
                            type="text" 
                            className="amazon-form-input" 
                            placeholder="CODE20" 
                            value={newPromoForm.code} 
                            onChange={(e) => setNewPromoForm({ ...newPromoForm, code: e.target.value })} 
                            required 
                          />
                        </div>

                        <div className="amazon-form-group" style={{ margin: 0 }}>
                          <label>Discount Type</label>
                          <select 
                            className="amazon-form-input" 
                            value={newPromoForm.discount_type} 
                            onChange={(e) => setNewPromoForm({ ...newPromoForm, discount_type: e.target.value })}
                          >
                            <option value="percent">Percentage (%)</option>
                            <option value="fixed">Fixed Amount (₹)</option>
                          </select>
                        </div>

                        <div className="amazon-form-group" style={{ margin: 0 }}>
                          <label>Discount Value</label>
                          <input 
                            type="number" 
                            min="1" 
                            className="amazon-form-input" 
                            placeholder="e.g. 15" 
                            value={newPromoForm.discount_value} 
                            onChange={(e) => setNewPromoForm({ ...newPromoForm, discount_value: e.target.value })} 
                            required 
                          />
                        </div>

                        <button 
                          type="submit" 
                          className="btn-add-product-pill" 
                          style={{ height: '38px', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          disabled={isCreatingPromo}
                        >
                          <Plus size={14} />
                          <span>{isCreatingPromo ? 'Creating...' : 'Create Coupon'}</span>
                        </button>
                      </form>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.8rem' }}>Active Promo Codes</h4>
                    <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Promo Code</th>
                            <th>Discount Type</th>
                            <th>Discount Value</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminPromos.map((p) => (
                            <tr key={p.code}>
                              <td>
                                <strong style={{ letterSpacing: '1px', color: '#005bb5' }}>{p.code}</strong>
                              </td>
                              <td>{p.discount_type === 'percent' ? 'Percentage Off' : 'Flat Cash Discount'}</td>
                              <td style={{ fontWeight: 700, color: 'var(--amazon-price-red)' }}>
                                {p.discount_type === 'percent' ? `${p.discount_value}% OFF` : `₹${p.discount_value} FLAT`}
                              </td>
                              <td>
                                <span className="status-badge status-badge-delivered" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <CheckCircle2 size={12} color="#15803d" /> Active
                                </span>
                              </td>
                              <td>
                                <button 
                                  type="button" 
                                  className="btn-delete-action"
                                  onClick={() => handleDeletePromo(p.code)}
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <Trash2 size={12} /> Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 7. TAB 4: REGISTERED CUSTOMERS WORKSPACE */}
                {adminActiveTab === 'users' && (
                  <div className="admin-tab-body">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.8rem' }}>
                      Registered Customer Accounts ({adminUsers.length} Users)
                    </h3>
                    <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>User ID</th>
                            <th>Customer Name</th>
                            <th>Email Address</th>
                            <th>Registration Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminUsers.map((u) => (
                            <tr key={u.id}>
                              <td><strong>#{u.id}</strong></td>
                              <td>{u.name}</td>
                              <td style={{ color: '#005bb5' }}>{u.email}</td>
                              <td style={{ color: '#64748b' }}>
                                {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : 'Verified Buyer'}
                              </td>
                              <td>
                                <span className="status-badge status-badge-delivered">Active Customer</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 8. TAB 5: SYSTEM SETTINGS & DIAGNOSTICS */}
                {adminActiveTab === 'settings' && (
                  <div className="admin-tab-body">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.2rem' }}>
                      Platform Architecture & Diagnostics
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.2rem', background: '#f8fafc' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Server size={16} color="#007185" />
                          <span>Server Environment</span>
                        </h4>
                        <div style={{ fontSize: '0.86rem', lineHeight: 1.6, color: '#334155' }}>
                          <div><strong>API Status:</strong> <span style={{ color: '#15803d' }}>Online (Port 8000)</span></div>
                          <div><strong>Database Schema:</strong> <code>big_deal (MySQL / SQLAlchemy)</code></div>
                          <div><strong>Frontend Engine:</strong> <code>Vite + React (Port 5173)</code></div>
                          <div><strong>Active Session:</strong> <code>Admin Token Verified</code></div>
                        </div>
                      </div>

                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.2rem', background: '#f8fafc' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ShieldCheck size={16} color="#007185" />
                          <span>Security Session</span>
                        </h4>
                        <div style={{ fontSize: '0.86rem', lineHeight: 1.6, color: '#334155' }}>
                          <div><strong>Admin Username:</strong> <code>admin</code></div>
                          <div><strong>Authorization Scope:</strong> <code>Full Catalog & Order Management</code></div>
                        </div>
                        <button 
                          type="button" 
                          className="price-go-btn"
                          style={{ marginTop: '1rem', background: '#fff0f0', borderColor: '#ffcccc', color: '#cc0c39', fontWeight: 700 }}
                          onClick={handleAdminLogout}
                        >
                          End Admin Session (Logout)
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* SLIDE-OUT CART DRAWER */}
      <div className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <h3>Shopping Cart ({cartCount} items)</h3>
            <button type="button" style={{ color: '#ffffff', display: 'flex', alignItems: 'center' }} onClick={() => setIsCartOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="drawer-content">
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <ShoppingCart size={48} strokeWidth={1.5} color="#888c8c" />
                </div>
                <h4>Your Big Deal Cart is empty</h4>
                <p style={{ color: '#565959', fontSize: '0.88rem', margin: '0.6rem 0 1.2rem' }}>Shop today's deals and discover trending products.</p>
                <button type="button" className="amazon-yellow-btn" onClick={() => setIsCartOpen(false)}>Continue Shopping</button>
              </div>
            ) : (
              <div>
                {/* 1-Click Voucher Chips */}
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <button type="button" className="price-go-btn" style={{ fontSize: '0.75rem', background: '#fff3e0', display: 'inline-flex', alignItems: 'center', gap: '4px' }} onClick={() => handleApplyPromo('WELCOME10')}>
                    <Tag size={12} color="#005bb5" /> Apply WELCOME10 (-10%)
                  </button>
                  <button type="button" className="price-go-btn" style={{ fontSize: '0.75rem', background: '#fff3e0', display: 'inline-flex', alignItems: 'center', gap: '4px' }} onClick={() => handleApplyPromo('BIGDEAL50')}>
                    <Tag size={12} color="#005bb5" /> Apply BIGDEAL50 (-₹50)
                  </button>
                </div>

                <ul className="drawer-cart-list">
                  {cart.map((item) => (
                    <li key={item.id} className="drawer-cart-item" onClick={() => { setIsCartOpen(false); openProductDetails(item); }}>
                      <img src={item.image_url} alt={item.title} />
                      <div className="drawer-item-details">
                        <h6>{item.title}</h6>
                        <strong style={{ color: 'var(--amazon-price-red)' }}>{formatCurrency(item.price)}</strong>
                        <div className="drawer-quantity-controls" onClick={(e) => e.stopPropagation()}>
                          <button type="button" onClick={() => updateQuantity(item.id, -1)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Minus size={11} />
                          </button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, 1)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="drawer-footer">
              <div className="drawer-subtotal">
                <span>Subtotal:</span>
                <strong style={{ color: 'var(--amazon-price-red)' }}>{formatCurrency(cartTotal)}</strong>
              </div>
              <button 
                type="button" 
                className="amazon-yellow-btn"
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveView('checkout');
                }}
              >
                Proceed to Checkout ({cartCount} items)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AMAZON PRODUCT DETAILS / BUY BOX MODAL */}
      {activeModalProduct && (
        <div className="modal-overlay" onClick={() => setActiveModalProduct(null)}>
          <div className="amazon-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close-x" onClick={() => setActiveModalProduct(null)}>
              <X size={18} />
            </button>

            <div className="detail-layout-3col">
              {/* Col 1: Images & 360° / AR View */}
              <div className="modal-gallery-wrap">
                {/* View Mode Switcher */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  <button
                    type="button"
                    className={`ar-room-btn ${!is360Active ? 'active' : ''}`}
                    onClick={() => setIs360Active(false)}
                  >
                    Standard Photos
                  </button>
                  <button
                    type="button"
                    className={`ar-room-btn ${is360Active ? 'active' : ''}`}
                    onClick={() => {
                      setIs360Active(true);
                      playAudioChime('click', soundEnabled);
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <RotateCcw size={13} />
                    <span>360° / 3D AR Room</span>
                  </button>
                </div>

                {!is360Active ? (
                  <>
                    <div 
                      className="modal-large-img-box"
                      onMouseMove={handleImageZoom}
                      onMouseLeave={handleImageZoomLeave}
                    >
                      <img 
                        src={
                          activeModalProduct.images && activeModalProduct.images[selectedImageIndex]
                            ? (typeof activeModalProduct.images[selectedImageIndex] === 'string'
                                ? activeModalProduct.images[selectedImageIndex]
                                : (activeModalProduct.images[selectedImageIndex].image_url || activeModalProduct.image_url || getSmartProductFallback(activeModalProduct.title, activeModalProduct.category)))
                            : (activeModalProduct.image_url || getSmartProductFallback(activeModalProduct.title, activeModalProduct.category))
                        } 
                        alt={activeModalProduct.title} 
                        className="modal-large-img" 
                        style={{
                          transform: zoomState.active ? 'scale(2.2)' : 'scale(1)',
                          transformOrigin: `${zoomState.x}% ${zoomState.y}%`,
                          transition: zoomState.active ? 'none' : 'transform 0.25s ease'
                        }}
                        onError={(e) => handleImageError(e, activeModalProduct.title, activeModalProduct.category, activeModalProduct.image_url)}
                      />
                      <div className={`modal-zoom-hint-badge ${zoomState.active ? 'active' : ''}`}>
                        <ZoomIn size={12} />
                        <span>{zoomState.active ? 'Zoom Active' : 'Hover to Zoom'}</span>
                      </div>
                    </div>
                    {activeModalProduct.images && activeModalProduct.images.length > 1 && (
                      <div className="modal-thumb-rail">
                        {activeModalProduct.images.map((img, idx) => {
                          const thumbUrl = typeof img === 'string' ? img : (img.image_url || activeModalProduct.image_url || getSmartProductFallback(activeModalProduct.title, activeModalProduct.category));
                          return (
                            <div 
                              key={idx} 
                              className={`modal-thumb-item ${selectedImageIndex === idx ? 'active' : ''}`}
                              onClick={() => setSelectedImageIndex(idx)}
                            >
                              <img src={thumbUrl} alt="Thumbnail" onError={(e) => handleImageError(e, activeModalProduct.title, activeModalProduct.category, thumbUrl)} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  /* 360° Drag Turntable & AR Stage */
                  <div className="turntable-container">
                    <div 
                      className="turntable-stage"
                      onMouseDown={handleTurntableMouseDown}
                      onMouseMove={handleTurntableMouseMove}
                      onMouseUp={handleTurntableMouseUp}
                      onTouchStart={handleTurntableMouseDown}
                      onTouchMove={handleTurntableMouseMove}
                      onTouchEnd={handleTurntableMouseUp}
                      style={{
                        background: arRoom === 'office' 
                          ? 'radial-gradient(circle, #334155 0%, #0f172a 100%)' 
                          : arRoom === 'living' 
                          ? 'radial-gradient(circle, #475569 0%, #1e293b 100%)' 
                          : 'radial-gradient(circle, #ffffff 0%, #e2e8f0 100%)',
                        borderRadius: '8px'
                      }}
                    >
                      <img 
                        src={activeModalProduct.image_url || getSmartProductFallback(activeModalProduct.title, activeModalProduct.category)} 
                        alt="360 view"
                        className="turntable-img"
                        style={{
                          transform: `rotateY(${turntableAngle}deg) scale(${arRoom === 'studio' ? 1 : 0.92})`,
                        }}
                      />
                      <div className="turntable-pedestal"></div>
                    </div>

                    <div className="turntable-controls-bar">
                      <span>🔄 {Math.round((turntableAngle % 360 + 360) % 360)}° Angle • Drag left/right to spin</span>
                      <button 
                        type="button" 
                        style={{ color: '#2563eb', fontWeight: 700 }}
                        onClick={() => setTurntableAngle(0)}
                      >
                        Reset Angle
                      </button>
                    </div>

                    {/* Simulated AR Environment Presets */}
                    <div style={{ marginTop: '0.8rem' }}>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Simulate in AR Room Environment:</span>
                      <div className="ar-room-selector">
                        <button 
                          type="button" 
                          className={`ar-room-btn ${arRoom === 'studio' ? 'active' : ''}`} 
                          onClick={() => setArRoom('studio')}
                        >
                          Studio White
                        </button>
                        <button 
                          type="button" 
                          className={`ar-room-btn ${arRoom === 'office' ? 'active' : ''}`} 
                          onClick={() => setArRoom('office')}
                        >
                          Executive Desk
                        </button>
                        <button 
                          type="button" 
                          className={`ar-room-btn ${arRoom === 'living' ? 'active' : ''}`} 
                          onClick={() => setArRoom('living')}
                        >
                          Nordic Living Room
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Col 2: Details & Specs */}
              <div className="modal-info-wrap">
                <span className="modal-brand-link">Visit the Big Deal Store</span>
                <h2>{activeModalProduct.title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  {renderStars(activeModalProduct.average_rating || 4.5)}
                  <span style={{ fontSize: '0.85rem', color: 'var(--amazon-link)' }}>{activeModalProduct.reviews_count || 142} ratings</span>
                </div>

                {/* Real-World Social Proof Urgency Strip */}
                <div className="modal-urgency-strip">
                  <div className="urgency-viewers-pill">
                    <span className="live-pulse-dot"></span>
                    <Eye size={13} color="#059669" />
                    <span><strong>{viewerCount} shoppers</strong> viewing now</span>
                  </div>
                  <div className="urgency-bought-pill">
                    <Flame size={13} color="#ea580c" />
                    <span><strong>65+ ordered</strong> in last 24h</span>
                  </div>
                </div>

                <div className="modal-price-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: 'var(--amazon-discount-red)', fontSize: '0.9rem', fontWeight: 700 }}>Limited time deal</div>
                    <span className="deal-pct-badge-pill">35% OFF</span>
                  </div>
                  <div className="modal-price-big">{formatCurrency(activeModalProduct.price)}</div>

                  {/* Lightning Deal Progress Bar */}
                  <div className="lightning-deal-progress-box">
                    <div className="lightning-deal-progress-labels">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#dc2626', fontWeight: 700 }}>
                        <Zap size={12} fill="#dc2626" /> Lightning Deal: 82% Claimed
                      </span>
                      <span style={{ color: '#64748b' }}>Only 2 units left at this price</span>
                    </div>
                    <div className="lightning-deal-bar-track">
                      <div className="lightning-deal-bar-fill" style={{ width: '82%' }}></div>
                    </div>
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    <span 
                      style={{ fontSize: '0.82rem', color: 'var(--amazon-link)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => setIsEmiModalOpen(true)}
                    >
                      <Calculator size={13} />
                      <span>EMI from {formatCurrency(Math.round(activeModalProduct.price / 12))}/mo • View Bank Plans</span>
                    </span>
                  </div>
                </div>

                {/* Offers Row */}
                <div className="offers-badge-row">
                  <div className="offer-box">
                    <strong>Bank Offer</strong>
                    <span>Up to ₹500 discount on select credit cards</span>
                  </div>
                  <div className="offer-box" style={{ cursor: 'pointer' }} onClick={() => setIsEmiModalOpen(true)}>
                    <strong>No-Cost EMI Available</strong>
                    <span>Avail 0% interest on HDFC, ICICI, SBI</span>
                  </div>
                </div>

                {/* HISTORICAL PRICE TREND & PRICE DROP TRACKER */}
                {(() => {
                  const baseP = activeModalProduct.price || 499;
                  const pts30d = [
                    { label: '30d ago', price: Math.round(baseP * 1.22) },
                    { label: '24d ago', price: Math.round(baseP * 1.18) },
                    { label: '18d ago', price: Math.round(baseP * 1.14) },
                    { label: '12d ago', price: Math.round(baseP * 1.08) },
                    { label: '6d ago', price: Math.round(baseP * 1.02) },
                    { label: 'Today', price: baseP }
                  ];
                  const pts90d = [
                    { label: '90d ago', price: Math.round(baseP * 1.28) },
                    { label: '75d ago', price: Math.round(baseP * 1.22) },
                    { label: '60d ago', price: Math.round(baseP * 1.19) },
                    { label: '45d ago', price: Math.round(baseP * 1.15) },
                    { label: '30d ago', price: Math.round(baseP * 1.12) },
                    { label: '15d ago', price: Math.round(baseP * 1.05) },
                    { label: 'Today', price: baseP }
                  ];
                  const points = priceHistoryRange === '30d' ? pts30d : pts90d;
                  const prices = points.map(p => p.price);
                  const minP = Math.min(...prices);
                  const maxP = Math.max(...prices);
                  const avgP = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
                  const svgWidth = 340;
                  const svgHeight = 90;
                  const padding = 20;

                  const chartPoints = points.map((pt, i) => {
                    const x = padding + (i / (points.length - 1)) * (svgWidth - padding * 2);
                    const rangeSpan = (maxP - minP) || 1;
                    const y = svgHeight - padding - ((pt.price - minP) / rangeSpan) * (svgHeight - padding * 2);
                    return { x, y, ...pt };
                  });

                  const linePath = chartPoints.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
                  const areaPath = `${linePath} L ${chartPoints[chartPoints.length - 1].x} ${svgHeight - 10} L ${chartPoints[0].x} ${svgHeight - 10} Z`;

                  return (
                    <div className="price-history-tracker-card">
                      <div className="price-history-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <LineChart size={15} color="#0284c7" />
                          <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>Historical Price Trend & Camel Tracker</strong>
                        </div>
                        <div className="price-history-range-pills">
                          <button 
                            type="button" 
                            className={`price-range-btn ${priceHistoryRange === '30d' ? 'active' : ''}`}
                            onClick={() => setPriceHistoryRange('30d')}
                          >
                            30D
                          </button>
                          <button 
                            type="button" 
                            className={`price-range-btn ${priceHistoryRange === '90d' ? 'active' : ''}`}
                            onClick={() => setPriceHistoryRange('90d')}
                          >
                            90D
                          </button>
                        </div>
                      </div>

                      {/* Stat summary cards */}
                      <div className="price-history-stats-grid">
                        <div className="price-stat-box lowest">
                          <span className="price-stat-lbl">
                            <TrendingDown size={12} color="#16a34a" /> Lowest Ever
                          </span>
                          <strong className="price-stat-val text-green">{formatCurrency(minP)}</strong>
                        </div>
                        <div className="price-stat-box">
                          <span className="price-stat-lbl">Average Price</span>
                          <strong className="price-stat-val">{formatCurrency(avgP)}</strong>
                        </div>
                        <div className="price-stat-box">
                          <span className="price-stat-lbl">Current Savings</span>
                          <strong className="price-stat-val text-orange">Save {formatCurrency(maxP - baseP)}</strong>
                        </div>
                      </div>

                      {/* SVG Line & Area Visual Chart */}
                      <div className="price-chart-svg-wrap">
                        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="price-history-svg">
                          <defs>
                            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Grid line */}
                          <line x1={padding} y1={svgHeight - 10} x2={svgWidth - padding} y2={svgHeight - 10} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,3" />

                          {/* Area fill */}
                          <path d={areaPath} fill="url(#priceGradient)" />

                          {/* Main trend line */}
                          <path d={linePath} fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                          {/* Data points */}
                          {chartPoints.map((pt, i) => (
                            <g key={i} className="chart-data-node">
                              <circle cx={pt.x} cy={pt.y} r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                              <text x={pt.x} y={svgHeight - 1} fontSize="8" fill="#64748b" textAnchor="middle">{pt.label}</text>
                            </g>
                          ))}
                        </svg>
                      </div>

                      {/* Price Drop Alert Trigger */}
                      <div className="price-alert-section">
                        {!isPriceAlertSet ? (
                          !isPriceAlertOpen ? (
                            <button 
                              type="button" 
                              className="btn-open-price-alert"
                              onClick={() => setIsPriceAlertOpen(true)}
                            >
                              <Bell size={13} />
                              <span>Set Price Drop Alert for this Item</span>
                            </button>
                          ) : (
                            <form className="price-alert-form" onSubmit={(e) => handleSetPriceAlert(e, activeModalProduct)}>
                              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                                🔔 Notify me when price drops below:
                              </div>
                              <div style={{ display: 'flex', gap: '5px', marginTop: '4px' }}>
                                <input 
                                  type="email" 
                                  className="amazon-form-input" 
                                  style={{ flex: 1, padding: '4px 8px', fontSize: '0.8rem' }}
                                  placeholder="Your email address" 
                                  value={priceAlertEmail}
                                  onChange={(e) => setPriceAlertEmail(e.target.value)}
                                  required
                                />
                                <input 
                                  type="number" 
                                  className="amazon-form-input" 
                                  style={{ width: '90px', padding: '4px 8px', fontSize: '0.8rem' }}
                                  placeholder={`₹${Math.round(baseP * 0.9)}`}
                                  value={priceAlertThreshold}
                                  onChange={(e) => setPriceAlertThreshold(e.target.value)}
                                />
                                <button type="submit" className="amazon-yellow-btn" style={{ padding: '4px 10px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                                  Activate
                                </button>
                                <button type="button" className="price-go-btn" style={{ padding: '4px 8px', fontSize: '0.78rem' }} onClick={() => setIsPriceAlertOpen(false)}>
                                  ✕
                                </button>
                              </div>
                            </form>
                          )
                        ) : (
                          <div className="price-alert-confirmed-badge">
                            <CheckCircle2 size={14} color="#16a34a" />
                            <span><strong>Price Drop Alert Active:</strong> We'll alert <code>{priceAlertEmail}</code> when price falls below {priceAlertThreshold ? formatCurrency(Number(priceAlertThreshold)) : formatCurrency(Math.round(baseP * 0.9))}.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                <h4 style={{ fontSize: '1rem', marginTop: '1rem', marginBottom: '0.4rem' }}>About this item</h4>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: '#333333' }}>{activeModalProduct.description}</p>
                
                {/* Specifications Matrix */}
                <div style={{ marginTop: '1rem', borderTop: '1px solid #e7e7e7', paddingTop: '0.8rem' }}>
                  <h5 style={{ fontSize: '0.92rem', marginBottom: '0.6rem' }}>Product Specifications</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.4rem', fontSize: '0.85rem' }}>
                    {Object.entries(PRODUCT_SPECS[activeModalProduct.category] || PRODUCT_SPECS["Default"]).map(([k, v]) => (
                      <div key={k} style={{ display: 'contents' }}>
                        <span style={{ color: '#565959', fontWeight: 600 }}>{k}</span>
                        <span style={{ color: '#0f1111' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Col 3: Buy Box */}
              <div className="amazon-buy-box">
                <div className="buy-box-price">{formatCurrency(activeModalProduct.price)}</div>

                {/* Interactive Pincode Delivery Estimator Box */}
                <div className="pincode-estimator-card">
                  <div className="pincode-est-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={14} color="#007185" />
                      <span style={{ fontSize: '0.82rem', color: '#0f1111' }}>
                        Deliver to <strong>{pincodeDetails.city} {deliveryPincode}</strong>
                      </span>
                    </div>
                    <span className="pincode-hub-tag">{pincodeDetails.same_day ? 'Tier-1 Hub' : 'Standard'}</span>
                  </div>

                  {/* Guaranteed Next-Day Promise + Live Cutoff Countdown */}
                  <div className="delivery-promise-badge">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800, color: '#007600', fontSize: '0.86rem' }}>
                      <span className="prime-check" style={{ marginRight: '2px' }}>
                        <Check size={11} strokeWidth={3.5} style={{ marginRight: 2 }} />prime
                      </span>
                      <span>FREE Delivery by {pincodeDetails.same_day ? 'Tomorrow, 11:00 AM' : '2 Business Days'}</span>
                    </div>
                    <div className="cutoff-countdown-banner">
                      <Clock size={12} color="#b45309" />
                      <span>Order within <strong>{String(cutoffCountdown.hours).padStart(2, '0')}h {String(cutoffCountdown.minutes).padStart(2, '0')}m {String(cutoffCountdown.seconds).padStart(2, '0')}s</strong></span>
                    </div>
                  </div>

                  {/* Logistics Badges */}
                  <div className="pincode-features-grid">
                    <div className="pincode-feat-item" title={pincodeDetails.fulfillment_hub}>
                      <ShieldCheck size={12} color="#0284c7" />
                      <span>{pincodeDetails.courier_partner}</span>
                    </div>
                    <div className="pincode-feat-item">
                      <CheckCircle2 size={12} color="#16a34a" />
                      <span>COD Eligible</span>
                    </div>
                  </div>

                  {/* Pincode Input Form */}
                  <div className="pincode-input-section">
                    <div className="pincode-input-row">
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder="Enter 6-digit PIN"
                        className="pincode-input-field"
                        value={pincodeInput}
                        onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => e.key === 'Enter' && handleCheckPincode(pincodeInput)}
                      />
                      <button 
                        type="button" 
                        className="pincode-check-btn"
                        disabled={isCheckingPincode}
                        onClick={() => handleCheckPincode(pincodeInput)}
                      >
                        {isCheckingPincode ? 'Checking...' : 'Check'}
                      </button>
                    </div>

                    {/* Quick Popular City Chips */}
                    <div className="pincode-quick-chips">
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Quick Select:</span>
                      {POPULAR_INDIAN_PINCODES.slice(0, 5).map((pc) => (
                        <button 
                          key={pc.pincode}
                          type="button"
                          className={`pincode-city-chip ${deliveryPincode === pc.pincode ? 'active' : ''}`}
                          onClick={() => handleCheckPincode(pc.pincode)}
                        >
                          {pc.city}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  {(activeModalProduct.stock || 10) > 0 ? (
                    <span className="buy-box-stock-in">In Stock ({(activeModalProduct.stock || 10)} available)</span>
                  ) : (
                    <span className="buy-box-stock-out">Currently Unavailable</span>
                  )}
                </div>
                <button 
                  type="button" 
                  className="amazon-yellow-btn" 
                  disabled={(activeModalProduct.stock || 10) === 0}
                  onClick={() => {
                    addToCart(activeModalProduct);
                    setActiveModalProduct(null);
                  }}
                >
                  Add to Cart
                </button>
                <button 
                  type="button" 
                  className="amazon-orange-btn"
                  disabled={(activeModalProduct.stock || 10) === 0}
                  onClick={() => {
                    addToCart(activeModalProduct);
                    setActiveModalProduct(null);
                    setActiveView('checkout');
                  }}
                >
                  Buy Now
                </button>
                <button 
                  type="button" 
                  className="price-go-btn"
                  style={{ width: '100%', marginTop: '0.2rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={() => toggleWishlist(activeModalProduct)}
                >
                  <Heart 
                    size={15} 
                    fill={wishlist.some(w => w.id === activeModalProduct.id) ? "#e11d48" : "transparent"} 
                    color={wishlist.some(w => w.id === activeModalProduct.id) ? "#e11d48" : "#565959"} 
                  />
                  <span>{wishlist.some(w => w.id === activeModalProduct.id) ? 'In Wish List' : 'Add to Wish List'}</span>
                </button>
                <button 
                  type="button" 
                  className="price-go-btn"
                  style={{ width: '100%', marginTop: '0.2rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={() => toggleCompareProduct(activeModalProduct)}
                >
                  <Scale size={15} color="#2563eb" />
                  <span>{comparedProducts.some((p) => p.id === activeModalProduct.id) ? 'Remove from Comparison' : 'Add to Compare'}</span>
                </button>
                <div style={{ fontSize: '0.75rem', color: '#565959', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} color="#007600" />
                  <span>Secure transaction • Ships from Big Deal</span>
                </div>
              </div>
            </div>

            {/* FREQUENTLY BOUGHT TOGETHER BUNDLE BUILDER */}
            {(() => {
              const comp1Price = Math.max(299, Math.round(activeModalProduct.price * 0.16));
              const comp2Price = Math.max(199, Math.round(activeModalProduct.price * 0.10));
              const comp1 = {
                id: activeModalProduct.id * 100 + 1,
                title: `${activeModalProduct.title.split(' ')[0]} Premium Armor Guard Case & Travel Pouch`,
                category: activeModalProduct.category,
                price: comp1Price,
                image_url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80",
                stock: 15
              };
              const comp2 = {
                id: activeModalProduct.id * 100 + 2,
                title: "Ultra-Fast Braided Nylon 65W Power Delivery Cable (2m)",
                category: activeModalProduct.category,
                price: comp2Price,
                image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=300&q=80",
                stock: 20
              };

              const activeBundleTotal = 
                (bundleChecked.main ? activeModalProduct.price : 0) +
                (bundleChecked.item1 ? comp1Price : 0) +
                (bundleChecked.item2 ? comp2Price : 0);
              const bundleDiscountedTotal = Math.round(activeBundleTotal * 0.85);
              const bundleSavings = activeBundleTotal - bundleDiscountedTotal;

              const handleAddBundleToCart = () => {
                if (bundleChecked.main) addToCart(activeModalProduct);
                if (bundleChecked.item1) addToCart(comp1);
                if (bundleChecked.item2) addToCart(comp2);
                showToast(`🎉 Bundle added to cart! You saved ${formatCurrency(bundleSavings)} (15% Bundle Discount applied)`, 'success');
                setActiveModalProduct(null);
                setIsCartOpen(true);
              };

              return (
                <div className="bundle-builder-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
                    <Layers size={18} color="#f08804" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Frequently Bought Together</h3>
                    <span style={{ fontSize: '0.75rem', background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>SAVE 15% COMBO</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                    Select companion items below to unlock an instant 15% combined bundle discount.
                  </p>

                  <div className="bundle-items-row">
                    <div className="bundle-item-thumb-box" title={activeModalProduct.title}>
                      <img src={activeModalProduct.image_url || getSmartProductFallback(activeModalProduct.title, activeModalProduct.category)} alt="Main" className="bundle-item-thumb-img" />
                    </div>
                    <span className="bundle-plus-badge">+</span>
                    <div className="bundle-item-thumb-box" title={comp1.title}>
                      <img src={comp1.image_url} alt="Companion 1" className="bundle-item-thumb-img" />
                    </div>
                    <span className="bundle-plus-badge">+</span>
                    <div className="bundle-item-thumb-box" title={comp2.title}>
                      <img src={comp2.image_url} alt="Companion 2" className="bundle-item-thumb-img" />
                    </div>

                    <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '220px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#565959' }}>
                        Total price: <span style={{ textDecoration: 'line-through' }}>{formatCurrency(activeBundleTotal)}</span>
                      </div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--amazon-price-red)' }}>
                        {formatCurrency(bundleDiscountedTotal)}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 700 }}>
                        Includes 15% Bundle Discount (Save {formatCurrency(bundleSavings)})
                      </span>
                      <button
                        type="button"
                        className="amazon-yellow-btn"
                        style={{ marginTop: '0.4rem', fontWeight: 700 }}
                        onClick={handleAddBundleToCart}
                      >
                        Add all selected to Cart
                      </button>
                    </div>
                  </div>

                  {/* Bundle Checkboxes */}
                  <div className="bundle-checkboxes-list">
                    <label className="bundle-check-row">
                      <input 
                        type="checkbox" 
                        checked={bundleChecked.main} 
                        onChange={(e) => setBundleChecked({ ...bundleChecked, main: e.target.checked })} 
                      />
                      <span><strong>This item:</strong> {activeModalProduct.title} — <strong style={{ color: 'var(--amazon-price-red)' }}>{formatCurrency(activeModalProduct.price)}</strong></span>
                    </label>
                    <label className="bundle-check-row">
                      <input 
                        type="checkbox" 
                        checked={bundleChecked.item1} 
                        onChange={(e) => setBundleChecked({ ...bundleChecked, item1: e.target.checked })} 
                      />
                      <span><strong>Companion 1:</strong> {comp1.title} — <strong style={{ color: 'var(--amazon-price-red)' }}>{formatCurrency(comp1Price)}</strong></span>
                    </label>
                    <label className="bundle-check-row">
                      <input 
                        type="checkbox" 
                        checked={bundleChecked.item2} 
                        onChange={(e) => setBundleChecked({ ...bundleChecked, item2: e.target.checked })} 
                      />
                      <span><strong>Companion 2:</strong> {comp2.title} — <strong style={{ color: 'var(--amazon-price-red)' }}>{formatCurrency(comp2Price)}</strong></span>
                    </label>
                  </div>
                </div>
              );
            })()}

            {/* Customer Reviews inside modal */}
            <div className="modal-reviews-block">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Customer Reviews & Ratings</h3>
              <div className="reviews-grid-2col">
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                    <strong style={{ fontSize: '2rem' }}>{activeModalProduct.average_rating || '4.8'}</strong>
                    <span style={{ color: '#565959' }}>out of 5</span>
                  </div>
                  <div>{renderStars(activeModalProduct.average_rating || 4.8)}</div>
                  <div style={{ marginTop: '1rem' }}>
                    {[
                      { star: 5, pct: 68 },
                      { star: 4, pct: 20 },
                      { star: 3, pct: 8 },
                      { star: 2, pct: 2 },
                      { star: 1, pct: 2 }
                    ].map((h) => (
                      <div key={h.star} className="rating-histogram-row">
                        <span style={{ width: '40px' }}>{h.star} star</span>
                        <div className="hist-bar-track">
                          <div className="hist-bar-fill" style={{ width: `${h.pct}%` }}></div>
                        </div>
                        <span style={{ width: '30px', textAlign: 'right' }}>{h.pct}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Write a Review Section */}
                  <form onSubmit={handleCreateReview} style={{ marginTop: '1.5rem', background: '#f8f8f8', padding: '1rem', borderRadius: '6px', border: '1px solid #d5d9d9' }}>
                    <h5 style={{ fontSize: '0.95rem', marginBottom: '0.6rem' }}>Write a Customer Review</h5>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.82rem' }}>Rate:</span>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          style={{ background: 'none', border: 'none', padding: '0 2px', cursor: 'pointer', display: 'inline-flex' }}
                          onClick={() => setNewReviewForm({ ...newReviewForm, rating: s })}
                        >
                          <Star 
                            size={16} 
                            fill={s <= newReviewForm.rating ? "#de7921" : "transparent"} 
                            color={s <= newReviewForm.rating ? "#de7921" : "#d5d9d9"} 
                          />
                        </button>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      placeholder="Your name (optional)" 
                      className="amazon-form-input" 
                      style={{ marginBottom: '0.5rem' }} 
                      value={newReviewForm.username}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, username: e.target.value })}
                    />
                    <textarea 
                      placeholder="Write your review here..." 
                      className="amazon-form-input" 
                      style={{ height: '70px', resize: 'vertical', marginBottom: '0.6rem' }}
                      value={newReviewForm.comment}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                      required
                    />
                    <button type="submit" className="price-go-btn" style={{ width: '100%' }} disabled={isSubmittingReview}>
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>

                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.8rem' }}>Top Reviews from India</h4>
                  {modalReviews.length === 0 ? (
                    <p style={{ color: '#565959', fontSize: '0.88rem' }}>No written reviews yet. Be the first to review this item!</p>
                  ) : (
                    modalReviews.map((rev) => (
                      <div key={rev.id} style={{ borderBottom: '1px solid #e7e7e7', paddingBottom: '0.8rem', marginBottom: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <strong>{rev.username || 'Big Deal Customer'}</strong>
                          <span style={{ color: '#007600', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <CheckCircle2 size={12} color="#007600" /> Verified Purchase
                          </span>
                        </div>
                        <div>{renderStars(rev.rating)}</div>
                        <p style={{ fontSize: '0.88rem', marginTop: '0.3rem' }}>{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOCATION SELECTOR & PINCODE LOGISTICS MODAL */}
      {isLocationModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLocationModalOpen(false)}>
          <div className="location-hub-modal" onClick={(e) => e.stopPropagation()}>
            <div className="location-hub-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} color="#007185" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Choose your Delivery Location</h3>
              </div>
              <button type="button" className="quickview-close-btn" onClick={() => setIsLocationModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#565959', margin: '0.6rem 0 1rem' }}>
              Select your delivery city or enter your 6-digit PIN code to check instant Prime Same-Day & Next-Day delivery speeds, Cash on Delivery availability, and local fulfillment hubs.
            </p>

            {/* Current Active Location Banner */}
            <div className="active-loc-banner">
              <div>
                <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase' }}>Current Active Delivery Hub</div>
                <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{pincodeDetails.city}, {pincodeDetails.state} - {deliveryPincode}</strong>
                <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                  {pincodeDetails.courier_partner} • {pincodeDetails.fulfillment_hub}
                </div>
              </div>
              <span className="loc-tier-badge">{pincodeDetails.same_day ? '⚡ Same-Day Prime' : '🚚 Next-Day Delivery'}</span>
            </div>

            {/* Pincode Input Form */}
            <div className="amazon-form-group" style={{ marginTop: '1rem' }}>
              <label style={{ fontWeight: 700, fontSize: '0.88rem' }}>Enter 6-digit Indian PIN code</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '4px' }}>
                <input 
                  type="text" 
                  maxLength={6}
                  className="amazon-form-input" 
                  placeholder="e.g. 600053, 560001, 400001"
                  value={tempPincode}
                  onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCheckPincode(tempPincode);
                      setIsLocationModalOpen(false);
                    }
                  }}
                />
                <button 
                  type="button" 
                  className="btn-add-product-pill"
                  style={{ minWidth: '100px', justifyContent: 'center' }}
                  disabled={isCheckingPincode}
                  onClick={() => {
                    handleCheckPincode(tempPincode);
                    setIsLocationModalOpen(false);
                  }}
                >
                  {isCheckingPincode ? 'Checking...' : 'Apply PIN'}
                </button>
              </div>
            </div>

            {/* Popular Tier-1 Metropolitan Hubs */}
            <div style={{ marginTop: '1.2rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Popular Delivery Hubs (Click to switch):</span>
              <div className="location-cities-grid">
                {POPULAR_INDIAN_PINCODES.map((pc) => (
                  <div 
                    key={pc.pincode}
                    className={`loc-city-card ${deliveryPincode === pc.pincode ? 'active' : ''}`}
                    onClick={() => {
                      handleCheckPincode(pc.pincode);
                      setIsLocationModalOpen(false);
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{pc.city}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>PIN {pc.pincode} • {pc.state}</div>
                    <span className="loc-speed-tag">{pc.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CURRENCY & LANGUAGE SELECTOR MODAL */}
      {isCurrencyModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCurrencyModalOpen(false)}>
          <div style={{ background: '#ffffff', width: '380px', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--shadow-modal)' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.8rem' }}>Language & Currency Settings</h3>
            <p style={{ fontSize: '0.85rem', color: '#565959', marginBottom: '1rem' }}>Select your preferred currency for browsing & payments.</p>
            
            <div className="amazon-form-group">
              <label>Select Currency</label>
              <select 
                className="amazon-form-input"
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                  showToast(`Store currency changed to ${e.target.value}`, 'info');
                }}
              >
                <option value="INR">INR - Indian Rupee (₹)</option>
                <option value="USD">USD - US Dollar ($)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="GBP">GBP - British Pound (£)</option>
                <option value="CAD">CAD - Canadian Dollar (CA$)</option>
              </select>
            </div>

            <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button 
                type="button" 
                className="amazon-yellow-btn" 
                style={{ maxWidth: '140px' }}
                onClick={() => setIsCurrencyModalOpen(false)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL INVOICE MODAL */}
      {activeReceiptOrder && (
        <div className="modal-overlay" onClick={() => setActiveReceiptOrder(null)}>
          <div style={{ background: '#ffffff', width: '560px', maxWidth: '90vw', borderRadius: '8px', padding: '1.8rem', boxShadow: 'var(--shadow-modal)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e7e7e7', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Tax Invoice / Receipt</h3>
                <span style={{ fontSize: '0.8rem', color: '#565959' }}>Order ID: #{activeReceiptOrder.order_id}</span>
              </div>
              <button type="button" className="modal-close-x" onClick={() => setActiveReceiptOrder(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '0.88rem', marginBottom: '1rem' }}>
              <p><strong>Billed To:</strong> {activeReceiptOrder.customer_name} ({activeReceiptOrder.customer_email})</p>
              <p><strong>Shipping Address:</strong> {activeReceiptOrder.shipping_address}</p>
              <p><strong>Payment Method:</strong> {activeReceiptOrder.payment_method}</p>
              <p><strong>Tracking:</strong> {activeReceiptOrder.tracking_number} ({activeReceiptOrder.carrier})</p>
            </div>

            <table className="admin-table" style={{ marginBottom: '1rem' }}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {activeReceiptOrder.items.map((it, idx) => (
                  <tr key={idx}>
                    <td>{it.title}</td>
                    <td>{it.quantity}</td>
                    <td>{formatCurrency(it.price * it.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, borderTop: '1px solid #e7e7e7', paddingTop: '0.8rem' }}>
              <span>Total Paid:</span>
              <span style={{ color: 'var(--amazon-price-red)' }}>{formatCurrency(activeReceiptOrder.total)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '1.2rem' }}>
              <button type="button" className="price-go-btn" onClick={() => window.print()} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Printer size={14} /> Print Invoice
              </button>
              <button type="button" className="amazon-yellow-btn" style={{ maxWidth: '100px' }} onClick={() => setActiveReceiptOrder(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PRODUCT MODAL DIALOG */}
      {isAddProductModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddProductModalOpen(false)}>
          <div className="add-product-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="add-product-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={18} />
                <span>Add New Product to Store Catalog</span>
              </h3>
              <button 
                type="button" 
                className="modal-close-x" 
                style={{ color: '#ffffff' }}
                onClick={() => setIsAddProductModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="add-product-body">
              {/* Quick Fill Templates */}
              <div className="template-quickfill-container">
                <div className="template-quickfill-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#de7921" />
                  <span>1-Click Preset Templates (Click to Autocomplete)</span>
                </div>
                <div className="template-quickfill-chips">
                  {PRODUCT_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.name}
                      type="button"
                      className="template-chip"
                      onClick={() => applyProductTemplate(tpl)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <span>{tpl.icon}</span>
                      <span>{tpl.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Creation Form */}
              <form onSubmit={handleAddProduct}>
                <div className="amazon-form-group">
                  <label>
                    Product Title <span style={{ color: '#cc0c39' }}>*</span>
                  </label>
                  <input 
                    type="text"
                    className="amazon-form-input"
                    placeholder="e.g. Apple iPhone 15 Pro 128GB Black Titanium"
                    value={newProductForm.title}
                    onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid-2col">
                  <div className="amazon-form-group">
                    <label>
                      Category / Department <span style={{ color: '#cc0c39' }}>*</span>
                    </label>
                    <select
                      className="amazon-form-input"
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="Fashion">Fashion</option>
                      <option value="Beauty">Beauty & Personal Care</option>
                      <option value="Sports">Sports & Outdoors</option>
                      <option value="Books">Books & Media</option>
                      <option value="__custom__">+ Add Custom Category...</option>
                    </select>
                  </div>

                  {newProductForm.category === '__custom__' && (
                    <div className="amazon-form-group">
                      <label>New Category Name <span style={{ color: '#cc0c39' }}>*</span></label>
                      <input 
                        type="text"
                        className="amazon-form-input"
                        placeholder="e.g. Smart Home"
                        value={newProductForm.customCategory}
                        onChange={(e) => setNewProductForm({ ...newProductForm, customCategory: e.target.value })}
                        required
                      />
                    </div>
                  )}

                  <div className="amazon-form-group">
                    <label>
                      Base Price (in INR ₹) <span style={{ color: '#cc0c39' }}>*</span>
                    </label>
                    <input 
                      type="number"
                      step="0.01"
                      min="1"
                      className="amazon-form-input"
                      placeholder="e.g. 1999"
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="amazon-form-group">
                    <label>Initial Stock Inventory</label>
                    <input 
                      type="number"
                      min="0"
                      className="amazon-form-input"
                      placeholder="e.g. 25"
                      value={newProductForm.stock}
                      onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                    />
                  </div>
                </div>

                <div className="amazon-form-group">
                  <label>
                    Primary Image URL (Direct image link, Amazon URL, or upload file) <span style={{ color: '#cc0c39' }}>*</span>
                  </label>
                  <input 
                    type="text"
                    className="amazon-form-input"
                    placeholder="Paste image link, Amazon product URL, or click upload below..."
                    value={newProductForm.image_url}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const resolved = autoResolveImageUrl(raw);
                      setNewProductForm({ ...newProductForm, image_url: resolved });
                      if (resolved !== raw.trim() && resolved.includes('m.media-amazon.com')) {
                        showToast('✨ Auto-detected Amazon product page! Converted to high-res photo.', 'success');
                      }
                    }}
                    required
                  />

                  {/* 1-Click Image Pickers & Device File Upload */}
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <label className="price-go-btn" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', background: '#f8fafc', border: '1px solid #cbd5e1' }}>
                      <Upload size={12} /> Upload from Device
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setNewProductForm({ ...newProductForm, image_url: ev.target.result });
                              showToast('Custom photo loaded successfully from device!', 'success');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Quick Photos:</span>
                    <button 
                      type="button" 
                      className="price-go-btn" 
                      style={{ fontSize: '0.74rem', background: '#fef3c7', color: '#92400e', borderColor: '#fde68a', fontWeight: 700 }}
                      onClick={() => {
                        setNewProductForm({ ...newProductForm, image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80' });
                        showToast('Loaded Luxury Sunglasses photo!', 'info');
                      }}
                    >
                      🕶️ Sunglasses
                    </button>
                    <button 
                      type="button" 
                      className="price-go-btn" 
                      style={{ fontSize: '0.74rem', background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
                      onClick={() => {
                        setNewProductForm({ ...newProductForm, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' });
                        showToast('Loaded Smart Watch photo!', 'info');
                      }}
                    >
                      ⌚ Smart Watch
                    </button>
                    <button 
                      type="button" 
                      className="price-go-btn" 
                      style={{ fontSize: '0.74rem', background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
                      onClick={() => {
                        setNewProductForm({ ...newProductForm, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' });
                        showToast('Loaded Audio Headphones photo!', 'info');
                      }}
                    >
                      🎧 Headphones
                    </button>
                    <button 
                      type="button" 
                      className="price-go-btn" 
                      style={{ fontSize: '0.74rem', background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
                      onClick={() => {
                        setNewProductForm({ ...newProductForm, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' });
                        showToast('Loaded Sports Running Shoes photo!', 'info');
                      }}
                    >
                      👟 Sports Shoes
                    </button>
                    <button 
                      type="button" 
                      className="price-go-btn" 
                      style={{ fontSize: '0.74rem', background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
                      onClick={() => {
                        setNewProductForm({ ...newProductForm, image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80' });
                        showToast('Loaded Sunglasses photo!', 'info');
                      }}
                    >
                      🕶️ Sunglasses
                    </button>
                    <button 
                      type="button" 
                      className="price-go-btn" 
                      style={{ fontSize: '0.74rem', background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
                      onClick={() => {
                        setNewProductForm({ ...newProductForm, image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80' });
                        showToast('Loaded Fashion Apparel photo!', 'info');
                      }}
                    >
                      👕 Fashion
                    </button>
                  </div>

                  {/* Visual Image Preview */}
                  {newProductForm.image_url && (
                    <div className="product-img-preview-container" style={{ marginTop: '0.8rem' }}>
                      <img 
                        src={autoResolveImageUrl(newProductForm.image_url, newProductForm.title, newProductForm.category)} 
                        alt="Product preview" 
                        className="product-img-preview-thumb"
                        onError={(e) => handleImageError(e, newProductForm.title, newProductForm.category, newProductForm.image_url)}
                      />
                      <div className="product-img-preview-info">
                        <strong>Image Preview Verified</strong>
                        <div>Looks great! This image will appear across search rails, catalog listings, and buy box.</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="amazon-form-group">
                  <label>
                    Product Description & Key Features <span style={{ color: '#cc0c39' }}>*</span>
                  </label>
                  <textarea 
                    className="amazon-form-input"
                    rows="3"
                    placeholder="Enter key selling points, specifications, and warranty details..."
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="amazon-form-group">
                  <label>Additional Gallery Image URLs (Optional, one per line)</label>
                  <textarea 
                    className="amazon-form-input"
                    rows="2"
                    placeholder="https://images.unsplash.com/... (optional extra angles)"
                    value={newProductForm.extraImages}
                    onChange={(e) => setNewProductForm({ ...newProductForm, extraImages: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem', borderTop: '1px solid #e7e7e7', paddingTop: '1rem' }}>
                  <button 
                    type="button" 
                    className="price-go-btn" 
                    onClick={() => setIsAddProductModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-add-product-pill"
                    disabled={isSubmittingProduct}
                    style={{ minWidth: '170px', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Check size={14} />
                    <span>{isSubmittingProduct ? 'Adding Product...' : 'Add Product (Admin Verified)'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL DIALOG */}
      {isEditProductModalOpen && editingProduct && (
        <div className="modal-overlay" onClick={() => setIsEditProductModalOpen(false)}>
          <div className="add-product-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="add-product-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} />
                <span>Edit Product Details (ID: #{editingProduct.id})</span>
              </h3>
              <button 
                type="button" 
                className="modal-close-x" 
                style={{ color: '#ffffff' }}
                onClick={() => setIsEditProductModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="add-product-body">
              <form onSubmit={handleSaveProductEdit}>
                <div className="amazon-form-group">
                  <label>
                    Product Title <span style={{ color: '#cc0c39' }}>*</span>
                  </label>
                  <input 
                    type="text"
                    className="amazon-form-input"
                    value={editProductForm.title}
                    onChange={(e) => setEditProductForm({ ...editProductForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid-2col">
                  <div className="amazon-form-group">
                    <label>
                      Category / Department <span style={{ color: '#cc0c39' }}>*</span>
                    </label>
                    <select
                      className="amazon-form-input"
                      value={editProductForm.category}
                      onChange={(e) => setEditProductForm({ ...editProductForm, category: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="Fashion">Fashion</option>
                      <option value="Beauty">Beauty & Personal Care</option>
                      <option value="Sports">Sports & Outdoors</option>
                      <option value="Books">Books & Media</option>
                      <option value="__custom__">+ Add Custom Category...</option>
                    </select>
                  </div>

                  {editProductForm.category === '__custom__' && (
                    <div className="amazon-form-group">
                      <label>New Category Name <span style={{ color: '#cc0c39' }}>*</span></label>
                      <input 
                        type="text"
                        className="amazon-form-input"
                        placeholder="e.g. Smart Home"
                        value={editProductForm.customCategory}
                        onChange={(e) => setEditProductForm({ ...editProductForm, customCategory: e.target.value })}
                        required
                      />
                    </div>
                  )}

                  <div className="amazon-form-group">
                    <label>
                      Base Price (in INR ₹) <span style={{ color: '#cc0c39' }}>*</span>
                    </label>
                    <input 
                      type="number"
                      step="0.01"
                      min="1"
                      className="amazon-form-input"
                      value={editProductForm.price}
                      onChange={(e) => setEditProductForm({ ...editProductForm, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="amazon-form-group">
                    <label>Available Stock Inventory</label>
                    <input 
                      type="number"
                      min="0"
                      className="amazon-form-input"
                      value={editProductForm.stock}
                      onChange={(e) => setEditProductForm({ ...editProductForm, stock: e.target.value })}
                    />
                  </div>
                </div>

                <div className="amazon-form-group">
                  <label>
                    Primary Image URL (Direct image link, Amazon URL, or upload file) <span style={{ color: '#cc0c39' }}>*</span>
                  </label>
                  <input 
                    type="text"
                    className="amazon-form-input"
                    value={editProductForm.image_url}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const resolved = autoResolveImageUrl(raw);
                      setEditProductForm({ ...editProductForm, image_url: resolved });
                      if (resolved !== raw.trim() && resolved.includes('m.media-amazon.com')) {
                        showToast('✨ Auto-detected Amazon product page! Converted to high-res photo.', 'success');
                      }
                    }}
                    required
                  />

                  {/* 1-Click Image Pickers & Device File Upload */}
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <label className="price-go-btn" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', background: '#f8fafc', border: '1px solid #cbd5e1' }}>
                      <Upload size={12} /> Upload from Device
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setEditProductForm({ ...editProductForm, image_url: ev.target.result });
                              showToast('Custom photo loaded successfully from device!', 'success');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Quick Photos:</span>
                    <button 
                      type="button" 
                      className="price-go-btn" 
                      style={{ fontSize: '0.74rem', background: '#fef3c7', color: '#92400e', borderColor: '#fde68a', fontWeight: 700 }}
                      onClick={() => {
                        setEditProductForm({ ...editProductForm, image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80' });
                        showToast('Loaded Luxury Sunglasses photo!', 'info');
                      }}
                    >
                      🕶️ Sunglasses
                    </button>
                    <button 
                      type="button" 
                      className="price-go-btn" 
                      style={{ fontSize: '0.74rem', background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
                      onClick={() => {
                        setEditProductForm({ ...editProductForm, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' });
                        showToast('Loaded Smart Watch photo!', 'info');
                      }}
                    >
                      ⌚ Smart Watch
                    </button>
                    <button 
                      type="button" 
                      className="price-go-btn" 
                      style={{ fontSize: '0.74rem', background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
                      onClick={() => {
                        setEditProductForm({ ...editProductForm, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' });
                        showToast('Loaded Audio Headphones photo!', 'info');
                      }}
                    >
                      🎧 Headphones
                    </button>
                    <button 
                      type="button" 
                      className="price-go-btn" 
                      style={{ fontSize: '0.74rem', background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
                      onClick={() => {
                        setEditProductForm({ ...editProductForm, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' });
                        showToast('Loaded Sports Running Shoes photo!', 'info');
                      }}
                    >
                      👟 Sports Shoes
                    </button>
                    <button 
                      type="button" 
                      className="price-go-btn" 
                      style={{ fontSize: '0.74rem', background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
                      onClick={() => {
                        setEditProductForm({ ...editProductForm, image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80' });
                        showToast('Loaded Sunglasses photo!', 'info');
                      }}
                    >
                      🕶️ Sunglasses
                    </button>
                    <button 
                      type="button" 
                      className="price-go-btn" 
                      style={{ fontSize: '0.74rem', background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
                      onClick={() => {
                        setEditProductForm({ ...editProductForm, image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80' });
                        showToast('Loaded Fashion Apparel photo!', 'info');
                      }}
                    >
                      👕 Fashion
                    </button>
                  </div>

                  {/* Visual Image Preview */}
                  {editProductForm.image_url && (
                    <div className="product-img-preview-container" style={{ marginTop: '0.8rem' }}>
                      <img 
                        src={autoResolveImageUrl(editProductForm.image_url, editProductForm.title, editProductForm.category)} 
                        alt="Product preview" 
                        className="product-img-preview-thumb"
                        onError={(e) => handleImageError(e, editProductForm.title, editProductForm.category, editProductForm.image_url)}
                      />
                      <div className="product-img-preview-info">
                        <strong>Live Image Preview</strong>
                        <div>Changes will update instantly across the entire store catalog.</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="amazon-form-group">
                  <label>
                    Product Description & Specifications <span style={{ color: '#cc0c39' }}>*</span>
                  </label>
                  <textarea 
                    className="amazon-form-input"
                    rows="3"
                    value={editProductForm.description}
                    onChange={(e) => setEditProductForm({ ...editProductForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="amazon-form-group">
                  <label>Gallery Image URLs (One URL per line)</label>
                  <textarea 
                    className="amazon-form-input"
                    rows="2"
                    placeholder="https://images.unsplash.com/... (optional gallery angles)"
                    value={editProductForm.extraImages}
                    onChange={(e) => setEditProductForm({ ...editProductForm, extraImages: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem', borderTop: '1px solid #e7e7e7', paddingTop: '1rem' }}>
                  <button 
                    type="button" 
                    className="price-go-btn" 
                    onClick={() => setIsEditProductModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-add-product-pill"
                    disabled={isSavingProductEdit}
                    style={{ minWidth: '170px', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Save size={14} />
                    <span>{isSavingProductEdit ? 'Saving Changes...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* AMAZON 4-COLUMN FOOTER */}
      <footer className="amazon-footer">
        <div className="footer-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to top
        </div>

        <div className="footer-main-links">
          <div className="footer-col">
            <h5>Get to Know Us</h5>
            <ul>
              <li><button type="button" className="footer-btn-link" onClick={() => showToast('Big Deal India: Nationwide hyper-fast shopping portal with 100% verified authentic brands.', 'info')}>About Big Deal</button></li>
              <li><button type="button" className="footer-btn-link" onClick={() => showToast('Careers at Big Deal: Open roles in Engineering, Supply Chain & Product Design.', 'info')}>Careers</button></li>
              <li><button type="button" className="footer-btn-link" onClick={() => showToast('Press Releases: Big Deal introduces Next-Gen instant delivery across 50+ cities.', 'info')}>Press Releases</button></li>
              <li><button type="button" className="footer-btn-link" onClick={() => showToast('Big Deal Science: Sustainable zero-emission electric delivery fleet.', 'info')}>Big Deal Science</button></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Connect with Us</h5>
            <ul>
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter / X</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Make Money with Us</h5>
            <ul>
              <li><button type="button" className="footer-btn-link" onClick={() => { setActiveView('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Sell on Big Deal (Admin Console)</button></li>
              <li><button type="button" className="footer-btn-link" onClick={() => showToast('Affiliate Program: Earn up to 10% commission on qualifying referrals.', 'success')}>Become an Affiliate</button></li>
              <li><button type="button" className="footer-btn-link" onClick={() => showToast('Fulfilment by Big Deal (FBD): Store inventory with us, we ship & deliver in 24 hrs.', 'info')}>Fulfilment by Big Deal</button></li>
              <li><button type="button" className="footer-btn-link" onClick={() => showToast('Sponsored Ads: Boost your brand visibility on high-intent search keywords.', 'info')}>Advertise Your Products</button></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Let Us Help You</h5>
            <ul>
              <li><button type="button" className="footer-btn-link" onClick={() => showToast('Safety & Hygiene: Contactless doorstep handoff and automated tracking enabled.', 'info')}>COVID-19 & Safety Protocols</button></li>
              <li><button type="button" className="footer-btn-link" onClick={() => { setActiveView('account'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Your Account</button></li>
              <li><button type="button" className="footer-btn-link" onClick={() => { setActiveView('account'); setAccountSubTab('orders'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Returns Centre</button></li>
              <li><button type="button" className="footer-btn-link" onClick={() => showToast('100% Purchase Protection: Guaranteed genuine products & verified seller warranty.', 'success')}>100% Purchase Protection</button></li>
              <li><button type="button" className="footer-btn-link" onClick={() => { setActiveView('account'); setAccountSubTab('profile'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Help & Customer Care</button></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-brand-row">
            <div className="amazon-logo-brand" style={{ fontSize: '1.2rem' }}>
              <span>bigdeal<span className="domain">.in</span></span>
            </div>
            <button 
              type="button" 
              className="price-go-btn" 
              style={{ background: 'transparent', color: '#ffffff', borderColor: '#888888', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              onClick={() => setIsCurrencyModalOpen(true)}
            >
              <Globe size={14} />
              <span>English - {currency} ({CURRENCY_CONFIG[currency]?.symbol})</span>
            </button>
            <button 
              type="button" 
              className="price-go-btn" 
              style={{ background: 'transparent', color: '#ffffff', borderColor: '#888888', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              onClick={() => setIsLocationModalOpen(true)}
            >
              <Globe size={14} />
              <span>India</span>
            </button>
          </div>

        <div className="footer-legal-links">
          <a href="#terms">Conditions of Use & Sale</a>
          <a href="#privacy">Privacy Notice</a>
          <a href="#ads">Interest-Based Ads</a>
        </div>
        <div>© 1996-2026, BigDeal.com, Inc. or its affiliates</div>
      </div>
    </footer>

    {/* PRODUCT COMPARISON BOTTOM FLOATING DOCK */}
    {comparedProducts.length > 0 && (
      <aside className="compare-bottom-dock">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scale size={18} color="#febd69" />
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Compare Products ({comparedProducts.length}/4)</span>
        </div>
        <div className="compare-items-thumbs">
          {comparedProducts.map((p) => (
            <div key={p.id} className="compare-thumb-box" title={p.title}>
              <img src={p.image_url} alt={p.title} className="compare-thumb-img" />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="compare-launch-btn"
          onClick={() => setIsCompareModalOpen(true)}
        >
          <Sparkles size={14} /> Compare Now
        </button>
        <button
          type="button"
          className="compare-clear-btn"
          onClick={clearCompareProducts}
        >
          Clear all
        </button>
      </aside>
    )}

    {/* BIG DEAL LENS (VISUAL IMAGE SEARCH) MODAL */}
    {isLensOpen && (
      <div className="lens-modal-overlay" onClick={() => setIsLensOpen(false)}>
        <div className="lens-modal-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="lens-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="lens-badge-icon">
                <Camera size={20} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  Big Deal Lens <span className="lens-tag-pro">AI Visual Search</span>
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Search any item by photo, screenshot, or sample image</span>
              </div>
            </div>
            <button type="button" className="quickview-close-btn" onClick={() => setIsLensOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="lens-body-layout">
            {/* Left: Upload Dropzone & Sample Presets */}
            <div className="lens-upload-panel">
              <label className="lens-dropzone">
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        handleRunLensSearch(ev.target.result, file.name);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div className="lens-dropzone-inner">
                  <div className="lens-radar-icon">
                    <Scan size={32} color="#0284c7" />
                  </div>
                  <strong>Upload or Drop an Image Here</strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Supports PNG, JPG, WEBP, or Screenshots</span>
                  <span className="btn-lens-choose-file">
                    <Upload size={13} style={{ marginRight: 4 }} /> Browse Device Files
                  </span>
                </div>
              </label>

              {/* Sample Preset Visual Cards */}
              <div style={{ marginTop: '0.8rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={13} color="#f59e0b" /> Or Click a Sample Photo:
                </span>
                <div className="lens-preset-grid">
                  {LENS_SAMPLE_PRESETS.map((preset, idx) => (
                    <div 
                      key={idx} 
                      className={`lens-preset-card ${lensSelectedImg === preset.image ? 'active' : ''}`}
                      onClick={() => handleRunLensSearch(preset.image, preset.category)}
                    >
                      <img src={preset.image} alt={preset.label} className="lens-preset-thumb" />
                      <div className="lens-preset-info">
                        <strong>{preset.label}</strong>
                        <span>{preset.tag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Scanning State & Matched Results */}
            <div className="lens-results-panel">
              {lensSelectedImg ? (
                <>
                  {/* Active Scanned Preview */}
                  <div className="lens-active-scan-box">
                    <div className="lens-preview-img-wrap">
                      <img src={lensSelectedImg} alt="Scanned Target" className="lens-preview-img" />
                      {isLensScanning && <div className="lens-scanning-laser-line"></div>}
                    </div>

                    <div className="lens-scan-details">
                      {isLensScanning ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <RefreshCw size={14} className="spin-animate" /> Scanning visual contours & textures...
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Matching against store inventory & color spectrums</span>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 800, textTransform: 'uppercase' }}>
                            ✓ Visual Recognition Complete
                          </div>
                          <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{lensDetectedTag}</strong>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                            Ranked by visual similarity, silhouette matching & category relevance.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Results List */}
                  {!isLensScanning && (
                    <div className="lens-matches-scroll">
                      <h4 style={{ fontSize: '0.92rem', margin: '0.6rem 0 0.4rem', color: '#334155' }}>
                        Top Matching Products ({lensMatches.length})
                      </h4>
                      <div className="lens-matches-grid">
                        {lensMatches.map((item) => (
                          <div key={item.id} className="lens-match-card">
                            <div className="lens-match-top-badge">
                              <span className="lens-match-pct-pill">{item.matchScore}% Match</span>
                              <span className="lens-match-tag-pill">{item.visualTags}</span>
                            </div>

                            <div className="lens-match-img-wrap" onClick={() => {
                              openProductDetails(item);
                              setIsLensOpen(false);
                            }}>
                              <img src={item.image_url} alt={item.title} className="lens-match-img" />
                            </div>

                            <div className="lens-match-body">
                              <h5 className="lens-match-title" onClick={() => {
                                openProductDetails(item);
                                setIsLensOpen(false);
                              }}>
                                {item.title}
                              </h5>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                <strong style={{ color: 'var(--amazon-price-red)', fontSize: '0.95rem' }}>
                                  {formatCurrency(item.price)}
                                </strong>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{renderStars(item.average_rating || 4.5, 11)}</span>
                              </div>

                              <div style={{ display: 'flex', gap: '5px', marginTop: '6px' }}>
                                <button 
                                  type="button" 
                                  className="amazon-yellow-btn" 
                                  style={{ flex: 1, padding: '4px 8px', fontSize: '0.78rem', fontWeight: 700 }}
                                  onClick={() => {
                                    addToCart(item);
                                    showToast(`Added ${item.title.slice(0, 18)}... to cart!`, 'success');
                                  }}
                                >
                                  + Add to Cart
                                </button>
                                <button 
                                  type="button" 
                                  className="price-go-btn"
                                  style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                                  onClick={() => {
                                    openProductDetails(item);
                                    setIsLensOpen(false);
                                  }}
                                >
                                  Inspect
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Empty state */
                <div className="lens-empty-prompt">
                  <Scan size={48} strokeWidth={1.5} color="#94a3b8" />
                  <h4 style={{ margin: '0.6rem 0 0.2rem', color: '#334155' }}>Select or Upload an Image to Start</h4>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: '280px', margin: 0 }}>
                    Big Deal Lens automatically extracts shapes, colors, and product classes to find identical and similar items instantly.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* SIDE-BY-SIDE PRODUCT COMPARISON MODAL */}
    {isCompareModalOpen && (
      <div className="compare-modal-overlay" onClick={() => setIsCompareModalOpen(false)}>
        <div className="compare-modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="compare-modal-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scale size={20} color="#2563eb" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Side-by-Side Product Comparison Matrix</h3>
            </div>
            <button 
              type="button" 
              className="quickview-close-btn" 
              onClick={() => setIsCompareModalOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="compare-matrix-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th className="compare-row-header">Feature</th>
                  {comparedProducts.map((prod) => (
                    <th key={prod.id} style={{ minWidth: '220px', maxWidth: '260px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <img 
                          src={prod.image_url} 
                          alt={prod.title} 
                          style={{ height: '140px', objectFit: 'contain', background: '#f8fafc', borderRadius: '8px', padding: '6px' }} 
                        />
                        <span style={{ fontWeight: 700, fontSize: '0.92rem', lineHeight: 1.3 }}>{prod.title}</span>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                          <button
                            type="button"
                            className="amazon-yellow-btn"
                            style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.82rem' }}
                            onClick={() => {
                              addToCart(prod);
                              showToast(`Added ${prod.title.slice(0, 20)}... to cart`, 'success');
                            }}
                          >
                            Add to Cart
                          </button>
                          <button
                            type="button"
                            className="price-go-btn"
                            style={{ padding: '0.4rem 0.6rem' }}
                            onClick={() => toggleCompareProduct(prod)}
                            title="Remove from comparison"
                          >
                            <Trash2 size={14} color="#ef4444" />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="compare-row-header">Price</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id}>
                      <strong style={{ fontSize: '1.2rem', color: 'var(--amazon-price-red)' }}>
                        {formatCurrency(p.price)}
                      </strong>
                      <div style={{ fontSize: '0.78rem', color: '#565959' }}>Inclusive of all taxes</div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="compare-row-header">Customer Rating</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {renderStars(p.average_rating || 4.5)}
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{p.average_rating || 4.5}</span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--amazon-link)' }}>
                        ({p.reviews_count || 120} verified reviews)
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="compare-row-header">Department</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id}>
                      <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 600 }}>
                        {p.category || 'General'}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="compare-row-header">Stock Status</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id}>
                      {(p.stock || 10) > 0 ? (
                        <span style={{ color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} /> In Stock ({p.stock || 10} units)
                        </span>
                      ) : (
                        <span style={{ color: '#ef4444', fontWeight: 700 }}>Out of Stock</span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="compare-row-header">Delivery Speed</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#00a8e1', fontWeight: 800, fontSize: '0.85rem' }}>
                        <Truck size={14} /> PRIME FREE
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#475569' }}>Guaranteed 24-hr Doorstep Delivery</span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="compare-row-header">Key Specifications</td>
                  {comparedProducts.map((p) => {
                    const specs = PRODUCT_SPECS[p.category] || PRODUCT_SPECS["Default"];
                    return (
                      <td key={p.id}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {Object.entries(specs).map(([k, v]) => (
                            <li key={k}>
                              <strong style={{ color: '#475569' }}>{k}:</strong> {v}
                            </li>
                          ))}
                        </ul>
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="compare-row-header">Return Policy</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} style={{ fontSize: '0.82rem', color: '#475569' }}>
                      <RotateCcw size={13} style={{ verticalAlign: 'middle', marginRight: 4, color: '#059669' }} />
                      7 Days Replacement / 30 Days Full Refund Guarantee
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}

    {/* GAMIFIED SPIN & WIN LUCKY WHEEL MODAL */}
    {isSpinWheelOpen && (
      <div className="spin-wheel-overlay" onClick={() => !isSpinning && setIsSpinWheelOpen(false)}>
        <div className="spin-wheel-modal" onClick={(e) => e.stopPropagation()}>
          <button 
            type="button" 
            className="spin-wheel-close" 
            onClick={() => !isSpinning && setIsSpinWheelOpen(false)}
            disabled={isSpinning}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
            <PartyPopper size={24} color="#f59e0b" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Big Deal Lucky Spin & Win</h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#9ca3af', maxWidth: '380px' }}>
            Spin the wheel to unlock guaranteed checkout coupon codes & free Prime express upgrades!
          </p>

          <div className="wheel-container-relative">
            <div className="wheel-pointer"></div>
            
            {/* SVG Wheel Visual */}
            <svg 
              className="wheel-canvas" 
              viewBox="0 0 300 300"
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              {WHEEL_PRIZES.map((prize, idx) => {
                const angle = 360 / WHEEL_PRIZES.length;
                const startAngle = idx * angle;
                const endAngle = (idx + 1) * angle;
                const startRad = (startAngle - 90) * (Math.PI / 180);
                const endRad = (endAngle - 90) * (Math.PI / 180);
                const x1 = 150 + 140 * Math.cos(startRad);
                const y1 = 150 + 140 * Math.sin(startRad);
                const x2 = 150 + 140 * Math.cos(endRad);
                const y2 = 150 + 140 * Math.sin(endRad);
                const textAngle = startAngle + angle / 2;

                return (
                  <g key={prize.text}>
                    <path
                      d={`M 150 150 L ${x1} ${y1} A 140 140 0 0 1 ${x2} ${y2} Z`}
                      fill={prize.color}
                      stroke="#111827"
                      strokeWidth="2"
                    />
                    <text
                      x="150"
                      y="45"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="800"
                      textAnchor="middle"
                      transform={`rotate(${textAngle}, 150, 150)`}
                    >
                      {prize.text}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="wheel-center-hub" onClick={spinWheel} style={{ cursor: isSpinning ? 'not-allowed' : 'pointer' }}>
              SPIN
            </div>
          </div>

          <button
            type="button"
            className="spin-trigger-btn"
            onClick={spinWheel}
            disabled={isSpinning}
          >
            <Zap size={18} />
            <span>{isSpinning ? 'SPINNING THE WHEEL...' : 'SPIN THE WHEEL NOW'}</span>
          </button>

          {/* Won Reward Display */}
          {wonReward && (
            <div className="win-celebration-box">
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', marginBottom: '4px' }}>
                🎉 You Won {wonReward.text}!
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.8rem' }}>
                Use coupon code <code style={{ background: '#064e3b', color: '#34d399', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{wonReward.code}</code> at checkout for instant savings.
              </p>
              <button
                type="button"
                className="amazon-yellow-btn"
                style={{ width: '100%', fontWeight: 800, fontSize: '0.92rem' }}
                onClick={claimRewardPromo}
              >
                1-Click Apply Code to Cart & Shop
              </button>
            </div>
          )}
        </div>
      </div>
    )}

    {/* AI SHOPPING ASSISTANT ("BIGDEAL GENIUS AI") FLOATING FAB & DRAWER */}
    <button
      type="button"
      className="ai-assistant-fab"
      onClick={() => {
        setIsAIOpen((prev) => !prev);
        playAudioChime('click', soundEnabled);
      }}
      title="Chat with BigDeal Genius AI Shopping Assistant"
    >
      <Bot size={18} />
      <span>Genius AI</span>
      <span className="ai-fab-badge">PRO</span>
    </button>

    {isAIOpen && (
      <div className="ai-assistant-drawer">
        <div className="ai-drawer-header">
          <div className="ai-header-title">
            <Bot size={18} color="#febd69" />
            <div>
              <div>BigDeal Genius AI</div>
              <div className="ai-header-sub">Smart Shopping Companion</div>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setIsAIOpen(false)}
            style={{ color: '#ffffff', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="ai-messages-container">
          {aiMessages.map((msg) => (
            <div key={msg.id} className={`ai-msg ${msg.sender}`}>
              <div className="ai-bubble">
                {msg.text}

                {/* Render Embedded Recommendations if any */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {msg.recommendations.map((rec) => (
                      <div key={rec.id} className="ai-card-recommend">
                        <img src={rec.image_url} alt={rec.title} className="ai-card-thumb" />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {rec.title}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--amazon-price-red)', fontWeight: 700 }}>
                            {formatCurrency(rec.price)}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="amazon-yellow-btn"
                          style={{ padding: '3px 8px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                          onClick={() => {
                            addToCart(rec);
                            showToast(`Added ${rec.title.slice(0, 18)}... to cart`, 'success');
                          }}
                        >
                          + Cart
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isAiTyping && (
            <div className="ai-msg bot">
              <div className="ai-bubble" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontStyle: 'italic', color: '#64748b' }}>
                <Sparkles size={14} color="#f59e0b" />
                <span>Genius AI is analyzing catalog deals...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick-Prompt Preset Pills */}
        <div className="ai-prompts-row">
          {[
            "Deals under ₹2,000",
            "Best audio & ANC headphones",
            "Ergonomic work setup",
            "Smart fitness watches",
            "Top customer favorites"
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="ai-prompt-pill"
              onClick={() => handleAiSend(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* AI Input Form */}
        <form 
          className="ai-input-form" 
          onSubmit={(e) => {
            e.preventDefault();
            handleAiSend();
          }}
        >
          <input
            type="text"
            className="ai-chat-input"
            placeholder="Ask Genius AI anything..."
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
          />
          <button type="submit" className="ai-send-btn" disabled={!aiInput.trim() || isAiTyping}>
            <Send size={15} />
          </button>
        </form>
      </div>
    )}

    {/* INTERACTIVE EMI & BNPL CALCULATOR MODAL */}
    {isEmiModalOpen && (
      <div className="emi-modal-overlay" onClick={() => setIsEmiModalOpen(false)}>
        <div className="emi-modal-card" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={20} color="#2563eb" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>EMI Plans & Bank Offers</h3>
            </div>
            <button type="button" className="quickview-close-btn" onClick={() => setIsEmiModalOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div style={{ margin: '1rem 0', background: '#eff6ff', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#1e40af' }}>Product Amount:</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e3a8a' }}>
                {formatCurrency(activeModalProduct ? activeModalProduct.price : 24999)}
              </div>
            </div>
            <span style={{ fontSize: '0.78rem', background: '#dbeafe', color: '#1d4ed8', fontWeight: 700, padding: '4px 10px', borderRadius: '12px' }}>
              No-Cost EMI Active
            </span>
          </div>

          {/* Bank Selection Tabs */}
          <div className="emi-bank-tabs">
            {Object.keys(EMI_BANK_PLANS).map((b) => (
              <button
                key={b}
                type="button"
                className={`emi-bank-btn ${selectedEmiBank === b ? 'active' : ''}`}
                onClick={() => setSelectedEmiBank(b)}
              >
                {b === 'AMAZON_PAY' ? 'Big Deal Pay Later' : `${b} Bank`}
              </button>
            ))}
          </div>

          {/* EMI Tenure Table */}
          <table className="emi-tenure-table">
            <thead>
              <tr>
                <th>EMI Plan</th>
                <th>Monthly Installment</th>
                <th>Interest Rate</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {(EMI_BANK_PLANS[selectedEmiBank] || EMI_BANK_PLANS['HDFC']).map((plan) => {
                const prodPrice = activeModalProduct ? activeModalProduct.price : 24999;
                const monthlyPrincipal = prodPrice / plan.months;
                const monthlyInterest = (prodPrice * (plan.rate / 100)) / 12;
                const emiPerMonth = Math.round(monthlyPrincipal + monthlyInterest);
                const totalCalculated = Math.round(emiPerMonth * plan.months);

                return (
                  <tr key={plan.months}>
                    <td>
                      <strong>{plan.months} Months</strong>
                      {plan.noCost && (
                        <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', fontWeight: 800, padding: '1px 6px', borderRadius: '8px', marginLeft: '6px' }}>
                          NO COST
                        </span>
                      )}
                    </td>
                    <td><strong style={{ color: '#0f1111' }}>{formatCurrency(emiPerMonth)}/mo</strong></td>
                    <td>{plan.rate === 0 ? '0% Free' : `${plan.rate}% p.a.`}</td>
                    <td>{formatCurrency(totalCalculated)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '1rem', lineHeight: 1.5 }}>
            *No Cost EMI is available on qualifying Credit Cards. Bank processing fees may apply as per individual bank policy.
          </div>
        </div>
      </div>
    )}

    {/* BIG DEAL MINITV VIDEO SHOWCASE MODAL */}
    {isMiniTvOpen && (
      <div className="minitv-overlay" onClick={() => setIsMiniTvOpen(false)}>
        <div className="minitv-player-box" onClick={(e) => e.stopPropagation()}>
          <div style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111827', color: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tv size={18} color="#ec4899" />
              <strong style={{ fontSize: '1rem' }}>Big Deal miniTV Live Shopping Stream</strong>
            </div>
            <button type="button" className="quickview-close-btn" style={{ color: '#ffffff' }} onClick={() => setIsMiniTvOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="minitv-video-screen">
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80" 
              alt="Video Stream" 
              className="minitv-video-bg"
            />
            
            {/* Overlay Live Badge */}
            <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', gap: '8px' }}>
              <span className="minitv-live-tag">● LIVE DEMO</span>
              <span style={{ background: 'rgba(0,0,0,0.65)', color: '#ffffff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                👥 1,842 watching
              </span>
            </div>

            {/* Floating Buy Now / Add to Cart Card */}
            {miniTvProduct && (
              <div className="minitv-buy-card">
                <img 
                  src={miniTvProduct.image_url} 
                  alt={miniTvProduct.title} 
                  style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#ffffff', borderRadius: '6px' }} 
                />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {miniTvProduct.title}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#febd69', fontWeight: 800 }}>
                    {formatCurrency(miniTvProduct.price)}
                  </div>
                </div>
                <button
                  type="button"
                  className="amazon-yellow-btn"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', fontWeight: 700 }}
                  onClick={() => {
                    addToCart(miniTvProduct);
                    showToast(`Added ${miniTvProduct.title.slice(0, 18)}... to cart!`, 'success');
                  }}
                >
                  Buy in Stream
                </button>
              </div>
            )}

            {/* In-Video Overlay Controls */}
            <div className="minitv-overlay-controls">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff' }}>
                <button 
                  type="button" 
                  onClick={() => setIsPlayingMiniTv(!isPlayingMiniTv)}
                  style={{ color: '#ffffff', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  {isPlayingMiniTv ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Stream: "Hands-on Unboxing & Sound Quality Review"</span>
              </div>
              <button 
                type="button" 
                className="price-go-btn"
                style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', borderColor: 'transparent', fontSize: '0.78rem' }}
                onClick={() => showToast('Shared live stream link to clipboard!', 'info')}
              >
                <Share2 size={13} style={{ marginRight: 4 }} /> Share
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* PRINTABLE GST TAX INVOICE MODAL */}
    {isInvoiceModalOpen && invoiceOrder && (
      <div className="invoice-modal-overlay" onClick={() => setIsInvoiceModalOpen(false)}>
        <div className="invoice-sheet" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="amazon-logo-brand" style={{ fontSize: '1.4rem' }}>
              <span>bigdeal<span className="domain">.in</span></span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button" 
                className="amazon-yellow-btn" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.45rem 1rem' }}
                onClick={() => window.print()}
              >
                <Printer size={15} />
                <span>Print / Download PDF</span>
              </button>
              <button type="button" className="quickview-close-btn" onClick={() => setIsInvoiceModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="invoice-header-grid">
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Tax Invoice / Bill of Supply</h2>
              <div style={{ fontSize: '0.82rem', color: '#4b5563', marginTop: '4px' }}>
                <div><strong>Invoice Number:</strong> BD-IN-{invoiceOrder.order_id || '982341'}</div>
                <div><strong>Invoice Date:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div><strong>GSTIN:</strong> 29AABCB2212M1ZX • <strong>CIN:</strong> U74900KA2015PTC082000</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#4b5563' }}>
              <strong>Sold By:</strong>
              <div>Big Deal Retail India Pvt. Ltd.</div>
              <div>Amazon Gateway Logistics Campus</div>
              <div>Bangalore, Karnataka - 560068</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem' }}>
            <div>
              <strong>Billing Address:</strong>
              <div>{invoiceOrder.customer_name || 'Alex Rivera'}</div>
              <div>{shippingData.address}</div>
              <div>{shippingData.city}, {shippingData.state} - {shippingData.zipCode}</div>
              <div>Phone: {shippingData.phone}</div>
            </div>
            <div>
              <strong>Shipping & Delivery Details:</strong>
              <div>Carrier: {invoiceOrder.carrier || 'Big Deal Prime Express'}</div>
              <div>Tracking ID: <code>{invoiceOrder.tracking_number || 'BD-TRK-7749210'}</code></div>
              <div>Place of Supply: {shippingData.state || 'Tamil Nadu'} (State Code: 33)</div>
            </div>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>HSN</th>
                <th>Qty</th>
                <th>Gross (₹)</th>
                <th>CGST (9%)</th>
                <th>SGST (9%)</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {(invoiceOrder.items && invoiceOrder.items.length > 0 ? invoiceOrder.items : [
                { title: 'AeroPulse Chrono Precision Analog Watch', price: invoiceOrder.total || 499, qty: 1 }
              ]).map((it, idx) => {
                const itemGross = Math.round(it.price * 0.82);
                const itemCgst = Math.round(it.price * 0.09);
                const itemSgst = Math.round(it.price * 0.09);
                return (
                  <tr key={idx}>
                    <td><strong>{it.title}</strong></td>
                    <td><code>85183000</code></td>
                    <td>{it.qty || 1}</td>
                    <td>{formatCurrency(itemGross)}</td>
                    <td>{formatCurrency(itemCgst)}</td>
                    <td>{formatCurrency(itemSgst)}</td>
                    <td><strong>{formatCurrency(it.price * (it.qty || 1))}</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '1.5rem', borderTop: '2px solid #e2e8f0', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#f8fafc' }}>
                <QrCode size={48} color="#1e293b" />
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                <div>Scan QR to verify authentic GST invoice.</div>
                <div>Authorized Signatory for Big Deal Retail India.</div>
              </div>
            </div>

            <div style={{ width: '240px', fontSize: '0.9rem', lineHeight: 1.8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(invoiceOrder.total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery:</span>
                <span style={{ color: '#15803d' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '4px', fontWeight: 800, fontSize: '1.1rem' }}>
                <span>Grand Total:</span>
                <span style={{ color: 'var(--amazon-price-red)' }}>{formatCurrency(invoiceOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* REAL-TIME SOCIAL PROOF & LIVE ACTIVITY TICKER (Bottom-Left Floating Toast) */}
    {!isActivityDismissed && LIVE_PURCHASE_STREAM[liveActivityIndex] && (
      <div 
        className="live-activity-ticker" 
        onClick={() => openProductDetails(LIVE_PURCHASE_STREAM[liveActivityIndex].product)}
        title="Click to view product details"
      >
        <button 
          type="button" 
          className="activity-ticker-close"
          onClick={(e) => {
            e.stopPropagation();
            setIsActivityDismissed(true);
          }}
          title="Dismiss Live Purchase Feed"
        >
          <X size={12} />
        </button>

        <div className="activity-avatar-wrap">
          <span className="activity-avatar-emoji">{LIVE_PURCHASE_STREAM[liveActivityIndex].avatar}</span>
          <span className="activity-live-ping"></span>
        </div>

        <div className="activity-text-content">
          <div className="activity-top-row">
            <strong className="activity-user-name">{LIVE_PURCHASE_STREAM[liveActivityIndex].name}</strong>
            <span className="activity-city-pill">{LIVE_PURCHASE_STREAM[liveActivityIndex].city}</span>
            <span className="activity-time-text">{LIVE_PURCHASE_STREAM[liveActivityIndex].time}</span>
          </div>

          <div className="activity-prod-title">
            Just purchased <span style={{ color: '#007185', fontWeight: 700 }}>{LIVE_PURCHASE_STREAM[liveActivityIndex].product}</span>
          </div>

          <div className="activity-verified-row">
            <span className="activity-verified-badge">
              <CheckCircle2 size={11} color="#059669" /> Verified Prime Order
            </span>
            <span className="activity-price-tag">{formatCurrency(LIVE_PURCHASE_STREAM[liveActivityIndex].price)}</span>
          </div>
        </div>

        <img 
          src={LIVE_PURCHASE_STREAM[liveActivityIndex].image} 
          alt="Purchased product thumbnail" 
          className="activity-prod-thumb" 
        />
      </div>
    )}

    {/* FLOATING SMART ACTION DOCK */}
    <aside className={`floating-smart-dock ${showScrollTop ? 'visible' : ''}`} aria-label="Quick Actions">
      {cartCount > 0 && (
        <button 
          type="button" 
          className="dock-cart-btn"
          onClick={() => setIsCartOpen(true)}
          title={`View Cart (${cartCount} items • ${formatCurrency(cartTotal)})`}
        >
          <ShoppingCart size={18} />
          <span className="dock-cart-pill">{cartCount}</span>
          <span className="dock-cart-sum">{formatCurrency(cartTotal)}</span>
        </button>
      )}

      <button 
        type="button" 
        className="dock-action-btn"
        onClick={() => {
          setSoundEnabled((prev) => !prev);
          showToast(!soundEnabled ? 'Chime sound effects enabled' : 'Sound effects muted', 'info');
        }}
        title={soundEnabled ? 'Mute Audio Effects' : 'Enable Audio Chimes'}
      >
        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>

      <button 
        type="button" 
        className="dock-action-btn dock-scroll-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Scroll to Top"
      >
        <ArrowUp size={16} />
      </button>
    </aside>
  </div>
);
}

export default App;
