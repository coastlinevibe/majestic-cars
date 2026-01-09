import { useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, useInView } from 'framer-motion';

const TermsOfService = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const contentInView = useInView(contentRef, { once: true, margin: '-100px' });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-card">
        <div className="sterling-container">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-black text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-lg">
              Last updated: January 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section ref={contentRef} className="section-padding bg-background">
        <div className="sterling-container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const }}
            className="prose prose-lg max-w-none"
          >
            <div className="space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using Majestic Cars' website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Use of Services</h2>
                <p>
                  Our services are provided for the purpose of browsing, purchasing, and financing luxury vehicles. You agree to use our services only for lawful purposes and in accordance with these Terms of Service.
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>You must be at least 18 years old to use our services</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You agree to provide accurate and complete information</li>
                  <li>You will not use our services for any illegal or unauthorized purpose</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Vehicle Listings and Pricing</h2>
                <p>
                  All vehicle listings, specifications, and pricing information are subject to change without notice. While we strive to provide accurate information, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Purchase Terms</h2>
                <p>
                  All vehicle purchases are subject to availability and final approval. A deposit may be required to reserve a vehicle. Final pricing may vary based on financing terms, trade-in values, and additional services selected.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Financing</h2>
                <p>
                  Financing options are subject to credit approval. Interest rates and terms may vary based on creditworthiness and other factors. All financing is provided through third-party lenders and is subject to their terms and conditions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Warranties</h2>
                <p>
                  Vehicle warranties are provided as specified in individual vehicle listings. Extended warranty options may be available for purchase. All warranties are subject to the terms and conditions of the warranty provider.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Limitation of Liability</h2>
                <p>
                  Majestic Cars shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services, even if we have been advised of the possibility of such damages.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Intellectual Property</h2>
                <p>
                  All content on this website, including text, graphics, logos, images, and software, is the property of Majestic Cars and is protected by South African and international copyright laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Privacy</h2>
                <p>
                  Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">10. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of our services after changes are posted constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">11. Governing Law</h2>
                <p>
                  These Terms of Service shall be governed by and construed in accordance with the laws of South Africa, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 p-6 bg-card rounded-lg">
                  <p className="font-semibold text-foreground">Majestic Cars</p>
                  <p>154 Sefako Makgatho Service Ln</p>
                  <p>Sinoville, Pretoria, 0129</p>
                  <p>South Africa</p>
                  <p className="mt-2">Email: majesticcarssinoville@gmail.com</p>
                  <p>Phone: 060 857 9146</p>
                  <p className="mt-2 text-primary">www.majesticars.com</p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;
