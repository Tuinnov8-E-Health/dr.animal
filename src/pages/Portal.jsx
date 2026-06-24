import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClientPortalData } from '../data/portalData';

const NAV = [
  { id: 'overview', label: 'Overview', icon: 'fa-solid fa-gauge-high' },
  { id: 'vehicles', label: 'My Vehicles', icon: 'fa-solid fa-car' },
  { id: 'parts', label: 'Parts', icon: 'fa-solid fa-boxes-stacked' },
  { id: 'progress', label: 'Progress & Report', icon: 'fa-solid fa-clipboard-list' },
  { id: 'messages', label: 'Messages', icon: 'fa-solid fa-comments' },
  { id: 'invoice', label: 'Invoice', icon: 'fa-solid fa-file-invoice-dollar' },
];

function Portal({ currentUser, cartItems }) {
  const [view, setView] = useState('overview');
  const [draft, setDraft] = useState('');
  const data = useMemo(() => getClientPortalData(currentUser), [currentUser]);
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
              {item.id === 'parts' && cartItems.length > 0 && (
                <span className="portal-nav-badge">{cartItems.reduce((sum, i) => sum + i.qty, 0)}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="portal-sidebar__foot">
          <Link className="btn-outline portal-sidebar__btn" to="/booking">
            <i className="fa-solid fa-calendar-plus"></i> Book Service
          </Link>
        </div>
      </aside>

      <div className="portal-content">
        {view === 'overview' && (
          <Overview
            data={data}
            currentUser={currentUser}
            cartCount={cartItems.reduce((s, i) => s + i.qty, 0)}
            onNavigate={setView}
          />
        )}
        {view === 'vehicles' && <Vehicles data={data} />}
        {view === 'parts' && <Parts cartItems={cartItems} />}
        {view === 'progress' && <ProgressReport data={data} />}
        {view === 'messages' && (
          <Messages
            messages={messages}
            draft={draft}
            setDraft={setDraft}
            onSend={sendMessage}
          />
        )}
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

function Vehicles({ data }) {
  return (
    <>
      <header className="portal-header">
        <div>
          <h1 className="portal-title">My Vehicles</h1>
          <p className="portal-sub">Registered vehicles on your account.</p>
        </div>
      </header>
      <div className="portal-vehicle-list">
        {data.vehicles.map((v) => (
          <div className="info-card portal-vehicle" key={v.id}>
            <div className="portal-vehicle__icon"><i className="fa-solid fa-car-side"></i></div>
            <div className="portal-vehicle__body">
              <h3>{v.year} {v.make} {v.model}</h3>
              <div className="portal-vehicle__grid">
                <div><span>Plate</span><strong>{v.plate}</strong></div>
                <div><span>Colour</span><strong>{v.color}</strong></div>
                <div><span>Mileage</span><strong>{v.mileage}</strong></div>
                <div><span>Last service</span><strong>{v.lastService}</strong></div>
                <div className="portal-vehicle__vin"><span>VIN</span><strong>{v.vin}</strong></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ProgressReport({ data }) {
  const { activeJob, timeline, reportUpdates } = data;

  return (
    <>
      <header className="portal-header">
        <div>
          <h1 className="portal-title">Progress & Report</h1>
          <p className="portal-sub">{activeJob.vehicleLabel} · {activeJob.id}</p>
        </div>
        <span className="status-badge status-progress">{activeJob.statusLabel}</span>
      </header>

      <div className="info-card portal-card portal-card--mb">
        <h3 className="portal-card__title">{activeJob.service}</h3>
        <p className="portal-card__summary">{activeJob.summary}</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${activeJob.progress}%` }}></div>
        </div>
        <p className="portal-card__row">{activeJob.progress}% · Est. completion {activeJob.estimatedCompletion}</p>
      </div>

      <div className="portal-grid-2">
        <div className="info-card portal-card">
          <h3 className="portal-card__title"><i className="fa-solid fa-list-check"></i> Repair Timeline</h3>
          <div className="timeline">
            {timeline.map((step) => (
              <div className="timeline-item" key={step.id}>
                <div className={`timeline-dot ${step.done ? 'done' : ''} ${step.current ? 'current' : ''}`}>
                  <i className={step.done ? 'fa-solid fa-check' : step.current ? 'fa-solid fa-gear' : 'fa-solid fa-circle'}></i>
                </div>
                <div className="timeline-body">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                  <p className="timeline-date">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="info-card portal-card">
          <h3 className="portal-card__title"><i className="fa-solid fa-file-lines"></i> Workshop Report</h3>
          <div className="report-feed">
            {reportUpdates.map((update) => (
              <article className="report-feed__item" key={update.id}>
                <header>
                  <strong>{update.title}</strong>
                  <span>{update.date}</span>
                </header>
                <p>{update.body}</p>
                <footer>{update.author}</footer>
              </article>
            ))}
          </div>
        </div>
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

function Parts({ cartItems }) {
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <header className="portal-header">
        <div>
          <h1 className="portal-title">Spare Parts</h1>
          <p className="portal-sub">Request parts and track your cart from the client portal.</p>
        </div>
      </header>

      <div className="portal-grid-2">
        <div className="info-card portal-card">
          <h3 className="portal-card__title"><i className="fa-solid fa-boxes-stacked"></i> Parts Cart</h3>
          {cartCount > 0 ? (
            <>
              <p>{cartCount} item{cartCount > 1 ? 's' : ''} currently in your cart.</p>
              <div className="portal-invoice-totals">
                <div className="portal-invoice-totals__row"><span>Estimated cart total</span><strong>KES {cartTotal.toLocaleString()}</strong></div>
              </div>
              <Link className="btn-primary" to="/cart">Review cart</Link>
            </>
          ) : (
            <>
              <p>You have no parts in your cart yet.</p>
              <Link className="btn-outline" to="/products">Browse parts catalog</Link>
            </>
          )}
        </div>

        <div className="info-card portal-card">
          <h3 className="portal-card__title"><i className="fa-solid fa-headset"></i> Request Parts</h3>
          <p className="portal-card__summary">If you need help selecting parts, send a message to the workshop or request via WhatsApp.</p>
          <div className="portal-actions">
            <button type="button" className="portal-action" onClick={() => window.open('https://wa.me/254720862971', '_blank', 'noopener')}>
              <i className="fa-brands fa-whatsapp"></i>
              <span>Request on WhatsApp</span>
            </button>
            <button type="button" className="portal-action" onClick={() => window.location.assign('/contact')}>
              <i className="fa-solid fa-envelope"></i>
              <span>Contact support</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Portal;
