// Pexels stock photo URLs - free to use
const P = 'https://images.pexels.com/photos';

export const logo = null; // local logo is empty placeholder - use text-only branding

export const heroImage = `${P}/27857790/pexels-photo-27857790.jpeg?auto=compress&cs=tinysrgb&w=1260`;

export const publicLinks = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Products', '/products'],
  ['Gallery', '/gallery'],
  ['Book Now', '/booking'],
  ['Feedback', '/feedback'],
  ['Contact', '/contact'],
];

export const services = [
  {
    icon: 'fa-solid fa-gears',
    title: 'Engine Repair',
    desc: 'Full engine diagnostics, overhaul, and repair for European and American vehicles. From valve jobs to complete rebuilds.',
    photo: `${P}/3993251/pexels-photo-3993251.jpeg?auto=compress&cs=tinysrgb&w=600`,
  },
  {
    icon: 'fa-solid fa-car-battery',
    title: 'Electrical Systems',
    desc: 'Battery testing, alternator repair, wiring harness restoration, and ECU diagnostics.',
    photo: `${P}/4489749/pexels-photo-4489749.jpeg?auto=compress&cs=tinysrgb&w=600`,
  },
  {
    icon: 'fa-solid fa-snowflake',
    title: 'AC Service',
    desc: 'Full climate control service including recharge, leak detection, compressor repair, and vent cleaning.',
    photo: `${P}/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=600`,
  },
  {
    icon: 'fa-solid fa-laptop-medical',
    title: 'OBD Diagnostics',
    desc: 'Computer scan and detailed fault report. We read every module and explain what your car needs.',
    photo: `${P}/4116172/pexels-photo-4116172.jpeg?auto=compress&cs=tinysrgb&w=600`,
  },
  {
    icon: 'fa-solid fa-oil-can',
    title: 'Brake Service',
    desc: 'Disc and pad replacement, brake fluid flush, ABS troubleshooting, and full brake system inspection.',
    photo: `${P}/36044141/pexels-photo-36044141.jpeg?auto=compress&cs=tinysrgb&w=600`,
  },
  {
    icon: 'fa-solid fa-gauge-high',
    title: 'Transmission',
    desc: 'Automatic and manual gearbox repair, clutch replacement, and fluid service.',
    photo: `${P}/4489735/pexels-photo-4489735.jpeg?auto=compress&cs=tinysrgb&w=600`,
  },
  {
    icon: 'fa-solid fa-road',
    title: 'Suspension & Steering',
    desc: 'Shock absorber, strut, bushing, and power steering repair for a smooth, safe ride.',
    photo: `${P}/8986148/pexels-photo-8986148.jpeg?auto=compress&cs=tinysrgb&w=600`,
  },
  {
    icon: 'fa-solid fa-wrench',
    title: 'General Maintenance',
    desc: 'Oil change, filter replacement, fluid top-ups, multipoint inspection, and scheduled service.',
    photo: `${P}/9626877/pexels-photo-9626877.jpeg?auto=compress&cs=tinysrgb&w=600`,
  },
];

export const featureCards = [
  { icon: 'fa-solid fa-microscope', title: 'Expert Diagnostics', desc: 'State-of-the-art OBD systems. We diagnose the root cause, not just symptoms, saving you time and money.' },
  { icon: 'fa-solid fa-certificate', title: 'Genuine Parts Only', desc: 'We source authentic manufacturer-approved parts. No counterfeits - your safety is non-negotiable.' },
  { icon: 'fa-solid fa-mobile-screen', title: 'Real-Time Updates', desc: "Track your vehicle's repair progress online through your personal client portal. Total transparency." },
  { icon: 'fa-solid fa-receipt', title: 'Clear Pricing', desc: 'No hidden charges. You receive a detailed invoice before work begins. What we quote is what you pay.' },
  { icon: 'fa-solid fa-clipboard-check', title: 'Quality Checked', desc: 'Every repair goes through a final inspection, diagnostic scan, and road-test review before handover.' },
  { icon: 'fa-solid fa-bolt', title: 'Fast Turnaround', desc: 'Most repairs completed within 24-48 hours. Emergency slots available for urgent cases.' },
];

export const galleryItems = [
  { src: `${P}/3993251/pexels-photo-3993251.jpeg?auto=compress&cs=tinysrgb&w=600`, caption: 'Engine bay inspection on a BMW 3 Series' },
  { src: `${P}/4489749/pexels-photo-4489749.jpeg?auto=compress&cs=tinysrgb&w=600`, caption: 'Electrical system diagnostics in progress' },
  { src: `${P}/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=600`, caption: 'Workshop bay with vehicle on the hoist' },
  { src: `${P}/4116172/pexels-photo-4116172.jpeg?auto=compress&cs=tinysrgb&w=600`, caption: 'OBD computer scan and fault reporting' },
  { src: `${P}/36044141/pexels-photo-36044141.jpeg?auto=compress&cs=tinysrgb&w=600`, caption: 'Brake pad and disc replacement' },
  { src: `${P}/8986148/pexels-photo-8986148.jpeg?auto=compress&cs=tinysrgb&w=600`, caption: 'Technician working under the vehicle' },
  { src: `${P}/9626877/pexels-photo-9626877.jpeg?auto=compress&cs=tinysrgb&w=600`, caption: 'Routine oil change and filter service' },
  { src: `${P}/4489735/pexels-photo-4489735.jpeg?auto=compress&cs=tinysrgb&w=600`, caption: 'Auto repair shop interior with multiple bays' },
  { src: `${P}/8985517/pexels-photo-8985517.jpeg?auto=compress&cs=tinysrgb&w=600`, caption: 'Mechanic team performing quality check' },
];

export const products = [
  { id: 1, name: 'MANN Oil Filter HU 816 X', cat: 'filters', price: 1850, image: `${P}/6870299/pexels-photo-6870299.jpeg?auto=compress&cs=tinysrgb&w=400`, desc: 'OEM-grade cartridge oil filter for selected BMW and Mini petrol engines.', make: 'MANN-FILTER', partNo: 'HU 816 X' },
  { id: 2, name: 'Bosch Platinum Spark Plug Set', cat: 'engine', price: 6200, image: `${P}/4116224/pexels-photo-4116224.jpeg?auto=compress&cs=tinysrgb&w=400`, desc: 'Platinum plug set for Mercedes-Benz and BMW petrol engines.', make: 'Bosch', partNo: '0242236563 / FR7NPP332' },
  { id: 3, name: 'Continental Timing Belt Kit', cat: 'engine', price: 18500, image: `${P}/13065689/pexels-photo-13065689.jpeg?auto=compress&cs=tinysrgb&w=400`, desc: 'Complete belt kit for selected Ford EcoBoost engines.', make: 'Continental ContiTech', partNo: 'CT1168K1' },
  { id: 4, name: 'ATE Front Brake Disc Pair', cat: 'brakes', price: 14200, image: `${P}/30470930/pexels-photo-30470930.jpeg?auto=compress&cs=tinysrgb&w=400`, desc: 'Vented front brake discs for Mercedes-Benz C-Class applications.', make: 'ATE', partNo: '24.0128-0158.1' },
  { id: 5, name: 'Textar Ceramic Brake Pads', cat: 'brakes', price: 9800, image: `${P}/34277926/pexels-photo-34277926.jpeg?auto=compress&cs=tinysrgb&w=400`, desc: 'Low-dust front pads for BMW 3 Series and 4 Series models.', make: 'Textar', partNo: '2372301' },
  { id: 6, name: 'MAHLE Air Filter LX 1566', cat: 'filters', price: 3200, image: `${P}/8478220/pexels-photo-8478220.jpeg?auto=compress&cs=tinysrgb&w=400`, desc: 'High-flow panel air filter for Volvo Drive-E and selected Ford engines.', make: 'MAHLE', partNo: 'LX 1566' },
  { id: 7, name: 'Valeo Alternator 150A', cat: 'electrical', price: 28500, image: `${P}/6870313/pexels-photo-6870313.jpeg?auto=compress&cs=tinysrgb&w=400`, desc: 'Remanufactured alternator for Volvo and Ford 2.0 applications.', make: 'Valeo', partNo: '439658' },
  { id: 8, name: 'Varta AGM Battery 70Ah', cat: 'electrical', price: 24500, image: `${P}/4489749/pexels-photo-4489749.jpeg?auto=compress&cs=tinysrgb&w=400`, desc: 'AGM battery for start-stop Mercedes, BMW, Volvo and Ford vehicles.', make: 'Varta', partNo: 'E39 570 901 076' },
];

export const aboutPhotos = {
  hero: `${P}/33814734/pexels-photo-33814734.jpeg?auto=compress&cs=tinysrgb&w=1260`,
  workshop: `${P}/8985517/pexels-photo-8985517.jpeg?auto=compress&cs=tinysrgb&w=600`,
  team: [
    { name: 'Ronald Nyongesa', role: 'Chief Executive Officer', desc: 'Leads Doctor Animal Auto\'s customer-first service, operations, and growth.', photo: `${P}/6870313/pexels-photo-6870313.jpeg?auto=compress&cs=tinysrgb&w=300` },
    { name: 'Grace Achieng', role: 'Diagnostic Technician', desc: 'OBD specialist, electrical systems and ECU reprogramming.', photo: `${P}/4116172/pexels-photo-4116172.jpeg?auto=compress&cs=tinysrgb&w=300` },
    { name: 'Peter Otieno', role: 'Suspension & Brakes', desc: '15 years specialized in chassis and safety systems.', photo: `${P}/9626877/pexels-photo-9626877.jpeg?auto=compress&cs=tinysrgb&w=300` },
  ],
};

export const bookingPhoto = `${P}/3993251/pexels-photo-3993251.jpeg?auto=compress&cs=tinysrgb&w=600`;
export const contactPhoto = `${P}/33814734/pexels-photo-33814734.jpeg?auto=compress&cs=tinysrgb&w=600`;

export const demoUsers = [
  { email: 'admin@doctoranimal.co.ke', password: 'admin123', role: 'admin', name: 'Admin' },
  { email: 'client@test.com', password: 'client123', role: 'client', name: 'John Kamau' },
];
