/* ==========================================================================
   AURA-WEAR CORE LOGIC SHEET (SIMULATED FULL-STACK & RAG ENGINE)
   ========================================================================== */

// --- Default Base Data Structures (Mock Database Tables) ---
// GSM weight levels (grade index 1-5 → actual GSM value)
const GSM_MAP = {
  1: { gsm: 150, label: '150 GSM – Ultra Light' },
  2: { gsm: 180, label: '180 GSM – Standard'    },
  3: { gsm: 220, label: '220 GSM – Mid-Heavy'   },
  4: { gsm: 240, label: '240 GSM – Heavy'        },
  5: { gsm: 300, label: '300 GSM – Premium'      }
};

// Shipping options available at checkout
const SHIPPING_OPTIONS = {
  'DHL Express':     { cost: 800,  eta: '2–3 days'  },
  'TCS Overnight':   { cost: 450,  eta: '1–2 days'  },
  'Leopards Courier':{ cost: 350,  eta: '3–5 days'  },
  'BlueEx':          { cost: 250,  eta: '5–7 days'  },
  'Standard Post':   { cost: 150,  eta: '7–10 days' }
};

const INITIAL_PRODUCTS = [
  { id: 'tshirt',       name: 'Aura Premium Streetwear Tee',      category: 'T-Shirt',        gender: 'Men',      basePrice: 1200, discountPercent: 0,  desc: 'Heavyweight 240GSM cotton t-shirt with drop shoulders and a boxy fit.',            img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60' },
  { id: 'hoodie',       name: 'Aura Signature Oversized Hoodie',   category: 'Hoodie',         gender: 'Unisex',   basePrice: 2500, discountPercent: 10, desc: 'Ultra-soft fleece hoodie featuring double-lined hood and kangaroo pocket.',        img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60' },
  { id: 'jacket',       name: 'Aura Technical Windbreaker',        category: 'Jacket',         gender: 'Men',      basePrice: 3500, discountPercent: 0,  desc: 'Weatherproof ripstop shell jacket with flatlock sealing and mesh insulation.',    img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60' },
  { id: 'uniform',      name: 'Aura V-Neck Athletic Jersey',       category: 'Sports Uniform', gender: 'Unisex',   basePrice: 1800, discountPercent: 0,  desc: 'Interlock polyester mesh jersey with anti-bacterial dry fit weave.',              img: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=500&auto=format&fit=crop&q=60' },
  { id: 'womens_tee',   name: "Aura Fitted Women's Tee",           category: 'T-Shirt',        gender: 'Women',    basePrice: 1100, discountPercent: 15, desc: 'Soft 180GSM fitted cotton tee with flattering cut, perfect for everyday style.', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f41?w=500&auto=format&fit=crop&q=60' },
  { id: 'kids_tee',     name: 'Aura Kids Graphic Tee',             category: 'T-Shirt',        gender: 'Children', basePrice: 700,  discountPercent: 0,  desc: 'Soft 160GSM kids cotton tee with vibrant screen-print graphics.',               img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&auto=format&fit=crop&q=60' },
  { id: 'womens_hoodie',name: "Aura Cropped Women's Hoodie",       category: 'Hoodie',         gender: 'Women',    basePrice: 2200, discountPercent: 0,  desc: 'Cozy cropped fleece hoodie with ribbed cuffs and relaxed silhouette.',          img: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&auto=format&fit=crop&q=60' },
];

const FABRICS_INFO = {
  cotton: { name: 'Combed Cotton', multiplier: 1.0, desc: 'Highly breathable, soft texture, perfect for summer tees.', recommend: 'summer, casual, everyday, heat, warm weather' },
  polyester: { name: 'Dry-Fit Polyester', multiplier: 0.9, desc: 'Moisture-wicking, stretchable, ideal for sportswear.', recommend: 'gym, running, sports, training, athletics, sweaty' },
  blended: { name: 'Poly-Cotton Blend', multiplier: 1.1, desc: 'Wrinkle-resistant, retains shape, versatile midweight.', recommend: 'spring, autumn, workwear, uniform, all-season' },
  fleece: { name: 'Brushed Fleece', multiplier: 1.3, desc: 'Heavy insulation, extremely cozy and warm for winter.', recommend: 'winter, cold, snow, insulation, warm, cozy' }
};

const FAQS_DB = [
  { question: 'delivery time shipping cost timeline', answer: 'Standard delivery across Pakistan takes 7 to 10 working days. Free shipping is provided for orders exceeding PKR 5,000, otherwise a flat rate of PKR 250 applies. We partner with DHL Express, TCS, Leopards, and BlueEx for reliable nationwide delivery.' },
  { question: 'return exchange policy size guide refund', answer: 'We offer a 14-day hassle-free return and exchange policy for items in original condition. Custom apparel with personalized logos or AI-generated designs can only be returned if there is a manufacturing defect. Contact support within 14 days of delivery to initiate a return.' },
  { question: 'bulk order pricing discounts wholesale', answer: 'Yes! We support bulk manufacturing. Orders of 10–49 units receive a 10% discount, and 50+ units receive a 20% discount. All bulk discounts are applied automatically at checkout. Contact our team for wholesale partnership inquiries.' },
  { question: 'care instructions wash guide laundry fabric', answer: 'For direct-to-garment (DTG) or screen-printed items, wash inside-out in cold water on a gentle cycle. Do not tumble dry on high heat — air dry or use low heat. Iron inside-out only to protect logos and print areas. Embroidered pieces can be washed normally.' },
  { question: 'ai image generation design prompt how to use', answer: 'Click the "AI Image Gen" button on the homepage or in the customizer. Select your garment type (T-Shirt, Hoodie, Jacket, or Jersey), type a description of your design (e.g. "galaxy nebula streetwear graphic"), and hit Generate. Your AI-generated design will appear in seconds. You can download it or apply it directly as a logo on your customized garment.' },
  { question: 'payment methods cod payfast online bank transfer', answer: 'AURA-WEAR accepts Cash on Delivery (COD) for all orders across Pakistan, and online payment via PayFast (debit/credit card and mobile wallets). COD orders are confirmed immediately; online payments are verified before production begins.' },
  { question: 'order cancellation how to cancel pending', answer: 'You can cancel an order that is still in Pending status from your Order History page — just click the Cancel button next to your order. Once an order moves to In Production status it cannot be cancelled. For urgent cases contact support.' },
  { question: 'order tracking status stages production', answer: 'Every order goes through five stages: Pending → In Production → Quality Check → Shipped → Delivered. You receive an email notification at each stage change. You can also ask our AI chatbot "Where is my order?" and it will fetch your latest status.' },
  { question: 'customization options fabric stitch print wash', answer: 'You can fully customize: Fabric Type (Cotton, Fleece, Dry-Fit Polyester, Ripstop, Linen), Fabric Grade (1–5 quality tiers), Primary & Secondary Colors, Stitching Style (Flatlock, Overlock, Chain, Double-needle, Standard), Print Method (DTG, Screen Print, Embroidery, Sublimation, Heat Transfer), and Wash Finish (Standard, Stone Wash, Acid Wash, Enzyme Wash). Pricing updates live as you adjust each option.' },
  { question: 'coupon promo code discount how to apply', answer: 'At the checkout page, enter your promo code in the "Coupon Code" field and click Apply. Valid codes will deduct either a fixed PKR amount or a percentage from your order total. Coupon codes are periodically shared via our social media and email newsletter.' },
  { question: 'account register signup login forgot password', answer: 'Click Sign In / Register in the top navigation. New users can register with their name, email, and a password (minimum 8 characters). If you forget your password, use "Forgot Password" to receive a 6-digit OTP on your email — enter the OTP to reset your password securely.' },
  { question: 'product categories garments available tshirt hoodie jacket jersey', answer: 'AURA-WEAR currently offers four garment categories: T-Shirts (Men, Women, Kids), Hoodies (Oversized & Cropped), Technical Jackets (Windbreaker), and Sports Uniforms (V-neck Athletic Jersey). All four can be fully customized through our 2D Canvas designer with live 3D preview.' }
];

const INITIAL_INVENTORY = [
  { type: 'Fabric', name: 'Combed Cotton (150–220 GSM)', stock: 450, reorder: 100, cost: 'Base Multiplier 1.0x', status: 'Healthy' },
  { type: 'Fabric', name: 'Brushed Fleece (240–300 GSM)', stock: 85, reorder: 120, cost: 'Base Multiplier 1.3x', status: 'Low Stock' },
  { type: 'Dye', name: 'Neon Teal Pigment', stock: 12, reorder: 5, cost: 'PKR 150/liter', status: 'Healthy' },
  { type: 'Print Ink', name: 'Direct-to-Garment Ink-set', stock: 3, reorder: 10, cost: 'PKR 1,500/cartridge', status: 'Low Stock' },
  { type: 'Stitch Thread', name: 'High-Tensile Poly-thread', stock: 1200, reorder: 300, cost: 'PKR 80/spool', status: 'Healthy' }
];

// --- Preset Graphics for Logo Placement ---
const LOGO_PRESETS = {
  cyberpunk: `
    <g transform="translate(10, 10) scale(0.8)">
      <polygon points="25,5 45,20 35,45 15,45 5,20" fill="none" stroke="currentColor" stroke-width="4"/>
      <line x1="25" y1="5" x2="25" y2="45" stroke="currentColor" stroke-width="3"/>
      <circle cx="25" cy="25" r="8" fill="currentColor"/>
    </g>
  `,
  streetwear: `
    <g transform="translate(10, 10) scale(0.8)">
      <path d="M 10 10 L 40 10 L 40 40 L 10 40 Z" fill="none" stroke="currentColor" stroke-width="4"/>
      <path d="M 25 5 L 45 25 L 25 45 L 5 25 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3,3"/>
      <text x="25" y="28" font-family="'Outfit', sans-serif" font-weight="900" font-size="16" text-anchor="middle" fill="currentColor">A</text>
    </g>
  `,
  athletic: `
    <g transform="translate(10, 10) scale(0.8)">
      <polygon points="30,5 10,28 25,28 15,45 40,20 22,20" fill="currentColor"/>
    </g>
  `
};

// --- Vector Apparel SVG Templates ---
const APPAREL_SVGS = {
  tshirt: {
    front: (primary, secondary, logoMarkup) => `
      <svg viewBox="0 0 350 430" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ts_vol" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.34)"/>
            <stop offset="14%"  stop-color="rgba(0,0,0,0.06)"/>
            <stop offset="50%"  stop-color="rgba(255,255,255,0.08)"/>
            <stop offset="86%"  stop-color="rgba(0,0,0,0.06)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.34)"/>
          </linearGradient>
          <linearGradient id="ts_vert" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stop-color="rgba(255,255,255,0.10)"/>
            <stop offset="24%"  stop-color="rgba(255,255,255,0.0)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.15)"/>
          </linearGradient>
          <linearGradient id="ts_slL" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.40)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.0)"/>
          </linearGradient>
          <linearGradient id="ts_slR" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.0)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.40)"/>
          </linearGradient>
          <radialGradient id="ts_chest" cx="50%" cy="30%" r="48%">
            <stop offset="0%"   stop-color="rgba(255,255,255,0.11)"/>
            <stop offset="100%" stop-color="rgba(255,255,255,0.0)"/>
          </radialGradient>
        </defs>

        <ellipse cx="175" cy="421" rx="118" ry="8" fill="rgba(0,0,0,0.26)"/>

        <!-- LEFT SLEEVE -->
        <path d="M 92,110 C 67,116 42,133 29,160 C 36,181 53,193 75,192 C 84,180 90,169 94,160 C 95,143 95,126 94,110 Z" fill="${primary}"/>
        <path d="M 92,110 C 67,116 42,133 29,160 C 36,181 53,193 75,192 C 84,180 90,169 94,160 C 95,143 95,126 94,110 Z" fill="url(#ts_slL)" opacity="0.9"/>
        <path d="M 29,160 C 36,181 53,193 75,192 L 71,184 C 53,185 39,173 34,155 Z" fill="${secondary}" opacity="0.85"/>
        <path d="M 32,162 C 39,179 54,189 73,189" fill="none" stroke="rgba(0,0,0,0.16)" stroke-width="1" stroke-dasharray="2.5,2.5"/>

        <!-- RIGHT SLEEVE -->
        <path d="M 258,110 C 283,116 308,133 321,160 C 314,181 297,193 275,192 C 266,180 260,169 256,160 C 255,143 255,126 256,110 Z" fill="${primary}"/>
        <path d="M 258,110 C 283,116 308,133 321,160 C 314,181 297,193 275,192 C 266,180 260,169 256,160 C 255,143 255,126 256,110 Z" fill="url(#ts_slR)" opacity="0.9"/>
        <path d="M 321,160 C 314,181 297,193 275,192 L 279,184 C 297,185 311,173 316,155 Z" fill="${secondary}" opacity="0.85"/>
        <path d="M 318,162 C 311,179 296,189 277,189" fill="none" stroke="rgba(0,0,0,0.16)" stroke-width="1" stroke-dasharray="2.5,2.5"/>

        <!-- MAIN BODY -->
        <path d="M 92,110 C 113,101 132,99 150,101 C 159,113 167,119 175,119 C 183,119 191,113 200,101 C 218,99 237,101 258,110 C 264,135 267,152 268,165 C 271,251 269,339 263,410 C 232,418 200,420 175,420 C 150,420 118,418 87,410 C 81,339 79,251 82,165 C 83,152 86,135 92,110 Z" fill="${primary}"/>
        <path d="M 92,110 C 113,101 132,99 150,101 C 159,113 167,119 175,119 C 183,119 191,113 200,101 C 218,99 237,101 258,110 C 264,135 267,152 268,165 C 271,251 269,339 263,410 C 232,418 200,420 175,420 C 150,420 118,418 87,410 C 81,339 79,251 82,165 C 83,152 86,135 92,110 Z" fill="url(#ts_vol)"/>
        <path d="M 92,110 C 113,101 132,99 150,101 C 159,113 167,119 175,119 C 183,119 191,113 200,101 C 218,99 237,101 258,110 C 264,135 267,152 268,165 C 271,251 269,339 263,410 C 232,418 200,420 175,420 C 150,420 118,418 87,410 C 81,339 79,251 82,165 C 83,152 86,135 92,110 Z" fill="url(#ts_vert)"/>
        <path d="M 92,110 C 113,101 132,99 150,101 C 159,113 167,119 175,119 C 183,119 191,113 200,101 C 218,99 237,101 258,110 C 264,135 267,152 268,165 C 271,251 269,339 263,410 C 232,418 200,420 175,420 C 150,420 118,418 87,410 C 81,339 79,251 82,165 C 83,152 86,135 92,110 Z" fill="url(#ts_chest)"/>

        <!-- SHOULDER SEAMS -->
        <path d="M 150,102 C 131,102 116,104 100,110" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M 200,102 C 219,102 234,104 250,110" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M 151,100 C 133,100 119,102 105,107" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M 199,100 C 217,100 231,102 245,107" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="3.5" stroke-linecap="round"/>

        <!-- RIBBED CREW COLLAR -->
        <path d="M 150,101 C 159,113 167,119 175,119 C 183,119 191,113 200,101 L 195,99 C 188,111 182,115 175,115 C 168,115 162,111 155,99 Z" fill="${secondary}"/>
        <path d="M 155,99 C 162,111 168,115 175,115 C 182,115 188,111 195,99" fill="none" stroke="rgba(0,0,0,0.32)" stroke-width="1.2"/>
        <path d="M 157,102 L 155,106 M 163,110 L 161,114 M 170,115 L 169,119 M 180,115 L 181,119 M 187,110 L 189,114 M 193,102 L 195,106" stroke="rgba(0,0,0,0.18)" stroke-width="0.9" stroke-linecap="round"/>

        <!-- SIDE & DRAPE FOLDS -->
        <path d="M 175,145 Q 173,250 175,330 Q 177,388 174,408" fill="none" stroke="rgba(0,0,0,0.07)" stroke-width="3" stroke-linecap="round"/>
        <path d="M 105,250 Q 116,300 103,360" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M 245,250 Q 234,300 247,360" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M 128,332 Q 148,350 162,362" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M 222,332 Q 202,350 188,362" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="1.8" stroke-linecap="round"/>

        <!-- HEM (double-needle) -->
        <path d="M 87,402 C 130,410 220,410 263,402 L 264,411 C 220,419 130,419 86,411 Z" fill="rgba(0,0,0,0.12)"/>
        <path d="M 88,404 C 130,411 220,411 262,404" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1" stroke-dasharray="3,2.5"/>
        <path d="M 88,409 C 130,416 220,416 262,409" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" stroke-dasharray="3,2.5"/>

        <g id="svg-logo-container">${logoMarkup}</g>
      </svg>
    `,
    back: (primary, secondary, logoMarkup) => `
      <svg viewBox="0 0 350 430" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tsb_vol" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.34)"/>
            <stop offset="14%"  stop-color="rgba(0,0,0,0.06)"/>
            <stop offset="50%"  stop-color="rgba(255,255,255,0.08)"/>
            <stop offset="86%"  stop-color="rgba(0,0,0,0.06)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.34)"/>
          </linearGradient>
          <linearGradient id="tsb_vert" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stop-color="rgba(255,255,255,0.09)"/>
            <stop offset="24%"  stop-color="rgba(255,255,255,0.0)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.15)"/>
          </linearGradient>
          <linearGradient id="tsb_slL" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.40)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.0)"/>
          </linearGradient>
          <linearGradient id="tsb_slR" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.0)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.40)"/>
          </linearGradient>
        </defs>

        <ellipse cx="175" cy="421" rx="118" ry="8" fill="rgba(0,0,0,0.26)"/>

        <!-- LEFT SLEEVE -->
        <path d="M 92,110 C 67,116 42,133 29,160 C 36,181 53,193 75,192 C 84,180 90,169 94,160 C 95,143 95,126 94,110 Z" fill="${primary}"/>
        <path d="M 92,110 C 67,116 42,133 29,160 C 36,181 53,193 75,192 C 84,180 90,169 94,160 C 95,143 95,126 94,110 Z" fill="url(#tsb_slL)" opacity="0.9"/>
        <path d="M 29,160 C 36,181 53,193 75,192 L 71,184 C 53,185 39,173 34,155 Z" fill="${secondary}" opacity="0.85"/>
        <path d="M 32,162 C 39,179 54,189 73,189" fill="none" stroke="rgba(0,0,0,0.16)" stroke-width="1" stroke-dasharray="2.5,2.5"/>

        <!-- RIGHT SLEEVE -->
        <path d="M 258,110 C 283,116 308,133 321,160 C 314,181 297,193 275,192 C 266,180 260,169 256,160 C 255,143 255,126 256,110 Z" fill="${primary}"/>
        <path d="M 258,110 C 283,116 308,133 321,160 C 314,181 297,193 275,192 C 266,180 260,169 256,160 C 255,143 255,126 256,110 Z" fill="url(#tsb_slR)" opacity="0.9"/>
        <path d="M 321,160 C 314,181 297,193 275,192 L 279,184 C 297,185 311,173 316,155 Z" fill="${secondary}" opacity="0.85"/>
        <path d="M 318,162 C 311,179 296,189 277,189" fill="none" stroke="rgba(0,0,0,0.16)" stroke-width="1" stroke-dasharray="2.5,2.5"/>

        <!-- MAIN BODY -->
        <path d="M 92,110 C 113,101 132,99 150,101 C 159,108 167,111 175,111 C 183,111 191,108 200,101 C 218,99 237,101 258,110 C 264,135 267,152 268,165 C 271,251 269,339 263,410 C 232,418 200,420 175,420 C 150,420 118,418 87,410 C 81,339 79,251 82,165 C 83,152 86,135 92,110 Z" fill="${primary}"/>
        <path d="M 92,110 C 113,101 132,99 150,101 C 159,108 167,111 175,111 C 183,111 191,108 200,101 C 218,99 237,101 258,110 C 264,135 267,152 268,165 C 271,251 269,339 263,410 C 232,418 200,420 175,420 C 150,420 118,418 87,410 C 81,339 79,251 82,165 C 83,152 86,135 92,110 Z" fill="url(#tsb_vol)"/>
        <path d="M 92,110 C 113,101 132,99 150,101 C 159,108 167,111 175,111 C 183,111 191,108 200,101 C 218,99 237,101 258,110 C 264,135 267,152 268,165 C 271,251 269,339 263,410 C 232,418 200,420 175,420 C 150,420 118,418 87,410 C 81,339 79,251 82,165 C 83,152 86,135 92,110 Z" fill="url(#tsb_vert)"/>

        <!-- SHOULDER SEAMS -->
        <path d="M 150,102 C 131,102 116,104 100,110" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M 200,102 C 219,102 234,104 250,110" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.6" stroke-linecap="round"/>

        <!-- BACK CREW COLLAR + RIB -->
        <path d="M 150,101 C 159,108 167,111 175,111 C 183,111 191,108 200,101 L 198,108 C 191,114 183,117 175,117 C 167,117 159,114 152,108 Z" fill="${secondary}"/>
        <path d="M 152,104 C 159,110 167,113 175,113 C 183,113 191,110 198,104" fill="none" stroke="rgba(0,0,0,0.28)" stroke-width="1"/>

        <!-- SIZE TAG -->
        <rect x="167" y="120" width="16" height="10" rx="1.5" fill="rgba(255,255,255,0.9)"/>
        <text x="175" y="127.5" font-family="sans-serif" font-size="6" text-anchor="middle" fill="rgba(0,0,0,0.7)" font-weight="bold">L</text>

        <!-- CENTER & DRAPE FOLDS -->
        <path d="M 175,130 Q 173,250 175,330 Q 177,388 174,408" fill="none" stroke="rgba(0,0,0,0.07)" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M 105,250 Q 116,300 103,360" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M 245,250 Q 234,300 247,360" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="2.4" stroke-linecap="round"/>

        <!-- HEM (double-needle) -->
        <path d="M 87,402 C 130,410 220,410 263,402 L 264,411 C 220,419 130,419 86,411 Z" fill="rgba(0,0,0,0.12)"/>
        <path d="M 88,404 C 130,411 220,411 262,404" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1" stroke-dasharray="3,2.5"/>
        <path d="M 88,409 C 130,416 220,416 262,409" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" stroke-dasharray="3,2.5"/>

        <g id="svg-logo-container">${logoMarkup}</g>
      </svg>
    `
  },
  hoodie: {
    front: (primary, secondary, logoMarkup) => `
      <svg viewBox="0 0 350 480" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hod_body" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.36)"/>
            <stop offset="18%"  stop-color="rgba(0,0,0,0.09)"/>
            <stop offset="50%"  stop-color="rgba(255,255,255,0.05)"/>
            <stop offset="82%"  stop-color="rgba(0,0,0,0.09)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.36)"/>
          </linearGradient>
          <linearGradient id="hod_sL" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.48)"/>
            <stop offset="60%"  stop-color="rgba(0,0,0,0.14)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.0)"/>
          </linearGradient>
          <linearGradient id="hod_sR" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.0)"/>
            <stop offset="40%"  stop-color="rgba(0,0,0,0.14)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.48)"/>
          </linearGradient>
          <linearGradient id="hod_hood" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.3)"/>
            <stop offset="50%"  stop-color="rgba(255,255,255,0.04)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.3)"/>
          </linearGradient>
        </defs>

        <ellipse cx="175" cy="472" rx="120" ry="8" fill="rgba(0,0,0,0.3)"/>

        <!-- LEFT SLEEVE -->
        <path d="M 72,140 C 52,145 28,166 10,192 C 2,207 -2,226 0,248 C 2,283 6,318 10,344 C 13,357 19,366 30,368 C 40,370 53,366 60,355 L 62,248 C 62,226 68,204 76,188 C 80,172 82,155 84,232 C 83,210 81,168 72,140 Z" fill="${primary}"/>
        <path d="M 72,140 C 52,145 28,166 10,192 C 2,207 -2,226 0,248 C 2,283 6,318 10,344 C 13,357 19,366 30,368 C 40,370 53,366 60,355 L 62,248 C 62,226 68,204 76,188 C 80,172 82,155 84,232 C 83,210 81,168 72,140 Z" fill="url(#hod_sL)" opacity="0.88"/>
        <!-- Left cuff -->
        <path d="M 0,308 C 2,324 6,338 12,346 C 16,354 24,362 34,364 C 44,366 54,362 60,352 L 56,342 C 50,350 42,354 32,352 C 24,350 18,342 15,332 C 12,322 11,310 10,298 Z" fill="${secondary}" opacity="0.88"/>
        <path d="M 1,314 C 6,324 14,333 22,337" fill="none" stroke="rgba(0,0,0,0.14)" stroke-width="1" stroke-dasharray="2,2"/>
        <path d="M 2,320 C 8,330 16,339 24,343" fill="none" stroke="rgba(0,0,0,0.14)" stroke-width="1" stroke-dasharray="2,2"/>

        <!-- RIGHT SLEEVE -->
        <path d="M 278,140 C 298,145 322,166 340,192 C 348,207 352,226 350,248 C 348,283 344,318 340,344 C 337,357 331,366 320,368 C 310,370 297,366 290,355 L 288,248 C 288,226 282,204 274,188 C 270,172 268,155 266,232 C 267,210 269,168 278,140 Z" fill="${primary}"/>
        <path d="M 278,140 C 298,145 322,166 340,192 C 348,207 352,226 350,248 C 348,283 344,318 340,344 C 337,357 331,366 320,368 C 310,370 297,366 290,355 L 288,248 C 288,226 282,204 274,188 C 270,172 268,155 266,232 C 267,210 269,168 278,140 Z" fill="url(#hod_sR)" opacity="0.88"/>
        <!-- Right cuff -->
        <path d="M 350,308 C 348,324 344,338 338,346 C 334,354 326,362 316,364 C 306,366 296,362 290,352 L 294,342 C 300,350 308,354 318,352 C 326,350 332,342 335,332 C 338,322 339,310 340,298 Z" fill="${secondary}" opacity="0.88"/>
        <path d="M 349,314 C 344,324 336,333 328,337" fill="none" stroke="rgba(0,0,0,0.14)" stroke-width="1" stroke-dasharray="2,2"/>

        <!-- MAIN BODY -->
        <path d="M 72,140 C 82,112 112,92 144,85 C 156,82 166,80 175,80 C 184,80 194,82 206,85 C 238,92 268,112 278,140 C 279,178 279,220 278,244 C 277,300 275,380 273,454 C 273,462 263,467 248,469 C 226,472 200,474 175,474 C 150,474 124,472 102,469 C 87,467 77,462 77,454 C 75,380 73,300 72,244 C 71,220 71,178 72,140 Z" fill="${primary}"/>
        <path d="M 72,140 C 82,112 112,92 144,85 C 156,82 166,80 175,80 C 184,80 194,82 206,85 C 238,92 268,112 278,140 C 279,178 279,220 278,244 C 277,300 275,380 273,454 C 273,462 263,467 248,469 C 226,472 200,474 175,474 C 150,474 124,472 102,469 C 87,467 77,462 77,454 C 75,380 73,300 72,244 C 71,220 71,178 72,140 Z" fill="url(#hod_body)" opacity="0.9"/>

        <!-- HOOD (drawn over body) -->
        <path d="M 116,130 C 108,112 104,88 108,62 C 113,36 130,14 150,6 C 158,3 165,2 175,2 C 185,2 192,3 200,6 C 220,14 237,36 242,62 C 246,88 242,112 234,130 C 220,142 198,150 175,152 C 152,150 130,142 116,130 Z" fill="${primary}"/>
        <path d="M 116,130 C 108,112 104,88 108,62 C 113,36 130,14 150,6 C 158,3 165,2 175,2 C 185,2 192,3 200,6 C 220,14 237,36 242,62 C 246,88 242,112 234,130 C 220,142 198,150 175,152 C 152,150 130,142 116,130 Z" fill="url(#hod_hood)" opacity="0.88"/>
        <!-- Hood face opening (secondary = inner lining) -->
        <path d="M 138,128 C 132,112 130,90 134,68 C 139,48 150,34 164,26 C 168,23 172,22 175,22 C 178,22 182,23 186,26 C 200,34 211,48 216,68 C 220,90 218,112 212,128 C 202,140 190,147 175,149 C 160,147 148,140 138,128 Z" fill="${secondary}" opacity="0.9"/>
        <!-- Hood depth shadow -->
        <ellipse cx="175" cy="92" rx="32" ry="40" fill="rgba(0,0,0,0.58)"/>
        <!-- Hood seam line -->
        <path d="M 175,2 L 175,24" stroke="rgba(0,0,0,0.18)" stroke-width="1.5"/>
        <!-- Hood body connection seam -->
        <path d="M 116,130 C 132,140 152,146 175,148 C 198,146 218,140 234,130" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
        <!-- Drawstrings -->
        <path d="M 150,128 C 148,150 146,172 144,192" fill="none" stroke="rgba(220,220,220,0.7)" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 200,128 C 202,150 204,172 206,192" fill="none" stroke="rgba(220,220,220,0.7)" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="140" y="192" width="8" height="12" rx="2" fill="rgba(180,180,180,0.82)"/>
        <rect x="202" y="192" width="8" height="12" rx="2" fill="rgba(180,180,180,0.82)"/>

        <!-- ARMHOLE CREASE -->
        <path d="M 73,144 C 74,170 74,196 75,218" fill="none" stroke="rgba(0,0,0,0.16)" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 277,144 C 276,170 276,196 275,218" fill="none" stroke="rgba(0,0,0,0.16)" stroke-width="2.5" stroke-linecap="round"/>

        <!-- FABRIC WRINKLES -->
        <path d="M 172,210 Q 168,270 171,340 Q 174,390 171,440" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 178,210 Q 182,270 179,340 Q 176,390 179,440" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="2" stroke-linecap="round"/>

        <!-- KANGAROO POCKET -->
        <path d="M 104,358 C 118,354 142,350 175,348 C 208,350 232,354 246,358 L 254,440 C 254,450 246,456 234,458 C 215,462 196,464 175,464 C 154,464 135,462 116,458 C 104,456 96,450 96,440 Z" fill="rgba(0,0,0,0.16)" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
        <path d="M 104,358 C 118,354 142,350 175,348 C 208,350 232,354 246,358" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="2.2"/>
        <path d="M 175,348 L 175,464" stroke="rgba(0,0,0,0.1)" stroke-width="1.5" stroke-dasharray="3,2"/>
        <path d="M 106,362 C 120,358 144,354 175,352 C 206,354 230,358 244,362" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" stroke-dasharray="3,2"/>

        <!-- HEM RIBBING -->
        <path d="M 77,454 C 77,462 87,467 102,469 C 124,472 150,474 175,474 C 200,474 226,472 248,469 C 263,467 273,462 273,454 L 273,466 C 273,475 263,480 248,482 C 226,485 200,487 175,487 C 150,487 124,485 102,482 C 87,480 77,475 77,466 Z" fill="${secondary}" opacity="0.88"/>
        <path d="M 78,458 C 115,463 148,466 175,466 C 202,466 235,463 272,458" fill="none" stroke="rgba(0,0,0,0.11)" stroke-width="1" stroke-dasharray="3,2"/>
        <path d="M 78,462 C 115,467 148,470 175,470 C 202,470 235,467 272,462" fill="none" stroke="rgba(0,0,0,0.11)" stroke-width="1" stroke-dasharray="3,2"/>
        <path d="M 78,466 C 115,471 148,474 175,474 C 202,474 235,471 272,466" fill="none" stroke="rgba(0,0,0,0.11)" stroke-width="1" stroke-dasharray="3,2"/>

        <g id="svg-logo-container">${logoMarkup}</g>
      </svg>
    `,
    back: (primary, secondary, logoMarkup) => `
      <svg viewBox="0 0 350 480" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hodb_body" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.36)"/>
            <stop offset="50%"  stop-color="rgba(255,255,255,0.05)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.36)"/>
          </linearGradient>
          <linearGradient id="hodb_sL" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.48)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.0)"/>
          </linearGradient>
          <linearGradient id="hodb_sR" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.0)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.48)"/>
          </linearGradient>
        </defs>
        <ellipse cx="175" cy="472" rx="120" ry="8" fill="rgba(0,0,0,0.3)"/>

        <!-- LEFT SLEEVE -->
        <path d="M 72,140 C 52,145 28,166 10,192 C 2,207 -2,226 0,248 C 2,283 6,318 10,344 C 13,357 19,366 30,368 C 40,370 53,366 60,355 L 62,248 C 62,226 68,204 76,188 C 80,172 82,155 84,232 C 83,210 81,168 72,140 Z" fill="${primary}"/>
        <path d="M 72,140 C 52,145 28,166 10,192 C 2,207 -2,226 0,248 C 2,283 6,318 10,344 C 13,357 19,366 30,368 C 40,370 53,366 60,355 L 62,248 C 62,226 68,204 76,188 C 80,172 82,155 84,232 C 83,210 81,168 72,140 Z" fill="url(#hodb_sL)" opacity="0.88"/>
        <path d="M 0,308 C 2,324 6,338 12,346 C 16,354 24,362 34,364 C 44,366 54,362 60,352 L 56,342 C 50,350 42,354 32,352 C 24,350 18,342 15,332 C 12,322 11,310 10,298 Z" fill="${secondary}" opacity="0.88"/>

        <!-- RIGHT SLEEVE -->
        <path d="M 278,140 C 298,145 322,166 340,192 C 348,207 352,226 350,248 C 348,283 344,318 340,344 C 337,357 331,366 320,368 C 310,370 297,366 290,355 L 288,248 C 288,226 282,204 274,188 C 270,172 268,155 266,232 C 267,210 269,168 278,140 Z" fill="${primary}"/>
        <path d="M 278,140 C 298,145 322,166 340,192 C 348,207 352,226 350,248 C 348,283 344,318 340,344 C 337,357 331,366 320,368 C 310,370 297,366 290,355 L 288,248 C 288,226 282,204 274,188 C 270,172 268,155 266,232 C 267,210 269,168 278,140 Z" fill="url(#hodb_sR)" opacity="0.88"/>
        <path d="M 350,308 C 348,324 344,338 338,346 C 334,354 326,362 316,364 C 306,366 296,362 290,352 L 294,342 C 300,350 308,354 318,352 C 326,350 332,342 335,332 C 338,322 339,310 340,298 Z" fill="${secondary}" opacity="0.88"/>

        <!-- MAIN BODY -->
        <path d="M 72,140 C 82,112 112,92 144,85 C 156,82 166,80 175,80 C 184,80 194,82 206,85 C 238,92 268,112 278,140 C 279,178 279,220 278,244 C 277,300 275,380 273,454 C 273,462 263,467 248,469 C 226,472 200,474 175,474 C 150,474 124,472 102,469 C 87,467 77,462 77,454 C 75,380 73,300 72,244 C 71,220 71,178 72,140 Z" fill="${primary}"/>
        <path d="M 72,140 C 82,112 112,92 144,85 C 156,82 166,80 175,80 C 184,80 194,82 206,85 C 238,92 268,112 278,140 C 279,178 279,220 278,244 C 277,300 275,380 273,454 C 273,462 263,467 248,469 C 226,472 200,474 175,474 C 150,474 124,472 102,469 C 87,467 77,462 77,454 C 75,380 73,300 72,244 C 71,220 71,178 72,140 Z" fill="url(#hodb_body)" opacity="0.9"/>

        <!-- HOOD on back (large teardrop resting on shoulders) -->
        <path d="M 116,142 C 108,122 104,96 108,68 C 114,40 132,16 152,6 C 160,3 167,2 175,2 C 183,2 190,3 198,6 C 218,16 236,40 242,68 C 246,96 242,122 234,142 C 220,155 198,162 175,164 C 152,162 130,155 116,142 Z" fill="${primary}"/>
        <!-- Hood back seam -->
        <path d="M 175,2 L 175,164" stroke="rgba(0,0,0,0.16)" stroke-width="2"/>
        <path d="M 175,2 L 175,162" stroke="rgba(255,255,255,0.06)" stroke-width="0.8" stroke-dasharray="4,3"/>
        <!-- Hood shadow + cross gradient -->
        <path d="M 116,142 C 108,122 104,96 108,68 C 114,40 132,16 152,6 C 160,3 167,2 175,2 C 183,2 190,3 198,6 C 218,16 236,40 242,68 C 246,96 242,122 234,142 C 220,155 198,162 175,164 C 152,162 130,155 116,142 Z" fill="url(#hodb_body)" opacity="0.75"/>

        <!-- CENTER BODY SEAM -->
        <path d="M 175,168 L 175,460" stroke="rgba(0,0,0,0.06)" stroke-width="1.5"/>

        <!-- WRINKLES -->
        <path d="M 172,210 Q 168,270 171,340 Q 174,390 171,440" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 178,210 Q 182,270 179,340" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="2" stroke-linecap="round"/>

        <!-- HEM RIBBING -->
        <path d="M 77,454 C 77,462 87,467 102,469 C 124,472 150,474 175,474 C 200,474 226,472 248,469 C 263,467 273,462 273,454 L 273,466 C 273,475 263,480 248,482 C 226,485 200,487 175,487 C 150,487 124,485 102,482 C 87,480 77,475 77,466 Z" fill="${secondary}" opacity="0.88"/>
        <path d="M 78,458 C 115,463 148,466 175,466 C 202,466 235,463 272,458" fill="none" stroke="rgba(0,0,0,0.11)" stroke-width="1" stroke-dasharray="3,2"/>
        <path d="M 78,462 C 115,467 148,470 175,470 C 202,470 235,467 272,462" fill="none" stroke="rgba(0,0,0,0.11)" stroke-width="1" stroke-dasharray="3,2"/>

        <g id="svg-logo-container">${logoMarkup}</g>
      </svg>
    `
  },
  jacket: {
    front: (primary, secondary, logoMarkup) => `
      <svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="jkt_h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.4)"/>
            <stop offset="14%"  stop-color="rgba(0,0,0,0.1)"/>
            <stop offset="50%"  stop-color="rgba(255,255,255,0.07)"/>
            <stop offset="86%"  stop-color="rgba(0,0,0,0.1)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.4)"/>
          </linearGradient>
          <linearGradient id="jkt_v" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.24)"/>
            <stop offset="30%"  stop-color="rgba(0,0,0,0.0)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.3)"/>
          </linearGradient>
          <linearGradient id="jkt_sL" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.54)"/>
            <stop offset="55%"  stop-color="rgba(0,0,0,0.16)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.0)"/>
          </linearGradient>
          <linearGradient id="jkt_sR" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.0)"/>
            <stop offset="45%"  stop-color="rgba(0,0,0,0.16)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.54)"/>
          </linearGradient>
          <linearGradient id="jkt_yk" x1="5%" y1="5%" x2="95%" y2="95%">
            <stop offset="0%"   stop-color="rgba(255,255,255,0.18)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.28)"/>
          </linearGradient>
          <linearGradient id="jkt_cl" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stop-color="rgba(255,255,255,0.22)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.38)"/>
          </linearGradient>
        </defs>

        <!-- GROUND SHADOW -->
        <ellipse cx="180" cy="473" rx="128" ry="9" fill="rgba(0,0,0,0.32)"/>

        <!-- LEFT SLEEVE (drawn behind body) -->
        <path d="M 76,122 C 56,126 34,148 16,174 C 8,188 4,207 6,229 C 7,263 10,298 14,325 C 17,338 23,346 34,348 C 45,350 57,346 63,335 L 64,229 C 64,207 70,185 78,169 C 82,186 84,206 86,220 C 85,196 83,157 76,122 Z" fill="${primary}"/>
        <path d="M 76,122 C 56,126 34,148 16,174 C 8,188 4,207 6,229 C 7,263 10,298 14,325 C 17,338 23,346 34,348 C 45,350 57,346 63,335 L 64,229 C 64,207 70,185 78,169 C 82,186 84,206 86,220 C 85,196 83,157 76,122 Z" fill="url(#jkt_sL)" opacity="0.9"/>
        <!-- Left cuff (secondary) -->
        <path d="M 4,285 C 6,302 10,318 16,328 C 20,338 28,346 38,348 C 48,350 58,346 64,336 L 60,326 C 54,334 45,337 36,335 C 27,333 20,324 17,313 C 14,302 13,290 12,276 Z" fill="${secondary}" opacity="0.88"/>
        <path d="M 5,291 C 10,302 18,312 26,317" fill="none" stroke="rgba(0,0,0,0.14)" stroke-width="1" stroke-dasharray="2,2"/>
        <path d="M 6,298 C 12,309 20,319 28,324" fill="none" stroke="rgba(0,0,0,0.14)" stroke-width="1" stroke-dasharray="2,2"/>
        <!-- Left sleeve wrinkle -->
        <path d="M 38,210 Q 35,238 38,265" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="2" stroke-linecap="round"/>

        <!-- RIGHT SLEEVE (drawn behind body) -->
        <path d="M 284,122 C 304,126 326,148 344,174 C 352,188 356,207 354,229 C 353,263 350,298 346,325 C 343,338 337,346 326,348 C 315,350 303,346 297,335 L 296,229 C 296,207 290,185 282,169 C 278,186 276,206 274,220 C 275,196 277,157 284,122 Z" fill="${primary}"/>
        <path d="M 284,122 C 304,126 326,148 344,174 C 352,188 356,207 354,229 C 353,263 350,298 346,325 C 343,338 337,346 326,348 C 315,350 303,346 297,335 L 296,229 C 296,207 290,185 282,169 C 278,186 276,206 274,220 C 275,196 277,157 284,122 Z" fill="url(#jkt_sR)" opacity="0.9"/>
        <!-- Right cuff (secondary) -->
        <path d="M 356,285 C 354,302 350,318 344,328 C 340,338 332,346 322,348 C 312,350 302,346 296,336 L 300,326 C 306,334 315,337 324,335 C 333,333 340,324 343,313 C 346,302 347,290 348,276 Z" fill="${secondary}" opacity="0.88"/>
        <path d="M 355,291 C 350,302 342,312 334,317" fill="none" stroke="rgba(0,0,0,0.14)" stroke-width="1" stroke-dasharray="2,2"/>
        <!-- Right sleeve wrinkle -->
        <path d="M 322,210 Q 325,238 322,265" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="2" stroke-linecap="round"/>

        <!-- MAIN BODY (curved silhouette — NOT a rectangle!) -->
        <path d="M 76,122 C 88,90 118,70 148,62 C 159,58 168,57 180,57 C 192,57 201,58 212,62 C 242,70 272,90 284,122 C 285,160 285,196 284,218 C 283,272 280,362 278,448 C 278,456 268,462 252,464 C 230,468 205,470 180,470 C 155,470 130,468 108,464 C 92,462 82,456 82,448 C 80,362 77,272 76,218 C 75,196 75,160 76,122 Z" fill="${primary}"/>
        <path d="M 76,122 C 88,90 118,70 148,62 C 159,58 168,57 180,57 C 192,57 201,58 212,62 C 242,70 272,90 284,122 C 285,160 285,196 284,218 C 283,272 280,362 278,448 C 278,456 268,462 252,464 C 230,468 205,470 180,470 C 155,470 130,468 108,464 C 92,462 82,456 82,448 C 80,362 77,272 76,218 C 75,196 75,160 76,122 Z" fill="url(#jkt_h)" opacity="0.9"/>
        <path d="M 76,122 C 88,90 118,70 148,62 C 159,58 168,57 180,57 C 192,57 201,58 212,62 C 242,70 272,90 284,122 C 285,160 285,196 284,218 C 283,272 280,362 278,448 C 278,456 268,462 252,464 C 230,468 205,470 180,470 C 155,470 130,468 108,464 C 92,462 82,456 82,448 C 80,362 77,272 76,218 C 75,196 75,160 76,122 Z" fill="url(#jkt_v)" opacity="0.7"/>

        <!-- SHOULDER YOKE PANEL (secondary — curves across upper chest) -->
        <path d="M 76,122 C 88,90 118,70 148,62 C 159,58 168,57 180,57 C 192,57 201,58 212,62 C 242,70 272,90 284,122 C 272,142 250,158 226,166 C 210,172 196,175 180,176 C 164,175 150,172 134,166 C 110,158 88,142 76,122 Z" fill="${secondary}"/>
        <path d="M 76,122 C 88,90 118,70 148,62 C 159,58 168,57 180,57 C 192,57 201,58 212,62 C 242,70 272,90 284,122 C 272,142 250,158 226,166 C 210,172 196,175 180,176 C 164,175 150,172 134,166 C 110,158 88,142 76,122 Z" fill="url(#jkt_yk)" opacity="0.85"/>
        <!-- Yoke bottom seam topstitching -->
        <path d="M 76,122 C 90,140 112,156 136,164" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" stroke-dasharray="4,3"/>
        <path d="M 284,122 C 270,140 248,156 224,164" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" stroke-dasharray="4,3"/>
        <path d="M 136,164 C 154,172 166,175 180,175 C 194,175 206,172 224,164" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" stroke-dasharray="4,3"/>

        <!-- STANDING COLLAR — LEFT PIECE -->
        <path d="M 180,57 L 180,42 C 173,41 162,43 152,48 C 145,52 140,58 140,66 C 140,73 145,78 152,81 C 160,84 170,84 178,84 L 180,83 Z" fill="${secondary}"/>
        <path d="M 180,57 L 180,42 C 173,41 162,43 152,48 C 145,52 140,58 140,66 C 140,73 145,78 152,81 C 160,84 170,84 178,84 L 180,83 Z" fill="url(#jkt_cl)" opacity="0.88"/>
        <!-- STANDING COLLAR — RIGHT PIECE -->
        <path d="M 180,57 L 180,42 C 187,41 198,43 208,48 C 215,52 220,58 220,66 C 220,73 215,78 208,81 C 200,84 190,84 182,84 L 180,83 Z" fill="${secondary}"/>
        <path d="M 180,57 L 180,42 C 187,41 198,43 208,48 C 215,52 220,58 220,66 C 220,73 215,78 208,81 C 200,84 190,84 182,84 L 180,83 Z" fill="url(#jkt_cl)" opacity="0.88"/>
        <!-- Collar top rim (3D depth edge) -->
        <path d="M 140,66 C 146,58 158,51 170,47 C 174,46 177,45 180,45 C 183,45 186,46 190,47 C 202,51 214,58 220,66 L 220,70 C 214,62 202,55 190,51 C 186,50 183,49 180,49 C 177,49 174,50 170,51 C 158,55 146,62 140,70 Z" fill="rgba(0,0,0,0.24)"/>
        <!-- Collar chin-guard shadow -->
        <path d="M 172,84 C 176,85 184,85 188,84" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>

        <!-- CENTER ZIPPER -->
        <rect x="178" y="57" width="4" height="413" rx="1.2" fill="rgba(0,0,0,0.25)"/>
        <line x1="180" y1="57" x2="180" y2="470" stroke="rgba(255,255,255,0.07)" stroke-width="0.8"/>
        <!-- Zipper teeth (implied dashes) -->
        <path d="M 178,82 L 182,82 M 178,94 L 182,94 M 178,106 L 182,106 M 178,118 L 182,118 M 178,130 L 182,130 M 178,142 L 182,142" stroke="rgba(0,0,0,0.28)" stroke-width="1.5" stroke-linecap="round"/>
        <!-- Zipper pull tab -->
        <rect x="174" y="152" width="12" height="7" rx="2" fill="rgba(180,180,180,0.88)" stroke="rgba(0,0,0,0.38)" stroke-width="0.5"/>
        <line x1="178" y1="156" x2="182" y2="156" stroke="rgba(0,0,0,0.4)" stroke-width="1.5"/>
        <path d="M 180,159 C 180,163 176,165 176,168 L 184,168 C 184,165 180,163 180,159 Z" fill="none" stroke="rgba(155,155,155,0.8)" stroke-width="1.5"/>
        <ellipse cx="180" cy="169" rx="4" ry="2.5" fill="rgba(155,155,155,0.72)"/>

        <!-- RIGHT CHEST POCKET (with zipper) -->
        <path d="M 198,235 L 254,235 C 256,235 257,236 257,238 L 257,272 C 257,274 256,275 254,275 L 198,275 C 196,275 195,274 195,272 L 195,238 C 195,236 196,235 198,235 Z" fill="rgba(0,0,0,0.0)" stroke="rgba(0,0,0,0.28)" stroke-width="1.5"/>
        <line x1="195" y1="235" x2="257" y2="235" stroke="rgba(0,0,0,0.32)" stroke-width="2.2"/>
        <rect x="220" y="231" width="10" height="6" rx="1.5" fill="rgba(155,155,155,0.85)"/>
        <path d="M 198,239 L 254,239 L 254,271 L 198,271 Z" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="0.8" stroke-dasharray="3,2"/>

        <!-- SIDE HAND POCKETS (angled welt) -->
        <path d="M 92,370 L 146,356" stroke="rgba(0,0,0,0.38)" stroke-width="3" stroke-linecap="round"/>
        <path d="M 92,375 L 146,361" stroke="rgba(0,0,0,0.1)" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M 268,370 L 214,356" stroke="rgba(0,0,0,0.38)" stroke-width="3" stroke-linecap="round"/>
        <path d="M 268,375 L 214,361" stroke="rgba(0,0,0,0.1)" stroke-width="1.5" stroke-linecap="round"/>

        <!-- SHOULDER HIGHLIGHT -->
        <path d="M 84,132 C 98,112 120,97 142,90" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="8" stroke-linecap="round"/>
        <path d="M 276,132 C 262,112 240,97 218,90" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="8" stroke-linecap="round"/>

        <!-- ARMHOLE CREASE LINES -->
        <path d="M 77,126 C 78,154 79,180 80,204" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="2" stroke-linecap="round"/>
        <path d="M 283,126 C 282,154 281,180 280,204" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="2" stroke-linecap="round"/>

        <!-- FABRIC WRINKLES -->
        <path d="M 176,198 Q 172,255 175,322 Q 178,375 175,432" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 184,198 Q 188,255 185,322 Q 182,375 185,432" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="2" stroke-linecap="round"/>
        <path d="M 118,300 Q 132,318 126,338" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M 242,300 Q 228,318 234,338" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1.8" stroke-linecap="round"/>

        <!-- HEM RIBBING -->
        <path d="M 82,448 C 82,456 92,462 108,464 C 130,468 155,470 180,470 C 205,470 230,468 252,464 C 268,462 278,456 278,448 L 278,460 C 278,469 268,474 252,476 C 230,480 205,482 180,482 C 155,482 130,480 108,476 C 92,474 82,469 82,460 Z" fill="${secondary}" opacity="0.88"/>
        <path d="M 83,452 C 118,458 152,462 180,462 C 208,462 242,458 277,452" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1" stroke-dasharray="3,2"/>
        <path d="M 83,456 C 118,462 152,466 180,466 C 208,466 242,462 277,456" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1" stroke-dasharray="3,2"/>
        <path d="M 83,460 C 118,466 152,470 180,470 C 208,470 242,466 277,460" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1" stroke-dasharray="3,2"/>
        <path d="M 83,464 C 118,470 152,474 180,474 C 208,474 242,470 277,464" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1" stroke-dasharray="3,2"/>

        <g id="svg-logo-container">${logoMarkup}</g>
      </svg>
    `,
    back: (primary, secondary, logoMarkup) => `
      <svg viewBox="0 0 360 480" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="jktb_h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.4)"/>
            <stop offset="14%"  stop-color="rgba(0,0,0,0.1)"/>
            <stop offset="50%"  stop-color="rgba(255,255,255,0.07)"/>
            <stop offset="86%"  stop-color="rgba(0,0,0,0.1)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.4)"/>
          </linearGradient>
          <linearGradient id="jktb_yk" x1="5%" y1="5%" x2="95%" y2="95%">
            <stop offset="0%"   stop-color="rgba(255,255,255,0.18)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.28)"/>
          </linearGradient>
          <linearGradient id="jktb_sL" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.54)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.0)"/>
          </linearGradient>
          <linearGradient id="jktb_sR" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.0)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.54)"/>
          </linearGradient>
        </defs>

        <ellipse cx="180" cy="473" rx="128" ry="9" fill="rgba(0,0,0,0.32)"/>

        <!-- LEFT SLEEVE -->
        <path d="M 76,122 C 56,126 34,148 16,174 C 8,188 4,207 6,229 C 7,263 10,298 14,325 C 17,338 23,346 34,348 C 45,350 57,346 63,335 L 64,229 C 64,207 70,185 78,169 C 82,186 84,206 86,220 C 85,196 83,157 76,122 Z" fill="${primary}"/>
        <path d="M 76,122 C 56,126 34,148 16,174 C 8,188 4,207 6,229 C 7,263 10,298 14,325 C 17,338 23,346 34,348 C 45,350 57,346 63,335 L 64,229 C 64,207 70,185 78,169 C 82,186 84,206 86,220 C 85,196 83,157 76,122 Z" fill="url(#jktb_sL)" opacity="0.9"/>
        <path d="M 4,285 C 6,302 10,318 16,328 C 20,338 28,346 38,348 C 48,350 58,346 64,336 L 60,326 C 54,334 45,337 36,335 C 27,333 20,324 17,313 C 14,302 13,290 12,276 Z" fill="${secondary}" opacity="0.88"/>

        <!-- RIGHT SLEEVE -->
        <path d="M 284,122 C 304,126 326,148 344,174 C 352,188 356,207 354,229 C 353,263 350,298 346,325 C 343,338 337,346 326,348 C 315,350 303,346 297,335 L 296,229 C 296,207 290,185 282,169 C 278,186 276,206 274,220 C 275,196 277,157 284,122 Z" fill="${primary}"/>
        <path d="M 284,122 C 304,126 326,148 344,174 C 352,188 356,207 354,229 C 353,263 350,298 346,325 C 343,338 337,346 326,348 C 315,350 303,346 297,335 L 296,229 C 296,207 290,185 282,169 C 278,186 276,206 274,220 C 275,196 277,157 284,122 Z" fill="url(#jktb_sR)" opacity="0.9"/>
        <path d="M 356,285 C 354,302 350,318 344,328 C 340,338 332,346 322,348 C 312,350 302,346 296,336 L 300,326 C 306,334 315,337 324,335 C 333,333 340,324 343,313 C 346,302 347,290 348,276 Z" fill="${secondary}" opacity="0.88"/>

        <!-- MAIN BODY (back) -->
        <path d="M 76,122 C 88,90 118,70 148,62 C 159,58 168,57 180,57 C 192,57 201,58 212,62 C 242,70 272,90 284,122 C 285,160 285,196 284,218 C 283,272 280,362 278,448 C 278,456 268,462 252,464 C 230,468 205,470 180,470 C 155,470 130,468 108,464 C 92,462 82,456 82,448 C 80,362 77,272 76,218 C 75,196 75,160 76,122 Z" fill="${primary}"/>
        <path d="M 76,122 C 88,90 118,70 148,62 C 159,58 168,57 180,57 C 192,57 201,58 212,62 C 242,70 272,90 284,122 C 285,160 285,196 284,218 C 283,272 280,362 278,448 C 278,456 268,462 252,464 C 230,468 205,470 180,470 C 155,470 130,468 108,464 C 92,462 82,456 82,448 C 80,362 77,272 76,218 C 75,196 75,160 76,122 Z" fill="url(#jktb_h)" opacity="0.9"/>

        <!-- BACK UPPER YOKE (secondary, more visible from back) -->
        <path d="M 76,122 C 88,90 118,70 148,62 C 159,58 168,57 180,57 C 192,57 201,58 212,62 C 242,70 272,90 284,122 C 272,142 250,158 226,166 C 210,172 196,175 180,176 C 164,175 150,172 134,166 C 110,158 88,142 76,122 Z" fill="${secondary}"/>
        <path d="M 76,122 C 88,90 118,70 148,62 C 159,58 168,57 180,57 C 192,57 201,58 212,62 C 242,70 272,90 284,122 C 272,142 250,158 226,166 C 210,172 196,175 180,176 C 164,175 150,172 134,166 C 110,158 88,142 76,122 Z" fill="url(#jktb_yk)" opacity="0.85"/>
        <!-- Yoke seam topstitching -->
        <path d="M 76,122 C 90,140 112,156 136,164 C 154,172 166,175 180,175 C 194,175 206,172 224,164 C 248,156 270,140 284,122" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" stroke-dasharray="4,3"/>

        <!-- BACK COLLAR ROLL (secondary visible from back) -->
        <path d="M 140,66 C 152,58 165,53 180,52 C 195,53 208,58 220,66 L 220,80 C 208,74 195,70 180,68 C 165,70 152,74 140,80 Z" fill="${secondary}"/>
        <path d="M 140,66 C 152,58 165,53 180,52 C 195,53 208,58 220,66 L 220,80 C 208,74 195,70 180,68 C 165,70 152,74 140,80 Z" fill="url(#jktb_yk)" opacity="0.8"/>

        <!-- CENTER BACK SEAM -->
        <path d="M 180,80 L 180,466" stroke="rgba(0,0,0,0.14)" stroke-width="2"/>
        <path d="M 180,180 L 180,450" stroke="rgba(255,255,255,0.06)" stroke-width="0.8" stroke-dasharray="3,2"/>

        <!-- ARMHOLE CREASE -->
        <path d="M 77,126 C 78,154 79,180 80,204" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="2" stroke-linecap="round"/>
        <path d="M 283,126 C 282,154 281,180 280,204" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="2" stroke-linecap="round"/>

        <!-- FABRIC WRINKLES -->
        <path d="M 176,198 Q 172,255 175,322 Q 178,375 175,432" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 184,198 Q 188,255 185,322" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="2" stroke-linecap="round"/>
        <path d="M 118,300 Q 132,318 126,338" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M 242,300 Q 228,318 234,338" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1.8" stroke-linecap="round"/>

        <!-- SHOULDER HIGHLIGHT -->
        <path d="M 84,132 C 98,112 120,97 142,90" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="8" stroke-linecap="round"/>
        <path d="M 276,132 C 262,112 240,97 218,90" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="8" stroke-linecap="round"/>

        <!-- HEM RIBBING -->
        <path d="M 82,448 C 82,456 92,462 108,464 C 130,468 155,470 180,470 C 205,470 230,468 252,464 C 268,462 278,456 278,448 L 278,460 C 278,469 268,474 252,476 C 230,480 205,482 180,482 C 155,482 130,480 108,476 C 92,474 82,469 82,460 Z" fill="${secondary}" opacity="0.88"/>
        <path d="M 83,452 C 118,458 152,462 180,462 C 208,462 242,458 277,452" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1" stroke-dasharray="3,2"/>
        <path d="M 83,456 C 118,462 152,466 180,466 C 208,466 242,462 277,456" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1" stroke-dasharray="3,2"/>
        <path d="M 83,460 C 118,466 152,470 180,470 C 208,470 242,466 277,460" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1" stroke-dasharray="3,2"/>

        <g id="svg-logo-container">${logoMarkup}</g>
      </svg>
    `
  },
  uniform: {
    front: (primary, secondary, logoMarkup) => `
      <svg viewBox="0 0 350 420" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="uni_body" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.3)"/>
            <stop offset="50%"  stop-color="rgba(255,255,255,0.05)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.3)"/>
          </linearGradient>
        </defs>
        <ellipse cx="175" cy="415" rx="105" ry="6" fill="rgba(0,0,0,0.28)"/>

        <!-- LEFT RAGLAN SLEEVE (secondary) -->
        <path d="M 88,118 C 68,124 44,142 26,166 C 18,180 16,200 18,220 L 24,290 C 26,302 32,310 42,312 C 52,314 64,310 70,300 L 72,220 C 72,200 80,180 90,165 C 92,180 94,198 96,210 C 95,188 93,152 88,118 Z" fill="${secondary}"/>
        <path d="M 88,118 C 68,124 44,142 26,166 C 18,180 16,200 18,220 L 24,290 C 26,302 32,310 42,312 C 52,314 64,310 70,300 L 72,220 C 72,200 80,180 90,165 C 92,180 94,198 96,210 C 95,188 93,152 88,118 Z" fill="rgba(0,0,0,0.22)" opacity="0.6"/>

        <!-- RIGHT RAGLAN SLEEVE (secondary) -->
        <path d="M 262,118 C 282,124 306,142 324,166 C 332,180 334,200 332,220 L 326,290 C 324,302 318,310 308,312 C 298,314 286,310 280,300 L 278,220 C 278,200 270,180 260,165 C 258,180 256,198 254,210 C 255,188 257,152 262,118 Z" fill="${secondary}"/>
        <path d="M 262,118 C 282,124 306,142 324,166 C 332,180 334,200 332,220 L 326,290 C 324,302 318,310 308,312 C 298,314 286,310 280,300 L 278,220 C 278,200 270,180 260,165 C 258,180 256,198 254,210 C 255,188 257,152 262,118 Z" fill="rgba(0,0,0,0.22)" opacity="0.6"/>

        <!-- RAGLAN SHOULDER PANELS (secondary) -->
        <path d="M 88,118 C 100,90 130,72 156,66 C 165,63 170,62 175,62 C 180,62 185,63 194,66 C 220,72 250,90 262,118 C 248,132 226,142 202,148 C 192,151 183,153 175,153 C 167,153 158,151 148,148 C 124,142 102,132 88,118 Z" fill="${secondary}"/>
        <path d="M 88,118 C 100,90 130,72 156,66 C 165,63 170,62 175,62 C 180,62 185,63 194,66 C 220,72 250,90 262,118 C 248,132 226,142 202,148 C 192,151 183,153 175,153 C 167,153 158,151 148,148 C 124,142 102,132 88,118 Z" fill="rgba(0,0,0,0.18)" opacity="0.7"/>

        <!-- MAIN BODY (primary) -->
        <path d="M 88,118 C 102,130 125,145 148,151 C 158,154 167,155 175,155 C 183,155 192,154 202,151 C 225,145 248,130 262,118 C 263,158 263,200 262,222 C 261,278 259,360 257,406 L 93,406 C 91,360 89,278 88,222 C 87,200 87,158 88,118 Z" fill="${primary}"/>
        <path d="M 88,118 C 102,130 125,145 148,151 C 158,154 167,155 175,155 C 183,155 192,154 202,151 C 225,145 248,130 262,118 C 263,158 263,200 262,222 C 261,278 259,360 257,406 L 93,406 C 91,360 89,278 88,222 C 87,200 87,158 88,118 Z" fill="url(#uni_body)" opacity="0.88"/>

        <!-- V-NECK OPENING -->
        <path d="M 154,66 C 162,74 170,86 175,98 C 180,86 188,74 196,66 C 188,63 182,62 175,62 C 168,62 162,63 154,66 Z" fill="rgba(255,255,255,0.15)"/>
        <path d="M 154,66 C 162,74 170,86 175,96" fill="none" stroke="${secondary}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 196,66 C 188,74 180,86 175,96" fill="none" stroke="${secondary}" stroke-width="2.5" stroke-linecap="round"/>
        <!-- V-neck depth shadow -->
        <path d="M 160,68 C 166,76 172,88 175,97" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="2" stroke-linecap="round"/>

        <!-- SIDE ACCENT STRIPES (secondary) -->
        <path d="M 88,195 L 100,195 L 100,406 L 88,406 C 89,360 89,278 88,222 Z" fill="${secondary}" opacity="0.9"/>
        <path d="M 262,195 L 250,195 L 250,406 L 262,406 C 261,360 261,278 262,222 Z" fill="${secondary}" opacity="0.9"/>

        <!-- HEM -->
        <path d="M 93,406 L 257,406 L 257,412 L 93,412 Z" fill="${secondary}" opacity="0.85"/>
        <path d="M 94,408 L 256,408" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" stroke-dasharray="3,2"/>

        <!-- BODY WRINKLES -->
        <path d="M 173,180 Q 170,230 172,290 Q 174,340 172,392" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M 177,180 Q 180,230 178,290" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="2" stroke-linecap="round"/>
        <!-- Raglan seam lines -->
        <path d="M 88,118 C 102,132 124,146 148,152" fill="none" stroke="rgba(0,0,0,0.16)" stroke-width="1.5"/>
        <path d="M 262,118 C 248,132 226,146 202,152" fill="none" stroke="rgba(0,0,0,0.16)" stroke-width="1.5"/>

        <g id="svg-logo-container">${logoMarkup}</g>
      </svg>
    `,
    back: (primary, secondary, logoMarkup) => `
      <svg viewBox="0 0 350 420" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="unib_body" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stop-color="rgba(0,0,0,0.3)"/>
            <stop offset="50%"  stop-color="rgba(255,255,255,0.05)"/>
            <stop offset="100%" stop-color="rgba(0,0,0,0.3)"/>
          </linearGradient>
        </defs>
        <ellipse cx="175" cy="415" rx="105" ry="6" fill="rgba(0,0,0,0.28)"/>

        <!-- LEFT RAGLAN SLEEVE (back) -->
        <path d="M 88,118 C 68,124 44,142 26,166 C 18,180 16,200 18,220 L 24,290 C 26,302 32,310 42,312 C 52,314 64,310 70,300 L 72,220 C 72,200 80,180 90,165 C 92,180 94,198 96,210 C 95,188 93,152 88,118 Z" fill="${secondary}"/>
        <path d="M 88,118 C 68,124 44,142 26,166 C 18,180 16,200 18,220 L 24,290 C 26,302 32,310 42,312 C 52,314 64,310 70,300 L 72,220 C 72,200 80,180 90,165 C 92,180 94,198 96,210 C 95,188 93,152 88,118 Z" fill="rgba(0,0,0,0.22)" opacity="0.6"/>

        <!-- RIGHT RAGLAN SLEEVE (back) -->
        <path d="M 262,118 C 282,124 306,142 324,166 C 332,180 334,200 332,220 L 326,290 C 324,302 318,310 308,312 C 298,314 286,310 280,300 L 278,220 C 278,200 270,180 260,165 C 258,180 256,198 254,210 C 255,188 257,152 262,118 Z" fill="${secondary}"/>
        <path d="M 262,118 C 282,124 306,142 324,166 C 332,180 334,200 332,220 L 326,290 C 324,302 318,310 308,312 C 298,314 286,310 280,300 L 278,220 C 278,200 270,180 260,165 C 258,180 256,198 254,210 C 255,188 257,152 262,118 Z" fill="rgba(0,0,0,0.22)" opacity="0.6"/>

        <!-- BACK RAGLAN SHOULDERS (secondary) -->
        <path d="M 88,118 C 100,90 130,72 156,66 C 165,63 170,62 175,62 C 180,62 185,63 194,66 C 220,72 250,90 262,118 C 248,132 226,142 202,148 C 192,151 183,153 175,153 C 167,153 158,151 148,148 C 124,142 102,132 88,118 Z" fill="${secondary}"/>
        <path d="M 88,118 C 100,90 130,72 156,66 C 165,63 170,62 175,62 C 180,62 185,63 194,66 C 220,72 250,90 262,118 C 248,132 226,142 202,148 C 192,151 183,153 175,153 C 167,153 158,151 148,148 C 124,142 102,132 88,118 Z" fill="rgba(0,0,0,0.18)" opacity="0.7"/>

        <!-- BACK COLLAR (secondary) -->
        <path d="M 152,68 C 160,65 167,63 175,63 C 183,63 190,65 198,68 L 198,78 C 190,75 183,74 175,74 C 167,74 160,75 152,78 Z" fill="${secondary}"/>

        <!-- MAIN BODY BACK (primary) -->
        <path d="M 88,118 C 102,130 125,145 148,151 C 158,154 167,155 175,155 C 183,155 192,154 202,151 C 225,145 248,130 262,118 C 263,158 263,200 262,222 C 261,278 259,360 257,406 L 93,406 C 91,360 89,278 88,222 C 87,200 87,158 88,118 Z" fill="${primary}"/>
        <path d="M 88,118 C 102,130 125,145 148,151 C 158,154 167,155 175,155 C 183,155 192,154 202,151 C 225,145 248,130 262,118 C 263,158 263,200 262,222 C 261,278 259,360 257,406 L 93,406 C 91,360 89,278 88,222 C 87,200 87,158 88,118 Z" fill="url(#unib_body)" opacity="0.88"/>

        <!-- SIDE STRIPES -->
        <path d="M 88,195 L 100,195 L 100,406 L 88,406 C 89,360 89,278 88,222 Z" fill="${secondary}" opacity="0.9"/>
        <path d="M 262,195 L 250,195 L 250,406 L 262,406 C 261,360 261,278 262,222 Z" fill="${secondary}" opacity="0.9"/>

        <!-- PLAYER NUMBER -->
        <text x="175" y="295" font-family="'Outfit', sans-serif" font-weight="900" font-size="78" text-anchor="middle" fill="${secondary}" opacity="0.82">10</text>
        <text x="175" y="295" font-family="'Outfit', sans-serif" font-weight="900" font-size="78" text-anchor="middle" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="3">10</text>

        <!-- HEM -->
        <path d="M 93,406 L 257,406 L 257,412 L 93,412 Z" fill="${secondary}" opacity="0.85"/>

        <!-- RAGLAN SEAM LINES (back) -->
        <path d="M 88,118 C 102,132 124,146 148,152" fill="none" stroke="rgba(0,0,0,0.16)" stroke-width="1.5"/>
        <path d="M 262,118 C 248,132 226,146 202,152" fill="none" stroke="rgba(0,0,0,0.16)" stroke-width="1.5"/>

        <!-- BODY WRINKLES -->
        <path d="M 173,180 Q 170,230 172,290 Q 174,340 172,392" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="2.5" stroke-linecap="round"/>

        <g id="svg-logo-container">${logoMarkup}</g>
      </svg>
    `
  }
};

// --- API Base (served by FastAPI on same origin) ---
const API_BASE = '';

// --- Application Core State ---
let state = {
  activeView: 'landing',
  currentCustomization: {
    apparelType: 'tshirt',
    fabricType: 'cotton',
    fabricGrade: 1,
    size: 'M',
    primaryColor: '#1e1e24',
    secondaryColor: '#00f0ff',
    stitchingStyle: 'flatlock',
    logos: [],           // array of { id, placement, preset, dataUrl, scale }
    activeLogoIndex: 0,  // which logo is selected in the editor
    printMethod: 'dtg',
    washFinish: 'standard',
    quantity: 1,
    basePrice: 1200,
    unitPrice: 1200,
    totalPrice: 1200
  },
  previewMode: 'front',
  cart: [],
  orders: [],
  chatLogs: [],
  chatMessages: [],
  inventory: [],
  // Auth state
  authToken: localStorage.getItem('aura_token') || null,
  currentUser: JSON.parse(localStorage.getItem('aura_user') || 'null'),
  chatSessionId: localStorage.getItem('aura_session') || ('sess-' + Math.random().toString(36).slice(2)),
};
localStorage.setItem('aura_session', state.chatSessionId);

// ==========================================================================
// THREE.JS 3D PREVIEW MODULE
// ==========================================================================
const ThreePreview = {
  _scene:       null,
  _camera:      null,
  _renderer:    null,
  _controls:    null,
  _model:       null,
  _container:   null,
  _animFrame:   null,
  _initialized: false,

  init() {
    const container = document.getElementById('three-canvas-container');
    if (!container || this._initialized || typeof THREE === 'undefined') return;
    this._container = container;

    // Scene
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0x16161e);

    // Camera
    const w = container.clientWidth  || 300;
    const h = container.clientHeight || 300;
    this._camera = new THREE.PerspectiveCamera(42, w / h, 0.05, 200);
    this._camera.position.set(0, 1.1, 3.2);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(2, 4, 3);
    const fill = new THREE.DirectionalLight(0x8899ff, 0.45);
    fill.position.set(-2, 0, -2);
    const rim = new THREE.DirectionalLight(0x00f0ff, 0.25);
    rim.position.set(0, -2, -3);
    this._scene.add(ambient, key, fill, rim);

    // Renderer
    this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._renderer.setSize(w, h);
    this._renderer.outputEncoding = THREE.sRGBEncoding;
    this._renderer.shadowMap.enabled = true;
    container.appendChild(this._renderer.domElement);

    // OrbitControls
    this._controls = new THREE.OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enableDamping   = true;
    this._controls.dampingFactor   = 0.06;
    this._controls.minDistance     = 1.2;
    this._controls.maxDistance     = 7;
    this._controls.maxPolarAngle   = Math.PI * 0.9;
    this._controls.target.set(0, 0.8, 0);
    this._controls.update();

    // Auto-resize
    new ResizeObserver(() => this.resize()).observe(container);

    // Render loop
    const loop = () => {
      this._animFrame = requestAnimationFrame(loop);
      this._controls.update();
      this._renderer.render(this._scene, this._camera);
    };
    loop();

    this._initialized = true;
  },

  loadModel(type) {
    if (!this._initialized) return;
    const loadingEl = document.getElementById('three-loading');
    if (loadingEl) { loadingEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>&nbsp;Loading 3D model…'; loadingEl.style.display = 'flex'; }

    // Dispose previous model
    if (this._model) {
      this._scene.remove(this._model);
      this._model.traverse(c => {
        if (c.isMesh) { c.geometry.dispose(); if (Array.isArray(c.material)) c.material.forEach(m => m.dispose()); else c.material.dispose(); }
      });
      this._model = null;
    }

    const loader = new THREE.GLTFLoader();
    loader.load(
      `/static/3d/${{ tshirt: 't-shirt', hoodie: 'hoodie', jacket: 'jacket', uniform: 'jersey' }[type] || type}.glb`,
      (gltf) => {
        this._model = gltf.scene;
        // Auto-center & scale to fit viewport
        const box    = new THREE.Box3().setFromObject(this._model);
        const center = box.getCenter(new THREE.Vector3());
        const size   = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale  = 2 / maxDim;
        this._model.scale.setScalar(scale);
        this._model.position.copy(center.multiplyScalar(-scale));
        this._scene.add(this._model);
        // Sync current customization
        const c = state.currentCustomization;
        this.applyColors(c.primaryColor, c.secondaryColor);
        this.applyLogos(c.logos || []);
        if (loadingEl) loadingEl.style.display = 'none';
      },
      undefined,
      () => {
        if (loadingEl) { loadingEl.innerHTML = '<i class="fa-solid fa-cube"></i>&nbsp;3D model not available yet'; loadingEl.style.display = 'flex'; }
      }
    );
  },

  applyColors(primary, secondary) {
    if (!this._model) return;
    const pColor = new THREE.Color(primary);
    const sColor = new THREE.Color(secondary);
    let idx = 0;
    this._model.traverse(child => {
      if (!child.isMesh) return;
      child.material = child.material.clone();
      const n = (child.name || '').toLowerCase();
      const isAccent = n.includes('trim') || n.includes('accent') || n.includes('cuff') ||
                       n.includes('neck') || n.includes('pocket') || n.includes('string') ||
                       n.includes('zip')  || n.includes('logo')   || n.includes('stripe');
      child.material.color.copy(isAccent ? sColor : (idx === 0 ? pColor : sColor));
      child.material.needsUpdate = true;
      idx++;
    });
  },

  applyLogos(logos) {
    if (!this._model || !logos || !logos.length) return;
    const frontLogo = logos.find(l => l.placement !== 'back');
    if (!frontLogo || (!frontLogo.dataUrl && !frontLogo.preset)) return;

    const size = 512;
    const offscreen = document.createElement('canvas');
    offscreen.width = offscreen.height = size;
    const ctx = offscreen.getContext('2d');
    ctx.fillStyle = state.currentCustomization.primaryColor || '#1e1e24';
    ctx.fillRect(0, 0, size, size);

    const applyTex = () => {
      const tex = new THREE.CanvasTexture(offscreen);
      this._model.traverse(child => {
        if (!child.isMesh) return;
        const n = (child.name || '').toLowerCase();
        if (n.includes('body') || n.includes('front') || n.includes('chest') || n.includes('shirt') || n.includes('main')) {
          child.material = child.material.clone();
          child.material.map = tex;
          child.material.needsUpdate = true;
        }
      });
    };

    if (frontLogo.dataUrl) {
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 180, 120, 150, 150); applyTex(); };
      img.src = frontLogo.dataUrl;
    } else {
      applyTex();
    }
  },

  resize() {
    if (!this._renderer || !this._container) return;
    const w = this._container.clientWidth;
    const h = this._container.clientHeight;
    if (!w || !h) return;
    this._camera.aspect = w / h;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(w, h);
  },

  dispose() {
    if (this._animFrame) cancelAnimationFrame(this._animFrame);
    if (this._renderer) { this._renderer.dispose(); this._renderer.domElement.remove(); }
    this._initialized = false;
  }
};

// --- Central API Helper ---
async function api(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const hadToken = !!state.authToken;
  if (hadToken) headers['Authorization'] = `Bearer ${state.authToken}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API_BASE + endpoint, opts);
  if (res.status === 401) {
    if (hadToken) {
      // Genuine session expiry — clear silently, no toast
      _clearAuthState();
      return null;
    }
    // No token → login/register failure; let it fall through to throw
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
}

// --- Initialize Application ---
window.onload = async function() {
  state.cart = JSON.parse(localStorage.getItem('aura_cart') || '[]');
  updateCartBadge();
  renderCart();
  updateAuthUI();
  renderCustomizerPreview();
  updatePrice();

  // Load products from real API, fall back to hardcoded if backend unavailable
  try {
    await renderCatalog();
  } catch(e) {
    renderCatalogFallback();
  }

  // Restore chat history from session
  _loadChatHistory();

  showToast('Welcome to AURA-WEAR!', 'Design your custom apparel.', 'success');
};

// --- Toast Alert Notifications System ---
function showToast(title, msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast-alert ${type}`;
  
  let iconClass = 'fa-info-circle';
  if (type === 'success') iconClass = 'fa-check-circle';
  if (type === 'warning') iconClass = 'fa-exclamation-triangle';
  if (type === 'danger') iconClass = 'fa-times-circle';

  toast.innerHTML = `
    <div class="toast-icon"><i class="fa-solid ${iconClass}"></i></div>
    <div class="toast-body">
      <h4>${title}</h4>
      <p>${msg}</p>
    </div>
    <button class="toast-close" aria-label="Dismiss">&#x2715;</button>
  `;

  container.appendChild(toast);

  const dismiss = () => {
    toast.style.animation = 'fadeOut 0.4s ease forwards';
    setTimeout(() => toast.remove(), 400);
  };
  const timer = setTimeout(dismiss, 5000);
  toast.querySelector('.toast-close').addEventListener('click', () => {
    clearTimeout(timer);
    dismiss();
  });
}

// --- View Router Controller ---
function switchView(viewName) {
  // ── Auth guards — checked BEFORE any DOM changes ──────────────────────────
  if (viewName === 'admin') {
    const role = state.currentUser?.role;
    if (!state.authToken || role !== 'admin') {
      showToast('Access Denied', 'Admin login required.', 'danger');
      openAuthModal();
      return;           // abort — never touch the DOM
    }
  }
  if (viewName === 'orders' || viewName === 'profile') {
    if (!state.authToken) {
      showToast('Login Required', 'Please sign in first.', 'warning');
      openAuthModal();
      return;           // abort — never touch the DOM
    }
  }

  // ── Reveal the requested view ─────────────────────────────────────────────
  document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  state.activeView = viewName;

  const section = document.getElementById(`view-${viewName}`);
  if (section) section.classList.add('active');

  const navLink = document.getElementById(`nav-${viewName}`);
  if (navLink) navLink.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // ── Post-render hooks ─────────────────────────────────────────────────────
  if (viewName === 'admin')      renderAdminDashboard();
  if (viewName === 'orders')     loadMyOrders();
  if (viewName === 'profile')    loadProfile();
  if (viewName === 'customizer') {
    renderLogoEditor();
    // Init 3D on first visit, then load model for current apparel type
    ThreePreview.init();
    ThreePreview.loadModel(state.currentCustomization.svgType || state.currentCustomization.apparelType || 'tshirt');
  }
}

// --- Catalog Rendering & Filters ---
// Cached products from API
let _products = [];

// Maps product category to one of the 4 SVG apparel types
const CATEGORY_SVG_MAP = {
  'T-Shirt':        'tshirt',
  'Hoodie':         'hoodie',
  'Jacket':         'jacket',
  'Sports Uniform': 'uniform',
};
function getSvgType(category) {
  return CATEGORY_SVG_MAP[category] || 'tshirt';
}

async function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  grid.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-muted)"><i class="fa-solid fa-spinner fa-spin"></i> Loading products…</div>';
  const data = await api('/api/products');
  if (!data) { renderCatalogFallback(); return; }
  _products = data.map(p => ({
    id: p.product_id,
    name: p.name,
    category: p.category,
    gender: p.gender || 'Unisex',
    basePrice: p.base_price,
    discountPercent: p.discount_percent || 0,
    desc: p.description,
    img: p.image_url,
    svgType: getSvgType(p.category),
  }));
  _renderProductCards(_products);
}

function renderCatalogFallback() {
  _products = INITIAL_PRODUCTS;
  _renderProductCards(_products);
}

function _renderProductCards(products) {
  const grid = document.getElementById('catalog-grid');
  grid.innerHTML = '';
  if (!products.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted)">No products found.</p>';
    return;
  }
  products.forEach(p => {
    const isActive = p.is_active !== false;
    const discount = p.discountPercent || 0;
    const discountedPrice = (discount > 0 && isActive) ? Math.round(p.basePrice * (1 - discount / 100)) : null;
    const saleBadge   = (discount > 0 && isActive) ? `<span class="sale-badge">-${discount}% OFF</span>` : '';
    const outOfStock  = !isActive ? `<span class="out-of-stock-badge">Unavailable</span>` : '';
    const genderTag   = p.gender && p.gender !== 'Unisex' ? `<span class="gender-tag">${p.gender}</span>` : '';
    const priceHtml   = discountedPrice
      ? `<span class="price-original">PKR ${p.basePrice.toLocaleString()}</span><span class="price price-sale">PKR ${discountedPrice.toLocaleString()}</span>`
      : `<span class="price">PKR ${p.basePrice.toLocaleString()}</span>`;

    const card = document.createElement('div');
    card.className = `product-card glass${!isActive ? ' product-unavailable' : ''}`;
    card.innerHTML = `
      <div class="product-visual">
        <span class="product-tag">${p.category}</span>
        ${genderTag}
        ${saleBadge}
        ${outOfStock}
        <img src="${p.img}" alt="${p.name}"
             onerror="this.onerror=null;this.src='https://placehold.co/500x400/1e1e24/00f0ff?text=${encodeURIComponent(p.category)}'">
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-card-footer">
          <div class="price-group">${priceHtml}</div>
          ${isActive
            ? `<div class="product-card-actions">
                 <button class="btn btn-sm btn-outline" onclick="quickAddToCart('${p.id}')"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
                 <button class="btn btn-sm btn-primary" onclick="loadProductIntoCustomizer('${p.id}'); loadRelatedProducts('${p.id}');"><i class="fa-solid fa-wand-magic-sparkles"></i> Customize</button>
               </div>`
            : `<button class="btn btn-sm btn-outline" disabled style="opacity:0.5;cursor:not-allowed">Unavailable</button>`
          }
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterCatalog() {
  const query    = document.getElementById('catalog-search').value.toLowerCase();
  const category = document.getElementById('catalog-category-filter').value;
  const gender   = document.getElementById('catalog-gender-filter')?.value || 'all';
  const minPrice = parseFloat(document.getElementById('price-min')?.value) || 0;
  const maxPrice = parseFloat(document.getElementById('price-max')?.value) || Infinity;
  const filtered = _products.filter(p => {
    const matchQuery  = p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query);
    const matchCat    = category === 'all' || p.category === category;
    const matchGender = gender === 'all' || p.gender === gender;
    const price       = p.basePrice ?? p.base_price ?? 0;
    const matchPrice  = price >= minPrice && price <= maxPrice;
    return matchQuery && matchCat && matchGender && matchPrice;
  });
  _renderProductCards(filtered);
}

function loadProductIntoCustomizer(productId) {
  const p = _products.find(item => item.id === productId) || INITIAL_PRODUCTS.find(item => item.id === productId);
  if (p) {
    state.currentCustomization.apparelType = p.id;
    state.currentCustomization.svgType = p.svgType || getSvgType(p.category) || 'tshirt';
    state.currentCustomization.basePrice = p.basePrice;
    state.currentCustomization.productName = p.name;

    // Update labels
    document.getElementById('selected-product-title').innerText = p.name;

    // Highlight the matching base-type tile (tshirt/hoodie/jacket/uniform)
    document.querySelectorAll('#tab-apparel .tile-card').forEach(t => t.classList.remove('active'));
    const baseTile = document.getElementById(`tile-type-${state.currentCustomization.svgType}`);
    if (baseTile) baseTile.classList.add('active');
    
    // Recalculate, render, & route
    updatePrice();
    renderCustomizerPreview();
    switchView('customizer');
  }
}

// --- SVG Preview Construction & Rendering ---
function renderCustomizerPreview() {
  const container = document.getElementById('apparel-canvas-container');
  const type = state.currentCustomization.svgType || state.currentCustomization.apparelType;
  const primary = state.currentCustomization.primaryColor;
  const secondary = state.currentCustomization.secondaryColor;
  const view = state.previewMode;
  
  // 1. Build logo markup for all logos
  let logoMarkup = '';
  const logos = state.currentCustomization.logos || [];

  function _getLogoCoords(placement, scale) {
    scale = scale || 1.0;
    let base;
    if (placement === 'chest') {
      base = (type === 'hoodie') ? { x: 150, y: 218, w: 42, h: 42 } :
             (type === 'jacket') ? { x: 100, y: 248, w: 30, h: 30 } :
             (type === 'uniform') ? { x: 152, y: 195, w: 40, h: 40 } :
             { x: 155, y: 165, w: 40, h: 40 };
    } else if (placement === 'left_sleeve') {
      base = (type === 'jacket') ? { x: 24, y: 218, w: 20, h: 20 } :
             (type === 'hoodie') ? { x: 10, y: 228, w: 20, h: 20 } :
             { x: 48, y: 160, w: 22, h: 22 };
    } else if (placement === 'right_sleeve') {
      base = (type === 'jacket') ? { x: 316, y: 218, w: 20, h: 20 } :
             (type === 'hoodie') ? { x: 320, y: 228, w: 20, h: 20 } :
             { x: 280, y: 160, w: 22, h: 22 };
    } else if (placement === 'back') {
      base = (type === 'jacket') ? { x: 128, y: 240, w: 104, h: 104 } :
             (type === 'hoodie') ? { x: 120, y: 255, w: 95, h: 95 } :
             { x: 135, y: 165, w: 80, h: 80 };
    } else {
      base = { x: 155, y: 165, w: 40, h: 40 };
    }
    const w = base.w * scale;
    const h = base.h * scale;
    const cx = base.x + base.w / 2;
    const cy = base.y + base.h / 2;
    return { x: cx - w / 2, y: cy - h / 2, w, h };
  }

  logos.forEach(logo => {
    const isBackLogo = logo.placement === 'back';
    if ((view === 'front' && isBackLogo) || (view === 'back' && !isBackLogo)) return;
    const coords = _getLogoCoords(logo.placement, logo.scale || 1.0);
    if (logo.preset && LOGO_PRESETS[logo.preset]) {
      logoMarkup += `<g transform="translate(${coords.x}, ${coords.y}) scale(${coords.w / 50})" color="${secondary}">${LOGO_PRESETS[logo.preset]}</g>`;
    } else if (logo.dataUrl) {
      logoMarkup += `<image href="${logo.dataUrl}" x="${coords.x}" y="${coords.y}" width="${coords.w}" height="${coords.h}" />`;
    } else {
      logoMarkup += `<text x="${coords.x + coords.w/2}" y="${coords.y + coords.h/2}" font-size="8" text-anchor="middle" fill="${secondary}" font-family="sans-serif">LOGO</text>`;
    }
  });
  
  // 2. Fetch correct SVG function
  const svgTemplate = APPAREL_SVGS[type][view];
  container.innerHTML = svgTemplate(primary, secondary, logoMarkup);

  // Sync 3D preview
  ThreePreview.applyColors(primary, secondary);
  ThreePreview.applyLogos(state.currentCustomization.logos || []);
}

function togglePreviewMode(mode) {
  state.previewMode = mode;
  document.getElementById('btn-view-front').classList.toggle('active', mode === 'front');
  document.getElementById('btn-view-back').classList.toggle('active', mode === 'back');
  renderCustomizerPreview();
}

// --- Customizer Event Handlers & Control Tabs ---
function switchControlTab(tabId) {
  document.querySelectorAll('.customizer-controls-pane .tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.customizer-controls-pane .tab-content').forEach(cont => cont.classList.remove('active'));

  event.target.classList.add('active');
  document.getElementById(`tab-${tabId}`).classList.add('active');

  if (tabId === 'logo') renderLogoEditor();
}

function openAIGenModal() {
  switchView('customizer');
  setTimeout(() => {
    const aiTabBtn = [...document.querySelectorAll('.customizer-controls-pane .tab-btn')].find(b => b.textContent.includes('AI Image'));
    if (aiTabBtn) aiTabBtn.click();
  }, 100);
}

// ── AI Image Generation ───────────────────────────────────────────────────────

let _aiGenCategory = null;
let _aiGenImageBase64 = null;
let _aiGenMimeType = 'image/png';

const AIGEN_LABELS = {
  tshirt:  'T-Shirt',
  hoodie:  'Hoodie',
  jacket:  'Jacket',
  uniform: 'Sport Jersey',
};

function selectAIGenCategory(category) {
  _aiGenCategory = category;

  document.querySelectorAll('[id^="aigen-tile-"]').forEach(t => t.classList.remove('active'));
  document.getElementById(`aigen-tile-${category}`)?.classList.add('active');

  document.getElementById('aigen-selected-badge').innerHTML =
    `<span class="aigen-badge-chip"><i class="fa-solid fa-check"></i> ${AIGEN_LABELS[category] || category}</span>`;

  document.getElementById('aigen-step-category').style.display = 'none';
  document.getElementById('aigen-step-prompt').style.display = '';
  document.getElementById('aigen-prompt-input').focus();
}

function resetAIGenCategory() {
  _aiGenCategory = null;
  document.getElementById('aigen-step-category').style.display = '';
  document.getElementById('aigen-step-prompt').style.display = 'none';
  document.getElementById('aigen-step-result').style.display = 'none';
  document.getElementById('aigen-loading').style.display = 'none';
  document.querySelectorAll('[id^="aigen-tile-"]').forEach(t => t.classList.remove('active'));
}

function resetAIGen() {
  document.getElementById('aigen-step-result').style.display = 'none';
  document.getElementById('aigen-step-prompt').style.display = '';
  document.getElementById('aigen-prompt-input').value = '';
  document.getElementById('aigen-prompt-input').focus();
}

async function generateAIImage() {
  const prompt = document.getElementById('aigen-prompt-input').value.trim();
  if (!prompt) {
    showToast('Missing Description', 'Please describe the design you want.', 'error');
    return;
  }
  if (!_aiGenCategory) {
    showToast('No Category', 'Please select a garment type first.', 'error');
    return;
  }

  document.getElementById('aigen-step-prompt').style.display = 'none';
  document.getElementById('aigen-step-result').style.display = 'none';
  document.getElementById('aigen-loading').style.display = 'flex';

  try {
    const data = await api('/api/image-gen', 'POST', { category: _aiGenCategory, prompt });
    _aiGenImageBase64 = data.image_base64;
    _aiGenMimeType = data.mime_type || 'image/png';

    const imgEl = document.getElementById('aigen-result-img');
    imgEl.src = `data:${_aiGenMimeType};base64,${_aiGenImageBase64}`;

    document.getElementById('aigen-loading').style.display = 'none';
    document.getElementById('aigen-step-result').style.display = '';
    showToast('Design Ready!', 'Your AI-generated design is ready.', 'success');
  } catch (err) {
    document.getElementById('aigen-loading').style.display = 'none';
    document.getElementById('aigen-step-prompt').style.display = '';
    showToast('Generation Failed', err.message || 'Could not generate image.', 'error');
  }
}

function downloadAIImage() {
  if (!_aiGenImageBase64) return;
  const a = document.createElement('a');
  a.href = `data:${_aiGenMimeType};base64,${_aiGenImageBase64}`;
  a.download = `aura-design-${_aiGenCategory}-${Date.now()}.png`;
  a.click();
}

function useAIImageAsLogo() {
  if (!_aiGenImageBase64) return;
  const dataUrl = `data:${_aiGenMimeType};base64,${_aiGenImageBase64}`;

  addLogo();
  const logos = state.currentCustomization.logos;
  const active = logos.at(-1);
  if (active) {
    active.dataUrl = dataUrl;
    renderLogoEditor();
    renderCustomizerPreview();
    // Switch to Logo & Finish tab
    document.querySelectorAll('.customizer-controls-pane .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.customizer-controls-pane .tab-content').forEach(c => c.classList.remove('active'));
    const logoTabBtn = [...document.querySelectorAll('.customizer-controls-pane .tab-btn')].find(b => b.textContent.includes('Logo'));
    if (logoTabBtn) logoTabBtn.classList.add('active');
    document.getElementById('tab-logo')?.classList.add('active');
    showToast('Logo Applied', 'AI design added as logo — adjust placement and size in the Logo tab.', 'success');
  }
}

// ─────────────────────────────────────────────────────────────────────────────

function setApparelType(type) {
  state.currentCustomization.apparelType = type;
  
  // Find correct base price
  const p = INITIAL_PRODUCTS.find(item => item.id === type);
  if (p) {
    state.currentCustomization.basePrice = p.basePrice;
    document.getElementById('selected-product-title').innerText = p.name;
  }
  
  document.querySelectorAll('#tab-apparel .tile-card').forEach(t => t.classList.remove('active'));
  document.getElementById(`tile-type-${type}`).classList.add('active');
  
  updatePrice();
  renderCustomizerPreview();
  ThreePreview.loadModel(type);
}

function setFabricType(fabric) {
  state.currentCustomization.fabricType = fabric;
  document.querySelectorAll('#tab-fabric .tile-card').forEach(t => t.classList.remove('active'));
  document.getElementById(`tile-fabric-${fabric}`).classList.add('active');
  
  updatePrice();
}

function setFabricGsm(grade) {
  state.currentCustomization.fabricGrade = parseInt(grade);
  document.querySelectorAll('.gsm-tile').forEach(t => t.classList.remove('active'));
  const tile = document.getElementById(`tile-gsm-${grade}`);
  if (tile) tile.classList.add('active');
  updatePrice();
}

function setColor(type, color, elem = null) {
  if (type === 'primary') {
    state.currentCustomization.primaryColor = color;
    document.getElementById('primary-color-picker').value = color;
  } else {
    state.currentCustomization.secondaryColor = color;
    document.getElementById('secondary-color-picker').value = color;
  }
  
  // Manage active classes
  if (elem) {
    const siblings = elem.parentElement.querySelectorAll('.color-swatch');
    siblings.forEach(s => s.classList.remove('active'));
    elem.classList.add('active');
  }
  
  renderCustomizerPreview();
  const c = state.currentCustomization;
  ThreePreview.applyColors(c.primaryColor, c.secondaryColor);
}

function setStitchStyle(style) {
  state.currentCustomization.stitchingStyle = style;
  document.querySelectorAll('#tab-design .text-only-grid .tile-card').forEach(t => t.classList.remove('active'));
  document.getElementById(`tile-stitch-${style}`).classList.add('active');
  
  updatePrice();
}

// --- Multi-Logo Management ---
const MAX_LOGOS = 4;

function _getActiveLogoIndex() {
  const idx = state.currentCustomization.activeLogoIndex;
  const logos = state.currentCustomization.logos;
  if (logos.length === 0) return -1;
  return Math.min(idx, logos.length - 1);
}

function addLogo() {
  const logos = state.currentCustomization.logos;
  if (logos.length >= MAX_LOGOS) {
    showToast('Limit Reached', `You can add up to ${MAX_LOGOS} logos per design.`, 'warning');
    return;
  }
  logos.push({ id: Date.now(), placement: 'chest', preset: '', dataUrl: '', scale: 1.0 });
  state.currentCustomization.activeLogoIndex = logos.length - 1;
  renderLogoEditor();
  renderCustomizerPreview();
  showToast('Logo Added', `Logo ${logos.length} created — choose placement and graphic.`, 'success');
}

function removeLogo(index) {
  const logos = state.currentCustomization.logos;
  logos.splice(index, 1);
  if (state.currentCustomization.activeLogoIndex >= logos.length) {
    state.currentCustomization.activeLogoIndex = Math.max(0, logos.length - 1);
  }
  renderLogoEditor();
  renderCustomizerPreview();
  showToast('Logo Removed', 'Logo deleted from design.', 'info');
}

function setActiveLogo(index) {
  state.currentCustomization.activeLogoIndex = index;
  renderLogoEditor();
}

function setActiveLogoPlacement(placement) {
  const idx = _getActiveLogoIndex();
  if (idx === -1) return;
  state.currentCustomization.logos[idx].placement = placement;
  // Switch preview to match
  togglePreviewMode(placement === 'back' ? 'back' : 'front');
  renderLogoEditor();
  renderCustomizerPreview();
}

function handleActiveLogoUpload(event) {
  const idx = _getActiveLogoIndex();
  if (idx === -1) return;
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast('Upload Rejected', 'Logo file size exceeds 5MB limit.', 'danger');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    state.currentCustomization.logos[idx].dataUrl = e.target.result;
    state.currentCustomization.logos[idx].preset = '';
    renderLogoEditor();
    renderCustomizerPreview();
    showToast('Upload Successful', `Logo ${idx + 1}: ${file.name}`, 'success');
  };
  reader.readAsDataURL(file);
}

function clearActiveLogo() {
  const idx = _getActiveLogoIndex();
  if (idx === -1) return;
  state.currentCustomization.logos[idx].dataUrl = '';
  state.currentCustomization.logos[idx].preset = '';
  renderLogoEditor();
  renderCustomizerPreview();
  showToast('Graphic Cleared', `Logo ${idx + 1} graphic removed.`, 'info');
}

function usePresetForActiveLogo(presetName) {
  const idx = _getActiveLogoIndex();
  if (idx === -1) return;
  state.currentCustomization.logos[idx].preset = presetName;
  state.currentCustomization.logos[idx].dataUrl = '';
  renderLogoEditor();
  renderCustomizerPreview();
  showToast('Preset Selected', `Applied AURA ${presetName.toUpperCase()} to Logo ${idx + 1}`, 'success');
}

function setActiveLogoScale(val) {
  const idx = _getActiveLogoIndex();
  if (idx === -1) return;
  state.currentCustomization.logos[idx].scale = parseFloat(val);
  document.getElementById('logo-scale-value').textContent = parseFloat(val).toFixed(1) + '×';
  renderCustomizerPreview();
}

function renderLogoEditor() {
  const logos = state.currentCustomization.logos;
  const activeIdx = _getActiveLogoIndex();
  const listEl = document.getElementById('logo-list');
  const editorEl = document.getElementById('logo-editor-panel');
  const addBtn = document.getElementById('btn-add-logo');

  // Update add button state
  if (addBtn) addBtn.disabled = logos.length >= MAX_LOGOS;

  // Render logo list
  if (!listEl) return;
  if (logos.length === 0) {
    listEl.innerHTML = `<p class="upload-hint" style="padding:0.5rem 0">No logos added yet. Click <strong>+ Add Logo</strong> to begin.</p>`;
    if (editorEl) editorEl.style.display = 'none';
    return;
  }

  const placementLabels = { chest: 'Chest', back: 'Back Center', left_sleeve: 'Left Sleeve', right_sleeve: 'Right Sleeve' };
  listEl.innerHTML = logos.map((logo, i) => {
    const label = placementLabels[logo.placement] || logo.placement;
    const graphic = logo.preset ? `AURA ${logo.preset.toUpperCase()}` : logo.dataUrl ? 'Custom Upload' : 'No Graphic';
    return `
      <div class="logo-list-item ${i === activeIdx ? 'active' : ''}" onclick="setActiveLogo(${i})">
        <span class="logo-item-num">${i + 1}</span>
        <span class="logo-item-info"><strong>${label}</strong><small>${graphic} &middot; ${(logo.scale || 1).toFixed(1)}×</small></span>
        <button class="logo-item-remove" onclick="event.stopPropagation(); removeLogo(${i})" title="Remove">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>`;
  }).join('');

  // Show editor for active logo
  if (!editorEl) return;
  if (activeIdx === -1) { editorEl.style.display = 'none'; return; }
  editorEl.style.display = '';
  const logo = logos[activeIdx];

  // Update placement tiles
  document.querySelectorAll('#logo-placement-tiles .tile-card').forEach(t => t.classList.remove('active'));
  const placTile = document.getElementById(`tile-logo-${logo.placement}`);
  if (placTile) placTile.classList.add('active');

  // Update thumbnail
  const thumb = document.getElementById('logo-thumbnail-preview');
  if (thumb) {
    if (logo.dataUrl) {
      thumb.innerHTML = `<img src="${logo.dataUrl}" alt="Logo thumbnail">`;
    } else if (logo.preset) {
      const iconHtml = logo.preset === 'cyberpunk' ? '<i class="fa-solid fa-burst"></i>' :
                       logo.preset === 'streetwear' ? '<i class="fa-solid fa-shield-halved"></i>' :
                       '<i class="fa-solid fa-bolt-lightning"></i>';
      thumb.innerHTML = `<div style="color:var(--teal-neon);font-size:1.4rem;">${iconHtml}</div>`;
    } else {
      thumb.innerHTML = `<i class="fa-solid fa-image"></i>`;
    }
  }

  // Update scale slider
  const slider = document.getElementById('logo-scale-slider');
  const scaleLabel = document.getElementById('logo-scale-value');
  if (slider) slider.value = logo.scale || 1.0;
  if (scaleLabel) scaleLabel.textContent = (logo.scale || 1.0).toFixed(1) + '×';
}

// Legacy compat — AI chat may call these
function setLogoPlacement(placement) { setActiveLogoPlacement(placement); }
function handleLogoUpload(event) { handleActiveLogoUpload(event); }
function clearUploadedLogo() { clearActiveLogo(); }
function usePresetLogo(presetName) { usePresetForActiveLogo(presetName); }

function setPrintMethod(method) {
  state.currentCustomization.printMethod = method;
  document.querySelectorAll('#tab-logo .tile-grid:not(#logo-placement-tiles) .tile-card').forEach(t => t.classList.remove('active'));
  document.getElementById(`tile-print-${method}`).classList.add('active');
  
  updatePrice();
}

function updateWashFinish(val) {
  state.currentCustomization.washFinish = val;
  updatePrice();
}

function adjustCustomizerQty(amount) {
  const qtyInput = document.getElementById('customizer-qty');
  let newQty = parseInt(qtyInput.value) + amount;
  if (newQty < 1) newQty = 1;
  qtyInput.value = newQty;
  
  updatePrice();
}

// --- Dynamic Real-time Pricing Engine ---
function updatePrice() {
  const qtyInput = document.getElementById('customizer-qty');
  state.currentCustomization.quantity = parseInt(qtyInput.value) || 1;
  
  const cust = state.currentCustomization;
  
  // 1. Base price
  let base = cust.basePrice;
  
  // 2. Fabric modifiers
  const fMultiplier = FABRICS_INFO[cust.fabricType].multiplier;
  const gradeAdd = 1 + (cust.fabricGrade - 1) * 0.15; // 15% per grade step
  
  // 3. Thread Stitching add-on costs
  const stitchCosts = { flatlock: 100, overlock: 0, chainstitch: 150 };
  const sAdd = stitchCosts[cust.stitchingStyle] || 0;
  
  // 4. Print method add-on costs
  const printCosts = { dtg: 350, screen: 200, embroidery: 500, heat: 250 };
  const pAdd = printCosts[cust.printMethod] || 0;
  
  // 5. Finishing wash effects
  const washCosts = { standard: 0, stone: 150, acid: 250, enzyme: 100 };
  const wAdd = washCosts[cust.washFinish] || 0;
  
  // Unit Cost calculation
  let unit = Math.round((base * fMultiplier * gradeAdd) + sAdd + pAdd + wAdd);
  cust.unitPrice = unit;
  
  // Bulk discounts (Manufacturer tiers)
  let discountMultiplier = 1.0;
  if (cust.quantity >= 10 && cust.quantity < 50) {
    discountMultiplier = 0.90; // 10% off
  } else if (cust.quantity >= 50) {
    discountMultiplier = 0.80; // 20% off
  }
  
  cust.totalPrice = Math.round(unit * cust.quantity * discountMultiplier);
  
  // Update Price tags in UI
  document.getElementById('price-display').innerText = `PKR ${cust.totalPrice.toLocaleString()}`;
}

// --- Shopping Cart Draw Panel Operations ---
function toggleCartDrawer() {
  document.getElementById('cart-drawer').classList.toggle('active');
}

function addToCartFromCustomizer() {
  // Deep clone current customization settings
  const cartItem = JSON.parse(JSON.stringify(state.currentCustomization));
  
  // Attach human readable names for summary details
  cartItem.fabricName = FABRICS_INFO[cartItem.fabricType].name;
  
  state.cart.push(cartItem);
  localStorage.setItem('aura_cart', JSON.stringify(state.cart));
  renderCart();
  updateCartBadge();
  toggleCartDrawer();

  showToast('Item Added', 'Your customized clothing was added to bag.', 'success');
}

function quickAddToCart(productId) {
  const p = _products.find(item => item.id === productId) || INITIAL_PRODUCTS.find(item => item.id === productId);
  if (!p) return;
  const cartItem = {
    apparelType: p.id,
    svgType: p.svgType || getSvgType(p.category) || 'tshirt',
    name: p.name,
    fabricType: 'cotton',
    fabricGrade: 1,
    fabricName: 'Combed Cotton',
    size: 'M',
    primaryColor: '#1e1e24',
    secondaryColor: '#00f0ff',
    stitchingStyle: 'flatlock',
    printMethod: 'dtg',
    washFinish: 'standard',
    logos: [],
    quantity: 1,
    basePrice: p.basePrice,
    unitPrice: p.basePrice,
    totalPrice: p.basePrice,
  };
  state.cart.push(cartItem);
  localStorage.setItem('aura_cart', JSON.stringify(state.cart));
  renderCart();
  updateCartBadge();
  showToast('Added to Cart', `${p.name} added with default settings. Customize before checkout.`, 'success');
}

function updateCartBadge() {
  document.getElementById('cart-count').innerText = state.cart.length;
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  container.innerHTML = '';
  
  if (state.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 0; color: var(--text-muted);">
        <i class="fa-solid fa-bag-shopping" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <p>Your shopping bag is currently empty.</p>
      </div>
    `;
    
    document.getElementById('cart-subtotal').innerText = 'PKR 0';
    document.getElementById('cart-tax').innerText = 'PKR 0';
    document.getElementById('cart-grandtotal').innerText = 'PKR 0';
    return;
  }
  
  let subtotal = 0;
  
  state.cart.forEach((item, index) => {
    subtotal += item.totalPrice;
    
    // Draw visual thumbnail inside the cart item card
    const previewBox = document.createElement('div');
    previewBox.className = 'cart-item-preview';
    // Generate inline SVG thumb — render first front logo in miniature
    let logoMini = '';
    const cartLogos = item.logos || [];
    const firstFrontLogo = cartLogos.find(l => l.placement !== 'back');
    if (firstFrontLogo) {
      if (firstFrontLogo.preset && LOGO_PRESETS[firstFrontLogo.preset]) {
        logoMini = `<g transform="translate(15, 15) scale(0.4)" color="${item.secondaryColor}">${LOGO_PRESETS[firstFrontLogo.preset]}</g>`;
      } else if (firstFrontLogo.dataUrl) {
        logoMini = `<image href="${firstFrontLogo.dataUrl}" x="15" y="15" width="16" height="16" />`;
      }
    } else if (item.logoPreset) {
      // Backwards compat for old cart items
      logoMini = `<g transform="translate(15, 15) scale(0.4)" color="${item.secondaryColor}">${LOGO_PRESETS[item.logoPreset]}</g>`;
    }
    const svgThumb = APPAREL_SVGS[item.svgType || item.apparelType]?.front(item.primaryColor, item.secondaryColor, logoMini) || '';
    
    const cartCard = document.createElement('div');
    cartCard.className = 'cart-item';
    cartCard.innerHTML = `
      <div class="cart-item-preview">
        ${svgThumb}
      </div>
      <div class="cart-item-details">
        <h4>${item.name || item.apparelType.toUpperCase()} — Design #${100 + index}</h4>
        <div class="cart-item-meta">
          <span>Size: ${item.size || 'M'} &nbsp;|&nbsp; Material: ${FABRICS_INFO[item.fabricType].name} (${(GSM_MAP[item.fabricGrade] || GSM_MAP[1]).label})</span>
          <span>Print: ${item.printMethod.toUpperCase()} | Stitch: ${item.stitchingStyle}</span>
          <span>Colors: <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:${item.primaryColor}"></span> / <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:${item.secondaryColor}"></span></span>
        </div>
        <div class="cart-item-footer">
          <span class="qty">Qty: ${item.quantity}</span>
          <span class="price">PKR ${item.totalPrice.toLocaleString()}</span>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeCartItem(${index})"><i class="fa-solid fa-trash-can"></i></button>
    `;
    container.appendChild(cartCard);
  });
  
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const grandtotal = subtotal + tax;
  
  document.getElementById('cart-subtotal').innerText = `PKR ${subtotal.toLocaleString()}`;
  document.getElementById('cart-tax').innerText = `PKR ${tax.toLocaleString()}`;
  document.getElementById('cart-grandtotal').innerText = `PKR ${grandtotal.toLocaleString()}`;
}

function removeCartItem(index) {
  state.cart.splice(index, 1);
  localStorage.setItem('aura_cart', JSON.stringify(state.cart));
  renderCart();
  updateCartBadge();
  showToast('Removed', 'Apparel design removed from bag.', 'warning');
}

// --- Checkout Modal Flow ---
function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast('Action Blocked', 'Bag must contain at least 1 customizable item.', 'warning');
    return;
  }
  toggleCartDrawer();
  
  // Reset coupon + shipping defaults
  state._checkoutShippingCost   = 800;
  state._checkoutShippingMethod = 'DHL Express';
  state._couponDiscount = 0;
  state._couponCode     = '';
  document.getElementById('coupon-code-input').value = '';
  const fb = document.getElementById('coupon-feedback');
  if (fb) { fb.style.display = 'none'; fb.textContent = ''; }

  _recalcCheckoutTotal();
  document.getElementById('checkout-modal').classList.add('active');
}

function selectShipping(labelEl, method, cost) {
  document.querySelectorAll('.shipping-card-label').forEach(l => l.classList.remove('active'));
  labelEl.classList.add('active');
  state._checkoutShippingCost   = cost;
  state._checkoutShippingMethod = method;
  _recalcCheckoutTotal();
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal').classList.remove('active');
}

function togglePaymentSection(type) {
  document.querySelectorAll('.payment-sub-fields').forEach(f => f.classList.remove('active'));
  document.querySelectorAll('.payment-card-label').forEach(l => l.classList.remove('active'));
  
  // set active labels
  event.currentTarget.classList.add('active');
  
  if (type === 'card') document.getElementById('pay-fields-card').classList.add('active');
  if (type === 'wallet') document.getElementById('pay-fields-wallet').classList.add('active');
  if (type === 'cod') document.getElementById('pay-fields-cod').classList.add('active');
}

// --- Placing Order → Real Backend ---
// Stored so the wallet OTP modal can confirm payment after order is created
let _pendingWalletOrderId = null;

async function handlePlaceOrder(event) {
  event.preventDefault();

  if (!state.authToken) {
    showToast('Login Required', 'Please sign in to place an order.', 'warning');
    openAuthModal();
    return;
  }

  const name = document.getElementById('c-name').value;
  const phone = document.getElementById('c-phone').value;
  const address = document.getElementById('c-address').value;
  const payMethod = document.querySelector('input[name="payment-method"]:checked').value;

  const btn = event.target.querySelector('button[type="submit"]') || event.submitter;
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Placing…'; }

  const items = state.cart.map(item => ({
    product_id: item.apparelType,
    fabric_type: item.fabricType,
    fabric_grade: item.fabricGrade,
    primary_color: item.primaryColor,
    secondary_color: item.secondaryColor,
    stitching_style: item.stitchingStyle,
    print_method: item.printMethod,
    wash_finish: item.washFinish,
    quantity: item.quantity,
    logo_base64: (item.logos || []).find(l => l.dataUrl)?.dataUrl || item.logoDataUrl || null,
    notes: null
  }));

  try {
    const order = await api('/api/orders', 'POST', {
      items,
      payment_method:   payMethod,
      name,
      phone,
      address,
      shipping_method:  state._checkoutShippingMethod || 'Standard Post',
      shipping_cost:    state._checkoutShippingCost   || 150,
      coupon_code:      state._couponCode || null,
      coupon_discount:  state._couponDiscount || 0
    });
    if (!order) return;

    state.cart = [];
    localStorage.setItem('aura_cart', JSON.stringify([]));
    updateCartBadge();
    renderCart();
    closeCheckoutModal();

    // FR-41/42: For wallet payments, show OTP confirmation flow
    if (payMethod === 'JazzCash' || payMethod === 'Easypaisa') {
      _pendingWalletOrderId = order.order_id;
      const simOtp = Math.floor(100000 + Math.random() * 900000).toString();
      document.getElementById('wallet-sim-otp').textContent = simOtp;
      document.getElementById('wallet-otp-input').value = '';
      document.getElementById('wallet-sim-otp').dataset.otp = simOtp;
      document.getElementById('wallet-otp-modal').classList.add('active');
      showToast('OTP Sent', `Simulated OTP dispatched for ${payMethod}`, 'info');
      return;
    }

    _showOrderSuccess(order);
  } catch(e) {
    showToast('Order Failed', e.message, 'danger');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-check"></i> Place Order'; }
  }
}

function closeWalletOtpModal() {
  document.getElementById('wallet-otp-modal').classList.remove('active');
}

// FR-44: Wallet OTP confirm → auto-update payment_status to Paid
async function handleWalletOtpConfirm() {
  const enteredOtp = document.getElementById('wallet-otp-input').value.trim();
  const expectedOtp = document.getElementById('wallet-sim-otp').dataset.otp;
  if (enteredOtp !== expectedOtp) {
    showToast('Invalid OTP', 'The OTP you entered is incorrect.', 'danger');
    return;
  }
  if (!_pendingWalletOrderId) return;
  try {
    const order = await api(`/api/orders/${_pendingWalletOrderId}/confirm-payment`, 'POST', {});
    closeWalletOtpModal();
    _pendingWalletOrderId = null;
    _showOrderSuccess(order);
    showToast('Payment Confirmed!', 'Your wallet payment was verified successfully.', 'success');
  } catch(e) {
    showToast('Payment Failed', e.message, 'danger');
  }
}

function _showOrderSuccess(order) {
  document.getElementById('success-order-id').innerText = order.order_id;
  document.getElementById('success-order-total').innerText = `PKR ${order.total_price.toLocaleString()}`;
  document.getElementById('success-modal').classList.add('active');
  showToast('Order Placed!', `${order.order_id} confirmed. Check order history for tracking.`, 'success');
}

function closeSuccessModalAndGoHome() {
  document.getElementById('success-modal').classList.remove('active');
  switchView('landing');
}

async function triggerAIChatbotStatusQuery() {
  document.getElementById('success-modal').classList.remove('active');
  toggleChatbot();
  // Ask the bot about the most recent order — works even without local state
  submitChatMessage('Where is my latest order?');
}

// ==========================================================================
// AUTHENTICATION — wired to /api/auth/*
// ==========================================================================
function openAuthModal() {
  document.getElementById('auth-modal').classList.add('active');
}
function closeAuthModal() {
  document.getElementById('auth-modal').classList.remove('active');
}
function switchAuthTab(tab) {
  document.getElementById('login-form').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
  document.getElementById('auth-tab-login').classList.toggle('active',    tab === 'login');
  document.getElementById('auth-tab-register').classList.toggle('active', tab === 'register');
}

async function handleLogin(event) {
  event.preventDefault();
  const email    = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const btn = event.target.querySelector('button[type="submit"]');
  btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in…';
  try {
    const data = await api('/api/auth/login', 'POST', { email, password });
    if (!data) return;
    state.authToken = data.access_token;
    localStorage.setItem('aura_token', data.access_token);
    const me = await api('/api/auth/me');
    if (me) {
      state.currentUser = me;
      localStorage.setItem('aura_user', JSON.stringify(me));
    }
    updateAuthUI();
    closeAuthModal();
    showToast('Signed in', `Welcome back${me ? ', ' + me.name : ''}!`, 'success');
    if (state.currentUser?.role === 'admin') {
      document.getElementById('nav-admin').style.display = '';
    }
  } catch(e) {
    showToast('Login Failed', e.message, 'danger');
  } finally {
    btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In';
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const name     = document.getElementById('reg-name').value;
  const email    = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const phone    = document.getElementById('reg-phone').value || null;
  const btn = event.target.querySelector('button[type="submit"]');
  btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating…';
  try {
    await api('/api/auth/register', 'POST', { name, email, password, phone });
    showToast('Account Created!', 'You can now sign in.', 'success');
    switchAuthTab('login');
    document.getElementById('login-email').value = email;
  } catch(e) {
    showToast('Registration Failed', e.message, 'danger');
  } finally {
    btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create Account';
  }
}

function _clearAuthState() {
  state.authToken   = null;
  state.currentUser = null;
  localStorage.removeItem('aura_token');
  localStorage.removeItem('aura_user');
  updateAuthUI();
}

function handleLogout() {
  _clearAuthState();
  // Discard all customization changes made during the session
  const base = state.currentCustomization.basePrice || 1200;
  state.currentCustomization = {
    apparelType: state.currentCustomization.apparelType || 'tshirt',
    svgType: state.currentCustomization.svgType || 'tshirt',
    fabricType: 'cotton',
    fabricGrade: 1,
    size: 'M',
    primaryColor: '#1e1e24',
    secondaryColor: '#00f0ff',
    stitchingStyle: 'flatlock',
    logos: [],
    activeLogoIndex: 0,
    printMethod: 'dtg',
    washFinish: 'standard',
    quantity: 1,
    basePrice: base,
    unitPrice: base,
    totalPrice: base
  };
  showToast('Signed out', 'Your customization has been discarded.', 'info');
  switchView('landing');
}

function updateAuthUI() {
  const user = state.currentUser;
  const username  = document.getElementById('header-username');
  const btn       = document.getElementById('auth-btn');
  const adminLink = document.getElementById('nav-admin');
  const profileLink = document.getElementById('nav-profile');
  const mobileAdmin = document.getElementById('mobile-nav-admin');
  const mobileProfile = document.getElementById('mobile-nav-profile');
  if (user) {
    username.innerText = user.name;
    btn.onclick        = handleLogout;
    btn.innerHTML      = '<i class="fa-solid fa-right-from-bracket"></i> <span id="auth-btn-label">Logout</span>';
    if (adminLink)   adminLink.style.display   = user.role === 'admin' ? '' : 'none';
    if (profileLink) profileLink.style.display = '';
    if (mobileAdmin)   mobileAdmin.style.display   = user.role === 'admin' ? '' : 'none';
    if (mobileProfile) mobileProfile.style.display = '';
  } else {
    btn.onclick   = openAuthModal;
    btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> <span id="auth-btn-label">Login</span>';
    username.innerText = 'Guest';
    if (adminLink)   adminLink.style.display   = 'none';
    if (profileLink) profileLink.style.display = 'none';
    if (mobileAdmin)   mobileAdmin.style.display   = 'none';
    if (mobileProfile) mobileProfile.style.display = 'none';
  }
}

// --- Order History View (My Orders) ---
async function loadMyOrders() {
  if (!state.authToken) return;
  try {
    const orders = await api('/api/orders/my-orders');
    renderMyOrders(orders || []);
  } catch(e) {
    showToast('Error', e.message, 'danger');
  }
}

function _getProductImg(productId) {
  const p = _products.find(x => x.id === productId) || INITIAL_PRODUCTS.find(x => x.id === productId);
  return p ? p.img : '';
}

function renderMyOrders(orders) {
  const container = document.getElementById('my-orders-container');
  if (!container) return;
  if (!orders.length) {
    container.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:2rem">No orders yet. Design something!</p>`;
    return;
  }
  container.innerHTML = orders.map(o => {
    const itemPreviews = o.items.map(item => {
      const productImg = _getProductImg(item.product_id);
      const productName = (_products.find(x => x.id === item.product_id) || INITIAL_PRODUCTS.find(x => x.id === item.product_id))?.name || item.product_id.toUpperCase();
      const productThumb = productImg
        ? `<img src="${productImg}" alt="${productName}" style="width:56px;height:56px;object-fit:cover;border-radius:6px;border:1px solid rgba(255,255,255,0.1)">`
        : `<div style="width:56px;height:56px;border-radius:6px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;font-size:1.4rem">👕</div>`;
      const designThumb = item.logo_path
        ? `<img src="${item.logo_path}" alt="Design" title="Uploaded design / AI logo" style="width:40px;height:40px;object-fit:contain;border-radius:4px;border:1px solid rgba(0,240,255,0.3);background:rgba(0,0,0,0.3)">`
        : '';
      return `
        <div style="display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0;border-bottom:1px solid rgba(255,255,255,0.05)">
          ${productThumb}
          ${designThumb}
          <div style="font-size:0.82rem;color:var(--text-secondary)">
            <div style="color:var(--text-primary);font-weight:500">${productName}</div>
            <div>Qty: ${item.quantity} &bull; PKR ${item.unit_price.toLocaleString()} each</div>
            <div style="display:flex;gap:4px;align-items:center;margin-top:2px">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.primary_color};border:1px solid rgba(255,255,255,0.3)"></span>
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.secondary_color};border:1px solid rgba(255,255,255,0.3)"></span>
              <span style="font-size:0.75rem">${item.fabric_type} &bull; ${item.stitching_style}</span>
            </div>
          </div>
        </div>`;
    }).join('');

    return `
    <div class="order-card glass" style="padding:1rem;margin-bottom:1rem;border-radius:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem">
        <strong>${o.order_id}</strong>
        <span class="badge badge-${o.status.toLowerCase().replace(/ /g,'')} ">${o.status}</span>
      </div>
      <div style="margin-top:0.5rem;color:var(--text-secondary);font-size:0.85rem">
        PKR ${o.total_price.toLocaleString()} &mdash; ${new Date(o.created_at).toLocaleDateString()}
      </div>
      <div style="margin-top:0.7rem">${itemPreviews}</div>
      <div style="margin-top:0.6rem;display:flex;gap:0.5rem;flex-wrap:wrap">
        <button class="btn btn-sm btn-outline" onclick="submitChatMessage('Track order ${o.order_id}');toggleChatbot()">
          <i class="fa-solid fa-location-dot"></i> Track
        </button>
        ${o.status === 'Pending' ? `<button class="btn btn-sm" style="background:rgba(255,50,50,0.15);border:1px solid rgba(255,50,50,0.3);color:#ff6b6b" onclick="cancelOrder('${o.order_id}')"><i class="fa-solid fa-ban"></i> Cancel</button>` : ''}
        <button class="btn btn-sm btn-outline" onclick="reorder('${o.order_id}', ${JSON.stringify(o.items).replace(/"/g,'&quot;')})">
          <i class="fa-solid fa-rotate-right"></i> Reorder
        </button>
      </div>
    </div>`;
  }).join('');
}

async function cancelOrder(orderId) {
  if (!confirm(`Cancel order ${orderId}?`)) return;
  try {
    await api(`/api/orders/${orderId}/cancel`, 'PATCH');
    showToast('Order Cancelled', `${orderId} has been cancelled.`, 'info');
    loadMyOrders();
  } catch(e) {
    showToast('Cannot Cancel', e.message, 'danger');
  }
}

function reorder(orderId, items) {
  const parsed = typeof items === 'string' ? JSON.parse(items) : items;
  parsed.forEach(item => {
    state.cart.push({
      apparelType: item.product_id,
      fabricType: item.fabric_type,
      fabricGrade: item.fabric_grade,
      primaryColor: item.primary_color,
      secondaryColor: item.secondary_color,
      stitchingStyle: item.stitching_style,
      printMethod: item.print_method,
      washFinish: item.wash_finish,
      quantity: item.quantity,
      logos: [],
      unitPrice: item.unit_price,
      totalPrice: item.unit_price * item.quantity
    });
  });
  localStorage.setItem('aura_cart', JSON.stringify(state.cart));
  updateCartBadge();
  renderCart();
  toggleCartDrawer();
  showToast('Added to Cart', `Items from ${orderId} added to your bag.`, 'success');
}

// ==========================================================================
/* RAG (RETRIEVAL-AUGMENTED GENERATION) AI CHATBOT ENGINE
   This replicates n8n workflow node intelligence in pure JavaScript. */
// ==========================================================================
function toggleChatbot() {
  document.getElementById('chat-window').classList.toggle('active');
}

function triggerAIChatbot(preFillQuery) {
  toggleChatbot();
  submitChatMessage(preFillQuery);
}

function sendChatMessage() {
  const input = document.getElementById('chat-input-field');
  const query = input.value.trim();
  if (!query) return;
  
  input.value = '';
  submitChatMessage(query);
}

async function submitChatMessage(queryText) {
  renderMessageBubble(queryText, 'user');

  const messagesContainer = document.getElementById('chat-messages-container');
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'chat-message bot';
  typingIndicator.id = 'chat-typing-bubble';
  typingIndicator.innerHTML = `
    <div class="msg-text typing-indicator">
      <span class="typing-label">AURA is thinking</span>
      <span class="typing-dots">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </span>
    </div>`;
  messagesContainer.appendChild(typingIndicator);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  try {
    const data = await api('/api/chat', 'POST', { message: queryText, session_id: state.chatSessionId });
    document.getElementById('chat-typing-bubble')?.remove();
    if (data?.reply) renderMessageBubble(data.reply, 'bot');
  } catch (err) {
    document.getElementById('chat-typing-bubble')?.remove();
    renderMessageBubble("Sorry, I'm having trouble connecting right now. Please try again shortly.", 'bot');
  }
}

function markdownToHtml(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

function renderMessageBubble(text, sender) {
  const container = document.getElementById('chat-messages-container');
  const bubble = document.createElement('div');
  bubble.className = `chat-message ${sender}`;
  bubble.innerHTML = `<div class="msg-text">${markdownToHtml(text)}</div>`;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  _saveChatHistory();
}

/* n8n Retrieval Node Parser
   Runs matches on MySQL tables (products, fabrics, faqs, orders) and returns LLM-prompt-ready context. */
function executeMySQLRetrievalNode(query) {
  const cleanQuery = query.toLowerCase();
  let retrievedContextArray = [];
  let responseReply = '';
  
  // --- SUB-FLOW 1: ORDER TRACKING QUERY ---
  if (cleanQuery.includes('order') || cleanQuery.includes('track') || cleanQuery.includes('ord-')) {
    // Find matching order in customer orders
    let foundOrder = null;
    
    // Check if query contains an ORD-xxxxxx keyword
    const match = cleanQuery.match(/ord-\d{6}/);
    if (match) {
      const oid = match[0].toUpperCase();
      foundOrder = state.orders.find(o => o.orderId === oid);
    } else if (state.orders.length > 0) {
      // Return latest order if user has orders
      foundOrder = state.orders[state.orders.length - 1];
    }
    
    if (foundOrder) {
      retrievedContextArray.push(`MySQL orders table row: ID=${foundOrder.orderId}, Status=${foundOrder.status}, Date=${foundOrder.createdAt}, Total=PKR ${foundOrder.totalPrice}`);
      
      const statusDesc = {
        Pending: 'Your order is confirmed and waiting in queue for the design blueprints to be loaded onto our cutting machines.',
        'In Production': 'Our manufacturing team is actively stitching your apparel. The secondary trim color and stitching accents are being applied.',
        'Quality Check': 'Your garments have been completed and are undergoing a strict sizing check and fabric stress audit.',
        Shipped: 'Shipped! Logistical parcel dispatch completed. Estimated tracking arrival is 2-4 days.',
        Delivered: 'Delivered. Standard logistics courier recorded signature confirmation.'
      };
      
      responseReply = `I successfully accessed our database and located your Order **${foundOrder.orderId}**. 
        <br><br>
        Current Status: <span class="badge badge-${foundOrder.status.toLowerCase().replace(' ', '')}">${foundOrder.status.toUpperCase()}</span>
        <br><br>
        *Detail: ${statusDesc[foundOrder.status]}*
        <br>
        *Estimated Delivery: 7-10 Days from creation.*`;
    } else {
      retrievedContextArray.push('MySQL orders table query returned 0 rows matching customer session user_id.');
      responseReply = `I tried looking up your order history in our database but couldn't find any orders. 
        Please provide a valid Order ID (e.g. **ORD-123456**) so I can query the n8n-MySQL connector for you!`;
    }
    
    return {
      context: retrievedContextArray.join('\n'),
      reply: responseReply
    };
  }
  
  // --- SUB-FLOW 2: FABRIC PERFORMANCE & SEASONS ---
  let fabricMatched = false;
  Object.keys(FABRICS_INFO).forEach(key => {
    const f = FABRICS_INFO[key];
    if (cleanQuery.includes(key) || f.recommend.split(', ').some(rec => cleanQuery.includes(rec))) {
      fabricMatched = true;
      retrievedContextArray.push(`MySQL fabric_options table row: Name=${f.name}, PriceMultiplier=${f.multiplier}x, RecommendFor=${f.recommend}, Specs=${f.desc}`);
      
      responseReply += `**${f.name}** (${f.multiplier}x price multiplier) is registered in our catalog. ${f.desc} It is highly recommended for **${f.recommend}**. <br><br>`;
    }
  });
  
  // --- SUB-FLOW 3: FAQS & CATALOG SEARCH ---
  FAQS_DB.forEach(faq => {
    if (faq.question.split(' ').some(word => cleanQuery.includes(word))) {
      retrievedContextArray.push(`MySQL faqs table row: Keywords=${faq.question}, Match=${faq.answer}`);
      responseReply += `${faq.answer} <br><br>`;
    }
  });
  
  // If we found database context, compose the final answer
  if (retrievedContextArray.length > 0) {
    return {
      context: retrievedContextArray.join('\n'),
      reply: responseReply
    };
  }
  
  // --- SUB-FLOW 4: FALLBACK CHATBOT (Spec bounds handling) ---
  retrievedContextArray.push('MySQL product databases search returned 0 results. Fallback node triggered.');
  return {
    context: 'MySQL query returned empty set.',
    reply: `I ran your query through our n8n retrieval node but did not locate specific product matching cards. 
      <br><br>
      For custom sportswear, I recommend **Dry-Fit Polyester** with **Embroidery** for durable performance. For winter streetwear, **Brushed Fleece** (Grade 4-5) is best. Let me know if you would like me to retrieve specific care or shipping FAQs!`
  };
}

// ==========================================================================
/* ADMIN CONSOLE DASHBOARD VIEW OPERATIONS
   Handles statistics calculations, status updates, and audit logs. */
// ==========================================================================
function switchAdminTab(tabName, elem) {
  if (!state.authToken || state.currentUser?.role !== 'admin') {
    switchView('landing');
    return;
  }
  document.querySelectorAll('.admin-sidebar li').forEach(li => li.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(cont => cont.classList.remove('active'));

  elem.classList.add('active');
  document.getElementById(`admin-tab-${tabName}`).classList.add('active');

  // Lazy-load tab data
  if (tabName === 'products')  renderAdminProductsTable();
  if (tabName === 'orders')  { renderAdminOrdersTable(); loadProductsForManualOrder(); }
  if (tabName === 'users')    renderAdminUsersTable();
  if (tabName === 'inventory') renderAdminInventoryTable();
  if (tabName === 'faqs')     renderAdminFaqsTable();
  if (tabName === 'logs')     renderAdminRAGLogsTable();
}

async function renderAdminDashboard() {
  if (!state.authToken || state.currentUser?.role !== 'admin') return;
  try {
    const stats = await api('/api/analytics');
    if (stats) {
      document.getElementById('admin-revenue').innerText        = `PKR ${stats.total_revenue.toLocaleString()}`;
      document.getElementById('admin-orders-count').innerText   = stats.total_orders;
      document.getElementById('admin-users-count').innerText    = stats.total_users;
      document.getElementById('admin-stock-warnings').innerText = stats.low_stock_count;
      setTimeout(() => renderAnalyticsCharts(stats), 50); // defer until DOM paints
    }
  } catch(e) { /* non-fatal */ }

  await renderAdminOrdersTable();
  await renderAdminInventoryTable();
  await renderAdminRAGLogsTable();
  await renderAdminProductsTable();
  await renderAdminUsersTable();
  await renderAdminFaqsTable();
  loadProductsForManualOrder();
}

async function renderAdminOrdersTable() {
  const container = document.getElementById('admin-orders-list');
  container.innerHTML = `<tr><td colspan="8" style="text-align:center"><i class="fa-solid fa-spinner fa-spin"></i></td></tr>`;
  try {
    const orders = await api('/api/orders') || [];
    container.innerHTML = '';
    if (!orders.length) {
      container.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-muted)">No orders yet.</td></tr>`;
      return;
    }
    orders.forEach(order => {
      const itemsHtml = order.items.map(i => {
        const productImg = _getProductImg(i.product_id);
        const productName = (_products.find(x => x.id === i.product_id) || INITIAL_PRODUCTS.find(x => x.id === i.product_id))?.name || i.product_id.toUpperCase();
        const thumbHtml = productImg
          ? `<img src="${productImg}" alt="${productName}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;vertical-align:middle;margin-right:4px">`
          : `<span style="display:inline-block;width:40px;height:40px;border-radius:4px;background:rgba(255,255,255,0.07);vertical-align:middle;margin-right:4px;text-align:center;line-height:40px">👕</span>`;
        const designHtml = i.logo_path
          ? `<img src="${i.logo_path}" alt="Design" title="Design / AI logo" style="width:32px;height:32px;object-fit:contain;border-radius:3px;border:1px solid rgba(0,240,255,0.4);background:#000;vertical-align:middle;margin-right:4px">`
          : '';
        return `<div style="display:flex;align-items:center;gap:4px;margin-bottom:4px">${thumbHtml}${designHtml}<span style="font-size:0.8rem">${i.quantity}× ${productName}</span></div>`;
      }).join('');
      const statusSlug = order.status.toLowerCase().replace(/ /g, '');
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${order.order_id}</strong><br><small style="color:var(--text-muted)">${new Date(order.created_at).toLocaleDateString()}</small></td>
        <td>User #${order.user_id}</td>
        <td>${itemsHtml}</td>
        <td>PKR ${order.total_price.toLocaleString()}</td>
        <td><span class="badge ${order.payment_status.includes('Paid') ? 'badge-delivered' : 'badge-pending'}">${order.payment_status}</span></td>
        <td><span class="badge badge-${statusSlug}" id="badge-status-${order.order_id}">${order.status}</span></td>
        <td>
          <select class="admin-action-select" onchange="updateOrderStatus('${order.order_id}', this.value)">
            <option value="Pending"        ${order.status==='Pending'?'selected':''}>Pending</option>
            <option value="In Production"  ${order.status==='In Production'?'selected':''}>In Production</option>
            <option value="Quality Check"  ${order.status==='Quality Check'?'selected':''}>Quality Check</option>
            <option value="Shipped"        ${order.status==='Shipped'?'selected':''}>Shipped</option>
            <option value="Delivered"      ${order.status==='Delivered'?'selected':''}>Delivered</option>
            <option value="Cancelled"      ${order.status==='Cancelled'?'selected':''}>Cancelled</option>
          </select>
        </td>
        <td>
          <button class="btn-admin-del" onclick="deleteOrder('${order.order_id}')"><i class="fa-solid fa-trash"></i></button>
        </td>`;
      container.appendChild(row);
    });
  } catch(e) {
    container.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#ff6b6b">${e.message}</td></tr>`;
  }
}

async function updateOrderStatus(orderId, newStatus) {
  try {
    await api(`/api/orders/${orderId}/status`, 'PATCH', { status: newStatus });
    const badge = document.getElementById(`badge-status-${orderId}`);
    if (badge) {
      badge.innerText = newStatus;
      badge.className = `badge badge-${newStatus.toLowerCase().replace(/ /g,'')}`;
    }
    showToast('Status Updated', `Order ${orderId} → ${newStatus}`, 'info');
    renderAdminDashboard();
  } catch(e) {
    showToast('Update Failed', e.message, 'danger');
  }
}

async function deleteOrder(orderId) {
  if (!confirm(`Permanently delete order ${orderId}? This cannot be undone.`)) return;
  try {
    await api(`/api/orders/${orderId}`, 'DELETE');
    showToast('Order Deleted', `${orderId} removed.`, 'info');
    renderAdminOrdersTable();
    renderAdminDashboard();
  } catch(e) { showToast('Error', e.message, 'danger'); }
}

async function renderAdminInventoryTable() {
  const container = document.getElementById('admin-inventory-list');
  container.innerHTML = `<tr><td colspan="6" style="text-align:center"><i class="fa-solid fa-spinner fa-spin"></i></td></tr>`;
  try {
    const items = await api('/api/inventory') || [];
    container.innerHTML = '';
    if (!items.length) {
      container.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted)">No inventory items.</td></tr>`;
      return;
    }
    items.forEach(item => {
      const low = item.qty_available < item.reorder_level;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.item_type}</td>
        <td><strong>${item.item_name}</strong></td>
        <td id="inv-qty-${item.inv_id}">${item.qty_available}</td>
        <td id="inv-reorder-${item.inv_id}">${item.reorder_level}</td>
        <td><span class="badge ${low ? 'badge-danger' : 'badge-delivered'}">${low ? 'Low Stock' : 'Healthy'}</span></td>
        <td style="display:flex;gap:0.4rem;flex-wrap:wrap">
          <button class="btn btn-sm btn-outline" onclick="openInvEditModal(${item.inv_id},'${item.item_name}',${item.qty_available},${item.reorder_level})">
            <i class="fa-solid fa-pen"></i> Edit
          </button>
          <button class="btn-admin-del" onclick="deleteInventoryItem(${item.inv_id})"><i class="fa-solid fa-trash"></i></button>
        </td>`;
      container.appendChild(row);
    });
  } catch(e) {
    container.innerHTML = `<tr><td colspan="6" style="color:#ff6b6b">${e.message}</td></tr>`;
  }
}

// Inline modal for editing inventory stock / reorder level
function openInvEditModal(invId, name, qty, reorder) {
  const html = `
    <div class="modal-overlay active" id="inv-edit-overlay" onclick="if(event.target===this)closeInvEditModal()">
      <div class="modal-content glass" style="max-width:380px;">
        <div class="modal-header">
          <h2 style="font-size:1rem"><i class="fa-solid fa-pen"></i> Edit: ${name}</h2>
          <button class="close-btn" onclick="closeInvEditModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group" style="margin-bottom:1rem">
            <label>Stock Quantity</label>
            <input type="number" id="inv-edit-qty" value="${qty}" min="0" style="width:100%">
          </div>
          <div class="form-group" style="margin-bottom:1.25rem">
            <label>Reorder Level (alert threshold)</label>
            <input type="number" id="inv-edit-reorder" value="${reorder}" min="0" style="width:100%">
          </div>
          <button class="btn btn-primary btn-block" onclick="saveInvEdit(${invId})">
            <i class="fa-solid fa-floppy-disk"></i> Save Changes
          </button>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}
function closeInvEditModal() {
  document.getElementById('inv-edit-overlay')?.remove();
}
async function saveInvEdit(invId) {
  const qty     = parseFloat(document.getElementById('inv-edit-qty').value);
  const reorder = parseFloat(document.getElementById('inv-edit-reorder').value);
  try {
    await api(`/api/inventory/${invId}`, 'PATCH', { qty_available: qty, reorder_level: reorder });
    showToast('Inventory Updated', 'Stock levels saved.', 'success');
    closeInvEditModal();
    renderAdminInventoryTable();
  } catch(e) { showToast('Error', e.message, 'danger'); }
}
async function deleteInventoryItem(invId) {
  if (!confirm('Remove this inventory item permanently?')) return;
  try {
    await api(`/api/inventory/${invId}`, 'DELETE');
    showToast('Item Removed', 'Inventory item deleted.', 'info');
    renderAdminInventoryTable();
  } catch(e) { showToast('Error', e.message, 'danger'); }
}
function toggleAddInventoryForm() {
  const c = document.getElementById('add-inventory-form-container');
  c.style.display = c.style.display === 'none' ? 'block' : 'none';
}
async function handleAddInventory(event) {
  event.preventDefault();
  const btn = event.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    await api('/api/inventory', 'POST', {
      item_type:     document.getElementById('inv-type').value,
      item_name:     document.getElementById('inv-name').value,
      qty_available: parseFloat(document.getElementById('inv-qty').value),
      reorder_level: parseFloat(document.getElementById('inv-reorder').value)
    });
    event.target.reset();
    toggleAddInventoryForm();
    showToast('Item Added', 'New inventory item created.', 'success');
    renderAdminInventoryTable();
  } catch(e) { showToast('Error', e.message, 'danger'); }
  finally { btn.disabled = false; }
}

async function renderAdminRAGLogsTable() {
  const container = document.getElementById('admin-chat-logs-list');
  container.innerHTML = `<tr><td colspan="4" style="text-align:center"><i class="fa-solid fa-spinner fa-spin"></i></td></tr>`;
  try {
    const logs = await api('/api/chat/logs') || [];
    container.innerHTML = '';
    if (!logs.length) {
      container.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No chat interactions yet.</td></tr>`;
      return;
    }
    logs.forEach(log => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="white-space:nowrap">${new Date(log.created_at).toLocaleString()}</td>
        <td style="max-width:180px"><em>"${log.user_message}"</em></td>
        <td><pre style="font-family:monospace;font-size:0.75rem;background:#0f0f15;padding:0.5rem;border:1px solid var(--border-color);white-space:pre-wrap;color:#39ff14;max-height:80px;overflow:auto">${log.retrieved_context || '—'}</pre></td>
        <td style="max-width:240px;font-size:0.8rem">${log.ai_response}</td>`;
      container.appendChild(row);
    });
  } catch(e) {
    container.innerHTML = `<tr><td colspan="4" style="color:#ff6b6b">${e.message}</td></tr>`;
  }
}

let _allAdminProducts = [];

async function renderAdminProductsTable() {
  const container = document.getElementById('admin-products-list');
  if (!container) return;
  container.innerHTML = `<tr><td colspan="9" style="text-align:center"><i class="fa-solid fa-spinner fa-spin"></i></td></tr>`;
  try {
    _allAdminProducts = await api('/api/products/admin/all') || [];
    renderFilteredProducts(_allAdminProducts);
  } catch(e) {
    container.innerHTML = `<tr><td colspan="9" style="color:#ff6b6b">${e.message}</td></tr>`;
  }
}

function renderFilteredProducts(products) {
  const container = document.getElementById('admin-products-list');
  if (!container) return;
  container.innerHTML = '';
  if (products.length === 0) {
    container.innerHTML = `<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:2rem">No products match your filters.</td></tr>`;
  } else {
    products.forEach(p => {
      const discTag = (p.discount_percent || 0) > 0
        ? `<span class="badge badge-inproduction">-${p.discount_percent}%</span>`
        : '<span style="color:var(--text-muted)">—</span>';
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><code>${p.product_id}</code></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.category}</td>
        <td><span class="badge badge-pending">${p.gender || 'Unisex'}</span></td>
        <td>PKR ${p.base_price.toLocaleString()}</td>
        <td>${discTag}</td>
        <td><span class="badge ${p.is_active ? 'badge-delivered' : 'badge-danger'}">${p.is_active ? 'Active' : 'Inactive'}</span></td>
        <td style="display:flex;gap:0.4rem;flex-wrap:wrap">
          <button class="btn btn-sm btn-outline" onclick="openProductEditModal('${p.product_id}','${p.name.replace(/'/g,"\\'")}','${p.category}','${p.gender||"Unisex"}',${p.base_price},${p.discount_percent||0},'${p.description.replace(/'/g,"\\'")}','${p.image_url}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn btn-sm btn-outline" onclick="toggleProductStatus('${p.product_id}')">
            ${p.is_active ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>'}
          </button>
          <button class="btn-admin-del" onclick="deleteProduct('${p.product_id}')"><i class="fa-solid fa-trash"></i></button>
        </td>`;
      container.appendChild(row);
    });
  }

  // Update count badge
  const countEl = document.getElementById('product-filter-count');
  if (countEl) {
    const total = _allAdminProducts.length;
    countEl.textContent = products.length < total
      ? `${products.length} of ${total}`
      : `${total} products`;
  }
}

function filterAdminProducts() {
  const search   = (document.getElementById('product-search')?.value || '').toLowerCase().trim();
  const category = document.getElementById('product-filter-category')?.value || '';
  const gender   = document.getElementById('product-filter-gender')?.value || '';
  const status   = document.getElementById('product-filter-status')?.value || '';

  const isFiltering = search || category || gender || status;
  const clearBtn = document.getElementById('product-filter-clear');
  if (clearBtn) clearBtn.style.display = isFiltering ? '' : 'none';

  const filtered = _allAdminProducts.filter(p => {
    if (search && !p.product_id.toLowerCase().includes(search) && !p.name.toLowerCase().includes(search)) return false;
    if (category && p.category !== category) return false;
    if (gender && (p.gender || 'Unisex') !== gender) return false;
    if (status === 'active' && !p.is_active) return false;
    if (status === 'inactive' && p.is_active) return false;
    return true;
  });

  renderFilteredProducts(filtered);
}

function clearProductFilters() {
  document.getElementById('product-search').value = '';
  document.getElementById('product-filter-category').value = '';
  document.getElementById('product-filter-gender').value = '';
  document.getElementById('product-filter-status').value = '';
  document.getElementById('product-filter-clear').style.display = 'none';
  renderFilteredProducts(_allAdminProducts);
}

function openProductEditModal(id, name, category, gender, price, discount, desc, img) {
  const html = `
    <div class="modal-overlay active" id="product-edit-overlay" onclick="if(event.target===this)closeProductEditModal()">
      <div class="modal-content glass">
        <div class="modal-header">
          <h2 style="font-size:1rem"><i class="fa-solid fa-pen"></i> Edit Product: <code>${id}</code></h2>
          <button class="close-btn" onclick="closeProductEditModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group col-6"><label>Name</label><input id="pe-name" value="${name}" style="width:100%"></div>
            <div class="form-group col-6">
              <label>Category</label>
              <select id="pe-category" class="select-input" style="width:100%">
                <option ${category==='T-Shirt'?'selected':''}>T-Shirt</option>
                <option ${category==='Hoodie'?'selected':''}>Hoodie</option>
                <option ${category==='Jacket'?'selected':''}>Jacket</option>
                <option ${category==='Sports Uniform'?'selected':''}>Sports Uniform</option>
                <option ${category==='Joggers'?'selected':''}>Joggers</option>
                <option ${category==='Other'?'selected':''}>Other</option>
              </select>
            </div>
            <div class="form-group col-6">
              <label>Gender</label>
              <select id="pe-gender" class="select-input" style="width:100%">
                <option ${gender==='Unisex'?'selected':''} value="Unisex">Unisex</option>
                <option ${gender==='Men'?'selected':''} value="Men">Men</option>
                <option ${gender==='Women'?'selected':''} value="Women">Women</option>
                <option ${gender==='Children'?'selected':''} value="Children">Children</option>
              </select>
            </div>
            <div class="form-group col-3"><label>Base Price (PKR)</label><input id="pe-price" type="number" value="${price}" style="width:100%"></div>
            <div class="form-group col-3"><label>Discount %</label><input id="pe-discount" type="number" min="0" max="100" value="${discount}" style="width:100%"></div>
            <div class="form-group col-12"><label>Description</label><textarea id="pe-desc" rows="2" style="width:100%;background:var(--bg-main);border:1px solid var(--border-color);color:#fff;padding:0.6rem;border-radius:6px;resize:vertical">${desc}</textarea></div>
            <div class="form-group col-12"><label>Image URL</label><input id="pe-img" value="${img}" style="width:100%"></div>
          </div>
          <div style="display:flex;gap:0.8rem;margin-top:1rem">
            <button class="btn btn-primary btn-sm" onclick="saveProductEdit('${id}')"><i class="fa-solid fa-floppy-disk"></i> Save Changes</button>
            <button class="btn btn-outline btn-sm" onclick="closeProductEditModal()">Cancel</button>
          </div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}
function closeProductEditModal() { document.getElementById('product-edit-overlay')?.remove(); }
async function saveProductEdit(productId) {
  try {
    await api(`/api/products/${productId}`, 'PATCH', {
      name:             document.getElementById('pe-name').value,
      category:         document.getElementById('pe-category').value,
      gender:           document.getElementById('pe-gender').value,
      base_price:       parseFloat(document.getElementById('pe-price').value),
      discount_percent: parseFloat(document.getElementById('pe-discount').value) || 0,
      description:      document.getElementById('pe-desc').value,
      image_url:        document.getElementById('pe-img').value
    });
    showToast('Product Updated', `${productId} saved.`, 'success');
    closeProductEditModal();
    renderAdminProductsTable();
  } catch(e) { showToast('Error', e.message, 'danger'); }
}

async function toggleProductStatus(productId) {
  try {
    await api(`/api/products/${productId}/toggle`, 'DELETE');
    showToast('Product Updated', `${productId} status toggled.`, 'info');
    renderAdminProductsTable();
  } catch(e) {
    showToast('Error', e.message, 'danger');
  }
}

async function deleteProduct(productId) {
  if (!confirm(`Permanently delete product "${productId}"? This cannot be undone.`)) return;
  try {
    await api(`/api/products/${productId}`, 'DELETE');
    showToast('Product Deleted', `${productId} removed.`, 'info');
    renderAdminProductsTable();
  } catch(e) { showToast('Error', e.message, 'danger'); }
}

async function renderAdminUsersTable() {
  const container = document.getElementById('admin-users-list');
  if (!container) return;
  container.innerHTML = `<tr><td colspan="6" style="text-align:center"><i class="fa-solid fa-spinner fa-spin"></i></td></tr>`;
  try {
    const users = await api('/api/users') || [];
    container.innerHTML = '';
    users.forEach(u => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${u.user_id}</td>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td><span class="badge ${u.role === 'admin' ? 'badge-inproduction' : 'badge-pending'}">${u.role}</span></td>
        <td><span class="badge ${u.is_active ? 'badge-delivered' : 'badge-danger'}">${u.is_active ? 'Active' : 'Suspended'}</span></td>
        <td style="display:flex;gap:0.4rem;flex-wrap:wrap">
          ${u.user_id !== state.currentUser?.user_id ? `
          <button class="btn btn-sm btn-outline" onclick="toggleUserActive(${u.user_id})">
            ${u.is_active ? '<i class="fa-solid fa-user-slash"></i> Suspend' : '<i class="fa-solid fa-user-check"></i> Restore'}
          </button>
          <select class="admin-action-select" style="max-width:100px" onchange="changeUserRole(${u.user_id}, this.value)">
            <option value="customer" ${u.role==='customer'?'selected':''}>Customer</option>
            <option value="admin"    ${u.role==='admin'?'selected':''}>Admin</option>
          </select>
          <button class="btn-admin-del" onclick="deleteUser(${u.user_id})"><i class="fa-solid fa-trash"></i></button>
          ` : '<em style="color:var(--text-muted);font-size:0.8rem">You</em>'}
        </td>`;
      container.appendChild(row);
    });
  } catch(e) {
    container.innerHTML = `<tr><td colspan="6" style="color:#ff6b6b">${e.message}</td></tr>`;
  }
}

async function toggleUserActive(userId) {
  try {
    await api(`/api/users/${userId}/toggle`, 'PATCH');
    showToast('User Updated', 'Account status changed.', 'info');
    renderAdminUsersTable();
  } catch(e) { showToast('Error', e.message, 'danger'); }
}

async function deleteUser(userId) {
  if (!confirm(`Permanently delete user #${userId}? All their data will be removed.`)) return;
  try {
    await api(`/api/users/${userId}`, 'DELETE');
    showToast('User Deleted', `User #${userId} removed.`, 'info');
    renderAdminUsersTable();
  } catch(e) { showToast('Error', e.message, 'danger'); }
}

async function changeUserRole(userId, role) {
  try {
    await api(`/api/users/${userId}/role`, 'PATCH', { role });
    showToast('Role Updated', `User #${userId} is now ${role}.`, 'info');
    renderAdminUsersTable();
  } catch(e) { showToast('Error', e.message, 'danger'); }
}

async function renderAdminFaqsTable() {
  const container = document.getElementById('admin-faqs-list');
  if (!container) return;
  container.innerHTML = `<tr><td colspan="4" style="text-align:center"><i class="fa-solid fa-spinner fa-spin"></i></td></tr>`;
  try {
    const faqs = await api('/api/faqs/admin/all') || [];
    container.innerHTML = '';
    faqs.forEach(f => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${f.faq_id}</td>
        <td>${f.question}</td>
        <td style="max-width:300px;font-size:0.85rem">${f.answer}</td>
        <td style="display:flex;gap:0.4rem;flex-wrap:wrap">
          <button class="btn btn-sm btn-outline" onclick="toggleFaqActive(${f.faq_id},${!f.is_active})">
            ${f.is_active ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>'}
          </button>
          <button class="btn btn-sm" style="background:rgba(255,50,50,0.15);border:1px solid rgba(255,50,50,0.3);color:#ff6b6b" onclick="deleteFaq(${f.faq_id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>`;
      container.appendChild(row);
    });
  } catch(e) {
    container.innerHTML = `<tr><td colspan="4" style="color:#ff6b6b">${e.message}</td></tr>`;
  }
}

async function addFaq() {
  const q = document.getElementById('faq-question')?.value?.trim();
  const a = document.getElementById('faq-answer')?.value?.trim();
  if (!q || !a) { showToast('Validation', 'Question and answer are required.', 'warning'); return; }
  try {
    await api('/api/faqs', 'POST', { question: q, answer: a });
    document.getElementById('faq-question').value = '';
    document.getElementById('faq-answer').value = '';
    showToast('FAQ Added', 'New FAQ is live.', 'success');
    renderAdminFaqsTable();
  } catch(e) { showToast('Error', e.message, 'danger'); }
}

async function toggleFaqActive(faqId, isActive) {
  try {
    await api(`/api/faqs/${faqId}`, 'PATCH', { is_active: isActive });
    renderAdminFaqsTable();
  } catch(e) { showToast('Error', e.message, 'danger'); }
}

async function deleteFaq(faqId) {
  if (!confirm('Delete this FAQ?')) return;
  try {
    await api(`/api/faqs/${faqId}`, 'DELETE');
    showToast('FAQ Deleted', '', 'info');
    renderAdminFaqsTable();
  } catch(e) { showToast('Error', e.message, 'danger'); }
}

// --- Admin: Product Form ---
function toggleAddProductForm() {
  const c = document.getElementById('add-product-form-container');
  c.style.display = c.style.display === 'none' ? 'block' : 'none';
}

async function handleAddProduct(event) {
  event.preventDefault();
  const btn = event.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    await api('/api/products', 'POST', {
      product_id:       document.getElementById('np-id').value,
      name:             document.getElementById('np-name').value,
      category:         document.getElementById('np-category').value,
      gender:           document.getElementById('np-gender').value,
      base_price:       parseFloat(document.getElementById('np-price').value),
      discount_percent: parseFloat(document.getElementById('np-discount').value) || 0,
      description:      document.getElementById('np-desc').value,
      image_url:        document.getElementById('np-img').value || ''
    });
    event.target.reset();
    toggleAddProductForm();
    showToast('Product Added', 'New product is live in catalog.', 'success');
    renderAdminProductsTable();
  } catch(e) { showToast('Error', e.message, 'danger'); }
  finally { btn.disabled = false; }
}

// --- Admin: Manual Order Form ---
function toggleManualOrderForm() {
  const c = document.getElementById('manual-order-form-container');
  c.style.display = c.style.display === 'none' ? 'block' : 'none';
}

async function handleAddManualOrder(event) {
  event.preventDefault();
  const btn = event.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    await api('/api/orders/manual', 'POST', {
      customer_name:  document.getElementById('mo-customer-name').value,
      product_id:     document.getElementById('mo-product-id').value,
      quantity:       parseInt(document.getElementById('mo-quantity').value),
      payment_method: document.getElementById('mo-payment').value,
      notes:          document.getElementById('mo-notes').value || ''
    });
    event.target.reset();
    toggleManualOrderForm();
    showToast('Manual Order Created', '', 'success');
    renderAdminOrdersTable();
    renderAdminDashboard();
  } catch(e) { showToast('Error', e.message, 'danger'); }
  finally { btn.disabled = false; }
}

// --- Cart: Clear All ---
function clearCart() {
  state.cart = [];
  localStorage.setItem('aura_cart', JSON.stringify([]));
  updateCartBadge();
  renderCart();
  showToast('Cart Cleared', 'All items removed.', 'info');
}

// ==========================================================================
// FR-06: FORGOT PASSWORD FLOW
// ==========================================================================
function openForgotPasswordModal() {
  closeAuthModal();
  showForgotStep(1);
  document.getElementById('forgot-password-modal').classList.add('active');
}

function closeForgotPasswordModal() {
  document.getElementById('forgot-password-modal').classList.remove('active');
}

function showForgotStep(step) {
  document.getElementById('fp-step-1').style.display = step === 1 ? 'block' : 'none';
  document.getElementById('fp-step-2').style.display = step === 2 ? 'block' : 'none';
  if (step === 1) {
    const hint = document.getElementById('fp-dev-otp-hint');
    if (hint) { hint.style.display = 'none'; hint.textContent = ''; }
  }
}

async function handleForgotPasswordRequest() {
  const email = document.getElementById('fp-email').value.trim();
  if (!email) { showToast('Email Required', 'Please enter your email address.', 'warning'); return; }
  const btn = document.querySelector('#fp-step-1 button');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…'; }
  try {
    const res = await api('/api/auth/forgot-password', 'POST', { email });
    if (res && res.debug_otp) {
      // Dev mode: show OTP prominently in step-2 so user can copy it
      showToast('Dev Mode OTP', `Your OTP is: ${res.debug_otp}`, 'warning');
      const otpHint = document.getElementById('fp-dev-otp-hint');
      if (otpHint) { otpHint.textContent = `(Dev) OTP: ${res.debug_otp}`; otpHint.style.display = 'block'; }
    } else {
      showToast('OTP Sent', 'If that email is registered, you will receive an OTP shortly.', 'success');
    }
    showForgotStep(2);
  } catch(e) {
    showToast('Error', e.message, 'danger');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send OTP'; }
  }
}

async function handlePasswordReset() {
  const email    = document.getElementById('fp-email').value.trim();
  const otp      = document.getElementById('fp-otp').value.trim();
  const password = document.getElementById('fp-new-password').value;
  if (!otp || !password) { showToast('Missing Fields', 'Enter OTP and new password.', 'warning'); return; }
  try {
    await api('/api/auth/reset-password', 'POST', { email, otp, new_password: password });
    showToast('Password Reset!', 'Your password has been updated. Please log in.', 'success');
    closeForgotPasswordModal();
    openAuthModal();
  } catch(e) {
    showToast('Reset Failed', e.message, 'danger');
  }
}

// ==========================================================================
// MOBILE NAV
// ==========================================================================
function toggleMobileNav() {
  document.getElementById('mobile-nav-overlay').classList.toggle('active');
  document.body.classList.toggle('nav-open');
}
function closeMobileNav() {
  document.getElementById('mobile-nav-overlay').classList.remove('active');
  document.body.classList.remove('nav-open');
}

// ==========================================================================
// SIZE SELECTION
// ==========================================================================
function setSize(size) {
  state.currentCustomization.size = size;
  document.querySelectorAll('.size-tile').forEach(t => t.classList.remove('active'));
  const el = document.getElementById(`tile-size-${size.toLowerCase()}`);
  if (el) el.classList.add('active');
}

// ==========================================================================
// USER PROFILE
// ==========================================================================
async function loadProfile() {
  if (!state.authToken) {
    showToast('Login Required', 'Sign in to view your profile.', 'warning');
    openAuthModal();
    return;
  }
  try {
    const me = await api('/api/auth/me');
    if (!me) return;
    document.getElementById('profile-name').value    = me.name    || '';
    document.getElementById('profile-email').value   = me.email   || '';
    document.getElementById('profile-phone').value   = me.phone   || '';
    document.getElementById('profile-address').value = me.address || '';
  } catch(e) {
    showToast('Error', 'Could not load profile.', 'danger');
  }
}

async function handleUpdateProfile(event) {
  event.preventDefault();
  const btn = event.target.querySelector('button[type="submit"]');
  btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving…';
  try {
    const updated = await api('/api/auth/profile', 'PATCH', {
      name:    document.getElementById('profile-name').value    || null,
      phone:   document.getElementById('profile-phone').value   || null,
      address: document.getElementById('profile-address').value || null
    });
    if (updated) {
      state.currentUser = { ...state.currentUser, ...updated };
      localStorage.setItem('aura_user', JSON.stringify(state.currentUser));
      document.getElementById('header-username').innerText = updated.name || state.currentUser.name;
      showToast('Profile Saved', 'Your details have been updated.', 'success');
    }
  } catch(e) {
    showToast('Save Failed', e.message, 'danger');
  } finally {
    btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Changes';
  }
}

// ==========================================================================
// COUPON / PROMO CODES
// ==========================================================================
const PROMO_CODES = {
  'AURA10':  { discount: 10, label: '10% off your order' },
  'SAVE20':  { discount: 20, label: '20% off your order' },
  'FYP2025': { discount: 15, label: '15% student discount' },
  'FIRST50': { discount: 50, label: '50% off first order' }
};

function applyCoupon() {
  const code = document.getElementById('coupon-code-input').value.trim().toUpperCase();
  const feedback = document.getElementById('coupon-feedback');
  const promo = PROMO_CODES[code];
  if (!promo) {
    feedback.style.display = 'block';
    feedback.style.color = 'var(--red-neon)';
    feedback.textContent = '✗ Invalid promo code.';
    state._couponDiscount = 0;
    state._couponCode = '';
    _recalcCheckoutTotal();
    return;
  }
  state._couponDiscount = promo.discount;
  state._couponCode = code;
  feedback.style.display = 'block';
  feedback.style.color = 'var(--green-neon)';
  feedback.textContent = `✓ "${code}" applied — ${promo.label}`;
  _recalcCheckoutTotal();
  showToast('Promo Applied!', promo.label, 'success');
}

function _recalcCheckoutTotal() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const couponOff = state._couponDiscount || 0;
  const afterCoupon = Math.round(subtotal * (1 - couponOff / 100));
  const grand = Math.round(afterCoupon * 1.05) + (state._checkoutShippingCost || 800);
  document.getElementById('checkout-total-price').innerText = grand.toLocaleString();
}

// ==========================================================================
// EXPORT ORDERS TO CSV
// ==========================================================================
async function exportOrdersCsv() {
  try {
    const orders = await api('/api/orders') || [];
    if (!orders.length) { showToast('No Data', 'No orders to export.', 'warning'); return; }
    const header = ['Order ID', 'Date', 'User ID', 'Status', 'Payment', 'Payment Status', 'Shipping', 'Total PKR'];
    const rows = orders.map(o => [
      o.order_id,
      new Date(o.created_at).toLocaleDateString(),
      o.user_id,
      o.status,
      o.payment_method,
      o.payment_status,
      o.shipping_method || '',
      o.total_price
    ]);
    const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `aura-orders-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Export Done', `${orders.length} orders exported.`, 'success');
  } catch(e) { showToast('Export Failed', e.message, 'danger'); }
}

// ==========================================================================
// MANUAL ORDER: LOAD LIVE PRODUCT LIST
// ==========================================================================
async function loadProductsForManualOrder() {
  const sel = document.getElementById('mo-product-id');
  if (!sel) return;
  try {
    const products = await api('/api/products') || [];
    sel.innerHTML = '<option value="">— Select Product —</option>';
    products.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.product_id;
      opt.textContent = `${p.name} (PKR ${p.base_price.toLocaleString()})`;
      sel.appendChild(opt);
    });
  } catch(e) {
    sel.innerHTML = '<option value="">— Could not load —</option>';
  }
}

// ==========================================================================
// CHAT HISTORY PERSISTENCE (sessionStorage)
// ==========================================================================
function _saveChatHistory() {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;
  const msgs = [];
  container.querySelectorAll('.chat-message').forEach(el => {
    msgs.push({ sender: el.classList.contains('user') ? 'user' : 'bot', html: el.querySelector('.msg-text').innerHTML });
  });
  sessionStorage.setItem('aura_chat', JSON.stringify(msgs));
}

function _loadChatHistory() {
  try {
    const saved = JSON.parse(sessionStorage.getItem('aura_chat') || '[]');
    if (!saved.length) return;
    const container = document.getElementById('chat-messages-container');
    if (!container) return;
    container.innerHTML = '';
    saved.forEach(m => {
      const el = document.createElement('div');
      el.className = `chat-message ${m.sender}`;
      el.innerHTML = `<div class="msg-text">${m.html}</div>`;
      container.appendChild(el);
    });
    container.scrollTop = container.scrollHeight;
  } catch(e) { /* non-fatal */ }
}

// ==========================================================================
// ADMIN: ANALYTICS CHARTS
// ==========================================================================
function renderAnalyticsCharts(stats) {
  renderOrdersChart(stats);
  renderRevenueChart(stats);
}

function renderOrdersChart(stats) {
  const canvas = document.getElementById('chart-orders-status');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const labels = ['Pending', 'In Production', 'Shipped', 'Delivered', 'Cancelled'];
  const values = [
    stats.pending_orders || 0,
    stats.in_production  || 0,
    stats.shipped_orders || 0,
    stats.delivered_orders || 0,
    stats.cancelled_orders || 0
  ];
  const colors = ['#ffaa00','#00bfff','#00f0ff','#39ff14','#ff3366'];
  const W = canvas.offsetWidth || 400;
  const H = 160;
  canvas.width  = W;
  canvas.height = H;
  const max = Math.max(...values, 1);
  const barW = Math.floor((W - 60) / labels.length) - 10;
  ctx.clearRect(0, 0, W, H);
  labels.forEach((label, i) => {
    const barH = Math.round(((values[i] / max) * (H - 40)) || 2);
    const x = 30 + i * (barW + 10);
    const y = H - 30 - barH;
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 4);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(values[i], x + barW / 2, y - 4);
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '9px Inter';
    ctx.fillText(label.split(' ')[0], x + barW / 2, H - 8);
  });
}

function renderRevenueChart(stats) {
  const canvas = document.getElementById('chart-revenue');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 400;
  const H = 160;
  canvas.width  = W;
  canvas.height = H;
  const revenue = stats.total_revenue || 0;
  const orders  = stats.total_orders  || 0;
  const avgOrder = orders > 0 ? Math.round(revenue / orders) : 0;
  const items = [
    { label: 'Total Revenue (K)', value: Math.round(revenue / 1000), color: '#00f0ff', unit: 'K' },
    { label: 'Orders Count',      value: orders,                      color: '#8a2be2', unit: '' },
    { label: 'Avg Order (K)',     value: Math.round(avgOrder / 1000), color: '#39ff14', unit: 'K' }
  ];
  const barW = Math.floor((W - 80) / items.length) - 10;
  const max = Math.max(...items.map(x => x.value), 1);
  ctx.clearRect(0, 0, W, H);
  items.forEach((item, i) => {
    const barH = Math.round(((item.value / max) * (H - 40)) || 2);
    const x = 30 + i * (barW + 20);
    const y = H - 30 - barH;
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 4);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(item.value + item.unit, x + barW / 2, y - 4);
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '9px Inter';
    ctx.fillText(item.label.split(' ')[0], x + barW / 2, H - 8);
  });
}

// ==========================================================================
// FR-14: RELATED PRODUCTS
// ==========================================================================
async function loadRelatedProducts(productId) {
  try {
    const related = await api(`/api/products/${productId}/related`);
    const section = document.getElementById('related-products-section');
    const grid    = document.getElementById('related-products-grid');
    if (!related || related.length === 0) { section.style.display = 'none'; return; }
    grid.innerHTML = '';
    related.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card glass';
      card.innerHTML = `
        <div class="product-card-img" style="background:var(--bg-card);display:flex;align-items:center;justify-content:center;min-height:120px;">
          <i class="fa-solid fa-shirt" style="font-size:2.5rem;color:var(--primary-purple);opacity:0.5;"></i>
        </div>
        <div class="product-card-body">
          <h4>${p.name}</h4>
          <p class="price">From PKR ${(p.base_price || p.basePrice || 0).toLocaleString()}</p>
          <button class="btn btn-sm btn-primary" onclick="loadProductIntoCustomizer('${p.product_id}'); switchView('customizer');">
            <i class="fa-solid fa-pen-nib"></i> Customize
          </button>
        </div>`;
      grid.appendChild(card);
    });
    section.style.display = 'block';
  } catch(e) {
    document.getElementById('related-products-section').style.display = 'none';
  }
}
