import React from 'react';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import TrustedCompanies from './components/TrustedCompanies';
import Programs from './components/Programs';
import Stats from './components/Stats';
import News from './components/News';
import Slider from './components/Slider';
import NewsMarquee from './components/NewsMarquee';

export default function Home() {
  return (
    <>
      <NewsMarquee />
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 'calc(100svh - var(--navbar-height) - var(--news-marquee-height))', minHeight: '420px' }}
      >
        <Slider />
      </div>
      <Stats />
      <Programs />
      <Gallery />
      <Testimonials />
      <TrustedCompanies />
      <News />
    </>
  );
}
