import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <div className="sticky top-3 z-50 px-4">
      <header className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo_text.png"
            alt="Captio"
            width={90}
            height={24}
            priority
            style={{ filter: "brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(2000%) hue-rotate(218deg) brightness(105%)" }}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <Link href="/live-captions" className="hover:text-gray-900 transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
          <Link href="/language" className="hover:text-gray-900 transition-colors">Languages</Link>
          <Link href="/compare/otter-ai" className="hover:text-gray-900 transition-colors">Compare</Link>
          <Link href="/support" className="hover:text-gray-900 transition-colors">Support</Link>
        </nav>

        <a
          href="#download"
          className="bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-[14px] hover:bg-brand-dark transition-colors"
        >
          Download
        </a>
      </header>
    </div>
  );
}
