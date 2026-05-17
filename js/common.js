// ============ SHARED STATE ============
let currentUser = null;
let cartItems = [];
let feedbackRating = 0;

const products = [
  {
    id:1,name:'MANN Oil Filter HU 816 X',cat:'filters',price:1850,image:'../images/part1.jpeg',
    desc:'OEM-grade cartridge oil filter for selected BMW and Mini petrol engines.',icon:'🔩',
    make:'MANN-FILTER',partNo:'HU 816 X',
    specs:['Cartridge filter with sealing rings','Designed for clean oil flow and pressure stability','Recommended during every oil service'],
    fits:['BMW 1 Series F20/F21 116i, 118i','BMW 3 Series F30 316i, 320i','Mini Cooper F56 1.5 petrol']
  },
  {
    id:2,name:'Bosch Platinum Spark Plug Set',cat:'engine',price:6200,image:'../images/engine1.jpeg',
    desc:'Platinum plug set for Mercedes-Benz and BMW petrol engines.',icon:'⚡',
    make:'Bosch',partNo:'0242236563 / FR7NPP332',
    specs:['Set of 4 plugs','Platinum center electrode','Improves cold starts and stable idle'],
    fits:['Mercedes-Benz C180/C200 W204, W205','BMW 320i F30 N20 engine','BMW 118i F20 N13 engine']
  },
  {
    id:3,name:'Continental Timing Belt Kit',cat:'engine',price:18500,image:'../images/engine2.jpeg',
    desc:'Complete belt kit for selected Ford EcoBoost engines.',icon:'🔧',
    make:'Continental ContiTech',partNo:'CT1168K1',
    specs:['Timing belt, tensioner and idler kit','Built for high-temperature engine bays','Professional installation recommended'],
    fits:['Ford Focus 1.0 EcoBoost','Ford Fiesta 1.0 EcoBoost','Ford EcoSport 1.0 EcoBoost']
  },
  {
    id:4,name:'ATE Front Brake Disc Pair',cat:'brakes',price:14200,image:'../images/repair1.jpeg',
    desc:'Vented front brake discs for Mercedes-Benz C-Class applications.',icon:'🛞',
    make:'ATE',partNo:'24.0128-0158.1',
    specs:['Vented front disc pair','Balanced for low vibration braking','Use with matching ceramic or OEM pads'],
    fits:['Mercedes-Benz C200 W204','Mercedes-Benz C250 W204','Mercedes-Benz E200 W212 with matching disc size']
  },
  {
    id:5,name:'Textar Ceramic Brake Pads',cat:'brakes',price:9800,image:'../images/repair2.jpeg',
    desc:'Low-dust front pads for BMW 3 Series and 4 Series models.',icon:'🔴',
    make:'Textar',partNo:'2372301',
    specs:['Front axle pad set','Low dust ceramic compound','Includes wear sensor where applicable'],
    fits:['BMW 3 Series F30/F31','BMW 4 Series F32/F36','BMW X1 F48 with matching caliper']
  },
  {
    id:6,name:'MAHLE Air Filter LX 1566',cat:'filters',price:3200,image:'../images/img1.jpeg',
    desc:'High-flow panel air filter for Volvo Drive-E and selected Ford engines.',icon:'💨',
    make:'MAHLE',partNo:'LX 1566',
    specs:['Panel-style intake filter','Protects MAF and turbo intake path','Best replaced every major service'],
    fits:['Volvo XC60 2.0 T5/T6','Volvo S60 2.0 petrol','Ford Mondeo 2.0 EcoBoost']
  },
  {
    id:7,name:'Valeo Alternator 150A',cat:'electrical',price:28500,image:'../images/software1.jpeg',
    desc:'Remanufactured alternator for Volvo and Ford 2.0 applications.',icon:'🔋',
    make:'Valeo',partNo:'439658',
    specs:['150 amp output','Pulley and regulator included','Bench-tested before dispatch'],
    fits:['Volvo S60/V60 2.0','Volvo XC60 2.0','Ford Kuga 2.0 EcoBoost']
  },
  {
    id:8,name:'Varta AGM Battery 70Ah',cat:'electrical',price:24500,image:'../images/img2.jpeg',
    desc:'AGM battery for start-stop Mercedes, BMW, Volvo and Ford vehicles.',icon:'🔌',
    make:'Varta',partNo:'E39 570 901 076',
    specs:['70Ah AGM battery','760A cold cranking amps','Supports start-stop and heavy electronics'],
    fits:['Mercedes-Benz C-Class W204/W205','BMW 3 Series F30','Volvo XC60 and Ford Ranger trims requiring AGM']
  },
  {
    id:9,name:'Bosch Fuel Filter',cat:'filters',price:4200,image:'../images/part1.jpeg',
    desc:'Diesel fuel filter for selected Mercedes-Benz CDI models.',icon:'⛽',
    make:'Bosch',partNo:'F 026 402 068',
    specs:['High-efficiency diesel filtration','Protects injectors and high-pressure pump','Water separation support on compatible housings'],
    fits:['Mercedes-Benz E220 CDI W212','Mercedes-Benz C220 CDI W204','Mercedes-Benz Sprinter CDI variants']
  },
  {
    id:10,name:'LuK Clutch Kit',cat:'engine',price:36500,image:'../images/gear1.jpeg',
    desc:'Complete clutch kit for Ford Ranger and Transit manual drivetrains.',icon:'⚙️',
    make:'LuK',partNo:'624 3336 09',
    specs:['Pressure plate, disc and release bearing','Designed for high-torque diesel use','Flywheel inspection required during fitting'],
    fits:['Ford Ranger 2.2 TDCi','Ford Transit 2.2 TDCi','Ford Everest manual variants']
  },
  {
    id:11,name:'Bosch Aerotwin Wiper Set',cat:'electrical',price:4300,image:'../images/ford1.jpeg',
    desc:'Flat-blade wiper set for BMW, Mercedes and Volvo windscreen profiles.',icon:'🌧️',
    make:'Bosch',partNo:'A 864 S',
    specs:['Twin front wiper set','Quiet beam-blade design','Includes vehicle-specific adapters'],
    fits:['BMW 3 Series F30','Mercedes-Benz C-Class W205','Volvo V40/V60 selected years']
  },
  {
    id:12,name:'Bilstein B4 Rear Shock Absorber',cat:'brakes',price:16500,image:'../images/repair3.jpeg',
    desc:'OEM-replacement rear shock for Volvo and BMW comfort suspension.',icon:'🏎️',
    make:'Bilstein',partNo:'19-171593',
    specs:['Gas-pressure rear shock','Restores factory ride control','Replace in pairs for balanced handling'],
    fits:['Volvo XC60 rear axle','BMW X3 F25 rear axle','BMW 5 Series Touring F11 selected trims']
  },
];

// ============ NAVIGATION ============
function toggleNavMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  if(!hamburger) return;
  
  const navPublic = document.getElementById('nav-public');
  const navClient = document.getElementById('nav-client');
  const navAdmin = document.getElementById('nav-admin');
  
  hamburger.classList.toggle('active');
  
  if(navPublic && navPublic.style.display !== 'none') {
    navPublic.classList.toggle('active');
  } else if(navClient && navClient.style.display !== 'none') {
    navClient.classList.toggle('active');
  } else if(navAdmin && navAdmin.style.display !== 'none') {
    navAdmin.classList.toggle('active');
  }
}

function closeNavMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  if(!hamburger) return;
  
  const navPublic = document.getElementById('nav-public');
  const navClient = document.getElementById('nav-client');
  const navAdmin = document.getElementById('nav-admin');
  
  hamburger.classList.remove('active');
  if(navPublic) navPublic.classList.remove('active');
  if(navClient) navClient.classList.remove('active');
  if(navAdmin) navAdmin.classList.remove('active');
}

// ============ AUTH ============
const DEMO_USERS = [
  {email:'admin@doctoranimal.co.ke',password:'admin123',role:'admin',name:'Admin'},
  {email:'client@test.com',password:'client123',role:'client',name:'John Kamau'},
];

function doLogin() {
  const email = document.getElementById('login-email')?.value.trim();
  const pass = document.getElementById('login-password')?.value;
  const user = DEMO_USERS.find(u=>u.email===email && u.password===pass);
  if(!user) { showNotif('Invalid email or password','error'); return; }
  currentUser = user;
  const navPublic = document.getElementById('nav-public');
  if(navPublic) navPublic.style.display='none';
  if(user.role==='admin') {
    const navAdmin = document.getElementById('nav-admin');
    if(navAdmin) navAdmin.style.display='flex';
    window.location.href='admin/index.html';
  } else {
    const navClient = document.getElementById('nav-client');
    if(navClient) navClient.style.display='flex';
    const clientNameNav = document.getElementById('client-name-nav');
    if(clientNameNav) clientNameNav.textContent='👤 '+user.name;
    showNotif('Welcome back, '+user.name+'!','success');
  }
}

function doRegister() {
  const name = document.getElementById('reg-name')?.value.trim();
  const email = document.getElementById('reg-email')?.value.trim();
  if(!name||!email) { showNotif('Please fill all required fields','error'); return; }
  currentUser = {email,name,role:'client'};
  const navPublic = document.getElementById('nav-public');
  if(navPublic) navPublic.style.display='none';
  const navClient = document.getElementById('nav-client');
  if(navClient) navClient.style.display='flex';
  const clientNameNav = document.getElementById('client-name-nav');
  if(clientNameNav) clientNameNav.textContent='👤 '+name;
  showNotif('Account created! Please register your vehicle.','success');
}

function logout() {
  closeNavMenu();
  currentUser = null;
  const navPublic = document.getElementById('nav-public');
  const navClient = document.getElementById('nav-client');
  const navAdmin = document.getElementById('nav-admin');
  if(navPublic) navPublic.style.display='flex';
  if(navClient) navClient.style.display='none';
  if(navAdmin) navAdmin.style.display='none';
  const nestedPage = window.location.pathname.includes('/pages/') || window.location.pathname.includes('/admin/');
  window.location.href = nestedPage ? '../index.html' : 'index.html';
  showNotif('You have been logged out.','success');
}

function switchAuthTab(tab) {
  const login = document.getElementById('auth-login');
  const register = document.getElementById('auth-register');
  const tabs = document.querySelectorAll('.auth-tab');
  if(!login || !register) return;

  login.style.display = tab === 'login' ? 'block' : 'none';
  register.style.display = tab === 'register' ? 'block' : 'none';
  tabs.forEach(btn=>btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(tab)));
}

function deleteAccount() {
  if(confirm('Are you sure? This cannot be undone.')) {
    logout();
    showNotif('Account deleted. We are sorry to see you go.','success');
  }
}

// ============ PRODUCTS ============
function addToCart(id) {
  const product = products.find(p=>p.id===id);
  const existing = cartItems.find(c=>c.id===id);
  if(existing) existing.qty++;
  else cartItems.push({...product,qty:1});
  updateCartBadge();
  showNotif(product.name+' added to cart!','success');
}

function updateCartBadge() {
  const total = cartItems.reduce((s,c)=>s+c.qty,0);
  const badge = document.getElementById('cart-count');
  const display = document.getElementById('cart-badge');
  if(badge) badge.textContent=total;
  if(display) display.style.display=total>0?'block':'none';
}

function filterProducts(cat, btn) {
  if(btn) {
    document.querySelectorAll('.type-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  }
  renderProducts(cat);
}

function renderProducts(filter) {
  const grid = document.getElementById('products-grid');
  if(!grid) return;
  const filtered = filter==='all'?products:products.filter(p=>p.cat===filter);
  grid.innerHTML = filtered.map(p=>`
    <div class="product-card">
      <div class="product-img">${p.image ? `<img src="${p.image}" alt="${p.name}">` : p.icon}</div>
      <div class="product-info">
        <div class="product-title-row">
          <h4>${p.name}</h4>
          <button class="info-btn" title="View item details" aria-label="View details for ${p.name}" onclick="showProductInfo(${p.id})">i</button>
        </div>
        <p>${p.desc}</p>
        <div class="product-footer">
          <span class="product-price">KES ${p.price.toLocaleString()}</span>
          <button class="cart-btn" onclick="addToCart(${p.id})">Add</button>
        </div>
      </div>
    </div>`).join('');
}

function showProductInfo(id) {
  const product = products.find(p=>p.id===id);
  const body = document.getElementById('product-details-body');
  if(!product || !body) return;

  const specs = product.specs?.map(item=>`<li>${item}</li>`).join('') || '<li>Specific details available on request.</li>';
  const fits = product.fits?.map(item=>`<li>${item}</li>`).join('') || '<li>Fitment must be confirmed by chassis/VIN before purchase.</li>';

  body.innerHTML = `
    <div class="product-detail-hero">
      <div class="product-detail-icon">${product.image ? `<img src="${product.image}" alt="${product.name}">` : product.icon}</div>
      <div>
        <div class="product-detail-brand">${product.make || 'OEM-grade part'}</div>
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
      </div>
    </div>
    <div class="detail-grid">
      <div class="detail-box"><span>Part Number</span><strong>${product.partNo || 'Confirm by VIN'}</strong></div>
      <div class="detail-box"><span>Category</span><strong>${product.cat}</strong></div>
      <div class="detail-box"><span>Price</span><strong>KES ${product.price.toLocaleString()}</strong></div>
    </div>
    <div class="detail-section">
      <h4>Specific Details</h4>
      <ul>${specs}</ul>
    </div>
    <div class="detail-section">
      <h4>Specific Fitment</h4>
      <ul>${fits}</ul>
      <p class="fitment-note">For Mercedes-Benz, BMW, Volvo, Ford and other European or American models, exact fitment is best confirmed using chassis number, engine code or sample part.</p>
    </div>
    <button class="btn-primary" style="width:100%;margin-top:1rem" onclick="addToCart(${product.id});closeModal('modal-product-info')">Add to Cart</button>
  `;
  openModal('modal-product-info');
}

function showCart() {
  const container = document.getElementById('cart-items');
  if(!container) return;
  if(cartItems.length===0) {
    container.innerHTML='<p style="color:rgba(0,0,0,.4);text-align:center;padding:1rem">Cart is empty</p>';
  } else {
    container.innerHTML=cartItems.map(c=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid rgba(0,0,0,.06)">
        <div><div style="font-size:.9rem;color:var(--text-primary)">${c.icon} ${c.name}</div><div style="font-size:.75rem;color:rgba(0,0,0,.4)">Qty: ${c.qty}</div></div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:1.2rem;color:var(--red)">KES ${(c.price*c.qty).toLocaleString()}</div>
      </div>`).join('');
    const total = cartItems.reduce((s,c)=>s+c.price*c.qty,0);
    const totalEl = document.getElementById('cart-total');
    if(totalEl) totalEl.textContent='KES '+total.toLocaleString();
  }
  openModal('modal-cart');
}

// ============ MODALS ============
function openModal(id) {
  const modal = document.getElementById(id);
  if(modal) modal.classList.add('open');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if(modal) modal.classList.remove('open');
}

document.querySelectorAll('.modal-overlay').forEach(overlay=>{
  overlay.addEventListener('click', e=>{
    if(e.target===overlay) overlay.classList.remove('open');
  });
});

// ============ NOTIFICATIONS ============
function showNotif(msg, type='success') {
  const el = document.getElementById('notif');
  if(!el) return;
  el.textContent = (type==='success'?'✓ ':'')+msg;
  el.className = 'notif show'+(type==='error'?' error':'');
  setTimeout(()=>el.classList.remove('show'), 3500);
}

// ============ BOOKING ============
function submitBooking() {
  const service = document.getElementById('book-service')?.value;
  const date = document.getElementById('book-date')?.value;
  const description = document.getElementById('book-description')?.value;
  if(!service || !date) { showNotif('Please fill in required fields','error'); return; }
  showNotif('Booking confirmed! We will contact you shortly.','success');
  if(document.getElementById('booking-form')) {
    document.getElementById('booking-form').reset();
  }
}

// ============ CONTACT ============
function submitContact() {
  const name = document.getElementById('ct-name')?.value.trim();
  if(!name) { showNotif('Please fill in your name','error'); return; }
  showNotif('Message sent! We will get back to you shortly.','success');
}

// ============ FEEDBACK ============
function selectFeedbackType(type, btn) {
  const typeInput = document.getElementById('feedback-type');
  if(typeInput) typeInput.value = type;
  document.querySelectorAll('.type-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
}

function setRating(n) {
  feedbackRating = n;
  document.querySelectorAll('.star').forEach((s,i)=>s.classList.toggle('active',i<n));
}

function submitFeedback() {
  const success = document.getElementById('fb-success');
  if(success) success.style.display = 'block';
  showNotif('Thank you for your feedback!','success');
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const nav = document.querySelector('nav');
    const hamburger = document.getElementById('nav-hamburger');
    if(nav && hamburger && !nav.contains(e.target) && hamburger.classList.contains('active')) {
      closeNavMenu();
    }
  });

  // Set today's date as default for booking
  const bookDate = document.getElementById('book-date');
  if(bookDate) {
    const today = new Date().toISOString().split('T')[0];
    bookDate.value = today;
  }

  // Initialize products grid
  if(document.getElementById('products-grid')) {
    renderProducts('all');
  }
});
