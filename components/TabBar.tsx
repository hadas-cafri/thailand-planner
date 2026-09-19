"use client";

import {
  Plane,
  Hotel,
  Sparkles,
  Cloud,
  MessageCircle,
  Map,
  Wallet,
  Backpack,
  Info,
  CalendarDays,
  HelpCircle,
  Sun,
  Key,
  Utensils,
  BookOpen,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type TabKey =
  | "היום"
  | "טיסות"
  | "מלונות"
  | "פעילויות"
  | "מזג אוויר"
  | "מפה"
  | "תקציב"
  | "ציוד"
  | "מידע"
  | "טיימליין"
  | "עזרה"
  | "מספרים"
  | "אוכל כשר"
  | "דרכונים";

const ICONS: Record<TabKey, any> = {
  היום: Sun,
  טיסות: Plane,
  מלונות: Hotel,
  פעילויות: Sparkles,
  "מזג אוויר": Cloud,
  מפה: Map,
  תקציב: Wallet,
  ציוד: Backpack,
  מידע: Info,
  טיימליין: CalendarDays,
  עזרה: HelpCircle,
  מספרים: Key,
  "אוכל כשר": Utensils,
  דרכונים: BookOpen,
};

export const TABS: TabKey[] = [
  "היום",
  "טיסות",
  "מלונות",
  "פעילויות",
  "מזג אוויר",
  "מפה",
  "תקציב",
  "ציוד",
  "מידע",
  "טיימליין",
  "עזרה",
  "מספרים",
  "אוכל כשר",
  "דרכונים",
];

// short labels for tighter mobile — keep original Hebrew so it stays recognizable
const SHORT: Partial<Record<TabKey, string>> = {
  "מזג אוויר": "מזג-אוויר",
  "אוכל כשר": "כשר",
};

export default function TabBar({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  // keep active tab visible
  useEffect(() => {
    const el = btnRefs.current[active];
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  // edge fade visibility
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const upd = () => {
      setCanLeft(el.scrollLeft > 8);
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    };
    upd();
    el.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    return () => {
      el.removeEventListener("scroll", upd);
      window.removeEventListener("resize", upd);
    };
  }, []);

  return (
    <>
      {/* ── DESKTOP ── */}
      <nav
        aria-label="ניווט ראשי"
        className="hidden md:flex justify-center mb-6"
        dir="rtl"
      >
        <div className="inline-flex items-center gap-1 p-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
          {TABS.map((t) => {
            const Icon = ICONS[t];
            const on = active === t;
            return (
              <button
                key={t}
                onClick={() => onChange(t)}
                aria-current={on ? "page" : undefined}
                className={`relative flex items-center gap-1.5 px-3.5 py-[7px] rounded-full text-[13px] font-medium leading-none transition-all duration-200 ${
                  on
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon size={14} strokeWidth={on ? 2.25 : 1.9} className={on ? "opacity-100" : "opacity-70"} />
                <span className="tracking-tight whitespace-nowrap">{t}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── MOBILE (floating island) ── */}
      <nav
        aria-label="ניווט ראשי מובייל"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 pointer-events-none"
        dir="rtl"
      >
        {/* soft upward fade so content doesn't slam into bar */}
        <div className="h-6 bg-gradient-to-t from-slate-50/80 to-transparent pointer-events-none" />
        <div className="bg-white/85 backdrop-blur-xl border-t border-slate-200/70 shadow-[0_-8px_28px_rgba(15,23,42,0.08)] supports-[backdrop-filter]:bg-white/70">
          {/* edge fades */}
          <div className="relative">
            <div
              className={`absolute right-0 top-0 bottom-0 w-7 bg-gradient-to-l from-white to-transparent pointer-events-none transition-opacity ${canRight ? "opacity-100" : "opacity-0"}`}
            />
            <div
              className={`absolute left-0 top-0 bottom-0 w-7 bg-gradient-to-r from-white to-transparent pointer-events-none transition-opacity ${canLeft ? "opacity-100" : "opacity-0"}`}
            />
            <div
              ref={scrollRef}
              className="flex gap-1 overflow-x-auto no-scrollbar scroll-smooth px-2 py-2.5"
              style={{ scrollbarWidth: "none" }}
            >
              {TABS.map((t) => {
                const Icon = ICONS[t];
                const on = active === t;
                const label = SHORT[t as TabKey] ?? t;
                return (
                  <button
                    key={t}
                    ref={(el) => { btnRefs.current[t] = el; }}
                    onClick={() => onChange(t)}
                    aria-current={on ? "page" : undefined}
                    className={`pointer-events-auto relative flex flex-col items-center justify-center gap-1 min-w-[60px] px-2.5 py-1.5 rounded-2xl transition-all duration-200 shrink-0 ${
                      on
                        ? "bg-slate-900 text-white shadow-[0_2px_10px_rgba(15,23,42,0.2)]"
                        : "text-slate-500 active:bg-slate-100"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors ${on ? "bg-white/15" : "bg-slate-100"}`}
                    >
                      <Icon size={16} strokeWidth={on ? 2.2 : 1.85} />
                    </span>
                    <span className={`text-[10px] leading-none tracking-tight whitespace-nowrap ${on ? "font-semibold" : "font-medium"}`}>
                      {label}
                    </span>
                    {/* active dot */}
                    <span
                      className={`absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white transition-opacity ${on ? "opacity-0" : "opacity-0"}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          {/* safe-area */}
          <div className="h-[max(0px,env(safe-area-inset-bottom))] bg-white" />
        </div>
      </nav>
    </>
  );
}
