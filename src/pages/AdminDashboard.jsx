import React, { useEffect, useMemo, useState } from 'react';
import {
  getInitialAdminState,
  calcInvoiceTotals,
  nowLabel,
  technicians,
} from '../data/adminData';
import { supabase, supabaseEnabled } from '../supabaseClient';

const NAV = [
  { id: 'overview', label: 'Dashboard', icon: 'fa-solid fa-chart-line' },
  { id: 'bookings', label: 'Bookings', icon: 'fa-solid fa-calendar-check' },
  { id: 'orders', label: 'Orders', icon: 'fa-solid fa-bag-shopping' },
  { id: 'clients', label: 'Clients', icon: 'fa-solid fa-users' },
  { id: 'admins', label: 'Admins', icon: 'fa-solid fa-user-shield' },
  { id: 'feedbacks', label: 'Feedbacks', icon: 'fa-solid fa-star-half-stroke' },
  { id: 'contacts', label: 'Contact', icon: 'fa-solid fa-address-book' },
  { id: 'repairs', label: 'Repairs', icon: 'fa-solid fa-screwdriver-wrench' },
  { id: 'reports', label: 'Reports', icon: 'fa-solid fa-file-lines' },
  { id: 'messages', label: 'Messages', icon: 'fa-solid fa-comments' },
  { id: 'invoices', label: 'Invoices', icon: 'fa-solid fa-file-invoice-dollar' },
];

const seedOrders = [
  {
    id: 'ORD-4021',
    client: 'John Kamau',
    email: 'client@test.com',
    items: ['ATE Front Brake Disc Pair', 'Textar Ceramic Brake Pads'],
    total: 24000,
    status: 'processing',
    date: '24 Jun 2026',
  },
  {
    id: 'ORD-4022',
    client: 'Sarah Wanjiku',
    email: 'sarah.w@email.com',
    items: ['Varta AGM Battery 70Ah'],
    total: 24500,
    status: 'ready',
    date: '25 Jun 2026',
  },
  {
    id: 'ORD-4023',
    client: 'David Ochieng',
    email: 'david.o@email.com',
    items: ['MAHLE Air Filter LX 1566', 'MANN Oil Filter HU 816 X'],
    total: 5050,
    status: 'completed',
    date: '25 Jun 2026',
  },
];

const seedFeedbacks = [
  { id: 'FB-120', client: 'James Mwangi', rating: 5, channel: 'Feedback page', status: 'new', message: 'Fast diagnosis and clear updates. The brake work felt very professional.', date: '25 Jun 2026' },
  { id: 'FB-121', client: 'Sarah Wanjiku', rating: 4, channel: 'After service', status: 'reviewed', message: 'Service was good. Please improve early morning drop-off coordination.', date: '24 Jun 2026' },
  { id: 'FB-122', client: 'David Ochieng', rating: 5, channel: 'WhatsApp follow-up', status: 'new', message: 'Suspension issue was explained well before approval.', date: '23 Jun 2026' },
];

const seedContacts = [
  { id: 'MSG-701', name: 'Mercy Njeri', phone: '+254 701 223 445', email: 'mercy@email.com', subject: 'Quote for Ford Ranger service', status: 'new', date: '25 Jun 2026' },
  { id: 'MSG-702', name: 'Brian Otieno', phone: '+254 712 000 119', email: 'brian@email.com', subject: 'BMW diagnostic scan booking', status: 'contacted', date: '24 Jun 2026' },
  { id: 'MSG-703', name: 'Anne Wairimu', phone: '+254 733 112 991', email: 'anne@email.com', subject: 'Spare parts availability', status: 'converted', date: '22 Jun 2026' },
];

function AdminDashboard({ products }) {
  const [view, setView] = useState('overview');
  const [state, setState] = useState(getInitialAdminState);
  const [managedProducts, setManagedProducts] = useState(() =>
    products.map((product) => ({ ...product, stock: product.id % 3 === 0 ? 4 : 12 + product.id, visible: true })),
  );
  const [orders, setOrders] = useState(seedOrders);
  const [feedbacks, setFeedbacks] = useState(seedFeedbacks);
  const [contacts, setContacts] = useState(seedContacts);
  const [dbClients, setDbClients] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [dbBookings, setDbBookings] = useState([]);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('client-1');
  const [msgDraft, setMsgDraft] = useState('');
  const [reportDraft, setReportDraft] = useState({ title: '', body: '' });
  const [newInvoiceItem, setNewInvoiceItem] = useState({ description: '', type: 'service', unitPrice: '', qty: 1 });

  useEffect(() => {
    if (!supabaseEnabled || !supabase) return;

    const loadAdminData = async () => {
      setIsAdminLoading(true);

      const [bookingsResponse, clientsResponse, adminsResponse, ordersResponse, feedbackResponse, contactsResponse] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('profiles').select('*').order('full_name', { ascending: true }).limit(100),
        supabase.from('profiles').select('*').eq('role', 'admin').order('full_name', { ascending: true }).limit(100),
        supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(100),
        supabase.from('feedback').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(100),
      ]);

      if (bookingsResponse.error) console.error('Bookings load error', bookingsResponse.error);
      if (clientsResponse.error) console.error('Clients load error', clientsResponse.error);
      if (adminsResponse.error) console.error('Admins load error', adminsResponse.error);
      if (ordersResponse.error) console.error('Orders load error', ordersResponse.error);
      if (feedbackResponse.error) console.error('Feedback load error', feedbackResponse.error);
      if (contactsResponse.error) console.error('Contacts load error', contactsResponse.error);

      const fetchedBookings = bookingsResponse.data ?? [];
      const fetchedClients = clientsResponse.data ?? [];
      const fetchedAdmins = adminsResponse.data ?? [];
      const fetchedOrders = ordersResponse.data ?? [];
      const fetchedFeedbacks = feedbackResponse.data ?? [];
      const fetchedContacts = contactsResponse.data ?? [];

      setDbBookings(
        fetchedBookings.map((item) => ({
          id: item.id,
          clientId: item.client_id,
          clientName: item.full_name || item.email || 'Guest',
          email: item.email,
          vehicle: item.vehicle_label || 'Unknown',
          service: item.service_name || 'Service',
          date: item.preferred_date ? new Date(item.preferred_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          status: item.status,
          notes: item.notes ?? '',
        })),
      );

      setDbClients(
        fetchedClients.map((profile) => ({
          ...profile,
          name: profile.full_name || profile.email || 'Client',
          phone: profile.phone || '',
          vehicles: profile.vehicles || [],
          activeJob: profile.activeJob || {
            id: 'N/A',
            status: 'pending',
            statusLabel: 'Awaiting Approval',
            progress: 0,
            technician: 'Unassigned',
            bay: 'TBC',
            summary: 'No active job',
          },
          timeline: profile.timeline || [],
          messages: profile.messages || [],
          reportUpdates: profile.reportUpdates || [],
          invoice: profile.invoice || { id: 'INV-000', items: [] },
        })),
      );

      if (selectedClientId === 'client-1' && fetchedClients.length) {
        setSelectedClientId(fetchedClients[0].id);
      }

      setAdmins(
        fetchedAdmins.map((profile) => ({
          ...profile,
          name: profile.full_name || profile.email || 'Admin',
        })),
      );

      setOrders(
        fetchedOrders.map((order) => ({
          id: order.id,
          client: order.customer_name || order.customer_email || 'Client',
          email: order.customer_email || '',
          items: (order.order_items ?? []).map((item) => item.product_name),
          total: Number(order.total_amount ?? 0),
          status: order.status,
          date: order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
        })),
      );

      setFeedbacks(
        fetchedFeedbacks.map((item) => ({
          id: item.id,
          client: item.name || item.email || 'Client',
          rating: item.rating ?? 0,
          channel: item.channel,
          status: item.status,
          message: item.message,
          date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
        })),
      );

      setContacts(
        fetchedContacts.map((item) => ({
          id: item.id,
          name: item.name,
          phone: item.phone || '',
          email: item.email || '',
          subject: item.subject || item.vehicle_or_service || 'Inquiry',
          status: item.status,
          date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
        })),
      );

      setIsAdminLoading(false);
    };

    loadAdminData();
  }, []);

  const bookings = dbBookings.length ? dbBookings : state.bookings;
  const clients = dbClients.length ? dbClients : state.clients;
  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0] || state.clients[0];
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const activeJobs = clients.filter((c) => c.activeJob?.status === 'in_progress').length;
  const openLeads = contacts.filter((item) => item.status === 'new').length;

  const stats = useMemo(() => {
    const invoiceTotal = state.clients.reduce((sum, client) => sum + calcInvoiceTotals(client.invoice.items).total, 0);
    const orderTotal = orders.reduce((sum, order) => sum + order.total, 0);
    return {
      revenue: invoiceTotal + orderTotal,
      avgRating: feedbacks.length ? (feedbacks.reduce((sum, item) => sum + item.rating, 0) / feedbacks.length).toFixed(1) : '0.0',
      stockValue: managedProducts.reduce((sum, product) => sum + product.price * product.stock, 0),
    };
  }, [feedbacks, managedProducts, orders, state.clients]);

  const updateClient = (clientId, updater) => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.map((client) => (client.id === clientId ? updater(client) : client)),
    }));
  };

  const approveBooking = (bookingId) => {
    const booking = state.bookings.find((item) => item.id === bookingId);
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((item) => (item.id === bookingId ? { ...item, status: 'approved' } : item)),
    }));
    if (!booking) return;
    updateClient(booking.clientId, (client) => ({
      ...client,
      activeJob: {
        ...client.activeJob,
        service: booking.service,
        status: 'scheduled',
        statusLabel: 'Scheduled',
        progress: 5,
        estimatedCompletion: 'TBC',
        technician: 'Grace Achieng',
        bay: 'Bay 2',
        summary: booking.notes,
      },
      timeline: [
        { id: Date.now(), title: 'Booking approved', desc: `Admin approved ${booking.service}.`, date: nowLabel(), done: true, current: true },
        ...client.timeline.filter((step) => step.title !== 'Booking submitted'),
      ],
    }));
  };

  const rejectBooking = (bookingId) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((item) => (item.id === bookingId ? { ...item, status: 'rejected' } : item)),
    }));
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (!msgDraft.trim() || !selectedClient) return;
    updateClient(selectedClient.id, (client) => ({
      ...client,
      messages: [
        ...client.messages,
        { id: Date.now(), from: 'workshop', sender: 'Admin', role: 'Workshop', text: msgDraft.trim(), time: nowLabel(), read: false },
      ],
    }));
    setMsgDraft('');
  };

  const addReport = (event) => {
    event.preventDefault();
    if (!reportDraft.title.trim() || !reportDraft.body.trim()) return;
    updateClient(selectedClient.id, (client) => ({
      ...client,
      reportUpdates: [
        { id: Date.now(), date: nowLabel(), author: 'Admin', title: reportDraft.title.trim(), body: reportDraft.body.trim() },
        ...client.reportUpdates,
      ],
    }));
    setReportDraft({ title: '', body: '' });
  };

  const updateJob = (field, value) => {
    updateClient(selectedClient.id, (client) => ({
      ...client,
      activeJob: {
        ...client.activeJob,
        [field]: value,
        statusLabel: field === 'status'
          ? { in_progress: 'In Progress', scheduled: 'Scheduled', complete: 'Complete', pending: 'Awaiting Approval' }[value] || client.activeJob.statusLabel
          : client.activeJob.statusLabel,
      },
    }));
  };

  const updateTimelineStep = (stepId, field, value) => {
    updateClient(selectedClient.id, (client) => ({
      ...client,
      timeline: client.timeline.map((step) => (step.id === stepId ? { ...step, [field]: value } : step)),
    }));
  };

  const updateInvoiceItem = (itemId, field, value) => {
    updateClient(selectedClient.id, (client) => ({
      ...client,
      invoice: {
        ...client.invoice,
        items: client.invoice.items.map((item) =>
          item.id === itemId ? { ...item, [field]: field === 'unitPrice' || field === 'qty' ? Number(value) || 0 : value } : item,
        ),
      },
    }));
  };

  const addInvoiceItem = (event) => {
    event.preventDefault();
    if (!newInvoiceItem.description.trim()) return;
    updateClient(selectedClient.id, (client) => ({
      ...client,
      invoice: {
        ...client.invoice,
        items: [
          ...client.invoice.items,
          {
            id: Date.now(),
            type: newInvoiceItem.type,
            description: newInvoiceItem.description.trim(),
            qty: Number(newInvoiceItem.qty) || 1,
            unitPrice: Number(newInvoiceItem.unitPrice) || 0,
            added: true,
          },
        ],
      },
    }));
    setNewInvoiceItem({ description: '', type: 'service', unitPrice: '', qty: 1 });
  };

  const invoiceTotals = useMemo(() => calcInvoiceTotals(selectedClient?.invoice.items || []), [selectedClient]);

  const badgeMap = {
    bookings: dbBookings.length || pendingBookings.length,
    orders: orders.filter((item) => item.status !== 'completed').length,
    feedbacks: feedbacks.filter((item) => item.status === 'new').length,
    contacts: openLeads,
    clients: dbClients.length || state.clients.length,
    admins: admins.length,
  };

  const needsClientPicker = ['repairs', 'reports', 'messages', 'invoices'].includes(view);

  return (
    <div className="admin-layout admin-layout--app finance-admin">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__head">
          <span className="admin-logo"><i className="fa-solid fa-shield-halved"></i> Dr. Animal</span>
          <span className="admin-sidebar__sub">Operations dashboard</span>
        </div>
        <nav className="admin-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-nav-item ${view === item.id ? 'active' : ''}`}
              onClick={() => setView(item.id)}
            >
              <i className={item.icon}></i>
              {item.label}
              {badgeMap[item.id] > 0 && <span className="admin-nav-badge">{badgeMap[item.id]}</span>}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-card">
          <span>Today</span>
          <strong>{pendingBookings.length + openLeads} new actions</strong>
          <button type="button" onClick={() => setView('bookings')}>Review queue</button>
        </div>
      </aside>

      <div className="admin-content">
        <TopBar view={view} />
        {needsClientPicker && <ClientPicker clients={state.clients} selectedId={selectedClientId} onSelect={setSelectedClientId} />}

        {view === 'overview' && (
          <Overview
            stats={stats}
            clients={clients}
            bookings={bookings}
            products={managedProducts}
            orders={orders}
            feedbacks={feedbacks}
            contacts={contacts}
            activeJobs={activeJobs}
            pendingBookings={pendingBookings.length}
            onNavigate={setView}
          />
        )}
        {view === 'bookings' && <Bookings bookings={dbBookings.length ? dbBookings : state.bookings} onApprove={approveBooking} onReject={rejectBooking} />}
        {view === 'orders' && <Orders orders={orders} setOrders={setOrders} />}
        {view === 'products' && <ProductsManager products={managedProducts} setProducts={setManagedProducts} />}
        {view === 'clients' && <Clients clients={state.clients} onSelect={(id) => { setSelectedClientId(id); setView('repairs'); }} />}
        {view === 'repairs' && <Repairs client={selectedClient} onUpdateJob={updateJob} onUpdateTimeline={updateTimelineStep} />}
        {view === 'feedbacks' && <Feedbacks feedbacks={feedbacks} setFeedbacks={setFeedbacks} />}
        {view === 'contacts' && <Contacts contacts={contacts} setContacts={setContacts} />}
        {view === 'admins' && <Admins admins={admins} />}
        {view === 'reports' && <Reports client={selectedClient} draft={reportDraft} setDraft={setReportDraft} onAdd={addReport} />}
        {view === 'messages' && <Messages client={selectedClient} draft={msgDraft} setDraft={setMsgDraft} onSend={sendMessage} />}
        {view === 'invoices' && (
          <Invoices
            client={selectedClient}
            totals={invoiceTotals}
            newItem={newInvoiceItem}
            setNewItem={setNewInvoiceItem}
            onUpdate={updateInvoiceItem}
            onToggle={(itemId) => updateClient(selectedClient.id, (client) => ({
              ...client,
              invoice: { ...client.invoice, items: client.invoice.items.map((item) => item.id === itemId ? { ...item, added: !item.added } : item) },
            }))}
            onAdd={addInvoiceItem}
            onRemove={(itemId) => updateClient(selectedClient.id, (client) => ({
              ...client,
              invoice: { ...client.invoice, items: client.invoice.items.filter((item) => item.id !== itemId) },
            }))}
          />
        )}
      </div>
    </div>
  );
}

function TopBar({ view }) {
  const titles = {
    overview: 'Good morning, Admin',
    bookings: 'Booking Queue',
    orders: 'Product Orders',
    products: 'Product Catalog',
    clients: 'Clients',
    admins: 'Admin Users',
    repairs: 'Repair Workflow',
    feedbacks: 'Customer Feedback',
    contacts: 'Contact Leads',
    reports: 'Client Reports',
    messages: 'Messages',
    invoices: 'Invoices',
  };

  return (
    <header className="admin-topbar">
      <div>
        <p>Doctor Animal Auto Tune</p>
        <h1>{titles[view]}</h1>
      </div>
      <div className="admin-topbar__tools">
        <label className="admin-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="search" placeholder="Search records" />
        </label>
        <button type="button" className="admin-icon-btn" aria-label="Notifications"><i className="fa-regular fa-bell"></i></button>
        <div className="admin-avatar">AD</div>
      </div>
    </header>
  );
}

function ClientPicker({ clients, selectedId, onSelect }) {
  return (
    <div className="admin-client-picker">
      <label htmlFor="admin-client-select">Managing client</label>
      <select id="admin-client-select" value={selectedId} onChange={(event) => onSelect(event.target.value)}>
        {clients.map((client) => <option key={client.id} value={client.id}>{client.name} - {client.email}</option>)}
      </select>
    </div>
  );
}

function Overview({ stats, clients, bookings, products, orders, feedbacks, contacts, activeJobs, pendingBookings, onNavigate }) {
  const categoryCount = new Set(products.map((product) => product.cat)).size;

  return (
    <>
      <section className="admin-hero-panel">
        <div>
          <span>Workshop pulse</span>
          <h2>KES {stats.revenue.toLocaleString()}</h2>
          <p>Combined open invoices and product orders.</p>
          <div className="admin-hero-actions">
            <button type="button" className="btn-primary" onClick={() => onNavigate('bookings')}>Bookings</button>
            <button type="button" className="btn-outline" onClick={() => onNavigate('orders')}>Orders</button>
          </div>
        </div>
        <div className="admin-hero-chart" aria-hidden="true">
          {[46, 60, 52, 76, 66, 88, 72, 94].map((height, index) => <i key={height + index} style={{ height: `${height}%` }}></i>)}
        </div>
      </section>

      <div className="metric-grid admin-metric-grid">
        <Metric icon="fa-solid fa-calendar-days" label="Pending Bookings" value={pendingBookings} tone="purple" />
        <Metric icon="fa-solid fa-screwdriver-wrench" label="Active Repairs" value={activeJobs} tone="blue" />
        <Metric icon="fa-solid fa-star" label="Avg. Rating" value={stats.avgRating} tone="orange" />
        <Metric icon="fa-solid fa-box" label="Stock Value" value={`KES ${stats.stockValue.toLocaleString()}`} tone="green" />
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-card admin-chart-card">
          <CardTitle icon="fa-solid fa-chart-area" title="Service Analytics" action="Monthly" />
          <div className="admin-line-chart" aria-hidden="true">
            <svg viewBox="0 0 600 220" role="img">
              <path d="M0 160 C70 120 80 78 145 100 C205 122 215 34 285 70 C345 102 370 178 430 136 C500 88 520 62 600 92" />
              <path className="soft" d="M0 170 C80 150 110 120 170 132 C240 146 260 86 330 108 C420 138 460 184 600 128" />
            </svg>
          </div>
        </section>

        <section className="admin-card admin-donut-card">
          <CardTitle icon="fa-solid fa-gauge-high" title="Workload" action={`${categoryCount} categories`} />
          <div className="admin-donut"><span>{clients.length}</span></div>
          <div className="admin-donut-legend">
            <span><i className="legend-dot blue"></i> Clients</span>
            <span><i className="legend-dot red"></i> Jobs</span>
            <span><i className="legend-dot yellow"></i> Orders</span>
          </div>
        </section>

        <section className="admin-card">
          <CardTitle icon="fa-solid fa-bolt" title="Recent Activity" action="Live" />
          <div className="admin-activity">
            {[
              `${bookings[0]?.clientName} booking ${bookings[0]?.status}`,
              `${orders[0]?.id} awaiting product pickup`,
              `${feedbacks[0]?.client} left ${feedbacks[0]?.rating} stars`,
              `${contacts[0]?.name} requested a quote`,
            ].map((item, index) => (
              <div className="admin-activity-row" key={item}>
                <i className={`fa-solid ${index === 0 ? 'fa-calendar-check' : index === 1 ? 'fa-bag-shopping' : index === 2 ? 'fa-star' : 'fa-envelope'}`}></i>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card admin-wide">
          <CardTitle icon="fa-solid fa-list-check" title="Order Status" action="Latest month" />
          <CompactTable
            headers={['Order', 'Customer', 'Items', 'Total', 'Status']}
            rows={orders.map((order) => [order.id, order.client, `${order.items.length} item(s)`, `KES ${order.total.toLocaleString()}`, <StatusTag status={order.status} />])}
          />
        </section>
      </div>
    </>
  );
}

function Metric({ icon, label, value, tone }) {
  return (
    <div className={`metric-card admin-stat admin-stat--${tone}`}>
      <i className={icon}></i>
      <div>
        <div className="metric-val">{value}</div>
        <div className="metric-label">{label}</div>
      </div>
    </div>
  );
}

function CardTitle({ icon, title, action }) {
  return (
    <div className="admin-card-title">
      <h3><i className={icon}></i> {title}</h3>
      {action && <span>{action}</span>}
    </div>
  );
}

function CompactTable({ headers, rows }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`}>{row.map((cell, index) => <td key={`${row[0]}-${headers[index]}`}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Bookings({ bookings, onApprove, onReject }) {
  return (
    <section className="admin-card">
      <CardTitle icon="fa-solid fa-calendar-check" title="Bookings" action={`${bookings.length} requests`} />
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Client</th><th>Vehicle</th><th>Service</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td><strong>{booking.clientName}</strong><span className="admin-cell-sub">{booking.email}</span></td>
                <td>{booking.vehicle}</td>
                <td>{booking.service}</td>
                <td>{booking.date}</td>
                <td><StatusTag status={booking.status} /></td>
                <td>
                  {booking.status === 'pending' ? (
                    <div className="admin-actions">
                      <button type="button" className="action-btn success" onClick={() => onApprove(booking.id)}>Approve</button>
                      <button type="button" className="action-btn danger" onClick={() => onReject(booking.id)}>Reject</button>
                    </div>
                  ) : <span className="admin-cell-sub">Closed</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Orders({ orders, setOrders }) {
  const updateStatus = (id, status) => {
    setOrders((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  return (
    <section className="admin-card">
      <CardTitle icon="fa-solid fa-bag-shopping" title="Product Orders" action="Manage fulfillment" />
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Order</th><th>Client</th><th>Products</th><th>Date</th><th>Total</th><th>Status</th><th>Update</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td><strong>{order.client}</strong><span className="admin-cell-sub">{order.email}</span></td>
                <td>{order.items.join(', ')}</td>
                <td>{order.date}</td>
                <td>KES {order.total.toLocaleString()}</td>
                <td><StatusTag status={order.status} /></td>
                <td>
                  <select className="admin-inline-input" value={order.status} onChange={(event) => updateStatus(order.id, event.target.value)}>
                    <option value="processing">Processing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ProductsManager({ products, setProducts }) {
  const updateProduct = (id, field, value) => {
    setProducts((items) => items.map((item) => (item.id === id ? { ...item, [field]: field === 'price' || field === 'stock' ? Number(value) || 0 : value } : item)));
  };

  return (
    <section className="admin-card">
      <CardTitle icon="fa-solid fa-boxes-stacked" title="Products" action="Update catalog details" />
      <div className="admin-table-wrap">
        <table className="admin-table admin-products-table">
          <thead><tr><th>Product</th><th>Make</th><th>Category</th><th>Price</th><th>Stock</th><th>Visible</th></tr></thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="admin-product-cell">
                    <img src={product.image} alt="" />
                    <input className="admin-inline-input" value={product.name} onChange={(event) => updateProduct(product.id, 'name', event.target.value)} />
                  </div>
                </td>
                <td><input className="admin-inline-input" value={product.make} onChange={(event) => updateProduct(product.id, 'make', event.target.value)} /></td>
                <td><input className="admin-inline-input" value={product.cat} onChange={(event) => updateProduct(product.id, 'cat', event.target.value)} /></td>
                <td><input className="admin-inline-input admin-inline-input--sm" type="number" value={product.price} onChange={(event) => updateProduct(product.id, 'price', event.target.value)} /></td>
                <td><input className="admin-inline-input admin-inline-input--sm" type="number" value={product.stock} onChange={(event) => updateProduct(product.id, 'stock', event.target.value)} /></td>
                <td>
                  <label className="admin-switch">
                    <input type="checkbox" checked={product.visible} onChange={(event) => updateProduct(product.id, 'visible', event.target.checked)} />
                    <span></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Clients({ clients, onSelect }) {
  return (
    <section className="admin-card">
      <CardTitle icon="fa-solid fa-users" title="Clients" action={`${clients.length} profiles`} />
      <div className="admin-client-cards">
        {clients.map((client) => (
          <article key={client.id} className="admin-client-card">
            <header>
              <div className="admin-avatar">{client.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
              <div>
                <h3>{client.name}</h3>
                <p>{client.email}</p>
              </div>
            </header>
            <div className="admin-detail-rows">
              <div><span>Phone</span><strong>{client.phone || 'N/A'}</strong></div>
              <div><span>Vehicles</span><strong>{client.vehicles?.length ?? 0}</strong></div>
              <div><span>Active job</span><strong>{client.activeJob?.id || 'N/A'}</strong></div>
            </div>
            <button type="button" className="btn-outline" onClick={() => onSelect(client.id)}>Manage repair</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Admins({ admins }) {
  return (
    <section className="admin-card">
      <CardTitle icon="fa-solid fa-user-shield" title="Admins" action={`${admins.length} users`} />
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.role || 'admin'}</td>
                <td>{admin.created_at ? new Date(admin.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Repairs({ client, onUpdateJob, onUpdateTimeline }) {
  const job = client.activeJob;
  return (
    <>
      <section className="admin-card admin-card--mb">
        <CardTitle icon="fa-solid fa-sliders" title={`${job.id} - ${job.vehicleLabel}`} action={<StatusTag status={job.status} label={job.statusLabel} />} />
        <div className="admin-form-grid">
          <div className="form-group"><label>Status</label><select value={job.status} onChange={(event) => onUpdateJob('status', event.target.value)}><option value="pending">Pending</option><option value="scheduled">Scheduled</option><option value="in_progress">In Progress</option><option value="complete">Complete</option></select></div>
          <div className="form-group"><label>Progress (%)</label><input type="number" min="0" max="100" value={job.progress} onChange={(event) => onUpdateJob('progress', Number(event.target.value))} /></div>
          <div className="form-group"><label>Technician</label><select value={job.technician} onChange={(event) => onUpdateJob('technician', event.target.value)}>{technicians.map((tech) => <option key={tech} value={tech}>{tech}</option>)}<option value="Unassigned">Unassigned</option></select></div>
          <div className="form-group"><label>Bay</label><input type="text" value={job.bay} onChange={(event) => onUpdateJob('bay', event.target.value)} /></div>
          <div className="form-group admin-form-full"><label>Summary</label><textarea rows={3} value={job.summary} onChange={(event) => onUpdateJob('summary', event.target.value)} /></div>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${job.progress}%` }}></div></div>
      </section>
      <section className="admin-card">
        <CardTitle icon="fa-solid fa-list-check" title="Timeline Steps" />
        <div className="admin-timeline-edit">
          {client.timeline.map((step) => (
            <div className="admin-timeline-row" key={step.id}>
              <input type="text" value={step.title} onChange={(event) => onUpdateTimeline(step.id, 'title', event.target.value)} />
              <input type="text" value={step.desc} onChange={(event) => onUpdateTimeline(step.id, 'desc', event.target.value)} />
              <label className="admin-check"><input type="checkbox" checked={step.done} onChange={(event) => onUpdateTimeline(step.id, 'done', event.target.checked)} /> Done</label>
              <label className="admin-check"><input type="checkbox" checked={!!step.current} onChange={(event) => onUpdateTimeline(step.id, 'current', event.target.checked)} /> Current</label>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Feedbacks({ feedbacks, setFeedbacks }) {
  const updateStatus = (id, status) => {
    setFeedbacks((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
  };
  return (
    <section className="admin-card">
      <CardTitle icon="fa-solid fa-star-half-stroke" title="Feedbacks" action="Voice of customer" />
      <div className="admin-feedback-grid">
        {feedbacks.map((item) => (
          <article className="admin-feedback-card" key={item.id}>
            <header><strong>{item.client}</strong><StatusTag status={item.status} /></header>
            <div className="admin-stars">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</div>
            <p>{item.message}</p>
            <footer>
              <span>{item.channel} - {item.date}</span>
              <select value={item.status} onChange={(event) => updateStatus(item.id, event.target.value)}>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
              </select>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contacts({ contacts, setContacts }) {
  const updateStatus = (id, status) => {
    setContacts((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
  };
  return (
    <section className="admin-card">
      <CardTitle icon="fa-solid fa-address-book" title="Contact Leads" action="Collected from contact page" />
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Name</th><th>Contact</th><th>Request</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {contacts.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td><strong>{item.phone}</strong><span className="admin-cell-sub">{item.email}</span></td>
                <td>{item.subject}</td>
                <td>{item.date}</td>
                <td>
                  <select className="admin-inline-input" value={item.status} onChange={(event) => updateStatus(item.id, event.target.value)}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Reports({ client, draft, setDraft, onAdd }) {
  return (
    <div className="admin-grid-2">
      <section className="admin-card">
        <CardTitle icon="fa-solid fa-plus" title="New Report Update" action={client.name} />
        <form onSubmit={onAdd}>
          <div className="form-group"><label>Title</label><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required /></div>
          <div className="form-group"><label>Report body</label><textarea rows={5} value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} required /></div>
          <button type="submit" className="btn-primary"><i className="fa-solid fa-paper-plane"></i> Publish update</button>
        </form>
      </section>
      <section className="admin-card">
        <CardTitle icon="fa-solid fa-clock-rotate-left" title="Published Reports" />
        <div className="report-feed">
          {client.reportUpdates.map((report) => (
            <article className="report-feed__item" key={report.id}>
              <header><strong>{report.title}</strong><span>{report.date}</span></header>
              <p>{report.body}</p>
              <footer>{report.author}</footer>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Messages({ client, draft, setDraft, onSend }) {
  return (
    <section className="portal-messages admin-messages admin-card">
      <CardTitle icon="fa-solid fa-comments" title={`Conversation with ${client.name}`} />
      <div className="portal-messages__thread">
        {client.messages.map((msg) => (
          <div key={msg.id} className={`portal-msg portal-msg--${msg.from}`}>
            <div className="portal-msg__avatar"><i className={msg.from === 'workshop' ? 'fa-solid fa-wrench' : 'fa-solid fa-user'}></i></div>
            <div className="portal-msg__bubble">
              <header><strong>{msg.sender}</strong>{msg.role && <span>{msg.role}</span>}<time>{msg.time}</time></header>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <form className="portal-messages__compose" onSubmit={onSend}>
        <input type="text" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message ${client.name}`} />
        <button type="submit" className="btn-primary"><i className="fa-solid fa-paper-plane"></i> Send</button>
      </form>
    </section>
  );
}

function Invoices({ client, totals, newItem, setNewItem, onToggle, onUpdate, onAdd, onRemove }) {
  const inv = client.invoice;
  return (
    <>
      <section className="admin-card admin-card--mb">
        <CardTitle icon="fa-solid fa-plus" title={`Invoice ${inv.id}`} action={client.name} />
        <form className="admin-invoice-add" onSubmit={onAdd}>
          <select value={newItem.type} onChange={(event) => setNewItem({ ...newItem, type: event.target.value })}><option value="service">Service</option><option value="part">Part</option></select>
          <input type="text" placeholder="Description" value={newItem.description} onChange={(event) => setNewItem({ ...newItem, description: event.target.value })} required />
          <input type="number" placeholder="Qty" min="1" value={newItem.qty} onChange={(event) => setNewItem({ ...newItem, qty: event.target.value })} />
          <input type="number" placeholder="Unit price" min="0" value={newItem.unitPrice} onChange={(event) => setNewItem({ ...newItem, unitPrice: event.target.value })} />
          <button type="submit" className="btn-primary">Add</button>
        </form>
      </section>
      <section className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Billed</th><th>Type</th><th>Description</th><th>Qty</th><th>Unit</th><th>Total</th><th></th></tr></thead>
            <tbody>
              {inv.items.map((item) => (
                <tr key={item.id}>
                  <td><input type="checkbox" checked={item.added} onChange={() => onToggle(item.id)} /></td>
                  <td>{item.type}</td>
                  <td><input className="admin-inline-input" type="text" value={item.description} onChange={(event) => onUpdate(item.id, 'description', event.target.value)} /></td>
                  <td><input className="admin-inline-input admin-inline-input--sm" type="number" min="1" value={item.qty} onChange={(event) => onUpdate(item.id, 'qty', event.target.value)} /></td>
                  <td><input className="admin-inline-input admin-inline-input--sm" type="number" min="0" value={item.unitPrice} onChange={(event) => onUpdate(item.id, 'unitPrice', event.target.value)} /></td>
                  <td>KES {(item.qty * item.unitPrice).toLocaleString()}</td>
                  <td><button type="button" className="action-btn danger" onClick={() => onRemove(item.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="portal-invoice-totals admin-invoice-totals">
          <div className="portal-invoice-totals__row"><span>Subtotal</span><strong>KES {totals.subtotal.toLocaleString()}</strong></div>
          <div className="portal-invoice-totals__row"><span>VAT (16%)</span><strong>KES {totals.vat.toLocaleString()}</strong></div>
          <div className="portal-invoice-totals__row portal-invoice-totals__row--total"><span>Running total</span><span className="total-amount">KES {totals.total.toLocaleString()}</span></div>
        </div>
      </section>
    </>
  );
}

function StatusTag({ status, label }) {
  const map = {
    pending: { cls: 'status-pending', text: label || 'Pending' },
    approved: { cls: 'status-complete', text: label || 'Approved' },
    rejected: { cls: 'status-rejected', text: 'Rejected' },
    in_progress: { cls: 'status-progress', text: label || 'In Progress' },
    scheduled: { cls: 'status-progress', text: label || 'Scheduled' },
    complete: { cls: 'status-complete', text: label || 'Complete' },
    completed: { cls: 'status-complete', text: 'Completed' },
    processing: { cls: 'status-progress', text: 'Processing' },
    ready: { cls: 'status-ready', text: 'Ready' },
    cancelled: { cls: 'status-rejected', text: 'Cancelled' },
    new: { cls: 'status-pending', text: 'New' },
    reviewed: { cls: 'status-progress', text: 'Reviewed' },
    resolved: { cls: 'status-complete', text: 'Resolved' },
    contacted: { cls: 'status-progress', text: 'Contacted' },
    converted: { cls: 'status-complete', text: 'Converted' },
    closed: { cls: 'status-rejected', text: 'Closed' },
    draft: { cls: 'status-pending', text: label || 'Draft' },
  };
  const current = map[status] || map.pending;
  return <span className={`status-badge ${current.cls}`}>{current.text}</span>;
}

export default AdminDashboard;
