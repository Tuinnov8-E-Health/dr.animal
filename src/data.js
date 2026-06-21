// Local images from /images — resolved by Vite for dev and production builds
const img = (file) => new URL(`../images/${file}`, import.meta.url).href;

export const logo = img('logo24.png');

export const heroImage = img('night.jpeg');

export const heroImages = {
  main: img('night.jpeg'),
  workshop: img('repair1.jpeg'),
  engine: img('engine1.jpeg'),
  diagnostic: img('software1.jpeg'),
};

export const testimonials = [
  {
    name: 'James Mwangi',
    vehicle: 'BMW 320i Owner',
    quote: 'They diagnosed an electrical fault other shops missed. Transparent pricing, genuine parts, and my car was ready in 36 hours.',
    rating: 5,
  },
  {
    name: 'Sarah Wanjiku',
    vehicle: 'Mercedes C-Class Owner',
    quote: 'The client portal kept me updated every step. No surprises on the invoice — exactly what was quoted.',
    rating: 5,
  },
  {
    name: 'David Ochieng',
    vehicle: 'Volvo XC60 Owner',
    quote: 'Best suspension and brake work in Kamakis. Professional team, clean workshop, and fair turnaround times.',
    rating: 5,
  },
];

export const processSteps = [
  { step: '01', title: 'Book Online', desc: 'Choose your service and preferred slot in under 2 minutes.', icon: 'fa-solid fa-calendar-check' },
  { step: '02', title: 'Diagnosis', desc: 'Full OBD scan and inspection. We explain findings before any work starts.', icon: 'fa-solid fa-magnifying-glass' },
  { step: '03', title: 'Repair', desc: 'Expert mechanics using genuine parts. Track progress via your portal.', icon: 'fa-solid fa-wrench' },
  { step: '04', title: 'Quality Check', desc: 'Final inspection, road test, and handover with a detailed report.', icon: 'fa-solid fa-circle-check' },
];

export const trustedBrands = ['BMW', 'Mercedes-Benz', 'Audi', 'Volvo', 'Ford', 'Land Rover', 'Mini', 'Peugeot'];

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
    photo: img('engine1.jpeg'),
  },
  {
    icon: 'fa-solid fa-car-battery',
    title: 'Electrical Systems',
    desc: 'Battery testing, alternator repair, wiring harness restoration, and ECU diagnostics.',
    photo: img('ford2.jpeg'),
  },
  {
    icon: 'fa-solid fa-snowflake',
    title: 'AC Service',
    desc: 'Full climate control service including recharge, leak detection, compressor repair, and vent cleaning.',
    photo: img('img2.jpeg'),
  },
  {
    icon: 'fa-solid fa-laptop-medical',
    title: 'OBD Diagnostics',
    desc: 'Computer scan and detailed fault report. We read every module and explain what your car needs.',
    photo: img('software1.jpeg'),
  },
  {
    icon: 'fa-solid fa-oil-can',
    title: 'Brake Service',
    desc: 'Disc and pad replacement, brake fluid flush, ABS troubleshooting, and full brake system inspection.',
    photo: img('repair2.jpeg'),
  },
  {
    icon: 'fa-solid fa-gauge-high',
    title: 'Transmission',
    desc: 'Automatic and manual gearbox repair, clutch replacement, and fluid service.',
    photo: img('gear1.jpeg'),
  },
  {
    icon: 'fa-solid fa-road',
    title: 'Suspension & Steering',
    desc: 'Shock absorber, strut, bushing, and power steering repair for a smooth, safe ride.',
    photo: img('repair3.jpeg'),
  },
  {
    icon: 'fa-solid fa-wrench',
    title: 'General Maintenance',
    desc: 'Oil change, filter replacement, fluid top-ups, multipoint inspection, and scheduled service.',
    photo: img('engine4.jpeg'),
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
  { src: img('engine1.jpeg'), caption: 'Engine bay inspection and diagnostics' },
  { src: img('ford1.jpeg'), caption: 'Ford Ranger service in our workshop' },
  { src: img('repair1.jpeg'), caption: 'Workshop bay with vehicle on the hoist' },
  { src: img('software1.jpeg'), caption: 'OBD computer scan and fault reporting' },
  { src: img('repair2.jpeg'), caption: 'Brake and suspension repair in progress' },
  { src: img('repair3.jpeg'), caption: 'Technician working under the vehicle' },
  { src: img('engine3.jpeg'), caption: 'Routine engine service and maintenance' },
  { src: img('img1.jpeg'), caption: 'Doctor Animal Auto workshop interior' },
  { src: img('team2.jpeg'), caption: 'Our expert mechanic team at work' },
];

export const products = [
  { id: 1, name: 'MANN Oil Filter HU 816 X', cat: 'filters', price: 1850, image: img('part1.jpeg'), desc: 'OEM-grade cartridge oil filter for selected BMW and Mini petrol engines.', make: 'MANN-FILTER', partNo: 'HU 816 X' },
  { id: 2, name: 'Bosch Platinum Spark Plug Set', cat: 'engine', price: 6200, image: img('engine3.jpeg'), desc: 'Platinum plug set for Mercedes-Benz and BMW petrol engines.', make: 'Bosch', partNo: '0242236563 / FR7NPP332' },
  { id: 3, name: 'Continental Timing Belt Kit', cat: 'engine', price: 18500, image: img('gear1.jpeg'), desc: 'Complete belt kit for selected Ford EcoBoost engines.', make: 'Continental ContiTech', partNo: 'CT1168K1' },
  { id: 4, name: 'ATE Front Brake Disc Pair', cat: 'brakes', price: 14200, image: img('repair2.jpeg'), desc: 'Vented front brake discs for Mercedes-Benz C-Class applications.', make: 'ATE', partNo: '24.0128-0158.1' },
  { id: 5, name: 'Textar Ceramic Brake Pads', cat: 'brakes', price: 9800, image: img('img6.jpeg'), desc: 'Low-dust front pads for BMW 3 Series and 4 Series models.', make: 'Textar', partNo: '2372301' },
  { id: 6, name: 'MAHLE Air Filter LX 1566', cat: 'filters', price: 3200, image: img('ford1.jpeg'), desc: 'High-flow panel air filter for Volvo Drive-E and selected Ford engines.', make: 'MAHLE', partNo: 'LX 1566' },
  { id: 7, name: 'Valeo Alternator 150A', cat: 'electrical', price: 28500, image: img('engine1.jpeg'), desc: 'Remanufactured alternator for Volvo and Ford 2.0 applications.', make: 'Valeo', partNo: '439658' },
  { id: 8, name: 'Varta AGM Battery 70Ah', cat: 'electrical', price: 24500, image: img('ford2.jpeg'), desc: 'AGM battery for start-stop Mercedes, BMW, Volvo and Ford vehicles.', make: 'Varta', partNo: 'E39 570 901 076' },
];

export const aboutPhotos = {
  hero: img('night.jpeg'),
  workshop: img('repair1.jpeg'),
  team: [
    { name: 'Ronald Nyongesa', role: 'Chief Executive Officer', desc: 'Leads Doctor Animal Auto\'s customer-first service, operations, and growth.', photo: img('ceo.jpeg') },
    { name: 'Grace Achieng', role: 'Diagnostic Technician', desc: 'OBD specialist, electrical systems and ECU reprogramming.', photo: img('team.jpeg') },
    { name: 'Peter Otieno', role: 'Suspension & Brakes', desc: '15 years specialized in chassis and safety systems.', photo: img('team2.jpeg') },
  ],
};

export const bookingPhoto = img('repair1.jpeg');
export const contactPhoto = img('img1.jpeg');

export const demoUsers = [
  { email: 'admin@doctoranimal.co.ke', password: 'admin123', role: 'admin', name: 'Admin' },
  { email: 'client@test.com', password: 'client123', role: 'client', name: 'John Kamau' },
];
