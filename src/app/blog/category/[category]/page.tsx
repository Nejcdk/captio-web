import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BlogDownloadBlock, CategoryNav, PostCard } from "@/components/blog/BlogParts";
import { CATEGORIES, getPostsByCategory, type CategorySlug } from "@/lib/blog";
import { SITE_URL, breadcrumbSchema, jsonLd } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES[category as CategorySlug];
  if (!cat) return {};
  const posts = getPostsByCategory(category as CategorySlug);
  return {
    title: `${cat.label}: Hearing Loss and Captions`,
    description: cat.description,
    alternates: { canonical: `/blog/category/${category}` },
    // An empty category page is thin content: keep it out of the index until
    // it has articles (links on it are still followed).
    robots: posts.length === 0 ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `${cat.label}: Hearing Loss and Captions | Captio AI`,
      description: cat.description,
      url: `/blog/category/${category}`,
      type: "website",
      images: ["/opengraph-image"],
    },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = CATEGORIES[category as CategorySlug];
  if (!cat) notFound();
  const posts = getPostsByCategory(category as CategorySlug);

  const schema = jsonLd(
    {
      "@type": "CollectionPage",
      name: `${cat.label}, Captio AI Blog`,
      url: `${SITE_URL}/blog/category/${category}`,
      description: cat.description,
      isPartOf: { "@id": `${SITE_URL}/blog#blog` },
      hasPart: posts.map((p) => ({ "@id": `${SITE_URL}/blog/${p.slug}#article` })),
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: cat.label, path: `/blog/category/${category}` },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <Header />

        <section className="px-5 sm:px-6 pt-10 sm:pt-16 pb-8">
          <div className="max-w-6xl mx-auto">
            <Link href="/blog" className="text-xs font-bold text-cta uppercase tracking-widest hover:underline">
              Blog
            </Link>
            <h1 className="mt-3 text-[2.2rem] leading-[1.12] sm:text-5xl font-bold text-gray-900 tracking-tight">
              {cat.label}
            </h1>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed max-w-2xl">{cat.description}</p>
            <div className="mt-8">
              <CategoryNav active={category as CategorySlug} />
            </div>
          </div>
        </section>

        <section className="px-5 sm:px-6 pb-14">
          <div className="max-w-6xl mx-auto">
            {posts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No articles here yet. <Link href="/blog" className="text-brand font-semibold hover:underline">See all articles</Link>
              </p>
            )}
          </div>
        </section>

        <BlogDownloadBlock />
      </main>
      <Footer />
    </>
  );
}
