import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Download, Database, TestTube, Loader2 } from 'lucide-react';
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
  species?: string;
  interactionType?: string;
  interactionValue?: number;
  interactionUnit?: string;
  quality?: string;
  qualityScore?: number;
  geneSymbol?: string;
  uniprotId?: string;
  chemblId?: string;
  pubchemCid?: string;
}

export default function DatasetOverview() {
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
        // TODO: Implement API call to fetch dataset detail by evolfId
        // const response = await fetchDatasetDetail(evolfId);
        // setData(response);
        
        toast({
          title: 'Feature Coming Soon',
          description: 'Dataset details will be available when the API is connected.',
        });
      } catch (error) {
        console.error('Failed to fetch entry:', error);
        toast({
          title: 'Error',
          description: 'Failed to load entry details. Please try again.',
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
          {/* Back Button */}
          <Button 
            variant="link" 
            size="sm" 
            onClick={() => navigate('/dataset/dashboard')}
            className="mb-6 -ml-2 text-primary hover:text-primary/80 p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to results
          </Button>

          {/* Title Row */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3 flex-1 flex-wrap">
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
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              {data?.uniprotId && (
                <Button variant="ghost" size="sm" asChild>
                  <a 
                    href={`https://www.uniprot.org/uniprot/${data.uniprotId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    UniProt
                  </a>
                </Button>
              )}
              {data?.chemblId && (
                <Button variant="ghost" size="sm" asChild>
                  <a 
                    href={`https://www.ebi.ac.uk/chembl/compound_report_card/${data.chemblId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    ChEMBL
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          {/* Info Row */}
          <div className="flex items-center flex-wrap gap-x-8 gap-y-2 text-sm mb-6">
            <div>
              <span className="text-muted-foreground">EvOlf ID: </span>
              <span className="text-cyan-400 font-mono font-medium">{data?.evolfId || 'N/A'}</span>
            </div>
            {data?.species && (
              <div>
                <span className="text-muted-foreground">Species: </span>
                <span className="text-foreground italic">{data.species}</span>
              </div>
            )}
            {data?.interactionType && data?.interactionValue && (
              <div>
                <span className="text-muted-foreground">Interaction: </span>
                <span className="text-foreground font-normal">
                  {data.interactionType} = {data.interactionValue} {data.interactionUnit}
                </span>
              </div>
            )}
            {data?.quality && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 ring-2 ring-green-500/30"></div>
                  <span className="text-green-500 text-sm">Quality: {data.quality}</span>
                </div>
                {data.qualityScore && (
                  <div className="w-28 h-2 bg-secondary/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${data.qualityScore}%` }}
                    />
                  </div>
                )}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receptor Summary */}
          <Card className="bg-card border-border">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Database className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold">Receptor Summary</h2>
              </div>
              <div className="space-y-4">
                <InfoField label="Receptor Name" value={data?.receptorName || 'Adenosine A2A receptor'} />
                <InfoField label="Gene Symbol" value={data?.geneSymbol || 'ADORA2A'} />
                <InfoField 
                  label="UniProt ID" 
                  value={data?.uniprotId || 'P29274'} 
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-6"
                onClick={() => navigate(`/dataset/receptor?evolfid=${evolfId}`)}
              >
                View Full Details
              </Button>
            </div>
          </Card>

          {/* Ligand Summary */}
          <Card className="bg-card border-border">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <TestTube className="h-5 w-5 text-green-500" />
                <h2 className="text-lg font-semibold">Ligand Summary</h2>
              </div>
              <div className="space-y-4">
                <InfoField label="Ligand Name" value={data?.ligandName || 'ZM 241385'} />
                <InfoField 
                  label="ChEMBL ID" 
                  value={data?.chemblId || 'CHEMBL191'} 
                />
                <InfoField 
                  label="PubChem CID" 
                  value={data?.pubchemCid || '3035979'} 
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-6"
                onClick={() => navigate(`/dataset/ligand?evolfid=${evolfId}`)}
              >
                View Full Details
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
