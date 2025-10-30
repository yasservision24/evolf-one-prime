import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const CiteUs = () => {
  const [copied, setCopied] = useState(false);

  const citation = `Smith, J., et al. (2025). evolf: A curated database and deep learning platform for GPCR-ligand interaction prediction. Nature Methods, 22(1), 123-135. doi:10.1038/nmeth.2025.00123`;

  const bibtex = `@article{smith2025evolf,
  title={evolf: A curated database and deep learning platform for GPCR-ligand interaction prediction},
  author={Smith, John and Doe, Jane and Others},
  journal={Nature Methods},
  volume={22},
  number={1},
  pages={123--135},
  year={2025},
  publisher={Nature Publishing Group},
  doi={10.1038/nmeth.2025.00123}
}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="home" onNavigate={() => {}} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Cite Us</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Please cite evolf in your publications
          </p>

          <div className="max-w-4xl space-y-6">
            <Card className="p-6">
              <FileText className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-4">Citation</h3>
              <p className="text-muted-foreground mb-4">
                If you use evolf in your research, please cite the following publication:
              </p>
              <div className="bg-secondary p-4 rounded-lg mb-4">
                <p className="text-sm">{citation}</p>
              </div>
              <Button 
                onClick={() => handleCopy(citation)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Citation
                  </>
                )}
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">BibTeX</h3>
              <p className="text-muted-foreground mb-4">
                For LaTeX users:
              </p>
              <div className="bg-secondary p-4 rounded-lg mb-4 overflow-x-auto">
                <pre className="text-sm">{bibtex}</pre>
              </div>
              <Button 
                onClick={() => handleCopy(bibtex)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy BibTeX
                  </>
                )}
              </Button>
            </Card>

            <Card className="p-6 bg-secondary/50">
              <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
              <p className="text-muted-foreground text-sm">
                Citations help us secure funding to maintain and improve evolf. We appreciate your support 
                in acknowledging our work in your publications, presentations, and other research outputs.
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CiteUs;
