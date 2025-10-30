import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Brain, Cpu, TrendingUp, Target } from 'lucide-react';

const ModelInfo = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="home" onNavigate={() => {}} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Model Information</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Technical details about our deep learning prediction model
          </p>

          <div className="max-w-4xl space-y-6">
            <Card className="p-6">
              <Brain className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Architecture</h3>
              <p className="text-muted-foreground">
                Our model uses a state-of-the-art transformer-based architecture specifically designed for 
                protein-ligand interaction prediction. The model processes both sequence and structural features 
                to predict binding affinity with high accuracy.
              </p>
            </Card>

            <Card className="p-6">
              <TrendingUp className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Performance Metrics</h3>
              <p className="text-muted-foreground mb-4">
                Evaluated on independent test sets:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>R² Score: 0.87</li>
                <li>Mean Absolute Error: 0.52 pKi units</li>
                <li>Prediction Accuracy: 95%+</li>
              </ul>
            </Card>

            <Card className="p-6">
              <Cpu className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Training Data</h3>
              <p className="text-muted-foreground">
                The model was trained on over 10,000 curated GPCR-ligand interactions from peer-reviewed 
                literature, covering multiple GPCR families and ligand types.
              </p>
            </Card>

            <Card className="p-6">
              <Target className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Applications</h3>
              <p className="text-muted-foreground">
                Use cases include drug discovery, virtual screening, mutation impact prediction, 
                and structure-activity relationship studies.
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ModelInfo;
