"use client";

import { useState } from "react";

export function ShareActions({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API requires a secure context; fall back to a hidden textarea.
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareWhatsApp() {
    const text = `${title} — ${window.location.href}`;
    // wa.me opens the app on mobile and WhatsApp Web on desktop.
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener"
    );
  }

  return (
    <div className="flex gap-2 text-[10px] uppercase tracking-[0.3em]">
      <button
        type="button"
        onClick={shareWhatsApp}
        className="border border-edge bg-coal px-3 py-2 text-mute hover:text-jade hover:border-jade transition"
      >
        WhatsApp
      </button>
      <button
        type="button"
        onClick={copyLink}
        className={`border px-3 py-2 transition ${
          copied
            ? "border-jade bg-coal text-jade"
            : "border-edge bg-coal text-mute hover:text-flame hover:border-flame"
        }`}
      >
        {copied ? "¡Copiado!" : "Copiar enlace"}
      </button>
    </div>
  );
}
