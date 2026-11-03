import { promises as fs } from "fs";
import path from "path";

import { defaultProjects, siteSettings } from "@/lib/site-data";

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_PATH = path.join(DATA_DIR, "projects.json");
const APPLICATIONS_PATH = path.join(DATA_DIR, "applications.json");
const SETTINGS_PATH = path.join(DATA_DIR, "settings.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readProjects() {
  await ensureDataDir();

  try {
    const raw = await fs.readFile(PROJECTS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // fall through to seed defaults
  }

  await fs.writeFile(PROJECTS_PATH, JSON.stringify(defaultProjects, null, 2), "utf8");
  return defaultProjects;
}

export async function saveProjects(projects: typeof defaultProjects) {
  await ensureDataDir();
  await fs.writeFile(PROJECTS_PATH, JSON.stringify(projects, null, 2), "utf8");
}

export async function readApplications() {
  await ensureDataDir();

  try {
    const raw = await fs.readFile(APPLICATIONS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fall through to empty list
  }

  await fs.writeFile(APPLICATIONS_PATH, JSON.stringify([], null, 2), "utf8");
  return [];
}

export async function appendApplication(application: Record<string, unknown>) {
  const items = await readApplications();
  const record = {
    id: `app-${Date.now()}`,
    status: "new",
    createdAt: new Date().toISOString(),
    ...application,
  };

  const next = [record, ...items];
  await ensureDataDir();
  await fs.writeFile(APPLICATIONS_PATH, JSON.stringify(next, null, 2), "utf8");
  return record;
}

export async function updateApplicationStatus(id: string, status: string) {
  const items = await readApplications();
  const next = items.map((item) =>
    item.id === id ? { ...item, status } : item,
  );
  await ensureDataDir();
  await fs.writeFile(APPLICATIONS_PATH, JSON.stringify(next, null, 2), "utf8");
  return next;
}

export async function readSettings() {
  await ensureDataDir();

  try {
    const raw = await fs.readFile(SETTINGS_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    await fs.writeFile(SETTINGS_PATH, JSON.stringify(siteSettings, null, 2), "utf8");
    return siteSettings;
  }
}

export async function saveSettings(settings: typeof siteSettings) {
  await ensureDataDir();
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf8");
}
