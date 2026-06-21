import React, { useMemo, useState } from 'react';
import {
  getInitialAdminState,
  calcInvoiceTotals,
  nowLabel,
  technicians,
  serviceOptions,
} from '../data/adminData';

const NAV = [
  { id: 'overview', label: 'Overview', icon: 'fa-solid fa-chart-pie' },
  { id: 'bookings', label: 'Bookings', icon: 'fa-solid fa-calendar-check' },
  { id: 'clients', label: 'Clients', icon: 'fa-solid fa-users' },
  { id: 'repairs', label: 'Repairs', icon: 'fa-solid fa-wrench' },
  { id: 'reports', label: 'Reports', icon: 'fa-solid fa-file-lines' },
  { id: 'messages', label: 'Messages', icon: 'fa-solid fa-comments' },
  { id: 'invoices', label: 'Invoices', icon: 'fa-solid fa-file-invoice-dollar' },
  { id: 'inventory', label: 'Inventory', icon: 'fa-solid fa-boxes-stacked' },
];

function AdminDashboard({ products }) {
  const [view, setView] = useState('overview');
  const [state, setState] = useState(getInitialAdminState);
  const [selectedClientId, setSelectedClientId] = useState('client-1');
  const [msgDraft, setMsgDraft] = useState('');
  const [reportDraft, setReportDraft] = useState({ title: '', body: '' });
  const [newInvoiceItem, setNewInvoiceItem] = useState({
    description: '',
    type: 'service',
    unitPrice: '',
    qty: 1,
  });

  const selectedClient = state.clients.find((c) => c.id === selectedClientId) || state.clients[0];
  const pendingBookings = state.bookings.filter((b) => b.status === 'pending');
  const activeJobs = state.clients.filter((c) => c.activeJob.status === 'in_progress').length;

  const updateClient = (clientId, updater) => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.map((c) => (c.id === clientId ? updater(c) : c)),
    }));
  };

  const approveBooking = (bookingId) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'approved' } : b,
      ),
    }));
    const booking = state.bookings.find((b) => b.id === bookingId);
    if (!booking) return;
    updateClient(booking.clientId, (c) => ({
      ...c,
      activeJob: {
        ...c.activeJob,
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
        { id: 1, title: 'Booking approved', desc: `Admin approved ${booking.service}.`, date: nowLabel(), done: true, current: true },
        ...c.timeline.filter((t) => t.title !== 'Booking submitted'),
      ],
    }));
  };

  const rejectBooking = (bookingId) => {
    setState((prev) => ({
      ...prev,
      bookings: prev.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'rejected' } : b,
      ),
    }));
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!msgDraft.trim() || !selectedClient) return;
    updateClient(selectedClient.id, (c) => ({
      ...c,
      messages: [
        ...c.messages,
        {
          id: c.messages.length + 1,
          from: 'workshop',
          sender: 'Admin',
          role: 'Workshop',
          text: msgDraft.trim(),
          time: nowLabel(),
          read: false,
        },
      ],
    }));
    setMsgDraft('');
  };

  const addReport = (e) => {
    e.preventDefault();
    if (!reportDraft.title.trim() || !reportDraft.body.trim()) return;
    updateClient(selectedClient.id, (c) => ({
      ...c,
      reportUpdates: [
        {
          id: c.reportUpdates.length + 1,
          date: nowLabel(),
          author: 'Admin',
          title: reportDraft.title.trim(),
          body: reportDraft.body.trim(),
        },
        ...c.reportUpdates,
      ],
    }));
    setReportDraft({ title: '', body: '' });
  };

  const updateJob = (field, value) => {
    updateClient(selectedClient.id, (c) => ({
      ...c,
      activeJob: {
        ...c.activeJob,
        [field]: value,
        statusLabel:
          field === 'status'
            ? { in_progress: 'In Progress', scheduled: 'Scheduled', complete: 'Complete', pending: 'Awaiting Approval' }[value] || c.activeJob.statusLabel
            : c.activeJob.statusLabel,
      },
    }));
  };

  const updateTimelineStep = (stepId, field, value) => {
    updateClient(selectedClient.id, (c) => ({
      ...c,
      timeline: c.timeline.map((t) => (t.id === stepId ? { ...t, [field]: value } : t)),
    }));
  };

  const toggleInvoiceItem = (itemId) => {
    updateClient(selectedClient.id, (c) => ({
      ...c,
      invoice: {
        ...c.invoice,
        items: c.invoice.items.map((i) =>
          i.id === itemId ? { ...i, added: !i.added } : i,
        ),
      },
    }));
  };

  const updateInvoiceItem = (itemId, field, value) => {
    updateClient(selectedClient.id, (c) => ({
      ...c,
      invoice: {
        ...c.invoice,
        items: c.invoice.items.map((i) =>
          i.id === itemId ? { ...i, [field]: field === 'unitPrice' || field === 'qty' ? Number(value) || 0 : value } : i,
        ),
      },
    }));
  };

  const addInvoiceItem = (e) => {
    e.preventDefault();
    if (!newInvoiceItem.description.trim()) return;
    updateClient(selectedClient.id, (c) => ({
      ...c,
      invoice: {
        ...c.invoice,
        items: [
          ...c.invoice.items,
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

  const removeInvoiceItem = (itemId) => {
    updateClient(selectedClient.id, (c) => ({
      ...c,
      invoice: {
        ...c.invoice,
        items: c.invoice.items.filter((i) => i.id !== itemId),
      },
    }));
  };

  const invoiceTotals = useMemo(
    () => calcInvoiceTotals(selectedClient?.invoice.items || []),
    [selectedClient],
  );

  return (
    <div className="admin-layout admin-layout--app">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__head">
          <span className="admin-logo">Admin Panel</span>
          <span className="admin-sidebar__sub">Doctor Animal Auto</span>
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
              {item.id === 'bookings' && pendingBookings.length > 0 && (
                <span className="admin-nav-badge">{pendingBookings.length}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      <div className="admin-content">
        {view !== 'overview' && view !== 'bookings' && view !== 'inventory' && (
          <ClientPicker
            clients={state.clients}
            selectedId={selectedClientId}
            onSelect={setSelectedClientId}
          />
        )}

        {view === 'overview' && (
          <Overview
            clients={state.clients}
            bookings={state.bookings}
            products={products}
            activeJobs={activeJobs}
            pendingBookings={pendingBookings.length}
            onNavigate={setView}
          />
        )}
        {view === 'bookings' && (
          <Bookings
            bookings={state.bookings}
            onApprove={approveBooking}
            onReject={rejectBooking}
          />
        )}
        {view === 'clients' && <Clients client={selectedClient} />}
        {view === 'repairs' && (
          <Repairs
            client={selectedClient}
            onUpdateJob={updateJob}
            onUpdateTimeline={updateTimelineStep}
          />
        )}
        {view === 'reports' && (
          <Reports
            client={selectedClient}
            draft={reportDraft}
            setDraft={setReportDraft}
            onAdd={addReport}
          />
        )}
        {view === 'messages' && (
          <Messages
            client={selectedClient}
            draft={msgDraft}
            setDraft={setMsgDraft}
            onSend={sendMessage}
          />
        )}
        {view === 'invoices' && (
          <Invoices
            client={selectedClient}
            totals={invoiceTotals}
            newItem={newInvoiceItem}
            setNewItem={setNewInvoiceItem}
            onToggle={toggleInvoiceItem}
            onUpdate={updateInvoiceItem}
            onAdd={addInvoiceItem}
            onRemove={removeInvoiceItem}
          />
        )}
        {view === 'inventory' && <Inventory products={products} />}
      </div>
    </div>
  );
}

function ClientPicker({ clients, selectedId, onSelect }) {
  return (
    <div className="admin-client-picker">
      <label htmlFor="admin-client-select">Managing client</label>
      <select
        id="admin-client-select"
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
      >
        {clients.map((c) => (
          <option key={c.id} value={c.id}>{c.name} · {c.email}</option>
        ))}
      </select>
    </div>
  );
}

function Overview({ clients, bookings, products, activeJobs, pendingBookings, onNavigate }) {
  const approved = bookings.filter((b) => b.status === 'approved').length;
  const revenue = clients.reduce((sum, c) => {
    const { total } = calcInvoiceTotals(c.invoice.items);
    return sum + total;
  }, 0);

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1 className="admin-title">Dashboard Overview</h1>
          <p className="admin-sub">Workshop operations at a glance.</p>
        </div>
      </header>
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-val">{clients.length}</div>
          <div className="metric-label">Registered Clients</div>
        </div>
        <div className="metric-card">
          <div className="metric-val">{pendingBookings}</div>
          <div className="metric-label">Pending Bookings</div>
        </div>
        <div className="metric-card">
          <div className="metric-val">{activeJobs}</div>
          <div className="metric-label">Active Repairs</div>
        </div>
        <div className="metric-card metric-card--accent">
          <div className="metric-val">KES {revenue.toLocaleString()}</div>
          <div className="metric-label">Open Invoices</div>
        </div>
      </div>
      <div className="admin-grid-2">
        <div className="info-card admin-card">
          <h3><i className="fa-solid fa-calendar"></i> Recent Bookings</h3>
          <table className="admin-table admin-table--compact">
            <thead>
              <tr><th>Client</th><th>Service</th><th>Status</th></tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id}>
                  <td>{b.clientName}</td>
                  <td>{b.service}</td>
                  <td><StatusTag status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="btn-outline admin-card__link" onClick={() => onNavigate('bookings')}>
            Manage bookings <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <div className="info-card admin-card">
          <h3><i className="fa-solid fa-users"></i> Active Clients</h3>
          <ul className="admin-client-summary">
            {clients.map((c) => (
              <li key={c.id}>
                <strong>{c.name}</strong>
                <span>{c.activeJob.service}</span>
                <StatusTag status={c.activeJob.status} label={c.activeJob.statusLabel} />
              </li>
            ))}
          </ul>
          <div className="admin-stats-row">
            <span>{products.length} parts in catalog</span>
            <span>{approved} approved bookings</span>
          </div>
        </div>
      </div>
    </>
  );
}

function Bookings({ bookings, onApprove, onReject }) {
  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1 className="admin-title">Bookings</h1>
          <p className="admin-sub">Review and approve client service requests.</p>
        </div>
      </header>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Vehicle</th>
              <th>Service</th>
              <th>Date</th>
              <th>Notes</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>
                  <strong>{b.clientName}</strong>
                  <br /><span className="admin-cell-sub">{b.email}</span>
                </td>
                <td>{b.vehicle}</td>
                <td>{b.service}</td>
                <td>{b.date}</td>
                <td className="admin-cell-notes">{b.notes}</td>
                <td><StatusTag status={b.status} /></td>
                <td>
                  {b.status === 'pending' ? (
                    <div className="admin-actions">
                      <button type="button" className="action-btn success" onClick={() => onApprove(b.id)}>Approve</button>
                      <button type="button" className="action-btn danger" onClick={() => onReject(b.id)}>Reject</button>
                    </div>
                  ) : (
                    <span className="admin-cell-sub">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Clients({ client }) {
  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1 className="admin-title">{client.name}</h1>
          <p className="admin-sub">{client.email} · Member since {client.memberSince}</p>
        </div>
      </header>
      <div className="admin-grid-2">
        <div className="info-card admin-card">
          <h3><i className="fa-solid fa-address-card"></i> Contact</h3>
          <div className="admin-detail-rows">
            <div><span>Phone</span><strong>{client.phone}</strong></div>
            <div><span>Email</span><strong>{client.email}</strong></div>
            <div><span>Client ID</span><strong>{client.id}</strong></div>
          </div>
        </div>
        <div className="info-card admin-card">
          <h3><i className="fa-solid fa-briefcase"></i> Active Job</h3>
          <div className="admin-detail-rows">
            <div><span>Job ID</span><strong>{client.activeJob.id}</strong></div>
            <div><span>Service</span><strong>{client.activeJob.service}</strong></div>
            <div><span>Technician</span><strong>{client.activeJob.technician}</strong></div>
            <div><span>Bay</span><strong>{client.activeJob.bay}</strong></div>
          </div>
        </div>
      </div>
      <div className="info-card admin-card">
        <h3><i className="fa-solid fa-car"></i> Vehicles ({client.vehicles.length})</h3>
        <div className="admin-vehicle-grid">
          {client.vehicles.map((v) => (
            <div className="admin-vehicle-card" key={v.id}>
              <strong>{v.year} {v.make} {v.model}</strong>
              <span>{v.plate} · {v.color}</span>
              <span>{v.mileage} · VIN {v.vin}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Repairs({ client, onUpdateJob, onUpdateTimeline }) {
  const job = client.activeJob;

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1 className="admin-title">Repair Management</h1>
          <p className="admin-sub">{job.id} · {job.vehicleLabel}</p>
        </div>
        <StatusTag status={job.status} label={job.statusLabel} />
      </header>
      <div className="info-card admin-card admin-card--mb">
        <h3><i className="fa-solid fa-sliders"></i> Job Settings</h3>
        <div className="admin-form-grid">
          <div className="form-group">
            <label>Status</label>
            <select value={job.status} onChange={(e) => onUpdateJob('status', e.target.value)}>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="complete">Complete</option>
            </select>
          </div>
          <div className="form-group">
            <label>Progress (%)</label>
            <input type="number" min="0" max="100" value={job.progress} onChange={(e) => onUpdateJob('progress', Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Technician</label>
            <select value={job.technician} onChange={(e) => onUpdateJob('technician', e.target.value)}>
              {technicians.map((t) => <option key={t} value={t}>{t}</option>)}
              <option value="Unassigned">Unassigned</option>
            </select>
          </div>
          <div className="form-group">
            <label>Bay</label>
            <input type="text" value={job.bay} onChange={(e) => onUpdateJob('bay', e.target.value)} />
          </div>
          <div className="form-group admin-form-full">
            <label>Est. completion</label>
            <input type="text" value={job.estimatedCompletion} onChange={(e) => onUpdateJob('estimatedCompletion', e.target.value)} />
          </div>
          <div className="form-group admin-form-full">
            <label>Summary</label>
            <textarea rows={3} value={job.summary} onChange={(e) => onUpdateJob('summary', e.target.value)} />
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${job.progress}%` }}></div>
        </div>
      </div>
      <div className="info-card admin-card">
        <h3><i className="fa-solid fa-list-check"></i> Timeline Steps</h3>
        {client.timeline.length === 0 ? (
          <p className="admin-empty">No timeline steps yet.</p>
        ) : (
          <div className="admin-timeline-edit">
            {client.timeline.map((step) => (
              <div className="admin-timeline-row" key={step.id}>
                <input type="text" value={step.title} onChange={(e) => onUpdateTimeline(step.id, 'title', e.target.value)} />
                <input type="text" value={step.desc} onChange={(e) => onUpdateTimeline(step.id, 'desc', e.target.value)} />
                <label className="admin-check">
                  <input type="checkbox" checked={step.done} onChange={(e) => onUpdateTimeline(step.id, 'done', e.target.checked)} />
                  Done
                </label>
                <label className="admin-check">
                  <input type="checkbox" checked={!!step.current} onChange={(e) => onUpdateTimeline(step.id, 'current', e.target.checked)} />
                  Current
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Reports({ client, draft, setDraft, onAdd }) {
  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1 className="admin-title">Progress Reports</h1>
          <p className="admin-sub">Publish updates visible to {client.name} in their portal.</p>
        </div>
      </header>
      <div className="admin-grid-2">
        <div className="info-card admin-card">
          <h3><i className="fa-solid fa-plus"></i> New Report Update</h3>
          <form onSubmit={onAdd}>
            <div className="form-group">
              <label>Title</label>
              <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Brake work completed" required />
            </div>
            <div className="form-group">
              <label>Report body</label>
              <textarea rows={5} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder="Detailed update for the client…" required />
            </div>
            <button type="submit" className="btn-primary"><i className="fa-solid fa-paper-plane"></i> Publish update</button>
          </form>
        </div>
        <div className="info-card admin-card">
          <h3><i className="fa-solid fa-clock-rotate-left"></i> Published Reports</h3>
          <div className="report-feed">
            {client.reportUpdates.length === 0 ? (
              <p className="admin-empty">No reports published yet.</p>
            ) : (
              client.reportUpdates.map((r) => (
                <article className="report-feed__item" key={r.id}>
                  <header><strong>{r.title}</strong><span>{r.date}</span></header>
                  <p>{r.body}</p>
                  <footer>{r.author}</footer>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Messages({ client, draft, setDraft, onSend }) {
  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1 className="admin-title">Messages</h1>
          <p className="admin-sub">Conversation with {client.name}</p>
        </div>
      </header>
      <div className="portal-messages admin-messages">
        <div className="portal-messages__thread">
          {client.messages.length === 0 ? (
            <p className="admin-empty">No messages yet.</p>
          ) : (
            client.messages.map((msg) => (
              <div key={msg.id} className={`portal-msg portal-msg--${msg.from}`}>
                <div className="portal-msg__avatar">
                  <i className={msg.from === 'workshop' ? 'fa-solid fa-wrench' : 'fa-solid fa-user'}></i>
                </div>
                <div className="portal-msg__bubble">
                  <header>
                    <strong>{msg.sender}</strong>
                    {msg.role && <span>{msg.role}</span>}
                    <time>{msg.time}</time>
                  </header>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <form className="portal-messages__compose" onSubmit={onSend}>
          <input type="text" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`Message ${client.name}…`} />
          <button type="submit" className="btn-primary"><i className="fa-solid fa-paper-plane"></i> Send</button>
        </form>
      </div>
    </>
  );
}

function Invoices({ client, totals, newItem, setNewItem, onToggle, onUpdate, onAdd, onRemove }) {
  const inv = client.invoice;

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1 className="admin-title">Invoice Editor</h1>
          <p className="admin-sub">{inv.id} · {inv.jobId} · {client.name}</p>
        </div>
        <span className="status-badge status-progress">{inv.statusLabel}</span>
      </header>
      <div className="info-card admin-card admin-card--mb">
        <h3><i className="fa-solid fa-plus"></i> Add Line Item</h3>
        <form className="admin-invoice-add" onSubmit={onAdd}>
          <select value={newItem.type} onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}>
            <option value="service">Service</option>
            <option value="part">Part</option>
          </select>
          <input type="text" placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} required />
          <input type="number" placeholder="Qty" min="1" value={newItem.qty} onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })} />
          <input type="number" placeholder="Unit price (KES)" min="0" value={newItem.unitPrice} onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })} />
          <button type="submit" className="btn-primary">Add</button>
        </form>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Billed</th>
              <th>Type</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit (KES)</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inv.items.length === 0 ? (
              <tr><td colSpan={7} className="admin-empty">No invoice items.</td></tr>
            ) : (
              inv.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input type="checkbox" checked={item.added} onChange={() => onToggle(item.id)} title="Include on client bill" />
                  </td>
                  <td>{item.type}</td>
                  <td>
                    <input className="admin-inline-input" type="text" value={item.description} onChange={(e) => onUpdate(item.id, 'description', e.target.value)} />
                  </td>
                  <td>
                    <input className="admin-inline-input admin-inline-input--sm" type="number" min="1" value={item.qty} onChange={(e) => onUpdate(item.id, 'qty', e.target.value)} />
                  </td>
                  <td>
                    <input className="admin-inline-input admin-inline-input--sm" type="number" min="0" value={item.unitPrice} onChange={(e) => onUpdate(item.id, 'unitPrice', e.target.value)} />
                  </td>
                  <td>KES {(item.qty * item.unitPrice).toLocaleString()}</td>
                  <td>
                    <button type="button" className="action-btn danger" onClick={() => onRemove(item.id)}>Remove</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="portal-invoice-totals admin-invoice-totals">
        <div className="portal-invoice-totals__row"><span>Subtotal (billed items)</span><strong>KES {totals.subtotal.toLocaleString()}</strong></div>
        <div className="portal-invoice-totals__row"><span>VAT (16%)</span><strong>KES {totals.vat.toLocaleString()}</strong></div>
        <div className="portal-invoice-totals__row portal-invoice-totals__row--total">
          <span>Running total</span>
          <span className="total-amount">KES {totals.total.toLocaleString()}</span>
        </div>
      </div>
    </>
  );
}

function Inventory({ products }) {
  const categories = [...new Set(products.map((p) => p.cat))];

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1 className="admin-title">Parts Inventory</h1>
          <p className="admin-sub">{products.length} products across {categories.length} categories.</p>
        </div>
      </header>
      <div className="metric-grid">
        <div className="metric-card"><div className="metric-val">{products.length}</div><div className="metric-label">Total SKUs</div></div>
        <div className="metric-card"><div className="metric-val">{categories.length}</div><div className="metric-label">Categories</div></div>
        <div className="metric-card"><div className="metric-val">KES {Math.round(products.reduce((s, p) => s + p.price, 0) / products.length).toLocaleString()}</div><div className="metric-label">Avg. Price</div></div>
        <div className="metric-card"><div className="metric-val">{products.filter((p) => p.cat === 'brakes').length}</div><div className="metric-label">Brake Parts</div></div>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Part</th><th>Make</th><th>Part No.</th><th>Category</th><th>Price (KES)</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.name}</strong><br /><span className="admin-cell-sub">{p.desc.slice(0, 60)}…</span></td>
                <td>{p.make}</td>
                <td><code>{p.partNo}</code></td>
                <td><span className="tag tag-blue">{p.cat}</span></td>
                <td>{p.price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StatusTag({ status, label }) {
  const map = {
    pending: { cls: 'status-pending', text: label || 'Pending' },
    approved: { cls: 'status-complete', text: label || 'Approved' },
    rejected: { cls: 'status-pending', text: 'Rejected' },
    in_progress: { cls: 'status-progress', text: label || 'In Progress' },
    scheduled: { cls: 'status-progress', text: label || 'Scheduled' },
    complete: { cls: 'status-complete', text: label || 'Complete' },
    draft: { cls: 'status-pending', text: label || 'Draft' },
  };
  const s = map[status] || map.pending;
  return <span className={`status-badge ${s.cls}`}>{s.text}</span>;
}

export default AdminDashboard;
