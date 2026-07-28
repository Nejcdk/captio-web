import { ImageResponse } from "next/og";

// Default social / LLM share card, applied to every route unless a segment
// overrides it. Generated at build — no image asset required.
export const alt =
  "Captio AI — live captions and transcription for deaf and hard of hearing people";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#1C49F5";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          background: BRAND,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 600, opacity: 0.85 }}>
          Captio AI
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            marginTop: 28,
            maxWidth: 960,
          }}
        >
          Live captions for deaf and hard of hearing people
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 36,
            fontWeight: 500,
            marginTop: 40,
            opacity: 0.9,
          }}
        >
          Real-time captions, translation &amp; transcription · 60+ languages · iOS
        </div>
      </div>
    ),
    { ...size }
  );
}
