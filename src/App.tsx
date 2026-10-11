import { About } from '@/components/sections/About';
import { Capabilities } from '@/components/sections/Capabilities';
import { Experience } from '@/components/sections/Experience';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/hero/Hero';
import { SkipLink } from '@/components/layout/SkipLink';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { getProjectBySlug } from '@/data/projects';
import { useProjectModalRoute } from '@/hooks/useProjectModalRoute';

function App() {
  const { openSlug, open, close } = useProjectModalRoute();
  const openProject = openSlug ? getProjectBySlug(openSlug) : undefined;

  return (
    <>
      <SkipLink />
      <Header />
      <main id="main">
        <Hero />
        <ProjectGrid onOpen={open} />
        <Capabilities />
        <Experience />
        <About />
      </main>
      <Footer />
      <ProjectModal project={openProject} onClose={close} />
    </>
  );
}

export default App;
