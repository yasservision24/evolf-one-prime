import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Download, Database, TestTube, Loader2, FlaskConical, Info, Star, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { downloadDatasetByEvolfId } from '@/lib/api';
import { useDatasetDetail } from '@/contexts/DatasetDetailContext';

export default function DatasetOverview() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, loading, evolfId } = useDatasetDetail();
  
  const [exporting, setExporting] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const isMutant = data?.mutationStatus === 'Mutant';
  const isWildType = data?.mutationStatus === 'Wild type';
  const hasUniProtLink = !!data?.uniprotLink && data.uniprotLink !== 'N/A' && data.uniprotLink.toLowerCase() !== 'nan';
  const hasPubChemLink = !!data?.pubchemLink && data.pubchemLink !== 'N/A' && data.pubchemLink.toLowerCase() !== 'nan';

  const InfoField = ({
    label, 
    value, 
    isUniprot = false,
    allowWrap = false,
    fullWidth = false,
  }: { 
    label: string; 
    value: string | number | null | undefined;
    isUniprot?: boolean;
    allowWrap?: boolean;
    fullWidth?: boolean;
  }) => {
    const displayValue = value?.toString() || 'N/A';
    
    return (
      <div className={`py-3 border-b border-border/50 last:border-0 ${fullWidth ? 'col-span-full' : ''}`}>
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        <div className="flex items-center justify-between gap-2">
          <div className={`text-foreground font-medium ${loading ? 'animate-pulse bg-muted h-5 w-32 rounded' : ''} ${allowWrap ? 'break-words whitespace-normal leading-relaxed' : ''} ${fullWidth ? 'w-full' : ''}`}>
            {!loading && (
              <>
                {isUniprot && isMutant ? (
                  <span className="flex items-center gap-1">
                    {displayValue}
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                  </span>
                ) : (
                  displayValue
                )}
              </>
            )}
          </div>
          {!loading && isUniprot && hasUniProtLink && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-accent flex-shrink-0"
              onClick={() => window.open(data.uniprotLink, '_blank')}
              title="Open UniProt"
            >
              <ExternalLink className="h-3 w-3" />
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

  const MethodField = ({ 
    label, 
    value 
  }: { 
    label: string; 
    value: string | null | undefined;
  }) => {
    const displayValue = value || 'N/A';
    
    const parseMethodData = (methodString: string) => {
      const keyValuePairs: { key: string; value: string }[] = [];
      
      // Split by | to get different sections
      const sections = methodString.split('|');
      
      sections.forEach(section => {
        // Try to split by : for key-value pairs
        if (section.includes(':')) {
          const [key, ...valueParts] = section.split(':');
          const value = valueParts.join(':').trim();
          if (key.trim()) {
            keyValuePairs.push({ key: key.trim(), value });
          }
        } else {
          // If no colon, treat as a standalone value
          if (section.trim()) {
            keyValuePairs.push({ key: 'method', value: section.trim() });
          }
        }
      });
      
      return keyValuePairs;
    };

    const methodData = parseMethodData(displayValue);

    return (
      <div className="py-3 border-b border-border/50 last:border-0 col-span-full">
        <div className="text-sm text-muted-foreground mb-3">{label}</div>
        <div className="text-foreground font-medium">
          {methodData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {methodData.map((item, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-blue-700 font-semibold text-sm min-w-[80px] flex-shrink-0">
                    {item.key}:
                  </span>
                  <span className="text-blue-900 break-words whitespace-normal flex-1">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground italic">N/A</div>
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
          {/* Back Button */}
          <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
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
          </div>

          {/* Title Row */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <h1 className={`text-lg md:text-2xl font-normal ${loading ? 'animate-pulse bg-muted h-8 w-48 md:w-96 rounded' : 'text-foreground'}`}>
                {!loading && (data?.receptorName || 'N/A')} {!loading && '-'} {!loading && (data?.ligandName || 'N/A')}
              </h1>
              {!loading && (
                <>
                  <Badge variant="outline" className="bg-secondary/50 border-border text-xs md:text-sm">
                    {data?.class || 'N/A'}
                  </Badge>
                  {isMutant && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs md:text-sm">
                      <Star className="h-3 w-3 fill-yellow-600 mr-1" />
                      Mutant
                    </Badge>
                  )}
                  {isWildType && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs md:text-sm">
                      Wild Type
                    </Badge>
                  )}
                </>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
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
              {hasUniProtLink && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 md:gap-2" 
                  onClick={() => window.open(data.uniprotLink, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">UniProt</span>
                  {isMutant && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                </Button>
              )}
              {hasPubChemLink && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 md:gap-2" 
                  onClick={() => window.open(data.pubchemLink, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">PubChem</span>
                </Button>
              )}
            </div>
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
            {!loading && isMutant && (
              <div className="flex items-center gap-1 text-amber-600 text-xs">
                <Star className="h-3 w-3 fill-amber-500" />
                <span className="hidden sm:inline">Mutant variant - UniProt links to wild-type protein</span>
                <span className="sm:hidden">Mutant variant</span>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 border-t border-border pt-4 -mb-4 md:-mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            <Button 
              variant="ghost" 
              size="sm"
              className="bg-accent/10 text-foreground font-medium whitespace-nowrap text-xs md:text-sm"
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

        {/* Overview Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          {/* Receptor Information */}
          <Card className="bg-card border-border">
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <Database className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                <h2 className="text-base md:text-lg font-semibold">Receptor Information</h2>
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
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4 md:mt-6 text-xs md:text-sm"
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
                <MutationField label="Mutation" value={data?.mutation} />
                <InfoField label="Mutation Status" value={data?.mutationStatus || 'N/A'} />
                <MutationImpactField />
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
            <div className="space-y-6">
              <MethodField label="Method" value={data?.method} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField 
                  label="Value" 
                  value={data?.value || 'N/A'} 
                  allowWrap={true}
                />
              </div>
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

        {/* Source Information */}
        <Card className="bg-card border-border">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <ExternalLink className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-semibold">Source Information</h2>
            </div>
            <div className="space-y-4">
              <InfoField 
                label="Source" 
                value={data?.source || 'N/A'} 
                allowWrap={true}
              />
              
              {/* Source Links */}
              {(() => {
                const validLinks = data?.sourceLinks 
                  ? data.sourceLinks.split('|')
                      .map(link => link.trim())
                      .filter(link => 
                        link && 
                        link !== 'N/A' && 
                        link !== 'nan' && 
                        link !== '' 
                      )
                  : [];

                return validLinks.length > 0 ? (
                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-2">Source Links:</div>
                    <div className="flex flex-wrap gap-2">
                      {validLinks.map((link, index) => {
                        // Try to extract a meaningful display name
                        let displayName = `Source ${index + 1}`;
                        try {
                          const url = new URL(link);
                          if (url.hostname.includes('pubmed')) displayName = 'PubMed';
                          else if (url.hostname.includes('uniprot')) displayName = 'UniProt';
                          else if (url.hostname.includes('rcsb')) displayName = 'PDB';
                          else displayName = url.hostname.replace('www.', '');
                        } catch (e) {
                          // Keep default display name if URL parsing fails
                        }

                        return (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(link, '_blank')}
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {displayName}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </Card>
      </div>

      {/* Wild Type Link for Mutants */}
      {!loading && isMutant && data?.wildTypeEvolfId && (
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

      {/* UniProt Link Footnote for Mutants */}
      {!loading && isMutant && (
        <div className="container mx-auto px-6 pb-8">
          <Card className="bg-card border-yellow-200 bg-yellow-50">
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
        </div>
      )}

      <Footer />
    </div>
  );
}