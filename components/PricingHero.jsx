import { Badge } from "@/components/ui/badge";

export default function PricingHero() {
  return (
    <section className="border-b">
      <div className="container mx-auto px-4 py-20 text-center md:py-28">
        <Badge variant="secondary" className="rounded-full px-4 py-2">
          Simple & Transparent Pricing
        </Badge>

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Choose the Right Plan for Your
          <span className="block text-primary">Learning Journey</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Get access to practical courses, projects, learning resources and
          everything you need to build valuable digital skills.
        </p>
      </div>
    </section>
  );
}
