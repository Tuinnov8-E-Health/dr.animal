import React from 'react';
import {
  Hero,
  ServicesSection,
  Difference,
  BrandsSection,
  FeaturedProductsSection,
  GalleryPreview,
  Testimonials,
  CtaStrip,
} from '../components/HomeSections';

function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <Difference />
      <BrandsSection />
      <FeaturedProductsSection />
      <GalleryPreview />
      <Testimonials />
      <CtaStrip />
    </>
  );
}

export default Home;
