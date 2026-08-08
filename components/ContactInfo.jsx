import { Mail, MapPin, MessageCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const contactItems = [
  {
    id: 1,
    title: "Email",
    value: "hello@skillshub.com",
    description: "Send us an email anytime.",
    icon: Mail,
  },
  {
    id: 2,
    title: "Support",
    value: "support@skillshub.com",
    description: "Need help with your account?",
    icon: MessageCircle,
  },
  {
    id: 3,
    title: "Location",
    value: "Online Learning Platform",
    description: "Serving learners worldwide.",
    icon: MapPin,
  },
];

export default function ContactInfo() {
  return (
    <section>
      <div className="container mx-auto px-4 py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {contactItems.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <h3 className="mt-5 font-semibold">{item.title}</h3>

                  <p className="mt-1 font-medium">{item.value}</p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
