import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, CheckCircle2 } from 'lucide-react';

const SubmitData = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="home" onNavigate={() => {}} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Submit Data</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Contribute to the evolf database by submitting your experimental data
          </p>

          <div className="max-w-3xl space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Submission Guidelines</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Data must include experimental binding affinity measurements (Ki, Kd, IC50, or EC50)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    GPCR receptor sequence or UniProt ID required
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Ligand structure in SMILES format or PubChem CID
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Published data requires DOI or PubMed ID
                  </span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Submit Your Data</h3>
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Name</label>
                  <Input placeholder="Full name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="your.email@example.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Institution/Organization</label>
                  <Input placeholder="University or company name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Dataset Description</label>
                  <Textarea 
                    placeholder="Brief description of your data, including number of interactions, receptor types, experimental methods, etc." 
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Upload Data File</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer">
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      CSV, TSV, or Excel format (max 50MB)
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Publication Reference (if applicable)</label>
                  <Input placeholder="DOI or PubMed ID" />
                </div>
                <Button className="w-full bg-accent hover:bg-accent/80">
                  Submit Data
                </Button>
              </form>
            </Card>

            <Card className="p-6 bg-secondary/50">
              <h3 className="text-lg font-semibold mb-2">Review Process</h3>
              <p className="text-muted-foreground text-sm">
                All submitted data undergoes curation and quality control by our team. You will receive 
                confirmation within 2-3 weeks. Accepted data will be credited to you in our database 
                and acknowledged in our documentation.
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitData;
