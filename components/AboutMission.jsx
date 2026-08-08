import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";

export default function AboutMission() {
  return (
    <section className="border-b bg-muted/30">
      <div className="container mx-auto px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 overflow-hidden rounded-xl border lg:order-1">
            <div className="relative aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998"
                alt="Team working together"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold text-primary">OUR MISSION</p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Making Modern Skills Accessible
            </h2>

            <p className="mt-5 leading-7 text-muted-foreground">
              Technology changes quickly. Our goal is to make modern skills
              easier to learn through practical, structured and accessible
              education.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold">Practical Learning</h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Learn by creating real projects and solving real problems.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold">Career Focused</h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Build skills that can help you grow professionally.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
