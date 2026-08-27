// Gist-backed storage. Reads/writes the trip data JSON gist.
// GIST_ID and GITHUB_TOKEN are provided via env at build/runtime.
const GIST_ID = process.env.GIST_ID || "61b2f22961be8e87031020e2b362ab55";
const GH_TOKEN = process.env.GITHUB_TOKEN || "";

export type TripData = {
  hotels: any[];
  flights: any[];
  activities: any[];
  packing?: any[];
  budget?: any[];
};

const EMPTY: TripData = { hotels: [], flights: [], activities: [], packing: [], budget: [], loyalty: [], credentials: [] };

export async function loadData(): Promise<TripData> {
  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: { Authorization: `Bearer ${GH_TOKEN}`, "User-Agent": "thailand-planner" },
      cache: "no-store",
    });
    if (!res.ok) return EMPTY;
    const gist = await res.json();
    const content = gist?.files?.["thai-data.json"]?.content;
    if (!content) return EMPTY;
    return { ...EMPTY, ...JSON.parse(content) };
  } catch {
    return EMPTY;
  }
}

export async function saveData(data: TripData): Promise<boolean> {
  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${GH_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "thailand-planner",
      },
      body: JSON.stringify({ files: { "thai-data.json": { content: JSON.stringify(data, null, 2) } } }),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}
