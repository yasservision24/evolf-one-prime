import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { fetchDatasetDetail } from '@/lib/api';

export interface DatasetDetail {
  evolfId: string;
  receptorName?: string;
  ligandName?: string;
  receptor?: string;
  ligand?: string;
  class?: string;
  mutation?: string;
  mutationImpact?: string;
  species?: string;
  receptorSubtype?: string;
  method?: string;
  value?: number | string;
  uniprotId?: string;
  uniprotDisplay?: string;
  uniprotLink?: string;
  chemblId?: string;
  pubchemId?: string;
  pubchemLink?: string;
  structure2d?: string;
  comments?: string;
  mutationStatus?: string;
  source?: string;
  sourceLinks?: string;
  wildTypeEvolfId?: string;
  smiles?: string;
  inchiKey?: string;
  inchi?: string;
  iupacName?: string;
  image?: string;
  sdfData?: string;
  sequence?: string;
  pdbData?: string;
  structure3d?: string;
  receptorStructure?: string;
  ligandStructure?: string;
  receptorFormat?: 'pdb' | 'sdf' | 'mol2' | 'xyz';
  ligandFormat?: 'pdb' | 'sdf' | 'mol2' | 'xyz';
}

interface DatasetDetailContextType {
  data: DatasetDetail | null;
  loading: boolean;
  evolfId: string | null;
}

const DatasetDetailContext = createContext<DatasetDetailContextType | undefined>(undefined);

export function DatasetDetailProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const evolfId = searchParams.get('evolfid');
  
  const [data, setData] = useState<DatasetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const lastFetchedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!evolfId) {
      navigate('/dataset/dashboard');
      return;
    }

    // Prevent duplicate API calls for the same ID
    if (lastFetchedIdRef.current === evolfId && data) {
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        lastFetchedIdRef.current = evolfId;
        const response = await fetchDatasetDetail(evolfId);
        setData(response);
      } catch (error) {
        console.error('Failed to fetch entry:', error);
        toast({
          title: 'Error',
          description: 'Failed to load entry details. Please try again.',
          variant: 'destructive',
        });
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [evolfId, navigate, toast, data]);

  return (
    <DatasetDetailContext.Provider value={{ data, loading, evolfId }}>
      {children}
    </DatasetDetailContext.Provider>
  );
}

export function useDatasetDetail() {
  const context = useContext(DatasetDetailContext);
  if (context === undefined) {
    throw new Error('useDatasetDetail must be used within a DatasetDetailProvider');
  }
  return context;
}
