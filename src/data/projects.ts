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

/** One bar in a featured metric's before/after comparison. Bars are drawn to
 * scale against the largest `value` in the set, so keep units consistent. */
export interface MetricComparisonRow {
  label: string; // 'before', 'baseline', ...
  display: string; // what the bar is labelled with: '2+ hr'
  value: number; // drawn to scale
  note: string; // hover tooltip
}

/** A project's headline number. Projects with one render as an impact tile;
 * `comparison` adds before/after bars, `units` a dot-per-item unit chart. */
export interface FeaturedMetric {
  value: string;
  label: string;
  comparison?: MetricComparisonRow[];
  units?: number;
}

/** An AI agent that's part of a project — shown under "Agentic work" in the
 * project sheet, and as a tag on the project's tile. */
export interface ProjectAgent {
  name: string;
  summary: string;
  points?: string[];
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  context: ProjectContext;
  status: ProjectStatus;
  problem: string;
  built: string;
  agents?: ProjectAgent[];
  architecture?: string[];
  outcome?: string;
  stack: string[];
  featuredMetric?: FeaturedMetric;
  links: ProjectLink[];
  featured?: boolean;
  /** 'strip' renders a quiet full-width row after the other work tiles — for
   * side projects that should be there without competing for attention. */
  tile?: 'strip';
}

export const projects: Project[] = projectsContent as Project[];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
