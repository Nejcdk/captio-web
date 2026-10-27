import Link from "next/link";
import Image from "next/image";
import { useCases } from "@/lib/useCases";
import { getAllPosts } from "@/lib/blog";

export default function Footer() {
  // Newest articles on every page: readers find them, and crawlers reach a new
  // article from ~800 pages the day it is published.
  const latestPosts = getAllPosts().slice(0, 4);
  return (
    <footer className="bg-brand text-white">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-0">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div>
            <Image src="/logo_text.png" alt="Captio AI" width={90} height={25} />
            <p className="mt-3 text-sm text-white/60 max-w-xs leading-relaxed">
              Live captions and productivity tool for deaf and HoH people.
            </p>

            {/* Product Hunt's embed card, rebuilt in Tailwind with the app icon served from here. */}
            <div className="mt-6 max-w-xs rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Image src="/app_icon.png" alt="Captio AI" width={48} height={48} className="rounded-lg shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-[#1a1a1a] leading-tight">Captio AI</p>
                  <p className="mt-1 text-xs text-[#666] leading-snug line-clamp-2">Live Captions &amp; Transcription for Deaf and Hard of Hearing</p>
                </div>
              </div>
              <a
                href="https://www.producthunt.com/products/captio-ai?embed=true&utm_source=embed&utm_medium=post_embed"
                target="_blank"
                rel="noopener"
                className="mt-3 inline-flex items-center rounded-full bg-[#FF6154] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e8564a] transition-colors"
              >
                Check it out on Product Hunt →
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-12 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-white/40 uppercase tracking-widest text-xs mb-1">Features</span>
              <Link href="/live-captions" className="text-white/70 hover:text-white transition-colors">Live Captions</Link>
              <Link href="/live-translator" className="text-white/70 hover:text-white transition-colors">Live Translator</Link>
              <Link href="/audio-transcription" className="text-white/70 hover:text-white transition-colors">Audio Transcription</Link>
              <Link href="/ai-summary" className="text-white/70 hover:text-white transition-colors">AI Summary</Link>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-semibold text-white/40 uppercase tracking-widest text-xs mb-1">Use Cases</span>
              {useCases.map((uc) => (
                <Link key={uc.slug} href={`/use-cases/${uc.slug}`} className="text-white/70 hover:text-white transition-colors">{uc.label}</Link>
              ))}
            </div>

            <div className="flex flex-col gap-2 max-w-[15rem]">
              <Link href="/blog" className="font-semibold text-white/40 hover:text-white uppercase tracking-widest text-xs mb-1 transition-colors">Blog</Link>
              {latestPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="text-white/70 hover:text-white transition-colors leading-snug">{post.title}</Link>
              ))}
              <Link href="/blog" className="text-white font-semibold hover:underline">All articles</Link>

              <span className="font-semibold text-white/40 uppercase tracking-widest text-xs mt-6 mb-1">Company</span>
              <Link href="/privacy" className="text-white/70 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-white/70 hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-center overflow-hidden h-72">
        <Image
          src="/captio_original.png"
          alt=""
          width={460}
          height={460}
          className="object-top object-cover"
        />
      </div>
    </footer>
  );
}
