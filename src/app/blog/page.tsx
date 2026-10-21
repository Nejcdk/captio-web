import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BlogDownloadBlock, CategoryNav, FeaturedPostCard, PostCard } from "@/components/blog/BlogParts";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL, breadcrumbSchema, jsonLd } from "@/lib/schema";

const DESCRIPTION =
  "Data, comparisons and guides about hearing loss, live captions and accessibility, for deaf and hard of hearing people. Every number links to its source.";

export const metadata: Metadata = {
  title: "Blog: Hearing Loss, Captions and Accessibility",
  description: DESCRIPTION,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
  openGraph: {
    title: "Blog: Hearing Loss, Captions and Accessibility | Captio AI",
    description: DESCRIPTION,
    url: "/blog",
    type: "website",
    images: ["/opengraph-image"],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const [latest, ...rest] = posts;

  const schema = jsonLd(
    {
      "@type": "Blog",
      "@id": `${SITE_URL}/blog#blog`,
      name: "Captio AI Blog",
      url: `${SITE_URL}/blog`,
      description: DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
      blogPost: posts.slice(0, 20).map((p) => ({ "@id": `${SITE_URL}/blog/${p.slug}#article` })),
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <Header />

        <section className="px-5 sm:px-6 pt-10 sm:pt-16 pb-8">
          <div className="max-w-6xl mx-auto">
            <span className="text-xs font-bold text-cta uppercase tracking-widest">Blog</span>
            <h1 className="mt-3 text-[2.2rem] leading-[1.12] sm:text-5xl font-bold text-gray-900 tracking-tight max-w-3xl">
              Hearing loss and captions, in plain facts.
            </h1>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed max-w-2xl">
              Data, comparisons and guides for deaf and hard of hearing people and the people around them. Every number links to its source.
            </p>
            <div className="mt-8">
              <CategoryNav />
            </div>
          </div>
        </section>

        <section className="px-5 sm:px-6 pb-14">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            {latest ? (
              <FeaturedPostCard post={latest} />
            ) : (
              <p className="text-gray-500">The first article is on its way.</p>
            )}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>

        <BlogDownloadBlock />
      </main>
      <Footer />
    </>
  );
}
