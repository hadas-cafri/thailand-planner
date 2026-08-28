"use client";

import { Plane, CheckCircle, Clock, Pencil, Trash2, ExternalLink, FileText } from "lucide-react";
import { Flight, Passenger } from "../types";
import FlightBarcode from "./FlightBarcode";

export default function FlightCard({
  flight,
  onEdit,
  onDelete,
}: {
  flight: Flight;
  onEdit: (f: Flight) => void;
  onDelete: (id: string) => void;
}) {
  const booked = flight.status === "booked";

  // Live status
  const now = new Date();
  const dep = flight.date && flight.depart ? new Date(`${flight.date}T${flight.depart}`) : null;
  let liveStatus = "";
  let liveColor = "bg-gray-100 text-gray-600";
  if (dep) {
    const diffH = (dep.getTime() - now.getTime()) / 3600000;
    if (diffH < 0) { liveStatus = "הטיסה עברה"; liveColor = "bg-gray-200 text-gray-500"; }
    else if (diffH < 24) { liveStatus = `ממריא בעוד ${Math.max(1, Math.round(diffH))} שעות`; liveColor = "bg-red-100 text-red-700"; }
    else if (diffH < 48) { liveStatus = "מחר"; liveColor = "bg-orange-100 text-orange-700"; }
  }
  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane size={18} className="text-thai-orange" />
          <span className="font-bold text-thai-deep">
            {flight.airline} · {flight.flightNo}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {liveStatus && (
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${liveColor}`}>{liveStatus}</span>
          )}
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
              booked ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
            }`}
          >
            {booked ? (
              <>
                <CheckCircle size={12} /> הוזמנה
              </>
            ) : (
              <>
                <Clock size={12} /> מתוכננת
              </>
            )}
          </span>
          <button className="p-1.5 hover:bg-gray-100 rounded-full" onClick={() => onEdit(flight)}>
            <Pencil size={14} className="text-thai-deep" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-full" onClick={() => onDelete(flight.id)}>
            <Trash2 size={14} className="text-red-600" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-center">
          <div className="font-bold text-lg text-thai-deep">{flight.from}</div>
          <div className="text-gray-500">{flight.depart}</div>
        </div>
        <div className="flex-1 px-2 text-center text-gray-400 text-xs">
          <Plane size={16} className="mx-auto text-thai-teal/60" />
          <div>{flight.date}</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg text-thai-deep">{flight.to}</div>
          <div className="text-gray-500">{flight.arrive}</div>
        </div>
      </div>

      {flight.pnr && (
        <div className="flex items-center justify-between bg-thai-sand/50 rounded-lg px-3 py-2">
          <span className="text-xs text-gray-700">קוד הזמנה (PNR): <b className="text-thai-deep text-sm">{flight.pnr}</b></span>
          {flight.link && (
            <a href={flight.link} target="_blank" rel="noreferrer" className="text-xs text-thai-orange flex items-center gap-1 hover:underline">
              נהל הזמנה <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}

      <FlightBarcode flight={flight} />

      {flight.note && (
        <p className={`text-xs ${flight.note.includes("20 קילו") ? "text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 font-bold" : "text-gray-500"}`}>
          {flight.note.includes("20 קילו") ? "🔴 " : ""}
          {flight.note}
        </p>
      )}

      {flight.passengers.length > 0 && (
        <div className="mt-2 border-t pt-2">
          <p className="text-xs font-semibold text-gray-700 mb-1">נוסעים:</p>
          <div className="grid grid-cols-1 gap-1">
            {flight.passengers.map((p: Passenger, i) => (
              <div key={i} className="text-xs text-gray-600 flex justify-between">
                <span>{p.name}</span>
                <span>
                  {p.seat ? `מושב ${p.seat} · ` : "מושב ייקבע בצ'ק-אין · "}כרטיס {p.ticket}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {flight.docs && flight.docs.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {flight.docs.map((d: string, i: number) => (
            <a key={i} href={d} target="_blank" rel="noreferrer" className="text-xs bg-gray-100 rounded-full px-2 py-1 flex items-center gap-1 hover:bg-gray-200">
              <FileText size={11} /> מסמך {i + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
