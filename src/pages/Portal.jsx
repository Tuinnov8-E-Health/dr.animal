import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingPhoto } from '../data';
import { supabase, supabaseEnabled } from '../supabaseClient';
import { getClientPortalData } from '../data/portalData';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-gauge-high' },
  { id: 'vehicles', label: 'My Vehicles', icon: 'fa-solid fa-car' },
  { id: 'products', label: 'My Products', icon: 'fa-solid fa-boxes-stacked' },
  { id: 'progress', label: 'Service Progress', icon: 'fa-solid fa-clipboard-list' },
  { id: 'invoice', label: 'Invoice', icon: 'fa-solid fa-file-invoice-dollar' },
  { id: 'book', label: 'Book Service', icon: 'fa-solid fa-calendar-plus' },
];

function Portal({ currentUser, cartItems }) {
  const [view, setView] = useState('dashboard');
  const [draft, setDraft] = useState('');
  const data = useMemo(() => getClientPortalData(currentUser), [currentUser]);
  const [vehicles, setVehicles] = useState(() => data.vehicles);
  const [orders] = useState(() => data.orderedProducts);
  const [serviceJobs] = useState(() => data.serviceJobs);
  const [messages, setMessages] = useState(data.messages);

  useEffect(() => {
    if (view === 'messages') {
      setMessages((prev) =>
        prev.map((m) => (m.from === 'workshop' ? { ...m, read: true } : m)),
      );
    }
  }, [view]);

  const unread = messages.filter((m) => m.from === 'workshop' && !m.read).length;
  const invoiceAdded = data.invoice.items.filter((i) => i.added);
  const invoicePending = data.invoice.items.filter((i) => !i.added);
  const subtotal = invoiceAdded.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  const vat = Math.round(subtotal * 0.16);
  const total = subtotal + vat;

  const sendMessage = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        from: 'client',
        sender: currentUser.name,
        text: draft.trim(),
        time: 'Just now',
        read: true,
      },
    ]);
    setDraft('');
  };

  const handleAddVehicle = (vehicle) => {
    setVehicles((prev) => [...prev, vehicle]);
  };

  return (
    <div className="portal-layout">
      <aside className="portal-sidebar">
        <div className="portal-sidebar__head">
          <span className="portal-sidebar__label">Client Portal</span>
          <strong>{currentUser.name}</strong>
          <span className="portal-sidebar__email">{currentUser.email}</span>
        </div>
        <nav className="portal-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`portal-nav-item ${view === item.id ? 'active' : ''}`}
              onClick={() => setView(item.id)}
            >
              <span className="portal-nav-icon"><i className={item.icon}></i></span>
              {item.label}
              {item.id === 'messages' && unread > 0 && (
                <span className="portal-nav-badge">{unread}</span>
              )}
              {item.id === 'products' && cartItems.length > 0 && (
                <span className="portal-nav-badge">{cartItems.reduce((sum, i) => sum + i.qty, 0)}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="portal-sidebar__foot">
          <button type="button" className="btn-outline portal-sidebar__btn" onClick={() => setView('book')}>
            <i className="fa-solid fa-calendar-plus"></i> Book Service
          </button>
        </div>
      </aside>

      <div className="portal-content">
        {view === 'dashboard' && (
          <Overview
            data={data}
            currentUser={currentUser}
            cartCount={cartItems.reduce((s, i) => s + i.qty, 0)}
            onNavigate={setView}
          />
        )}
        {view === 'vehicles' && <Vehicles vehicles={vehicles} onAddVehicle={handleAddVehicle} />}
        {view === 'products' && <Products orders={orders} cartItems={cartItems} />}
        {view === 'progress' && <ProgressReport serviceJobs={serviceJobs} />}
        {view === 'book' && <BookService currentUser={currentUser} />}
        {view === 'invoice' && (
          <Invoice
            invoice={data.invoice}
            added={invoiceAdded}
            pending={invoicePending}
            subtotal={subtotal}
            vat={vat}
            total={total}
          />
        )}
      </div>
    </div>
  );
}

function Overview({ data, currentUser, cartCount, onNavigate }) {
  const { activeJob, stats } = data;

  return (
    <>
      <header className="portal-header">
        <div>
          <p className="portal-greeting">Welcome back,</p>
          <h1 className="portal-title">{currentUser.name}</h1>
          <p className="portal-sub">Here is a snapshot of your account and active repair.</p>
        </div>
        <span className="status-badge status-progress">{activeJob.statusLabel}</span>
      </header>

      <div className="portal-metrics">
        <div className="portal-metric">
          <span className="portal-metric__val">{stats.vehiclesRegistered}</span>
          <span className="portal-metric__label">Vehicles</span>
        </div>
        <div className="portal-metric">
          <span className="portal-metric__val">{stats.activeJobs}</span>
          <span className="portal-metric__label">Active Job</span>
        </div>
        <div className="portal-metric">
          <span className="portal-metric__val">{stats.totalJobs}</span>
          <span className="portal-metric__label">Total Services</span>
        </div>
        <div className="portal-metric portal-metric--accent">
          <span className="portal-metric__val">KES {stats.outstandingBalance.toLocaleString()}</span>
          <span className="portal-metric__label">Current Bill</span>
        </div>
      </div>

      <div className="portal-grid-2">
        <div className="info-card portal-card">
          <h3 className="portal-card__title"><i className="fa-solid fa-wrench"></i> Active Repair</h3>
          <p className="portal-card__meta">{activeJob.vehicleLabel} · {activeJob.id}</p>
          <p className="portal-card__service">{activeJob.service}</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${activeJob.progress}%` }}></div>
          </div>
          <div className="portal-card__row">
            <span>{activeJob.progress}% complete</span>
            <span>Est. {activeJob.estimatedCompletion}</span>
          </div>
          <p className="portal-card__tech"><i className="fa-solid fa-user-gear"></i> {activeJob.technician} · {activeJob.bay}</p>
          <button type="button" className="btn-outline portal-card__link" onClick={() => onNavigate('progress')}>
            View full report <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div className="info-card portal-card">
          <h3 className="portal-card__title"><i className="fa-solid fa-bolt"></i> Quick Actions</h3>
          <div className="portal-actions">
            <button type="button" className="portal-action" onClick={() => onNavigate('progress')}>
              <i className="fa-solid fa-clipboard-list"></i>
              <span>Repair progress</span>
            </button>
            <button type="button" className="portal-action" onClick={() => onNavigate('messages')}>
              <i className="fa-solid fa-comments"></i>
              <span>Messages</span>
            </button>
            <button type="button" className="portal-action" onClick={() => onNavigate('invoice')}>
              <i className="fa-solid fa-file-invoice-dollar"></i>
              <span>View invoice</span>
            </button>
            <button type="button" className="portal-action" onClick={() => onNavigate('vehicles')}>
              <i className="fa-solid fa-car"></i>
              <span>My vehicles</span>
            </button>
          </div>
          {cartCount > 0 && (
            <p className="portal-card__note">
              <i className="fa-solid fa-cart-shopping"></i> {cartCount} spare part(s) in cart — <Link to="/products">view parts</Link>
            </p>
          )}
        </div>
      </div>

      <div className="info-card portal-card">
        <h3 className="portal-card__title"><i className="fa-solid fa-clock-rotate-left"></i> Latest Update</h3>
        <div className="portal-latest">
          <span className="portal-latest__date">{data.reportUpdates[0].date}</span>
          <strong>{data.reportUpdates[0].title}</strong>
          <p>{data.reportUpdates[0].body}</p>
          <span className="portal-latest__author">— {data.reportUpdates[0].author}</span>
        </div>
      </div>
    </>
  );
}

function Vehicles({ vehicles, onAddVehicle }) {
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState('');
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    plate: '',
    year: '',
    color: '',
    mileage: '',
    vin: '',
    problem: '',
  });

  const updateField = (field) => (event) => {
    setNewVehicle((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newVehicle.make.trim() || !newVehicle.model.trim() || !newVehicle.plate.trim() || !newVehicle.problem.trim()) {
      setStatus('Please provide make, model, plate number, and the problem description.');
      return;
    }

    onAddVehicle({
      id: Date.now(),
      ...newVehicle,
      lastService: 'Not serviced yet',
    });

    setStatus('New vehicle added successfully.');
    setShowForm(false);
    setNewVehicle({
      make: '',
      model: '',
      plate: '',
      year: '',
      color: '',
      mileage: '',
      vin: '',
      problem: '',
    });
  };

  return (
    <>
      <header className="portal-header">
        <div>
          <h1 className="portal-title">My Vehicles</h1>
          <p className="portal-sub">All vehicles you have sent to the garage, plus a quick add form.</p>
        </div>
        <button type="button" className="btn-outline" onClick={() => { setShowForm((value) => !value); setStatus(''); }}>
          {showForm ? 'Cancel' : 'Add Car'}
        </button>
      </header>

      {showForm && (
        <div className="info-card portal-card portal-form">
          <h3 className="portal-card__title"><i className="fa-solid fa-plus"></i> Add a Vehicle</h3>
          {status && <div className="auth-alert">{status}</div>}
          <form className="portal-form-grid" onSubmit={handleSubmit}>
            <div className="portal-form-group">
              <label>Make</label>
              <input value={newVehicle.make} onChange={updateField('make')} type="text" placeholder="e.g. BMW" />
            </div>
            <div className="portal-form-group">
              <label>Model</label>
              <input value={newVehicle.model} onChange={updateField('model')} type="text" placeholder="e.g. 320i F30" />
            </div>
            <div className="portal-form-group">
              <label>Plate Number</label>
              <input value={newVehicle.plate} onChange={updateField('plate')} type="text" placeholder="e.g. KDA 452X" />
            </div>
            <div className="portal-form-group">
              <label>Year</label>
              <input value={newVehicle.year} onChange={updateField('year')} type="text" placeholder="e.g. 2018" />
            </div>
            <div className="portal-form-group">
              <label>Colour</label>
              <input value={newVehicle.color} onChange={updateField('color')} type="text" placeholder="e.g. Alpine White" />
            </div>
            <div className="portal-form-group">
              <label>Mileage</label>
              <input value={newVehicle.mileage} onChange={updateField('mileage')} type="text" placeholder="e.g. 84,200 km" />
            </div>
            <div className="portal-form-group">
              <label>VIN</label>
              <input value={newVehicle.vin} onChange={updateField('vin')} type="text" placeholder="Vehicle identification number" />
            </div>
            <div className="portal-form-group portal-form-group--full">
              <label>Problem Description</label>
              <textarea value={newVehicle.problem} onChange={updateField('problem')} rows={4} placeholder="Describe the issue or symptoms" />
            </div>
            <div className="portal-form-actions">
              <button type="submit" className="btn-primary full">Save Vehicle</button>
            </div>
          </form>
        </div>
      )}

      <div className="portal-vehicle-list">
        {vehicles.map((v) => (
          <div className="info-card portal-vehicle" key={v.id}>
            <div className="portal-vehicle__icon"><i className="fa-solid fa-car-side"></i></div>
            <div className="portal-vehicle__body">
              <h3>{v.year ? `${v.year} ${v.make} ${v.model}` : `${v.make} ${v.model}`}</h3>
              <div className="portal-vehicle__grid">
                <div><span>Plate</span><strong>{v.plate}</strong></div>
                <div><span>Colour</span><strong>{v.color || 'N/A'}</strong></div>
                <div><span>Mileage</span><strong>{v.mileage || 'N/A'}</strong></div>
                <div><span>Last service</span><strong>{v.lastService}</strong></div>
                <div className="portal-vehicle__vin"><span>VIN</span><strong>{v.vin || 'Not provided'}</strong></div>
              </div>
              {v.problem && (
                <p className="portal-card__note"><strong>Reported issue:</strong> {v.problem}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ProgressReport({ serviceJobs }) {
  return (
    <>
      <header className="portal-header">
        <div>
          <h1 className="portal-title">Service Progress</h1>
          <p className="portal-sub">Track every vehicle job, percentage complete, technician notes, and contact details.</p>
        </div>
      </header>

      <div className="portal-progress-list">
        {serviceJobs.map((job) => (
          <article key={job.id} className="info-card portal-card job-card">
            <div className="job-card__head">
              <div>
                <h3 className="portal-card__title"><i className="fa-solid fa-car-side"></i> {job.vehicleLabel}</h3>
                <p className="portal-card__meta">{job.service}</p>
              </div>
              <span className={`status-badge ${job.progress === 100 ? 'status-complete' : 'status-progress'}`}>{job.progress}%</span>
            </div>

            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${job.progress}%` }}></div>
            </div>

            <div className="job-card__details">
              <div>
                <span>Technician</span>
                <strong>{job.technician}</strong>
              </div>
              <div>
                <span>Contact</span>
                <strong>{job.contact}</strong>
              </div>
              <div>
                <span>Booked</span>
                <strong>{job.bookedDate}</strong>
              </div>
            </div>

            <div className="note-list">
              {job.notes.map((note) => (
                <article className="note-item" key={note.id}>
                  <header>
                    <strong>{note.title}</strong>
                    <span>{note.time}</span>
                  </header>
                  <p>{note.text}</p>
                  <footer>{note.by}</footer>
                </article>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function Messages({ messages, draft, setDraft, onSend }) {
  return (
    <>
      <header className="portal-header">
        <div>
          <h1 className="portal-title">Messages</h1>
          <p className="portal-sub">Chat with our workshop team about your repair.</p>
        </div>
      </header>
      <div className="portal-messages">
        <div className="portal-messages__thread">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`portal-msg portal-msg--${msg.from} ${!msg.read && msg.from === 'workshop' ? 'portal-msg--unread' : ''}`}
            >
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
          ))}
        </div>
        <form className="portal-messages__compose" onSubmit={onSend}>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message to the workshop…"
          />
          <button type="submit" className="btn-primary">
            <i className="fa-solid fa-paper-plane"></i> Send
          </button>
        </form>
      </div>
    </>
  );
}

function Invoice({ invoice, added, pending, subtotal, vat, total }) {
  return (
    <>
      <header className="portal-header">
        <div>
          <h1 className="portal-title">Invoice</h1>
          <p className="portal-sub">{invoice.id} · {invoice.jobId}</p>
        </div>
        <span className="status-badge status-progress">{invoice.statusLabel}</span>
      </header>

      <div className="info-card portal-card portal-card--mb">
        <div className="portal-invoice-meta">
          <div><span>Issued</span><strong>{invoice.issued}</strong></div>
          <div><span>Due</span><strong>{invoice.due}</strong></div>
          <div><span>Status</span><strong>Compiling as work progresses</strong></div>
        </div>
        <p className="portal-invoice-note">{invoice.notes}</p>
      </div>

      <div className="info-card portal-card">
        <h3 className="portal-card__title"><i className="fa-solid fa-receipt"></i> Bill Items (added)</h3>
        <table className="invoice-table portal-invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {added.map((item) => (
              <tr key={item.id}>
                <td>
                  <span className={`portal-inv-tag portal-inv-tag--${item.type}`}>{item.type}</span>
                  {item.description}
                </td>
                <td>{item.qty}</td>
                <td>KES {item.unitPrice.toLocaleString()}</td>
                <td>KES {(item.unitPrice * item.qty).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {pending.length > 0 && (
          <>
            <h3 className="portal-card__title portal-card__title--sm"><i className="fa-solid fa-hourglass-half"></i> Pending (not yet billed)</h3>
            <ul className="portal-pending-list">
              {pending.map((item) => (
                <li key={item.id}>
                  <span>{item.description}</span>
                  <span>{item.unitPrice === 0 ? 'Complimentary' : `KES ${item.unitPrice.toLocaleString()}`}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="portal-invoice-totals">
          <div className="portal-invoice-totals__row">
            <span>Subtotal</span>
            <strong>KES {subtotal.toLocaleString()}</strong>
          </div>
          <div className="portal-invoice-totals__row">
            <span>VAT (16%)</span>
            <strong>KES {vat.toLocaleString()}</strong>
          </div>
          <div className="portal-invoice-totals__row portal-invoice-totals__row--total">
            <span>Running total</span>
            <span className="total-amount">KES {total.toLocaleString()}</span>
          </div>
        </div>
        <p className="portal-invoice-disclaimer">
          Final amount confirmed before vehicle handover. No hidden charges.
        </p>
      </div>
    </>
  );
}

function Products({ orders, cartItems }) {
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const activeOrders = orders.filter((order) => order.status !== 'Delivered').length;

  return (
    <>
      <header className="portal-header">
        <div>
          <h1 className="portal-title">My Products</h1>
          <p className="portal-sub">Track ordered products, delivery progress, and expected arrival.</p>
        </div>
      </header>

      <div className="portal-order-list">
        {orders.map((order) => (
          <article key={order.id} className="info-card portal-card portal-order-card">
            <div className="order-header">
              <div>
                <h3>{order.itemName}</h3>
                <p className="portal-card__meta">Order {order.orderId} · {order.orderedDate}</p>
              </div>
              <span className={`status-tag status-${order.statusKey}`}>{order.status}</span>
            </div>

            <div className="order-body">
              <div>
                <span>Qty</span>
                <strong>{order.qty}</strong>
              </div>
              <div>
                <span>Expected delivery</span>
                <strong>{order.expectedDelivery}</strong>
              </div>
              <div>
                <span>Carrier</span>
                <strong>{order.carrier}</strong>
              </div>
              <div>
                <span>Tracking</span>
                <strong>{order.tracking || 'Pending'}</strong>
              </div>
            </div>

            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${order.progress}%` }}></div>
            </div>

            <p className="portal-card__note">{order.deliveryNote}</p>
          </article>
        ))}
      </div>

      <div className="info-card portal-card">
        <h3 className="portal-card__title"><i className="fa-solid fa-box-open"></i> Order Summary</h3>
        <p className="portal-card__summary">You have {orders.length} order{orders.length !== 1 ? 's' : ''}, {activeOrders} currently in transit or pending delivery.</p>
        {cartCount > 0 ? (
          <p className="portal-card__note">You also have {cartCount} product{cartCount !== 1 ? 's' : ''} waiting in your cart.</p>
        ) : (
          <p className="portal-card__note">No cart items at the moment.</p>
        )}
        <div className="portal-actions">
          <Link className="portal-action" to="/products">
            <i className="fa-solid fa-arrow-right"></i>
            <span>Browse products</span>
          </Link>
          <button type="button" className="portal-action" onClick={() => window.open('https://wa.me/254720862971', '_blank', 'noopener')}>
            <i className="fa-brands fa-whatsapp"></i>
            <span>Ask workshop</span>
          </button>
        </div>
      </div>
    </>
  );
}

function BookService({ currentUser }) {
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [service, setService] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');

    if (!fullName || !email || !phone || !service) {
      setStatus('Please provide your name, email, phone, and service request.');
      return;
    }

    if (!supabaseEnabled) {
      setStatus('Supabase is not configured, so booking cannot be saved to the database.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('bookings').insert([
      {
        full_name: fullName,
        email,
        phone,
        vehicle_label: vehicle,
        service_name: service,
        notes,
      },
    ]);
    setIsSubmitting(false);

    if (error) {
      setStatus(error.message || 'Unable to submit booking.');
      return;
    }

    setStatus('Booking request submitted successfully. We will contact you soon.');
    setFullName(currentUser?.name || '');
    setEmail(currentUser?.email || '');
    setPhone('');
    setVehicle('');
    setService('');
    setNotes('');
  };

  return (
    <section className="section page-section">
      <header className="portal-header">
        <div>
          <h1 className="portal-title">Book Service</h1>
          <p className="portal-sub">Submit a new service request directly from your portal.</p>
        </div>
      </header>

      <div className="book-grid">
        <form onSubmit={handleSubmit} className="portal-form-grid">
          {status && <div className="auth-alert">{status}</div>}
          {!supabaseEnabled && (
            <div className="auth-alert warning">
              Supabase is not configured, so booking cannot be saved to the database.
            </div>
          )}
          <div className="portal-form-group">
            <label>Full Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder="John Juma" />
          </div>
          <div className="portal-form-group">
            <label>Email Address</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="john@example.com" />
          </div>
          <div className="portal-form-group">
            <label>Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+254 720 862 971" />
          </div>
          <div className="portal-form-group">
            <label>Vehicle Make & Model</label>
            <input value={vehicle} onChange={(e) => setVehicle(e.target.value)} type="text" placeholder="e.g. BMW 320i" />
          </div>
          <div className="portal-form-group">
            <label>Service Needed</label>
            <select value={service} onChange={(e) => setService(e.target.value)}>
              <option value="" disabled>Select a service</option>
              <option value="Engine Repair">Engine Repair</option>
              <option value="Electrical Systems">Electrical Systems</option>
              <option value="AC Service">AC Service</option>
              <option value="OBD Diagnostics">OBD Diagnostics</option>
              <option value="Brake Service">Brake Service</option>
              <option value="Transmission">Transmission</option>
              <option value="Suspension & Steering">Suspension & Steering</option>
              <option value="General Maintenance">General Maintenance</option>
            </select>
          </div>
          <div className="portal-form-group portal-form-group--full">
            <label>Additional Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} placeholder="Describe your issue or any special requirements" />
          </div>
          <div className="portal-form-actions">
            <button type="submit" className="btn-primary full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Request Booking'}
            </button>
          </div>
        </form>

        <div className="book-info">
          <div className="book-info-item">
            <div className="book-info-icon"><i className="fa-solid fa-clock"></i></div>
            <div className="book-info-text">
              <h4>Working Hours</h4>
              <p>Monday to Saturday, 8am - 6pm. Emergency slots available on request.</p>
            </div>
          </div>
          <div className="book-info-item">
            <div className="book-info-icon"><i className="fa-solid fa-location-dot"></i></div>
            <div className="book-info-text">
              <h4>Location</h4>
              <p>Corner, Kamakis, Kiambu County, Kenya</p>
            </div>
          </div>
          <div className="book-info-item">
            <div className="book-info-icon"><i className="fa-solid fa-phone"></i></div>
            <div className="book-info-text">
              <h4>Call Us</h4>
              <p>+254 720 862 971</p>
            </div>
          </div>
          <figure className="side-photo">
            <img src={bookingPhoto} alt="Workshop bay" loading="lazy" />
            <figcaption>Book service directly from your portal dashboard.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

export default Portal;
