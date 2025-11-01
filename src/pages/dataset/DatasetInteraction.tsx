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
        // TODO: Implement API call to fetch interaction data by evolfId
        // const response = await fetchInteractionData(evolfId);
        // setData(response);
        
        toast({
          title: 'Feature Coming Soon',
          description: 'Interaction data details will be available when the API is connected.',
        });
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
      <div className="bg-card/30 border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <Button 
            variant="link" 
            size="sm" 
            onClick={() => navigate(`/dataset/detail?evolfid=${evolfId}`)}
            className="mb-6 -ml-2 text-primary hover:text-primary/80 p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to results
          </Button>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <h1 className="text-2xl font-normal text-foreground">
              {data?.receptorName || 'Receptor'} - {data?.ligandName || 'Ligand'}
            </h1>
            {data?.class && (
              <Badge variant="outline" className="bg-secondary/50 border-border">
                {data.class}
              </Badge>
            )}
            {data?.mutation && (
              <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/40">
                {data.mutation}
              </Badge>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 border-t border-border pt-4 -mb-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/dataset/detail?evolfid=${evolfId}`)}
              className="text-muted-foreground hover:text-foreground"
            >
              Overview
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/dataset/receptor?evolfid=${evolfId}`)}
              className="text-muted-foreground hover:text-foreground"
            >
              Receptor Details
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/dataset/ligand?evolfid=${evolfId}`)}
              className="text-muted-foreground hover:text-foreground"
            >
              Ligand Details
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="bg-accent/10 text-foreground font-medium"
            >
              Interaction Data
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/dataset/structures?evolfid=${evolfId}`)}
              className="text-muted-foreground hover:text-foreground"
            >
              3D Structures
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">

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
