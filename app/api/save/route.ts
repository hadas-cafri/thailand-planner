import { NextRequest, NextResponse } from "next/server";
import { saveData, TripData } from "../../../lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "body required" }, { status: 400 });
  // Accept partial updates: merge with current
  const current = await (await import("../../../lib/db")).loadData();
  const next: TripData = {
    hotels: body.hotels ?? current.hotels,
    flights: body.flights ?? current.flights,
    activities: body.activities ?? current.activities,
    packing: body.packing ?? current.packing ?? [],
    budget: body.budget ?? current.budget ?? [],
    loyalty: body.loyalty ?? (current as any).loyalty ?? [],
    credentials: body.credentials ?? (current as any).credentials ?? [],
    tasks: body.tasks ?? (current as any).tasks ?? [],
  };
  const ok = await saveData(next);
  return NextResponse.json({ ok, saved: next });
}
