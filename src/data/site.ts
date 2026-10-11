/**
 * Identity, contact links, and site-wide constants.
 *
 * The actual content lives in site-content.json — this file only adds
 * types. Edit the JSON directly, or via `npm run admin` (dev-only).
 * TODO(owner): contact.githubUrl is still a placeholder.
 */
import content from './site-content.json';

export const DOMAIN: string = content.domain;
export const SITE_URL = `https://${DOMAIN}`;

export interface Person {
  name: string;
  role: string;
  positioningLine: string;
  location: string;
  openTo: string;
  graduation: string;
  degree: string;
  degreeShort: string; // fits a tile/chip: 'M.S. Information Systems Management'
  minor: string;
  school: string;
  schoolShort: string; // 'BYU'
  gpa: string; // the number only, e.g. '3.91'
  honors: string;
  currentRole: string; // cover chip, e.g. 'Zions Bancorporation · EDW'
  certification: string;
}

export interface Contact {
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  resumeHref: string;
}

export interface CapabilityGroup {
  title: string;
  items: string[];
}

export interface ExperienceEntry {
  org: string;
  title: string;
  location: string;
  start: string;
  end: string | 'present';
  note?: string;
}

export const person: Person = content.person;
export const contact: Contact = content.contact;
export const capabilityGroups: CapabilityGroup[] = content.capabilityGroups;
export const econometricsNote: string = content.econometricsNote;
export const experience: ExperienceEntry[] = content.experience;
