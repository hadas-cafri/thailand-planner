"use client";

import { MapPin, Sparkles, Pencil, Trash2, Utensils, Camera, ShoppingBag, Trees, ExternalLink, Navigation, Clock3 } from "lucide-react";
import { Activity } from "../types";

const CATS: Record<string, { icon: any; label: string; accent: string; dot: string; bg: string }> = {
  food: { icon: Utensils, label: "אוכל", accent: "border-orange-300", dot: "bg-orange-500", bg: "bg-orange-50 text-orange-700 border-orange-200" },
  sight: { icon: Camera, label: "אתר", accent: "border-sky-300", dot: "bg-sky-500", bg: "bg-sky-50 text-sky-700 border-sky-200" },
  shop: { icon: ShoppingBag, label: "קניות", accent: "border-fuchsia-300", dot: "bg-fuchsia-500", bg: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200" },
  nature: { icon: Trees, label: "טבע", accent: "border-emerald-300", dot: "bg-emerald-500", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  other: { icon: Sparkles, label: "כללי", accent: "border-amber-300", dot: "bg-amber-500", bg: "bg-amber-50 text-amber-800 border-amber-200" },
};

function formatDate(d: string) {
  if (!d) return "";
  try {
    const dt = new Date(d + "T12:00:00");
    return dt.toLocaleDateString("he-IL", { weekday: "short", day: "numeric", month: "short" });
  } catch {
    return d;
  }
}

export default function ActivityCard({
  activity,
  onEdit,
  onDelete,
  fxRate,
}: {
  activity: Activity;
  onEdit: (a: Activity) => void;
  onDelete: (id: string) => void;
  fxRate?: number | null;
}) {
  const cat = CATS[activity.category || "other"];
  const Icon = cat.icon;
  const ils = activity.cost && fxRate ? (parseFloat(String(activity.cost)) * fxRate).toFixed(0) : null;
  const mapUrl = activity.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location + " Thailand")}`
    : null;

  const isWishlist = activity.detail?.includes("⭐ מרשימת המשאלות");

  return (
    <div
      className={`group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300/80 hover:-translate-y-[1px] transition-all duration-200 overflow-hidden flex flex-col ${isWishlist ? "opacity-[0.92] border-dashed" : ""}`}
    >
      {/* left accent */}
      <div className={`absolute inset-y-0 right-0 w-[3px] ${cat.dot} opacity-80`} aria-hidden />

      <div className="p-4 pr-5 flex flex-col gap-2.5">
        {/* top */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className={`w-9 h-9 rounded-xl ${cat.bg} border flex items-center justify-center shrink-0 mt-0.5`}>
              <Icon size={16} strokeWidth={1.9} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-[14.5px] leading-5 text-slate-900 tracking-tight line-clamp-2">{activity.title}</div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Clock3 size={12} className="opacity-60" />
                  {formatDate(activity.date)}
                  {activity.time ? ` · ${activity.time}` : ""}
                </span>
                {isWishlist && (
                  <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">מרשימת המשאלות</span>
                )}
              </div>
              {activity.location && (
                <div className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] text-slate-600 leading-none">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">{activity.location}</span>
                  {mapUrl && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="פתח במפות"
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white hover:bg-black transition shrink-0"
                    >
                      <Navigation size={11} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 -mt-0.5 -ml-1">
            <button
              onClick={() => onEdit(activity)}
              aria-label="ערוך"
              className="w-8 h-8 grid place-items-center rounded-full hover:bg-slate-100 text-slate-600 transition"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(activity.id)}
              aria-label="מחק"
              className="w-8 h-8 grid place-items-center rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {activity.detail && !isWishlist && (
          <p className="text-[13px] leading-5 text-slate-600 line-clamp-3 pr-12">{activity.detail}</p>
        )}
        {isWishlist && activity.detail && (
          <p className="text-[12px] leading-5 text-slate-500 pr-12 italic">{activity.detail}</p>
        )}

        {/* footer meta */}
        <div className="flex items-center justify-between gap-2 pr-12 pt-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full border ${cat.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
              {cat.label}
            </span>
            {activity.cost ? (
              <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white">
                ฿{activity.cost}
                {ils ? <span className="opacity-70 font-medium mr-1">· ₪{ils}</span> : null}
              </span>
            ) : null}
          </div>
          {activity.link && (
            <a
              href={activity.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-800 hover:underline"
            >
              <ExternalLink size={11} /> קישור
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
