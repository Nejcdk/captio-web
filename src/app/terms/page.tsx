import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Captio AI terms of service.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service | Captio AI",
    description: "Captio AI terms of service.",
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
      <p className="text-sm text-gray-500 mb-10">Last updated: October 30, 2026</p>

      <P>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the Captio AI apps for iPhone
        and Android and the captioai.app website (together, the &ldquo;Service&rdquo;). By using the Service, you agree to
        these Terms. If you do not agree, please do not use the Service.
      </P>

      <H2>1. Who we are</H2>
      <P>
        The Service is provided by <strong>Nejc Dovžan Kukič</strong>, a sole proprietor established in Slovenia
        (&ldquo;Captio AI&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). You can contact us at{" "}
        <a href="mailto:nejcdovzank@gmail.com" className="text-brand underline">nejcdovzank@gmail.com</a>.
      </P>

      <H2>2. The Service</H2>
      <P>
        Captio AI is an accessibility tool for deaf and hard of hearing people. It provides real-time live
        captions, live translation, transcription of audio you upload, and AI-generated summaries. Your audio
        is processed in real time and is not stored on our servers. Transcripts and summaries are stored on your
        device and synced to our secure cloud so they&rsquo;re available across your devices; they are never used
        to train AI models. How we handle your data is described in our{" "}
        <Link href="/privacy" className="text-brand underline">Privacy Policy</Link>.
      </P>

      <H2>3. Eligibility</H2>
      <P>
        You may use Captio AI if you can form a binding contract with us under the law of your country. If you are
        under the age of digital consent in your country (16 in some parts of the EU; 15 in Slovenia), you may
        use Captio AI only with the consent and involvement of a parent or guardian, who accepts these Terms on
        your behalf.
      </P>

      <H2>4. Your account</H2>
      <P>
        Some features require an account, which you can create using Sign in with Apple (on iPhone) or Google. You are responsible for the accuracy of the information you provide and for
        keeping your login credentials confidential. You are responsible for activity that occurs under your
        account. If you believe your account has been compromised, contact us promptly.
      </P>

      <H2>5. Your content</H2>
      <P>
        You keep all rights in the audio you capture or upload and in the transcripts and summaries produced
        from it (&ldquo;Your Content&rdquo;). You grant us only the limited permission needed to process Your
        Content in order to provide the Service to you — for example, transmitting your audio to our processing
        providers to generate captions or a transcript. We do not use Your Content for any other purpose, we do
        not sell it, and we do not use it to train AI models. Audio is deleted after processing and is not stored
        on our servers. Transcripts and summaries are stored on your device and synced to our cloud so you can
        access them across your devices; they are deleted when you delete them or delete your account.
      </P>

      <H2>6. Recording and consent</H2>
      <P>
        Laws about recording and captioning conversations differ from place to place. <strong>You are solely
        responsible for knowing and complying with the laws that apply to you</strong>, including giving any
        required notice to, and obtaining any required consent from, the people whose speech you caption,
        record, or upload. Captio AI is a tool; how you use it is your responsibility.
      </P>

      <H2>7. Accuracy &mdash; important</H2>
      <P>
        <strong>Captio AI uses automated speech recognition and AI, which are not perfect and can produce errors,
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
        Captio AI offers a free plan with daily limits and a paid subscription (&ldquo;Plus&rdquo;). Paid
        subscriptions are billed by the store you bought them from: the <strong>Apple App Store</strong> in the
        iPhone app and <strong>Google Play</strong> in the Android app. That store is responsible for the payment
        (&ldquo;your store account&rdquo; below means your Apple account or your Google account). Prices are shown
        before you subscribe.
      </P>
      <UL>
        <li>
          <strong>Free trial.</strong> New subscribers may be offered a free trial; its length is shown in the app
          before you start it. Unless you cancel at least 24 hours before the trial ends, it automatically becomes
          a paid subscription and your store account is charged when the paid period starts. Apple or Google
          decides who is eligible for a free trial (generally one per Apple ID or Google account).
        </li>
        <li>
          <strong>Auto-renewal.</strong> Subscriptions renew automatically for the same period (monthly or
          yearly) until you cancel. Your store account is charged at the start of each period.
        </li>
        <li>
          <strong>Cancellation.</strong> You can cancel at any time in your Apple App Store account settings
          (iPhone) or in Google Play under Payments &amp; subscriptions (Android). Uninstalling the app does not
          cancel a subscription. Cancellation takes effect at the end of the current billing period.
        </li>
        <li>
          <strong>Refunds.</strong> Refunds are handled by the store you paid through, under its own
          policies: Apple for App Store purchases, Google for Google Play purchases. Except where the law requires otherwise, fees are non-refundable.
        </li>
        <li>
          <strong>Price changes.</strong> We may change subscription prices; changes apply to future billing
          periods and we will give notice where required.
        </li>
      </UL>

      <H2>10. Referral program</H2>
      <P>
        You can refer people to Captio AI with your personal link or code (in the app, under Referral program). The
        program is run by us; Apple and Google are not involved in it.
      </P>
      <UL>
        <li>
          <strong>Free Plus.</strong> When someone redeems your link or code and saves their first recording, you
          both get free Plus access for the period shown in the app. This free access has no cash value and
          can&rsquo;t be transferred or exchanged.
        </li>
        <li>
          <strong>Cash rewards.</strong> When someone you referred makes their first real payment for Plus, you earn
          USD 10 for a monthly plan or USD 30 for a yearly plan. You can refer as many people as you like and earn
          up to USD 2,500 in total; rewards stop at that amount. Free trials, promotional access, Family Sharing, renewals, and plan changes that
          haven&rsquo;t been paid for don&rsquo;t count. A reward is never more than 90% of what that person paid.
        </li>
        <li>
          <strong>When you get paid.</strong> Rewards are held for 30 days after the payment, in case it is refunded.
          After that we send a link to the email address on your account, where you choose how to receive the money
          (for example, a prepaid Visa card, PayPal, or a gift card). Rewards are paid in US dollars through our
          payout provider, Tremendous, whose own terms apply to the reward. The options offered can differ by country.
        </li>
        <li>
          <strong>Refunds.</strong> If the payment is refunded during the 30 days, there is no reward. If it is
          refunded after you were paid, that amount is taken off your next payout.
        </li>
        <li>
          <strong>Who can take part.</strong> Each account and each device counts once, and you can&rsquo;t refer
          yourself. Cash rewards aren&rsquo;t available where the law or our payout provider doesn&rsquo;t allow
          them, including Cuba, Iran, North Korea, Syria, Russia, and Belarus; there, the program is the free Plus
          access only.
        </li>
        <li>
          <strong>Taxes.</strong> You are responsible for any taxes on what you earn.
        </li>
        <li>
          <strong>Abuse.</strong> We may withhold or cancel rewards obtained through abuse, for example fake accounts,
          buying for yourself through someone else&rsquo;s account, spam, or misleading claims about Captio AI.
        </li>
        <li>
          <strong>Changes.</strong> We may change or end the program at any time. Free Plus access already granted
          stays valid for its period, and rewards you already earned under the rules at the time stay yours.
        </li>
      </UL>

      <H2>11. Third-party services</H2>
      <P>
        The Service relies on third-party providers (for example, speech-recognition and AI processing,
        authentication, payments, and hosting). Their availability and performance are outside our control, and
        your use of them may be subject to their own terms. We are not responsible for third-party services.
      </P>

      <H2>12. Intellectual property</H2>
      <P>
        The Service, including the Captio AI app, website, software, branding, and content we provide, is owned by
        us or our licensors and is protected by law. We grant you a personal, non-exclusive, non-transferable,
        revocable license to use the Service for its intended purpose under these Terms. You may not copy, sell,
        rent, sublicense, or create derivative works from the Service except as the law allows.
      </P>

      <H2>13. Feedback</H2>
      <P>
        If you send us suggestions or feedback about the Service, we may use them freely, without any obligation
        or compensation to you.
      </P>

      <H2>14. Disclaimer</H2>
      <P>
        The Service is provided <strong>&ldquo;as is&rdquo; and &ldquo;as available&rdquo;</strong>, without
        warranties of any kind, whether express or implied, including implied warranties of merchantability,
        fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be
        uninterrupted, error-free, or that the text it produces will be accurate or complete. This does not
        affect any rights you have under mandatory consumer-protection law that cannot be waived.
      </P>

      <H2>15. Limitation of liability</H2>
      <P>
        To the fullest extent permitted by law, we will not be liable for any indirect, incidental, special,
        consequential, or punitive damages, or for any loss of data, arising out of or relating to your use of
        the Service. Our total liability for any claim relating to the Service will not exceed the amount you
        paid us for the Service in the twelve months before the event giving rise to the claim. Nothing in these
        Terms limits liability that cannot be limited under applicable law, including liability for death or
        personal injury caused by negligence, or for fraud.
      </P>

      <H2>16. Indemnification</H2>
      <P>
        You agree to indemnify and hold us harmless from claims, losses, and expenses arising from your misuse
        of the Service, your violation of these Terms, or your violation of any law or the rights of a third
        party (including recording or captioning people without required consent).
      </P>

      <H2>17. Suspension and termination</H2>
      <P>
        You may stop using the Service and delete your account at any time. We may suspend or terminate your
        access if you breach these Terms or use the Service unlawfully. You can delete your account from within
        the app or by contacting us.
      </P>

      <H2>18. Changes to these Terms</H2>
      <P>
        We may update these Terms from time to time. The date at the top shows when they were last changed. If
        we make material changes, we will notify you where required, and your continued use of the Service after
        the changes take effect means you accept the updated Terms.
      </P>

      <H2>19. Governing law and jurisdiction</H2>
      <P>
        These Terms are governed by the laws of Slovenia, without regard to conflict-of-law rules. The courts of
        Slovenia have jurisdiction over any dispute arising from these Terms or the Service, except where
        mandatory consumer-protection law gives you the right to bring proceedings in your country of residence.
      </P>

      <H2>20. Contact</H2>
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
