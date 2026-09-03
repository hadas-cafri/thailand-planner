"use client";
import { MapPin, Phone, Clock, ExternalLink, Utensils, Star } from "lucide-react";

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
  emoji: string;
  dates: string;
  places: KosherPlace[];
  tips: string[];
};

const DATA: KosherSection[] = [
  {
    city: "צ'אנג מאי",
    emoji: "🏯",
    dates: "24.09–01.10 (7 לילות, כולל פאי 27-29)",
    places: [
      {
        name: "בית חב״ד צ׳אנג מאי",
        type: "בית חב״ד • מסעדה כשרה",
        address: "33/6 Loi Kor Rd, Chiang Mai",
        phone: "+66 53 814 110",
        hours: "א׳-ה׳ 09:00-22:00, ו׳ עד כניסת שבת, מוצ״ש פתוח",
        note: "ארוחות שבת, אוכל מוכן לקחת לטיול פאי, מאפים. הזמנה מראש לשבת חובה!",
        mapQuery: "Chabad House Chiang Mai",
        rating: "⭐ 4.7",
      },
      {
        name: "Kosher Grill Chiang Mai (בחב״ד)",
        type: "מסעדה בשרית כשרה",
        address: "בתוך בית חב״ד",
        note: "שווארמה, שניצלים, חומוס, פלאפל - מנות לקחת לדרך",
        mapQuery: "Chabad House Chiang Mai",
      },
    ],
    tips: ["הזמיני ארוחות קפואות לטיול פאי מראש (500 באט/ארוחה)", "יש מכולת קטנה בחב״ד עם מוצרים מהארץ", "שבת: סעודות בתשלום - הרשמה בוואטסאפ"],
  },
  {
    city: "פאי",
    emoji: "🏞️",
    dates: "27-29.09 (טיול רד בריק)",
    places: [
      {
        name: "אין בית חב״ד / מסעדה כשרה בפאי",
        type: "היערכות מראש",
        address: "פאי - עיירה קטנה",
        note: "מביאים אוכל כשר מצ׳אנג מאי (חב״ד) + מנות קפואות. רד בריק מאפשרים לבשל/לחמם.",
        mapQuery: "Pai Thailand",
      },
    ],
    tips: ["קחי 2-3 מנות קפואות מחב״ד צ׳אנג מאי לכל אחד", "פירות, אורז וירקות טריים יש בכל מקום בפאי", "תיאום עם רד בריק: יש מקרר/מיקרו במלון?"],
  },
  {
    city: "קוסמוי",
    emoji: "🏝️",
    dates: "01-09.10 (8 לילות - Amari)",
    places: [
      {
        name: "בית חב״ד קוסמוי",
        type: "בית חב״ד • מסעדה כשרה",
        address: "65/14 Moo 2, Chaweng, Koh Samui",
        phone: "+66 77 413 770",
        hours: "א׳-ה׳ 09:00-22:00, ארוחות שבת",
        note: "הבית חב״ד הכי גדול בתאילנד! מסעדה, מכולת כשרה, ארוחות שבת ענקיות",
        mapQuery: "Chabad House Koh Samui",
        rating: "⭐ 4.8",
      },
      {
        name: "Chabad Kosher Restaurant Koh Samui",
        type: "מסעדה כשרה",
        address: "ליד בית חב״ד צ׳אוונג",
        note: "בשרי + חלבי, פיצות, המבורגרים, אוכל תאילנדי כשר",
        mapQuery: "Chabad Restaurant Koh Samui",
      },
      { name: "קפונקה - מסעדה כשרה", type: "מסעדה כשרה", address: "קוסמוי", note: "מומלצת בטיקטוק ⭐", mapQuery: "Kaponka Koh Samui kosher" },
    ],
    tips: ["שישי בערב חובה להזמין - 300-400 באט לאדם", "יש משלוחים למלון Amari (10 דק׳ נסיעה)", "מכולת כשרה עם לחם, גבינות, נקניקים", "קפונקה - מהרשימה שלך"],
  },
  {
    city: "בנגקוק",
    emoji: "🏙️",
    dates: "09-15.10 (Chillax Heritage - קאו סאן)",
    places: [
      {
        name: "בית חב״ד בנגקוק",
        type: "בית חב״ד • מסעדה כשרה",
        address: "67 Rambuttri Alley, Phra Athit, Bangkok (5 דק׳ מהמלון!)",
        phone: "+66 2 629 2581",
        hours: "א׳-ה׳ 09:00-22:00",
        note: "ממש ליד Chillax Heritage! מרחק הליכה. מסעדה + מכולת",
        mapQuery: "Chabad House Bangkok Rambuttri",
        rating: "⭐ 4.6",
      },
      {
        name: "Kosher Restaurant Bangkok (בחב״ד)",
        type: "מסעדה כשרה",
        address: "בתוך בית חב״ד בנגקוק",
        note: "תפריט מלא: שקשוקה, חומוס, שניצל, סטייקים",
        mapQuery: "Chabad Bangkok restaurant",
      },
      { name: "תום ים - אסייתי", type: "מסעדה כשרה", address: "בנגקוק", note: "אסייתי כשר - מומלצת בטיקטוק", mapQuery: "Tom Yam Bangkok kosher" },
      { name: "זוהרה - אוכל ביתי", type: "מסעדה כשרה", address: "בנגקוק", note: "אוכל ביתי כשר", mapQuery: "Zohara Bangkok kosher" },
      { name: "ארנצ׳יני - חלבי", type: "מסעדה חלבית כשרה", address: "בנגקוק", note: "איטלקי חלבי כשר", mapQuery: "Arancini Bangkok kosher" },
      { name: "שיפודי באבי", type: "מסעדה בשרית כשרה", address: "בנגקוק", note: "שיפודים ובשרים", mapQuery: "Babi Skewers Bangkok kosher" },
      { name: "בורקס רמלה", type: "מאפייה כשרה", address: "בנגקוק", note: "בורקסים כמו בארץ", mapQuery: "Burekas Ramle Bangkok" },
      { name: "מקסינו", type: "מסעדה כשרה", address: "בנגקוק", note: "מומלצת", mapQuery: "Maxino Bangkok kosher" },
      { name: "Bakery 26", type: "מאפייה כשרה", address: "בנגקוק", note: "מאפים ועוגות", mapQuery: "Bakery 26 Bangkok" },
      { name: "מאמא מזל", type: "מסעדה כשרה", address: "בנגקוק", note: "אוכל ביתי", mapQuery: "Mama Mazal Bangkok kosher" },
    ],
    tips: ["הכי נוח - המלון שלכם על קאו סאן, חב״ד 5 דק׳ הליכה!", "יש גם סופר כשר קטן עם מוצרים מיובאים", "שבת בבנגקוק: חוויה גדולה, כ-500 באט", "כל המסעדות הנ״ל - שמרת בטיקטוק ⭐"],
  },
  {
    city: "קנצ׳נבורי",
    emoji: "🌉",
    dates: "11-13.10 (אם תסעו)",
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

export default function KosherFood() {
  return (
    <div className="space-y-6 tab-fade">
      <div className="card p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
        <h3 className="font-bold text-amber-900 flex items-center gap-2">✡️ אוכל כשר בתאילנד - המדריך המלא</h3>
        <p className="text-sm text-amber-800 mt-1">כל מה שצריך לכל יעד בטיול שלכם. טיפ: הזמינו שבתות מראש בוואטסאפ!</p>
      </div>

      {DATA.map((sec) => (
        <div key={sec.city} className="card overflow-hidden">
          <div className="bg-gradient-to-r from-thai-teal to-thai-teal/80 text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span>{sec.emoji}</span> {sec.city}
              </h3>
              <p className="text-xs text-white/80 mt-0.5">{sec.dates}</p>
            </div>
            <Utensils size={20} className="opacity-60" />
          </div>

          <div className="p-4 space-y-4">
            {sec.places.map((p) => (
              <div key={p.name} className="border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-thai-deep flex items-center gap-1.5">
                      {p.name} {p.rating && <span className="text-xs font-normal text-amber-600">{p.rating}</span>}
                    </h4>
                    <p className="text-xs text-thai-orange font-medium">{p.type}</p>
                    <p className="text-xs text-gray-600 mt-1 flex items-start gap-1">
                      <MapPin size={12} className="mt-0.5 shrink-0" /> {p.address}
                    </p>
                    {p.phone && (
                      <a href={`https://wa.me/${p.phone.replace(/[^0-9]/g, "")}`} target="_blank" className="text-xs text-green-600 flex items-center gap-1 mt-1 hover:underline">
                        <Phone size={12} /> {p.phone} 📱
                      </a>
                    )}
                    {p.hours && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock size={12} /> {p.hours}
                      </p>
                    )}
                    <p className="text-sm text-gray-700 mt-2 bg-white rounded-lg p-2 border border-amber-100">💡 {p.note}</p>
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(p.mapQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-thai-teal hover:underline mt-2"
                >
                  <ExternalLink size={12} /> פתח במפות
                </a>
              </div>
            ))}

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs font-bold text-amber-900 mb-1">טיפים ל{sec.city}:</p>
              <ul className="text-xs text-amber-900 space-y-1 list-disc list-inside">
                {sec.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}

      <div className="card p-4 bg-blue-50 border border-blue-200">
        <h4 className="font-bold text-blue-900 text-sm">📋 צ׳ק ליסט כשרות לטיול</h4>
        <ul className="text-sm text-blue-800 mt-2 space-y-1">
          <li>✅ הזמנת שבתות: צ׳אנג מאי (26.09), קוסמוי (03.10), בנגקוק (10.10) - בוואטסאפ מראש</li>
          <li>✅ מנות קפואות לפאי: 500 באט × 5 אנשים × 3 ימים = להזמין בחב״ד צ׳אנג מאי</li>
          <li>✅ נשנושים: לחם, טחינה, חטיפים - בכל חב״ד יש מכולת</li>
          <li>✅ אפליקציה: HappyCow לסינון צמחוני (גיבוי)</li>
        </ul>
      </div>
    </div>
  );
}
