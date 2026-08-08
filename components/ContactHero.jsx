import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function ContactHero() {
  return (
    <section className="border-b">
      <div className="container mx-auto px-4 py-20 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Badge variant="secondary" className="rounded-full">
              Get In Touch
            </Badge>

            <h1 className="mt-6 text-4xl font-bold sm:text-5xl">
              Let&apos;s Start a
              <span className="block text-primary">Conversation</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Have a question about our courses, subscriptions or learning
              platform? Send us a message and our team will get back to you.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-xl border">
            <div className="relative aspect-[16/10]">
              <Image
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72"
                alt="Team communication"
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
