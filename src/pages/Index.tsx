import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import NewListings from '@/components/NewListings';
import TrustSection from '@/components/TrustSection';
import CTASection from '@/components/CTASection';
import { setPageTitle, setPageDescription, setPageImage } from '@/lib/seo';

const Index = () => {
  // Set SEO meta tags for home page
  useEffect(() => {
    setPageTitle('Majestic Cars - Simple, Honest, Stress-Free Car Buying');
    setPageDescription('Find your dream car at Majestic Cars. Simple, honest, and stress-free car buying with fair prices, full inspections, and no hidden surprises. Quality second-hand cars in Sinoville, Pretoria.');
    setPageImage('https://majestic-cars.vercel.app/hero-car.jpg');
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <NewListings />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
