"use client";

import { useEffect, useState } from "react";
import { Check, Plus, Trash2, Backpack } from "lucide-react";

export default function PackingList() {
  const [items, setItems] = useState<{ id: string; text: string; done: boolean }[]>([]);
  const [txt, setTxt] = useState("");

  useEffect(() => {
    // Load from server first, fallback to localStorage
    fetch("/api/load").then(r=>r.json()).then(d=>{
      if(d && Array.isArray(d.packing) && d.packing.length>0){
        setItems(d.packing);
        localStorage.setItem("thai_packing", JSON.stringify(d.packing));
      } else {
        const s = localStorage.getItem("thai_packing");
        if (s) setItems(JSON.parse(s));
      }
    }).catch(()=>{
      const s = localStorage.getItem("thai_packing");
      if (s) try{ setItems(JSON.parse(s)); } catch {}
    });
  }, []);
  useEffect(() => {
    localStorage.setItem("thai_packing", JSON.stringify(items));
    if(items.length>0){
      fetch("/api/save", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({packing: items})}).catch(()=>{});
    }
  }, [items]);

  function add() {
    if (!txt.trim()) return;
    setItems((p) => [...p, { id: crypto.randomUUID(), text: txt.trim(), done: false }]);
    setTxt("");
  }
  function toggle(id: string) {
    setItems((p) => p.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  }

  return (
    <div className="card p-4">
      <h3 className="font-bold text-thai-deep mb-3 flex items-center gap-2"><Backpack size={18} className="text-thai-teal" /> רשימת ציוד</h3>
      <p className="text-xs text-gray-500 mb-3">לפי מזג האוויר: 90% קצר + שכבה דקה לערב בצפון + ציוד גשם 🌧️</p>
      <div className="flex gap-2 mb-3">
        <input
          className="border border-gray-300 rounded-lg p-2 text-sm flex-1"
          placeholder="הוסף פריט…"
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button className="btn btn-primary" onClick={add}>
          <Plus size={16} />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {items.map((i) => (
          <div key={i.id} className="flex items-center gap-2 text-sm">
            <button onClick={() => toggle(i.id)} className={`p-1 rounded`}>
              {i.done ? <Check size={16} className="text-green-600" /> : <div className="w-4 h-4 border rounded" />}
            </button>
            <span className={i.done ? "line-through text-gray-400" : "text-gray-700"}>{i.text}</span>
            <button onClick={() => setItems((p) => p.filter((x) => x.id !== i.id))} className="mr-auto">
              <Trash2 size={13} className="text-red-500" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-gray-400">עדיין אין פריטים</p>}
      </div>
    </div>
  );
}
