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
        // TODO: Replace with actual API call when backend is ready
        
        // Mock data for placeholder structure
        const mockData: DatasetDetail = {
          evolfId: evolfId || '',
          receptorName: 'Adenosine A2A receptor',
          ligandName: 'ZM 241385',
          class: 'Class A',
          mutation: 'Wild-type',
          species: 'Homo sapiens',
          interactionType: 'Ki',
          interactionValue: 0.8,
          interactionUnit: 'nM',
          quality: 'High',
          qualityScore: 85,
          geneSymbol: 'ADORA2A',
          uniprotId: 'P29274',
          chemblId: 'CHEMBL191',
          pubchemCid: '3035979',
        };
        
        setData(mockData);
        
        toast({
          title: 'Info',
          description: 'API not connected. Showing placeholder structure.',
          variant: 'default',
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
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dataset/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Database
          </Button>

          {/* Title Row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <h1 className="text-2xl font-semibold text-foreground">
                {data?.receptorName || 'Receptor'} - {data?.ligandName || 'Ligand'}
              </h1>
              {data?.class && (
                <Badge variant="outline" className="bg-secondary/50">
                  {data.class}
                </Badge>
              )}
              {data?.mutation && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {data.mutation}
                </Badge>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {data?.uniprotId && (
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={`https://www.uniprot.org/uniprot/${data.uniprotId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    UniProt
                  </a>
                </Button>
              )}
              {data?.chemblId && (
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={`https://www.ebi.ac.uk/chembl/compound_report_card/${data.chemblId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    ChEMBL
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          {/* Info Row */}
          <div className="flex items-center gap-8 text-sm">
            <div>
              <span className="text-muted-foreground">EvOlf ID: </span>
              <span className="text-primary font-mono font-semibold">{data?.evolfId || 'N/A'}</span>
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
                <span className="text-foreground font-medium">
                  {data.interactionType} = {data.interactionValue} {data.interactionUnit}
                </span>
              </div>
            )}
            {data?.quality && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-green-500">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Quality: {data.quality}</span>
                </div>
                {data.qualityScore && (
                  <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${data.qualityScore}%` }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <Button variant="default" size="sm">
            Overview
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/dataset/receptor?evolfid=${evolfId}`)}
          >
            Receptor Details
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/dataset/ligand?evolfid=${evolfId}`)}
          >
            Ligand Details
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/dataset/interaction?evolfid=${evolfId}`)}
          >
            Interaction Data
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/dataset/structures?evolfid=${evolfId}`)}
          >
            3D Structures
          </Button>
        </div>

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
