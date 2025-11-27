import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ExternalLink, Github, Package } from 'lucide-react';
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
                href="/api"
                className="text-accent hover:underline font-semibold"
              >
                Go to API Documentation
              </a>
            </div>
          </section>

          {/* Local Run Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Local Run (High-Throughput)</h2>
            <p className="text-muted-foreground mb-4">
              If you need to run the EvOlf prediction model on a large number of ligand-GPCR interactions, we strongly recommend using our local pipeline.
            </p>
            <p className="mb-6">
              We have built a robust Nextflow pipeline that allows you to run predictions on single or multiple files with a single command on your own machine.
            </p>
            
            <div className="flex items-center gap-2 p-4 bg-blue-100 rounded-lg">
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
                  Web Server Source Code: EvOlf
                </a>
              </div>
              <div className="flex items-center gap-2 p-4 bg-accent/10 rounded-lg">
                <Github className="h-5 w-5 text-accent" />
                <a 
                  href="https://github.com/the-ahuja-lab/evolf-pipeline-source" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline font-semibold"
                >
                  Models Source Code: evolf-pipeline-source
                </a>
              </div>
              <div className="flex items-center gap-2 p-4 bg-accent/10 rounded-lg">
                <Github className="h-5 w-5 text-accent" />
                <a 
                  href="https://github.com/the-ahuja-lab/evolf-pipeline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline font-semibold"
                >
                  Pipeline Source Code: evolf-pipeline
                </a>
              </div>
            </div>
          </section>

          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              Maintained by <strong>The Ahuja Lab</strong>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;