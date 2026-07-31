import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Captio privacy policy — how we handle your data.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy — Captio AI",
    description: "Captio privacy policy — how we handle your data.",
    url: "/privacy",
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

export default function PrivacyPage() {
  return (
    <>
      <main>
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: July 31, 2026</p>

      <P>
        This Privacy Policy explains how Captio (&ldquo;Captio&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
        &ldquo;our&rdquo;) collects, uses, and protects your personal data when you use the Captio iOS
        application and the captioai.app website (together, the &ldquo;Service&rdquo;). Captio is built as an
        accessibility tool for deaf and hard of hearing people, and privacy is central to how it works.
      </P>

      <H2>1. Who is responsible for your data</H2>
      <P>
        The data controller responsible for your personal data is <strong>Nejc Dovžan Kukič</strong>, a sole
        proprietor established in Slovenia. You can contact us about privacy at any time at{" "}
        <a href="mailto:nejcdovzank@gmail.com" className="text-brand underline">nejcdovzank@gmail.com</a>.
      </P>

      <H2>2. Our privacy principles</H2>
      <P>In plain terms, this is how Captio treats your data:</P>
      <UL>
        <li>Your audio is processed in real time and is <strong>not stored on our servers</strong>.</li>
        <li>Your transcripts and summaries are stored <strong>securely to provide the Service</strong> — including syncing them across your devices — and are never sold or used to train AI models.</li>
        <li>We <strong>never sell</strong> your data.</li>
        <li>Your content is <strong>never used to train AI models</strong>.</li>
      </UL>

      <H2>3. Data we collect</H2>
      <UL>
        <li>
          <strong>Account information.</strong> When you create an account — using Sign in with Apple, Google,
          or by registering manually — we process your name and email address, and a password if you register
          manually. If you use Sign in with Apple, Apple may provide a private relay email instead of your real
          one.
        </li>
        <li>
          <strong>Audio you capture or upload.</strong> When you use live captions, translation, or upload a
          file for transcription, your audio is processed to produce text. See section 4 for exactly what
          happens to it.
        </li>
        <li>
          <strong>Transcripts and summaries.</strong> Text generated from your audio. These are stored on your
          device and, so they&rsquo;re available when you sign in on another device or reinstall the app, are also
          stored securely in our cloud, linked to your account. They are never used to train AI models.
        </li>
        <li>
          <strong>Subscription information.</strong> If you subscribe to a paid plan, we and our payments
          provider process your subscription status. Payment is handled by the Apple App Store — we never
          receive or store your card details.
        </li>
        <li>
          <strong>Website analytics.</strong> Our website uses privacy-friendly, cookieless analytics that
          count visits and page views in aggregate. It does not use cookies, does not track you across sites,
          and does not build a profile of you.
        </li>
        <li>
          <strong>Technical and diagnostic data.</strong> Basic device and technical information needed to run
          the Service reliably and securely.
        </li>
      </UL>

      <H2>4. How your audio is processed</H2>
      <P>
        This is the most important part of how Captio works, so we want to be precise:
      </P>
      <UL>
        <li>
          When you use live captions, translation, or upload audio for transcription, your audio is transmitted
          securely to a <strong>third-party speech-recognition provider</strong> that converts it to text. The
          audio is processed transiently and then <strong>deleted</strong> — it is not stored on our servers,
          and it is not used to train any models.
        </li>
        <li>
          When Captio generates a title or summary, the relevant text may be sent to a <strong>third-party AI
          provider</strong>. We use a paid service under terms where your content is <strong>not used to train
          models</strong>. That provider may retain the input briefly for security and abuse-monitoring under
          its own terms, after which it is deleted.
        </li>
        <li>
          We do not name these providers here, as their identity is not required for you to understand how your
          data is handled. They act as our processors, are bound by their own privacy terms and by data-
          processing agreements, and process data only to provide the Service.
        </li>
      </UL>

      <H2>5. Where your transcripts and summaries are stored</H2>
      <P>
        Transcripts and summaries are stored on your device and are also synced to our secure cloud storage so
        they&rsquo;re available when you sign in on another device or reinstall the app. They are linked to your
        account and protected by access controls so that only you can access them. They are never sold or used to
        train AI models. When you delete a transcript, it is removed from your device and from our cloud; when you
        delete your account, all of your transcripts and summaries are permanently deleted.
      </P>

      <H2>6. Legal bases for processing (GDPR)</H2>
      <UL>
        <li><strong>Performance of a contract</strong> — to provide the Service you request.</li>
        <li><strong>Consent</strong> — where we ask for it (for example, microphone access).</li>
        <li><strong>Legitimate interests</strong> — to keep the Service secure and to improve it using aggregate, non-identifying information.</li>
        <li><strong>Legal obligations</strong> — where the law requires us to process data.</li>
      </UL>

      <H2>7. Who we share data with</H2>
      <P>
        We do not sell your data. We share data only with the processors needed to run the Service: our
        third-party speech-recognition and AI providers (as described above), our subscription/payments
        provider and the Apple App Store, the authentication providers you choose to sign in with (Apple or
        Google), and our hosting and cookieless-analytics providers. We may also disclose data if required by
        law or to protect our legal rights.
      </P>

      <H2>8. International transfers</H2>
      <P>
        Some of our providers may process data outside the European Economic Area. Where that happens, the
        transfer is protected by appropriate safeguards, such as the European Commission&rsquo;s Standard
        Contractual Clauses or an adequacy decision.
      </P>

      <H2>9. How long we keep data</H2>
      <UL>
        <li><strong>Audio</strong> — not stored on our servers; the recording is kept on your device for playback until you delete it.</li>
        <li><strong>Transcripts and summaries</strong> — kept on your device and in our cloud (linked to your account) for as long as you keep them; deleted when you delete them or delete your account.</li>
        <li><strong>Account data</strong> — kept while your account is active; deleted when you delete your account.</li>
        <li><strong>Analytics</strong> — aggregate and non-identifying.</li>
      </UL>

      <H2>10. Your rights</H2>
      <P>
        Under the GDPR you have the right to access, correct, delete, restrict, or object to the processing of
        your personal data, the right to data portability, and the right to withdraw consent at any time. To
        exercise any of these, email{" "}
        <a href="mailto:nejcdovzank@gmail.com" className="text-brand underline">nejcdovzank@gmail.com</a>. You
        also have the right to lodge a complaint with your local supervisory authority — in Slovenia, the
        Information Commissioner (Informacijski pooblaščenec).
      </P>

      <H2>11. Security</H2>
      <P>
        We use reasonable technical and organizational measures to protect your data, including encryption of
        audio in transit. No method of transmission or storage is completely secure. We keep audio out of server
        storage entirely, and your transcripts are held in access-controlled cloud storage that only you can
        access — both core parts of how we reduce risk.
      </P>

      <H2>12. Children</H2>
      <P>
        Captio is an accessibility tool intended for a general audience. If you are under the age of digital
        consent in your country (16 in some parts of the EU; 15 in Slovenia), you may use Captio only with the
        consent and involvement of a parent or guardian. We do not knowingly collect personal data from
        children without such consent; if you believe a child has provided us data without it, contact us and
        we will delete it.
      </P>

      <H2>13. Cookies</H2>
      <P>
        Our website does not use tracking or advertising cookies. The analytics we use are cookieless, which is
        why you will not see a cookie-consent banner. The app does not use advertising cookies or trackers.
      </P>

      <H2>14. Changes to this policy</H2>
      <P>
        We may update this Privacy Policy from time to time. The date at the top shows when it was last
        changed, and we will notify you of material changes where required.
      </P>

      <H2>15. Contact</H2>
      <P>
        For any privacy question or request, contact{" "}
        <a href="mailto:nejcdovzank@gmail.com" className="text-brand underline">nejcdovzank@gmail.com</a>.
      </P>
        </div>
      </main>
      <Footer />
    </>
  );
}
