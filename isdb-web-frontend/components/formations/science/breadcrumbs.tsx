import Breadcrumbs from '@/components/layout/breadcrumbs';
import { ChevronRight } from 'lucide-react';


// Breadcrumb Component
const Breadcrumb = () => {
  return (
    <>
      <Breadcrumbs breadcrumbs={
        [
          { label: 'Accueil', href: '/' },
          { label: 'Formations', href: '#' },
          { label: "Science de l'éducation", href: '#' },
          { label: 'Master Professionnel en Science de l\'éducation', href: '#', active: true },
        ]
      }/> 
    </>
  );
};
export default Breadcrumb;