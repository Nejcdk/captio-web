import { ImageResponse } from "next/og";
import { CATEGORIES, getAllPosts, getPost } from "@/lib/blog";

// Share card per article: category, title and the site, on brand blue.
export const alt = "Captio AI blog article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#1C49F5";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? "Captio AI blog";
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
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>Captio AI Blog</div>
          {post && (
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
              {CATEGORIES[post.category].label}
            </div>
          )}
        </div>
        <div style={{ display: "flex", fontSize, fontWeight: 700, lineHeight: 1.08, maxWidth: 1010 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 500, opacity: 0.8 }}>captioai.app/blog</div>
      </div>
    ),
    { ...size },
  );
}
