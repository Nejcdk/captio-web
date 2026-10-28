import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { PAGE_KINDS, getAllComparePages, getComparePage, type CompareApp } from "@/lib/compare";

// Share card per comparison: the kind, the title, the apps' icons and the
// site, on brand blue.
export const alt = "Captio AI comparison";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#1C49F5";

/** An app's icon as a data URL (the share card can't load files by path), or null for a letter tile. */
function iconData(app: CompareApp): string | null {
  const file = app.slug === "captio-ai" ? "/logo_image_profile.png" : app.icon;
  if (!file) return null;
  return `data:image/png;base64,${fs.readFileSync(path.join(process.cwd(), "public", file)).toString("base64")}`;
}

function Icon({ app }: { app: CompareApp }) {
  const src = iconData(app);
  const box = { width: 88, height: 88, borderRadius: 20, border: "3px solid rgba(255,255,255,0.9)" };
  if (src) return <img src={src} alt="" width={88} height={88} style={box} />;
  return (
    <div style={{ ...box, display: "flex", alignItems: "center", justifyContent: "center", background: "white", color: BRAND, fontSize: 40, fontWeight: 700 }}>
      {app.shortName.charAt(0)}
    </div>
  );
}

export function generateStaticParams() {
  return getAllComparePages().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getComparePage(slug);
  const title = page?.title ?? "Compare caption apps";
  const fontSize = title.length > 80 ? 60 : title.length > 55 ? 70 : 80;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          background: BRAND,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>Captio AI Compare</div>
          {page && (
            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 3,
                background: "rgba(255,255,255,0.16)",
                borderRadius: 10,
                padding: "8px 16px",
              }}
            >
              {PAGE_KINDS[page.kind]}
            </div>
          )}
        </div>
        <div style={{ display: "flex", fontSize, fontWeight: 700, lineHeight: 1.08, maxWidth: 1010 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {page && (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {page.apps.map((app, i) => (
                <div key={app.slug} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {i > 0 && <div style={{ display: "flex", fontSize: 26, fontWeight: 700, opacity: 0.8 }}>vs</div>}
                  <Icon app={app} />
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", fontSize: 30, fontWeight: 500, opacity: 0.8 }}>
            {page ? `${page.apps.length} apps, every fact sourced` : "captioai.app/compare"}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
