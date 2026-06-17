import { Suspense, useState } from 'react';
import Preloader from '@/components/Preloader';
import NebulaBackground from '@/components/NebulaBackground';
import CustomCursor from '@/components/CustomCursor';
import ViewfinderHUD from '@/components/ViewfinderHUD';
import HeroSection from '@/components/HeroSection';
import CommandSidebar from '@/components/CommandSidebar';
import AboutSection from '@/components/AboutSection';
import ExpertiseSection from '@/components/ExpertiseSection';
import ReelsSection from '@/components/ReelsSection';
import ProjectsSection from '@/components/ProjectsSection';
import SystemLogs from '@/components/SystemLogs';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div id="home" className="relative min-h-screen bg-background">
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <CustomCursor />
      <Suspense fallback={null}>
        <NebulaBackground />
      </Suspense>
      <ViewfinderHUD />
      <CommandSidebar />

      <main className="relative">
        <HeroSection startAnimation={loaded} />
        <AboutSection />
        <ExpertiseSection />
        <ReelsSection />
        <ProjectsSection />
        <SystemLogs />
        <ContactSection />
      </main>
    </div>
  );
};

export default Index;
