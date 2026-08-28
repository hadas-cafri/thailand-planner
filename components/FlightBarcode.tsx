"use client";

import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";

export default function FlightBarcode({ flight }: { flight: any }) {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [barcodeFailed, setBarcodeFailed] = useState(false);
  const [realBarcode, setRealBarcode] = useState<string | null>(null);

  useEffect(() => {
    // Try real barcode image first
    const map: Record<string, string> = {
      "PG242": "/barcodes/PG242.png",
      "PG130": "/barcodes/PG130.png",
      "EY598": "/barcodes/EY.png",
      "EY404": "/barcodes/EY.png",
      "EY405": "/barcodes/EY.png",
      "EY599": "/barcodes/EY.png",
      "TG112": "/barcodes/TG112.png",
    };
    const real = map[flight.flightNo];
    if (real) {
      // Check if image exists by trying to load
      const img = new Image();
      img.onload = () => setRealBarcode(real);
      img.onerror = () => setRealBarcode(null);
      img.src = real;
    } else {
      setRealBarcode(null);
    }

    if (barcodeRef.current && flight.flightNo && !real) {
      try {
        JsBarcode(barcodeRef.current, flight.flightNo.replace(/\s/g, ""), {
          format: "CODE128",
          width: 1.5,
          height: 40,
          displayValue: true,
          fontSize: 12,
          margin: 0,
        });
        setBarcodeFailed(false);
      } catch {
        setBarcodeFailed(true);
      }
    }
    if (qrRef.current) {
      const payload = [
        flight.airline,
        flight.flightNo,
        flight.from + "→" + flight.to,
        flight.date + " " + flight.depart,
        flight.pnr ? "PNR:" + flight.pnr : "",
      ].filter(Boolean).join("\n");
      QRCode.toCanvas(qrRef.current, payload, { width: 90, margin: 1 }).catch(() => {});
    }
  }, [flight]);

  return (
    <div className="flex items-center gap-3 mt-2 p-2 bg-gray-50 rounded-lg overflow-hidden">
      <div className="flex-1 overflow-x-auto flex items-center justify-center min-h-[50px]">
        {realBarcode ? (
          <img src={realBarcode} alt={`ברקוד ${flight.flightNo}`} className="max-w-full h-[50px] object-contain" />
        ) : barcodeFailed ? (
          <span className="font-mono text-sm text-gray-600 tracking-widest">{flight.flightNo}</span>
        ) : (
          <svg ref={barcodeRef} className="max-w-full"></svg>
        )}
      </div>
      <div className="shrink-0">
        <canvas ref={qrRef} width={90} height={90} className="rounded" />
      </div>
    </div>
  );
}
