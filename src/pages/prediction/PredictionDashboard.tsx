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

// --- EXAMPLE DATA ---
const EXAMPLE_SMILES = "CN1C[C@H](C[C@H]2[C@H]1Cc1cn(c3c1c2ccc3)C)NS(=O)(=O)N(C)C";
const EXAMPLE_RECEPTOR = "MVNLRNAVHSFLVHLIGLLVWQSDISVSPVAAIVTDIFNTSDGGRFKFPDGVQNWPALSIVIIIIMTIGGNILVIMAVSMEKKLHNATNYFLMSLAIADMLVGLLVMPLSLLAILYDYVWPLPRYLCPVWISLDVLFSTASIMHLCAISLDRYVAIRNPIEHSRFNSRTKAIMKIAIVWAISIGVSVPIPVIGLRDEEKVFVNNTTCVLNDPNFVLIGSFVAFFIPLTIMVITYCLTIYVLRRQALMLLHGHTEEPPGLSLDFLKCCKRNTAEEENSANPNQDQNARRRKKKERRPRGTMQAINNERKASKVLGIVFFVLLIMWCPFFITNILSVLCEKSCNQKLMEKLLNVFVWIGYVCSGINPLVYTLFNKIYRRAFSNYLRCNYKVEKKPPVRQIPRVAATALSGRELNVNIYRHTNEPVIEKASDNEPGIEMQVENLELPVNPSSVVSERISSV";
// --------------------

const PredictionDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [predicting, setPredicting] = useState(false);

  // Set initial state to the example data
  const [receptorSequence, setReceptorSequence] = useState<string>(EXAMPLE_RECEPTOR);
  const [ligandSmiles, setLigandSmiles] = useState<string>(EXAMPLE_SMILES);

  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  const handlePredict = async () => {
    if (!ligandSmiles.trim()) {
      toast({
        title: 'Missing ligand',
        description: 'Please provide a ligand SMILES string.',
        variant: 'destructive',
      });
      return;
    }

    // ❌ Reject FASTA input
    if (receptorSequence.trim().startsWith('>')) {
      toast({
        title: 'Invalid Sequence Format',
        description: 'Please paste a plain amino acid sequence, not FASTA.',
        variant: 'destructive',
      });
      return;
    }

    setPredicting(true);

    try {
      const requestData = {
        smiles: ligandSmiles.trim(),
        mutated_sequence: receptorSequence.trim() || '',
      };

      const result = await submitPrediction(requestData);
      const jobId = result?.job_id ?? result?.jobId;

      if (jobId) {
        toast({
          title: 'Prediction submitted',
          description: 'Redirecting to results page...',
        });
        navigate(`/prediction-result?job-id=${encodeURIComponent(jobId)}`);
      } else {
        throw new Error('No job id returned from server.');
      }
    } catch (err: any) {
      toast({
        title: 'Prediction failed',
        description: err?.message ?? 'An error occurred during prediction.',
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

          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-600 px-3 py-1.5 rounded-full mb-3">
              <Brain className="h-4 w-4" />
              <span className="text-sm">Deep Learning Model</span>
            </div>
            <h1 className="text-3xl md:text-4xl text-foreground mb-3">evolf Prediction Model</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Predict GPCR-ligand binding affinity using our state-of-the-art deep learning model.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 border-2 border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h2 className="text-2xl text-foreground">Input Data</h2>
                </div>

                <div className="space-y-6">

                  {/* Receptor sequence (plain) */}
                  <div>
                    <Label className="text-base mb-2 block">Receptor Sequence (plain AA)</Label>
                    <Textarea
                      placeholder="Paste plain receptor sequence — NOT FASTA"
                      className="h-28 font-mono text-sm"
                      value={receptorSequence}
                      onChange={(e) => setReceptorSequence(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Only amino acid sequences allowed. FASTA headers (&gt;) are not accepted.
                    </p>
                  </div>

                  {/* SMILES */}
                  <div>
                    <Label className="text-base mb-2 block">Ligand SMILES</Label>
                    <Input
                      placeholder="e.g., CCN1C=NC2=C1C(=O)N(C(=O)N2C)C"
                      className="font-mono text-sm"
                      value={ligandSmiles}
                      onChange={(e) => setLigandSmiles(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white"
                  size="lg"
                  onClick={handlePredict}
                  disabled={predicting}
                >
                  {predicting ? 'Predicting...' : 'Predict Binding Affinity'}
                </Button>
              </Card>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-secondary to-background border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg text-foreground">Model Information</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Transformer-based model trained on GPCR-ligand interaction datasets.
                </p>
              </Card>

              <Card className="p-6 border-border">
                <h3 className="text-lg text-foreground mb-3">Quick Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Only plain receptor sequences allowed</li>
                  <li>• Enter SMILES in standard notation</li>
                  <li>• One ligand per prediction</li>
                </ul>
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