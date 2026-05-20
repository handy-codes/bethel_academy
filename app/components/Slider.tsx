'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const slides = [
  { src: 'https://i.ibb.co/WrQ2dZT/bethel-students.jpg', position: 'center' as const },
  { src: 'https://images.pexels.com/photos/5198239/pexels-photo-5198239.jpeg?auto=compress&cs=tinysrgb&w=1920', position: 'center' as const },
  { src: 'https://i.ibb.co/zhtsp6kS/Gemini-Generated-Image-wdp2kpwdp2kpwdp2.jpg', position: 'center' as const },
  { src: 'https://media.istockphoto.com/id/1494104649/photo/ai-chatbot-artificial-intelligence-digital-concept.jpg?b=1&s=612x612&w=0&k=20&c=cUerJsSIULTLDjcXXP8asl1Wd9AOTvIcEI4l0IMeC9M=', position: 'center' as const },
  { src: 'https://i.ibb.co/CfmfmQ8/Gemini-Generated-Image-s7ovczs7ovczs7ov.jpg', position: 'center' as const },
  { src: 'https://i.ibb.co/mr2DY1Cq/Gemini-Generated-Image-882bj9882bj9882b.jpg', position: 'center' as const },
  { src: 'https://i.ibb.co/xqN3xy1J/Gemini-Generated-Image-v5ipemv5ipemv5ip.jpg', position: 'center' as const },
  { src: 'https://i.ibb.co/20Z10Dhj/Gemini-Generated-Image-9k8ie09k8ie09k8i.jpg', position: 'center' as const },
  { src: 'https://images.pexels.com/photos/19281788/pexels-photo-19281788/free-photo-of-man-holding-mortarboard.jpeg?auto=compress&cs=tinysrgb&w=1920', position: 'top' as const },
];

const texts = [
  { h2: 'Discover Bethel', h1: 'INSPIRING COLLEGE', h2Sub: 'Breeding confident learners', href: '/pages/frontend' },
  { h2: 'Reinforce your Frontend Skills', h1: 'FULLSTACK DEVELOPMENT', h2Sub: 'Master Servers, API calls, Databases', href: '/pages/fullstack' },
  { h2: 'Data is life', h1: 'DATA SCIENCE', h2Sub: 'Analyse data like a Pro', href: '/pages/data-science' },
  { h2: 'Technology of the Future', h1: 'ARTIFICIAL INTELLIGENCE', h2Sub: 'Train your AI Model with Dataset and Machine Learning', href: '/ai-ml' },
  { h2: 'Power of Creativity', h1: 'SOFTWARE DEVELOPMENT', h2Sub: 'Develop and monetize disruptive software solutions', href: '/pages/software-devt' },
  { h2: 'Take your client to a global audience', h1: 'DIGITAL MARKETING', h2Sub: '...From SEO to Social Media Marketing ', href: '/pages/digital-marketing' },
  { h2: 'For love of Beauty', h1: 'UI/UX DESIGN', h2Sub: 'Create engaging and user-friendly interfaces', href: '/pages/ui-ux' },
  { h2: 'The world is on red alert', h1: 'CYBERSECURITY', h2Sub: 'Lead the war against cyber attacks', href: '/pages/cybersecurity' },
  { h2: 'Become an all-rounded Graduate', h1: 'DIGITAL SKILLS', h2Sub: 'Complement your Degree with a Digital Skill', href: '/about' },
];

const SLIDE_MS = 6000;
const EXIT_MS = 550;

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [textPhase, setTextPhase] = useState<'enter' | 'exit'>('enter');
  const [displayedSlide, setDisplayedSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToSlide = (next: number) => {
    if (next === currentSlide) return;
    setTextPhase('exit');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurrentSlide(next);
      setDisplayedSlide(next);
      setTextPhase('enter');
    }, EXIT_MS);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(interval);
  }, [currentSlide]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const textAnimClass =
    textPhase === 'enter' ? 'slider-hero-text-enter' : 'slider-hero-text-exit';

  return (
    <div className="relative w-full h-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={slide.src}
            alt=""
            fill
            priority={index === 0}
            quality={90}
            sizes="100vw"
            className={`object-cover ${slide.position === 'top' ? 'object-top' : 'object-center'}`}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white pointer-events-none">
        <div
          key={`slide-text-${displayedSlide}-${textPhase}`}
          className={`space-y-2 text-center px-4 pointer-events-auto ${textAnimClass}`}
        >
          <h2 className="text-3xl">{texts[displayedSlide].h2}</h2>
          <h1 className="text-[40px] md:text-[80px] text-[orange] font-extrabold">
            {texts[displayedSlide].h1}
          </h1>
          <h2 className="text-2xl px-5">{texts[displayedSlide].h2Sub}</h2>
          <Link
            href={texts[displayedSlide].href}
            className="inline-block mt-8 px-9 rounded-md py-3 font-bold bg-[#BF5800] text-white text-xl hover:bg-gray-500 transition-colors duration-300"
          >
            Explore
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 space-x-4">
        <button
          type="button"
          onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
          className="p-2 text-white hover:text-gray-300 transition-colors duration-300"
          aria-label="Previous slide"
        >
          <FaArrowLeft size={24} />
        </button>
        <button
          type="button"
          onClick={() => goToSlide((currentSlide + 1) % slides.length)}
          className="p-2 text-white hover:text-gray-300 transition-colors duration-300"
          aria-label="Next slide"
        >
          <FaArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}
