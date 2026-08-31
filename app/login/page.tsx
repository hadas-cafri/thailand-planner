"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";

function LoginInner() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push(next);
        router.refresh();
      } else {
        setError("סיסמה שגויה, נסי שוב");
      }
    } catch {
      setError("שגיאה, נסי שוב");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 px-4" dir="rtl">
      <div className="card p-8 w-full max-w-sm bg-white shadow-xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-thai-orange/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={28} className="text-thai-orange" />
          </div>
          <h1 className="text-2xl font-extrabold text-thai-deep">תאילנד 2026</h1>
          <p className="text-sm text-gray-500 mt-1">הכניסי סיסמה לצפייה בטיול</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה"
              className="border border-gray-300 rounded-xl p-3 text-sm w-full pr-10 text-center font-mono tracking-widest"
              autoFocus
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-sm text-red-600 text-center bg-red-50 rounded-lg py-2">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="btn btn-primary w-full py-3 rounded-xl font-bold text-base disabled:opacity-50"
          >
            {loading ? "בודקת..." : "כניסה"}
          </button>

          <p className="text-xs text-gray-400 text-center">
            הקוקי נשמר עד 16.10.2026 - לא תצטרכי להזין שוב באותו מכשיר
          </p>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">טוען...</div>}>
      <LoginInner />
    </Suspense>
  );
}
