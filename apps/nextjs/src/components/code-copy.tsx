"use client";

import { useState } from "react";
import * as Icons from "@saasfly/ui/icons";

export function CodeCopy() {
  const [copied, setCopied] = useState(false);
  const command = "bun run dev:web";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex h-12 max-w-xl items-center justify-between rounded-full border border-brand-gold/30 bg-brand-ink/60 px-4">
      <div className="flex items-center space-x-2 font-mono text-sm text-brand-orange">
        <span className="text-brand-gold">$</span>
        <span>{command}</span>
      </div>
      <button
        onClick={copyToClipboard}
        className="ml-2 rounded-full p-1.5 transition-colors hover:bg-brand-orange/15"
        aria-label="Copy to clipboard"
        type="button"
      >
        {copied ? (
          <Icons.Check className="h-4 w-4 text-brand-orange" />
        ) : (
          <Icons.Copy className="h-4 w-4 text-brand-gold" />
        )}
      </button>
    </div>
  );
}
