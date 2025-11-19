import { useState, useRef } from 'react';
import { Brain, Sparkles, Info, FileText, Upload } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { submitPrediction } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const PredictionDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [predicting, setPredicting] = useState(false);
  
  // Receptor state
  const [receptorInput, setReceptorInput] = useState<'text' | 'file'>('text');
  const [receptorSequence, setReceptorSequence] = useState(
    ">A2A_HUMAN Adenosine receptor A2a\nMPIMGSSVYITVELAIAVLAILGNVLVCWAVWLNSNLQNVTNYFVVSLAAADIAVGVLAIPFAITISTGFCAACHGCLFIACFVLVLTQSSIFSLLAIAIDRYIAIRIPLRYNGLVTGTRAKGIIAICWVLSFAIGLTPMLGWNNCGQPKEGKNHSQGCGEGQVACLFEDVVPMNYMVYFNFFACVLVPLLLMLGVYLRIFLAARRQLKQMESQPLPGERARSTLQKEVHAAKSLAIIVGLFALCWLPLHIINCFTFFCPDCSHAPLWLMYLAIVLSHTNSVVNPFIYAYRIREFRQTFRKIIRSHVLRQQEPFKAAGTSARVLAAHGSDGEQVSLRLNGHPPGVWANGSAPHPERRPNGYALGLVSGGSAQESQGNTGLPDVELLSHELKGVCPEPPGLDDPLAQDGAGVS"
  );
  const [receptorFile, setReceptorFile] = useState<File | null>(null);
  
  // Ligand state (single ligand only)
  const [ligandSmiles, setLigandSmiles] = useState('CCN1C=NC2=C1C(=O)N(C(=O)N2C)C');
  const [ligandName, setLigandName] = useState('Caffeine');
  
  const receptorFileRef = useRef<HTMLInputElement>(null);

  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  const handleReceptorFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.fasta') && !file.name.endsWith('.fa') && !file.name.endsWith('.txt')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a FASTA file (.fasta, .fa, or .txt)',
        variant: 'destructive'
      });
      return;
    }
    
    setReceptorFile(file);
    const text = await file.text();
    setReceptorSequence(text);
  };

  const handlePredict = async () => {
    if (!receptorSequence.trim()) {
      toast({
        title: 'Missing receptor',
        description: 'Please provide a receptor sequence',
        variant: 'destructive'
      });
      return;
    }

    if (!ligandSmiles.trim()) {
      toast({
        title: 'Missing ligand',
        description: 'Please provide a ligand SMILES string',
        variant: 'destructive'
      });
      return;
    }

    setPredicting(true);

    try {
      const requestData = {
        receptor: {
          sequence: receptorSequence,
          name: 'Uploaded Receptor'
        },
        ligands: [{
          smiles: ligandSmiles,
          name: ligandName || undefined
        }]
      };

      const result = await submitPrediction(requestData);
      
      if (result.jobId) {
        toast({
          title: 'Prediction submitted',
          description: 'Redirecting to results page...',
        });
        navigate(`/prediction-result?job-id=${result.jobId}`);
      }
    } catch (error: any) {
      toast({
        title: 'Prediction failed',
        description: error.message || 'An error occurred during prediction',
        variant: 'destructive'
      });
    } finally {
      setPredicting(false);
    }
  };

  return (
    <>
      <Header currentPage="model" onNavigate={handleNavigate} />
      <div className="min-h-screen bg-gradient-to-b from-secondary to-background py-6 md:py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-600 dark:text-purple-400 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-3 md:mb-4">
              <Brain className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">Deep Learning Model</span>
            </div>
            <h1 className="text-2xl md:text-4xl text-foreground mb-3 md:mb-4 px-4">evolf Prediction Model</h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Predict GPCR-ligand binding affinity using our state-of-the-art deep learning model
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-4 md:p-6 border-2 border-border">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-xl md:text-2xl text-foreground">Input Data</h2>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                  {/* Receptor Input */}
                  <div>
                    <Label className="text-sm md:text-base mb-2 block">Receptor Sequence</Label>
                    <Tabs value={receptorInput} onValueChange={(v) => setReceptorInput(v as 'text' | 'file')}>
                      <TabsList className="grid w-full grid-cols-2 mb-3">
                        <TabsTrigger value="text">Paste FASTA</TabsTrigger>
                        <TabsTrigger value="file">Upload File</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="text">
                        <Textarea
                          placeholder="Enter GPCR receptor amino acid sequence (FASTA format)..."
                          className="h-24 md:h-32 font-mono text-xs md:text-sm"
                          value={receptorSequence}
                          onChange={(e) => setReceptorSequence(e.target.value)}
                        />
                      </TabsContent>
                      
                      <TabsContent value="file">
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <input
                            ref={receptorFileRef}
                            type="file"
                            accept=".fasta,.fa,.txt"
                            className="hidden"
                            onChange={handleReceptorFileChange}
                          />
                          <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          {receptorFile ? (
                            <div>
                              <p className="text-sm font-medium">{receptorFile.name}</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => receptorFileRef.current?.click()}
                              >
                                Change File
                              </Button>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-muted-foreground mb-2">
                                Upload FASTA file (.fasta, .fa, .txt)
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => receptorFileRef.current?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Select File
                              </Button>
                            </>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                    <p className="text-xs text-muted-foreground mt-1">
                      Provide receptor sequence in FASTA format
                    </p>
                  </div>

                  {/* Ligand Input */}
                  <div>
                    <Label className="text-sm md:text-base mb-2 block">Ligand Structure</Label>
                    <div className="space-y-3">
                      <Input
                        placeholder="SMILES notation (e.g., CCN1C=NC2=C1C(=O)N(C(=O)N2C)C)"
                        className="font-mono text-xs md:text-sm"
                        value={ligandSmiles}
                        onChange={(e) => setLigandSmiles(e.target.value)}
                      />
                      <Input
                        placeholder="Ligand name (optional)"
                        className="text-xs md:text-sm"
                        value={ligandName}
                        onChange={(e) => setLigandName(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter ligand as SMILES notation
                    </p>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4 md:mt-6 bg-purple-600 hover:bg-purple-700 text-white"
                  size="lg"
                  onClick={handlePredict}
                  disabled={predicting}
                >
                  {predicting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      <span className="text-sm md:text-base">Predicting...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      <span className="text-sm md:text-base">Predict Binding Affinity</span>
                    </>
                  )}
                </Button>
              </Card>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-4 md:space-y-6">
              <Card className="p-4 md:p-6 bg-gradient-to-br from-secondary to-background border-border">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <Info className="h-4 w-4 md:h-5 md:w-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-base md:text-lg text-foreground">Model Information</h3>
                </div>
                <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-muted-foreground">
                  <div>
                    <div className="text-foreground mb-1">Architecture</div>
                    <p>Transformer-based deep learning model with attention mechanisms</p>
                  </div>
                  <div>
                    <div className="text-foreground mb-1">Training Data</div>
                    <p>10,234 validated GPCR-ligand interactions from literature</p>
                  </div>
                  <div>
                    <div className="text-foreground mb-1">Performance</div>
                    <p>R² = 0.89, RMSE = 0.65 log units on test set</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 md:p-6 border-border">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-base md:text-lg text-foreground">Quick Tips</h3>
                </div>
                <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-purple-600 dark:text-purple-400 flex-shrink-0">•</span>
                    <span>Use FASTA format for receptor sequences</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 dark:text-purple-400 flex-shrink-0">•</span>
                    <span>Enter ligands as SMILES notation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 dark:text-purple-400 flex-shrink-0">•</span>
                    <span>One ligand per prediction</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 dark:text-purple-400 flex-shrink-0">•</span>
                    <span>Model works best with Class A GPCRs</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-4 md:p-6 bg-gradient-to-br from-secondary to-background border-border">
                <h3 className="text-base md:text-lg text-foreground mb-3">Resources</h3>
                <div className="space-y-2 md:space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left text-xs md:text-sm"
                    onClick={() => navigate('/documentation')}
                  >
                    API Documentation
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PredictionDashboard;
