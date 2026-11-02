import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

// Default social / LLM share card, applied to every route unless a segment
// overrides it. Generated at build. It shows the app itself (two iPhones with
// live captions and a transcript) next to the icon and the name: search and AI
// answers reuse this picture for Captio AI, and a card of text alone gave them
// no picture of the app.
export const alt =
  "Captio AI app on iPhone: live captions with speaker tags and a saved transcript, for deaf and hard of hearing people";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#1C49F5";

function dataUrl(file: string) {
  return `data:image/png;base64,${fs.readFileSync(path.join(process.cwd(), "public", file)).toString("base64")}`;
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 64px 0 80px",
          background: BRAND,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <img
              src={dataUrl("logo_image_profile.png")}
              alt=""
              width={84}
              height={84}
              style={{ borderRadius: 20, border: "3px solid rgba(255,255,255,0.9)" }}
            />
            <div style={{ display: "flex", fontSize: 52, fontWeight: 700 }}>Captio AI</div>
          </div>
          <div style={{ display: "flex", fontSize: 58, fontWeight: 700, lineHeight: 1.08, marginTop: 36 }}>
            Live captions for deaf and hard of hearing people
          </div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 500, lineHeight: 1.3, marginTop: 28, opacity: 0.9 }}>
            Captions, translation and transcripts in 60+ languages, on iPhone and Android
          </div>
        </div>
        <img src={dataUrl("mockup_app.png")} alt="" width={490} height={561} />
      </div>
    ),
    { ...size },
  );
}
