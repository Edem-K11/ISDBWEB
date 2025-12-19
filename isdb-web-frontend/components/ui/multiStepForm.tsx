

// components/ui/MultiStepForm.tsx (version modifiée)
'use client';

import { ReactNode } from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  optional?: boolean;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStep: string;
  children: (stepId: string) => ReactNode;
  completedSteps?: string[];
  className?: string;
}

export function MultiStepForm({
  steps,
  currentStep,
  children,
  completedSteps = [],
  className,
}: MultiStepFormProps) {
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className={cn('space-y-8', className)}>
      {/* Barre de progression - Sans boutons */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="relative">
          {/* Ligne de progression */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
            <div 
              className="h-full bg-isdb-green-500 transition-all duration-300"
              style={{ 
                width: `${(currentIndex / (steps.length - 1)) * 100}%` 
              }}
            />
          </div>

          {/* Étapes */}
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = step.id === currentStep;
              const isPassed = index <= currentIndex;

              return (
                <div key={step.id} className="flex flex-col items-center relative">
                  {/* Cercle de l'étape */}
                  <div className={cn(
                    'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                    isCurrent
                      ? 'border-isdb-green-500 bg-isdb-green-500 text-white scale-110'
                      : isCompleted
                      ? 'border-isdb-green-500 bg-isdb-green-100 text-isdb-green-700'
                      : isPassed
                      ? 'border-gray-300 bg-white text-gray-400'
                      : 'border-gray-200 bg-gray-50 text-gray-300'
                  )}>
                    {isCompleted ? (
                      <CheckCircle size={20} />
                    ) : step.icon ? (
                      step.icon
                    ) : (
                      <span className="font-medium">{index + 1}</span>
                    )}
                  </div>

                  {/* Info étape */}
                  <div className="mt-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className={cn(
                        'text-sm font-medium',
                        isCurrent ? 'text-isdb-green-700' : 'text-gray-700'
                      )}>
                        {step.title}
                      </span>
                      {step.optional && (
                        <span className="text-xs text-gray-400">(optionnel)</span>
                      )}
                    </div>
                    {step.description && (
                      <p className="text-xs text-gray-500 mt-1 max-w-[150px]">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicateur d'avancement */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-center">
            <div className="text-sm text-gray-500">
              Étape {currentIndex + 1} sur {steps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu de l'étape */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {children(currentStep)}
      </div>
    </div>
  );
}