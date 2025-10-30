import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Database, FileText, CheckCircle2 } from 'lucide-react';

const DownloadDataset = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="home" onNavigate={() => {}} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Download Dataset</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Access our curated GPCR receptor-ligand interaction database
          </p>

          <div className="max-w-4xl space-y-6">
            <Card className="p-6">
              <Database className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Complete Dataset</h3>
              <p className="text-muted-foreground mb-4">
                Download the full evolf database containing 10,000+ curated interactions
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Experimental binding affinity data</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Receptor sequences and structures</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Ligand SMILES and properties</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Literature references</span>
                </li>
              </ul>
              <div className="flex gap-3">
                <Button className="bg-accent hover:bg-accent/80">
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV (5.2 MB)
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download JSON (8.7 MB)
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <FileText className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Dataset Documentation</h3>
              <p className="text-muted-foreground mb-4">
                Detailed description of data fields, methodology, and citation information
              </p>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View README
              </Button>
            </Card>

            <Card className="p-6 bg-secondary/50">
              <h3 className="text-lg font-semibold mb-2">License & Citation</h3>
              <p className="text-muted-foreground text-sm">
                This dataset is released under the CC BY 4.0 license. If you use this data in your research, 
                please cite our publication. By downloading, you agree to our terms of use.
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DownloadDataset;
