import { useEffect } from "react";
import { useDarkMode } from "../context/useDarkMode";
import { cn } from "../util/helpers";

export default function Infographic({
  className,
  src,
  useDarkMade = true,
}: {
  className?: string;
  src: string;
  useDarkMade: boolean;
}) {
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const container = document.getElementById("chart-container");
    if (!container) return;

    // Create chart wrapper div if it doesn't exist
    let chartWrapper = document.getElementById(src);
    if (!chartWrapper) {
      chartWrapper = document.createElement("div");
      chartWrapper.id = src;
      chartWrapper.className = "min-h-96";
      container.appendChild(chartWrapper);

      // Add noscript fallback
      const noscript = document.createElement("noscript");
      const img = document.createElement("img");
      img.src = `${src}full.png`;
      img.alt = "";
      noscript.appendChild(img);
      chartWrapper.appendChild(noscript);
    }

    // Create or select the script element
    const scriptId = `datawrapper-script-${src}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `${src}embed.js`;
      script.async = true;
      script.defer = true;
      chartWrapper.appendChild(script);
    }

    // Always update the data-dark attribute on the script
    if (useDarkMade) script.setAttribute("data-dark", `${isDarkMode}`);

    // Cleanup: remove the chart wrapper when unmounting
    return () => {
      if (chartWrapper && container) {
        container.removeChild(chartWrapper);
      }
    };
  }, [src, isDarkMode]);

  return <div id="chart-container" className={cn("relative", className)}></div>;
}
