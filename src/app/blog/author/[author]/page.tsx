import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BlogDownloadBlock, PostCard } from "@/components/blog/BlogParts";
import { AUTHORS, getPostsByAuthor, type AuthorKey } from "@/lib/blog";
import { SITE_URL, breadcrumbSchema, jsonLd } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(AUTHORS).map((author) => ({ author }));
}

type Props = { params: Promise<{ author: string }> };

// How the articles are made. Shown on the author page so readers (and search
// engines) can see who writes, how, and how facts are checked.
const PROCESS = [
  {
    title: "Real questions first",
    text: "Every article starts from a question people ask about hearing loss, captions or access, and answers it in the first paragraph.",
  },
  {
    title: "Primary sources",
    text: "Numbers come from the WHO, national health agencies, peer-reviewed studies and disability organisations. Each one links to its source at the bottom of the page.",
  },
  {
    title: "Fair comparisons",
    text: "Other apps and services are described from their own websites and store listings, checked on the day of writing, including where they do better than Captio AI.",
  },
  {
    title: "Checked before it goes live",
    text: "Articles are researched and drafted with the help of AI tools, then checked claim by claim against their sources before they are published. When a figure changes, the article and its date are updated.",
  },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { author } = await params;
  const a = AUTHORS[author as AuthorKey];
  if (!a) return {};
  return {
    title: `${a.byline}: Articles on Hearing Loss and Captions`,
    description: a.bio,
    alternates: { canonical: `/blog/author/${author}` },
    openGraph: {
      title: `${a.byline} | Captio AI`,
      description: a.bio,
      url: `/blog/author/${author}`,
      type: "profile",
      images: ["/opengraph-image"],
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { author } = await params;
  const a = AUTHORS[author as AuthorKey];
  if (!a) notFound();
  const posts = getPostsByAuthor(author as AuthorKey);

  const schema = jsonLd(
    {
      "@type": "ProfilePage",
      url: a.url,
      mainEntity: {
        "@type": "Person",
        "@id": `${a.url}#person`,
        name: a.name,
        url: a.url,
        description: a.bio,
        worksFor: { "@id": `${SITE_URL}/#organization` },
      },
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: a.byline, path: `/blog/author/${author}` },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <Header />

        <section className="px-5 sm:px-6 pt-10 sm:pt-16 pb-10">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog" className="text-xs font-bold text-cta uppercase tracking-widest hover:underline">
              Blog
            </Link>
            <div className="mt-5 flex items-center gap-4">
              <Image src="/logo_image_profile.png" alt="" width={64} height={64} className="rounded-full" />
              <h1 className="text-[2rem] leading-tight sm:text-5xl font-bold text-gray-900 tracking-tight">{a.byline}</h1>
            </div>
            <p className="mt-5 text-lg text-gray-500 leading-relaxed">{a.bio}</p>

            <h2 className="mt-12 text-2xl font-bold text-gray-900 tracking-tight">How the articles are written</h2>
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              {PROCESS.map((item) => (
                <div key={item.title} className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-gray-400">
              Spotted a mistake?{" "}
              <a href="mailto:hello@captioai.app" className="text-brand font-semibold hover:underline">hello@captioai.app</a>
            </p>
          </div>
        </section>

        {posts.length > 0 && (
          <section className="px-5 sm:px-6 pb-14">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Articles</h2>
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        <BlogDownloadBlock />
      </main>
      <Footer />
    </>
  );
}
