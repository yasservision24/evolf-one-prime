import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ExternalLink, Github, Package, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Documentation = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="other" onNavigate={handleNavigate} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">How to Use EvOlf</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Complete guide to using the EvOlf platform for GPCR research and ligand-GPCR interaction predictions
            </p>
          </div>

          {/* Web Interface Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Web Interface</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Our user-friendly web interface allows you to explore the curated database used to train EvOlf and run predictions.
            </p>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">Explore Dataset</h3>
              <p className="mb-4">
                To look up the database, navigate to the <strong>Explore Dataset</strong> tab. Use the search bar to find receptors or ligands of interest. 
              </p>
              <p className="mb-4">
                We host a detailed dataset along with receptor and ligand structures and other relevant interaction information. This transparency allows users to validate and use our curated dataset to further improve their work and contribute to the academic community.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">Prediction Model</h3>
              <p className="mb-4">
                The primary focus of EvOlf is predicting ligand-GPCR interactions. Go to the <strong>Prediction Model</strong> tab on the navigation bar to try it out.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-medium">
                  Note: As we use a shared academic server to host the model, we currently limit our web service to one ligand-pair interaction prediction per request to ensure fair usage and server stability.
                </p>
              </div>
            </div>
          </section>

          {/* API Access Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">API Access</h2>
            <p className="text-muted-foreground mb-6">
              For developers and researchers who prefer programmatic access, you can fetch the dataset, explore it, and use the EvOlf prediction model via our API endpoints.
            </p>
            
            <div className="flex items-center gap-2 p-4 bg-accent/10 rounded-lg">
              <ExternalLink className="h-5 w-5 text-accent" />
              <a 
                href="/api-docs"
                className="text-accent hover:underline font-semibold"
              >
                Go to API Documentation
              </a>
            </div>
          </section>

          {/* Local Pipeline Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Local Pipeline</h2>
            <p className="text-muted-foreground mb-4">
              If you need to run the EvOlf prediction model on a large number of ligand-GPCR interactions, we strongly recommend using our local pipeline.
            </p>
            <p className="mb-6">
              We have built a robust Nextflow pipeline that allows you to run predictions on single or multiple files with a single command on your own machine.
            </p>

            {/* Pipeline Source Code */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4">Local Pipeline</h3>
              <div className="flex items-center gap-2 p-4 bg-accent/10 rounded-lg mb-4">
                <Github className="h-5 w-5 text-accent" />
                <a 
                  href="https://github.com/the-ahuja-lab/EvOlf/tree/main/evolf-pipeline-source" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline font-semibold"
                >
                  EvOlf Local Pipeline 
                </a>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                The pipeline includes complete configuration files and instructions for running EvOlf locally.
              </p>
            </div>

            {/* Docker Images */}
            <div className="mb-4">
              <h3 className="text-2xl font-semibold mb-4">Docker Images</h3>
              <p className="mb-4">
                We provide pre-built Docker images for all components of the EvOlf pipeline. You can pull these images from Docker Hub:
              </p>
              
              <div className="flex items-center gap-2 p-4 bg-blue-100 rounded-lg mb-4">
                <Package className="h-5 w-5 text-blue-600" />
                <a 
                  href="https://hub.docker.com/repositories/ahujalab" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Docker Hub: ahujalab
                </a>
              </div>

              <div className="space-y-3 mt-4">
                <h4 className="text-lg font-semibold">Available Docker Images:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Box className="h-4 w-4 text-blue-500" />
                    <a 
                      href="https://hub.docker.com/r/ahujalab/evolfdl_env" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      evolfdl_env - EvOlf Deep Learning
                    </a>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Box className="h-4 w-4 text-blue-500" />
                    <a 
                      href="https://hub.docker.com/r/ahujalab/signaturizer_env" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      signaturizer_env - Signaturizer
                    </a>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Box className="h-4 w-4 text-blue-500" />
                    <a 
                      href="https://hub.docker.com/r/ahujalab/mol2vec_env" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      mol2vec_env - Mol2Vec
                    </a>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Box className="h-4 w-4 text-blue-500" />
                    <a 
                      href="https://hub.docker.com/r/ahujalab/mathfeaturizer_env" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      mathfeaturizer_env - MathFeaturizer
                    </a>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Box className="h-4 w-4 text-blue-500" />
                    <a 
                      href="https://hub.docker.com/r/ahujalab/evolfprediction_env" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      evolfprediction_env - Prediction Model
                    </a>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Box className="h-4 w-4 text-blue-500" />
                    <a 
                      href="https://hub.docker.com/r/ahujalab/evolfr_env" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      evolfr_env - EvOlf R Environment
                    </a>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Box className="h-4 w-4 text-blue-500" />
                    <a 
                      href="https://hub.docker.com/r/ahujalab/graph2vec_env" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      graph2vec_env - Graph2Vec
                    </a>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Box className="h-4 w-4 text-blue-500" />
                    <a 
                      href="https://hub.docker.com/r/ahujalab/mordred_env" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      mordred_env - Mordred Descriptors
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Source Code Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Source Code</h2>
            <p className="text-muted-foreground mb-4">
              EvOlf is open-source! All the code, models, and scripts used to build the pipeline are hosted in our source repository. We encourage the community to explore, contribute, and adapt the pipeline to their specific needs.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-accent/10 rounded-lg">
                <Github className="h-5 w-5 text-accent" />
                <a 
                  href="https://github.com/the-ahuja-lab/EvOlf/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline font-semibold"
                >
                  EvOlf Source Code: EvOlf
                </a>
              </div>
            </div>
          </section>

          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              Maintained by{" "}
              <a
                href="https://www.ahuja-lab.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm mt-4 font-semibold text-accent hover:underline"
              >
                The Ahuja Lab
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;