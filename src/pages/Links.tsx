import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Github, Package, ExternalLink } from 'lucide-react';

const Links = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="links" onNavigate={() => {}} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Centered Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Useful Links</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Access our Docker images and source code repositories
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
                  <div className="flex justify-center">
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
                </div>
              </Card>

              {/* GitHub Repositories Section */}
              <Card className="p-6">
                <div className="text-center">
                  <Github className="h-12 w-12 text-accent mb-4 mx-auto" />
                  <h2 className="text-2xl font-bold mb-4">Source Code Repositories</h2>
                  <p className="text-muted-foreground mb-6">
                    Explore and contribute to our open-source projects
                  </p>
                  
                  <div className="grid gap-4 max-w-2xl mx-auto">
                    {/* Web Server Repository */}
                    <a 
                      href="https://github.com/the-ahuja-lab/EvOlf/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-accent/10 hover:border-accent transition-colors"
                    >
                      <Github className="h-6 w-6 text-accent flex-shrink-0" />
                      <div className="text-left">
                        <h3 className="font-semibold">Web Server Source Code</h3>
                        <p className="text-sm text-muted-foreground">EvOlf</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                    </a>

                    {/* Models Source Code */}
                    <a 
                      href="https://github.com/the-ahuja-lab/evolf-pipeline-source" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-accent/10 hover:border-accent transition-colors"
                    >
                      <Github className="h-6 w-6 text-accent flex-shrink-0" />
                      <div className="text-left">
                        <h3 className="font-semibold">Models Source Code</h3>
                        <p className="text-sm text-muted-foreground">evolf-pipeline-source</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                    </a>

                    {/* Pipeline Source Code */}
                    <a 
                      href="https://github.com/the-ahuja-lab/evolf-pipeline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-accent/10 hover:border-accent transition-colors"
                    >
                      <Github className="h-6 w-6 text-accent flex-shrink-0" />
                      <div className="text-left">
                        <h3 className="font-semibold">Pipeline Source Code</h3>
                        <p className="text-sm text-muted-foreground">evolf-pipeline</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                    </a>
                  </div>
                </div>
              </Card>

              {/* Additional Information */}
              <Card className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">About These Resources</h3>
                  <div className="text-muted-foreground space-y-2 max-w-2xl mx-auto">
                    <p>
                      All our code is open-source and we encourage the community to explore, contribute, 
                      and adapt the pipeline to their specific needs.
                    </p>
                    <p>
                      For high-throughput predictions, we recommend using our local Nextflow pipeline 
                      with the Docker images for easy deployment.
                    </p>
                    <p className="text-sm mt-4">
                      Maintained by <strong>The Ahuja Lab</strong>
                    </p>
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