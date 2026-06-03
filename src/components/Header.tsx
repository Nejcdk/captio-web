import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <div className="px-4 pt-4">
      <header className="max-w-6xl mx-auto bg-brand rounded-2xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo_text.png"
            alt="Captio"
            width={100}
            height={28}
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <Link href="/live-captions" className="hover:text-white transition-colors">Features</Link>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/language" className="hover:text-white transition-colors">Languages</Link>
          <Link href="/compare/otter-ai" className="hover:text-white transition-colors">Compare</Link>
          <Link href="/support" className="hover:text-white transition-colors">Support</Link>
        </nav>

        <a
          href="#download"
          className="bg-white text-brand text-sm font-semibold px-5 py-2.5 rounded-[14px] hover:bg-blue-50 transition-colors"
        >
          Download
        </a>
      </header>
    </div>
  );
}
