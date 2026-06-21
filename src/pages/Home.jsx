import React from 'react';
import {
  Hero,
  TrustStrip,
  ServicesSection,
  Difference,
  ProcessSection,
  GalleryPreview,
  Testimonials,
  CtaStrip,
} from '../components/HomeSections';

function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ServicesSection />
      <Difference />
      <ProcessSection />
      <GalleryPreview />
      <Testimonials />
      <CtaStrip />
    </>
  );
}

export default Home;
