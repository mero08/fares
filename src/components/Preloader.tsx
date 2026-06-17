import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
}

const TEXT = 'Fares-Visual';

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(p + 2, 100);
      });
    }, 25);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onComplete?.(), 900);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505]"
        >
          {/* Subtle radial glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.08), transparent 60%)',
            }}
          />

          <div className="relative flex flex-col items-center gap-8">
            {/* SVG Logo "F" */}
            <motion.svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_0_20px_rgba(99,102,241,0.25)]"
            >
              <defs>
                <linearGradient id="preloaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              <motion.path
                d="M 35 80 V 20 H 70 M 35 50 H 60"
                stroke="url(#preloaderGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            </motion.svg>

            {/* Typing Text */}
            <div className="flex font-mono text-sm tracking-widest text-zinc-200 uppercase">
              {TEXT.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.06, duration: 0.25 }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="flex flex-col items-center gap-2 mt-4">
              <div className="h-[2px] w-64 overflow-hidden rounded-full bg-zinc-800/80">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #6366f1, #22d3ee)',
                    boxShadow: '0 0 10px rgba(99,102,241,0.4)',
                  }}
                />
              </div>
              <span className="font-mono text-[10px] tracking-widest text-zinc-500">
                {String(progress).padStart(3, '0')}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
