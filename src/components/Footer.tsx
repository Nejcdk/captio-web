import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <span className="text-lg font-bold text-brand tracking-tight">Captio</span>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">
              Real-time live captions for deaf and hard of hearing people. iOS app. 60+ languages.
            </p>
          </div>

          <div className="flex flex-wrap gap-12 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-gray-900 mb-1">Features</span>
              <Link href="/live-captions" className="text-gray-500 hover:text-gray-900 transition-colors">Live Captions</Link>
              <Link href="/live-translator" className="text-gray-500 hover:text-gray-900 transition-colors">Live Translator</Link>
              <Link href="/audio-transcription" className="text-gray-500 hover:text-gray-900 transition-colors">Audio Transcription</Link>
              <Link href="/ai-summary" className="text-gray-500 hover:text-gray-900 transition-colors">AI Summary</Link>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-semibold text-gray-900 mb-1">Product</span>
              <Link href="/pricing" className="text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link>
              <Link href="/compare/otter-ai" className="text-gray-500 hover:text-gray-900 transition-colors">Compare</Link>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-semibold text-gray-900 mb-1">Legal</span>
              <Link href="/privacy" className="text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</Link>
              <Link href="/support" className="text-gray-500 hover:text-gray-900 transition-colors">Support</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} Captio. All rights reserved.</span>
          <span>iOS app · captioai.app</span>
        </div>
      </div>
    </footer>
  );
}
