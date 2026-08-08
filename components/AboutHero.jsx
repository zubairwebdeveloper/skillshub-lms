import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function AboutHero() {
  return (
    <section className="border-b">
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge variant="secondary" className="rounded-full">
              About Skills Hub
            </Badge>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Learn. Build.
              <span className="block text-primary">Grow.</span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Skills Hub is a modern learning platform focused on practical
              technology education. We help learners develop real-world skills
              through structured courses, projects and hands-on learning.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-xl border shadow-sm">
            <div className="relative aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="Students learning together"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
