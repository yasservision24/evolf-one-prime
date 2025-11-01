import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Check, Loader2 } from 'lucide-react';
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
  chemblId?: string;
  pubchemCid?: string;
  smiles?: string;
  molecularWeight?: number;
  logP?: number;
  hBondDonors?: number;
  hBondAcceptors?: number;
  rotableBonds?: number;
}

export default function DatasetLigand() {
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
        // Mock data
        const mockData: DatasetDetail = {
          evolfId: evolfId || '',
          receptorName: 'Adenosine A2A receptor',
          ligandName: 'ZM 241385',
          class: 'Class A',
          mutation: 'Wild-type',
          chemblId: 'CHEMBL191',
          pubchemCid: '3035979',
          smiles: 'C1=CC(=CC=C1C(=O)NC2=NC(=NC=C2)NC3=CC=C(C=C3)C#N)C(F)(F)F',
          molecularWeight: 411.38,
          logP: 4.2,
          hBondDonors: 2,
          hBondAcceptors: 6,
          rotableBonds: 5,
        };
        
        setData(mockData);
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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/dataset/detail?evolfid=${evolfId}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>

          <div className="flex items-center gap-3 mb-4">
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
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/dataset/detail?evolfid=${evolfId}`)}
          >
            Overview
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/dataset/receptor?evolfid=${evolfId}`)}
          >
            Receptor Details
          </Button>
          <Button variant="default" size="sm">
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

        {/* Ligand Details Content */}
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
      </div>

      <Footer />
    </div>
  );
}
