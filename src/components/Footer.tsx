import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-brand text-white">
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-0">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div>
            <Image src="/logo_text.png" alt="Captio AI" width={90} height={25} />
            <p className="mt-3 text-sm text-white/60 max-w-xs leading-relaxed">
              Live captions and productivity tool for deaf and HoH people.
            </p>
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
              <span className="font-semibold text-white/40 uppercase tracking-widest text-xs mb-1">Company</span>
              <Link href="/pricing" className="text-white/70 hover:text-white transition-colors">Pricing</Link>
              <Link href="/privacy" className="text-white/70 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-white/70 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/support" className="text-white/70 hover:text-white transition-colors">Support</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Captio AI. All rights reserved.</span>
          <span>iOS app · captioai.app</span>
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
