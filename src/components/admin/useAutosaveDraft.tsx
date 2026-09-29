"use client";
import { useCallback, useEffect, useRef, useState } from "react";

function fmtTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Autosaves editor form state to localStorage (debounced) and detects
 * restorable drafts. Pass `null` as key to disable (e.g. before an id loads).
 */
export function useAutosaveDraft<T extends object>(key: string | null, value: T) {
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftTime, setDraftTime] = useState<string | null>(null);
  const first = useRef(true);

  useEffect(() => {
    first.current = true;
    setSavedAt(null);
    if (!key || typeof window === "undefined") {
      setHasDraft(false);
      return;
    }
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        setHasDraft(true);
        setDraftTime(parsed.savedAt || null);
      } else {
        setHasDraft(false);
      }
    } catch {
      setHasDraft(false);
    }
  }, [key]);

  useEffect(() => {
    if (!key || typeof window === "undefined") return;
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => {
      try {
        const at = new Date().toISOString();
        window.localStorage.setItem(key, JSON.stringify({ savedAt: at, data: value }));
        setSavedAt(at);
      } catch {
        /* storage full or blocked — editing still works */
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [key, value]);

  const loadDraft = useCallback((): T | null => {
    if (!key || typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return (parsed.data as T) ?? null;
    } catch {
      return null;
    }
  }, [key]);

  const clearDraft = useCallback(() => {
    if (!key || typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    setHasDraft(false);
    setDraftTime(null);
    setSavedAt(null);
  }, [key]);

  return { savedAt: fmtTime(savedAt), hasDraft, draftTime: fmtTime(draftTime), loadDraft, clearDraft };
}

/** Small "Draft saved · 14:22" indicator for editor headers. */
export function DraftStatus({ savedAt }: { savedAt: string }) {
  if (!savedAt) return null;
  return (
    <span className="text-[12px] font-light text-zinc-400 dark:text-zinc-500">
      Draft saved · {savedAt}
    </span>
  );
}
