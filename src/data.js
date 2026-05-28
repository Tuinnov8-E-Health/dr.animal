export const imageUrl = (path) => new URL(`../images/${path}`, import.meta.url).href;

export const logo = imageUrl('logo24.png');
export const heroImage = imageUrl('night.jpeg');

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
  ['fa-solid fa-gears', 'Engine Repair', 'Full diagnostics & repair'],
  ['fa-solid fa-car-battery', 'Electrical', 'Full wiring & battery'],
  ['fa-solid fa-snowflake', 'AC Service', 'Recharge & repair'],
  ['fa-solid fa-laptop-medical', 'OBD Diagnostics', 'Computer scan & report'],
];

export const featureCards = [
  [imageUrl('software1.jpeg'), 'Diagnostics equipment', 'Expert Diagnostics', 'State-of-the-art OBD systems. We diagnose the root cause, not just symptoms, saving you time and money.'],
  [imageUrl('part1.jpeg'), 'Genuine spare parts', 'Genuine Parts Only', 'We source authentic manufacturer-approved parts. No counterfeits - your safety is non-negotiable.'],
  [imageUrl('engine3.jpeg'), 'Vehicle service update', 'Real-Time Updates', "Track your vehicle's repair progress online through your personal client portal. Total transparency."],
  [imageUrl('img4.jpeg'), 'Workshop quote review', 'Clear Pricing', 'No hidden charges. You receive a detailed invoice before work begins. What we quote is what you pay.'],
  [imageUrl('repair2.jpeg'), 'Quality checked brake service', 'Quality Checked', 'Every repair goes through a final inspection, diagnostic scan, and road-test review before handover.'],
  [imageUrl('ford2.jpeg'), 'Fast workshop turnaround', 'Fast Turnaround', 'Most repairs completed within 24-48 hours. Emergency slots available for urgent cases.'],
];

export const galleryItems = [
  imageUrl('team.jpeg'),
  imageUrl('team2.jpeg'),
  imageUrl('engine1.jpeg'),
  imageUrl('repair3.jpeg'),
  imageUrl('ford1.jpeg'),
  imageUrl('img1.jpeg'),
];

export const products = [
  { id: 1, name: 'MANN Oil Filter HU 816 X', cat: 'filters', price: 1850, image: imageUrl('part1.jpeg'), desc: 'OEM-grade cartridge oil filter for selected BMW and Mini petrol engines.', make: 'MANN-FILTER', partNo: 'HU 816 X' },
  { id: 2, name: 'Bosch Platinum Spark Plug Set', cat: 'engine', price: 6200, image: imageUrl('engine1.jpeg'), desc: 'Platinum plug set for Mercedes-Benz and BMW petrol engines.', make: 'Bosch', partNo: '0242236563 / FR7NPP332' },
  { id: 3, name: 'Continental Timing Belt Kit', cat: 'engine', price: 18500, image: imageUrl('engine2.jpeg'), desc: 'Complete belt kit for selected Ford EcoBoost engines.', make: 'Continental ContiTech', partNo: 'CT1168K1' },
  { id: 4, name: 'ATE Front Brake Disc Pair', cat: 'brakes', price: 14200, image: imageUrl('repair1.jpeg'), desc: 'Vented front brake discs for Mercedes-Benz C-Class applications.', make: 'ATE', partNo: '24.0128-0158.1' },
  { id: 5, name: 'Textar Ceramic Brake Pads', cat: 'brakes', price: 9800, image: imageUrl('repair2.jpeg'), desc: 'Low-dust front pads for BMW 3 Series and 4 Series models.', make: 'Textar', partNo: '2372301' },
  { id: 6, name: 'MAHLE Air Filter LX 1566', cat: 'filters', price: 3200, image: imageUrl('img1.jpeg'), desc: 'High-flow panel air filter for Volvo Drive-E and selected Ford engines.', make: 'MAHLE', partNo: 'LX 1566' },
  { id: 7, name: 'Valeo Alternator 150A', cat: 'electrical', price: 28500, image: imageUrl('software1.jpeg'), desc: 'Remanufactured alternator for Volvo and Ford 2.0 applications.', make: 'Valeo', partNo: '439658' },
  { id: 8, name: 'Varta AGM Battery 70Ah', cat: 'electrical', price: 24500, image: imageUrl('img2.jpeg'), desc: 'AGM battery for start-stop Mercedes, BMW, Volvo and Ford vehicles.', make: 'Varta', partNo: 'E39 570 901 076' },
];

export const demoUsers = [
  { email: 'admin@doctoranimal.co.ke', password: 'admin123', role: 'admin', name: 'Admin' },
  { email: 'client@test.com', password: 'client123', role: 'client', name: 'John Kamau' },
];
