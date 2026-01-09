import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What financing options do you offer?",
    answer: "We offer a variety of financing options including traditional auto loans, lease programs, and special financing for qualified buyers. Our finance team works with multiple lenders to find the best rates and terms for your situation."
  },
  {
    question: "Do you accept trade-ins?",
    answer: "Yes, we accept trade-ins of all makes and models. Our expert appraisers will evaluate your car and provide a competitive offer that can be applied toward your new purchase."
  },
  {
    question: "What is included in your car warranty?",
    answer: "All our certified pre-owned cars come with a comprehensive warranty covering major components. New cars include the full manufacturer's warranty. Extended warranty options are also available for additional peace of mind."
  },
  {
    question: "Can I schedule a test drive?",
    answer: "Absolutely! You can schedule a test drive online through our contact page or by calling our showroom directly. We also offer at-home test drives for select cars within our service area."
  },
  {
    question: "Do you offer car delivery?",
    answer: "Yes, we provide nationwide delivery services. Our white-glove delivery ensures your car arrives in pristine condition. Delivery fees vary based on distance and are calculated at the time of purchase."
  },
  {
    question: "What documents do I need to purchase a car?",
    answer: "You'll need a valid driver's license, proof of insurance, and proof of income if financing. For trade-ins, please bring your car title. Our sales team can guide you through any additional requirements."
  },
  {
    question: "Are your cars inspected before sale?",
    answer: "Every car in our inventory undergoes a rigorous multi-point inspection by our certified technicians. We ensure all cars meet our high standards for quality, safety, and performance before being listed for sale."
  },
  {
    question: "What are your showroom hours?",
    answer: "Our showrooms are open Monday through Saturday from 9 AM to 7 PM, and Sunday from 11 AM to 5 PM. Private appointments outside regular hours can be arranged upon request."
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Find answers to common questions about our cars, services, and policies.
          </p>
          
          {/* WhatsApp Promotion */}
          <div className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Need Instant Answers?</h3>
            </div>
            <p className="text-foreground/80 mb-4">
              Skip browsing through FAQs! Connect with us directly on WhatsApp for immediate answers to all your questions. 
              No waiting, no searching - just instant, personalized help.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-[#25D366] font-medium">
              <span>💬</span>
              <span>Connect with us now on WhatsApp - it's faster than reading FAQs!</span>
              <span>⚡</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-16 text-center p-8 bg-muted/50 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              Get instant answers with our Majesticars Assistant chatbot, or reach out to our team for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium">
                <span>💬</span>
                <span>Try our instant chatbot first!</span>
              </div>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
