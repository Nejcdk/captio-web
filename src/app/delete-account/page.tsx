import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Delete your account",
  description: "How to delete your Captio AI account and the data linked to it.",
  alternates: { canonical: "/delete-account" },
  openGraph: {
    title: "Delete your account | Captio AI",
    description: "How to delete your Captio AI account and the data linked to it.",
    url: "/delete-account",
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
function OL({ children }: { children: React.ReactNode }) {
  return <ol className="list-decimal pl-6 text-gray-600 leading-relaxed mb-4 space-y-1.5">{children}</ol>;
}

export default function DeleteAccountPage() {
  return (
    <>
      <main>
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h1 className="text-3xl font-bold mb-2">Delete your Captio AI account</h1>
          <p className="text-sm text-gray-500 mb-10">Captio AI, by Nejc Dovžan Kukič</p>

          <P>
            You can delete your Captio AI account, and everything linked to it, at any time. It works the same on
            iPhone and Android.
          </P>

          <H2>In the app</H2>
          <OL>
            <li>Open Captio AI and tap the gear icon on the home screen to open Settings.</li>
            <li>Scroll to <strong>Account</strong> and tap <strong>Delete Account</strong>.</li>
            <li>Confirm. Your account and data are deleted straight away.</li>
          </OL>

          <H2>Without the app</H2>
          <P>
            If you no longer have the app, email{" "}
            <a href="mailto:hello@captioai.app?subject=Delete%20my%20account" className="text-brand underline">
              hello@captioai.app
            </a>{" "}
            from the email address you signed in with and ask us to delete your account. We delete it within 7 days
            and reply to confirm.
          </P>

          <H2>What is deleted</H2>
          <UL>
            <li>Your account: your email address, name and sign-in details.</li>
            <li>All your transcripts, summaries and other results stored in our cloud.</li>
            <li>Every share link you created. Those pages stop working.</li>
            <li>Your email preferences, so you get no more emails from us.</li>
          </UL>
          <P>
            Audio is never stored on our servers. Recordings saved on your phone are removed when you delete them
            or uninstall the app.
          </P>

          <H2>What is kept</H2>
          <UL>
            <li>
              <strong>Subscription records</strong>: payments are handled by Apple or Google, and records of past
              purchases are kept as long as the law requires. Deleting your account does not cancel a subscription;
              cancel it in your App Store or Google Play subscriptions.
            </li>
            <li>
              <strong>Usage and diagnostic data</strong>: pseudonymous and not linked to your account, kept only as
              long as needed to run and improve the app.
            </li>
          </UL>
          <P>
            More detail is in our{" "}
            <a href="/privacy" className="text-brand underline">Privacy Policy</a>.
          </P>
        </div>
      </main>
      <Footer />
    </>
  );
}
