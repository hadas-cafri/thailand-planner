"use client";

import { Plane, Bed, Sparkles, MapPin, CalendarDays } from "lucide-react";

export default function TripStats({ flights, hotels, activities }: { flights: any[]; hotels: any[]; activities: any[] }) {
  const cities = new Set([...hotels.map((h) => h.city), ...activities.map((a) => a.location).filter(Boolean)]);
  const dates = [...flights.map((f) => f.date), ...hotels.map((h) => h.checkIn), ...activities.map((a) => a.date)].filter(Boolean).sort();
  const days = dates.length > 1 ? Math.ceil((new Date(dates[dates.length - 1]).getTime() - new Date(dates[0]).getTime()) / 86400000) + 1 : 1;

  const stats = [
    { icon: CalendarDays, label: "ימים", value: days, accent: "bg-orange-50 text-[#F97316] border-orange-200" },
    { icon: Plane, label: "טיסות", value: flights.length, accent: "bg-sky-50 text-sky-600 border-sky-200" },
    { icon: Bed, label: "מלונות", value: hotels.length, accent: "bg-teal-50 text-[#0d9488] border-teal-200" },
    { icon: Sparkles, label: "פעילויות", value: activities.length, accent: "bg-violet-50 text-violet-600 border-violet-200" },
    { icon: MapPin, label: "ערים", value: cities.size, accent: "bg-rose-50 text-rose-600 border-rose-200" },
  ];

  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-5">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={i}
            className="card p-2.5 sm:p-3.5 text-center flex flex-col items-center gap-1.5 sm:gap-2 !shadow-sm hover:!translate-y-0 hover:!shadow-md"
          >
            <span className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center ${s.accent}`}>
              <Icon size={16} strokeWidth={2} />
            </span>
            <div className="text-[18px] sm:text-[22px] font-extrabold leading-none tracking-tight text-slate-900 tabular-nums">{s.value}</div>
            <div className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">{s.label}</div>
          </div>
        );
      })}
    </div>
  );
}
