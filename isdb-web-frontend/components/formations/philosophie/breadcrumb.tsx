import Breadcrumbs from '@/components/layout/breadcrumbs';


// Breadcrumb Component
const Breadcrumb = () => {
  return (
    <>
      <Breadcrumbs breadcrumbs={
        [
          { label: 'Accueil', href: '/' },
          { label: 'Formations', href: '#' },
          { label: "Philosophie", href: '#' },
          { label: 'Master recherche philosphie', href: '#', active: true },
        ]
      }/> 
    </>
  );
};
export default Breadcrumb;