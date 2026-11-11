export type CategoryKey = "ecommerce" | "social" | "print" | "illustration";
export type FilterKey = "all" | CategoryKey;

export interface ContactConfig {
  email: string;
  whatsapp: string;
  instagram: string;
  behance: string;
}

export interface Project {
  id: string;
  category: CategoryKey;
  title: string;
  summary: string;
  bullets: string[];
  tags: string[];
  cover: string;
  images: string[];
  driveUrl?: string;
}

export interface Certification {
  src: string;
  w: number;
  h: number;
  label: string;
  shortTitle?: string;
  issuer?: string;
  year?: string;
  badge?: string;
}

export type ToolCode = "Ai" | "Cd" | "Cv" | "Of" | "Cc" | "Fm";

export interface ToolItem {
  code: ToolCode;
  name: string;
  role: string;
}

export interface TimelineItem {
  period: string;
  title: string;
  detail: string;
}

export interface NavItem {
  id: string;
  label: string;
}

export interface LightboxItem {
  src: string;
  label: string;
}
