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
      <svg viewBox="0 0 350 350" xmlns="http://www.w3.org/2000/svg">
        <!-- Shadow Under -->
        <path d="M 70,120 L 110,80 L 240,80 L 280,120 L 250,150 L 235,135 L 235,320 L 115,320 L 115,135 L 100,150 Z" fill="rgba(0,0,0,0.15)"/>
        <!-- Main Body (Primary Color) -->
        <path id="svg-primary" d="M 115,110 L 235,110 L 235,320 L 115,320 Z" fill="${primary}"/>
        <!-- Sleeves (Primary Color) -->
        <path id="svg-left-sleeve" d="M 115,110 L 70,125 L 90,165 L 115,140 Z" fill="${primary}"/>
        <path id="svg-right-sleeve" d="M 235,110 L 280,125 L 260,165 L 235,140 Z" fill="${primary}"/>
        <!-- Sleeve Trim / Cuffs (Secondary Color) -->
        <path d="M 70,125 L 73,121 L 93,161 L 90,165 Z" fill="${secondary}"/>
        <path d="M 280,125 L 277,121 L 257,161 L 260,165 Z" fill="${secondary}"/>
        <!-- Shoulder Seams -->
        <path d="M 115,110 L 145,85 L 205,85 L 235,110 Z" fill="${primary}"/>
        <!-- Collar (Secondary Color) -->
        <path d="M 145,85 Q 175,108 205,85 Q 205,75 145,75 Z" fill="${secondary}"/>
        <!-- Neck opening shadow -->
        <path d="M 145,85 Q 175,108 205,85 Z" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="4"/>
        <!-- Shadows & Wrinkles Layer -->
        <path d="M 115,120 Q 135,135 115,150" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
        <path d="M 235,120 Q 215,135 235,150" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
        <path d="M 120,300 Q 175,310 230,300" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="3"/>
        <!-- Stitching Lines (Fine dotted lines representing stitching style selection) -->
        <path d="M 118,316 L 232,316" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-dasharray="2,2"/>
        <!-- Logo Area -->
        <g id="svg-logo-container">
          ${logoMarkup}
        </g>
      </svg>
    `,
    back: (primary, secondary, logoMarkup) => `
      <svg viewBox="0 0 350 350" xmlns="http://www.w3.org/2000/svg">
        <!-- Main Body -->
        <path d="M 115,110 L 235,110 L 235,320 L 115,320 Z" fill="${primary}"/>
        <path d="M 115,110 L 70,125 L 90,165 L 115,140 Z" fill="${primary}"/>
        <path d="M 235,110 L 280,125 L 260,165 L 235,140 Z" fill="${primary}"/>
        <!-- Cuffs -->
        <path d="M 70,125 L 73,121 L 93,161 L 90,165 Z" fill="${secondary}"/>
        <path d="M 280,125 L 277,121 L 257,161 L 260,165 Z" fill="${secondary}"/>
        <!-- Shoulders & Back Neck -->
        <path d="M 115,110 L 145,85 L 205,85 L 235,110 Z" fill="${primary}"/>
        <path d="M 145,85 Q 175,90 205,85 L 205,75 Q 175,80 145,75 Z" fill="${secondary}"/>
        <!-- Stitching Lines -->
        <path d="M 118,316 L 232,316" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-dasharray="2,2"/>
        <!-- Logo Area -->
        <g id="svg-logo-container">
          ${logoMarkup}
        </g>
      </svg>
    `
  },
  hoodie: {
    front: (primary, secondary, logoMarkup) => `
      <svg viewBox="0 0 350 350" xmlns="http://www.w3.org/2000/svg">
        <!-- Shadow -->
        <path d="M 60,140 L 110,80 L 240,80 L 290,140 L 245,320 L 105,320 Z" fill="rgba(0,0,0,0.15)"/>
        <!-- Main Body -->
        <path d="M 110,110 L 240,110 L 240,310 L 110,310 Z" fill="${primary}"/>
        <!-- Sleeves -->
        <path d="M 110,110 L 60,140 L 80,260 L 110,230 Z" fill="${primary}"/>
        <path d="M 240,110 L 290,140 L 270,260 L 240,230 Z" fill="${primary}"/>
        <!-- Kangaroo Pocket (Secondary Accent) -->
        <path d="M 130,240 L 220,240 L 235,295 L 115,295 Z" fill="${secondary}" opacity="0.95"/>
        <path d="M 130,240 L 115,295 M 220,240 L 235,295" stroke="rgba(0,0,0,0.2)" stroke-width="3"/>
        <!-- Ribbed Hem & Cuffs (Secondary Accent) -->
        <path d="M 110,310 L 240,310 L 240,325 L 110,325 Z" fill="${secondary}"/>
        <path d="M 80,260 L 70,270 L 85,275 L 90,265 Z" fill="${secondary}" transform="rotate(-15, 80, 260)"/>
        <path d="M 270,260 L 280,270 L 265,275 L 260,265 Z" fill="${secondary}" transform="rotate(15, 270, 260)"/>
        <!-- Hood Overlay (Primary) -->
        <path d="M 120,95 Q 175,30 230,95 Q 210,115 175,110 Q 140,115 120,95 Z" fill="${primary}"/>
        <!-- Hood Inner (Secondary) -->
        <path d="M 140,95 Q 175,60 210,95 Q 190,105 175,103 Q 160,105 140,95 Z" fill="${secondary}"/>
        <!-- Drawstrings -->
        <path d="M 160,105 Q 155,140 150,150" fill="none" stroke="#fff" stroke-width="2.5"/>
        <path d="M 190,105 Q 195,140 200,155" fill="none" stroke="#fff" stroke-width="2.5"/>
        <!-- Shadows/Stitching -->
        <path d="M 110,310 L 240,310" stroke="rgba(0,0,0,0.2)" stroke-width="2"/>
        <g id="svg-logo-container">
          ${logoMarkup}
        </g>
      </svg>
    `,
    back: (primary, secondary, logoMarkup) => `
      <svg viewBox="0 0 350 350" xmlns="http://www.w3.org/2000/svg">
        <!-- Main Body -->
        <path d="M 110,110 L 240,110 L 240,310 L 110,310 Z" fill="${primary}"/>
        <!-- Sleeves -->
        <path d="M 110,110 L 60,140 L 80,260 L 110,230 Z" fill="${primary}"/>
        <path d="M 240,110 L 290,140 L 270,260 L 240,230 Z" fill="${primary}"/>
        <!-- Hem & Cuffs -->
        <path d="M 110,310 L 240,310 L 240,325 L 110,325 Z" fill="${secondary}"/>
        <!-- Hood down on back -->
        <path d="M 115,100 Q 175,130 235,100 Q 175,65 115,100 Z" fill="${primary}" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
        <g id="svg-logo-container">
          ${logoMarkup}
        </g>
      </svg>
    `
  },
  jacket: {
    front: (primary, secondary, logoMarkup) => `
      <svg viewBox="0 0 350 350" xmlns="http://www.w3.org/2000/svg">
        <!-- Main Shell Body -->
        <path d="M 110,100 L 240,100 L 240,320 L 110,320 Z" fill="${primary}"/>
        <!-- Contrast Shoulder Panels (Secondary Color) -->
        <path d="M 110,100 L 140,75 L 210,75 L 240,100 L 200,130 L 150,130 Z" fill="${secondary}"/>
        <!-- Sleeves -->
        <path d="M 110,110 L 55,135 L 75,270 L 110,250 Z" fill="${primary}"/>
        <path d="M 240,110 L 295,135 L 275,270 L 240,250 Z" fill="${primary}"/>
        <!-- Sleeve cuffs (Secondary) -->
        <path d="M 55,135 L 58,131 L 78,266 L 75,270 Z" fill="${secondary}"/>
        <path d="M 295,135 L 292,131 L 272,266 L 275,270 Z" fill="${secondary}"/>
        <!-- Collar Rib (Secondary) -->
        <path d="M 140,75 L 210,75 L 220,55 L 130,55 Z" fill="${secondary}"/>
        <!-- Zipper line down center -->
        <line x1="175" y1="55" x2="175" y2="320" stroke="#555" stroke-width="4"/>
        <circle cx="175" cy="90" r="5" fill="#aaa"/>
        <!-- Side Pockets -->
        <path d="M 125,260 L 150,285" stroke="rgba(0,0,0,0.3)" stroke-width="4" stroke-linecap="round"/>
        <path d="M 225,260 L 200,285" stroke="rgba(0,0,0,0.3)" stroke-width="4" stroke-linecap="round"/>
        <!-- Highlights -->
        <line x1="113" y1="105" x2="113" y2="315" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
        <g id="svg-logo-container">
          ${logoMarkup}
        </g>
      </svg>
    `,
    back: (primary, secondary, logoMarkup) => `
      <svg viewBox="0 0 350 350" xmlns="http://www.w3.org/2000/svg">
        <!-- Main Shell Body -->
        <path d="M 110,100 L 240,100 L 240,320 L 110,320 Z" fill="${primary}"/>
        <path d="M 110,100 L 140,75 L 210,75 L 240,100 Z" fill="${secondary}"/>
        <!-- Sleeves -->
        <path d="M 110,110 L 55,135 L 75,270 L 110,250 Z" fill="${primary}"/>
        <path d="M 240,110 L 295,135 L 275,270 L 240,250 Z" fill="${primary}"/>
        <!-- Collar -->
        <path d="M 140,75 L 210,75 L 215,60 L 135,60 Z" fill="${secondary}"/>
        <g id="svg-logo-container">
          ${logoMarkup}
        </g>
      </svg>
    `
  },
  uniform: {
    front: (primary, secondary, logoMarkup) => `
      <svg viewBox="0 0 350 350" xmlns="http://www.w3.org/2000/svg">
        <!-- Main Body -->
        <path d="M 115,100 L 235,100 L 235,320 L 115,320 Z" fill="${primary}"/>
        <!-- Raglan Contrast Sleeves & Shoulders (Secondary) -->
        <path d="M 115,100 L 70,120 L 90,160 L 115,135 Z" fill="${secondary}"/>
        <path d="M 235,100 L 280,120 L 260,160 L 235,135 Z" fill="${secondary}"/>
        <path d="M 115,100 L 145,75 L 175,100 L 205,75 L 235,100 Z" fill="${secondary}"/>
        <!-- Sports V-Neck Ribbing (White/Contrast) -->
        <path d="M 145,75 Q 175,105 205,75 Q 195,75 175,90 Q 155,75 145,75 Z" fill="#ffffff"/>
        <!-- Sport Side Accent Stripes (Secondary) -->
        <path d="M 115,180 L 125,180 L 125,320 L 115,320 Z" fill="${secondary}"/>
        <path d="M 235,180 L 225,180 L 225,320 L 235,320 Z" fill="${secondary}"/>
        <!-- Performance mesh shadows -->
        <path d="M 115,315 L 235,315" stroke="rgba(0,0,0,0.2)" stroke-width="3"/>
        <path d="M 115,100 L 235,100" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" stroke-dasharray="3,3"/>
        <g id="svg-logo-container">
          ${logoMarkup}
        </g>
      </svg>
    `,
    back: (primary, secondary, logoMarkup) => `
      <svg viewBox="0 0 350 350" xmlns="http://www.w3.org/2000/svg">
        <!-- Main Body -->
        <path d="M 115,100 L 235,100 L 235,320 L 115,320 Z" fill="${primary}"/>
        <!-- Sleeves -->
        <path d="M 115,100 L 70,120 L 90,160 L 115,135 Z" fill="${secondary}"/>
        <path d="M 235,100 L 280,120 L 260,160 L 235,135 Z" fill="${secondary}"/>
        <path d="M 115,100 L 145,75 L 205,75 L 235,100 Z" fill="${secondary}"/>
        <!-- Side Panels -->
        <path d="M 115,180 L 125,180 L 125,320 L 115,320 Z" fill="${secondary}"/>
        <path d="M 235,180 L 225,180 L 225,320 L 235,320 Z" fill="${secondary}"/>
        <!-- Player Number Mockup on Back -->
        <text x="175" y="210" font-family="'Outfit', sans-serif" font-weight="900" font-size="70" text-anchor="middle" fill="${secondary}" opacity="0.8">10</text>
        <g id="svg-logo-container">
          ${logoMarkup}
        </g>
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
      coords = (type === 'hoodie') ? { x: 155, y: 150, w: 40, h: 40 } :
               (type === 'jacket') ? { x: 125, y: 140, w: 30, h: 30 } : // left-aligned for zip jacket
               { x: 155, y: 135, w: 40, h: 40 };
    } else if (placement === 'left_sleeve') {
      shouldRenderLogo = true;
      coords = { x: 80, y: 128, w: 22, h: 22 };
    } else if (placement === 'right_sleeve') {
      shouldRenderLogo = true;
      coords = { x: 248, y: 128, w: 22, h: 22 };
    }
  } else if (view === 'back') {
    if (placement === 'back') {
      shouldRenderLogo = true;
      coords = { x: 135, y: 130, w: 80, h: 80 };
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
