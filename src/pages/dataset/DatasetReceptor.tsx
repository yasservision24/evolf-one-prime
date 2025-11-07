import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Check, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { fetchDatasetDetail, downloadDatasetByEvolfId } from '@/lib/api';
import { Molecular3DViewer } from '@/components/Molecular3DViewer';

interface DatasetDetail {
  evolfId: string;
  receptor?: string;
  ligand?: string;
  class?: string;
  species?: string;
  mutationStatus?: string;
  mutation?: string;
  mutationImpact?: string;
  sequence?: string;
  receptorSubtype?: string;
  uniprotId?: string;
  uniprotLink?: string;
  ensemblId?: string;
  ensemblLink?: string;
  receptorName?: string;
  ligandName?: string;
  pdbData?: string;
}

export default function DatasetReceptor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const evolfId = searchParams.get('evolfid');
  
  const [data, setData] = useState<DatasetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
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

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
    toast({
      title: 'Copied!',
      description: 'Copied to clipboard',
    });
  };

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
    copyable = false, 
    fieldKey = '' 
  }: { 
    label: string; 
    value: string | number; 
    copyable?: boolean; 
    fieldKey?: string;
  }) => {
    const displayValue = value?.toString() || 'N/A';
    
    return (
      <div className="py-3">
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        <div className="flex items-center justify-between gap-2">
          <div className="text-foreground font-medium">{displayValue}</div>
          {copyable && displayValue !== 'N/A' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => copyToClipboard(displayValue, fieldKey)}
            >
              {copiedField === fieldKey ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          )}
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
              {!loading && `${data?.receptorName || data?.receptor || 'N/A'} - ${data?.ligandName || data?.ligand || 'N/A'}`}
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
              className="bg-accent/10 text-foreground font-medium"
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
              onClick={() => navigate(`/dataset/interaction?evolfid=${evolfId}`)}
              className="text-muted-foreground hover:text-foreground"
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

        {/* Receptor Details Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Basic Information</h2>
              <div className="space-y-4">
                <InfoField label="Receptor Name" value={data?.receptorName || data?.receptor || 'N/A'} />
                <InfoField label="Class" value={data?.class || 'N/A'} />
                <InfoField label="Species" value={data?.species || 'N/A'} />
                <InfoField label="Receptor Subtype" value={data?.receptorSubtype || 'N/A'} />
                <InfoField 
                  label="UniProt ID" 
                  value={data?.uniprotId || 'N/A'} 
                  copyable 
                  fieldKey="receptor-uniprot"
                />
                {data?.uniprotLink && data.uniprotLink !== 'N/A' && (
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(data.uniprotLink, '_blank')}
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View in UniProt
                    </Button>
                  </div>
                )}
                <InfoField 
                  label="Ensembl ID" 
                  value={data?.ensemblId || 'N/A'} 
                  copyable 
                  fieldKey="receptor-ensembl"
                />
                {data?.ensemblLink && data.ensemblLink !== 'N/A' && (
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(data.ensemblLink, '_blank')}
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View in Ensembl
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Mutation Information</h2>
              <div className="space-y-4">
                <InfoField label="Mutation Status" value={data?.mutationStatus || 'N/A'} />
                <InfoField label="Mutation" value={data?.mutation || 'N/A'} />
                <InfoField label="Mutation Impact" value={data?.mutationImpact || 'N/A'} />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border lg:col-span-2">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Receptor Sequence (FASTA)</h2>
              <div className="bg-secondary/30 p-4 rounded-lg max-h-[400px] overflow-y-auto">
                <p className={`text-sm font-mono break-all ${loading ? 'animate-pulse bg-muted h-20 rounded' : 'text-foreground'}`}>
                  {!loading && (data?.sequence || 'N/A')}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border lg:col-span-2">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">3D Structure Viewer (PDB)</h2>
              <Molecular3DViewer 
                data={data?.pdbData || ''}
                format="pdb"
                style="cartoon"
                height={500}
              />
              <p className="text-xs text-muted-foreground mt-3">
                Interactive 3D viewer - Click and drag to rotate, scroll to zoom
              </p>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
