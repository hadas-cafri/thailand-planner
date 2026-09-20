"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, Download, Wallet, Filter, Trash2 } from "lucide-react";

type WhoPaid = string;
type Expense = { id: string; cat: string; detail: string; amount: number; whoPaid: WhoPaid; date?: string; note?: string };

const CATS = ["טיסות", "מלונות", "אוכל", "תחבורה", "אטרקציות", "קניות", "ביטוח", "אחר"];

export default function BudgetTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [cat, setCat] = useState("טיסות");
  const [detail, setDetail] = useState("");
  const [amount, setAmount] = useState("");
  const [whoPaid, setWhoPaid] = useState<WhoPaid>("משותף");
  const [rate, setRate] = useState<number | null>(null);

  // Filters
  const [filterCat, setFilterCat] = useState<string>("הכל");
  const [filterWho, setFilterWho] = useState<string>("הכל");

  useEffect(() => {
    fetch("/api/load").then(r=>r.json()).then(d=>{
      if(d && Array.isArray(d.budget) && d.budget.length>0) {
        const hasWho = d.budget.some((b:any)=>b.whoPaid);
        // Prefer server if it has more items or has card-specific whoPaid
        const hasCards = d.budget.some((b:any)=> String(b.whoPaid).includes("3529") || String(b.whoPaid).includes("2306"));
        if(hasWho) {
          // Always prefer server when it has card split or is larger
          const local = localStorage.getItem("thai_budget_v2");
          let localLen = 0; try{ localLen = JSON.parse(local||"[]").length; } catch {}
          if(hasCards || d.budget.length >= localLen) {
            setExpenses(d.budget);
            localStorage.setItem("thai_budget_v2", JSON.stringify(d.budget));
            return;
          }
        }
        if(hasWho) setExpenses(d.budget);
      }
    }).catch(()=>{});
    const s = localStorage.getItem("thai_budget_v2");
    if (s) {
      try { 
        const parsed = JSON.parse(s);
        // Don't overwrite if server already loaded card-split data
        if(!parsed.some((e:any)=> String(e.whoPaid).includes("3529"))) {
          setExpenses(parsed);
        }
      } catch {}
    } else {
      const old = localStorage.getItem("thai_budget");
      if (old) {
        try {
          const arr = JSON.parse(old);
          setExpenses(arr.map((e: any) => ({ id: e.id, cat: e.cat, detail: e.note || "", amount: e.amount, whoPaid: "משותף" as WhoPaid })));
        } catch {}
      }
    }
    fetch("/api/fx").then((r) => r.json()).then((d) => { if(d.rate) setRate(parseFloat(d.rate)); }).catch(()=>{});
  }, []);

  useEffect(() => {
    localStorage.setItem("thai_budget_v2", JSON.stringify(expenses));
    // sync to server
    if(expenses.length>0) {
      fetch("/api/save", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({budget: expenses})}).catch(()=>{});
    }
  }, [expenses]);

  function add() {
    const a = parseFloat(amount);
    if (!a || !detail.trim()) return;
    setExpenses((p) => [...p, { id: crypto.randomUUID(), cat, detail: detail.trim(), amount: a, whoPaid, date: new Date().toISOString().slice(0,10) }]);
    setDetail("");
    setAmount("");
  }

  function remove(id: string) {
    setExpenses((p) => p.filter((e) => e.id !== id));
  }

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (filterCat !== "הכל" && e.cat !== filterCat) return false;
      if (filterWho !== "הכל" && e.whoPaid !== filterWho) return false;
      return true;
    });
  }, [expenses, filterCat, filterWho]);

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const filteredTotal = filtered.reduce((s, e) => s + e.amount, 0);
  const byWho = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of expenses) m[e.whoPaid] = (m[e.whoPaid] || 0) + e.amount;
    return m;
  }, [expenses]);
  const whoColor = (w:string) => {
    if(w.includes("3529")) return "bg-teal-50 text-teal-700 border-teal-200";
    if(w.includes("2306")) return "bg-sky-50 text-sky-700 border-sky-200";
    if(w==="הדס") return "bg-blue-50 text-blue-700 border-blue-200";
    if(w==="גיא") return "bg-green-50 text-green-700 border-green-200";
    if(w==="משותף") return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };
  const whoBadge = (w:string) => {
    if(w.includes("3529")) return "bg-teal-100 text-teal-700";
    if(w.includes("2306")) return "bg-sky-100 text-sky-700";
    if(w==="הדס") return "bg-blue-100 text-blue-700";
    if(w==="גיא") return "bg-green-100 text-green-700";
    if(w==="משותף") return "bg-orange-100 text-orange-700";
    return "bg-gray-100 text-gray-700";
  };

  function exportCsv() {
    const rows = [["קטגוריה", "פירוט", "סכום (₪)", "מי שילם", "תאריך"]].concat(
      filtered.map((e) => [e.cat, e.detail, e.amount.toString(), e.whoPaid, e.date || ""])
    );
    const csv = rows.map((r) => r.map(v=>`"${v}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "thailand-budget.csv";
    a.click();
  }

  return (
    <div className="card p-4 space-y-4">
      <h3 className="font-bold text-thai-deep flex items-center gap-2"><Wallet size={18} className="text-thai-teal" /> מעקב תקציב</h3>

      {/* Add form */}
      <div className="bg-gray-50 rounded-xl p-3 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          <select className="border rounded-lg p-2 text-sm bg-white" value={cat} onChange={(e) => setCat(e.target.value)}>
            {CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input
            className="border rounded-lg p-2 text-sm sm:col-span-2"
            placeholder="פירוט (למשל: בנגקוק-צ'אנג מאי)"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
          <input
            className="border rounded-lg p-2 text-sm"
            type="number"
            placeholder="מחיר ₪"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select className="border rounded-lg p-2 text-sm bg-white" value={whoPaid} onChange={(e) => setWhoPaid(e.target.value as WhoPaid)}>
            <option>הדס 3529</option>
            <option>הדס 2306</option>
            <option>הדס</option>
            <option>גיא</option>
            <option>משותף</option>
          </select>
        </div>
        <button className="btn btn-primary w-full sm:w-auto" onClick={add}>
          <Plus size={16} /> הוסף הוצאה
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
        <div className="bg-slate-900 rounded-xl p-3 border border-slate-700">
          <div className="text-xs text-slate-400">סה״כ</div>
          <div className="font-bold text-white">{total.toLocaleString("he-IL")} ₪</div>
          {rate && <div className="text-[10px] text-slate-400">{(total*rate).toLocaleString("he-IL")} ฿</div>}
        </div>
        {Object.entries(byWho).sort().map(([who, sum])=> (
          <div key={who} className={`rounded-xl p-3 border ${whoColor(who)}`}>
            <div className="text-xs opacity-70">{who}</div>
            <div className="font-bold">{(sum as number).toLocaleString("he-IL")} ₪</div>
          </div>
        ))}
        {!byWho["גיא"] && (
          <div className={`rounded-xl p-3 border ${whoColor("גיא")} opacity-50`}>
            <div className="text-xs opacity-70">גיא</div>
            <div className="font-bold">0 ₪</div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 items-center flex-wrap bg-white border rounded-xl p-3">
        <Filter size={14} className="text-gray-400" />
        <span className="text-xs text-gray-500">סנן:</span>
        <select className="border rounded-lg p-1.5 text-xs" value={filterCat} onChange={(e)=>setFilterCat(e.target.value)}>
          <option>הכל</option>
          {CATS.map(c=> <option key={c}>{c}</option>)}
        </select>
        <select className="border rounded-lg p-1.5 text-xs" value={filterWho} onChange={(e)=>setFilterWho(e.target.value)}>
          <option>הכל</option>
          {Object.keys(byWho).sort().map(w=> <option key={w}>{w}</option>)}
          {!Object.keys(byWho).includes("משותף") && <option>משותף</option>}
          {!Object.keys(byWho).includes("גיא") && <option>גיא</option>}
        </select>
        <span className="text-xs font-bold text-thai-deep mr-auto">מסונן: {filteredTotal.toLocaleString("he-IL")} ₪ ({filtered.length} פריטים)</span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">אין הוצאות לפי הסינון</p>
        ) : (
          filtered.map((e) => (
            <div key={e.id} className="flex items-center justify-between bg-white border rounded-xl px-3 py-2 text-sm">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-thai-deep">{e.cat}</span>
                  <span className="text-gray-300">·</span>
                  <span>{e.detail}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${whoBadge(e.whoPaid)}`}>{e.whoPaid}</span>
                </div>
                {e.date && <div className="text-[10px] text-gray-400">{e.date}</div>}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{e.amount.toLocaleString("he-IL")} ₪</span>
                <button onClick={()=>remove(e.id)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
              </div>
            </div>
          ))
        )}
      </div>

      {filtered.length > 0 && (
        <button className="btn btn-ghost w-full text-sm" onClick={exportCsv}>
          <Download size={14} /> ייצא CSV מסונן
        </button>
      )}
    </div>
  );
}
