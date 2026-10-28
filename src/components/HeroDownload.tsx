import Image from "next/image";
import { DownloadCard } from "@/components/StoreButtons";

// The landing pages' download box and app mockup: stacked on phones, side by
// side on a computer (box left, mockup right) so both are on screen at once
// right under the headline.
export default function HeroDownload({ alt }: { alt: string }) {
  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-12">
      <DownloadCard id="download" className="shrink-0" />
      <div className="mt-6 sm:mt-10 lg:mt-0 shrink-0">
        <Image
          src="/mockup_app.png"
          alt={alt}
          width={400}
          height={458}
          className="w-[280px] sm:w-[400px] lg:w-[300px] h-auto mx-auto drop-shadow-2xl"
          priority
        />
      </div>
    </div>
  );
}
