import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Download, Copy, Check, Database, TestTube, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// API calls will be implemented when backend is ready
// import { getDatasetById } from '@/lib/api';
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
  
  // Receptor fields
  geneSymbol?: string;
  uniprotId?: string;
  receptorFamily?: string;
  receptorSubtype?: string;
  mutationInfo?: string;
  receptorSequence?: string;
  
  // Ligand fields
  chemblId?: string;
  pubchemCid?: string;
  smiles?: string;
  molecularWeight?: number;
  logP?: number;
  hBondDonors?: number;
  hBondAcceptors?: number;
  rotableBonds?: number;
  
  // Interaction fields
  assayType?: string;
  assayDescription?: string;
  temperature?: string;
  pH?: number;
  bufferSystem?: string;
  
  // 3D Structures
  pdbId?: string;
  resolution?: number;
  method?: string;
  rfactor?: number;
}

export default function DatasetDetailView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const evolfId = searchParams.get('evolfid');
  
  const [data, setData] = useState<DatasetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (!evolfId) {
      navigate('/dataset/dashboard');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call when backend is ready
        // const response = await getDatasetById(evolfId);
        // setData(response);
        
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
          receptorFamily: 'Adenosine receptor',
          receptorSubtype: 'A2A',
          mutationInfo: 'No mutations',
          receptorSequence: 'MPIMGSSVYITVELAIAVLAILGNVLVCWAVWLNSNLQNVTNYFVVSLAAADIAVGVLAIPFAITISTGFCAACHGCLFIACFVLVLTQSSIFSLLAIAIDRYIAIRIPLRYNGLVTGTRAKGIIAICWVLSFAIGLTPMLGWNNCGQPKEGKNHSQGCGEGQVACLFEDVVPMNYMVYFNFFACVLVPLLLMLGVYLRIFLAARRQLKQMESQPLPGERARSTLQKEVHAAKSLAIIVGLFALCWLPLHIINCFTFFCPDCSHAPLWLMYLAIVLSHTNSVVNPFIYAYRIREFRQTFRKIIRSHVLRQQEPFKAAGTSARVLAAHGSDGEQVSLRLNGHPPGVWANGSAPHPERRPNGYALGLVSGGSAQESQGNTGLPDVELLSHELKGVCPEPPGLDDPLAQDGAGVS',
          chemblId: 'CHEMBL191',
          pubchemCid: '3035979',
          smiles: 'C1=CC(=CC=C1C(=O)NC2=NC(=NC=C2)NC3=CC=C(C=C3)C#N)C(F)(F)F',
          molecularWeight: 411.38,
          logP: 4.2,
          hBondDonors: 2,
          hBondAcceptors: 6,
          rotableBonds: 5,
          assayType: 'Radioligand binding',
          assayDescription: 'Inhibition of [3H]-CGS21680 binding to human A2A receptor',
          temperature: '25°C',
          pH: 7.4,
          bufferSystem: 'Tris-HCl',
          pdbId: '3EML',
          resolution: 2.6,
          method: 'X-ray diffraction',
          rfactor: 0.221,
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

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
    toast({
      title: 'Copied!',
      description: 'Copied to clipboard',
    });
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

      {/* Tabs Section */}
      <div className="container mx-auto px-4 py-6 flex-1">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start mb-6 h-12 bg-secondary/30 p-1 rounded-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="receptor">Receptor Details</TabsTrigger>
            <TabsTrigger value="ligand">Ligand Details</TabsTrigger>
            <TabsTrigger value="interaction">Interaction Data</TabsTrigger>
            <TabsTrigger value="structures">3D Structures</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0">
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
                      copyable 
                      fieldKey="uniprot"
                    />
                  </div>
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
                      copyable 
                      fieldKey="chembl"
                    />
                    <InfoField 
                      label="PubChem CID" 
                      value={data?.pubchemCid || '3035979'} 
                      copyable 
                      fieldKey="pubchem"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Receptor Details Tab */}
          <TabsContent value="receptor" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Basic Information</h2>
                  <div className="space-y-4">
                    <InfoField label="Receptor Name" value={data?.receptorName || 'N/A'} />
                    <InfoField label="Gene Symbol" value={data?.geneSymbol || 'N/A'} />
                    <InfoField 
                      label="UniProt ID" 
                      value={data?.uniprotId || 'N/A'} 
                      copyable 
                      fieldKey="receptor-uniprot"
                    />
                    <InfoField label="Receptor Family" value={data?.receptorFamily || 'N/A'} />
                    <InfoField label="Receptor Subtype" value={data?.receptorSubtype || 'N/A'} />
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-border">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Mutation Information</h2>
                  <div className="space-y-4">
                    <InfoField label="Mutation" value={data?.mutation || 'Wild-type'} />
                    <InfoField label="Mutation Info" value={data?.mutationInfo || 'N/A'} />
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-border lg:col-span-2">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Sequence Information</h2>
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <p className="text-sm font-mono break-all text-muted-foreground">
                      {data?.receptorSequence || 'Sequence data will be displayed here when available from API'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Ligand Details Tab */}
          <TabsContent value="ligand" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Identifiers</h2>
                  <div className="space-y-4">
                    <InfoField label="Ligand Name" value={data?.ligandName || 'N/A'} />
                    <InfoField 
                      label="ChEMBL ID" 
                      value={data?.chemblId || 'N/A'} 
                      copyable 
                      fieldKey="ligand-chembl"
                    />
                    <InfoField 
                      label="PubChem CID" 
                      value={data?.pubchemCid || 'N/A'} 
                      copyable 
                      fieldKey="ligand-pubchem"
                    />
                    <InfoField 
                      label="SMILES" 
                      value={data?.smiles || 'N/A'} 
                      copyable 
                      fieldKey="smiles"
                    />
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-border">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Properties</h2>
                  <div className="space-y-4">
                    <InfoField label="Molecular Weight" value={data?.molecularWeight ? `${data.molecularWeight} g/mol` : 'N/A'} />
                    <InfoField label="LogP" value={data?.logP || 'N/A'} />
                    <InfoField label="H-Bond Donors" value={data?.hBondDonors || 'N/A'} />
                    <InfoField label="H-Bond Acceptors" value={data?.hBondAcceptors || 'N/A'} />
                    <InfoField label="Rotatable Bonds" value={data?.rotableBonds || 'N/A'} />
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-border lg:col-span-2">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">2D Structure</h2>
                  <div className="bg-secondary/20 rounded-lg p-8 flex items-center justify-center min-h-[300px] border border-border">
                    <p className="text-muted-foreground">2D structure visualization will appear here</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Interaction Data Tab */}
          <TabsContent value="interaction" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-card border-border">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Binding Affinity</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField label="Interaction Type" value={data?.interactionType || 'N/A'} />
                    <InfoField label="Value" value={data?.interactionValue ? `${data.interactionValue} ${data.interactionUnit}` : 'N/A'} />
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-border">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Assay Information</h2>
                  <div className="space-y-4">
                    <InfoField label="Assay Type" value={data?.assayType || 'N/A'} />
                    <InfoField label="Assay Description" value={data?.assayDescription || 'N/A'} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <InfoField label="Temperature" value={data?.temperature || 'N/A'} />
                      <InfoField label="pH" value={data?.pH || 'N/A'} />
                      <InfoField label="Buffer System" value={data?.bufferSystem || 'N/A'} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* 3D Structures Tab */}
          <TabsContent value="structures" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-card border-border">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Structure Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField label="PDB ID" value={data?.pdbId || 'N/A'} copyable fieldKey="pdb" />
                    <InfoField label="Resolution (Å)" value={data?.resolution || 'N/A'} />
                    <InfoField label="Method" value={data?.method || 'N/A'} />
                    <InfoField label="R-factor" value={data?.rfactor || 'N/A'} />
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-border">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">3D Viewer</h2>
                  <div className="bg-secondary/20 rounded-lg p-8 flex items-center justify-center min-h-[400px] border border-border">
                    <p className="text-muted-foreground">3D structure viewer will be integrated here</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
