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
  source?: string;
  sourceLinks?: string;
  receptorName?: string;
  ligandName?: string;
  pdbData?: string;
  wildTypeEvolfId?: string;
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

  const formatFastaSequence = (sequence: string, receptorName: string = 'Receptor'): string => {
    if (!sequence || sequence === 'N/A') return '';
    
    // Create FASTA header
    const header = `>${receptorName}|${data?.evolfId || 'unknown'}|${data?.species || 'unknown'}`;
    
    // Format sequence with 60 characters per line (standard FASTA format)
    const formattedSequence = sequence.match(/.{1,60}/g)?.join('\n') || sequence;
    
    return `${header}\n${formattedSequence}`;
  };

  const copyFastaToClipboard = () => {
    if (!data?.sequence || data.sequence === 'N/A') return;
    
    const fastaContent = formatFastaSequence(data.sequence, data.receptorName || data.receptor);
    copyToClipboard(fastaContent, 'fasta-sequence');
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
                  label="Source" 
                  value={data?.source || 'N/A'} 
                  copyable 
                  fieldKey="receptor-source"
                />
                {data?.sourceLinks && data.sourceLinks !== 'N/A'  && data.sourceLinks !== 'nan' && (
                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-2">Source Links:</div>
                    <div className="flex flex-wrap gap-2">
                      {data.sourceLinks.split('|').map((link, index) => {
                        const trimmedLink = link.trim();
                        return trimmedLink && (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(trimmedLink, '_blank')}
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Source {index + 1}
                          </Button>
                        );
                      })}
                    </div>
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Receptor Sequence</h2>
                {data?.sequence && data.sequence !== 'N/A' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyFastaToClipboard}
                    className="gap-2"
                    disabled={!data?.sequence || data.sequence === 'N/A'}
                  >
                    {copiedField === 'fasta-sequence' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy FASTA
                  </Button>
                )}
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg max-h-[400px] overflow-y-auto">
                <p className={`text-sm font-mono break-all ${loading ? 'animate-pulse bg-muted h-20 rounded' : 'text-foreground'}`}>
                  {!loading && (data?.sequence || 'N/A')}
                </p>
              </div>
              {data?.sequence && data.sequence !== 'N/A' && (
                <div className="mt-3 text-xs text-muted-foreground">
                  * Click "Copy FASTA" to copy the sequence in FASTA format with header information
                </div>
              )}
            </div>
          </Card>

        </div>

        {/* Wild Type Link for Mutants */}
        {!loading && data?.mutationStatus?.toLowerCase() === 'mutant' && data?.wildTypeEvolfId && (
          <Card className="bg-card border-border mt-6">
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>* This is a mutant variant.</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/dataset/receptor?evolfid=${data.wildTypeEvolfId}`)}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Wild Type Receptor
              </Button>
            </div>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}