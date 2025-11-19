import React, { useState } from 'react';
import { Brain, Sparkles, Info } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { submitPrediction } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const PredictionDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [predicting, setPredicting] = useState(false);

  // Receptor (paste only — no file / CSV)
  const [receptorSequence, setReceptorSequence] = useState<string>(
    `>A2A_HUMAN Adenosine receptor A2a
MPIMGSSVYITVELAIAVLAILGNVLVCWAVWLNSNLQNVTNYFVVSLAAADIAVGVLAIPFAITISTGFCAACHGCLFIACFVLVLTQSSIFSLLAIAIDRYIAIRIPLRYNGLVTGTRAKGIIAICWVLSFAIGLTPMLGWNNCGQPKEGKNHSQGCGEGQVACLFEDVVPMNYMVYFNFFACVLVPLLLMLGVYLRIFLAARRQLKQMESQPLPGERARSTLQKEVHAAKSLAIIVGLFALCWLPLHIINCFTFFCPDCSHAPLWLMYLAIVLSHTNSVVNPFIYAYRIREFRQTFRKIIRSHVLRQQEPFKAAGTSARVLAAHGSDGEQVSLRLNGHPPGVWANGSAPHPERRPNGYALGLVSGGSAQESQGNTGLPDVELLSHELKGVCPEPPGLDDPLAQDGAGVS`
  );

  // Ligand (single)
  const [ligandSmiles, setLigandSmiles] = useState<string>('CCN1C=NC2=C1C(=O)N(C(=O)N2C)C');
  const [ligandName, setLigandName] = useState<string>('Caffeine');

  // optional fields (user may edit or leave blank)
  const [tempRecId, setTempRecId] = useState<string>('');
  const [rowId, setRowId] = useState<string>(''); // if left blank backend will default to "1"

  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  // helper: convert pasted FASTA to raw sequence (remove header lines beginning with ">")
  const fastaToSequence = (fasta: string) => {
    if (!fasta) return '';
    const lines = fasta.split(/\r?\n/);
    const seqLines = lines.filter((l) => l && !l.startsWith('>'));
    return seqLines.join('').trim();
  };

  const handlePredict = async () => {
    if (!ligandSmiles || !ligandSmiles.trim()) {
      toast({
        title: 'Missing ligand',
        description: 'Please provide a ligand SMILES string',
        variant: 'destructive',
      });
      return;
    }

    setPredicting(true);

    try {
      // Convert FASTA -> raw sequence (backend expects plain sequence string)
      const seq = fastaToSequence(receptorSequence);

      // Build single-row payload (no arrays)
      const requestData = {
        smiles: ligandSmiles.trim(),
        mutated_sequence: seq || '',
        temp_ligand_id: ligandName?.trim() || '', // backend will default to lig_1 if empty
        temp_rec_id: tempRecId?.trim() || '',
        id: rowId?.trim() || '', // backend will default to "1" if empty
      };

      const result = await submitPrediction(requestData);

      // backend returns job_id (or jobId)
      const jobId = result?.job_id ?? result?.jobId;
      if (jobId) {
        toast({
          title: 'Prediction submitted',
          description: 'Redirecting to results page...',
        });
        navigate(`/prediction-result?job-id=${encodeURIComponent(jobId)}`);
      } else {
        throw new Error('No job id returned from server');
      }
    } catch (err: any) {
      console.error('Prediction error', err);
      toast({
        title: 'Prediction failed',
        description: err?.message ?? 'An error occurred during prediction',
        variant: 'destructive',
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
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-600 px-3 py-1.5 rounded-full mb-3">
              <Brain className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">Deep Learning Model</span>
            </div>
            <h1 className="text-2xl md:text-4xl text-foreground mb-3 md:mb-4 px-4">evolf Prediction Model</h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Predict GPCR-ligand binding affinity using our state-of-the-art deep learning model
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {/* Inputs */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-4 md:p-6 border-2 border-border">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                  <h2 className="text-xl md:text-2xl text-foreground">Input Data</h2>
                </div>

                <div className="space-y-4 md:space-y-6">
                  {/* Receptor textarea (optional) */}
                  <div>
                    <Label className="text-sm md:text-base mb-2 block">Receptor Sequence (optional)</Label>
                    <Textarea
                      placeholder="Paste receptor FASTA (optional)..."
                      className="h-24 md:h-32 font-mono text-xs md:text-sm"
                      value={receptorSequence}
                      onChange={(e) => setReceptorSequence(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Receptor is optional for the current SMILES-only pipeline but useful for future extensions.
                    </p>
                  </div>

                  {/* Ligand input */}
                  <div>
                    <Label className="text-sm md:text-base mb-2 block">Ligand SMILES</Label>
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
                      <Input
                        placeholder="Receptor ID (optional)"
                        className="text-xs md:text-sm"
                        value={tempRecId}
                        onChange={(e) => setTempRecId(e.target.value)}
                      />
                      <Input
                        placeholder="Row ID (optional, default = 1)"
                        className="text-xs md:text-sm"
                        value={rowId}
                        onChange={(e) => setRowId(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Enter a single ligand SMILES. One ligand per request.</p>
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

            {/* Sidebar */}
            <div className="space-y-4 md:space-y-6">
              <Card className="p-4 md:p-6 bg-gradient-to-br from-secondary to-background border-border">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <Info className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
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
                  <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                  <h3 className="text-base md:text-lg text-foreground">Quick Tips</h3>
                </div>
                <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
                  <li className="flex gap-2"><span className="text-purple-600">•</span><span>Use FASTA format for receptor sequences</span></li>
                  <li className="flex gap-2"><span className="text-purple-600">•</span><span>Enter ligands as SMILES notation</span></li>
                  <li className="flex gap-2"><span className="text-purple-600">•</span><span>One ligand per prediction</span></li>
                  <li className="flex gap-2"><span className="text-purple-600">•</span><span>Model works best with Class A GPCRs</span></li>
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
