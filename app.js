/* ==========================================================================
   AURA-WEAR CORE LOGIC SHEET (SIMULATED FULL-STACK & RAG ENGINE)
   ========================================================================== */

// --- Default Base Data Structures (Mock Database Tables) ---
const INITIAL_PRODUCTS = [
  { id: 'tshirt', name: 'Aura Premium Streetwear Tee', category: 'T-Shirt', basePrice: 1200, desc: 'Heavyweight 240GSM cotton t-shirt with drop shoulders and a boxy fit.', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60' },
  { id: 'hoodie', name: 'Aura Signature Oversized Hoodie', category: 'Hoodie', basePrice: 2500, desc: 'Ultra-soft fleece hoodie featuring double-lined hood and kangaroo pocket.', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60' },
  { id: 'jacket', name: 'Aura Technical Windbreaker', category: 'Jacket', basePrice: 3500, desc: 'Weatherproof ripstop shell jacket with flatlock sealing and mesh insulation.', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60' },
  { id: 'uniform', name: 'Aura V-Neck Athletic Jersey', category: 'Sports Uniform', basePrice: 1800, desc: 'Interlock polyester mesh jersey with anti-bacterial dry fit weave.', img: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=500&auto=format&fit=crop&q=60' }
];

const FABRICS_INFO = {
  cotton: { name: 'Combed Cotton', multiplier: 1.0, desc: 'Highly breathable, soft texture, perfect for summer tees.', recommend: 'summer, casual, everyday, heat, warm weather' },
  polyester: { name: 'Dry-Fit Polyester', multiplier: 0.9, desc: 'Moisture-wicking, stretchable, ideal for sportswear.', recommend: 'gym, running, sports, training, athletics, sweaty' },
  blended: { name: 'Poly-Cotton Blend', multiplier: 1.1, desc: 'Wrinkle-resistant, retains shape, versatile midweight.', recommend: 'spring, autumn, workwear, uniform, all-season' },
  fleece: { name: 'Brushed Fleece', multiplier: 1.3, desc: 'Heavy insulation, extremely cozy and warm for winter.', recommend: 'winter, cold, snow, insulation, warm, cozy' }
};

const FAQS_DB = [
  { question: 'delivery time shipping cost timeline', answer: 'Standard delivery across Pakistan takes 7 to 10 working days. Free shipping is provided for orders exceeding PKR 5,000, otherwise flat rate of PKR 250 applies.' },
  { question: 'return exchange policy size guide', answer: 'We offer a 14-day hassle-free return and exchange policy for items in original condition. Custom apparel with personalized logos can only be returned if there is a manufacturing defect.' },
  { question: 'bulk order pricing discounts wholesale', answer: 'Yes! We support bulk manufacturing. Orders of 10-49 units receive a 10% discount, and 50+ units receive a 20% discount. Chat with our AI or email support for wholesale inquiries.' },
  { question: 'care instructions wash guide laundry', answer: 'For direct-to-garment or screen prints, wash inside out in cold water. Do not tumble dry on high heat. Iron inside-out to protect logos and prints.' }
];

const INITIAL_INVENTORY = [
  { type: 'Fabric', name: 'Combed Cotton (Grade 1-3)', stock: 450, reorder: 100, cost: 'Base Multiplier 1.0x', status: 'Healthy' },
  { type: 'Fabric', name: 'Brushed Fleece (Grade 4-5)', stock: 85, reorder: 120, cost: 'Base Multiplier 1.3x', status: 'Low Stock' },
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

// --- Application Core State ---
let state = {
  activeView: 'landing',
  currentCustomization: {
    apparelType: 'tshirt',
    fabricType: 'cotton',
    fabricGrade: 1,
    primaryColor: '#1e1e24',
    secondaryColor: '#00f0ff',
    stitchingStyle: 'flatlock',
    logoPlacement: 'chest',
    logoPreset: '', // 'cyberpunk', 'streetwear', 'athletic'
    logoDataUrl: '', // Base64 uploaded image
    printMethod: 'dtg',
    washFinish: 'standard',
    quantity: 1,
    basePrice: 1200,
    unitPrice: 1200,
    totalPrice: 1200
  },
  previewMode: 'front', // 'front' or 'back'
  cart: [],
  orders: [],
  chatLogs: [],
  chatMessages: [],
  inventory: []
};

// --- Initialize Application ---
window.onload = function() {
  initLocalStorage();
  loadStateFromStorage();
  renderCatalog();
  renderCustomizerPreview();
  renderCart();
  renderAdminDashboard();
  
  // Set primary customization values
  updatePrice();
  
  // Display initial status toast
  showToast('Welcome!', 'FastAPI & n8n simulation is online and ready.', 'success');
};

function initLocalStorage() {
  if (!localStorage.getItem('aura_initialized')) {
    localStorage.setItem('aura_cart', JSON.stringify([]));
    localStorage.setItem('aura_orders', JSON.stringify([]));
    localStorage.setItem('aura_chat_logs', JSON.stringify([]));
    localStorage.setItem('aura_inventory', JSON.stringify(INITIAL_INVENTORY));
    localStorage.setItem('aura_initialized', 'true');
  }
}

function loadStateFromStorage() {
  state.cart = JSON.parse(localStorage.getItem('aura_cart')) || [];
  state.orders = JSON.parse(localStorage.getItem('aura_orders')) || [];
  state.chatLogs = JSON.parse(localStorage.getItem('aura_chat_logs')) || [];
  state.inventory = JSON.parse(localStorage.getItem('aura_inventory')) || INITIAL_INVENTORY;
  updateCartBadge();
}

function saveStateToStorage() {
  localStorage.setItem('aura_cart', JSON.stringify(state.cart));
  localStorage.setItem('aura_orders', JSON.stringify(state.orders));
  localStorage.setItem('aura_chat_logs', JSON.stringify(state.chatLogs));
  localStorage.setItem('aura_inventory', JSON.stringify(state.inventory));
}

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
  `;
  
  container.appendChild(toast);
  
  // Remove toast after 5s
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.4s ease forwards';
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

// --- View Router Controller ---
function switchView(viewName) {
  // Hide active sections
  document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  
  // Show target section
  const targetSection = document.getElementById(`view-landing`);
  state.activeView = viewName;
  
  let selector = `view-${viewName}`;
  const section = document.getElementById(selector);
  if (section) {
    section.classList.add('active');
  }
  
  // Set nav active
  const navLink = document.getElementById(`nav-${viewName}`);
  if (navLink) {
    navLink.classList.add('active');
  }
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Specific logic on view enters
  if (viewName === 'admin') {
    renderAdminDashboard();
  }
  
  showToast('View Routed', `Entered: ${viewName.toUpperCase()} section`, 'info');
}

// --- Catalog Rendering & Filters ---
function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  grid.innerHTML = '';
  
  INITIAL_PRODUCTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card glass';
    card.innerHTML = `
      <div class="product-visual">
        <span class="product-tag">${p.category}</span>
        <img src="${p.img}" alt="${p.name}">
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-card-footer">
          <span class="price">PKR ${p.basePrice.toLocaleString()}</span>
          <button class="btn btn-sm btn-primary" onclick="loadProductIntoCustomizer('${p.id}')">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Customize
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterCatalog() {
  const query = document.getElementById('catalog-search').value.toLowerCase();
  const category = document.getElementById('catalog-category-filter').value;
  
  const cards = document.querySelectorAll('#catalog-grid .product-card');
  cards.forEach((card, index) => {
    const product = INITIAL_PRODUCTS[index];
    const matchesQuery = product.name.toLowerCase().includes(query) || product.desc.toLowerCase().includes(query);
    const matchesCat = category === 'all' || product.category === category;
    
    if (matchesQuery && matchesCat) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function loadProductIntoCustomizer(productId) {
  const p = INITIAL_PRODUCTS.find(item => item.id === productId);
  if (p) {
    state.currentCustomization.apparelType = p.id;
    state.currentCustomization.basePrice = p.basePrice;
    
    // Update labels
    document.getElementById('selected-product-title').innerText = p.name;
    
    // Highlight correct tile in apparel types
    document.querySelectorAll('#tab-apparel .tile-card').forEach(t => t.classList.remove('active'));
    const activeTile = document.getElementById(`tile-type-${p.id}`);
    if (activeTile) activeTile.classList.add('active');
    
    // Recalculate, render, & route
    updatePrice();
    renderCustomizerPreview();
    switchView('customizer');
  }
}

// --- SVG Preview Construction & Rendering ---
function renderCustomizerPreview() {
  const container = document.getElementById('apparel-canvas-container');
  const type = state.currentCustomization.apparelType;
  const primary = state.currentCustomization.primaryColor;
  const secondary = state.currentCustomization.secondaryColor;
  const view = state.previewMode;
  
  // 1. Build logo markup depending on placement/presets
  let logoMarkup = '';
  const placement = state.currentCustomization.logoPlacement;
  
  // Decide coordinates and sizing for logo positioning based on apparel type & placement
  let coords = { x: 155, y: 135, w: 40, h: 40 };
  let shouldRenderLogo = false;
  
  if (view === 'front') {
    if (placement === 'chest') {
      shouldRenderLogo = true;
      coords = (type === 'hoodie') ? { x: 150, y: 218, w: 42, h: 42 } :
               (type === 'jacket') ? { x: 100, y: 248, w: 30, h: 30 } :
               (type === 'uniform') ? { x: 152, y: 195, w: 40, h: 40 } :
               { x: 155, y: 165, w: 40, h: 40 };
    } else if (placement === 'left_sleeve') {
      shouldRenderLogo = true;
      coords = (type === 'jacket') ? { x: 24, y: 218, w: 20, h: 20 } :
               (type === 'hoodie') ? { x: 10, y: 228, w: 20, h: 20 } :
               { x: 48, y: 160, w: 22, h: 22 };
    } else if (placement === 'right_sleeve') {
      shouldRenderLogo = true;
      coords = (type === 'jacket') ? { x: 316, y: 218, w: 20, h: 20 } :
               (type === 'hoodie') ? { x: 320, y: 228, w: 20, h: 20 } :
               { x: 280, y: 160, w: 22, h: 22 };
    }
  } else if (view === 'back') {
    if (placement === 'back') {
      shouldRenderLogo = true;
      coords = (type === 'jacket') ? { x: 128, y: 240, w: 104, h: 104 } :
               (type === 'hoodie') ? { x: 120, y: 255, w: 95, h: 95 } :
               { x: 135, y: 165, w: 80, h: 80 };
    }
  }
  
  if (shouldRenderLogo) {
    const preset = state.currentCustomization.logoPreset;
    const upload = state.currentCustomization.logoDataUrl;
    
    if (preset && LOGO_PRESETS[preset]) {
      // Injects raw SVG preset code styled with the secondary color
      logoMarkup = `
        <g transform="translate(${coords.x}, ${coords.y}) scale(${coords.w / 50})" color="${secondary}">
          ${LOGO_PRESETS[preset]}
        </g>
      `;
    } else if (upload) {
      // Injects Base64 image
      logoMarkup = `
        <image href="${upload}" x="${coords.x}" y="${coords.y}" width="${coords.w}" height="${coords.h}" />
      `;
    } else {
      // Fallback tiny label
      logoMarkup = `
        <text x="${coords.x + coords.w/2}" y="${coords.y + coords.h/2}" font-size="8" text-anchor="middle" fill="${secondary}" font-family="sans-serif">LOGO</text>
      `;
    }
  }
  
  // 2. Fetch correct SVG function
  const svgTemplate = APPAREL_SVGS[type][view];
  container.innerHTML = svgTemplate(primary, secondary, logoMarkup);
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
  
  // Set Active
  event.target.classList.add('active');
  document.getElementById(`tab-${tabId}`).classList.add('active');
}

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
}

function setFabricType(fabric) {
  state.currentCustomization.fabricType = fabric;
  document.querySelectorAll('#tab-fabric .tile-card').forEach(t => t.classList.remove('active'));
  document.getElementById(`tile-fabric-${fabric}`).classList.add('active');
  
  updatePrice();
}

function updateFabricGrade(grade) {
  state.currentCustomization.fabricGrade = parseInt(grade);
  
  const textMapping = [
    'Grade 1 (Standard Core)',
    'Grade 2 (Premium Soft)',
    'Grade 3 (Double Weave +15%)',
    'Grade 4 (Heavyweight Luxury +30%)',
    'Grade 5 (Supreme Pro Fit +45%)'
  ];
  document.getElementById('grade-val-display').innerText = textMapping[grade - 1];
  
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
}

function setStitchStyle(style) {
  state.currentCustomization.stitchingStyle = style;
  document.querySelectorAll('#tab-design .text-only-grid .tile-card').forEach(t => t.classList.remove('active'));
  document.getElementById(`tile-stitch-${style}`).classList.add('active');
  
  updatePrice();
}

function setLogoPlacement(placement) {
  state.currentCustomization.logoPlacement = placement;
  document.querySelectorAll('#tab-logo .tile-grid .tile-card').forEach(t => t.classList.remove('active'));
  document.getElementById(`tile-logo-${placement}`).classList.add('active');
  
  // Automatically switch preview view to match logo placement (Front/Back)
  if (placement === 'back') {
    togglePreviewMode('back');
  } else {
    togglePreviewMode('front');
  }
  
  renderCustomizerPreview();
}

function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (file.size > 5 * 1024 * 1024) {
    showToast('Upload Rejected', 'Logo file size exceeds 5MB limit.', 'danger');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    state.currentCustomization.logoDataUrl = e.target.result;
    state.currentCustomization.logoPreset = ''; // reset presets
    
    // Update thumbnail in UI
    const thumb = document.getElementById('logo-thumbnail-preview');
    thumb.innerHTML = `<img src="${e.target.result}" alt="Logo thumbnail">`;
    
    showToast('Upload Successful', `Attached: ${file.name}`, 'success');
    renderCustomizerPreview();
  };
  reader.readAsDataURL(file);
}

function clearUploadedLogo() {
  state.currentCustomization.logoDataUrl = '';
  state.currentCustomization.logoPreset = '';
  
  const thumb = document.getElementById('logo-thumbnail-preview');
  thumb.innerHTML = `<i class="fa-solid fa-image"></i>`;
  
  showToast('Logo Cleared', 'All personalized graphics removed.', 'info');
  renderCustomizerPreview();
}

function usePresetLogo(presetName) {
  state.currentCustomization.logoPreset = presetName;
  state.currentCustomization.logoDataUrl = '';
  
  // Set visual preview
  const thumb = document.getElementById('logo-thumbnail-preview');
  let iconHtml = presetName === 'cyberpunk' ? '<i class="fa-solid fa-burst"></i>' :
                 presetName === 'streetwear' ? '<i class="fa-solid fa-shield-halved"></i>' :
                 '<i class="fa-solid fa-bolt-lightning"></i>';
                 
  thumb.innerHTML = `<div style="color: var(--teal-neon); font-size: 1.4rem;">${iconHtml}</div>`;
  
  showToast('Preset Selected', `Applied AURA ${presetName.toUpperCase()} vector graphics`, 'success');
  renderCustomizerPreview();
}

function setPrintMethod(method) {
  state.currentCustomization.printMethod = method;
  document.querySelectorAll('#tab-logo .tile-grid .tile-card').forEach(t => t.classList.remove('active'));
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
  saveStateToStorage();
  renderCart();
  updateCartBadge();
  toggleCartDrawer();
  
  showToast('Item Added', 'Your customized clothing was added to bag.', 'success');
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
    // Generate inline SVG thumb scaled down
    let logoMini = '';
    if (item.logoPreset) {
      logoMini = `<g transform="translate(15, 15) scale(0.4)" color="${item.secondaryColor}">${LOGO_PRESETS[item.logoPreset]}</g>`;
    }
    const svgThumb = APPAREL_SVGS[item.apparelType].front(item.primaryColor, item.secondaryColor, logoMini);
    
    const cartCard = document.createElement('div');
    cartCard.className = 'cart-item';
    cartCard.innerHTML = `
      <div class="cart-item-preview">
        ${svgThumb}
      </div>
      <div class="cart-item-details">
        <h4>${item.apparelType.toUpperCase()} - Design #${100 + index}</h4>
        <div class="cart-item-meta">
          <span>Material: ${FABRICS_INFO[item.fabricType].name} (Grade ${item.fabricGrade})</span>
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
  saveStateToStorage();
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
  
  // Calculate Grand Total for display
  let subtotal = state.cart.reduce((sum, item) => sum + item.totalPrice, 0);
  let grand = Math.round(subtotal * 1.05);
  
  document.getElementById('checkout-total-price').innerText = grand.toLocaleString();
  document.getElementById('checkout-modal').classList.add('active');
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

// --- Placing Order & localStorage Database Insert ---
function handlePlaceOrder(event) {
  event.preventDefault();
  
  // Compile checkout data
  const name = document.getElementById('c-name').value;
  const phone = document.getElementById('c-phone').value;
  const address = document.getElementById('c-address').value;
  const payMethod = document.querySelector('input[name="payment-method"]:checked').value;
  
  const subtotal = state.cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const total = Math.round(subtotal * 1.05);
  
  // Generate random order ID
  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  
  // Construct New Order Record
  const newOrder = {
    orderId: orderId,
    customer: { name, phone, address },
    items: JSON.parse(JSON.stringify(state.cart)),
    paymentMethod: payMethod,
    paymentStatus: payMethod === 'COD' ? 'Pending (COD)' : 'Paid',
    totalPrice: total,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Push to local DB
  state.orders.push(newOrder);
  
  // Decrement matching material inventory (Simulate manufacturing resource depletion)
  newOrder.items.forEach(item => {
    // Deduct fabric stock
    const matchingFabric = state.inventory.find(i => i.type === 'Fabric' && i.name.toLowerCase().includes(item.fabricType));
    if (matchingFabric) {
      matchingFabric.stock = Math.max(0, matchingFabric.stock - item.quantity * 2); // 2 meters/meters square per garment
      if (matchingFabric.stock < matchingFabric.reorder) {
        matchingFabric.status = 'Low Stock';
      }
    }
    // Deduct inks/dyes
    const matchingInk = state.inventory.find(i => i.name.toLowerCase().includes(item.printMethod) || i.type === 'Print Ink');
    if (matchingInk) {
      matchingInk.stock = Math.max(0, matchingInk.stock - Math.round(item.quantity * 0.1));
      if (matchingInk.stock < matchingInk.reorder) {
        matchingInk.status = 'Low Stock';
      }
    }
  });
  
  // Clear cart and update State
  state.cart = [];
  saveStateToStorage();
  updateCartBadge();
  
  // Close Checkout
  closeCheckoutModal();
  
  // Display Success receipt Modal
  document.getElementById('success-order-id').innerText = orderId;
  document.getElementById('success-order-total').innerText = `PKR ${total.toLocaleString()}`;
  document.getElementById('success-modal').classList.add('active');
  
  // Trigger order confirmation notification
  showToast('Order Placed', `Order ${orderId} was recorded in MySQL tables. Email dispatched.`, 'success');
}

function closeSuccessModalAndGoHome() {
  document.getElementById('success-modal').classList.remove('active');
  switchView('landing');
}

function triggerAIChatbotStatusQuery() {
  document.getElementById('success-modal').classList.remove('active');
  const latestOrder = state.orders[state.orders.length - 1];
  
  if (latestOrder) {
    toggleChatbot();
    submitChatMessage(`Where is my order ${latestOrder.orderId}?`);
  }
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

function submitChatMessage(queryText) {
  // 1. Render User Message Bubble
  renderMessageBubble(queryText, 'user');
  
  // 2. Render Typing indicator bubble
  const messagesContainer = document.getElementById('chat-messages-container');
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'typing-indicator';
  typingIndicator.id = 'chat-typing-bubble';
  typingIndicator.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  messagesContainer.appendChild(typingIndicator);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // 3. Process RAG retrieval (n8n node simulation)
  setTimeout(() => {
    // Remove typing bubble
    const bubble = document.getElementById('chat-typing-bubble');
    if (bubble) bubble.remove();
    
    // Execute search matching mock DB
    const ragResults = executeMySQLRetrievalNode(queryText);
    
    // Save query to RAG auditing logs (so admin can review prompt construction)
    const logRecord = {
      timestamp: new Date().toLocaleTimeString(),
      query: queryText,
      context: ragResults.context,
      response: ragResults.reply
    };
    state.chatLogs.unshift(logRecord);
    saveStateToStorage();
    
    // Render AI Reply bubble
    renderMessageBubble(ragResults.reply, 'bot');
  }, 1200);
}

function renderMessageBubble(text, sender) {
  const container = document.getElementById('chat-messages-container');
  const bubble = document.createElement('div');
  bubble.className = `chat-message ${sender}`;
  bubble.innerHTML = `<div class="msg-text">${text}</div>`;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
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
  document.querySelectorAll('.admin-sidebar li').forEach(li => li.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(cont => cont.classList.remove('active'));
  
  elem.classList.add('active');
  document.getElementById(`admin-tab-${tabName}`).classList.add('active');
}

function renderAdminDashboard() {
  // 1. Calculate statistics
  let totalRevenue = state.orders.reduce((sum, o) => sum + o.totalPrice, 0);
  let totalOrders = state.orders.length;
  let lowStockCount = state.inventory.filter(i => i.status === 'Low Stock').length;
  
  document.getElementById('admin-revenue').innerText = `PKR ${totalRevenue.toLocaleString()}`;
  document.getElementById('admin-orders-count').innerText = totalOrders;
  document.getElementById('admin-stock-warnings').innerText = lowStockCount;
  
  // 2. Render Orders Table
  renderAdminOrdersTable();
  
  // 3. Render Inventory Table
  renderAdminInventoryTable();
  
  // 4. Render RAG Chat logs
  renderAdminRAGLogsTable();
}

function renderAdminOrdersTable() {
  const container = document.getElementById('admin-orders-list');
  container.innerHTML = '';
  
  if (state.orders.length === 0) {
    container.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--text-muted);">No orders recorded in local DB. Checkout customized apparel to generate rows.</td></tr>`;
    return;
  }
  
  state.orders.forEach(order => {
    // Generate text overview of items
    const itemsText = order.items.map(i => `${i.quantity}x ${i.apparelType.toUpperCase()} (${FABRICS_INFO[i.fabricType].name})`).join('<br>');
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${order.orderId}</strong></td>
      <td>
        <div>${order.customer.name}</div>
        <small style="color:var(--text-secondary);">${order.customer.phone}</small>
      </td>
      <td>${itemsText}</td>
      <td>PKR ${order.totalPrice.toLocaleString()}</td>
      <td><span class="badge ${order.paymentStatus.includes('Paid') ? 'badge-delivered' : 'badge-pending'}">${order.paymentStatus}</span></td>
      <td><span class="badge badge-${order.status.toLowerCase().replace(' ', '')}" id="badge-status-${order.orderId}">${order.status}</span></td>
      <td>
        <select class="admin-action-select" onchange="updateOrderStatus('${order.orderId}', this.value)">
          <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="In Production" ${order.status === 'In Production' ? 'selected' : ''}>In Production</option>
          <option value="Quality Check" ${order.status === 'Quality Check' ? 'selected' : ''}>Quality Check</option>
          <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
        </select>
      </td>
    `;
    container.appendChild(row);
  });
}

function updateOrderStatus(orderId, newStatus) {
  const order = state.orders.find(o => o.orderId === orderId);
  if (order) {
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    saveStateToStorage();
    
    // Live update UI status badge
    const badge = document.getElementById(`badge-status-${orderId}`);
    if (badge) {
      badge.innerText = newStatus;
      badge.className = `badge badge-${newStatus.toLowerCase().replace(' ', '')}`;
    }
    
    // Trigger simulated customer email/toast notification
    showToast('Status Updated', `Order ${orderId} shifted to: ${newStatus.toUpperCase()}. Notification email sent to client.`, 'info');
    
    // Refresh stats
    renderAdminDashboard();
  }
}

function renderAdminInventoryTable() {
  const container = document.getElementById('admin-inventory-list');
  container.innerHTML = '';
  
  state.inventory.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.type}</td>
      <td><strong>${item.name}</strong></td>
      <td>${item.stock} units</td>
      <td>Threshold: ${item.reorder}</td>
      <td>${item.cost}</td>
      <td><span class="badge ${item.status === 'Healthy' ? 'badge-delivered' : 'badge-danger'}">${item.status}</span></td>
    `;
    container.appendChild(row);
  });
}

function renderAdminRAGLogsTable() {
  const container = document.getElementById('admin-chat-logs-list');
  container.innerHTML = '';
  
  if (state.chatLogs.length === 0) {
    container.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">No interactions recorded. Chat with AURA AI to populate RAG logs.</td></tr>`;
    return;
  }
  
  state.chatLogs.forEach(log => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${log.timestamp}</td>
      <td style="max-width:180px;"><em>"${log.query}"</em></td>
      <td><pre style="font-family: monospace; font-size:0.75rem; background: #0f0f15; padding: 0.5rem; border: 1px solid var(--border-color); white-space: pre-wrap; color:#39ff14;">${log.context}</pre></td>
      <td style="max-width:240px; font-size:0.8rem;">${log.response}</td>
    `;
    container.appendChild(row);
  });
}
