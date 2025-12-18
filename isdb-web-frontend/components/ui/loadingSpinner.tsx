

// components/ui/LoadingSpinner.tsx
export function LoadingSpinner({ size = 12 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <div 
        className="animate-spin rounded-full border-b-2 border-isdb-green-500"
        style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
      ></div>
    </div>
  );
}