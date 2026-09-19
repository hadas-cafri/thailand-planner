"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Printer, HelpCircle, Share2, Bell, Sun, Moon, Calendar, Search, X, Plane, Building2, Utensils, Camera, ShoppingBag, Trees, Sparkles, Palmtree, CalendarDays, Check, Loader2, ChevronDown } from "lucide-react";
import HotelCard from "../components/HotelCard";
import FlightCard from "../components/FlightCard";
import ActivityCard from "../components/ActivityCard";
import Timeline from "../components/Timeline";
import WeatherWidget from "../components/WeatherWidget";
import PackingList from "../components/PackingList";
import BudgetTracker from "../components/BudgetTracker";
import InfoCard from "../components/InfoCard";
import MapViewTab from "../components/MapViewTab";
import LoyaltyVault from "../components/LoyaltyVault";
import NextFlight from "../components/NextFlight";
import TripStats from "../components/TripStats";
import TabBar, { TABS } from "../components/TabBar";
import ConfirmModal from "../components/ConfirmModal";
import { PreFlightChecklist, WeatherTips, ConflictDetector } from "../components/SmartFeatures";
import Toast from "../components/Toast";
import { Hotel, Flight, Activity, TimelineItem, TabKey, LoyaltyEntry, CredentialEntry, TaskItem } from "../types";
import { SEED_FLIGHTS, SEED_HOTELS, SEED_ACTIVITIES } from "../seed";
import TasksWidget from "../components/TasksWidget";
import KosherFood from "../components/KosherFood";
import Passports from "../components/Passports";

const MapView = dynamic(() => import("../components/MapView"), { ssr: false });

function ContentGate({ ready, children }: { ready: boolean; children: React.ReactNode }) {
  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 animate-fade-up">
        <Loader2 size={36} className="animate-spin text-thai-teal mb-3" />
        <p className="text-sm font-medium">טוען את הטיול…</p>
      </div>
    );
  }
  return <>{children}</>;
}

function useSynced<T>(key: string, initial: T, onStatus?: (s: "idle" | "saving" | "saved") => void): [T, (v: T) => void, boolean] {
  const [val, setVal] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  // map local key (thai_x) -> server key (x)
  const serverKey = key.replace(/^thai_/, "");
  const valRef = useRef<T>(val);
  valRef.current = val;
  const savingRef = useRef(false);

  // Load: server first, localStorage fallback
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/load");
        if (res.ok) {
          const d = await res.json();
          if (d && Array.isArray(d[serverKey])) {
            if (!cancelled) { setVal(d[serverKey]); valRef.current = d[serverKey]; }
            localStorage.setItem(key, JSON.stringify(d[serverKey]));
            setLoaded(true);
            return;
          }
        }
      } catch {}
      const saved = localStorage.getItem(key);
      if (saved && !cancelled) {
        try { const p = JSON.parse(saved); setVal(p); valRef.current = p; } catch {}
      }
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [key, serverKey]);

  // Live poll: refresh from server every 15s (so agent edits show up)
  useEffect(() => {
    if (!loaded) return;
    const iv = setInterval(async () => {
      if (savingRef.current) return; // don't clobber in-flight save
      try {
        const res = await fetch("/api/load", { cache: "no-store" });
        if (res.ok) {
          const d = await res.json();
          if (d && Array.isArray(d[serverKey])) {
            const incoming = d[serverKey] as T;
            // only update if structurally different from last known server value
            if (JSON.stringify(incoming) !== JSON.stringify(valRef.current)) {
              setVal(incoming);
              valRef.current = incoming;
            }
          }
        }
      } catch {}
    }, 15000);
    return () => clearInterval(iv);
  }, [key, serverKey, loaded]);

  // Save: localStorage + server (debounced)
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(key, JSON.stringify(val));
    onStatus?.("saving");
    savingRef.current = true;
    const payload: any = {};
    payload[serverKey] = val;
    const t = setTimeout(() => {
      fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(() => onStatus?.("saved"))
        .catch(() => onStatus?.("idle"))
        .finally(() => { savingRef.current = false; setTimeout(() => onStatus?.("idle"), 2000); });
    }, 300);
    return () => clearTimeout(t);
  }, [key, serverKey, val, loaded, onStatus]);

  return [val, setVal, loaded];
}

export default function Home() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("היום");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [hotels, setHotels, hotelsLoaded] = useSynced<Hotel[]>("thai_hotels", SEED_HOTELS, setSaveStatus);
  const [flights, setFlights, flightsLoaded] = useSynced<Flight[]>("thai_flights", SEED_FLIGHTS, setSaveStatus);
  const [activities, setActivities, activitiesLoaded] = useSynced<Activity[]>("thai_activities", SEED_ACTIVITIES, setSaveStatus);
  const [loyalty, setLoyalty, loyaltyLoaded] = useSynced<LoyaltyEntry[]>("thai_loyalty", [], setSaveStatus);
  const [credentials, setCredentials, credLoaded] = useSynced<CredentialEntry[]>("thai_credentials", [], setSaveStatus);
  const [passports, setPassports, passportsLoaded] = useSynced<any[]>("thai_passports", [], setSaveStatus);
  const [tasks, setTasks, tasksLoaded] = useSynced<TaskItem[]>("thai_tasks", [
    { id: "t1", title: "להזמין חב\"ד בצ'אנג מאי", done: false },
    { id: "t2", title: "לבדוק אם ניתן להזמין מיטות נפרדות בקוסמוי (Amari)", done: false },
    { id: "t3", title: "לפני תאריך הביטול לבדוק עלויות", done: false },
  ], setSaveStatus);
  const allLoaded = hotelsLoaded && flightsLoaded && activitiesLoaded && loyaltyLoaded && credLoaded && passportsLoaded && tasksLoaded;

  const cities = useMemo(() => Array.from(new Set(hotels.map((h) => h.city).filter(Boolean))), [hotels]);

  const [hf, setHf] = useState({ id: "", name: "", city: "", checkIn: "", checkOut: "", checkInTime: "", checkOutTime: "", notes: "", link: "", mapLink: "" });
  const [showAddHotel, setShowAddHotel] = useState(false);
  function submitHotel() {
    if (!hf.name || !hf.city) return;
    const isEdit = !!hf.id;
    if (hf.id) setHotels((p) => p.map((h) => (h.id === hf.id ? { ...h, ...hf } : h)));
    else setHotels((p) => [...p, { ...hf, id: crypto.randomUUID() }]);
    setHf({ id: "", name: "", city: "", checkIn: "", checkOut: "", checkInTime: "", checkOutTime: "", notes: "", link: "", mapLink: "" });
    showToast(isEdit ? "המלון עודכן" : "המלון נוסף", "success");
  }

  const [ff, setFf] = useState({ id: "", airline: "", flightNo: "", from: "", to: "", fromCode: "", toCode: "", date: "", depart: "", arrive: "", status: "planned", pnr: "", bookingRef: "", link: "", note: "", passengers: [] as any[] });
  const [showAddFlight, setShowAddFlight] = useState(false);
  const [ffText, setFfText] = useState("");
  const [ffLoading, setFfLoading] = useState(false);
  async function parseFlight() {
    if (!ffText.trim()) return;
    setFfLoading(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ffText, mode: "flights" }),
      });
      const d = await res.json();
      const f = d?.extracted?.flights?.[0];
      if (f) {
        setFf((p) => ({ ...p, airline: f.airline || p.airline, flightNo: f.flightNo || p.flightNo, from: f.from || p.from, to: f.to || p.to, date: f.date || p.date, depart: f.depart || p.depart, arrive: f.arrive || p.arrive, pnr: f.pnr || p.pnr }));
        setFfText("");
      }
    } catch {} finally { setFfLoading(false); }
  }
  function resetFlight() {
    setFf({ id: "", airline: "", flightNo: "", from: "", to: "", fromCode: "", toCode: "", date: "", depart: "", arrive: "", status: "planned", pnr: "", bookingRef: "", link: "", note: "", passengers: [] });
  }
  function submitFlight() {
    if (!ff.airline || !ff.from || !ff.to) return;
    const isEdit = !!ff.id;
    if (ff.id) setFlights((p) => p.map((f) => (f.id === ff.id ? { ...f, ...ff } : f)));
    else setFlights((p) => [...p, { ...ff, id: crypto.randomUUID() }]);
    setFf({ id: "", airline: "", flightNo: "", from: "", to: "", fromCode: "", toCode: "", date: "", depart: "", arrive: "", status: "planned", pnr: "", bookingRef: "", link: "", note: "", passengers: [] });
    showToast(isEdit ? "הטיסה עודכנה" : "הטיסה נוספה", "success");
  }

  const [af, setAf] = useState({ id: "", date: "", time: "", title: "", location: "", detail: "", category: "other" as any, cost: "" });
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [confirm, setConfirm] = useState<{ type: string; id: string; label: string } | null>(null);
  const [fxRate, setFxRate] = useState<number | null>(null);
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  function showToast(msg: string, type: "success" | "error" | "info" = "success") {
    setToast({ msg, type });
  }

  // Load FX rate (THB -> ILS) once
  useEffect(() => {
    fetch("/api/fx").then((r) => r.json()).then((d) => { if (d && d.rate) setFxRate(parseFloat(d.rate)); }).catch(() => {});
  }, []);

  // Browser notification for next flight (once)
  useEffect(() => {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "granted" && flights.length > 0) {
      const today = new Date().toISOString().slice(0, 10);
      const next = flights.filter((f) => f.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
      if (next) {
        const diffH = (new Date(`${next.date}T${next.depart}`)).getTime() - Date.now();
        if (diffH > 0 && diffH < 48 * 3600000) {
          new Notification("תאילנד 2026", { body: `טיסה ${next.flightNo} בעוד ${Math.round(diffH / 3600000)} שעות` });
        }
      }
    }
  }, [flights]);

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Hide scroll hint after user scrolls down a bit
  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 80) setShowScrollHint(false); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  function submitActivity() {
    if (!af.title || !af.date) return;
    const isEdit = !!af.id;
    if (af.id) setActivities((p) => p.map((a) => (a.id === af.id ? { ...a, ...af } : a)));
    else setActivities((p) => [...p, { ...af, id: crypto.randomUUID() }]);
    setAf({ id: "", date: "", time: "", title: "", location: "", detail: "", category: "other" as any, cost: "" });
    showToast(isEdit ? "הפעילות עודכנה" : "הפעילות נוספה", "success");
  }

  function exportICS() {
    const pad = (n: number) => String(n).padStart(2, "0");
    const fmt = (d: string, t = "00:00") => {
      const [y, m, day] = d.split("-");
      const [hh, mm] = t.split(":");
      return `${y}${pad(+m)}${pad(+day)}T${pad(+hh)}${pad(+mm)}00`;
    };
    let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ThailandPlanner//IL\n";
    flights.forEach((f) => {
      ics += `BEGIN:VEVENT\nUID:${f.id}@thai\nSUMMARY:${f.airline} ${f.flightNo} (${f.from}→${f.to})\nDTSTART:${fmt(f.date, f.depart)}\nDTEND:${fmt(f.date, f.arrive || f.depart)}\n${f.pnr ? `DESCRIPTION:PNR ${f.pnr}\n` : ""}END:VEVENT\n`;
    });
    activities.forEach((a) => {
      ics += `BEGIN:VEVENT\nUID:${a.id}@thai\nSUMMARY:${a.title}\nDTSTART:${fmt(a.date, a.time || "09:00")}\nDTEND:${fmt(a.date, a.time || "10:00")}\n${a.location ? `LOCATION:${a.location}\n` : ""}END:VEVENT\n`;
    });
    ics += "END:VCALENDAR";
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "thailand-2026.ics"; a.click();
    URL.revokeObjectURL(url);
  }

  const timeline: TimelineItem[] = useMemo(() => {
    const items: TimelineItem[] = [];
    flights.forEach((f) => items.push({ id: f.id, date: f.date, time: f.depart, title: `טיסה ${f.flightNo}: ${f.from} → ${f.to}`, type: "flight", detail: `${f.airline}` }));
    hotels.forEach((h) => {
      // For Chiang Mai 24.09 arrival day, push hotel after TG112 arrival 16:15
      let t = h.checkInTime || "15:00";
      if (h.checkIn === "2026-09-24" && h.city.includes("צ'אנג מאי")) t = h.checkInTime || "17:30";
      items.push({ id: h.id, date: h.checkIn, time: t, title: `צ'ק-אין: ${h.name}`, type: "hotel", detail: `${h.city} · עד ${h.checkOut}` });
    });
    activities.forEach((a) => {
      // Don't show wishlist placeholders in timeline - only confirmed activities
      if (a.detail && a.detail.includes("⭐ מרשימת המשאלות")) return;
      items.push({ id: a.id, date: a.date, time: a.time, title: a.title, type: "activity", detail: a.location });
    });
    return items.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return (a.time || "00:00").localeCompare(b.time || "00:00");
    });
  }, [flights, hotels, activities]);

  // Global search filter
  const q = search.trim().toLowerCase();
  const matches = (s: string) => s.toLowerCase().includes(q);
  const flightsF = q ? flights.filter((f) => matches(`${f.airline} ${f.flightNo} ${f.from} ${f.to} ${f.pnr}`)) : flights;
  const hotelsF = q ? hotels.filter((h) => matches(`${h.name} ${h.city} ${h.notes}`)) : hotels;
  const activitiesF = q ? activities.filter((a) => matches(`${a.title} ${a.location} ${a.detail}`)) : activities;

  const inputCls = "input";

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-8">
      <header className="app-header text-center mb-6 no-print">
        <h1 className="text-[32px] sm:text-[36px] font-extrabold tracking-[-0.03em] leading-none flex items-center justify-center gap-2.5"><span className="text-[28px]">🇹🇭</span> תאילנד 2026</h1>
        <p className="mt-2 text-[13px] font-medium tracking-wide text-slate-500">מערכת תכנון הטיול — הכל במקום אחד</p>
        <div className="flex flex-wrap gap-2 justify-center mt-5 max-w-[640px] mx-auto">
          <button className="btn bg-white text-slate-700 hover:bg-slate-50 text-[13px] font-semibold shadow-sm border border-slate-200" onClick={() => router.push("/print")}><Printer size={14} className="inline ml-1 opacity-70" /> PDF</button>
          <button className="btn bg-white text-slate-700 hover:bg-slate-50 text-[13px] font-semibold shadow-sm border border-slate-200" onClick={() => router.push("/help")}><HelpCircle size={14} className="inline ml-1 opacity-70" /> עזרה</button>
          <button className="btn bg-white text-slate-700 hover:bg-slate-50 text-[13px] font-semibold shadow-sm border border-slate-200" onClick={() => router.push("/share")}><Share2 size={14} className="inline ml-1 opacity-70" /> שתף</button>
          <button className="btn bg-white text-slate-600 hover:bg-slate-50 text-[13px] shadow-sm border border-slate-200 px-3" title="התראות" onClick={() => { if (typeof Notification !== "undefined" && Notification.permission !== "granted") Notification.requestPermission(); }}><Bell size={14} className="inline" /></button>
          <button className="btn bg-white text-slate-600 hover:bg-slate-50 text-[13px] shadow-sm border border-slate-200 px-3" title={dark ? "מצב רגיל" : "מצב כהה"} onClick={() => setDark((d) => !d)}>{dark ? <Sun size={14} className="inline" /> : <Moon size={14} className="inline" />}</button>
          <button className="btn bg-white text-slate-700 hover:bg-slate-50 text-[13px] font-semibold shadow-sm border border-slate-200" onClick={exportICS}><Calendar size={14} className="inline ml-1 opacity-70" /> יומן</button>
          <button className="btn bg-[#F97316] text-white hover:bg-[#ea6d15] text-[13px] font-bold shadow-[0_2px_8px_rgba(249,115,22,0.35)]" onClick={() => router.push("/calendar")}><CalendarDays size={14} className="inline ml-1" /> לוח שנה</button>
        </div>
        <div className="mt-3 h-4 text-xs font-medium text-slate-400 flex items-center justify-center gap-1.5 tabular-nums">
          {saveStatus === "saving" && <><Loader2 size={12} className="inline animate-spin text-slate-400" /> שומר…</>}
          {saveStatus === "saved" && <><Check size={12} className="inline text-emerald-500" /> נשמר בענן</>}
        </div>
      </header>

      <NextFlight flights={flights} />

      <ContentGate ready={allLoaded}>
      <TasksWidget tasks={tasks} setTasks={setTasks} />
      <TripStats flights={flights} hotels={hotels} activities={activities} />
      <div className="card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3.5 mb-5 bg-gradient-to-br from-orange-50 via-white to-teal-50/60 border-orange-200/70 shadow-sm animate-fade-up">
        <div className="text-center sm:text-right">
          <h3 className="font-extrabold text-[15px] text-slate-900 flex items-center justify-center sm:justify-start gap-2 tracking-tight"><span className="w-8 h-8 rounded-xl bg-[#F97316] text-white flex items-center justify-center shadow-sm"><CalendarDays size={15} /></span> לוח שנה עברי · תשרי תשפ&quot;ז</h3>
          <p className="text-[13px] text-slate-500 mt-1.5 font-medium">20.09–17.10 · יום כיפור, סוכות, טיסות וכל התכנון במקום אחד</p>
        </div>
        <button onClick={() => router.push("/calendar")} className="btn bg-[#F97316] text-white hover:bg-[#ea6d15] font-bold shadow-[0_2px_8px_rgba(249,115,22,0.30)] whitespace-nowrap px-6 py-2.5 text-sm rounded-xl shrink-0">פתחי לוח שנה ←</button>
      </div>
      <ConflictDetector flights={flights} activities={activities} />

      {/* GLOBAL SEARCH */}
      <div className="relative mb-5">
        <input
          className="input w-full pl-9 pr-9 shadow-sm text-[14px] placeholder:text-slate-400"
          placeholder="חפש טיסה, מלון או פעילות…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        {search && (
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition" onClick={() => setSearch("")} aria-label="נקה חיפוש">
            <X size={14} />
          </button>
        )}
      </div>

      {/* TabBar handles both mobile + desktop now */}
      <TabBar active={tab} onChange={(t) => { if (t === "עזרה") router.push("/help"); else setTab(t); }} />

      {/* TODAY */}
      {tab === "היום" && (() => {
        const today = new Date().toISOString().slice(0, 10);
        const todays = [
          ...flights.filter((f) => f.date === today).map((f) => ({ type: "flight" as const, icon: <Plane size={18} className="text-[#F97316]" />, time: f.depart, title: `${f.airline} ${f.flightNo}: ${f.from} → ${f.to}`, sub: f.status === "booked" ? "הוזמנה" : "מתוכננת" })),
          ...hotels.filter((h) => h.checkIn === today || h.checkOut === today).map((h) => ({ type: "hotel" as const, icon: <Building2 size={18} className="text-[#0d9488]" />, time: h.checkIn === today ? "צ'ק-אין" : "צ'ק-אאוט", title: h.name, sub: h.city })),
          ...activities.filter((a) => a.date === today).map((a) => ({ type: "activity" as const, icon: a.category === "food" ? <Utensils size={18} className="text-[#d97706]" /> : a.category === "sight" ? <Camera size={18} className="text-violet-600" /> : a.category === "shop" ? <ShoppingBag size={18} className="text-violet-600" /> : a.category === "nature" ? <Trees size={18} className="text-emerald-600" /> : <Sparkles size={18} className="text-amber-600" />, time: a.time || "", title: a.title, sub: a.location || "" })),
        ].sort((a, b) => (a.time || "").localeCompare(b.time || ""));
        return (
          <section className="space-y-4 tab-fade">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3.5 py-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
                <span className="text-[13px] font-semibold text-slate-700">היום · {new Date().toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}</span>
              </div>
            </div>
            {todays.length === 0 ? (
              <div className="card p-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto mb-3">
                  <Palmtree size={22} className="text-[#0d9488]" />
                </div>
                <p className="font-bold text-slate-800">אין אירועים מתוכננים להיום</p>
                <p className="text-sm text-slate-500 mt-1">תהני מהחופשה!</p>
              </div>
            ) : (
              todays.map((t, i) => (
                <div key={i} className="card p-4 flex items-center gap-3.5 animate-fade-up border-l-[3px] border-l-slate-200 hover:border-l-[#0d9488] transition-colors">
                  <div className="w-[68px] text-center shrink-0">
                    <div className="text-[13px] font-bold tabular-nums tracking-tight text-slate-900">{t.time || "—"}</div>
                    <div className="text-[11px] font-medium text-slate-400">שעה</div>
                  </div>
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">{t.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[14px] leading-tight text-slate-900 truncate">{t.title}</div>
                    {t.sub && <div className="text-xs font-medium text-slate-500 mt-0.5">{t.sub}</div>}
                  </div>
                </div>
              ))
            )}
            <div className="text-center pt-1">
              <button className="btn btn-ghost text-sm font-semibold" onClick={() => setTab("טיימליין")}><CalendarDays size={14} className="inline ml-1.5" /> צפי בכל הטיול</button>
            </div>
          </section>
        );
      })()}

      {/* FLIGHTS */}
      {tab === "טיסות" && (
        <section className="space-y-4 tab-fade">
          <div className="flex justify-end">
            <button onClick={() => setShowAddFlight(!showAddFlight)} className="btn btn-ghost text-sm border bg-white hover:bg-gray-50">
              {showAddFlight ? "× סגור" : "+ הוספה ידנית"}
            </button>
          </div>
          {showAddFlight && (
            <>
              <div className="card p-4 space-y-2">
            <p className="text-sm font-semibold text-thai-deep">הדבק טקסט או פרטים מצילום מסך:</p>
            <textarea
              className={inputCls + " h-20"}
              placeholder="למשל: Thai Airways TG 112 בנגקוק לצ'יאנג מאי 24.9.2026 14:55"
              value={ffText}
              onChange={(e) => setFfText(e.target.value)}
            />
            <button className="btn btn-ghost text-sm" onClick={parseFlight} disabled={ffLoading}>
              {ffLoading ? "מחלץ…" : <><Sparkles size={16} className="inline ml-1" /> חלץ אוטומטית</>}
            </button>
          </div>
          <div className="card p-4 grid grid-cols-1 md:grid-cols-9 gap-2 animate-fade-up">
            <input className={inputCls} placeholder="חברה" value={ff.airline} onChange={(e) => setFf({ ...ff, airline: e.target.value })} />
            <input className={inputCls} placeholder="מס׳ טיסה" value={ff.flightNo} onChange={(e) => setFf({ ...ff, flightNo: e.target.value })} />
            <input className={inputCls} placeholder="מוצא" value={ff.from} onChange={(e) => setFf({ ...ff, from: e.target.value })} />
            <input className={inputCls} placeholder="יעד" value={ff.to} onChange={(e) => setFf({ ...ff, to: e.target.value })} />
            <input className={inputCls} type="date" value={ff.date} onChange={(e) => setFf({ ...ff, date: e.target.value })} />
            <div className="flex gap-2 w-full">
              <input className={inputCls} type="time" value={ff.depart} onChange={(e) => setFf({ ...ff, depart: e.target.value })} placeholder="יציאה" />
              <input className={inputCls} type="time" value={ff.arrive} onChange={(e) => setFf({ ...ff, arrive: e.target.value })} placeholder="הגעה" />
            </div>
            <input className={inputCls} placeholder="PNR" value={ff.pnr} onChange={(e) => setFf({ ...ff, pnr: e.target.value })} />
            <input className={inputCls} placeholder="קוד הזמנה (Booking Ref)" value={ff.bookingRef} onChange={(e) => setFf({ ...ff, bookingRef: e.target.value })} />
            <select className={inputCls} value={ff.status} onChange={(e) => setFf({ ...ff, status: e.target.value as any })}><option value="planned">מתוכננת</option><option value="booked">הוזמנה</option></select>
            <button className="btn btn-primary md:col-span-2" onClick={submitFlight}>{ff.id ? "עדכן" : "הוסף"}</button>
            {ff.id && <button className="btn btn-ghost text-sm md:col-span-1" onClick={resetFlight}>בטל</button>}
            <input className={inputCls + " md:col-span-9"} placeholder="קישור לניהול הזמנה (אופציונלי)" value={ff.link} onChange={(e) => setFf({ ...ff, link: e.target.value })} />
          </div>
            </>
          )}
          <div className="grid md:grid-cols-2 gap-4 stagger">
            {flightsF.map((f) => (
              <FlightCard key={f.id} flight={f} onEdit={(fl) => { setFf({ ...fl }); setShowAddFlight(true); }} onDelete={(id) => setConfirm({ type: "flights", id, label: `טיסת ${f.flightNo}` })} />
            ))}
            {flights.length === 0 && (
              <p className="text-gray-500 text-center col-span-2 py-10 flex flex-col items-center"><Plane size={28} className="mb-2 text-thai-teal/60" /> אין עדיין טיסות.<br />הוסיפי את הטיסה הראשונה למעלה</p>
            )}
          </div>
        </section>
      )}

      {/* HOTELS */}
      {tab === "מלונות" && (
        <section className="space-y-4 tab-fade">
          <div className="card p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-blue-900">
              <span className="font-bold">כל ההזמנות ב-EL AL Travel</span> · כניסה מהירה לניהול כל המלונות
            </div>
            <a
              href="https://travel.elal.com/bookings?saml_verified=1"
              target="_blank"
              rel="noreferrer"
              className="btn bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold whitespace-nowrap"
            >
              פתחי EL AL Travel →
            </a>
          </div>
          <div className="flex justify-end">
            <button onClick={() => setShowAddHotel(!showAddHotel)} className="btn btn-ghost text-sm border bg-white hover:bg-gray-50">
              {showAddHotel ? "× סגור" : "+ הוספה ידנית"}
            </button>
          </div>
          {showAddHotel && (
            <div className="card p-4 grid grid-cols-1 md:grid-cols-6 gap-2">
            <input className={inputCls} placeholder="שם המלון" value={hf.name} onChange={(e) => setHf({ ...hf, name: e.target.value })} />
            <input className={inputCls} placeholder="עיר" value={hf.city} onChange={(e) => setHf({ ...hf, city: e.target.value })} />
            <input className={inputCls} type="date" value={hf.checkIn} onChange={(e) => setHf({ ...hf, checkIn: e.target.value })} />
            <input className={inputCls} type="date" value={hf.checkOut} onChange={(e) => setHf({ ...hf, checkOut: e.target.value })} />
            <input className={inputCls} placeholder="הערות" value={hf.notes} onChange={(e) => setHf({ ...hf, notes: e.target.value })} />
            <button className="btn btn-primary" onClick={submitHotel}>{hf.id ? "עדכן" : "הוסף"}</button>
            {hf.id && <button className="btn btn-ghost text-sm" onClick={() => setHf({ id: "", name: "", city: "", checkIn: "", checkOut: "", checkInTime: "", checkOutTime: "", notes: "", link: "", mapLink: "" })}>בטל</button>}
            <input className={inputCls + " md:col-span-3"} placeholder="קישור לאתר/הזמנה" value={hf.link} onChange={(e) => setHf({ ...hf, link: e.target.value })} />
            <input className={inputCls + " md:col-span-6"} placeholder="קישור למפה (Google Maps)" value={hf.mapLink} onChange={(e) => setHf({ ...hf, mapLink: e.target.value })} />
          </div>
          )}
          <div className="grid md:grid-cols-3 gap-4 stagger">
            {hotelsF.map((h) => (
              <HotelCard key={h.id} hotel={h} onEdit={(ho) => { setHf({ ...ho }); setShowAddHotel(true); }} onDelete={(id) => setConfirm({ type: "hotels", id, label: h.name })} onUpload={(id, dataUrl) => setHotels((p) => p.map((x) => (x.id === id ? { ...x, imageData: dataUrl } : x)))} />
            ))}
            {hotels.length === 0 && (
              <p className="text-gray-500 text-center col-span-3 py-10 flex flex-col items-center"><Building2 size={28} className="mb-2 text-thai-teal/60" /> אין עדיין מלונות.<br />הוסיפי מלון ראשון למעלה</p>
            )}
          </div>
        </section>
      )}

      {/* ACTIVITIES — polished */}
      {tab === "פעילויות" && (
        <section className="space-y-5 tab-fade" dir="rtl">
          {/* header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="text-[22px] font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-slate-900 text-white grid place-items-center"><Sparkles size={16} /></span>
                פעילויות
                <span className="text-sm font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">{activitiesF.length}</span>
              </h2>
              <p className="text-sm text-slate-500 mt-1">מסודר לפי יעד · חיפוש גלובלי מסנן גם כאן</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-slate-400">{activities.length} סה&quot;כ · {Object.keys(activitiesF.reduce((a:any,c)=>{a[c.location||"כללי"]=1;return a},{})).length} יעדים</span>
              <button
                onClick={() => setShowAddActivity(!showAddActivity)}
                className={`btn text-sm font-semibold ${showAddActivity ? "btn-ghost" : "bg-slate-900 text-white hover:bg-black shadow-sm"}`}
              >
                {showAddActivity ? "× סגור" : "+ הוספת פעילות"}
              </button>
            </div>
          </div>

          {showAddActivity && (
            <div className="card p-4 sm:p-5 animate-fade-up">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-900">{af.id ? "עריכת פעילות" : "פעילות חדשה"}</p>
                <span className="text-xs text-slate-400">שדות חובה: תאריך + כותרת</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5">
                <input className={inputCls} type="date" value={af.date} onChange={(e) => setAf({ ...af, date: e.target.value })} />
                <input className={inputCls} type="time" value={af.time} onChange={(e) => setAf({ ...af, time: e.target.value })} />
                <input className={inputCls + " col-span-2 md:col-span-2"} placeholder="כותרת — לדוג׳ שייט לילה" value={af.title} onChange={(e) => setAf({ ...af, title: e.target.value })} />
                <input className={inputCls + " col-span-2 md:col-span-2"} placeholder="מיקום — לדוג׳ צ׳אנג מאי" value={af.location} onChange={(e) => setAf({ ...af, location: e.target.value })} list="city-suggestions" />
                <datalist id="city-suggestions"><option value="צ'אנג מאי" /><option value="פאי" /><option value="קוסמוי" /><option value="בנגקוק" /><option value="קנצ'נבורי" /></datalist>
                <select className={inputCls} value={af.category} onChange={(e) => setAf({ ...af, category: e.target.value as any })}>
                  <option value="other">כללי</option>
                  <option value="sight">אתר</option>
                  <option value="food">אוכל</option>
                  <option value="nature">טבע</option>
                  <option value="shop">קניות</option>
                </select>
                <input className={inputCls} type="number" placeholder="עלות ฿" value={af.cost} onChange={(e) => setAf({ ...af, cost: e.target.value })} />
                <input className={inputCls + " col-span-2 md:col-span-6"} placeholder="פירוט קצר — נקודת מפגש, הערות, לינק יתווסף אוטומטית למפה" value={af.detail} onChange={(e) => setAf({ ...af, detail: e.target.value })} />
              </div>
              <div className="flex gap-2 mt-3 justify-end">
                {af.id && <button className="btn btn-ghost text-sm" onClick={() => setAf({ id: "", date: "", time: "", title: "", location: "", detail: "", category: "other" as any, cost: "" })}>בטל</button>}
                <button className="btn bg-slate-900 text-white hover:bg-black text-sm font-semibold px-6" onClick={submitActivity}>{af.id ? "שמור שינויים" : "הוספה"}</button>
              </div>
            </div>
          )}

          {(() => {
            const groups: Record<string, typeof activitiesF> = {};
            activitiesF.forEach((a) => {
              const key = a.location || "כללי";
              if (!groups[key]) groups[key] = [];
              groups[key].push(a);
            });
            // sort within each group by date/time
            Object.values(groups).forEach((arr) => arr.sort((a,b) => (a.date + (a.time||"")).localeCompare(b.date + (b.time||""))));
            const order = ["צ'אנג מאי", "פאי", "קוסמוי", "בנגקוק", "קנצ'נבורי", "כללי"];
            const sortedKeys = Object.keys(groups).sort((a, b) => {
              const ia = order.indexOf(a), ib = order.indexOf(b);
              if (ia === -1 && ib === -1) return a.localeCompare(b);
              if (ia === -1) return 1;
              if (ib === -1) return -1;
              return ia - ib;
            });
            const accent: Record<string,string> = {"צ'אנג מאי":"bg-orange-500","פאי":"bg-emerald-500","קוסמוי":"bg-sky-500","בנגקוק":"bg-violet-500","קנצ'נבורי":"bg-amber-500","כללי":"bg-slate-400"};
            const emoji: Record<string,string> = {"צ'אנג מאי":"🏯","פאי":"🏞️","קוסמוי":"🏝️","בנגקוק":"🏙️","קנצ'נבורי":"🌉","כללי":"📍"};
            if (activitiesF.length === 0) {
              return (
                <div className="card p-10 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 grid place-items-center mx-auto mb-3"><Sparkles size={20} className="text-slate-400" /></div>
                  <p className="font-semibold text-slate-900">{search ? "אין תוצאות לחיפוש" : "עוד אין פעילויות"}</p>
                  <p className="text-sm text-slate-500 mt-1">{search ? "נסי מילת חיפוש אחרת" : "הוסיפי פעילות ראשונה — היא תתמיין אוטומטית לפי יעד ותאריך"}</p>
                </div>
              );
            }
            return (
              <div className="space-y-5 stagger">
                {sortedKeys.map((loc) => (
                  <div key={loc} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50/70 border-b border-slate-200">
                      <span className={`w-1.5 h-6 rounded-full ${accent[loc]||"bg-slate-400"}`} aria-hidden />
                      <span className="text-base">{emoji[loc]||"📍"}</span>
                      <h3 className="font-bold text-[14px] tracking-tight text-slate-900">{loc}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">{groups[loc].length}</span>
                      <span className="mr-auto hidden sm:inline text-xs text-slate-400">{groups[loc][0]?.date ? `${groups[loc][0].date} → ${groups[loc][groups[loc].length-1].date}` : ""}</span>
                    </div>
                    <div className="p-3 sm:p-3.5 grid md:grid-cols-2 gap-3 bg-slate-50/30">
                      {groups[loc].map((a) => (
                        <ActivityCard key={a.id} activity={a} fxRate={fxRate} onEdit={(ac) => { setAf({ ...ac }); setShowAddActivity(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} onDelete={(id) => setConfirm({ type: "activities", id, label: a.title })} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </section>
      )}

      {/* WEATHER */}
      {tab === "מזג אוויר" && (
        <section className="grid md:grid-cols-3 gap-4 tab-fade">
          {cities.length === 0 && <p className="text-gray-500">הוסף מלונות עם ערים כדי לראות מזג אוויר</p>}
          {cities.map((c) => <WeatherWidget key={c} city={c} />)}
          <WeatherTips cities={cities} />
        </section>
      )}

      {/* MAP */}
      {tab === "מפה" && (
        <section className="card p-4 tab-fade">
          <MapViewTab hotels={hotels} />
        </section>
      )}

      {/* BUDGET */}
      {tab === "תקציב" && <BudgetTracker />}

      {/* PACKING */}
      {tab === "ציוד" && <PackingList />}

      {/* INFO */}
      {tab === "מידע" && <InfoCard />}

      {/* TIMELINE */}
      {tab === "טיימליין" && (
        <section className="card p-4 sm:p-6 tab-fade">
          <Timeline items={timeline} />
        </section>
      )}
      {/* NUMBERS & PASSWORDS */}
      {tab === "מספרים" && (
        <section className="tab-fade">
          <LoyaltyVault loyalty={loyalty} credentials={credentials} onUpdateLoyalty={setLoyalty} onUpdateCredentials={setCredentials} />
        </section>
      )}
      {/* KOSHER FOOD */}
      {tab === "אוכל כשר" && (
        <section className="tab-fade">
          <KosherFood />
        </section>
      )}
      {/* PASSPORTS */}
      {tab === "דרכונים" && (
        <section className="tab-fade">
          <Passports data={passports} />
        </section>
      )}
      </ContentGate>

      {showScrollHint && (
        <button
          onClick={() => window.scrollBy({ top: 400, behavior: "smooth" })}
          className="md:hidden fixed bottom-28 inset-x-0 mx-auto w-fit z-40 flex flex-col items-center text-thai-teal/70 no-print animate-fade-up"
          aria-label="גלול למטה"
        >
          <ChevronDown size={28} className="scroll-hint" />
          <span className="text-[11px] font-medium mt-0.5">גלול לעוד</span>
        </button>
      )}

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="md:hidden fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full bg-thai-orange text-white shadow-lg flex items-center justify-center text-2xl active:scale-95 transition"
        aria-label="למעלה"
      >
        ↑
      </button>
      <button
        onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setTimeout(() => { const el = document.querySelector("input"); if (el) (el as HTMLInputElement).focus(); }, 300); }}
        className="md:hidden fixed bottom-20 left-4 z-50 w-14 h-14 rounded-full bg-thai-teal text-white shadow-lg flex items-center justify-center text-3xl active:scale-95 transition fab-pulse"
        aria-label="הוסף"
      >
        +
      </button>

      <ConfirmModal
        open={!!confirm}
        title="אישור מחיקה"
        message={`האם למחוק את "${confirm?.label || ""}"? פעולה זו אינה ניתנת לביטול.`}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (!confirm) return;
          if (confirm.type === "flights") setFlights((p) => p.filter((x) => x.id !== confirm.id));
          if (confirm.type === "hotels") setHotels((p) => p.filter((x) => x.id !== confirm.id));
          if (confirm.type === "activities") setActivities((p) => p.filter((x) => x.id !== confirm.id));
          setConfirm(null);
          showToast("נמחק בהצלחה", "success");
        }}
      />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}
