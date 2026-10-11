import { Cover } from '@/components/cover/Cover';
import { Footer } from '@/components/layout/Footer';
import { SkipLink } from '@/components/layout/SkipLink';
import { TopBar } from '@/components/layout/TopBar';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { Background } from '@/components/sections/Background';
import { Toolkit } from '@/components/sections/Toolkit';
import { Work } from '@/components/sections/Work';
import { getProjectBySlug } from '@/data/projects';
import { useProjectModalRoute } from '@/hooks/useProjectModalRoute';

function App() {
  const { openSlug, open, close } = useProjectModalRoute();
  const openProject = openSlug ? getProjectBySlug(openSlug) : undefined;

  return (
    <>
      <SkipLink />
      <Cover />
      <TopBar />
      {/* One bento grid: 1 column on phones, 2 from sm, 6 from lg. Order is
          the reading order — background, then work, then toolkit. */}
      <main
        id="main"
        className="mx-auto grid max-w-[1200px] grid-cols-1 gap-3.5 px-5 pt-2 pb-6 sm:grid-cols-2 lg:grid-cols-6"
      >
        <Background />
        <Work onOpen={open} />
        <Toolkit />
      </main>
      <Footer />
      <ProjectModal project={openProject} onClose={close} />
    </>
  );
}

export default App;
