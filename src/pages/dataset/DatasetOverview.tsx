import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Download, Database, TestTube, Loader2, FlaskConical, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { fetchDatasetDetail, downloadDatasetByEvolfId } from '@/lib/api';

interface DatasetDetail {
  evolfId: string;
  receptorName?: string;
  ligandName?: string;
  class?: string;
  mutation?: string;
  mutationImpact?: string;
  species?: string;
  receptorSubtype?: string;
  expressionSystem?: string;
  parameter?: string;
  value?: string;
  unit?: string;
  
  uniprotId?: string;
  chemblId?: string;
  pubchemId?: string;
  structure2d?: string; // URL to 2D structure image
  comments?: string;
  mutationStatus?: string;
  wildTypeEvolfId?: string;
}

export default function DatasetOverview() {
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
          description: 'Failed to load entry details. Please try again.',
          variant: 'destructive',
        });
        setData(null);
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
    value: string | number | null | undefined; 
  }) => {
    const displayValue = value?.toString() || 'N/A';
    
    return (
      <div className="py-3 border-b border-border/50 last:border-0">
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        <div className="flex items-center justify-between gap-2">
          <div className={`text-foreground font-medium ${loading ? 'animate-pulse bg-muted h-5 w-32 rounded' : ''}`}>
            {!loading && displayValue}
          </div>
        </div>
      </div>
    );
  };

  // Always show the full page structure

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentPage="dataset" onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)} />
      
      {/* Header Section */}
      <div className="bg-card/30 border-b border-border">
        <div className="container mx-auto px-6 py-6">
          {/* Back Button */}
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
          </div>

          {/* Title Row */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3 flex-1 flex-wrap">
              <h1 className={`text-2xl font-normal ${loading ? 'animate-pulse bg-muted h-8 w-96 rounded' : 'text-foreground'}`}>
                {!loading && (data?.receptorName || 'N/A')} {!loading && '-'} {!loading && (data?.ligandName || 'N/A')}
              </h1>
              {!loading && (
                <>
                  <Badge variant="outline" className="bg-secondary/50 border-border">
                    {data?.class || 'N/A'}
                  </Badge>
                 
                </>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
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
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2" 
                disabled={loading || !data?.uniprotId}
                onClick={() => data?.uniprotId && window.open(`https://www.uniprot.org/uniprotkb/${data.uniprotId}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                UniProt
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2" 
                disabled={loading || !data?.chemblId}
                onClick={() => data?.chemblId && window.open(`https://www.ebi.ac.uk/chembl/compound_report_card/${data.chemblId}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                ChEMBL
              </Button>
            </div>
          </div>
          
          {/* Info Row */}
          <div className="flex items-center flex-wrap gap-x-8 gap-y-2 text-sm mb-6">
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
          <div className="flex gap-1 border-t border-border pt-4 -mb-6">
            <Button 
              variant="ghost" 
              size="sm"
              className="bg-accent/10 text-foreground font-medium"
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

        {/* Overview Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Receptor Information */}
          <Card className="bg-card border-border">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Database className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold">Receptor Information</h2>
              </div>
              <div className="space-y-3">
                <InfoField label="Receptor Name" value={data?.receptorName || 'N/A'} />
                
                <InfoField label="Receptor Subtype" value={data?.receptorSubtype || 'N/A'} />
                <InfoField label="Species" value={data?.species || 'N/A'} />
                <InfoField label="UniProt ID" value={data?.uniprotId || 'N/A'} />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-6"
                onClick={() => navigate(`/dataset/receptor?evolfid=${evolfId}`)}
              >
                View Full Receptor Details
              </Button>
            </div>
          </Card>

          {/* Ligand Information */}
          <Card className="bg-card border-border">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <TestTube className="h-5 w-5 text-green-500" />
                <h2 className="text-lg font-semibold">Ligand Information</h2>
              </div>
              <div className="space-y-3">
                <InfoField label="Ligand Name" value={data?.ligandName || 'N/A'} />
                <InfoField label="ChEMBL ID" value={data?.chemblId || 'N/A'} />
                <InfoField label="PubChem ID" value={data?.pubchemId || 'N/A'} />
                
                {/* 2D Structure Image */}
                <div className="py-3 border-b border-border/50">
                  <div className="text-sm text-muted-foreground mb-2">2D Structure</div>
                  <div className="border border-border rounded-lg p-4 bg-background">
                    {loading ? (
                      <div className="w-full h-40 bg-muted animate-pulse rounded" />
                    ) : data?.structure2d ? (
                      <img 
                        src={data.structure2d} 
                        alt="Ligand 2D Structure" 
                        className="w-full h-auto"
                        onError={(e) => {
                          e.currentTarget.alt = 'Structure not available';
                          e.currentTarget.className = 'w-full h-40 flex items-center justify-center text-muted-foreground';
                        }}
                      />
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center text-muted-foreground">
                        N/A
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-6"
                onClick={() => navigate(`/dataset/ligand?evolfid=${evolfId}`)}
              >
                View Full Ligand Details
              </Button>
            </div>
          </Card>

          {/* Mutation Information */}
          <Card className="bg-card border-border">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <FlaskConical className="h-5 w-5 text-purple-500" />
                <h2 className="text-lg font-semibold">Mutation Information</h2>
              </div>
              <div className="space-y-3">
                <InfoField label="Mutation" value={data?.mutation || 'N/A'} />
                <InfoField label="Mutation Status" value={data?.mutationStatus || 'N/A'} />
                <InfoField label="Mutation Impact" value={data?.mutationImpact || 'N/A'} />
                
              </div>
            </div>
          </Card>
        </div>

        {/* Interaction Data */}
        <Card className="bg-card border-border mb-6">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Info className="h-5 w-5 text-cyan-500" />
              
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoField label="Parameter" value={data?.parameter || 'N/A'} />
              <InfoField label="Value" value={data?.value || 'N/A'} />
              <InfoField label="Unit" value={data?.unit || 'N/A'} />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-6"
              onClick={() => navigate(`/dataset/interaction?evolfid=${evolfId}`)}
            >
              View Full Interaction Data
            </Button>
          </div>
        </Card>

        {/* Comments */}
        <Card className="bg-card border-border">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Comments</h2>
            {loading ? (
              <div className="space-y-2">
                <div className="animate-pulse bg-muted h-4 w-full rounded" />
                <div className="animate-pulse bg-muted h-4 w-3/4 rounded" />
              </div>
            ) : (
              <p className="text-foreground/80 whitespace-pre-wrap">
                {data?.comments || 'N/A'}
              </p>
            )}
          </div>
        </Card>
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
                onClick={() => navigate(`/dataset/detail?evolfid=${data.wildTypeEvolfId}`)}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Wild Type Entry
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}
