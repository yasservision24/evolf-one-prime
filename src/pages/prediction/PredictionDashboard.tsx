import { useState } from 'react';
import { Brain, Sparkles, Info, TrendingUp, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PredictionDashboard = () => {
  const navigate = useNavigate();
  const [predicting, setPredicting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  const handlePredict = () => {
    setPredicting(true);
    setTimeout(() => {
      setPredicting(false);
      setShowResults(true);
    }, 2000);
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
                  <div>
                    <Label htmlFor="receptor-seq" className="text-sm md:text-base">Receptor Sequence</Label>
                    <Textarea
                      id="receptor-seq"
                      placeholder="Enter GPCR receptor amino acid sequence (FASTA format)..."
                      className="mt-2 h-24 md:h-32 font-mono text-xs md:text-sm"
                      defaultValue=">A2A_HUMAN Adenosine receptor A2a&#10;MPIMGSSVYITVELAIAVLAILGNVLVCWAVWLNSNLQNVTNYFVVSLAAADIAVGVLAIPFAITISTGFCAACHGCLFIACFVLVLTQSSIFSLLAIAIDRYIAIRIPLRYNGLVTGTRAKGIIAICWVLSFAIGLTPMLGWNNCGQPKEGKNHSQGCGEGQVACLFEDVVPMNYMVYFNFFACVLVPLLLMLGVYLRIFLAARRQLKQMESQPLPGERARSTLQKEVHAAKSLAIIVGLFALCWLPLHIINCFTFFCPDCSHAPLWLMYLAIVLSHTNSVVNPFIYAYRIREFRQTFRKIIRSHVLRQQEPFKAAGTSARVLAAHGSDGEQVSLRLNGHPPGVWANGSAPHPERRPNGYALGLVSGGSAQESQGNTGLPDVELLSHELKGVCPEPPGLDDPLAQDGAGVS"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Paste your receptor sequence or select from our database
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="ligand-smiles" className="text-sm md:text-base">Ligand Structure (SMILES)</Label>
                    <Input
                      id="ligand-smiles"
                      placeholder="Enter ligand SMILES notation..."
                      className="mt-2 font-mono text-xs md:text-sm"
                      defaultValue="CCN1C=NC2=C1C(=O)N(C(=O)N2C)C"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Example: Caffeine structure shown above
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="mutation" className="text-sm md:text-base">Mutation (Optional)</Label>
                    <Input
                      id="mutation"
                      placeholder="e.g., L249A"
                      className="mt-2 text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Specify point mutations in format: [Original][Position][New]
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

              {/* Results Section */}
              {showResults && (
                <Card className="p-4 md:p-6 border-2 border-border bg-gradient-to-br from-secondary to-background">
                  <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-purple-600 dark:text-purple-400" />
                    <h2 className="text-xl md:text-2xl text-foreground">Prediction Results</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <div className="text-xs md:text-sm text-muted-foreground mb-2">Predicted Binding Affinity</div>
                      <div className="text-3xl md:text-4xl text-purple-600 dark:text-purple-400 mb-1">2.45 nM</div>
                      <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs">High Affinity</Badge>
                    </div>

                    <div>
                      <div className="text-xs md:text-sm text-muted-foreground mb-2">Confidence Score</div>
                      <div className="text-3xl md:text-4xl text-purple-600 dark:text-purple-400 mb-1">94.2%</div>
                      <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs">High Confidence</Badge>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-6 p-3 md:p-4 bg-background rounded-lg border">
                    <div className="text-xs md:text-sm text-muted-foreground mb-2">Prediction Details</div>
                    <div className="space-y-2 text-xs md:text-sm">
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">Model Version:</span>
                        <span className="text-foreground">evolf-v2.1</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">Training Set Size:</span>
                        <span className="text-foreground">10,234 interactions</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">Prediction Time:</span>
                        <span className="text-foreground">1.8 seconds</span>
                      </div>
                    </div>
                  </div>

                  <Alert className="mt-4 border-border bg-secondary">
                    <AlertCircle className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    <AlertDescription className="text-xs md:text-sm text-muted-foreground">
                      These predictions are for research purposes only. Experimental validation is recommended 
                      before using results in drug development.
                    </AlertDescription>
                  </Alert>
                </Card>
              )}
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
                    <span>Model works best with Class A GPCRs</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 dark:text-purple-400 flex-shrink-0">•</span>
                    <span>Confidence scores indicate prediction reliability</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-4 md:p-6 bg-gradient-to-br from-secondary to-background border-border">
                <h3 className="text-base md:text-lg text-foreground mb-3">Example Inputs</h3>
                <div className="space-y-2 md:space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start text-left text-xs md:text-sm">
                    A2A + Caffeine
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-left text-xs md:text-sm">
                    Beta-2 + Epinephrine
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-left text-xs md:text-sm">
                    D2 + Haloperidol
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
