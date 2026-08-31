"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, CalendarDays, Pencil, Trash2, ImagePlus, ExternalLink, FileText, Globe, Building2, Loader2 } from "lucide-react";
import { Hotel } from "../types";

export default function HotelCard({
  hotel,
  onEdit,
  onDelete,
  onUpload,
}: {
  hotel: Hotel;
  onEdit: (h: Hotel) => void;
  onDelete: (id: string) => void;
  onUpload: (id: string, dataUrl: string) => void;
}) {
  const [img, setImg] = useState<string | null>(hotel.imageData || hotel.imageUrl || null);
  const [desc, setDesc] = useState<string | undefined>(hotel.description);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const query = `${hotel.name} ${hotel.city}`;

  useEffect(() => {
    if (hotel.imageUrl && hotel.description) return;
    if (img || desc) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/wiki?query=${encodeURIComponent(query)}`);
        if (res.ok) {
          const d = await res.json();
          if (!img && d.image) setImg(d.image);
          if (!desc && d.extract) setDesc(d.extract);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImg(dataUrl);
      onUpload(hotel.id, dataUrl);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="h-40 bg-thai-sand relative">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={hotel.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-thai-orange text-3xl gap-1">
            {loading ? <Loader2 size={28} className="animate-spin text-thai-teal/60" /> : <Building2 size={32} className="text-thai-teal/50" />}
            {!loading && (
              <button
                className="text-xs text-thai-deep bg-white/90 rounded-full px-2 py-1"
                onClick={() => {
                  setLoading(true);
                  fetch(`/api/wiki?query=${encodeURIComponent(query)}`)
                    .then((r) => r.json())
                    .then((d) => { if (d.image) setImg(d.image); if (d.extract) setDesc(d.extract); })
                    .catch(() => {})
                    .finally(() => setLoading(false));
                }}
              >
                טען תמונה
              </button>
            )}
          </div>
        )}
        <span className="absolute top-2 right-2 bg-white/90 text-thai-deep text-xs font-bold px-2 py-1 rounded-full">
          {hotel.city}
        </span>
        <div className="absolute top-2 left-2 flex gap-1">
          <button className="bg-white/90 rounded-full p-1.5 hover:bg-white" onClick={() => fileRef.current?.click()} aria-label="העלה תמונה">
            <ImagePlus size={14} className="text-thai-deep" />
          </button>
          <button className="bg-white/90 rounded-full p-1.5 hover:bg-white" onClick={() => onEdit(hotel)} aria-label="ערוך">
            <Pencil size={14} className="text-thai-deep" />
          </button>
          <button className="bg-white/90 rounded-full p-1.5 hover:bg-white" onClick={() => onDelete(hotel.id)} aria-label="מחק">
            <Trash2 size={14} className="text-red-600" />
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-bold text-lg text-thai-deep">{hotel.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={14} className="text-thai-orange" /> {hotel.city}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarDays size={14} className="text-thai-teal" /> {hotel.checkIn} → {hotel.checkOut}
        </div>

        {(hotel.link || hotel.mapLink) && (
          <div className="flex flex-wrap gap-2 mt-1">
            {hotel.link && (
              <a href={hotel.link} target="_blank" rel="noreferrer" className="text-xs text-thai-orange flex items-center gap-1 hover:underline">
                <Globe size={12} /> אתר המלון
              </a>
            )}
            {hotel.mapLink && (
              <a href={hotel.mapLink} target="_blank" rel="noreferrer" className="text-xs text-thai-orange flex items-center gap-1 hover:underline">
                <MapPin size={12} /> מיקום במפה
              </a>
            )}
          </div>
        )}

        {desc && <p className="text-sm text-gray-700 mt-1 leading-relaxed">{desc}</p>}
        {hotel.notes && (
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {hotel.notes.split(/(\*\*.*?\*\*|\+66[\s\d]+|https?:\/\/\S+)/g).map((part, i) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={i} className="font-bold text-red-600 bg-red-50 px-1 rounded">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith("+66")) {
                const tel = part.replace(/\s/g, "");
                return (
                  <a key={i} href={`https://wa.me/${tel.replace("+", "")}`} target="_blank" rel="noreferrer" className="font-bold text-green-600 hover:underline bg-white px-1 rounded border border-green-200">
                    {part} 📱
                  </a>
                );
              }
              if (part.startsWith("http")) {
                return <a key={i} href={part} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{part}</a>;
              }
              return <span key={i}>{part}</span>;
            })}
          </p>
        )}

        {hotel.docs && hotel.docs.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {hotel.docs.map((d: string, i: number) => (
              <a key={i} href={d} target="_blank" rel="noreferrer" className="text-xs bg-gray-100 rounded-full px-2 py-1 flex items-center gap-1 hover:bg-gray-200">
                <FileText size={11} /> מסמך {i + 1}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
