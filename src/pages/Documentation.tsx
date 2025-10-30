import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Book, Code, Database, Zap } from 'lucide-react';

const Documentation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="home" onNavigate={() => {}} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Complete guide to using the evolf platform for GPCR research
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <Card className="p-6">
              <Book className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Getting Started</h3>
              <p className="text-muted-foreground">
                Learn how to navigate the platform and access our GPCR database
              </p>
            </Card>

            <Card className="p-6">
              <Database className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Dataset Explorer</h3>
              <p className="text-muted-foreground">
                Comprehensive guide to searching and filtering interaction data
              </p>
            </Card>

            <Card className="p-6">
              <Zap className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Prediction Model</h3>
              <p className="text-muted-foreground">
                How to use our deep learning model for binding affinity predictions
              </p>
            </Card>

            <Card className="p-6">
              <Code className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">API Reference</h3>
              <p className="text-muted-foreground">
                Technical documentation for programmatic access to our services
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;
