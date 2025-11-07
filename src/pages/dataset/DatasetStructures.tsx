import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { fetchDatasetStructures } from '@/lib/api';
import { Molecular3DViewer } from '@/components/Molecular3DViewer';

interface DatasetDetail {
  evolfId: string;
  receptor?: string;
  ligand?: string;
  class?: string;
  mutation?: string;
  structure3d?: string;
  method?: string;
  receptorStructure?: string;
  ligandStructure?: string;
  receptorFormat?: 'pdb' | 'sdf' | 'mol2' | 'xyz';
  ligandFormat?: 'pdb' | 'sdf' | 'mol2' | 'xyz';
}

export default function DatasetStructures() {
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
        const response = await fetchDatasetStructures(evolfId);
        
        // Map API response to component data structure
        const structureData: DatasetDetail = {
          evolfId: response.evolfId,
          receptor: response.receptor,
          ligand: response.ligand,
          class: response.class,
          mutation: response.mutation,
          structure3d: response.structure3d,
          method: 'X-ray Diffraction', // TODO: Add method field to API response if available
          receptorStructure: response.pdbData, // PDB data from API
          ligandStructure: response.sdfData,   // SDF data from API
          receptorFormat: 'pdb',
          ligandFormat: 'sdf',
        };
        
        setData(structureData);
      } catch (error) {
        console.error('Failed to fetch entry:', error);
        toast({
          title: 'Error',
          description: 'Failed to load structure data. Please try again.',
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

  const exportAllStructures = () => {
    if (!data) return;

    const exportData = {
      evolfId: data.evolfId,
      receptor: data.receptor,
      ligand: data.ligand,
      class: data.class,
      mutation: data.mutation,
      method: data.method,
      receptorStructure: data.receptorStructure,
      ligandStructure: data.ligandStructure,
      receptorFormat: data.receptorFormat,
      ligandFormat: data.ligandFormat,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.evolfId}_structures_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Successful',
      description: 'Structure data exported successfully',
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentPage="dataset" onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)} />
      
      {/* Header Section */}
      <div className="bg-card/30 border-b border-border">
        <div className="container mx-auto px-6 py-6">
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(`/dataset/detail?evolfid=${evolfId}`)}
              className="text-muted-foreground hover:text-foreground"
            >
              Back to Overview
            </Button>
            <div className="ml-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportAllStructures}
                disabled={loading || !data}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <h1 className={`text-2xl font-normal ${loading ? 'animate-pulse bg-muted h-8 w-96 rounded' : 'text-foreground'}`}>
              {!loading && `${data?.receptor || 'N/A'} - ${data?.ligand || 'N/A'}`}
            </h1>
            {!loading && data?.class && (
              <Badge variant="outline" className="bg-secondary/50 border-border">
                {data.class}
              </Badge>
            )}
            {!loading && data?.mutation && data.mutation !== 'None' && (
              <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/40">
                {data.mutation}
              </Badge>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 border-t border-border pt-4 -mb-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/dataset/detail?evolfid=${evolfId}`)}
              className="text-muted-foreground hover:text-foreground"
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
              className="bg-accent/10 text-foreground font-medium"
            >
              3D Structures
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">

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

          {/* Additional Structure Info */}
          <Card className="bg-card border-border">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField 
                  label="Complex Structure File" 
                  value={data?.structure3d || 'N/A'} 
                  copyable 
                  fieldKey="structure3d" 
                />
                <InfoField label="Method" value={data?.method || 'N/A'} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
