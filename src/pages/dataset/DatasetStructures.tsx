import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { downloadDatasetByEvolfId } from '@/lib/api';
import { Molecular3DViewer } from '@/components/Molecular3DViewer';
import { useDatasetDetail } from '@/contexts/DatasetDetailContext';

export default function DatasetStructures() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: rawData, loading, evolfId } = useDatasetDetail();
  
  const [exporting, setExporting] = useState(false);

  // Map API response to component data structure
  const data = useMemo(() => {
    if (!rawData) return null;
    return {
      evolfId: rawData.evolfId,
      receptor: rawData.receptor,
      ligand: rawData.ligand,
      class: rawData.class,
      mutation: rawData.mutation,
      structure3d: rawData.structure3d,
      species: rawData.species,
      receptorStructure: rawData.pdbData,
      ligandStructure: rawData.sdfData,
      receptorFormat: 'pdb' as const,
      ligandFormat: 'sdf' as const,
    };
  }, [rawData]);


  const downloadReceptorStructure = () => {
    if (!data?.receptorStructure || data.receptorStructure === 'N/A') return;

    const blob = new Blob([data.receptorStructure], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.receptor || 'receptor'}_${data.evolfId}.pdb`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Download Started',
      description: 'Receptor structure file downloaded',
    });
  };

  const downloadLigandStructure = () => {
    if (!data?.ligandStructure || data.ligandStructure === 'N/A') return;

    const blob = new Blob([data.ligandStructure], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.ligand || 'ligand'}_${data.evolfId}.${data.ligandFormat || 'sdf'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Download Started',
      description: 'Ligand structure file downloaded',
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
              onClick={() => navigate(`/dataset/interaction?evolfid=${evolfId}`)}
              className="text-muted-foreground hover:text-foreground whitespace-nowrap text-xs md:text-sm"
            >
              Interaction
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="bg-accent/10 text-foreground font-medium whitespace-nowrap text-xs md:text-sm"
            >
              3D Structures
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-8">

        {/* 3D Structures Content */}
        <div className="grid grid-cols-1 gap-6">
          {/* Receptor Section */}
          <Card className="bg-card border-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Receptor Structure</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadReceptorStructure}
                  disabled={loading || !data?.receptorStructure || data.receptorStructure === 'N/A'}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDB
                </Button>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Receptor Name</p>
                <p className="font-medium">{data?.receptor || 'N/A'}</p>
              </div>

              {loading ? (
                <div className="animate-pulse bg-muted h-96 w-full rounded" />
              ) : (
                <Molecular3DViewer
                  data={data?.receptorStructure || 'N/A'}
                  format={data?.receptorFormat || 'pdb'}
                  style="cartoon"
                  backgroundColor="#0a0a0a"
                  height={400}
                />
              )}
            </div>
          </Card>

          {/* Ligand Section */}
          <Card className="bg-card border-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Ligand Structure</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadLigandStructure}
                  disabled={loading || !data?.ligandStructure || data.ligandStructure === 'N/A'}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download {data?.ligandFormat?.toUpperCase() || 'SDF'}
                </Button>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Ligand Name</p>
                <p className="font-medium">{data?.ligand || 'N/A'}</p>
              </div>

              {loading ? (
                <div className="animate-pulse bg-muted h-96 w-full rounded" />
              ) : (
                <Molecular3DViewer
                  data={data?.ligandStructure || 'N/A'}
                  format={data?.ligandFormat || 'sdf'}
                  style="stick"
                  backgroundColor="#0a0a0a"
                  height={400}
                />
              )}
            </div>
          </Card>

          
        </div>
      </div>

      <Footer />
    </div>
  );
}
