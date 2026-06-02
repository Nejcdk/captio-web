import type { Metadata } from "next";

type Props = { params: Promise<{ competitor: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competitor } = await params;
  const name = competitor
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `Captio vs ${name}`,
    description: `Honest comparison between Captio and ${name} for deaf and hard of hearing users.`,
  };
}

export default async function ComparePage({ params }: Props) {
  const { competitor } = await params;
  const name = competitor
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-4">Captio vs {name}</h1>
      <p className="text-gray-600">Comparison content coming soon.</p>
    </main>
  );
}
