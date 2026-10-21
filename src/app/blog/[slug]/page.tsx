import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  AppStoreButton,
  CategoryChip,
  InArticleCta,
  MetaDivider,
  PostCard,
} from "@/components/blog/BlogParts";
import { AUTHORS, CATEGORIES, formatDay, getAllPosts, getPost, getRelatedPosts } from "@/lib/blog";
import { SITE_URL, blogPostingSchema, breadcrumbSchema, faqPageSchema, jsonLd } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": "/blog/rss.xml" },
    },
    openGraph: {
      title: `${post.title} | Captio AI`,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.published,
      modifiedTime: post.updated,
      section: CATEGORIES[post.category].label,
      tags: post.tags,
    },
    other: {
      "article:published_time": post.published,
      "article:modified_time": post.updated,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const author = AUTHORS[post.author];
  const category = CATEGORIES[post.category];
  const related = getRelatedPosts(post);
  const url = `${SITE_URL}/blog/${post.slug}`;

  const schema = jsonLd(
    blogPostingSchema({
      url,
      headline: post.title,
      description: post.description,
      datePublished: post.published,
      dateModified: post.updated,
      author,
      section: category.label,
      keywords: post.tags,
      wordCount: post.words,
      image: `${url}/opengraph-image`,
      citations: post.sources,
    }),
    ...(post.faqs.length > 0 ? [faqPageSchema(post.faqs)] : []),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: category.label, path: `/blog/category/${post.category}` },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main>
        <Header />

        <article className="px-5 sm:px-6 pt-8 sm:pt-12 pb-10">
          <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
            <div className="max-w-[720px] min-w-0">
              {/* ── Breadcrumb ── */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-400">
                <Link href="/blog" className="hover:text-brand transition-colors">Blog</Link>
                <span aria-hidden>/</span>
                <Link href={`/blog/category/${post.category}`} className="hover:text-brand transition-colors">
                  {category.label}
                </Link>
              </nav>

              {/* ── Title block ── */}
              <header className="mt-6">
                <CategoryChip category={post.category} />
                <h1 className="mt-4 text-[2.05rem] leading-[1.12] sm:text-5xl sm:leading-[1.08] font-bold text-gray-900 tracking-tight">
                  {post.title}
                </h1>
                <p className="mt-4 text-lg text-gray-500 leading-relaxed">{post.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <Image src="/logo_image_profile.png" alt="" width={24} height={24} className="rounded-full" />
                    <span className="font-semibold text-gray-700">{author.name}</span>
                  </span>
                  <MetaDivider />
                  <span>
                    {post.updated !== post.published ? "Updated " : ""}
                    <time dateTime={post.updated}>{formatDay(post.updated)}</time>
                  </span>
                  <MetaDivider />
                  <span>{post.readingMinutes} min read</span>
                </div>
              </header>

              {/* ── Short answer (the paragraph answer engines quote) ── */}
              <section aria-labelledby="short-answer" className="mt-8 bg-brand-light/60 border border-brand/15 rounded-xl p-5 sm:p-6">
                <h2 id="short-answer" className="text-xs font-bold text-brand uppercase tracking-widest">
                  Short answer
                </h2>
                <p className="mt-2.5 text-[17px] leading-relaxed text-gray-900 font-medium">{post.answer}</p>
              </section>

              {/* ── Key facts ── */}
              {post.keyFacts.length > 0 && (
                <div className="mt-5 grid sm:grid-cols-3 gap-3">
                  {post.keyFacts.map((fact) => (
                    <div key={fact.value} className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 sm:p-5 flex items-center gap-4 sm:block">
                      <p className="shrink-0 w-[8.5rem] sm:w-auto text-[1.45rem] sm:text-[1.7rem] leading-none font-bold text-brand tracking-tight">
                        {fact.value}
                        {fact.source && (
                          <sup className="cite">
                            <a href={`#source-${fact.source}`} aria-label={`Source ${fact.source}`}>{fact.source}</a>
                          </sup>
                        )}
                      </p>
                      <p className="sm:mt-2.5 text-sm text-gray-600 leading-snug">{fact.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Contents (small screens; the sidebar has it on desktop) ── */}
              {post.toc.length >= 3 && (
                <details className="lg:hidden mt-8 border border-gray-200 rounded-xl group">
                  <summary className="cursor-pointer list-none flex items-center justify-between px-5 py-4 font-semibold text-gray-900 text-sm">
                    On this page
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </summary>
                  <ol className="px-5 pb-4 flex flex-col gap-2.5 text-sm">
                    {post.toc.map((item) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`} className="text-gray-600 hover:text-brand">{item.text}</a>
                      </li>
                    ))}
                  </ol>
                </details>
              )}

              {/* ── Body ── */}
              <div className="blog-prose mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />

              <InArticleCta />

              {/* ── FAQ: always in the HTML, not behind a click ── */}
              {post.faqs.length > 0 && (
                <section aria-labelledby="faq" className="mt-4">
                  <h2 id="faq" className="text-2xl sm:text-[1.7rem] font-bold text-gray-900 tracking-tight scroll-mt-24">
                    Frequently asked questions
                  </h2>
                  <div className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
                    {post.faqs.map((faq) => (
                      <div key={faq.q} className="py-5">
                        <h3 className="font-semibold text-gray-900 text-base sm:text-[17px] leading-snug">{faq.q}</h3>
                        <p className="mt-2 text-[15px] sm:text-base text-gray-600 leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Sources ── */}
              <section aria-labelledby="sources" className="mt-12">
                <h2 id="sources" className="text-2xl sm:text-[1.7rem] font-bold text-gray-900 tracking-tight scroll-mt-24">
                  Sources
                </h2>
                <ol className="mt-5 flex flex-col gap-3">
                  {post.sources.map((s, i) => (
                    <li key={s.url} id={`source-${i + 1}`} className="flex gap-3 scroll-mt-24 text-sm leading-relaxed">
                      <span className="shrink-0 w-6 h-6 rounded-[6px] bg-brand-light text-brand text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-gray-600">
                        <a href={s.url} target="_blank" rel="noopener" className="font-semibold text-gray-900 hover:text-brand underline decoration-gray-300 underline-offset-2">
                          {s.title}
                        </a>
                        <span className="block text-gray-400">
                          {s.publisher}
                          {s.year ? `, ${s.year}` : ""}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* ── About this article ── */}
              <p className="mt-10 text-sm text-gray-400 leading-relaxed border-t border-gray-100 pt-6">
                Published {formatDay(post.published)}
                {post.updated !== post.published ? `, last updated ${formatDay(post.updated)}` : ""}. Every figure on this page links to its source. Spotted a mistake?{" "}
                <a href="mailto:hello@captioai.app" className="text-brand font-semibold hover:underline">hello@captioai.app</a>
              </p>
            </div>

            {/* ── Sidebar (desktop) ── */}
            <aside className="hidden lg:block">
              <div className="sticky top-8 flex flex-col gap-6">
                {post.toc.length >= 3 && (
                  <nav aria-label="On this page">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">On this page</p>
                    <ol className="mt-4 flex flex-col gap-3 text-sm border-l border-gray-200">
                      {post.toc.map((item) => (
                        <li key={item.id}>
                          <a href={`#${item.id}`} className="block pl-4 -ml-px border-l border-transparent text-gray-500 hover:text-brand hover:border-brand leading-snug transition-colors">
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}
                <div className="bg-brand rounded-xl p-6 text-white">
                  <Image src="/logo_text.png" alt="Captio AI" width={96} height={26} />
                  <p className="mt-4 text-sm text-blue-100 leading-relaxed">
                    Live captions on your phone for deaf and hard of hearing people. 60+ languages. Free to start.
                  </p>
                  <div className="mt-5 p-3 bg-white rounded-xl w-fit">
                    <Image src="/qr-appstore.png" alt="QR code to download Captio AI on the App Store" width={88} height={88} className="w-[88px] h-[88px] rounded-lg" />
                  </div>
                  <div className="mt-4">
                    <AppStoreButton compact />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </article>

        {/* ── Keep reading ── */}
        {related.length > 0 && (
          <section className="px-5 sm:px-6 py-14 bg-gray-50 border-t border-gray-100">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Keep reading</h2>
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
