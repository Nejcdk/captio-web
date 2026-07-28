import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Captio terms of service.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service — Captio AI",
    description: "Captio terms of service.",
    url: "/terms",
    type: "website",
    images: ["/opengraph-image"],
  },
};

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-3">{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-600 leading-relaxed mb-4">{children}</p>;
}
function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-6 text-gray-600 leading-relaxed mb-4 space-y-1.5">{children}</ul>;
}

export default function TermsPage() {
  return (
    <>
      <main>
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: July 2026</p>

      <P>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the Captio iOS application
        and the captioai.app website (together, the &ldquo;Service&rdquo;). By using the Service, you agree to
        these Terms. If you do not agree, please do not use the Service.
      </P>

      <H2>1. Who we are</H2>
      <P>
        The Service is provided by <strong>Nejc Dovžan Kukič</strong>, a sole proprietor established in Slovenia
        (&ldquo;Captio&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). You can contact us at{" "}
        <a href="mailto:nejcdovzank@gmail.com" className="text-brand underline">nejcdovzank@gmail.com</a>.
      </P>

      <H2>2. The Service</H2>
      <P>
        Captio is an accessibility tool for deaf and hard of hearing people. It provides real-time live
        captions, live translation, transcription of audio you upload, and AI-generated summaries. Your audio
        is processed in real time and is not stored on our servers; transcripts and summaries are stored on
        your device. How we handle your data is described in our{" "}
        <a href="/privacy" className="text-brand underline">Privacy Policy</a>.
      </P>

      <H2>3. Eligibility</H2>
      <P>
        You may use Captio if you can form a binding contract with us under the law of your country. If you are
        under the age of digital consent in your country (16 in some parts of the EU; 15 in Slovenia), you may
        use Captio only with the consent and involvement of a parent or guardian, who accepts these Terms on
        your behalf.
      </P>

      <H2>4. Your account</H2>
      <P>
        Some features require an account, which you can create using Sign in with Apple, Google, or by
        registering manually. You are responsible for the accuracy of the information you provide and for
        keeping your login credentials confidential. You are responsible for activity that occurs under your
        account. If you believe your account has been compromised, contact us promptly.
      </P>

      <H2>5. Your content</H2>
      <P>
        You keep all rights in the audio you capture or upload and in the transcripts and summaries produced
        from it (&ldquo;Your Content&rdquo;). You grant us only the limited permission needed to process Your
        Content in order to provide the Service to you — for example, transmitting your audio to our processing
        providers to generate captions or a transcript. We do not use Your Content for any other purpose, we do
        not sell it, and we do not use it to train AI models. Audio is deleted after processing, and transcripts
        and summaries remain on your device.
      </P>

      <H2>6. Recording and consent</H2>
      <P>
        Laws about recording and captioning conversations differ from place to place. <strong>You are solely
        responsible for knowing and complying with the laws that apply to you</strong>, including giving any
        required notice to, and obtaining any required consent from, the people whose speech you caption,
        record, or upload. Captio is a tool; how you use it is your responsibility.
      </P>

      <H2>7. Accuracy &mdash; important</H2>
      <P>
        <strong>Captio uses automated speech recognition and AI, which are not perfect and can produce errors,
        omissions, or mistranslations.</strong> Captions, transcripts, translations, and summaries are provided
        for convenience and accessibility support only. <strong>Do not rely on them for emergency, medical,
        legal, financial, safety-critical, or other important decisions.</strong> Always confirm critical
        information through another means. We are not responsible for consequences arising from reliance on
        automatically generated text.
      </P>

      <H2>8. Acceptable use</H2>
      <P>You agree not to use the Service to:</P>
      <UL>
        <li>break any applicable law, or infringe anyone&rsquo;s rights, including privacy and intellectual property rights;</li>
        <li>record or caption people without any consent required by law;</li>
        <li>interfere with, disrupt, or attempt to gain unauthorized access to the Service or its systems;</li>
        <li>reverse engineer, decompile, or attempt to extract the source code of the Service, except where the law expressly permits it.</li>
      </UL>

      <H2>9. Plans and payment</H2>
      <P>
        Captio offers a free plan and a paid subscription (&ldquo;Plus&rdquo;). Paid subscriptions purchased in
        the iOS app are billed through the <strong>Apple App Store</strong>, and Apple is responsible for the
        payment. Prices are shown before you subscribe.
      </P>
      <UL>
        <li>
          <strong>Auto-renewal.</strong> Subscriptions renew automatically for the same period (monthly or
          yearly) until you cancel. Your Apple account is charged at the start of each period.
        </li>
        <li>
          <strong>Cancellation.</strong> You can cancel at any time in your Apple App Store account settings.
          Cancellation takes effect at the end of the current billing period.
        </li>
        <li>
          <strong>Refunds.</strong> Refunds for App Store purchases are handled by Apple in accordance with the
          App Store&rsquo;s policies. Except where the law requires otherwise, fees are non-refundable.
        </li>
        <li>
          <strong>Price changes.</strong> We may change subscription prices; changes apply to future billing
          periods and we will give notice where required.
        </li>
      </UL>

      <H2>10. Third-party services</H2>
      <P>
        The Service relies on third-party providers (for example, speech-recognition and AI processing,
        authentication, payments, and hosting). Their availability and performance are outside our control, and
        your use of them may be subject to their own terms. We are not responsible for third-party services.
      </P>

      <H2>11. Intellectual property</H2>
      <P>
        The Service, including the Captio app, website, software, branding, and content we provide, is owned by
        us or our licensors and is protected by law. We grant you a personal, non-exclusive, non-transferable,
        revocable license to use the Service for its intended purpose under these Terms. You may not copy, sell,
        rent, sublicense, or create derivative works from the Service except as the law allows.
      </P>

      <H2>12. Feedback</H2>
      <P>
        If you send us suggestions or feedback about the Service, we may use them freely, without any obligation
        or compensation to you.
      </P>

      <H2>13. Disclaimer</H2>
      <P>
        The Service is provided <strong>&ldquo;as is&rdquo; and &ldquo;as available&rdquo;</strong>, without
        warranties of any kind, whether express or implied, including implied warranties of merchantability,
        fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be
        uninterrupted, error-free, or that the text it produces will be accurate or complete. This does not
        affect any rights you have under mandatory consumer-protection law that cannot be waived.
      </P>

      <H2>14. Limitation of liability</H2>
      <P>
        To the fullest extent permitted by law, we will not be liable for any indirect, incidental, special,
        consequential, or punitive damages, or for any loss of data, arising out of or relating to your use of
        the Service. Our total liability for any claim relating to the Service will not exceed the amount you
        paid us for the Service in the twelve months before the event giving rise to the claim. Nothing in these
        Terms limits liability that cannot be limited under applicable law, including liability for death or
        personal injury caused by negligence, or for fraud.
      </P>

      <H2>15. Indemnification</H2>
      <P>
        You agree to indemnify and hold us harmless from claims, losses, and expenses arising from your misuse
        of the Service, your violation of these Terms, or your violation of any law or the rights of a third
        party (including recording or captioning people without required consent).
      </P>

      <H2>16. Suspension and termination</H2>
      <P>
        You may stop using the Service and delete your account at any time. We may suspend or terminate your
        access if you breach these Terms or use the Service unlawfully. You can delete your account from within
        the app or by contacting us.
      </P>

      <H2>17. Changes to these Terms</H2>
      <P>
        We may update these Terms from time to time. The date at the top shows when they were last changed. If
        we make material changes, we will notify you where required, and your continued use of the Service after
        the changes take effect means you accept the updated Terms.
      </P>

      <H2>18. Governing law and jurisdiction</H2>
      <P>
        These Terms are governed by the laws of Slovenia, without regard to conflict-of-law rules. The courts of
        Slovenia have jurisdiction over any dispute arising from these Terms or the Service, except where
        mandatory consumer-protection law gives you the right to bring proceedings in your country of residence.
      </P>

      <H2>19. Contact</H2>
      <P>
        Questions about these Terms? Contact{" "}
        <a href="mailto:nejcdovzank@gmail.com" className="text-brand underline">nejcdovzank@gmail.com</a>.
      </P>
        </div>
      </main>
      <Footer />
    </>
  );
}
