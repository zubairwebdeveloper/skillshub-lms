import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const questions = [
  {
    id: "item-1",
    question: "Can I cancel my subscription?",
    answer:
      "Yes. You can cancel your subscription at any time from your account settings.",
  },
  {
    id: "item-2",
    question: "Do I get certificates?",
    answer:
      "Pro and Business members can earn certificates after completing eligible courses.",
  },
  {
    id: "item-3",
    question: "Can I upgrade my plan later?",
    answer:
      "Yes. You can upgrade your plan whenever you need more courses and features.",
  },
  {
    id: "item-4",
    question: "Are the courses beginner friendly?",
    answer:
      "Yes. We provide beginner, intermediate and advanced learning paths.",
  },
];

export default function PricingFAQ() {
  return (
    <section>
      <div className="container mx-auto max-w-3xl px-4 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>

          <p className="mt-3 text-muted-foreground">
            Everything you need to know about our plans.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-10">
          {questions.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>

              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
