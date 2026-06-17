import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface HeroSectionProps {
  startAnimation?: boolean;
}

export default function HeroSection({ startAnimation = true }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleOutlineRef = useRef<HTMLHeadingElement>(null);
  const titleSolidRef = useRef<HTMLHeadingElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Master intro timeline - runs once preloader is done
  useEffect(() => {
    if (!startAnimation) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1) Background particles fade-in handled globally; animate hero container subtly
      tl.fromTo(
        containerRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1 },
        0
      );

      // 2) Eyebrow words stagger
      const words = eyebrowRef.current?.querySelectorAll('.word') ?? [];
      tl.fromTo(
        words,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
        0.2
      );

      // 3) Main title (both layers together)
      tl.fromTo(
        [titleOutlineRef.current, titleSolidRef.current],
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8 },
        0.6
      );

      // 4) Particle burst behind title
      tl.fromTo(
        burstRef.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 0.7, scale: 1.4, duration: 0.5, ease: 'power2.out' },
        1.0
      ).to(
        burstRef.current,
        { opacity: 0, duration: 0.6, ease: 'power2.in' },
        '>-0.1'
      );

      // 5) Buttons
      tl.fromTo(
        buttonsRef.current?.children ?? [],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
        1.1
      );

      // Light sweep across title
      tl.fromTo(
        sweepRef.current,
        { xPercent: -120, opacity: 0 },
        { xPercent: 120, opacity: 1, duration: 1.2, ease: 'power2.inOut' },
        1.6
      ).to(sweepRef.current, { opacity: 0, duration: 0.3 }, '>-0.2');

      // Subtle glow pulse loop on title
      tl.to(
        titleSolidRef.current,
        {
          filter: 'drop-shadow(0 0 18px hsl(43 100% 75% / 0.45))',
          duration: 2.2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        },
        1.4
      );
    }, containerRef);

    return () => ctx.revert();
  }, [startAnimation]);

  // Cursor parallax on title
  useEffect(() => {
    const el = titleWrapRef.current;
    if (!el) return;
    const handleMouse = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      setOffset({ x: cx * 12, y: cy * 8 });
    };
    el.addEventListener('mousemove', handleMouse);
    return () => el.removeEventListener('mousemove', handleMouse);
  }, []);

  const eyebrowWords = ['Director', '·', 'Cinematographer', '·', 'Storyteller'];

  return (
    <section
      ref={containerRef}
      className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4"
      style={{ willChange: 'transform, opacity', opacity: startAnimation ? 0 : 1 }}
    >
      <div className="text-center">
        <p
          ref={eyebrowRef}
          className="font-mono text-xs md:text-sm text-muted-foreground tracking-[0.4em] uppercase mb-6 flex flex-wrap justify-center gap-x-2"
        >
          {eyebrowWords.map((w, i) => (
            <span key={i} className="word inline-block" style={{ willChange: 'transform, opacity' }}>
              {w}
            </span>
          ))}
        </p>

        {/* Kinetic Split Name */}
        <div ref={titleWrapRef} className="relative select-none overflow-hidden">
          {/* Particle burst behind title */}
          <div
            ref={burstRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 mx-auto"
            style={{
              background:
                'radial-gradient(ellipse at center, hsl(43 100% 75% / 0.35), transparent 60%)',
              willChange: 'transform, opacity',
            }}
          />

          {/* Outlined layer - moves opposite */}
          <h1
            ref={titleOutlineRef}
            className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-bold leading-none tracking-tighter transition-transform duration-300 ease-out"
            style={{
              WebkitTextStroke: '2px hsl(43 100% 82%)',
              WebkitTextFillColor: 'transparent',
              transform: `translate(${-offset.x}px, ${-offset.y}px)`,
              willChange: 'transform, opacity',
            }}
            aria-hidden="true"
          >
            FARES
            <br />
            AZAB
          </h1>

          {/* Solid gold layer - moves with cursor */}
          <h1
            ref={titleSolidRef}
            className="absolute inset-0 text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-bold leading-none tracking-tighter transition-transform duration-300 ease-out"
            style={{
              color: 'hsl(43 100% 82%)',
              transform: `translate(${offset.x}px, ${offset.y}px)`,
              mixBlendMode: 'screen',
              willChange: 'transform, opacity, filter',
            }}
          >
            FARES
            <br />
            AZAB
          </h1>

          {/* Light sweep */}
          <div
            ref={sweepRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(110deg, transparent 30%, hsl(43 100% 90% / 0.35) 50%, transparent 70%)',
              mixBlendMode: 'screen',
              willChange: 'transform, opacity',
            }}
          />
        </div>

        <div
          ref={buttonsRef}
          className="mt-8 flex items-center justify-center gap-6"
        >
          <a
            href="#reels"
            data-cursor-hover
            className="px-6 py-3 border border-primary/30 rounded-full text-sm font-mono uppercase tracking-widest text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-500"
            style={{ willChange: 'transform, opacity' }}
          >
            View Reels
          </a>
          <a
            href="#contact"
            data-cursor-hover
            className="px-6 py-3 text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-300"
            style={{ willChange: 'transform, opacity' }}
          >
            Contact
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pb-[50px]">
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-muted-foreground/50 to-transparent" />
        <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
          Scroll
        </span>
      </div>
    </section>
  );
}
