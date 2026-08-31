"use client";

import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, Wind } from "lucide-react";

const CODE_MAP: Record<number, { icon: any; label: string }> = {
  0: { icon: Sun, label: "בהיר" },
  1: { icon: Sun, label: "בהיר חלקית" },
  2: { icon: Cloud, label: "מעונן חלקית" },
  3: { icon: Cloud, label: "מעונן" },
  45: { icon: Cloud, label: "ערפל" },
  61: { icon: CloudRain, label: "גשם קל" },
  63: { icon: CloudRain, label: "גשם" },
  80: { icon: CloudRain, label: "גשם מקומי" },
};

export default function WeatherWidget({ city }: { city: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const cityMap: Record<string, string> = {
    "קוסמוי": "Koh Samui",
    "צ'אנג מאי": "Chiang Mai",
    "בנגקוק": "Bangkok",
    "פאי": "Pai",
    "קנצ'נבורי": "Kanchanaburi",
  };

  useEffect(() => {
    if (!city) return;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const englishCity = cityMap[city] || city;
        const geo = await fetch(`/api/geo?q=${encodeURIComponent(englishCity + " Thailand")}`).then((r) => r.json());
        if (!geo.lat) {
          setError(true);
          return;
        }
        const wx = await fetch(`/api/weather?lat=${geo.lat}&lon=${geo.lon}`).then((r) => r.json());
        setData(wx);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [city]);

  if (!city) return null;
  if (loading) return <p className="text-sm text-gray-500">טוען מזג אוויר ל{city}…</p>;
  if (error || !data?.current) return <p className="text-sm text-gray-500">אין מזג אוויר ל{city}</p>;

  const cur = data.current;
  const daily = data.daily || {};
  const CurIcon = CODE_MAP[cur.weather_code]?.icon || Cloud;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500">{city}</div>
          <div className="text-2xl font-bold text-thai-deep">{Math.round(cur.temperature_2m)}°C</div>
          <div className="text-xs text-gray-600">{CODE_MAP[cur.weather_code]?.label}</div>
        </div>
        <CurIcon size={36} className="text-thai-orange" />
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
        <Wind size={12} /> {Math.round(cur.wind_speed_10m)} קמ"ש
      </div>
      {daily.time && (
        <div className="flex gap-1 mt-3 overflow-x-auto">
          {daily.time.slice(0, 7).map((t: string, i: number) => {
            const Icon = CODE_MAP[daily.weather_code[i]]?.icon || Cloud;
            return (
              <div key={i} className="flex flex-col items-center text-xs min-w-[36px]">
                <span className="text-gray-400">{new Date(t).getDate()}</span>
                <Icon size={16} className="text-thai-teal my-0.5" />
                <span className="font-semibold text-thai-deep">{Math.round(daily.temperature_2m_max[i])}°</span>
                <span className="text-gray-400">{Math.round(daily.temperature_2m_min[i])}°</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
