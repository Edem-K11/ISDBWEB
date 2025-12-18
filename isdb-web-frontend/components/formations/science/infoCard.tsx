import { DynamicIcon } from 'lucide-react/dynamic';

// Info Card Component
const InfoCard = () => {
  const infoItems = [
    { label: 'Domaine', value: 'Science de l\'homme et de la société', icon: 'users' },
    { label: 'Mention', value: 'Sciences et techniques de la communication', icon: 'book-open' },
    { label: 'Niveau de sortie', value: 'BAC + 5', icon: 'graduation-cap' },
    { label: 'Durée de formation', value: '4 semestres', icon: 'clock' },
    { label: 'Chef de parcours', value: 'Dr Afiwa Pépé Kpakpo', icon: 'user' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full lg:w-80 flex-shrink-0">
      <h3 className="text-xl font-bold text-slate-800 mb-4 pb-3 border-b-2 border-blue-500">
        Informations générales
      </h3>
      
      {infoItems.map((item, index) => (
        <div key={index} className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className='p-2 bg-blue-400 rounded-xl flex items-center justify-center'>
              <DynamicIcon name={item.icon as any} className="w-6 h-6" color='white'/>
            </div>
            <div>
              <strong className="text-slate-800">{item.label}</strong>
              <p className="text-gray-600">{item.value}</p>
            </div>
          </div>            
          
        </div>
      ))}
    </div>
  );
};

export default InfoCard;