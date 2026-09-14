"use client";

import { Flight } from "../types";
import { Plane, Clock, ArrowLeft } from "lucide-react";

function daysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr + "T00:00:00");
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

function fmtDate(d: string): string {
  const [y, m, day] = d.split("-");
  const months = ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצ"];
  return `${+day} ${months[+m - 1]}`;
}

export default function NextFlight({ flights }: { flights: Flight[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = flights
    .filter((f) => f.date >= today)
    .sort((a, b) => (a.date + a.depart).localeCompare(b.date + b.depart));
  if (upcoming.length === 0) return null;
  const f = upcoming[0];
  const days = daysUntil(f.date);
  const dayLabel = days === 0 ? "היום!" : days === 1 ? "מחר" : `בעוד ${days} ימים`;
  const urgent = days <= 2;

  return (
    <div className={`card p-4 flex items-center gap-3.5 border mb-4 overflow-hidden relative ${urgent ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200" : "bg-gradient-to-r from-teal-50/70 to-sky-50/70 border-teal-200/60"}`}>
      <div className="absolute inset-y-0 right-0 w-1 bg-[#F97316] opacity-90" aria-hidden />
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${urgent ? "bg-[#F97316]" : "bg-[#0d9488]"}`}>
        <Plane size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-bold tracking-widest uppercase text-slate-500 flex items-center gap-1.5">
          הטיסה הבאה <ArrowLeft size={12} className="text-slate-400" />
        </div>
        <div className="font-extrabold text-[15px] leading-tight text-slate-900 truncate">
          {f.airline} {f.flightNo}
          <span className="font-semibold text-slate-600"> · {f.from} → {f.to}</span>
        </div>
        <div className="text-[13px] text-slate-600 tabular-nums">
          {fmtDate(f.date)} · {f.depart}
        </div>
      </div>
      <div className="text-center shrink-0 bg-white rounded-xl border border-slate-200 px-3 py-2 shadow-sm">
        <div className={`text-[15px] font-extrabold leading-none ${urgent ? "text-[#F97316]" : "text-[#0d9488]"}`}>{dayLabel}</div>
        <div className="text-[11px] text-slate-500 flex items-center gap-1 justify-center mt-1 font-medium"><Clock size={10} /> לטיסה</div>
      </div>
    </div>
  );
}
