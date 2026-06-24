import React from 'react';
import { Link } from 'react-router-dom';
import { SplitLayout, IconList, shortDesc } from './ContentLayout';
import {
  heroImages,
  services,
  featureCards,
  galleryItems,
  testimonials,
  processSteps,
  trustedBrands,
  products,
} from '../data';

const heroStats = [
  { value: '4.9/5', label: 'Customer Rating' },
  { value: '10+ yrs', label: 'Experience' },
  { value: '30+ services', label: 'Service Types' },
  { value: '179+ reviews', label: 'Google Reviews' },
];

const featuredProducts = products.slice(0, 4);

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" style={{ '--hero-image': `url(${heroImages.main})` }}></div>
      <div className="hero-overlay"></div>
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="hero-eyebrow">European and American car specialists</span>
          <h1>We fix every beast on the road</h1>
          <p>
            Doctor Animal Auto delivers premium service with genuine parts, fast turnarounds, and clear communication — so your vehicle is back on the road with confidence.
          </p>
          <div className="hero-actions">
            <Link className="btn-primary" to="/booking">
              Book Appointment
            </Link>
            <Link className="btn-outline" to="/services">
              View Services
            </Link>
          </div>
          <div className="hero-metrics">
            {heroStats.map((metric) => (
              <div key={metric.label} className="hero-metric">
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-preview">
          <img src={heroImages.workshop} alt="Workshop bay at Doctor Animal Auto" loading="eager" />
          <div className="hero-preview-card">
            <strong>Best Repairers 2023</strong>
            <p>Trusted by owners of premium vehicles across Nairobi and Kiambu.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section className="section section-white service-section">
      <div className="section-header">
        <div>
          <span className="section-label">What We Do</span>
          <h2 className="section-title">Our Services</h2>
          <p className="section-sub">
            Comprehensive automotive care for every system in your vehicle, backed by transparent pricing and genuine parts.
          </p>
        </div>
        <Link className="btn-outline" to="/services">
          View All Services
        </Link>
      </div>

      <div className="services-grid">
        {services.slice(0, 6).map((service) => (
          <article key={service.title} className="service-card">
            <div className="service-card__icon">
              <i className={service.icon}></i>
            </div>
            <h3>{service.title}</h3>
            <p>{shortDesc(service.desc, 110)}</p>
            <Link className="service-link" to="/services">
              Learn More <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Difference() {
  return (
    <section className="section section-soft why-section">
      <div className="section-label">Why Choose Us</div>
      <div className="section-title">A Service Experience Built Around Trust</div>
      <p className="section-sub">
        We diagnose the root cause, recommend only what your vehicle needs, and keep every customer informed from booking through handover.
      </p>

      <div className="feature-grid">
        {featureCards.slice(0, 4).map((item) => (
          <article key={item.title} className="feature-card">
            <div className="feature-icon">
              <i className={item.icon}></i>
            </div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </article>
        ))}
      </div>

      <div className="section-actions">
        <Link className="btn-primary" to="/about">
          Learn More About Us
        </Link>
      </div>
    </section>
  );
}

export function BrandsSection() {
  return (
    <section className="section section-soft brands-section">
      <div className="section-header-column">
        <span className="section-label">Premium Brands</span>
        <div className="section-title">Premium Brands We Service</div>
        <p className="section-sub">
          Expert care for luxury and premium vehicles with precise diagnostics, genuine components, and a team that knows your brand.
        </p>
      </div>
      <div className="brand-marquee">
        <div className="brand-marquee__track">
          {[...trustedBrands, ...trustedBrands].map((brand, index) => (
            <div key={`${brand.name}-${index}`} className="brand-marquee__item">
              <img src={brand.logo} alt={brand.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedProductsSection() {
  return (
    <section className="section section-white products-section">
      <div className="section-header">
        <div>
          <span className="section-label">Products</span>
          <h2 className="section-title">Shop Featured Parts</h2>
          <p className="section-sub">
            Browse top-quality parts and accessories that keep your vehicle running the way it should.
          </p>
        </div>
        <Link className="btn-outline" to="/products">
          Browse All Products
        </Link>
      </div>

      <div className="product-grid">
        {featuredProducts.map((product) => (
          <article key={product.id} className="product-card">
            <div className="product-thumb">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-body">
              <span className="product-category">{product.make}</span>
              <h3>{product.name}</h3>
              <p>{product.desc}</p>
            </div>
            <div className="product-footer">
              <strong className="product-price">KES {product.price.toLocaleString()}</strong>
              <Link className="product-link" to="/products">
                View
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function GalleryPreview() {
  return (
    <section className="section home-gallery-preview">
      <div className="section-header-row">
        <div>
          <div className="section-label">Our Work</div>
          <div className="section-title">Workshop Gallery</div>
        </div>
        <Link className="btn-outline section-header-cta" to="/gallery">Full Gallery</Link>
      </div>
      <SplitLayout
        reverse
        images={[
          { src: galleryItems[0].src, alt: galleryItems[0].caption },
          { src: galleryItems[1].src, alt: galleryItems[1].caption },
        ]}
      >
        <ul className="caption-list">
          {galleryItems.slice(0, 6).map((item) => (
            <li key={item.caption}>
              <i className="fa-solid fa-camera"></i>
              <span>{item.caption}</span>
            </li>
          ))}
        </ul>
      </SplitLayout>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="section home-testimonials">
      <div className="section-label">Customer Feedback</div>
      <div className="section-title">What Our Customers Say</div>
      <div className="testimonial-grid">
        {testimonials.map((t) => (
          <article key={t.name} className="testimonial-card">
            <div className="testimonial-stars">
              {Array.from({ length: t.rating }).map((_, index) => (
                <i key={index} className="fa-solid fa-star"></i>
              ))}
            </div>
            <p>&ldquo;{t.quote}&rdquo;</p>
            <div className="testimonial-author">
              <strong>{t.name}</strong>
              <span>{t.vehicle}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CtaStrip() {
  return (
    <div className="cta-strip">
      <div className="cta-strip-content">
        <div className="cta-title">Ready to Book Your Service?</div>
        <p>
          Schedule your appointment today and experience premium automotive care with expert diagnostics, genuine parts, and fast turnaround.
        </p>
        <div className="cta-btns">
          <Link className="btn-primary" to="/booking">
            Book a Service Now
          </Link>
          <Link className="btn-outline" to="/contact">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
