"use client";

import { Plane, Hotel, Sparkles, Cloud, MessageCircle, Map, Wallet, Backpack, Info, CalendarDays, HelpCircle, Sun, Key } from "lucide-react";

export type TabKey = "היום" | "טיסות" | "מלונות" | "פעילויות" | "מזג אוויר" | "מפה" | "תקציב" | "ציוד" | "מידע" | "טיימליין" | "עזרה" | "מספרים";

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
};

export const TABS: TabKey[] = ["היום", "טיסות", "מלונות", "פעילויות", "מזג אוויר", "מפה", "תקציב", "ציוד", "מידע", "טיימליין", "עזרה", "מספרים"];

export default function TabBar({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  const tabs: TabKey[] = ["היום", "טיסות", "מלונות", "פעילויות", "מזג אוויר", "מפה", "תקציב", "ציוד", "מידע", "טיימליין", "עזרה", "מספרים"];
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 md:hidden">
      <div className="flex gap-1 overflow-x-auto px-2 py-2 no-scrollbar">
        {tabs.map((t) => {
          const Icon = ICONS[t];
          const on = active === t;
          return (
            <button
              key={t}
              onClick={() => onChange(t)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[58px] py-1 px-1 rounded-xl transition-colors ${
                on ? "bg-thai-orange/10 text-thai-orange" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className={`p-1 rounded-full transition-colors ${on ? "bg-thai-orange/15" : ""}`}>
                <Icon size={20} />
              </span>
              <span className="text-[10px] font-medium leading-none text-center whitespace-nowrap">{t}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
