"use client";

import { useEffect, useState } from "react";

import { defaultProjects, type SiteProject } from "@/lib/site-data";

export function useProjects() {
  const [projects, setProjects] = useState<SiteProject[]>(defaultProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      void fetch("/api/projects", { cache: "no-store" })
        .then(async (response) => {
          if (!response.ok) throw new Error("Published projects request failed");
          const result = await response.json() as { projects: SiteProject[] };
          if (active) setProjects(result.projects);
        })
        .catch((error: unknown) => {
          console.error("Unable to refresh published projects:", error);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    });

    return () => { active = false; };
  }, []);

  return { projects, loading };
}
