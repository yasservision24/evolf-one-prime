import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Check, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { downloadDatasetByEvolfId } from '@/lib/api';
import { useDatasetDetail } from '@/contexts/DatasetDetailContext';

export default function DatasetLigand() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, loading, evolfId } = useDatasetDetail();
  
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

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
    fieldKey = '',
    multiline = false
  }: { 
    label: string; 
    value: string | number; 
    copyable?: boolean; 
    fieldKey?: string;
    multiline?: boolean;
  }) => {
    const displayValue = value?.toString() || 'N/A';
    
    return (
      <div className="py-3">
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        <div className="flex items-start justify-between gap-2">
          <div className={`text-foreground font-medium flex-1 ${multiline ? 'break-all whitespace-pre-wrap max-h-32 overflow-y-auto' : 'break-all'}`}>
            {displayValue}
          </div>
          {copyable && displayValue !== 'N/A' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 flex-shrink-0"
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
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/dataset/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Database</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(`/dataset/detail?evolfid=${evolfId}`)}
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="hidden sm:inline">Back to Overview</span>
              <span className="sm:hidden">Overview</span>
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
                <span className="hidden sm:inline">{exporting ? 'Exporting...' : 'Export'}</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 flex-wrap">
            <h1 className={`text-lg md:text-2xl font-normal ${loading ? 'animate-pulse bg-muted h-8 w-48 md:w-96 rounded' : 'text-foreground'}`}>
              {!loading && `${data?.receptorName || data?.receptor || 'N/A'} - ${data?.ligandName || data?.ligand || 'N/A'}`}
            </h1>
            {!loading && data?.class && (
              <Badge variant="outline" className="bg-secondary/50 border-border text-xs md:text-sm">
                {data.class}
              </Badge>
            )}
          </div>

          {/* Info Row */}
          <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-x-4 md:gap-x-8 gap-y-2 text-xs md:text-sm mb-4 md:mb-6">
            <div>
              <span className="text-muted-foreground">EvOlf ID: </span>
              <span className={`text-cyan-400 font-mono font-medium ${loading ? 'animate-pulse' : ''}`}>
                {loading ? 'Loading...' : (data?.evolfId || evolfId || 'N/A')}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Species: </span>
              <span className={`text-foreground italic ${loading ? 'animate-pulse' : ''}`}>
                {loading ? 'Loading...' : (data?.species || 'N/A')}
              </span>
            </div>
            
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 border-t border-border pt-4 -mb-4 md:-mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/dataset/detail?evolfid=${evolfId}`)}
              className="text-muted-foreground hover:text-foreground whitespace-nowrap text-xs md:text-sm"
            >
              Overview
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/dataset/receptor?evolfid=${evolfId}`)}
              className="text-muted-foreground hover:text-foreground whitespace-nowrap text-xs md:text-sm"
            >
              Receptor
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="bg-accent/10 text-foreground font-medium whitespace-nowrap text-xs md:text-sm"
            >
              Ligand
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/dataset/interaction?evolfid=${evolfId}`)}
              className="text-muted-foreground hover:text-foreground whitespace-nowrap text-xs md:text-sm"
            >
              Interaction
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/dataset/structures?evolfid=${evolfId}`)}
              className="text-muted-foreground hover:text-foreground whitespace-nowrap text-xs md:text-sm"
            >
              3D Structures
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">

        {/* Ligand Details Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Identifiers</h2>
              <div className="space-y-4">
                <InfoField label="Ligand Name" value={data?.ligandName || data?.ligand || 'N/A'} />
                <InfoField 
                  label="SMILES" 
                  value={data?.smiles || 'N/A'} 
                  copyable 
                  fieldKey="smiles"
                  multiline
                />
                
                <InfoField
                  label="PubChem ID" 
                  value={data?.pubchemId || 'N/A'} 
                  copyable 
                  fieldKey="ligand-pubchem"
                />
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => data?.pubchemLink && data.pubchemLink !== 'N/A' && window.open(data.pubchemLink, '_blank')}
                    disabled={!data?.pubchemLink || data.pubchemLink === 'N/A'}
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View in PubChem
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Chemical Identifiers</h2>
              <div className="space-y-4">
                <InfoField 
                  label="InChI Key" 
                  value={data?.inchiKey || 'N/A'} 
                  copyable 
                  fieldKey="inchi-key"
                />
                <InfoField 
                  label="InChI" 
                  value={data?.inchi || 'N/A'} 
                  copyable 
                  fieldKey="inchi"
                  multiline
                />
                <InfoField 
                  label="IUPAC Name" 
                  value={data?.iupacName || 'N/A'} 
                  multiline
                />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border lg:col-span-2">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">SMILES Structure</h2>
                {data?.smiles && data.smiles !== 'N/A' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(data.smiles!, 'smiles-structure')}
                    className="gap-2"
                  >
                    {copiedField === 'smiles-structure' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy SMILES
                  </Button>
                )}
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <pre className="text-sm font-mono break-all whitespace-pre-wrap text-foreground max-h-48 overflow-y-auto">
                  {data?.smiles || 'N/A'}
                </pre>
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border lg:col-span-2">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">InChI Structure</h2>
                {data?.inchi && data.inchi !== 'N/A' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(data.inchi!, 'inchi-structure')}
                    className="gap-2"
                  >
                    {copiedField === 'inchi-structure' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy InChI
                  </Button>
                )}
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <pre className="text-sm font-mono break-all whitespace-pre-wrap text-foreground max-h-48 overflow-y-auto">
                  {data?.inchi || 'N/A'}
                </pre>
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border lg:col-span-2">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">2D Structure</h2>
                {data?.image && data.image !== 'N/A' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = data.image!;
                      link.download = `${data.ligandName || data.ligand || 'ligand'}_2D.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      toast({
                        title: 'Success!',
                        description: 'Image download started',
                      });
                    }}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Image
                  </Button>
                )}
              </div>
              <div className="bg-secondary/20 rounded-lg p-8 flex items-center justify-center min-h-[300px] border border-border">
                {loading ? (
                  <div className="animate-pulse bg-muted h-64 w-64 rounded" />
                ) : data?.image && data.image !== 'N/A' ? (
                  <img 
                    src={data.image} 
                    alt="Ligand 2D structure" 
                    className="max-w-full max-h-[400px] object-contain"
                  />
                ) : (
                  <p className="text-muted-foreground">N/A</p>
                )}
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
                onClick={() => navigate(`/dataset/ligand?evolfid=${data.wildTypeEvolfId}`)}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Wild Type Ligand
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}