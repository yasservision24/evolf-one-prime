import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { downloadDatasetByEvolfId } from '@/lib/api';
import { useDatasetDetail } from '@/contexts/DatasetDetailContext';

export default function DatasetInteraction() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, loading, evolfId } = useDatasetDetail();
  
  const [exporting, setExporting] = useState(false);

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
    allowWrap = false,
  }: { 
    label: string; 
    value: string | number; 
    allowWrap?: boolean;
  }) => {
    const displayValue = value?.toString() || 'N/A';
    
    return (
      <div className="py-3">
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        <div className="flex items-center justify-between gap-2">
          <div className={`text-foreground font-medium ${allowWrap ? 'break-words whitespace-normal leading-relaxed' : ''}`}>
            {displayValue}
          </div>
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
      <div className="py-3 col-span-full">
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

  // Function to render source links in a scrollable section
  const renderSourceLinks = () => {
    if (!data?.sourceLinks || data.sourceLinks === 'nan' || data.sourceLinks === 'N/A' || data.sourceLinks === '') return null;

    // Split by pipe and filter out empty strings
    const links = data.sourceLinks.split('|').map(link => link.trim()).filter(link => link && link !== 'nan' && link !== 'N/A');
    
    if (links.length === 0) return null;

    return (
      <div className="py-3 col-span-full">
        <div className="text-sm text-muted-foreground mb-2">Source Links</div>
        <div className="bg-secondary/30 rounded-lg p-3">
          <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
            {links.map((link, index) => {
              // Extract PubMed ID from URL for display
              const pubmedId = link.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/)?.[1] || `Source ${index + 1}`;
              
              return (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2.5 border border-border rounded-md bg-background hover:bg-accent hover:text-accent-foreground transition-colors group"
                >
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">
                      PubMed: {pubmedId}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {link}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
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
              {!loading && `${data?.receptor || 'N/A'} - ${data?.ligand || 'N/A'}`}
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
              onClick={() => navigate(`/dataset/ligand?evolfid=${evolfId}`)}
              className="text-muted-foreground hover:text-foreground whitespace-nowrap text-xs md:text-sm"
            >
              Ligand
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="bg-accent/10 text-foreground font-medium whitespace-nowrap text-xs md:text-sm"
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
        <div className="grid grid-cols-1 gap-6">
          {/* Experimental Details Card */}
          <Card className="bg-card border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Experimental Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Binding Status" value={data?.class || 'N/A'} />
                <MethodField label="Method" value={data?.method} />
                <InfoField 
                  label="Value" 
                  value={data?.value || 'N/A'} 
                  allowWrap={true}
                />
                
              </div>
              
              {/* Source Links - Scrollable Section */}
              {renderSourceLinks()}
            </div>
          </Card>

          
        </div>
      </div>

      <Footer />
    </div>
  );
}