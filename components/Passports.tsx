"use client";
import { useState } from "react";

export type Passport = {
  id: string;
  owner: string;
  passportNo: string;
  nationality: string;
  dob: string;
  issueDate: string;
  expiryDate: string;
  idNo: string;
  placeOfBirth: string;
  authority: string;
  image: string;
  etihadCard?: string;
};

export default function Passports({ data }: { data: Passport[] }) {
  const [selected, setSelected] = useState<Passport | null>(null);
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500">
        עוד אין דרכונים שמורים. העלה צילום דרכון ויופיע כאן.
      </div>
    );
  }
  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        {data.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="aspect-[1.7/1] bg-slate-50 overflow-hidden cursor-pointer" onClick={() => setSelected(p)}>
              <img src={p.image} alt={`דרכון ${p.owner}`} className="w-full h-full object-contain" />
            </div>
            <div className="p-4" dir="rtl">
              <div className="font-bold text-slate-900">{p.owner}</div>
              <div className="text-sm text-slate-600 mt-1 space-y-0.5">
                <div>דרכון: <span className="font-mono font-semibold">{p.passportNo}</span> • ת.ז: {p.idNo}</div>
                <div>לידה: {p.dob} • תוקף: {p.expiryDate}</div>
                <div>הוצאה: {p.authority} {p.issueDate}</div>
              </div>
              {p.etihadCard && <div className="mt-2 text-xs text-teal-700">Etihad Guest מקושר</div>}
              <button onClick={() => setSelected(p)} className="mt-3 text-xs bg-slate-900 text-white px-3 py-1.5 rounded-full">הגדל צילום</button>
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 border-b flex justify-between items-center">
              <div className="font-bold">{selected.owner} - {selected.passportNo}</div>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-900 text-xl px-2">✕</button>
            </div>
            <div className="overflow-auto">
              <img src={selected.image} alt="דרכון" className="w-full" />
              {selected.etihadCard && <img src={selected.etihadCard} alt="Etihad" className="w-full border-t mt-2" />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
