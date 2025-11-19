import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Download, Database, TestTube, Loader2, FlaskConical, Info, Star } from 'lucide-react';
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
  uniprotDisplay?: string;
  uniprotLink?: string;
  chemblId?: string;
  pubchemId?: string;
  structure2d?: string; // URL to 2D structure image
  comments?: string;
  mutationStatus?: string;
  wildTypeEvolfId?: string;
  isMutant?: boolean;
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

  // Function to handle UniProt navigation
  const handleUniProtNavigation = () => {
    if (!data) return;
    
    if (data.mutationStatus === 'Mutant' && data.wildTypeEvolfId) {
      // Navigate to wild type entry
      navigate(`/dataset/overview?evolfid=${data.wildTypeEvolfId}`);
    } else if (data.uniprotLink) {
      // Open UniProt in new tab
      window.open(data.uniprotLink, '_blank');
    }
  };

  // Function to get UniProt button text
  const getUniProtButtonText = () => {
    if (!data) return 'UniProt';
    
    
    return 'UniProt';
  };

  const InfoField = ({
    label, 
    value, 
    isUniprot = false,
  }: { 
    label: string; 
    value: string | number | null | undefined;
    isUniprot?: boolean;
  }) => {
    const displayValue = value?.toString() || 'N/A';
    
    return (
      <div className="py-3 border-b border-border/50 last:border-0">
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        <div className="flex items-center justify-between gap-2">
          <div className={`text-foreground font-medium ${loading ? 'animate-pulse bg-muted h-5 w-32 rounded' : ''}`}>
            {!loading && (
              <>
                {isUniprot && data?.mutationStatus === 'Mutant' ? (
                  <span className="flex items-center gap-1">
                    {displayValue}
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </span>
                ) : (
                  displayValue
                )}
              </>
            )}
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
                  {data?.mutationStatus === 'Mutant' && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      <Star className="h-3 w-3 fill-yellow-600 mr-1" />
                      Mutant
                    </Badge>
                  )}
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
                disabled={loading || (!data?.uniprotId && !data?.wildTypeEvolfId)}
                onClick={handleUniProtNavigation}
              >
                <ExternalLink className="h-4 w-4" />
                {getUniProtButtonText()}
                {data?.mutationStatus === 'Mutant' && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2" 
                disabled={loading || !data?.pubchemId}
                onClick={() => data?.pubchemId && window.open(`https://pubmed.ncbi.nlm.nih.gov/?term=${data.pubchemId}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                PubChem
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
            {!loading && data?.mutationStatus === 'Mutant' && (
              <div className="flex items-center gap-1 text-amber-600">
                <Star className="h-3 w-3 fill-amber-500" />
                <span>Mutant variant - {data.wildTypeEvolfId ? 'Click star button to view wild-type' : 'Wild type not available'}</span>
              </div>
            )}
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
                <InfoField 
                  label="UniProt ID" 
                  value={data?.uniprotDisplay || data?.uniprotId || 'N/A'} 
                  isUniprot={true}
                />
                {data?.mutationStatus === 'Mutant' && data?.wildTypeEvolfId && (
                  <InfoField 
                    label="Wild Type EvOlf ID" 
                    value={data.wildTypeEvolfId} 
                  />
                )}
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
              <h2 className="text-lg font-semibold">Interaction Data</h2>
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

      {/* UniProt Link Footnote for Mutants */}
      {!loading && data?.mutationStatus === 'Mutant' && (
        <div className="container mx-auto px-6 pb-8">
          <Card className="bg-card border-yellow-200 bg-yellow-50">
            <div className="p-4">
              <div className="flex items-start gap-2 text-sm text-yellow-800">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Note about UniProt links:</p>
                  <p>
                    {data.wildTypeEvolfId 
                      ? `This is a mutant protein. The UniProt button will navigate you to the wild-type protein entry (EvOlf ID: ${data.wildTypeEvolfId}).`
                      : 'TThis is a mutant protein. The UniProt button will navigate you to the wild-type protein entry'
                    }
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}