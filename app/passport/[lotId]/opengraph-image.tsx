import { ImageResponse } from "next/og";
import { getCoffeeByLot } from "@/data/coffees";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { lotId: string };
}) {
  const coffee = getCoffeeByLot(params.lotId);
  const name = coffee?.productName.toUpperCase() ?? "COFFEE";
  const lot = coffee?.lotId ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F7F2E8",
          color: "#1F4D3A",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, color: "#C8A44D" }}>
          ★ ∞
        </div>
        <div style={{ fontSize: 28, letterSpacing: 6, marginTop: 16 }}>
          INFINITE PANAMA COFFEE
        </div>
        <div style={{ fontSize: 64, marginTop: 40, textAlign: "center" }}>
          Infinite Select™
        </div>
        <div style={{ fontSize: 72, fontWeight: 700 }}>{name}</div>
        <div style={{ fontSize: 24, marginTop: 24, color: "#555555" }}>
          Coffee Passport™ · {lot}
        </div>
      </div>
    ),
    { ...size }
  );
}
