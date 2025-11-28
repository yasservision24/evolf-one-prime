import { Outlet } from 'react-router-dom';
import { DatasetDetailProvider } from '@/contexts/DatasetDetailContext';

export default function DatasetDetailLayout() {
  return (
    <DatasetDetailProvider>
      <Outlet />
    </DatasetDetailProvider>
  );
}
