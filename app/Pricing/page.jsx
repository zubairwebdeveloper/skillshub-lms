import PricingHero from "@/components/PricingHero";
import PricingPlans from "@/components/PricingPlans";
import PricingFAQ from "@/components/PricingFAQ";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <PricingHero />
      <PricingPlans />
      <PricingFAQ />
    </main>
  );
}
