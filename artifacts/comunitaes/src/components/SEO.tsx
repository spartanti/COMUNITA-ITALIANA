import { useEffect } from "react";
import { api } from "@/lib/api";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function loadGoogleAnalytics(measurementId: string) {
  if (!measurementId || document.getElementById("ga-script")) return;

  const script1 = document.createElement("script");
  script1.id = "ga-script";
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);
}

let seoLoaded = false;

export function SEOProvider() {
  useEffect(() => {
    if (seoLoaded) return;
    seoLoaded = true;

    api.settings.publicList()
      .then((settings) => {
        const get = (key: string) => settings.find((s) => s.key === key)?.value ?? "";

        const gaId = get("google_analytics_id");
        if (gaId) loadGoogleAnalytics(gaId);

        const title = get("site_title");
        if (title) document.title = title;

        const description = get("site_description");
        if (description) {
          let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
          if (!meta) {
            meta = document.createElement("meta");
            meta.name = "description";
            document.head.appendChild(meta);
          }
          meta.content = description;
        }

        const keywords = get("site_keywords");
        if (keywords) {
          let meta = document.querySelector<HTMLMetaElement>('meta[name="keywords"]');
          if (!meta) {
            meta = document.createElement("meta");
            meta.name = "keywords";
            document.head.appendChild(meta);
          }
          meta.content = keywords;
        }

        const ogImage = get("og_image_url");
        if (ogImage) {
          let meta = document.querySelector<HTMLMetaElement>('meta[property="og:image"]');
          if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("property", "og:image");
            document.head.appendChild(meta);
          }
          meta.content = ogImage;
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
