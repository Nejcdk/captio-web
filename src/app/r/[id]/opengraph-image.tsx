import { ImageResponse } from "next/og";
import { getSharedExport } from "@/lib/sharedExport";

// The link preview (WhatsApp, iMessage, Slack…): the recording's emoji on the
// brand blue with the logo. The title travels as og:title, set by the page,
// so any language shows right; the image itself carries no translated text.
export const alt = "Captio AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#1C49F5";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const shared = await getSharedExport((await params).id, false);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", background: BRAND, color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 200, lineHeight: 1 }}>{shared?.emoji ?? "🎙️"}</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 56 }}>
          <img src="https://captioai.app/icon.png" width={64} height={64} style={{ borderRadius: 16 }} alt="" />
          <div style={{ display: "flex", marginLeft: 20, fontSize: 52, fontWeight: 700 }}>Captio AI</div>
        </div>
      </div>
    ),
    { ...size, emoji: "twemoji" },
  );
}
