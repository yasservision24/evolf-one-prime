import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Github, Package, ExternalLink, Box, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Links = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  // Docker Hub image data
  const dockerImages = [
    { name: "evolfdl_env", url: "https://hub.docker.com/r/ahujalab/evolfdl_env", description: "EvOlf Deep Learning Environment" },
    { name: "signaturizer_env", url: "https://hub.docker.com/r/ahujalab/signaturizer_env", description: "Signaturizer Descriptor Generation" },
    { name: "mol2vec_env", url: "https://hub.docker.com/r/ahujalab/mol2vec_env", description: "Mol2Vec Molecular Embeddings" },
    { name: "mathfeaturizer_env", url: "https://hub.docker.com/r/ahujalab/mathfeaturizer_env", description: "MathFeaturizer Descriptors" },
    { name: "evolfprediction_env", url: "https://hub.docker.com/r/ahujalab/evolfprediction_env", description: "EvOlf Prediction Model" },
    { name: "evolfr_env", url: "https://hub.docker.com/r/ahujalab/evolfr_env", description: "EvOlf R Environment" },
    { name: "graph2vec_env", url: "https://hub.docker.com/r/ahujalab/graph2vec_env", description: "Graph2Vec Molecular Graphs" },
    { name: "mordred_env", url: "https://hub.docker.com/r/ahujalab/mordred_env", description: "Mordred Molecular Descriptors" },
  ];

  // GitHub repositories data
  const githubRepos = [
    { name: "EvOlf", url: "https://github.com/the-ahuja-lab/EvOlf", description: "EvOlf source code and documentation" }
   
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="other" onNavigate={handleNavigate} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Centered Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Useful Links</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Access our Docker images, source code repositories, and local pipeline instructions
            </p>
          </div>

          {/* Centered Content */}
          <div className="flex justify-center">
            <div className="max-w-4xl w-full space-y-6">
              {/* Docker Hub Section */}
              <Card className="p-6">
                <div className="text-center">
                  <Package className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
                  <h2 className="text-2xl font-bold mb-4">Docker Images</h2>
                  <p className="text-muted-foreground mb-6">
                    Pre-built Docker containers for easy deployment and running of the EvOlf pipeline
                  </p>
                  
                  {/* Main Docker Hub Link */}
                  <div className="flex justify-center mb-8">
                    <a 
                      href="https://hub.docker.com/repositories/ahujalab" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Package className="h-5 w-5" />
                      <span>Docker Hub: ahujalab</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  {/* Individual Docker Images Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                    {dockerImages.map((image, index) => (
                      <a 
                        key={index}
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group"
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <Box className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-left flex-1">
                          <h3 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                            {image.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {image.description}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Local Pipeline Section */}
              <Card className="p-6">
                <div className="text-center">
                  <Terminal className="h-12 w-12 text-green-600 mb-4 mx-auto" />
                  <h2 className="text-2xl font-bold mb-4">Local Pipeline</h2>
                  <p className="text-muted-foreground mb-6">
                    Run EvOlf predictions locally for high-throughput processing
                  </p>
                  
                  <div className="max-w-3xl mx-auto text-left">
                   

                    {/* Pipeline Source Code Link */}
                    <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg border border-green-200">
                      <Terminal className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <a 
                          href="https://github.com/the-ahuja-lab/EvOlf/tree/main/evolf-pipeline-source" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-700 hover:underline font-semibold"
                        >
                          EvOlf Local Pipeline
                        </a>
                        <p className="text-sm text-gray-600">
                          EvOlf Local Pipeline - Nextflow-based high-throughput prediction pipeline
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* GitHub Repositories Section */}
              <Card className="p-6">
                <div className="text-center">
                  <Github className="h-12 w-12 text-accent mb-4 mx-auto" />
                  <h2 className="text-2xl font-bold mb-4">Source Code Repositories</h2>
                  
                  
                  <div className="grid gap-4 max-w-3xl mx-auto">
                    {githubRepos.map((repo, index) => (
                      <a 
                        key={index}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors group border border-accent/20"
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-accent/20 rounded-lg group-hover:bg-accent/30 transition-colors">
                          <Github className="h-5 w-5 text-accent" />
                        </div>
                        <div className="text-left flex-1">
                          <h3 className="font-semibold text-accent group-hover:text-accent-dark transition-colors">
                            {repo.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {repo.description}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-accent/60 group-hover:text-accent transition-colors flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Additional Information */}
              <Card className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">About These Resources</h3>
                  <div className="text-muted-foreground space-y-3 max-w-2xl mx-auto">
                    <p>
                      All our code is open-source and we encourage the community to explore, contribute, 
                      and adapt the pipeline to their specific needs.
                    </p>
                    <p>
                      For high-throughput predictions, we strongly recommend using our local Nextflow pipeline 
                      with the Docker images for easy deployment. This allows you to run predictions on 
                      single or multiple files with a single command on your own machine.
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Note:</span> The web service is limited to one ligand-pair 
                      interaction prediction per request to ensure fair usage and server stability.
                    </p>
                    
                    <div className="pt-4 mt-4 border-t">
                      <a 
                        href="https://www.ahuja-lab.in/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block text-accent hover:underline font-semibold"
                      >
                        Maintained By The Ahuja Lab
                      </a>
                      <p className="text-xs text-muted-foreground mt-1">
                        Indraprastha Institute of Information Technology Delhi (IIIT-D)
                      </p>
                    </div>
                  </div>
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

export default Links;