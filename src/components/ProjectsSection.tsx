import { useEffect, useRef, useState } from 'react';
import { Play, X, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { id: 1, title: 'Desert Mirage', category: 'Short Film', year: '2024', color: 'from-amber-900/40', youtubeId: '7Z1FKSqVJYg' },
  { id: 2, title: 'Urban Pulse', category: 'Commercial', year: '2023', color: 'from-blue-900/40', youtubeId: 'dQw4w9WgXcQ' },
  { id: 3, title: 'Echoes', category: 'Music Video', year: '2023', color: 'from-emerald-900/40', youtubeId: 'dQw4w9WgXcQ' },
  { id: 4, title: 'The Last Frame', category: 'Documentary', year: '2022', color: 'from-rose-900/40', youtubeId: 'dQw4w9WgXcQ' },
  { id: 5, title: 'Neon Dreams', category: 'Fashion Film', year: '2022', color: 'from-purple-900/40', youtubeId: 'dQw4w9WgXcQ' },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<number | null>(null);

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

  const activeProjectData = projects.find((p) => p.id === activeProject);

  return (
    <section id="projects" ref={sectionRef} className="relative z-20 overflow-hidden">
      <div className="h-screen flex flex-col justify-center">
        <div className="px-6 md:pl-24 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase">Projects · 16:9</span>
          </div>
        </div>

        <div ref={trackRef} className="flex gap-6 px-6 md:pl-24 will-change-transform">
          {projects.map((project) => (
            <div
              key={project.id}
              className="glass-card flex-shrink-0 w-[420px] md:w-[560px] group cursor-pointer"
              onClick={() => setActiveProject(project.id)}
              data-cursor-hover
            >
              {/* YouTube thumbnail */}
              <div
                className={`aspect-video bg-gradient-to-br ${project.color} to-card rounded-t-xl flex items-center justify-center relative overflow-hidden`}
              >
                <img
                  src={`https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`}
                  alt={project.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-background/30 group-hover:bg-background/10 transition-colors duration-500" />
                <Play className="relative z-10 w-12 h-12 text-foreground/60 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-primary">{project.category}</span>
                  <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cinema Mode — YouTube Embed */}
      {activeProject && activeProjectData && (
        <div className="cinema-overlay" onClick={() => setActiveProject(null)}>
          <div className="relative w-full max-w-5xl mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveProject(null)}
              className="absolute -top-12 right-0 p-2 text-muted-foreground hover:text-foreground transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video bg-card rounded-xl overflow-hidden border border-border">
              <iframe
                src={`https://www.youtube.com/embed/${activeProjectData.youtubeId}?autoplay=1&rel=0`}
                title={activeProjectData.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">{activeProjectData.title}</h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {activeProjectData.category} · {activeProjectData.year}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
