"use client";
import { useState } from "react";
import { Eye, EyeOff, Plus, Trash2, Key, Award, Copy, Check } from "lucide-react";
import { LoyaltyEntry, CredentialEntry } from "../types";

export default function LoyaltyVault({
  loyalty,
  credentials,
  onUpdateLoyalty,
  onUpdateCredentials,
}: {
  loyalty: LoyaltyEntry[];
  credentials: CredentialEntry[];
  onUpdateLoyalty: (l: LoyaltyEntry[]) => void;
  onUpdateCredentials: (c: CredentialEntry[]) => void;
}) {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [newLoyalty, setNewLoyalty] = useState({ owner: "הדס", program: "FlyerBonus", number: "" });
  const [newCred, setNewCred] = useState({ title: "", username: "", password: "", url: "" });

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Loyalty Numbers */}
      <div className="card p-5">
        <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
          <Award size={20} className="text-thai-orange" /> מספרי לקוח / מועדון
        </h3>
        <div className="space-y-2 mb-4">
          {loyalty.length === 0 ? (
            <p className="text-sm text-gray-500">אין מספרים עדיין</p>
          ) : (
            loyalty.map((l) => (
              <div key={l.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <div className="font-semibold text-sm">{l.program} · {l.owner}</div>
                  <div className="font-mono text-sm tracking-wider">{l.number}</div>
                  {l.note && <div className="text-xs text-gray-500">{l.note}</div>}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copy(l.number, l.id)}
                    className="p-2 rounded-lg hover:bg-white text-gray-600"
                    title="העתק"
                  >
                    {copied === l.id ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => onUpdateLoyalty(loyalty.filter((x) => x.id !== l.id))}
                    className="p-2 rounded-lg hover:bg-white text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            className="input text-sm"
            placeholder="בעלים (הדס)"
            value={newLoyalty.owner}
            onChange={(e) => setNewLoyalty({ ...newLoyalty, owner: e.target.value })}
          />
          <input
            className="input text-sm"
            placeholder="תכנית (FlyerBonus)"
            value={newLoyalty.program}
            onChange={(e) => setNewLoyalty({ ...newLoyalty, program: e.target.value })}
          />
          <input
            className="input text-sm font-mono"
            placeholder="מספר"
            value={newLoyalty.number}
            onChange={(e) => setNewLoyalty({ ...newLoyalty, number: e.target.value })}
          />
          <button
            onClick={() => {
              if (!newLoyalty.number.trim()) return;
              onUpdateLoyalty([
                ...loyalty,
                { id: Math.random().toString(36).slice(2), owner: newLoyalty.owner, program: newLoyalty.program, number: newLoyalty.number.trim() },
              ]);
              setNewLoyalty({ ...newLoyalty, number: "" });
            }}
            className="btn bg-thai-orange text-white text-sm font-bold"
          >
            <Plus size={14} /> הוסף
          </button>
        </div>
      </div>

      {/* Credentials */}
      <div className="card p-5 border-amber-200 bg-amber-50/30">
        <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
          <Key size={20} className="text-amber-600" /> סיסמאות וגישה
        </h3>
        <p className="text-xs text-amber-700 mb-3">🔒 נשמר באופן פרטי ב-Gist הסודי שלך. אל תשתפי קישור ציבורי.</p>
        <div className="space-y-2 mb-4">
          {credentials.length === 0 ? (
            <p className="text-sm text-gray-500">אין סיסמאות עדיין</p>
          ) : (
            credentials.map((c) => (
              <div key={c.id} className="bg-white rounded-xl px-4 py-3 border">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">{c.title}</div>
                  <button
                    onClick={() => onUpdateCredentials(credentials.filter((x) => x.id !== c.id))}
                    className="p-1 rounded hover:bg-gray-100 text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {c.username && <div className="text-xs text-gray-600">👤 {c.username}</div>}
                {c.password && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-sm bg-gray-100 rounded px-2 py-1">
                      {showPasswords[c.id] ? c.password : "••••••••"}
                    </span>
                    <button
                      onClick={() => setShowPasswords({ ...showPasswords, [c.id]: !showPasswords[c.id] })}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      {showPasswords[c.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button onClick={() => copy(c.password!, c.id)} className="p-1 rounded hover:bg-gray-100">
                      {copied === c.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                )}
                {c.url && (
                  <a href={c.url} target="_blank" className="text-xs text-blue-600 hover:underline">
                    {c.url}
                  </a>
                )}
              </div>
            ))
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            className="input text-sm"
            placeholder="כותרת (למשל: ElgabsiThai Gmail)"
            value={newCred.title}
            onChange={(e) => setNewCred({ ...newCred, title: e.target.value })}
          />
          <input
            className="input text-sm"
            placeholder="משתמש / אימייל"
            value={newCred.username}
            onChange={(e) => setNewCred({ ...newCred, username: e.target.value })}
          />
          <input
            className="input text-sm"
            placeholder="סיסמה"
            type="password"
            value={newCred.password}
            onChange={(e) => setNewCred({ ...newCred, password: e.target.value })}
          />
          <input
            className="input text-sm"
            placeholder="קישור (אופציונלי)"
            value={newCred.url}
            onChange={(e) => setNewCred({ ...newCred, url: e.target.value })}
          />
        </div>
        <button
          onClick={() => {
            if (!newCred.title.trim()) return;
            onUpdateCredentials([
              ...credentials,
              { id: Math.random().toString(36).slice(2), title: newCred.title.trim(), username: newCred.username.trim() || undefined, password: newCred.password || undefined, url: newCred.url.trim() || undefined },
            ]);
            setNewCred({ title: "", username: "", password: "", url: "" });
          }}
          className="btn bg-amber-600 text-white text-sm font-bold mt-2 w-full sm:w-auto"
        >
          <Plus size={14} /> הוספת סיסמה
        </button>
      </div>
    </div>
  );
}
