"use client";
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Utensils,
  Star,
  ShieldCheck,
  Info,
  Lightbulb,
  Navigation,
  CheckCircle2,
  MessageCircle,
  Building2,
  AlertTriangle,
} from "lucide-react";

type KosherPlace = {
  name: string;
  type: string;
  address: string;
  phone?: string;
  hours?: string;
  note: string;
  mapQuery: string;
  rating?: string;
};

type KosherSection = {
  city: string;
  dates: string;
  places: KosherPlace[];
  tips: string[];
};

const DATA: KosherSection[] = [
  {
    city: "צ׳אנג מאי",
    dates: "24.09–01.10 · 7 לילות, כולל פאי 27–29",
    places: [
      {
        name: "בית חב״ד צ׳אנג מאי",
        type: "בית חב״ד • מסעדה כשרה",
        address: "33/6 Loi Kor Rd, Chiang Mai",
        phone: "+66 53 814 110",
        hours: "א׳–ה׳ 09:00–22:00 · ו׳ עד כניסת שבת · מוצ״ש פתוח",
        note: "ארוחות שבת, אוכל מוכן לקחת לטיול פאי, מאפים. הזמנה מראש לשבת חובה!",
        mapQuery: "Chabad House Chiang Mai",
        rating: "4.7",
      },
      {
        name: "Kosher Grill Chiang Mai (בחב״ד)",
        type: "מסעדה בשרית כשרה",
        address: "בתוך בית חב״ד",
        note: "שווארמה, שניצלים, חומוס, פלאפל — מנות לקחת לדרך",
        mapQuery: "Chabad House Chiang Mai",
      },
    ],
    tips: ["הזמיני ארוחות קפואות לטיול פאי מראש (500 באט/ארוחה)", "יש מכולת קטנה בחב״ד עם מוצרים מהארץ", "שבת: סעודות בתשלום — הרשמה בוואטסאפ"],
  },
  {
    city: "פאי",
    dates: "27–29.09 · טיול רד בריק",
    places: [
      {
        name: "אין בית חב״ד / מסעדה כשרה בפאי",
        type: "היערכות מראש",
        address: "פאי — עיירה קטנה",
        note: "מביאים אוכל כשר מצ׳אנג מאי (חב״ד) + מנות קפואות. רד בריק מאפשרים לבשל/לחמם.",
        mapQuery: "Pai Thailand",
      },
    ],
    tips: ["קחי 2–3 מנות קפואות מחב״ד צ׳אנג מאי לכל אחד", "פירות, אורז וירקות טריים יש בכל מקום בפאי", "תיאום עם רד בריק: יש מקרר/מיקרו במלון?"],
  },
  {
    city: "קוסמוי",
    dates: "01–09.10 · 8 לילות — Amari",
    places: [
      {
        name: "בית חב״ד קוסמוי",
        type: "בית חב״ד • מסעדה כשרה",
        address: "65/14 Moo 2, Chaweng, Koh Samui",
        phone: "+66 77 413 770",
        hours: "א׳–ה׳ 09:00–22:00 · ארוחות שבת",
        note: "הבית חב״ד הכי גדול בתאילנד! מסעדה, מכולת כשרה, ארוחות שבת ענקיות",
        mapQuery: "Chabad House Koh Samui",
        rating: "4.8",
      },
      {
        name: "Chabad Kosher Restaurant Koh Samui",
        type: "מסעדה כשרה",
        address: "ליד בית חב״ד צ׳אוונג",
        note: "בשרי + חלבי, פיצות, המבורגרים, אוכל תאילנדי כשר",
        mapQuery: "Chabad Restaurant Koh Samui",
      },
      { name: "קפונקה — מסעדה כשרה", type: "מסעדה כשרה", address: "קוסמוי", note: "מומלצת בטיקטוק", mapQuery: "Kaponka Koh Samui kosher" },
    ],
    tips: ["שישי בערב חובה להזמין — 300–400 באט לאדם", "יש משלוחים למלון Amari (כ־10 דק׳ נסיעה)", "מכולת כשרה עם לחם, גבינות, נקניקים", "קפונקה — מהרשימה שלך"],
  },
  {
    city: "בנגקוק",
    dates: "09–15.10 · Chillax Heritage — קאו סאן",
    places: [
      {
        name: "בית חב״ד בנגקוק",
        type: "בית חב״ד • מסעדה כשרה",
        address: "67 Rambuttri Alley, Phra Athit, Bangkok (5 דק׳ מהמלון!)",
        phone: "+66 2 629 2581",
        hours: "א׳–ה׳ 09:00–22:00",
        note: "ממש ליד Chillax Heritage! מרחק הליכה. מסעדה + מכולת",
        mapQuery: "Chabad House Bangkok Rambuttri",
        rating: "4.6",
      },
      {
        name: "Kosher Restaurant Bangkok (בחב״ד)",
        type: "מסעדה כשרה",
        address: "בתוך בית חב״ד בנגקוק",
        note: "תפריט מלא: שקשוקה, חומוס, שניצל, סטייקים",
        mapQuery: "Chabad Bangkok restaurant",
      },
      { name: "תום ים — אסייתי", type: "מסעדה כשרה", address: "בנגקוק", note: "אסייתי כשר — מומלצת בטיקטוק", mapQuery: "Tom Yam Bangkok kosher" },
      { name: "זוהרה — אוכל ביתי", type: "מסעדה כשרה", address: "בנגקוק", note: "אוכל ביתי כשר", mapQuery: "Zohara Bangkok kosher" },
      { name: "ארנצ׳יני — חלבי", type: "מסעדה חלבית כשרה", address: "בנגקוק", note: "איטלקי חלבי כשר", mapQuery: "Arancini Bangkok kosher" },
      { name: "שיפודי באבי", type: "מסעדה בשרית כשרה", address: "בנגקוק", note: "שיפודים ובשרים", mapQuery: "Babi Skewers Bangkok kosher" },
      { name: "בורקס רמלה", type: "מאפייה כשרה", address: "בנגקוק", note: "בורקסים כמו בארץ", mapQuery: "Burekas Ramle Bangkok" },
      { name: "מקסינו", type: "מסעדה כשרה", address: "בנגקוק", note: "מומלצת", mapQuery: "Maxino Bangkok kosher" },
      { name: "Bakery 26", type: "מאפייה כשרה", address: "בנגקוק", note: "מאפים ועוגות", mapQuery: "Bakery 26 Bangkok" },
      { name: "מאמא מזל", type: "מסעדה כשרה", address: "בנגקוק", note: "אוכל ביתי", mapQuery: "Mama Mazal Bangkok kosher" },
    ],
    tips: ["הכי נוח — המלון שלכם על קאו סאן, חב״ד 5 דק׳ הליכה!", "יש גם סופר כשר קטן עם מוצרים מיובאים", "שבת בבנגקוק: חוויה גדולה, כ־500 באט", "כל המסעדות הנ״ל — שמרת בטיקטוק"],
  },
  {
    city: "קנצ׳נבורי",
    dates: "11–13.10 · אם תסעו",
    places: [
      {
        name: "אין בית חב״ד בקנצ׳נבורי",
        type: "היערכות",
        address: "קנצ׳נבורי",
        note: "להביא אוכל מבנגקוק. יש 7-Eleven עם פירות/אורז/ביצים",
        mapQuery: "Kanchanaburi Thailand",
      },
    ],
    tips: ["להצטייד בבנגקוק לפני הנסיעה", "אורז לבן + ירקות מוקפצים תמיד בטוח"],
  },
];

function PlaceCard({ place }: { place: KosherPlace }) {
  const isAlert = place.type.includes("היערכות") || place.name.startsWith("אין");
  return (
    <li className="group relative rounded-2xl border border-slate-200/70 bg-white px-4 py-4 sm:px-[18px] sm:py-[18px] transition-colors hover:border-slate-300/80 hover:bg-slate-50/40 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-slate-600 dark:hover:bg-slate-800/70">
      {/* accent dot */}
      <span
        aria-hidden
        className={`absolute right-0 top-5 h-9 w-[3px] rounded-full ${isAlert ? "bg-amber-400" : "bg-thai-teal/80 group-hover:bg-thai-teal"} transition-colors`}
      />
      <div className="flex items-start justify-between gap-3 pr-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-[15px] font-bold leading-6 tracking-[-0.01em] text-slate-900 dark:text-slate-100">
              {place.name}
            </h4>
            {place.rating && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold tracking-wide text-amber-700 ring-1 ring-amber-500/20 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20">
                <Star size={11} className="fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" aria-hidden />
                {place.rating}
              </span>
            )}
            {isAlert && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold tracking-widest text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-800">
                <AlertTriangle size={10} aria-hidden /> שימו לב
              </span>
            )}
          </div>

          <p className="mt-0.5 text-xs font-semibold tracking-wide text-thai-teal dark:text-teal-300">{place.type}</p>

          <div className="mt-3 space-y-1.5">
            <p className="flex items-start gap-1.5 text-[13px] leading-5 text-slate-600 dark:text-slate-400">
              <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden />
              <span className="min-w-0 break-words">{place.address}</span>
            </p>

            {place.phone && (
              <a
                href={`https://wa.me/${place.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`וואטסאפ ${place.phone}`}
                className="inline-flex min-h-[28px] items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800 dark:hover:bg-emerald-900/50"
              >
                <Phone size={12} aria-hidden />
                <span dir="ltr">{place.phone}</span>
                <MessageCircle size={11} className="opacity-60" aria-hidden />
              </a>
            )}

            {place.hours && (
              <p className="flex items-center gap-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                <Clock size={12.5} className="shrink-0 text-slate-400 dark:text-slate-500" aria-hidden />
                {place.hours}
              </p>
            )}
          </div>

          <p className="mt-3 rounded-xl border border-amber-100 bg-amber-50/60 px-3 py-2.5 text-[13px] leading-6 text-slate-700 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-200">
              <Lightbulb size={13} className="shrink-0" aria-hidden /> הערה:
            </span>{" "}
            {place.note}
          </p>
        </div>
      </div>

      <a
        href={`https://www.google.com/maps/search/${encodeURIComponent(place.mapQuery)}`}
        target="_blank"
        rel="noreferrer"
        aria-label={`פתח במפות: ${place.name}`}
        className="mt-3 inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-thai-teal/30 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-thai-teal focus-visible:ring-offset-2 active:scale-[0.98] dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-700 dark:hover:bg-teal-950/40 dark:hover:text-teal-200"
      >
        <Navigation size={12.5} aria-hidden />
        פתח במפות
        <ExternalLink size={11} className="opacity-60" aria-hidden />
      </a>
    </li>
  );
}

export default function KosherFood() {
  return (
    <section
      className="space-y-8 tab-fade selection:bg-thai-teal selection:text-white"
      aria-labelledby="kosher-heading"
      dir="rtl"
    >
      {/* Intro — hierarchy anchor */}
      <header className="card overflow-hidden p-0">
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-white px-5 py-5 sm:px-6 sm:py-6 dark:from-amber-950/20 dark:via-orange-950/10 dark:to-slate-900">
          <div className="flex items-start gap-3.5">
            <span className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-amber-200/60 dark:bg-slate-800 dark:ring-amber-800/40" aria-hidden>
              <ShieldCheck size={20} className="text-amber-600 dark:text-amber-400" />
            </span>
            <div className="min-w-0 flex-1">
              <h2
                id="kosher-heading"
                className="flex items-center gap-2 text-[17px] font-extrabold tracking-[-0.02em] text-slate-900 sm:text-[19px] dark:text-slate-100"
              >
                <ShieldCheck size={18} className="shrink-0 text-amber-600 sm:hidden dark:text-amber-400" aria-hidden />
                אוכל כשר בתאילנד — המדריך המלא
              </h2>
              <p className="mt-1.5 max-w-[65ch] text-[13.5px] leading-6 text-slate-600 dark:text-slate-400">
                כל מה שצריך לכל יעד בטיול. הזמנות לשבת נעשות בוואטסאפ — מומלץ לשריין לפחות שבוע מראש.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                  <Info size={12} className="text-thai-teal" aria-hidden /> טיפ: הזמינו שבתות מראש
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-thai-teal px-3 py-1 font-bold text-white">
                  5 יעדים · {DATA.reduce((s, sec) => s + sec.places.length, 0)} מקומות
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* thin rule */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent dark:via-amber-800/30" aria-hidden />
        <div className="flex flex-wrap gap-1.5 bg-slate-50/70 px-5 py-3 text-[11px] font-medium text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden /> וואטסאפ ישיר לכל חב״ד
          </span>
          <span aria-hidden className="text-slate-300 dark:text-slate-600">·</span>
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-thai-teal" aria-hidden /> קישור ישיר למפות
          </span>
          <span aria-hidden className="text-slate-300 dark:text-slate-600">·</span>
          <span>מידע מעודכן לספטמבר–אוקטובר 2026</span>
        </div>
      </header>

      {/* City sections */}
      <div className="space-y-6">
        {DATA.map((sec) => (
          <section
            key={sec.city}
            aria-labelledby={`city-${sec.city}`}
            className="card overflow-hidden"
          >
            {/* city header — generous separation above, tight below */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#0f766e] to-[#14b8a6] px-5 py-4 sm:px-6 sm:py-[18px] text-white">
              {/* subtle texture */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`,
                  backgroundSize: "22px 22px",
                }}
              />
              <div className="relative flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3
                    id={`city-${sec.city}`}
                    className="flex items-center gap-2.5 text-[17px] font-extrabold tracking-[-0.015em] text-white sm:text-[18px]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                      <Building2 size={16} className="text-white" aria-hidden />
                    </span>
                    {sec.city}
                    <span className="hidden sm:inline-flex items-center rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold tracking-wide ring-1 ring-white/20">
                      {sec.places.length} מקומות
                    </span>
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium leading-5 text-white/90">
                    <Clock size={12} className="shrink-0 opacity-80" aria-hidden />
                    {sec.dates}
                  </p>
                </div>
                <Utensils size={20} className="hidden shrink-0 text-white/60 sm:block" aria-hidden />
                {/* mobile count */}
                <span className="sm:hidden shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold ring-1 ring-white/20">
                  {sec.places.length}
                </span>
              </div>
            </div>

            <div className="space-y-5 bg-white p-4 sm:p-6 dark:bg-slate-900">
              {/* places — tight group */}
              <ul className="space-y-3" role="list">
                {sec.places.map((p) => (
                  <PlaceCard key={p.name} place={p} />
                ))}
              </ul>

              {/* tips — distinct separation, warm inset */}
              <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-950/15">
                <h4 className="flex items-center gap-1.5 text-xs font-extrabold tracking-wide text-amber-900 dark:text-amber-200">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white">
                    <Lightbulb size={12} aria-hidden />
                  </span>
                  טיפים ל{sec.city}
                </h4>
                <ul className="mt-2.5 space-y-1.5" role="list">
                  {sec.tips.map((t, i) => (
                    <li key={i} className="flex gap-2 text-[13px] leading-6 text-amber-900/90 dark:text-amber-100/80">
                      <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-amber-500/70" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Checklist — final anchor, calmer blue/slate not competing with tips */}
      <section aria-labelledby="kosher-checklist" className="card overflow-hidden">
        <div className="bg-slate-900 px-5 py-4 sm:px-6 dark:bg-slate-950">
          <h3
            id="kosher-checklist"
            className="flex items-center gap-2 text-sm font-extrabold tracking-[-0.01em] text-white"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
              <CheckCircle2 size={14} className="text-emerald-300" aria-hidden />
            </span>
            צ׳ק ליסט כשרות לטיול
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-400">ודאו שהכל סגור לפני היציאה — העתיקו והדביקו לוואטסאפ</p>
        </div>
        <ul className="divide-y divide-slate-100 bg-white p-2 dark:divide-slate-800 dark:bg-slate-900" role="list">
          {[
            "הזמנת שבתות: צ׳אנג מאי (26.09) · קוסמוי (03.10) · בנגקוק (10.10) — בוואטסאפ מראש",
            "מנות קפואות לפאי: 500 באט × 5 אנשים × 3 ימים — להזמין בחב״ד צ׳אנג מאי",
            "נשנושים: לחם, טחינה, חטיפים — בכל חב״ד יש מכולת",
            "אפליקציה: HappyCow לסינון צמחוני (גיבוי)",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl px-3 py-3 text-[13.5px] leading-6 text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <CheckCircle2 size={12} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">{item}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/40">
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <Info size={12} aria-hidden /> מומלץ לצלם מסך ולשלוח לשותפים לטיול
          </p>
        </div>
      </section>

      {/* Browser surfaces — selection already set via selection:* */}
      <style>{`::selection{background:#0d9488;color:white}`}</style>
    </section>
  );
}
