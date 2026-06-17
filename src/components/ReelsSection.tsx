import { useEffect, useRef, useState } from 'react';
import { Play, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reels = [
  { id: 1, title: 'Desert Light', category: 'Cinematic Reel', year: '2024', color: 'from-amber-900/50', videoUrl: 'https://player.mux.com/vZEHrmjJR00QN00M5xSwPhbkvOFjvdeCPvDoR1cgp01pL4?metadata-video-title=7&video-title=7', thumbnail: 'https://image.mux.com/vZEHrmjJR00QN00M5xSwPhbkvOFjvdeCPvDoR1cgp01pL4/thumbnail.jpg?time=2' },
  { id: 2, title: 'Midnight Run', category: 'Action Reel', year: '2024', color: 'from-blue-900/50', videoUrl: 'https://player.mux.com/vZEHrmjJR00QN00M5xSwPhbkvOFjvdeCPvDoR1cgp01pL4?metadata-video-title=7&video-title=7', thumbnail: 'https://image.mux.com/vZEHrmjJR00QN00M5xSwPhbkvOFjvdeCPvDoR1cgp01pL4/thumbnail.jpg?time=10' },
  { id: 3, title: 'Golden Hour', category: 'Fashion Reel', year: '2023', color: 'from-rose-900/50', videoUrl: 'https://player.mux.com/vZEHrmjJR00QN00M5xSwPhbkvOFjvdeCPvDoR1cgp01pL4?metadata-video-title=7&video-title=7', thumbnail: 'https://image.mux.com/vZEHrmjJR00QN00M5xSwPhbkvOFjvdeCPvDoR1cgp01pL4/thumbnail.jpg?time=20' },
  { id: 4, title: 'Raw Frames', category: 'BTS Reel', year: '2023', color: 'from-emerald-900/50', videoUrl: 'https://player.mux.com/vZEHrmjJR00QN00M5xSwPhbkvOFjvdeCPvDoR1cgp01pL4?metadata-video-title=7&video-title=7', thumbnail: 'https://image.mux.com/vZEHrmjJR00QN00M5xSwPhbkvOFjvdeCPvDoR1cgp01pL4/thumbnail.jpg?time=30' },
  { id: 5, title: 'Neon Nights', category: 'Music Video', year: '2024', color: 'from-violet-900/50', videoUrl: 'https://player.mux.com/vZEHrmjJR00QN00M5xSwPhbkvOFjvdeCPvDoR1cgp01pL4?metadata-video-title=7&video-title=7', thumbnail: 'https://image.mux.com/vZEHrmjJR00QN00M5xSwPhbkvOFjvdeCPvDoR1cgp01pL4/thumbnail.jpg?time=40' },
  { id: 6, title: 'Silent Motion', category: 'Documentary', year: '2023', color: 'from-cyan-900/50', videoUrl: 'https://player.mux.com/vZEHrmjJR00QN00M5xSwPhbkvOFjvdeCPvDoR1cgp01pL4?metadata-video-title=7&video-title=7', thumbnail: 'https://image.mux.com/vZEHrmjJR00QN00M5xSwPhbkvOFjvdeCPvDoR1cgp01pL4/thumbnail.jpg?time=50' },
];

export default function ReelsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeReel, setActiveReel] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const totalScroll = track.scrollWidth - window.innerWidth;

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${totalScroll}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        gsap.set(track, { x: -totalScroll * self.progress });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section id="reels" ref={sectionRef} className="relative z-20 overflow-hidden">
      <div className="h-screen flex flex-col justify-center items-start">
        <div className="px-6 md:pl-24 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase">Reels · 9:16</span>
          </div>
        </div>

        <div ref={trackRef} className="flex gap-5 px-6 md:pl-24 will-change-transform items-start">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="glass-card flex-shrink-0 group cursor-pointer"
              style={{ height: '65vh' }}
              onClick={() => setActiveReel(reel.id)}
              data-cursor-hover
            >
              <div
                className="h-full aspect-[9/16] rounded-t-xl flex items-center justify-center relative overflow-hidden"
              >
                {/* Thumbnail */}
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors duration-500" />
                <Play className="w-10 h-10 text-foreground/60 group-hover:text-primary group-hover:scale-110 transition-all duration-300 relative z-10" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-foreground mb-1">{reel.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-primary">{reel.category}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{reel.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cinema Modal */}
      {activeReel && (
        <div className="cinema-overlay" onClick={() => setActiveReel(null)}>
          <div className="relative w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveReel(null)}
              className="absolute -top-12 right-0 p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-[9/16] bg-card rounded-xl overflow-hidden border border-border">
              <iframe
                src={reels.find((r) => r.id === activeReel)?.videoUrl}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
