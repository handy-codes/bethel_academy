import React from 'react';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import TrustedCompanies from './components/TrustedCompanies';
import Programs from './components/Programs';
import Stats from './components/Stats';
import News from './components/News';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Programs />
      <Gallery />
      <Testimonials />
      <TrustedCompanies />
      <News />
    </>
  );
}