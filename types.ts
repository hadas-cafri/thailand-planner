export type Hotel = {
  id: string;
  name: string;
  city: string;
  checkIn: string;
  checkOut: string;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  imageUrl?: string;
  imageData?: string; // base64 uploaded image
  description?: string;
  link?: string; // hotel website / booking link
  mapLink?: string; // google maps link
  docs?: string[]; // document urls / notes
};

export type Passenger = {
  name: string;
  seat: string;
  ticket: string;
  flyerBonusId?: string;
  etihadGuest?: string;
};

export type Flight = {
  id: string;
  airline: string;
  flightNo: string;
  from: string;
  to: string;
  fromCode?: string; // airport IATA
  toCode?: string;
  date: string;
  depart: string;
  arrive: string;
  status: "booked" | "planned";
  pnr?: string;
  bookingRef?: string;
  passengers: Passenger[];
  note?: string;
  airlineCode?: string; // for barcode
  link?: string; // airline manage booking
  docs?: string[];
};

export type Activity = {
  id: string;
  date: string;
  time?: string;
  title: string;
  location?: string;
  detail?: string;
  category?: "food" | "sight" | "shop" | "nature" | "other";
  link?: string; // maps / website
  cost?: number; // in THB
};

export type TimelineItem = {
  id: string;
  date: string;
  time?: string;
  title: string;
  type: "flight" | "hotel" | "activity";
  detail?: string;
};

export type TripData = {
  hotels: any[];
  flights: any[];
  activities: any[];
  packing?: any[];
  budget?: any[];
  loyalty?: LoyaltyEntry[];
  credentials?: CredentialEntry[];
};

export type LoyaltyEntry = {
  id: string;
  owner: string;
  program: string;
  number: string;
  note?: string;
};

export type CredentialEntry = {
  id: string;
  title: string;
  username?: string;
  password?: string;
  url?: string;
  note?: string;
};
