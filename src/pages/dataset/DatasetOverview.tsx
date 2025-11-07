import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Download, Database, TestTube, Loader2, FlaskConical, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { fetchDatasetDetail } from '@/lib/api';

interface DatasetDetail {
  evolfId: string;
  receptorName?: string;
  ligandName?: string;
  class?: string;
  mutation?: string;
  mutationType?: string;
  mutationImpact?: string;
  species?: string;
  receptorSubtype?: string;
  expressionSystem?: string;
  parameter?: string;
  value?: string;
  unit?: string;
  interactionType?: string;
  interactionValue?: number;
  interactionUnit?: string;
  quality?: string;
  qualityScore?: number;
  geneSymbol?: string;
  uniprotId?: string;
  chemblId?: string;
  pubchemId?: string;
  ensembleId?: string;
  structure2d?: string; // URL to 2D structure image
  comments?: string;
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
                <InfoField label="Gene Symbol" value={data?.geneSymbol || 'N/A'} />
                <InfoField label="Receptor Subtype" value={data?.receptorSubtype || 'N/A'} />
                <InfoField label="Species" value={data?.species || 'N/A'} />
                <InfoField label="UniProt ID" value={data?.uniprotId || 'N/A'} />
                <InfoField label="Ensemble ID" value={data?.ensembleId || 'N/A'} />
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
                {data?.structure2d && (
                  <div className="py-3">
                    <div className="text-sm text-muted-foreground mb-2">2D Structure</div>
                    <div className="border border-border rounded-lg p-4 bg-background">
                      <img 
                        src={data.structure2d} 
                        alt="Ligand 2D Structure" 
                        className="w-full h-auto"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/200x150?text=Structure+Not+Available';
                        }}
                      />
                    </div>
                  </div>
                )}
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
                <InfoField label="Mutation" value={data?.mutation || 'Wild-type'} />
                <InfoField label="Mutation Type" value={data?.mutationType || 'N/A'} />
                <InfoField label="Mutation Impact" value={data?.mutationImpact || 'N/A'} />
                <InfoField label="Expression System" value={data?.expressionSystem || 'N/A'} />
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
        {data?.comments && (
          <Card className="bg-card border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Comments</h2>
              <p className="text-foreground/80 whitespace-pre-wrap">{data.comments}</p>
            </div>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
