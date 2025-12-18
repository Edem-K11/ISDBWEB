

// components/ui/DataTable/DataTable.tsx
'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface Column<T> {
  key: string;
  header: string;
  cell: (item: T) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  selectedItems?: number[];
  onSelectAll?: () => void;
  onSelectItem?: (id: number) => void;
  isLoading?: boolean;
  emptyState?: ReactNode;
}

export function DataTable<T extends { id: number }>({
  columns,
  data,
  selectedItems = [],
  onSelectAll,
  onSelectItem,
  isLoading,
  emptyState,
}: DataTableProps<T>) {
  if (isLoading) {
    // return <LoadingTable />;
  }

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* ... structure du tableau ... */}
        </table>
      </div>
    </div>
  );
}