import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Code, Key, FileJson, Globe } from 'lucide-react';

const API = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="home" onNavigate={() => {}} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Programmatic access to evolf data and prediction services
          </p>

          <div className="max-w-4xl space-y-6">
            <Card className="p-6">
              <Globe className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">REST API Endpoints</h3>
              <p className="text-muted-foreground mb-4">
                Base URL: <code className="bg-secondary px-2 py-1 rounded">https://api.evolf.com/v1</code>
              </p>
              <div className="space-y-2 text-sm">
                <div className="bg-secondary p-3 rounded">
                  <code>GET /interactions</code> - Retrieve interaction data
                </div>
                <div className="bg-secondary p-3 rounded">
                  <code>POST /predict</code> - Submit prediction requests
                </div>
                <div className="bg-secondary p-3 rounded">
                  <code>GET /receptors</code> - List available GPCR receptors
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <Key className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Authentication</h3>
              <p className="text-muted-foreground">
                API access requires authentication via API key. Include your key in the request header:
              </p>
              <div className="bg-secondary p-3 rounded mt-4">
                <code className="text-sm">Authorization: Bearer YOUR_API_KEY</code>
              </div>
            </Card>

            <Card className="p-6">
              <FileJson className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Response Format</h3>
              <p className="text-muted-foreground mb-4">
                All responses are returned in JSON format with standardized structure:
              </p>
              <div className="bg-secondary p-3 rounded">
                <pre className="text-sm overflow-x-auto">
{`{
  "status": "success",
  "data": {...},
  "meta": {...}
}`}
                </pre>
              </div>
            </Card>

            <Card className="p-6">
              <Code className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">Code Examples</h3>
              <p className="text-muted-foreground">
                Sample code snippets available for Python, R, JavaScript, and cURL. 
                Visit our GitHub repository for complete examples and client libraries.
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default API;
