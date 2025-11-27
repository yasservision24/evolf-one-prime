import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Check, ExternalLink, Download, Star, Link as LinkIcon } from 'lucide-react';
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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Function to parse mutation impact and create hyperlinks for EvOlf IDs
  const parseMutationImpact = (impact: string) => {
    if (!impact || impact === 'N/A') return null;

    // Check which pattern the impact follows
    if (impact === 'Wild-type data not available for direct comparison') {
      return { type: 'no-data', text: impact };
    }

    // Patterns that contain EvOlf IDs - handle all three formats
    const patterns = [
      // Format 1: With brackets [EvOlfXXXXX]
      /(No Change|Loss of Function|Gain of Function) with respect to wild type reference \[(EvOlf\d+)\]/,
      // Format 2: Without brackets EvOlfXXXXX
      /(No Change|Loss of Function|Gain of Function) with respect to wild type reference (EvOlf\d+)/,
      // Format 3: Just the EvOlf ID at the end
      /(No Change|Loss of Function|Gain of Function) with respect to wild type reference(.*)(EvOlf\d+)/
    ];

    for (const pattern of patterns) {
      const match = impact.match(pattern);
      if (match) {
        let functionType, evolfId;
        
        if (pattern === patterns[0]) {
          // Format 1: With brackets
          [, functionType, evolfId] = match;
        } else if (pattern === patterns[1]) {
          // Format 2: Without brackets
          [, functionType, evolfId] = match;
        } else {
          // Format 3: Mixed/other format
          [, functionType, , evolfId] = match;
        }

        const baseText = `${functionType} with respect to wild type reference`;
        return { 
          type: 'with-reference', 
          baseText, 
          evolfId,
          fullText: impact,
          functionType
        };
      }
    }

    // Default case for unknown patterns
    return { type: 'unknown', text: impact };
  };

  const MutationImpactField = () => {
    const impactData = parseMutationImpact(data?.mutationImpact || 'N/A');
    
    if (!impactData) {
      return (
        <div className="py-3 border-b border-border/50 last:border-0">
          <div className="text-sm text-muted-foreground mb-2">Mutation Impact</div>
          <div className="text-foreground font-medium">N/A</div>
        </div>
      );
    }

    return (
      <div className="py-3 border-b border-border/50 last:border-0">
        <div className="text-sm text-muted-foreground mb-2">Mutation Impact</div>
        <div className="text-foreground font-medium break-words whitespace-normal leading-relaxed">
          {impactData.type === 'no-data' && (
            <span className="text-muted-foreground italic">{impactData.text}</span>
          )}
          
          {impactData.type === 'with-reference' && (
            <div className="flex items-center gap-2 flex-wrap">
              <span>{impactData.baseText}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-mono gap-1"
                onClick={() => window.open(`/dataset/detail?evolfid=${impactData.evolfId}`)}
              >
                <LinkIcon className="h-3 w-3" />
                {impactData.evolfId}
              </Button>
            </div>
          )}
          
          {impactData.type === 'unknown' && (
            <span>{impactData.text}</span>
          )}
        </div>
      </div>
    );
  };

  const InfoField = ({ 
    label, 
    value, 
    copyable = false, 
    fieldKey = '',
    allowWrap = false 
  }: { 
    label: string; 
    value: string | number; 
    copyable?: boolean; 
    fieldKey?: string;
    allowWrap?: boolean;
  }) => {
    const displayValue = value?.toString() || 'N/A';
    
    return (
      <div className="py-3 border-b border-border/50 last:border-0">
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        <div className="flex items-center justify-between gap-2">
          <div className={`text-foreground font-medium ${allowWrap ? 'break-words whitespace-normal leading-relaxed' : ''}`}>
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

  const MutationField = ({ 
    label, 
    value 
  }: { 
    label: string; 
    value: string | null | undefined;
  }) => {
    const displayValue = value || 'N/A';
    const isLongMutation = displayValue.length > 30;
    
    return (
      <div className="py-3 border-b border-border/50 last:border-0">
        <div className="text-sm text-muted-foreground mb-2">{label}</div>
        <div className="text-foreground font-medium break-words whitespace-normal leading-relaxed">
          {isLongMutation ? (
            // Display as individual mutation badges for long mutation strings
            <div className="flex flex-wrap gap-1">
              {displayValue.split('/').map((mutation, index) => (
                <span 
                  key={index} 
                  className="inline-block bg-secondary/50 px-2 py-1 rounded text-sm border border-border"
                >
                  {mutation}
                </span>
              ))}
            </div>
          ) : (
            // Display as normal text for shorter mutations
            displayValue
          )}
        </div>
      </div>
    );
  };

  const isMutant = data?.mutationStatus === 'Mutant';
  const isWildType = data?.mutationStatus === 'Wild type';

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
            {!loading && isMutant && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs md:text-sm">
                <Star className="h-3 w-3 fill-yellow-600 mr-1" />
                Mutant
              </Badge>
            )}
            {!loading && isWildType && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs md:text-sm">
                Wild Type
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
              className="bg-accent/10 text-foreground font-medium whitespace-nowrap text-xs md:text-sm"
            >
              Receptor
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/dataset/ligand?evolfid=${evolfId}`)}
              className="text-muted-foreground hover:text-foreground whitespace-nowrap text-xs md:text-sm"
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

        {/* Receptor Details Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Basic Information</h2>
              <div className="space-y-4">
                <InfoField label="Receptor Name" value={data?.receptorName || data?.receptor || 'N/A'} />
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
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Mutation Information</h2>
              <div className="space-y-4">
                <MutationField label="Mutation" value={data?.mutation} />
                <InfoField label="Mutation Status" value={data?.mutationStatus || 'N/A'} />
                <MutationImpactField />
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
        {!loading && isMutant && data?.wildTypeEvolfId && (
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

        {/* UniProt Link Footnote for Mutants */}
        {!loading && isMutant && (
          <Card className="bg-card border-yellow-200 bg-yellow-50 mt-6">
            <div className="p-4">
              <div className="flex items-start gap-2 text-sm text-yellow-800">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Note about UniProt links:</p>
                  <p>
                    This is a mutant protein variant. The UniProt link points to the wild-type protein entry 
                    for reference. The star icon indicates this is a mutant version of the linked protein.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}