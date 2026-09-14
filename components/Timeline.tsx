"use client";

import { TimelineItem } from "../types";
import { Plane, Bed, Sparkles, Calendar, Clock, MapPin } from "lucide-react";

const ICONS: Record<string, any> = { flight: Plane, hotel: Bed, activity: Sparkles };
const COLORS: Record<string, string> = {
  flight: "bg-[#F97316] text-white shadow-[0_2px_8px_rgba(249,115,22,0.35)]",
  hotel: "bg-[#0d9488] text-white shadow-[0_2px_8px_rgba(13,148,136,0.30)]",
  activity: "bg-[#d97706] text-white shadow-[0_2px_8px_rgba(217,119,6,0.30)]",
};
const CARD_ACCENT: Record<string, string> = {
  flight: "border-l-[#F97316]",
  hotel: "border-l-[#0d9488]",
  activity: "border-l-[#d97706]",
};
const LABEL: Record<string, string> = {
  flight: "טיסה",
  hotel: "מלון",
  activity: "פעילות",
};

function fmtDate(d: string): string {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  if (!y || !m || !day) return d;
  const months = ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצ"];
  const dt = new Date(d + "T00:00:00");
  const wd = dt.toLocaleDateString("he-IL", { weekday: "short" });
  return `${wd} · ${+day} ${months[+m - 1]} ${y}`;
}

function weekdayShort(d: string) {
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("he-IL", { weekday: "long" });
}

export default function Timeline({ items }: { items: TimelineItem[] }) {
  const sorted = [...items].sort((a, b) =>
    (a.date + (a.time || "")).localeCompare(b.date + (b.time || ""))
  );

  // Group by date for proper day clustering — no mutation during render
  const groups = new Map<string, TimelineItem[]>();
  for (const it of sorted) {
    if (!groups.has(it.date)) groups.set(it.date, []);
    groups.get(it.date)!.push(it);
  }
  const groupEntries = Array.from(groups.entries());

  if (sorted.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Calendar size={22} className="text-slate-400" />
        </div>
        <p className="text-[15px] font-semibold text-slate-700">עדיין אין אירועים בטיימליין</p>
        <p className="text-sm text-slate-500 mt-1 max-w-[28ch] mx-auto leading-relaxed">הוסיפי טיסות, מלונות או פעילויות והן יופיעו כאן בסדר כרונולוגי</p>
      </div>
    );
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
          <span className="w-1.5 h-6 rounded-full bg-[#F97316] inline-block" aria-hidden />
          טיימליין הטיול
        </h2>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full tabular-nums">
          {sorted.length} אירועים · {groupEntries.length} ימים
        </span>
      </div>

      <div className="space-y-8">
        {groupEntries.map(([date, dayItems]) => {
          const isToday = date === todayStr;
          const isPast = date < todayStr;
          return (
            <div key={date} className={isPast ? "opacity-[0.85]" : ""}>
              {/* Day header — generous separation above, tight below */}
              <div className="flex items-center gap-3 mb-3.5">
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-bold border ${
                    isToday
                      ? "bg-[#0d9488] text-white border-[#0d9488] shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 shadow-sm"
                  }`}
                >
                  <Calendar size={13} className={isToday ? "text-white/90" : "text-[#0d9488]"} />
                  {fmtDate(date)}
                  {isToday && <span className="bg-white/20 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full mr-1">היום</span>}
                </div>
                <span className="text-xs text-slate-400 hidden sm:inline tabular-nums">{weekdayShort(date)}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" aria-hidden />
                <span className="text-xs text-slate-400 tabular-nums">{dayItems.length} אירועים</span>
              </div>

              {/* Continuous spine + items — tight group, generous day separation handled by outer space-y-8 */}
              <div className="relative pl-0">
                {/* Vertical spine */}
                <div className="absolute right-[17px] top-1 bottom-1 w-px bg-slate-200 hidden sm:block" aria-hidden />
                <div className="flex flex-col gap-3">
                  {dayItems.map((it) => {
                    const Icon = ICONS[it.type] || Sparkles;
                    const isFlight = it.type === "flight";
                    return (
                      <div
                        key={it.id}
                        className={`group relative flex gap-3 sm:gap-3.5 rounded-2xl border bg-white p-3.5 sm:p-4 pr-3 sm:pr-4 transition-all hover:shadow-md hover:border-slate-300 hover:-translate-y-[1px] ${CARD_ACCENT[it.type] || "border-l-slate-200"} border-l-[3px] border-slate-200/80 shadow-sm`}
                      >
                        {/* Timeline node */}
                        <div className="hidden sm:flex flex-col items-center shrink-0 -mr-1">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center ring-4 ring-white ${COLORS[it.type] || "bg-slate-700 text-white"}`}>
                            <Icon size={15} strokeWidth={2} />
                          </div>
                        </div>
                        {/* Mobile icon */}
                        <div className={`sm:hidden w-9 h-9 rounded-full flex items-center justify-center shrink-0 self-start mt-0.5 ${COLORS[it.type] || "bg-slate-700 text-white"}`}>
                          <Icon size={14} />
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Meta row: time + type badge */}
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {it.time && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums tracking-tight text-slate-700 bg-slate-100 rounded-full px-2 py-0.5">
                                <Clock size={11} className="text-slate-500" />
                                {it.time}
                              </span>
                            )}
                            <span className={`text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded ${isFlight ? "bg-orange-50 text-[#F97316] border border-orange-200" : it.type === "hotel" ? "bg-teal-50 text-[#0d9488] border border-teal-200" : "bg-amber-50 text-[#d97706] border border-amber-200"}`}>
                              {LABEL[it.type] || it.type}
                            </span>
                            {isPast && <span className="text-[10px] text-slate-400">· הושלם</span>}
                          </div>

                          <div className="font-bold text-[15px] leading-tight text-slate-900 group-hover:text-slate-950 line-clamp-2">
                            {it.title}
                          </div>
                          {it.detail && (
                            <div className="text-[13px] leading-relaxed text-slate-600 mt-1 flex items-center gap-1.5 min-w-0">
                              <MapPin size={12} className="text-slate-400 shrink-0 hidden sm:inline" />
                              <span className="truncate">{it.detail}</span>
                            </div>
                          )}
                        </div>

                        {/* Subtle hover accent dot */}
                        <div className="hidden sm:block absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#F97316] transition-colors" aria-hidden />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* End cap */}
      <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-dashed border-slate-200">
        <span className="w-2 h-2 rounded-full bg-slate-300" aria-hidden />
        <span className="text-xs text-slate-400 font-medium">סוף הטיימליין · {groupEntries.length} ימים של חוויות</span>
        <span className="w-2 h-2 rounded-full bg-slate-300" aria-hidden />
      </div>
    </div>
  );
}
