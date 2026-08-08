import AboutHero from "@/components/AboutHero";
import AboutMission from "@/components/AboutMission";
import AboutFeatures from "@/components/AboutFeatures";


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <AboutHero />
      <AboutMission />
      <AboutFeatures />
    </main>
  );
}
