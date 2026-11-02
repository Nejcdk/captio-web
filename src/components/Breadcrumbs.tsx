import Link from "next/link";

// The visible breadcrumb of a landing page; the page builds its BreadcrumbList
// JSON-LD from the same items. The last item is the page itself.
export default function Breadcrumbs({ items, className = "" }: { items: { name: string; path: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-gray-400 ${className}`}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.path} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {last ? (
              <span className="text-gray-600" aria-current="page">{item.name}</span>
            ) : (
              <Link href={item.path} className="hover:text-brand transition-colors">{item.name}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
