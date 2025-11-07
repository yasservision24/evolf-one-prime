import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { fetchDatasetInteraction } from '@/lib/api';

interface DatasetDetail {
  evolfId: string;
  receptor?: string;
  ligand?: string;
  class?: string;
  mutation?: string;
  method?: string;
  expressionSystem?: string;
  parameter?: string;
  value?: number;
  unit?: string;
  source?: string;
  model?: string;
  comment?: string;
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
        const response = await fetchDatasetInteraction(evolfId);
        setData(response);
      } catch (error) {
        console.error('Failed to fetch entry:', error);
        toast({
          title: 'Error',
          description: 'Failed to load interaction details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [evolfId, navigate, toast]);

  const exportInteractionData = () => {
    if (!data) return;

    const exportData = {
      evolfId: data.evolfId,
      receptor: data.receptor,
      ligand: data.ligand,
      class: data.class,
      mutation: data.mutation,
      bindingAffinity: {
        parameter: data.parameter,
        value: data.value,
        unit: data.unit,
      },
      experimentalDetails: {
        method: data.method,
        expressionSystem: data.expressionSystem,
        source: data.source,
        model: data.model,
      },
      comment: data.comment,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.evolfId}_interaction_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Successful',
      description: 'Interaction data exported successfully',
    });
  };

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentPage="dataset" onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)} />
      
      {/* Header Section */}
      <div className="bg-card/30 border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/dataset/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Database
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(`/dataset/detail?evolfid=${evolfId}`)}
              className="text-muted-foreground hover:text-foreground"
            >
              Back to Overview
            </Button>
            <div className="ml-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportInteractionData}
                disabled={loading || !data}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <h1 className={`text-2xl font-normal ${loading ? 'animate-pulse bg-muted h-8 w-96 rounded' : 'text-foreground'}`}>
              {!loading && `${data?.receptor || 'N/A'} - ${data?.ligand || 'N/A'}`}
            </h1>
            {!loading && data?.class && (
              <Badge variant="outline" className="bg-secondary/50 border-border">
                {data.class}
              </Badge>
            )}
            {!loading && data?.mutation && data.mutation !== 'None' && (
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoField label="Parameter" value={data?.parameter || 'N/A'} />
                <InfoField label="Value" value={data?.value !== undefined ? `${data.value} ${data.unit || ''}` : 'N/A'} />
                <InfoField label="Unit" value={data?.unit || 'N/A'} />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Experimental Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Method" value={data?.method || 'N/A'} />
                <InfoField label="Expression System" value={data?.expressionSystem || 'N/A'} />
                <InfoField label="Source" value={data?.source || 'N/A'} />
                <InfoField label="Model" value={data?.model || 'N/A'} />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Comments</h2>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <p className={`text-sm ${loading ? 'animate-pulse bg-muted h-16 rounded' : 'text-foreground'}`}>
                  {!loading && (data?.comment || 'N/A')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
