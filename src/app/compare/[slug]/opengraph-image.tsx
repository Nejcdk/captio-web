import { ImageResponse } from "next/og";
import { PAGE_KINDS, getAllComparePages, getComparePage } from "@/lib/compare";

// Share card per comparison: the kind, the title and the site, on brand blue.
export const alt = "Captio AI comparison";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#1C49F5";

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
        <div style={{ display: "flex", fontSize: 30, fontWeight: 500, opacity: 0.8 }}>
          {page ? `${page.apps.length} apps, every fact sourced` : "captioai.app/compare"}
        </div>
      </div>
    ),
    { ...size },
  );
}
