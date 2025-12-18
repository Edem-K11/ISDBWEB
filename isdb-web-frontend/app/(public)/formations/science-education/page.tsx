'use client';

import Breadcrumb from '@/components/formations/science/breadcrumbs';
import Hero from '@/components/formations/science/hero';
import TabsContent from '@/components/formations/science/tabsContent';
import InfoCard from '@/components/formations/science/infoCard';
const ScienceMasterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb />
        <div className="flex flex-col lg:flex-row gap-8 mt-10">
          <InfoCard />
          <TabsContent />
        </div>
      </div>
    </div>
  );
};

export default ScienceMasterPage;