import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface DatasetDetail {
  evolfId: string;
  receptorName?: string;
  ligandName?: string;
  class?: string;
  mutation?: string;
  interactionType?: string;
  interactionValue?: number;
  interactionUnit?: string;
  assayType?: string;
  assayDescription?: string;
  temperature?: string;
  pH?: number;
  bufferSystem?: string;
}

export default function DatasetInteraction() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const evolfId = searchParams.get('evolfid');
  
  const [data, setData] = useState<DatasetDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!evolfId) {
      navigate('/dataset/dashboard');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        // Mock data
        const mockData: DatasetDetail = {
          evolfId: evolfId || '',
          receptorName: 'Adenosine A2A receptor',
          ligandName: 'ZM 241385',
          class: 'Class A',
          mutation: 'Wild-type',
          interactionType: 'Ki',
          interactionValue: 0.8,
          interactionUnit: 'nM',
          assayType: 'Radioligand binding',
          assayDescription: 'Inhibition of [3H]-CGS21680 binding to human A2A receptor',
          temperature: '25°C',
          pH: 7.4,
          bufferSystem: 'Tris-HCl',
        };
        
        setData(mockData);
      } catch (error) {
        console.error('Failed to fetch entry:', error);
        toast({
          title: 'Error',
          description: 'Failed to load entry details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [evolfId, navigate, toast]);

  const InfoField = ({ 
    label, 
    value, 
  }: { 
    label: string; 
    value: string | number; 
  }) => {
    const displayValue = value?.toString() || 'N/A';
    
    return (
      <div className="py-3">
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        <div className="flex items-center justify-between gap-2">
          <div className="text-foreground font-medium">{displayValue}</div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Header currentPage="dataset" onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)} />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Header currentPage="dataset" onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)} />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-muted-foreground mb-4">Entry not found</p>
          <Button onClick={() => navigate('/dataset/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Database
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentPage="dataset" onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)} />
      
      {/* Header Section */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/dataset/detail?evolfid=${evolfId}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-semibold text-foreground">
              {data?.receptorName || 'Receptor'} - {data?.ligandName || 'Ligand'}
            </h1>
            {data?.class && (
              <Badge variant="outline" className="bg-secondary/50">
                {data.class}
              </Badge>
            )}
            {data?.mutation && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                {data.mutation}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/dataset/detail?evolfid=${evolfId}`)}
          >
            Overview
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/dataset/receptor?evolfid=${evolfId}`)}
          >
            Receptor Details
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/dataset/ligand?evolfid=${evolfId}`)}
          >
            Ligand Details
          </Button>
          <Button variant="default" size="sm">
            Interaction Data
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/dataset/structures?evolfid=${evolfId}`)}
          >
            3D Structures
          </Button>
        </div>

        {/* Interaction Data Content */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-card border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Binding Affinity</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Interaction Type" value={data?.interactionType || 'N/A'} />
                <InfoField label="Value" value={data?.interactionValue ? `${data.interactionValue} ${data.interactionUnit}` : 'N/A'} />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Assay Information</h2>
              <div className="space-y-4">
                <InfoField label="Assay Type" value={data?.assayType || 'N/A'} />
                <InfoField label="Assay Description" value={data?.assayDescription || 'N/A'} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <InfoField label="Temperature" value={data?.temperature || 'N/A'} />
                  <InfoField label="pH" value={data?.pH || 'N/A'} />
                  <InfoField label="Buffer System" value={data?.bufferSystem || 'N/A'} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
