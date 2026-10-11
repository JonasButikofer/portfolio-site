/**
 * Every project is one object in projects-content.json. Adding a project
 * must never require touching a component (SPEC.md §5.4) — and now doesn't
 * even require touching this file. Edit the JSON directly, or via
 * `npm run admin` (dev-only).
 *
 * TODO(owner): `links` are empty across the board — repo/demo/writeup URLs
 * were not supplied yet (SPEC.md §1). The UI degrades gracefully with no
 * link; fill these in as repos go public.
 */
import projectsContent from './projects-content.json';

export type ProjectStatus = 'In progress' | 'Complete' | 'Ongoing' | 'Approaching MVP';

export interface ProjectLink {
  label: string; // 'Source', 'Live demo', 'PRD'
  href: string;
  kind: 'repo' | 'demo' | 'writeup';
}

export interface ProjectContext {
  type: string; // 'Master's mentorship project', 'Internship work', ...
  source: string; // course code or employer
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  context: ProjectContext;
  status: ProjectStatus;
  problem: string;
  built: string;
  architecture?: string[];
  outcome?: string;
  stack: string[];
  featuredMetric?: { value: string; label: string };
  links: ProjectLink[];
  featured?: boolean;
}

export const projects: Project[] = projectsContent as Project[];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
