import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Heart, Home, MessageSquare, Plus } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { ListingCard } from "@/components/site/ListingCard";
import { VerificationBadge } from "@/components/site/VerificationBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatETB } from "@/lib/listings";
import { useQuery } from "@tanstack/react-query";
import { publicListingsQuery } from "@/lib/queries";
import { useFavorites } from "@/lib/favorites";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard preview — FaydaRent" },
      { name: "description", content: "Preview of the FaydaRent owner and renter dashboards." },
      { property: "og:title", content: "Dashboard preview — FaydaRent" },
      { property: "og:description", content: "Manage listings, inquiries and saved properties." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  const fav = useFavorites();
  const { data: LISTINGS = [] } = useQuery(publicListingsQuery);
  const saved = LISTINGS.filter((l) => fav.has(l.id));
  const mine = LISTINGS.slice(0, 3);
  return (
    <PageShell>
      <div className="container-page py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="rounded-full bg-warning-soft px-2 py-0.5 text-[11px] font-semibold uppercase">Preview · sample data</span>
            <h1 className="mt-2 text-3xl font-bold">Your dashboard</h1>
          </div>
          <Button asChild variant="accent"><Link to="/list-property"><Plus />Add listing</Link></Button>
        </div>
        <Tabs defaultValue="owner" className="mt-8">
          <TabsList><TabsTrigger value="owner">Owner</TabsTrigger><TabsTrigger value="renter">Renter</TabsTrigger></TabsList>
          <TabsContent value="owner" className="mt-6 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[[Home, "Active listings", "3"], [MessageSquare, "Inquiries", "—"], [Eye, "Viewing requests", "—"], [Heart, "Saves", "—"]].map(([I, l, v]) => { const Icon = I as typeof Home; return (
                <div key={l as string} className="rounded-xl border border-border bg-card p-5 shadow-card"><Icon className="h-5 w-5 text-accent" /><p className="mt-3 text-sm text-muted-foreground">{l as string}</p><p className="font-display text-2xl font-bold">{v as string}</p></div>
              ); })}
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5"><div><p className="font-semibold">Identity verification</p><p className="text-sm text-muted-foreground">Verified owners get more inquiries.</p></div><div className="flex items-center gap-3"><VerificationBadge status="not_verified" /><Button asChild variant="outline" size="sm"><Link to="/verify">Verify</Link></Button></div></div>
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-muted-foreground"><tr><th className="p-3">Listing</th><th className="p-3">Rent</th><th className="p-3">Status</th></tr></thead>
                <tbody>{mine.map((l) => (
                  <tr key={l.id} className="border-t border-border"><td className="p-3"><Link to="/rentals/$id" params={{ id: l.id }} className="font-medium hover:text-accent">{l.title}</Link></td><td className="p-3">{formatETB(l.price)}</td><td className="p-3">{(l.status === "approved") ? "Published" : "In review"}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="renter" className="mt-6">
            <h2 className="text-xl font-bold">Saved properties</h2>
            {saved.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-border bg-card p-10 text-center"><p className="text-muted-foreground">You haven't saved anything yet.</p><Button asChild variant="accent" className="mt-4"><Link to="/rentals">Browse rentals</Link></Button></div>
            ) : (
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{saved.map((l) => <ListingCard key={l.id} l={l} />)}</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
