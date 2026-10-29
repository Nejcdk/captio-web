import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

// Default social / LLM share card, applied to every route unless a segment
// overrides it. Generated at build: the headline on the left and the app's own
// screens (the home page's two-phone mockup) on the right, so a link preview or
// an AI answer shows what Captio AI looks like.
export const alt =
  "Captio AI app on iPhone showing live captions and an AI summary: live captions for deaf and hard of hearing people";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#1C49F5";

export default async function Image() {
  const mockup = await readFile(path.join(process.cwd(), "public/mockup_app.png"));
  const mockupSrc = `data:image/png;base64,${mockup.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 56px 0 80px",
          background: BRAND,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 600 }}>
          <div style={{ display: "flex", fontSize: 36, fontWeight: 600, opacity: 0.85 }}>
            Captio AI
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.05,
              marginTop: 24,
            }}
          >
            Live captions for deaf and hard of hearing people
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 500,
              lineHeight: 1.3,
              marginTop: 32,
              maxWidth: 540,
              opacity: 0.9,
            }}
          >
            Real-time captions, translation &amp; transcription in 60+ languages, on iPhone &amp; Android
          </div>
        </div>
        {/* 895 × 1024 */}
        <img src={mockupSrc} width={481} height={550} alt="" />
      </div>
    ),
    { ...size }
  );
}
