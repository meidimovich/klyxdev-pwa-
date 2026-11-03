"use client";

import { useEffect, useState } from "react";

import { siteSettings } from "@/lib/site-data";

export type PublishedContentEntry = {
  slug: string;
  content: {
    ru?: { title?: string; description?: string };
    en?: { title?: string; description?: string };
  };
};

type SiteContent = {
  services: PublishedContentEntry[];
  team: PublishedContentEntry[];
  settings: { email?: string; telegram?: string };
};

const initialContent: SiteContent = { services: [], team: [], settings: siteSettings };

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(initialContent);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      void fetch("/api/site-content", { cache: "no-store" })
        .then(async (response) => {
          if (!response.ok) throw new Error("Site content request failed");
          const result = await response.json() as SiteContent;
          if (active) setContent(result);
        })
        .catch((error: unknown) => {
          console.error("Unable to refresh public site content:", error);
        });
    });

    return () => { active = false; };
  }, []);

  return content;
}
