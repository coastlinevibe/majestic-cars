import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FinanceCalculator from '@/components/FinanceCalculator';
import NewListings from '@/components/NewListings';
import LocationsSection from '@/components/LocationsSection';
import TrustSection from '@/components/TrustSection';
import CTASection from '@/components/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FinanceCalculator />
        <NewListings />
        <LocationsSection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
