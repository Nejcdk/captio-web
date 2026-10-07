import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Captio AI privacy policy — how we handle your data.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | Captio AI",
    description: "Captio AI privacy policy — how we handle your data.",
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
      <p className="text-sm text-gray-500 mb-10">Last updated: October 7, 2026</p>

      <P>
        This Privacy Policy explains how Captio AI (&ldquo;Captio AI&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
        &ldquo;our&rdquo;) collects, uses, and protects your personal data when you use the Captio AI iOS
        application and the captioai.app website (together, the &ldquo;Service&rdquo;). Captio AI is built as an
        accessibility tool for deaf and hard of hearing people, and privacy is central to how it works.
      </P>

      <H2>1. Who is responsible for your data</H2>
      <P>
        The data controller responsible for your personal data is <strong>Nejc Dovžan Kukič</strong>, a sole
        proprietor established in Slovenia. You can contact us about privacy at any time at{" "}
        <a href="mailto:nejcdovzank@gmail.com" className="text-brand underline">nejcdovzank@gmail.com</a>.
      </P>

      <H2>2. Our privacy principles</H2>
      <P>In plain terms, this is how Captio AI treats your data:</P>
      <UL>
        <li>Your audio is processed in real time and is <strong>not stored on our servers</strong>.</li>
        <li>Your transcripts and summaries are stored <strong>securely to provide the Service</strong> — including syncing them across your devices — and are never sold or used to train AI models.</li>
        <li>We <strong>never sell</strong> your data.</li>
        <li>Your content is <strong>never used to train AI models</strong>, and it is never shared for advertising.</li>
        <li>We measure our advertising with Meta <strong>only if you allow tracking</strong> when the app asks. If you don&rsquo;t, nothing is sent to Meta.</li>
      </UL>

      <H2>3. Data we collect</H2>
      <UL>
        <li>
          <strong>Account information.</strong> When you create an account with Sign in with Apple or Google, we
          process your name, your email address, and an account identifier. If you use Sign in with Apple, Apple
          may provide a private relay email instead of your real one.
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
          <strong>Subscription information.</strong> If you start a free trial or subscribe, we and our
          subscription provider, RevenueCat, process your subscription status and purchase history (plan, trial,
          renewals). To connect purchases to your account, RevenueCat also receives your account identifier, a
          device identifier provided by Apple, and your IP address. Payment is handled by the Apple App Store — we
          never receive or store your card details.
        </li>
        <li>
          <strong>App usage and diagnostics.</strong> Which features and screens you use, the app version, your
          device model and iOS version, your approximate location (city and country, derived from your IP
          address), and a random identifier created by the app, together with crash reports and error codes. We
          use this to keep the app reliable and to improve it. It is processed by PostHog on servers in the EU and
          never includes the content of your audio, transcripts, or summaries.
        </li>
        <li>
          <strong>Advertising measurement.</strong> We use three tools to learn which of our ads lead to installs
          and subscriptions:
          <UL>
            <li>
              Apple&rsquo;s SKAdNetwork, which tells an ad network anonymously, at campaign level, that an install
              came from one of its ads. No identifier leaves your device.
            </li>
            <li>
              An Apple Ads attribution token, which tells us whether the install came from one of our Apple Ads
              campaigns.
            </li>
            <li>
              <strong>Only if you allow tracking</strong> when the app asks: the Meta SDK in the app sends app
              events (for example completing onboarding, creating an account, or opening the subscription screen)
              together with your device&rsquo;s advertising identifier (IDFA), and RevenueCat sends trial and
              purchase events to Meta with the same identifier and Meta&rsquo;s anonymous app identifier. You can
              change your choice at any time in iOS Settings → Privacy &amp; Security → Tracking.
            </li>
          </UL>
        </li>
        <li>
          <strong>Feedback you send us.</strong> Bug reports, feature requests, problem reports (with the error
          code shown in the app), transcript ratings and comments, and the optional in-app feedback form. The
          form can include whether you have hearing difficulties. Every question is optional.
        </li>
        <li>
          <strong>Emails.</strong> If you have an account, we use your email address, name, app language, and time
          zone to send you a welcome email, one follow-up email a week later, and a confirmation if you delete
          your account. Every email has an unsubscribe link.
        </li>
        <li>
          <strong>Invites.</strong> If you use the invite program, we process your invite code, who redeemed
          it, and a random identifier stored on your device, so that each device can redeem only one invite.
        </li>
        <li>
          <strong>Website analytics.</strong> Our website uses privacy-friendly, cookieless analytics that
          count visits, page views, and clicks on download buttons in aggregate. It does not use cookies, does not
          track you across sites, and does not build a profile of you.
        </li>
      </UL>
      <P>
        Reminder notifications are scheduled on your device by the app itself; we do not run a push-notification
        server. Photos and videos never leave your device: when you upload a video, the app extracts its sound
        on your device and only the audio is sent for transcription.
      </P>

      <H2>4. How your audio is processed</H2>
      <P>
        This is the most important part of how Captio AI works, so we want to be precise:
      </P>
      <UL>
        <li>
          When you use live captions, translation, or upload audio for transcription, your audio is transmitted
          securely to a <strong>third-party speech-recognition provider</strong> that converts it to text. The
          audio is processed transiently and then <strong>deleted</strong> — an uploaded file is deleted from the
          provider as soon as its transcript is ready. It is not stored on our servers, and it is not used to
          train any models.
        </li>
        <li>
          When Captio AI generates a title or summary, the relevant text is sent to a <strong>third-party AI
          provider</strong> to produce that title or summary. We use a paid service under terms where your content
          is <strong>not used to train models</strong>. That provider may retain the input briefly for security and
          abuse-monitoring under its own terms, after which it is deleted.
        </li>
        <li>
          These providers are Soniox, Inc. (speech recognition) and Google LLC (Gemini API, used for titles and
          summaries). They act as our processors, are bound by their own privacy terms and by data-processing
          agreements, and process your data only to provide the Service — never to train their models.
        </li>
      </UL>

      <H2>5. Where your transcripts and summaries are stored</H2>
      <P>
        Transcripts and summaries are stored on your device and are also synced to our secure cloud storage so
        they&rsquo;re available when you sign in on another device or reinstall the app. They are linked to your
        account and protected by access controls so that only you can access them. They are never sold or used to
        train AI models. When you delete a transcript, it is removed from your device and from our cloud; when you
        delete your account — which you can do at any time from within the app — all of your transcripts and
        summaries are permanently deleted.
      </P>

      <H2>6. Legal bases for processing (GDPR)</H2>
      <UL>
        <li><strong>Performance of a contract</strong> — to provide the Service you request, including your account, syncing, and your subscription.</li>
        <li>
          <strong>Consent</strong> — for microphone access; for advertising measurement with Meta (your choice
          when the app asks to track, which you can change at any time in iOS Settings); and for the optional
          question about hearing difficulties in the feedback form (explicit consent under Article 9(2)(a) GDPR,
          which you can withdraw by contacting us).
        </li>
        <li>
          <strong>Legitimate interests</strong> — to keep the Service secure and reliable and to improve it (app
          analytics, crash and error reports), to measure our advertising with Apple&rsquo;s privacy-preserving
          tools (SKAdNetwork and Apple Ads attribution), and to send the welcome and follow-up emails (you can
          unsubscribe at any time).
        </li>
        <li><strong>Legal obligations</strong> — where the law requires us to process data.</li>
      </UL>

      <H2>7. Who we share data with</H2>
      <P>
        We do not sell your data. We share data only with the providers needed to run the Service, each for the
        purpose described in this policy:
      </P>
      <UL>
        <li><strong>Soniox, Inc.</strong> — speech recognition (section 4).</li>
        <li><strong>Google LLC</strong> — Gemini API for titles and summaries (section 4), and Google Sign-In if you choose it.</li>
        <li><strong>Apple</strong> — App Store purchases, Sign in with Apple, and Apple&rsquo;s advertising attribution (SKAdNetwork and Apple Ads).</li>
        <li><strong>Supabase</strong> — our database, accounts, and sync.</li>
        <li><strong>RevenueCat, Inc.</strong> — subscriptions and free trials.</li>
        <li><strong>PostHog</strong> — app and website analytics, on servers in the EU.</li>
        <li><strong>Resend</strong> — email delivery.</li>
        <li><strong>Vercel</strong> — website hosting and cookieless website analytics.</li>
        <li>
          <strong>Meta Platforms Ireland Ltd.</strong> — advertising measurement, <strong>only if you allow
          tracking</strong>. Meta processes this data under its own privacy policy.
        </li>
      </UL>
      <P>We may also disclose data if required by law or to protect our legal rights.</P>

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
        <li><strong>Subscription records</strong> — kept as long as needed to provide your subscription and to meet legal obligations.</li>
        <li><strong>Usage and diagnostic data</strong> — pseudonymous, and kept only as long as needed to run and improve the app.</li>
        <li><strong>Feedback</strong> — kept until it has been handled; deleted sooner on request.</li>
        <li><strong>Advertising data sent to Meta</strong> — kept by Meta under its own retention policy.</li>
      </UL>

      <H2>10. Your rights</H2>
      <P>
        Under the GDPR you have the right to access, correct, delete, restrict, or object to the processing of
        your personal data, the right to data portability, and the right to withdraw consent at any time. To
        exercise any of these, email{" "}
        <a href="mailto:nejcdovzank@gmail.com" className="text-brand underline">nejcdovzank@gmail.com</a>. You can
        also delete your account, and all data linked to it, at any time directly in the app; turn tracking off
        in iOS Settings → Privacy &amp; Security → Tracking; and unsubscribe from emails with the link in any
        email. You also have the right to lodge a complaint with your local supervisory authority — in Slovenia,
        the Information Commissioner (Informacijski pooblaščenec).
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
        Captio AI is an accessibility tool intended for a general audience. If you are under the age of digital
        consent in your country (16 in some parts of the EU; 15 in Slovenia), you may use Captio AI only with the
        consent and involvement of a parent or guardian. We do not knowingly collect personal data from
        children without such consent; if you believe a child has provided us data without it, contact us and
        we will delete it.
      </P>

      <H2>13. Cookies and tracking</H2>
      <P>
        Our website does not use tracking or advertising cookies. The analytics we use are cookieless, which is
        why you will not see a cookie-consent banner. The app does not use cookies. It tracks you for advertising
        measurement only if you allow it when iOS asks, and declining changes nothing about how the app works.
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
