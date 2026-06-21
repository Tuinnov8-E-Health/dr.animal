import { getClientPortalData } from './portalData';

const john = getClientPortalData({ name: 'John Kamau', email: 'client@test.com' });

export const technicians = ['Grace Achieng', 'Peter Otieno', 'Ronald Nyongesa'];
export const serviceOptions = [
  'Engine Repair',
  'Electrical Systems',
  'AC Service',
  'OBD Diagnostics',
  'Brake Service',
  'Transmission',
  'Suspension & Steering',
  'General Maintenance',
];

export function getInitialAdminState() {
  return {
    bookings: [
      {
        id: 'BK-1024',
        clientId: 'client-1',
        clientName: 'John Kamau',
        email: 'client@test.com',
        phone: '+254 712 345 678',
        vehicle: 'BMW 320i F30 · KDA 452X',
        service: 'OBD Diagnostics & Front Brake Service',
        date: '18 Jun 2025',
        status: 'approved',
        notes: 'ABS warning light and brake squeal reported.',
      },
      {
        id: 'BK-1031',
        clientId: 'client-2',
        clientName: 'Sarah Wanjiku',
        email: 'sarah.w@email.com',
        phone: '+254 722 111 222',
        vehicle: 'Mercedes C200 · KCB 778A',
        service: 'AC Service',
        date: '22 Jun 2025',
        status: 'pending',
        notes: 'Weak AC on passenger side. Prefers morning drop-off.',
      },
      {
        id: 'BK-1032',
        clientId: 'client-3',
        clientName: 'David Ochieng',
        email: 'david.o@email.com',
        phone: '+254 733 999 000',
        vehicle: 'Volvo XC60 · KDG 334K',
        service: 'Suspension & Steering',
        date: '23 Jun 2025',
        status: 'pending',
        notes: 'Knocking sound over bumps, possible strut issue.',
      },
      {
        id: 'BK-1033',
        clientId: 'client-1',
        clientName: 'John Kamau',
        email: 'client@test.com',
        phone: '+254 712 345 678',
        vehicle: 'Ford Ranger XLT · KDG 891B',
        service: 'General Maintenance',
        date: '28 Jun 2025',
        status: 'pending',
        notes: 'Scheduled oil change and multipoint inspection.',
      },
    ],
    clients: [
      {
        id: 'client-1',
        name: 'John Kamau',
        email: 'client@test.com',
        phone: '+254 712 345 678',
        memberSince: 'Jan 2024',
        vehicles: john.vehicles,
        activeJob: { ...john.activeJob },
        timeline: john.timeline.map((t) => ({ ...t })),
        reportUpdates: john.reportUpdates.map((r) => ({ ...r })),
        messages: john.messages.map((m) => ({ ...m })),
        invoice: {
          ...john.invoice,
          items: john.invoice.items.map((i) => ({ ...i })),
        },
      },
      {
        id: 'client-2',
        name: 'Sarah Wanjiku',
        email: 'sarah.w@email.com',
        phone: '+254 722 111 222',
        memberSince: 'Mar 2024',
        vehicles: [
          {
            id: 1,
            make: 'Mercedes-Benz',
            model: 'C200 W205',
            year: 2019,
            plate: 'KCB 778A',
            vin: 'WDD2050421F123456',
            mileage: '62,100 km',
            color: 'Obsidian Black',
            lastService: '14 Apr 2025',
          },
        ],
        activeJob: {
          id: 'JOB-2901',
          vehicleId: 1,
          vehicleLabel: 'Mercedes C200 · KCB 778A',
          service: 'AC Service — pending booking approval',
          status: 'pending',
          statusLabel: 'Awaiting Approval',
          progress: 0,
          bookedDate: '22 Jun 2025',
          estimatedCompletion: 'TBC',
          technician: 'Unassigned',
          bay: '—',
          summary: 'Booking pending admin approval.',
        },
        timeline: [
          { id: 1, title: 'Booking submitted', desc: 'Client requested AC service appointment.', date: '22 Jun 2025', done: true, current: true },
        ],
        reportUpdates: [],
        messages: [
          { id: 1, from: 'client', sender: 'Sarah Wanjiku', text: 'Hi, can I drop off early on Monday morning?', time: '22 Jun 2025, 10:15', read: true },
        ],
        invoice: {
          id: 'INV-2025-201',
          jobId: 'JOB-2901',
          status: 'draft',
          statusLabel: 'Draft',
          issued: '—',
          due: 'On collection',
          items: [],
          notes: 'Invoice will be created once booking is approved and work begins.',
        },
      },
      {
        id: 'client-3',
        name: 'David Ochieng',
        email: 'david.o@email.com',
        phone: '+254 733 999 000',
        memberSince: 'Nov 2023',
        vehicles: [
          {
            id: 1,
            make: 'Volvo',
            model: 'XC60',
            year: 2021,
            plate: 'KDG 334K',
            vin: 'YV1UZBCV1M1234567',
            mileage: '38,900 km',
            color: 'Crystal White',
            lastService: '8 Feb 2025',
          },
        ],
        activeJob: {
          id: 'JOB-2902',
          vehicleId: 1,
          vehicleLabel: 'Volvo XC60 · KDG 334K',
          service: 'Suspension & Steering',
          status: 'pending',
          statusLabel: 'Awaiting Approval',
          progress: 0,
          bookedDate: '23 Jun 2025',
          estimatedCompletion: 'TBC',
          technician: 'Unassigned',
          bay: '—',
          summary: 'Knocking over bumps — suspension inspection requested.',
        },
        timeline: [],
        reportUpdates: [],
        messages: [],
        invoice: {
          id: 'INV-2025-202',
          jobId: 'JOB-2902',
          status: 'draft',
          statusLabel: 'Draft',
          issued: '—',
          due: 'On collection',
          items: [],
          notes: '',
        },
      },
    ],
  };
}

export function calcInvoiceTotals(items) {
  const added = items.filter((i) => i.added);
  const subtotal = added.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  const vat = Math.round(subtotal * 0.16);
  return { subtotal, vat, total: subtotal + vat, added, pending: items.filter((i) => !i.added) };
}

export function nowLabel() {
  return new Date().toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
