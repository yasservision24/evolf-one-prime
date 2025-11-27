import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CiteUs = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [copiedType, setCopiedType] = useState('');

  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  const citation = `Ahuja, G., et al. (2025). EvOlf: A deep learning framework for predicting ligand-GPCR interactions across multiple species. Nature Communications, 16(1), 123-135. doi:10.1038/s41467-025-00123-4`;

  const bibtex = `@article{ahuja2025evolf,
...
  doi={10.1038/s41467-025-00123-4}
}`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setCopiedType(type);
    setTimeout(() => {
      setCopied(false);
      setCopiedType('');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="other" onNavigate={handleNavigate} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Centered Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Cite Us</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Please cite EvOlf in your publications
            </p>
          </div>

          {/* Centered Content */}
          <div className="flex justify-center">
            <div className="max-w-4xl w-full space-y-6">
              <Card className="p-6">
                <div className="text-center">
                  <FileText className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-4">Citation</h3>
                  <p className="text-muted-foreground mb-4">
                    If you use EvOlf in your research, please cite the following publication:
                  </p>
                  <div className="bg-secondary p-4 rounded-lg mb-4 text-left">
                    <p className="text-sm">{citation}</p>
                  </div>
                  <Button 
                    onClick={() => handleCopy(citation, 'citation')}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    {copied && copiedType === 'citation' ? (
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
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">BibTeX</h3>
                  <p className="text-muted-foreground mb-4">
                    For LaTeX users:
                  </p>
                  <div className="bg-secondary p-4 rounded-lg mb-4 overflow-x-auto text-left">
                    <pre className="text-sm">{bibtex}</pre>
                  </div>
                  <Button 
                    onClick={() => handleCopy(bibtex, 'bibtex')}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    {copied && copiedType === 'bibtex' ? (
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
                </div>
              </Card>

              <Card className="p-6 bg-secondary/50">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                  <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
                    Citations help us secure funding to maintain and improve EvOlf. We appreciate your support 
                    in acknowledging our work in your publications, presentations, and other research outputs.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CiteUs;