import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { fetchDatasetDetail, downloadDatasetByEvolfId } from '@/lib/api';

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
  sourceLinks?: string;
  model?: string;
  comment?: string;
  mutationStatus?: string;
  wildTypeEvolfId?: string;
}

export default function DatasetInteraction() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const evolfId = searchParams.get('evolfid');
  
  const [data, setData] = useState<DatasetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!evolfId) {
      navigate('/dataset/dashboard');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchDatasetDetail(evolfId);
        setData(response);
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

  const handleExport = async () => {
    if (!evolfId) return;
    
    try {
      setExporting(true);
      const blob = await downloadDatasetByEvolfId(evolfId);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${evolfId}_data.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Success!',
        description: 'Dataset exported successfully',
      });
    } catch (error) {
      console.error('Failed to export:', error);
      toast({
        title: 'Error',
        description: 'Failed to export dataset.',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
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

  // Function to parse and display source links as clickable hyperlinks
  const renderSourceLinks = () => {
    if (!data?.sourceLinks || data.sourceLinks === 'N/A') return null;

    const links = data.sourceLinks.split('|').map(link => link.trim()).filter(link => link);
    
    return (
      <div className="pt-2">
        <div className="text-sm text-muted-foreground mb-2">Source Links:</div>
        <div className="flex flex-wrap gap-2">
          {links.map((link, index) => (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Source {index + 1}
            </a>
          ))}
        </div>
      </div>
    );
  };

  // Function to parse and display source IDs as clickable PubMed links
  const renderSourceIds = () => {
    if (!data?.source || data.source === 'N/A') return null;

    const sourceIds = data.source.split('|').map(id => id.trim()).filter(id => id);
    
    return (
      <div className="pt-2">
        <div className="text-sm text-muted-foreground mb-2">PubMed IDs:</div>
        <div className="flex flex-wrap gap-2">
          {sourceIds.map((id, index) => (
            <a
              key={index}
              href={`https://pubmed.ncbi.nlm.nih.gov/${id}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              PubMed: {id}
            </a>
          ))}
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
                onClick={handleExport}
                disabled={exporting}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {exporting ? 'Exporting...' : 'Export Data'}
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
              <h2 className="text-lg font-semibold mb-6">Experimental Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Method" value={data?.method || 'N/A'} />
                <InfoField label="Expression System" value={data?.expressionSystem || 'N/A'} />
                <div className="md:col-span-2">
                  <InfoField label="Source" value={data?.source || 'N/A'} />
                  {renderSourceIds()}
                  {renderSourceLinks()}
                </div>
                <InfoField label="Model" value={data?.model || 'N/A'} />
                <InfoField label="Parameter" value={data?.parameter || 'N/A'} />
                <InfoField label="Value" value={data?.value || 'N/A'} />
                <InfoField label="Unit" value={data?.unit || 'N/A'} />
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

      {/* Wild Type Link for Mutants */}
      {!loading && data?.mutationStatus?.toLowerCase() === 'mutant' && data?.wildTypeEvolfId && (
        <div className="container mx-auto px-6 pb-8">
          <Card className="bg-card border-border">
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>* This is a mutant variant.</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/dataset/interaction?evolfid=${data.wildTypeEvolfId}`)}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Wild Type Interaction Data
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}