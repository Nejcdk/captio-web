import type { BlogPost } from "@/lib/blog";
import type { ComparePage } from "@/lib/compare";
import { PostCard } from "@/components/blog/BlogParts";
import { ComparisonCard } from "@/components/compare/CompareParts";

// Articles and comparisons about the page's subject, so a landing page points
// at the depth the blog and compare sections hold, and they point back.
export default function RelatedReading({ posts, compares, subject }: { posts: BlogPost[]; compares: ComparePage[]; subject: string }) {
  if (posts.length === 0 && compares.length === 0) return null;
  return (
    <section className="py-10 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-7">
          <span className="text-xs font-bold text-cta uppercase tracking-widest">Read more</span>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">More about {subject}</h2>
        </div>
        {posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
        {compares.length > 0 && (
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${posts.length > 0 ? "mt-4" : ""}`}>
            {compares.map((page) => (
              <ComparisonCard key={page.slug} page={page} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
