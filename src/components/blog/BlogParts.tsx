import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, formatDay, type BlogPost, type CategorySlug } from "@/lib/blog";

const STORE_URL = "https://apps.apple.com/si/app/captio-ai/id6796617180";

/** Thin vertical rule between meta items (never a dot separator). */
export function MetaDivider() {
  return <span aria-hidden className="inline-block w-px h-3.5 bg-gray-300" />;
}

export function CategoryChip({ category, onDark = false }: { category: CategorySlug; onDark?: boolean }) {
  return (
    <span
      className={`inline-block text-[11px] font-bold uppercase tracking-widest rounded-[6px] px-2.5 py-1 ${
        onDark ? "bg-white/15 text-white" : "bg-brand-light text-brand"
      }`}
    >
      {CATEGORIES[category].label}
    </span>
  );
}

export function PostMeta({ post, onDark = false }: { post: BlogPost; onDark?: boolean }) {
  return (
    <div className={`flex items-center gap-3 text-xs ${onDark ? "text-white/70" : "text-gray-400"}`}>
      <time dateTime={post.updated}>{formatDay(post.updated)}</time>
      <MetaDivider />
      <span>{post.readingMinutes} min read</span>
    </div>
  );
}

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white border border-gray-200 rounded-xl p-6 hover:border-brand transition-colors"
    >
      <div>
        <CategoryChip category={post.category} />
      </div>
      <h3 className="mt-4 font-bold text-lg text-gray-900 leading-snug tracking-tight group-hover:text-brand transition-colors">
        {post.title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-3">{post.description}</p>
      <div className="mt-auto pt-5">
        <PostMeta post={post} />
      </div>
    </Link>
  );
}

export function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-brand rounded-xl p-7 sm:p-10 text-white hover:bg-brand-dark transition-colors"
    >
      <div className="flex items-center gap-3">
        <CategoryChip category={post.category} onDark />
        <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">Latest</span>
      </div>
      <h2 className="mt-5 text-2xl sm:text-[2.1rem] font-bold leading-[1.15] tracking-tight max-w-3xl">
        {post.title}
      </h2>
      <p className="mt-4 text-base sm:text-lg text-blue-100 leading-relaxed max-w-2xl">{post.answer}</p>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <PostMeta post={post} onDark />
        <span className="inline-flex items-center gap-1.5 bg-white text-brand text-sm font-semibold px-5 py-2.5 rounded-[8px]">
          Read the article
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 transition-transform group-hover:translate-x-0.5">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export function CategoryNav({ active }: { active?: CategorySlug }) {
  const base = "shrink-0 text-sm font-semibold px-4 py-2 rounded-[8px] border transition-colors";
  const on = "bg-brand border-brand text-white";
  const off = "bg-white border-gray-200 text-gray-600 hover:border-brand hover:text-brand";
  return (
    <nav aria-label="Blog categories" className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
      <Link href="/blog" className={`${base} ${active ? off : on}`}>
        All
      </Link>
      {(Object.keys(CATEGORIES) as CategorySlug[]).map((slug) => (
        <Link key={slug} href={`/blog/category/${slug}`} className={`${base} ${active === slug ? on : off}`}>
          {CATEGORIES[slug].label}
        </Link>
      ))}
    </nav>
  );
}

export function AppStoreButton({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href={STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 bg-cta text-white font-semibold rounded-[8px] hover:bg-cta-dark transition-colors ${
        compact ? "px-5 py-3" : "px-7 py-4"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className={compact ? "w-5 h-5 shrink-0" : "w-6 h-6 shrink-0"}>
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04l-.05.17ZM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" />
      </svg>
      <span>
        <span className="block text-xs font-normal opacity-75 leading-none mb-1">Download on the</span>
        <span className={`block font-bold leading-none ${compact ? "text-base" : "text-lg"}`}>App Store</span>
      </span>
    </a>
  );
}

/** The app pitch inside an article: one calm paragraph, the store button, a risk-reducer. */
export function InArticleCta() {
  return (
    <section id="download" className="my-12 bg-gray-50 border border-gray-100 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:items-center">
      <Image src="/logo_image_profile.png" alt="" width={56} height={56} className="rounded-full shrink-0" />
      <div className="flex-1">
        <h2 className="font-bold text-gray-900 text-lg leading-snug">Read what people say, while they say it</h2>
        <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
          Captio AI puts live captions on your phone for conversations, appointments, lectures and meetings, in 60+ languages. Free to start. Private by default.
        </p>
      </div>
      <div className="shrink-0">
        <AppStoreButton compact />
      </div>
    </section>
  );
}

/** Bottom-of-page download block for the blog index and category pages. */
export function BlogDownloadBlock() {
  return (
    <section id="download" className="pt-6 pb-20 px-5 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto bg-gray-50 border border-gray-100 rounded-xl px-6 py-10 sm:px-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <span className="text-xs font-bold text-cta uppercase tracking-widest">Captio AI</span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Follow every conversation.</h2>
          <p className="mt-3 text-gray-500 leading-relaxed max-w-xl">
            Live captions on your phone for the doctor, the classroom and the dinner table. Built for deaf and hard of hearing people. Free to start.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:block p-3 bg-white border border-gray-200 rounded-xl">
            <Image src="/qr-appstore.png" alt="QR code to download Captio AI on the App Store" width={96} height={96} className="w-24 h-24 rounded-lg" />
          </div>
          <AppStoreButton />
        </div>
      </div>
    </section>
  );
}
