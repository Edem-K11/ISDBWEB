import Header, { Navbar, NavbarComplete, NavbarFloating, NavFloating } from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Breadcrumb from '@/components/formations/philosophie/breadcrumb';
import Hero from '@/components/formations/philosophie/hero';
import TabsContent from '@/components/formations/philosophie/tabsContent';
import InfoCard from '@/components/formations/philosophie/infoCard';
const PhilosophyMasterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavFloating />
      <Hero />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb />
        <div className="flex flex-col lg:flex-row gap-8 mt-10">
          <InfoCard />
          <TabsContent />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PhilosophyMasterPage;