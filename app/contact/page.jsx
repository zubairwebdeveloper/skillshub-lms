import ContactHero from "@/components/ContactHero";
import ContactForm from "@/components/ContactForm";
import ContactInfo from "@/components/ContactInfo";


export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <ContactHero />
      <ContactForm />
      <ContactInfo />
    </main>
  );
}
