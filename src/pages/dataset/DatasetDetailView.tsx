import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Download, Copy, Check, FileText, Database, TestTube, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { fetchDatasetEntry } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface EntryData {
  evolfId: string;
  class?: string;
  species?: string;
  receptorName?: string;
  geneSymbol?: string;
  uniprotId?: string;
  receptorSubType?: string;
  mutationStatus?: string;
  mutation?: string;
  mutationImpact?: string;
  receptorSequence?: string;
  chromosomeLocation?: string;
  ligand?: string;
  smiles?: string;
  cid?: string;
  chemblId?: string;
  inchiKey?: string;
  inchi?: string;
  iupacName?: string;
  molecularWeight?: string;
  logP?: string;
  experimentMethod?: string;
  expressionSystem?: string;
  interactionParameter?: string;
  parameterValue?: string;
  unit?: string;
  reference?: string;
  doi?: string;
  model?: string;
  temperature?: string;
  pH?: string;
  comments?: string;
  qualityScore?: number;
  dataCompleteness?: number;
  validationStatus?: 'validated' | 'pending' | 'unvalidated';
}

export default function DatasetDetailView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const evolfId = searchParams.get('evolfid');
  
  const [data, setData] = useState<EntryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [tabLoading, setTabLoading] = useState(false);

  useEffect(() => {
    if (!evolfId) {
      navigate('/dataset/dashboard');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchDatasetEntry(evolfId);
        setData(response.entry || response);
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

  // Load data when tab changes
  useEffect(() => {
    if (!evolfId || !data || loading) return;

    const loadTabData = async () => {
      try {
        setTabLoading(true);
        // In production, you would call different endpoints based on activeTab
        // For example: fetchDatasetEntry(evolfId, activeTab)
        const response = await fetchDatasetEntry(evolfId);
        setData(response.entry || response);
      } catch (error) {
        console.error('Failed to fetch tab data:', error);
      } finally {
        setTabLoading(false);
      }
    };

    loadTabData();
  }, [activeTab]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const InfoField = ({ 
    label, 
    value, 
    copyable = false, 
    fieldKey = '', 
    icon 
  }: { 
    label: string; 
    value: string | undefined; 
    copyable?: boolean; 
    fieldKey?: string;
    icon?: React.ReactNode;
  }) => {
    if (!value) return null;
    
    return (
      <div className="py-3 border-b border-border/50 last:border-0">
        <div className="text-sm text-muted-foreground mb-1.5 flex items-center gap-1">
          {icon}
          {label}
        </div>
        <div className="flex items-start gap-2">
          <div className="text-foreground flex-1 break-all font-medium">{value}</div>
          {copyable && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 flex-shrink-0"
              onClick={() => copyToClipboard(value, fieldKey)}
            >
              {copiedField === fieldKey ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
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
      <div className="bg-secondary/50 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dataset/dashboard')}
            className="text-primary hover:text-primary/90"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to results
          </Button>
        </div>
      </div>

      {/* Entry Header */}
      <div className="bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-semibold text-foreground">
                  {data.receptorName || 'Receptor'} - {data.ligand || 'Ligand'}
                </h1>
                {data.class && (
                  <Badge variant="outline" className="bg-background/50 border-border">
                    {data.class}
                  </Badge>
                )}
                {data.mutationStatus === 'Mutant' && data.mutation && (
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    {data.mutation}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">EvOlf ID: </span>
                  <span className="text-primary font-mono font-semibold">{data.evolfId}</span>
                </div>
                {data.species && (
                  <div>
                    <span className="text-muted-foreground">Species: </span>
                    <span className="text-foreground italic">{data.species}</span>
                  </div>
                )}
                {data.interactionParameter && data.parameterValue && data.unit && (
                  <div>
                    <span className="text-muted-foreground">Interaction: </span>
                    <span className="text-foreground font-medium">
                      {data.interactionParameter} = {data.parameterValue} {data.unit}
                    </span>
                  </div>
                )}
                {data.qualityScore && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-green-500">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Quality: High
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {data.uniprotId && (
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
              {data.chemblId && (
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
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-secondary/50 border border-border rounded-lg h-12">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background">Overview</TabsTrigger>
            <TabsTrigger value="receptor" className="data-[state=active]:bg-background">Receptor Details</TabsTrigger>
            <TabsTrigger value="ligand" className="data-[state=active]:bg-background">Ligand Details</TabsTrigger>
            <TabsTrigger value="interaction" className="data-[state=active]:bg-background">Interaction Data</TabsTrigger>
            <TabsTrigger value="structures" className="data-[state=active]:bg-background">3D Structures</TabsTrigger>
          </TabsList>

          {tabLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {!tabLoading && (
            <>
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 bg-card/50 border-border">
                    <div className="flex items-center gap-2 mb-6">
                      <Database className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Receptor Information</h3>
                    </div>
                    <div className="space-y-1">
                      <InfoField label="Receptor Name" value={data.receptorName} />
                      <InfoField label="Gene Symbol" value={data.geneSymbol} />
                      <InfoField 
                        label="UniProt ID" 
                        value={data.uniprotId} 
                        copyable 
                        fieldKey="uniprot" 
                        icon={<FileText className="h-3 w-3" />} 
                      />
                      <InfoField label="Class" value={data.class} />
                      <InfoField label="Receptor SubType" value={data.receptorSubType} />
                      <InfoField label="Species" value={data.species} />
                      <InfoField label="Mutation Status" value={data.mutationStatus} />
                    </div>
                  </Card>

                  <Card className="p-6 bg-card/50 border-border">
                    <div className="flex items-center gap-2 mb-6">
                      <TestTube className="h-5 w-5 text-chart-2" />
                      <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
                    </div>
                    <div className="space-y-2">
                      {data.uniprotId && (
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <a href={`https://www.uniprot.org/uniprot/${data.uniprotId}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View in UniProt
                          </a>
                        </Button>
                      )}
                      {data.geneSymbol && (
                        <>
                          <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                            <a href={`https://www.ncbi.nlm.nih.gov/gene/?term=${data.geneSymbol}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              NCBI Gene
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                            <a href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${data.geneSymbol}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              GeneCards
                            </a>
                          </Button>
                        </>
                      )}
                      {data.uniprotId && (
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <a href={`https://gpcrdb.org/protein/${data.uniprotId}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            GPCRdb
                          </a>
                        </Button>
                      )}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="receptor">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="p-6 lg:col-span-2 bg-card/50 border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Receptor Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                      <div className="space-y-1">
                        <InfoField label="Receptor Name" value={data.receptorName} />
                        <InfoField label="Gene Symbol" value={data.geneSymbol} />
                        <InfoField label="UniProt ID" value={data.uniprotId} copyable fieldKey="uniprot-detail" />
                        <InfoField label="Class" value={data.class} />
                      </div>
                      <div className="space-y-1">
                        <InfoField label="Species" value={data.species} />
                        <InfoField label="Receptor SubType" value={data.receptorSubType} />
                        <InfoField label="Chromosome Location" value={data.chromosomeLocation} />
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h4 className="text-base font-semibold text-foreground mb-4">Mutation Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div className="space-y-1">
                          <InfoField label="Status" value={data.mutationStatus} />
                          {data.mutation && <InfoField label="Mutation" value={data.mutation} />}
                        </div>
                        {data.mutationImpact && (
                          <div className="space-y-1">
                            <InfoField label="Impact" value={data.mutationImpact} />
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-card/50 border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Quick Links</h3>
                    <div className="space-y-2">
                      {data.uniprotId && (
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <a href={`https://www.uniprot.org/uniprot/${data.uniprotId}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View in UniProt
                          </a>
                        </Button>
                      )}
                      {data.geneSymbol && (
                        <>
                          <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                            <a href={`https://www.ncbi.nlm.nih.gov/gene/?term=${data.geneSymbol}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              NCBI Gene
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                            <a href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${data.geneSymbol}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              GeneCards
                            </a>
                          </Button>
                        </>
                      )}
                      {data.uniprotId && (
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <a href={`https://gpcrdb.org/protein/${data.uniprotId}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            GPCRdb
                          </a>
                        </Button>
                      )}
                    </div>
                  </Card>

                  {data.receptorSequence && (
                    <Card className="p-6 lg:col-span-3 bg-card/50 border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Receptor Sequence</h3>
                      <div className="bg-secondary/50 p-4 rounded-lg border border-border font-mono text-xs break-all leading-relaxed">
                        {data.receptorSequence}
                      </div>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="ligand">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="p-6 lg:col-span-2 bg-card/50 border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Ligand Information</h3>
                    <div className="space-y-1">
                      <InfoField label="Ligand Name" value={data.ligand} />
                      <InfoField label="IUPAC Name" value={data.iupacName} />
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h4 className="text-base font-semibold text-foreground mb-4">Chemical Properties</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                      <div className="space-y-1">
                        <InfoField label="Molecular Weight" value={data.molecularWeight ? `${data.molecularWeight} g/mol` : undefined} />
                      </div>
                      <div className="space-y-1">
                        <InfoField label="LogP" value={data.logP} />
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h4 className="text-base font-semibold text-foreground mb-4">Chemical Identifiers</h4>
                    <div className="space-y-1">
                      <InfoField label="SMILES" value={data.smiles} copyable fieldKey="smiles-detail" />
                      <InfoField label="InChI" value={data.inchi} copyable fieldKey="inchi" />
                      <InfoField label="InChIKey" value={data.inchiKey} copyable fieldKey="inchikey" />
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h4 className="text-base font-semibold text-foreground mb-4">Database References</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                      <div className="space-y-1">
                        <InfoField label="ChEMBL ID" value={data.chemblId} copyable fieldKey="chembl-detail" />
                      </div>
                      <div className="space-y-1">
                        <InfoField label="PubChem CID" value={data.cid} copyable fieldKey="cid-detail" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-card/50 border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-6">External Links</h3>
                    <div className="space-y-2">
                      {data.chemblId && (
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <a 
                            href={`https://www.ebi.ac.uk/chembl/compound_report_card/${data.chemblId}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View in ChEMBL
                          </a>
                        </Button>
                      )}
                      {data.cid && (
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <a 
                            href={`https://pubchem.ncbi.nlm.nih.gov/compound/${data.cid}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View in PubChem
                          </a>
                        </Button>
                      )}
                      {data.ligand && (
                        <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                          <a 
                            href={`https://www.drugbank.ca/drugs/search?q=${data.ligand}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Search DrugBank
                          </a>
                        </Button>
                      )}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="interaction">
                <Card className="p-6 bg-card/50 border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-6">Binding Affinity Data</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-semibold text-foreground mb-4">Interaction Parameters</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div className="space-y-1">
                          <InfoField label="Parameter Type" value={data.interactionParameter} />
                        </div>
                        <div className="space-y-1">
                          <InfoField label="Value" value={data.parameterValue && data.unit ? `${data.parameterValue} ${data.unit}` : undefined} />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-base font-semibold text-foreground mb-4">Experimental Conditions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div className="space-y-1">
                          <InfoField label="Method" value={data.experimentMethod} />
                          <InfoField label="Expression System" value={data.expressionSystem} />
                        </div>
                        <div className="space-y-1">
                          <InfoField label="Temperature" value={data.temperature} />
                          <InfoField label="pH" value={data.pH} />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-base font-semibold text-foreground mb-4">References</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div className="space-y-1">
                          <InfoField label="PMID" value={data.reference} copyable fieldKey="ref-pmid" />
                          <InfoField label="DOI" value={data.doi} copyable fieldKey="ref-doi" />
                        </div>
                        <div className="space-y-1">
                          <InfoField label="Model Version" value={data.model} />
                        </div>
                      </div>
                    </div>

                    {data.comments && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-base font-semibold text-foreground mb-4">Additional Comments</h4>
                          <div className="bg-secondary/50 p-4 rounded-lg border border-border">
                            <p className="text-muted-foreground text-sm leading-relaxed">{data.comments}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="structures">
                <Card className="p-6 bg-card/50 border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-6">3D Structures</h3>
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">3D structure visualization coming soon</p>
                    <p className="text-sm text-muted-foreground mt-2">This tab will display interactive 3D molecular structures</p>
                  </div>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
