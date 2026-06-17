import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0, dx = 0, dy = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const tick = () => {
      dx += (mx - dx) * 0.15;
      dy += (my - dy) * 0.15;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${dx - 20}px, ${dy - 20}px)`;
      }
      requestAnimationFrame(tick);
    };

    const addHover = () => ringRef.current?.classList.add('scale-150', 'opacity-100');
    const removeHover = () => ringRef.current?.classList.remove('scale-150', 'opacity-100');

    window.addEventListener('mousemove', move);
    document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    const frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-primary pointer-events-none mix-blend-difference hidden md:block"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] w-10 h-10 rounded-full border border-primary/50 pointer-events-none transition-all duration-300 ease-out opacity-60 hidden md:block"
      />
    </>
  );
}
