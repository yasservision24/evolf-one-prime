import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Code, Play, Download, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Api = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="other" onNavigate={handleNavigate} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Centered Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Complete REST API reference for the EvOlf prediction service
            </p>
          </div>

          {/* Centered Content */}
          <div className="flex justify-center">
            <div className="max-w-4xl w-full space-y-8">
              {/* Base Configuration */}
              <Card className="p-6">
                <div className="text-center">
                  <Code className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h2 className="text-2xl font-bold mb-4">Base Configuration</h2>
                  <div className="text-muted-foreground space-y-2 max-w-2xl mx-auto">
                    <p><strong>Base URL:</strong> <code>https://evolf.ahujalab.iiitd.edu.in/api</code></p>
                    <p><strong>Required Headers:</strong> <code>Content-Type: application/json</code></p>
                    <p><strong>Request Timeout:</strong> 30 seconds</p>
                  </div>
                </div>
              </Card>

              {/* Submit Prediction */}
              <Card className="p-6">
                <div className="text-center">
                  <Play className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h2 className="text-2xl font-bold mb-4">1. Submit Prediction</h2>
                  <p className="text-muted-foreground mb-6">
                    Submit a ligand SMILES string and receptor sequence for binding affinity prediction
                  </p>
                  
                  <div className="text-left space-y-4 max-w-2xl mx-auto">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoint</h3>
                      <code className="bg-gray-100 px-2 py-1 rounded">POST /predict/smiles/</code>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Request Body</h3>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`{
  "smiles": "NCCc1c[nH]c2ccc(O)cc12",
  "sequence": "MDVLSPGQGNNTTSPPAPFET...",
  "temp_ligand_id": "ligand_001",
  "temp_rec_id": "receptor_001",
  "id": "ligand_receptor_pair_id"
}`}</pre>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Field Descriptions</h3>
                      <ul className="space-y-1 text-sm">
                        <li><strong>smiles</strong> (required) - SMILES notation of ligand</li>
                        <li><strong>sequence</strong> (optional) - Receptor protein sequence</li>
                        <li><strong>temp_ligand_id</strong> (optional) - Temporary ligand identifier</li>
                        <li><strong>temp_rec_id</strong> (optional) - Temporary receptor identifier</li>
                        <li><strong>id</strong> (optional) - Ligand-Receptor Pair identifier</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Example Request</h3>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`curl -X POST "https://evolf.ahujalab.iiitd.edu.in/api/predict/smiles/" \\
  -H "Content-Type: application/json" \\
  -d '{
    "smiles": "NCCc1c[nH]c2ccc(O)cc12",
    "sequence": "MDVLSPGQGNNTTSPPAPFETGGNTTGISDVTFSYQVITSLLLGTLIFCAVLGN",
    "temp_ligand_id": "serotonin",
    "temp_rec_id": "5ht1a"
  }'`}</pre>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Response</h3>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`{
  "job_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "message": "Job submitted to pipeline asynchronously."
}`}</pre>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Get Job Status */}
              <Card className="p-6">
                <div className="text-center">
                  <Clock className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h2 className="text-2xl font-bold mb-4">2. Get Job Status</h2>
                  <p className="text-muted-foreground mb-6">
                    Check the status of a submitted prediction job
                  </p>
                  
                  <div className="text-left space-y-4 max-w-2xl mx-auto">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoint</h3>
                      <code className="bg-gray-100 px-2 py-1 rounded">GET /predict/job/&#123;job_id&#125;/</code>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Path Parameters</h3>
                      <ul className="space-y-1 text-sm">
                        <li><strong>job_id</strong> (required) - Job UUID returned from submission</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Example Request</h3>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`curl "https://evolf.ahujalab.iiitd.edu.in/api/predict/job/a1b2c3d4-e5f6-7890-abcd-ef1234567890/"`}</pre>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Response Examples</h3>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-1">Job Running:</p>
                        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`{
  "status": "processing",
  "message": "Job started but no output files yet"
}`}</pre>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Job Completed:</p>
                        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`{
  "job_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "finished",
  "output_files": [
    "output/predictions.csv",
    "output/visualization.png",
    "output/summary.json"
  ]
}`}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Download Results */}
              <Card className="p-6">
                <div className="text-center">
                  <Download className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h2 className="text-2xl font-bold mb-4">3. Download Job Results</h2>
                  <p className="text-muted-foreground mb-6">
                    Download prediction results as a ZIP file
                  </p>
                  
                  <div className="text-left space-y-4 max-w-2xl mx-auto">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoints</h3>
                      <div className="space-y-2">
                        <code className="block bg-gray-100 px-2 py-1 rounded">GET /predict/job/&#123;job_id&#125;/?download=output</code>
                        <code className="block bg-gray-100 px-2 py-1 rounded">GET /predict/download/&#123;job_id&#125;/</code>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Example Request</h3>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`curl "https://evolf.ahujalab.iiitd.edu.in/api/predict/job/a1b2c3d4-e5f6-7890-abcd-ef1234567890/?download=output" \\
  --output prediction_results.zip`}</pre>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Response</h3>
                      <ul className="space-y-1 text-sm">
                        <li><strong>Content-Type:</strong> application/zip</li>
                        <li><strong>Content-Disposition:</strong> attachment; filename=&#123;job_id&#125;_output.zip</li>
                        <li><strong>Body:</strong> Binary ZIP file containing all output files</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">ZIP Contents</h3>
                      <ul className="space-y-1 text-sm list-disc list-inside">
                        <li><code>output/predictions.csv</code> - Prediction results</li>
                        <li><code>output/visualization.png</code> - Result visualizations</li>
                        <li><code>output/summary.json</code> - Summary statistics</li>
                        <li>Additional files depending on pipeline configuration</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Error Handling */}
              <Card className="p-6">
                <div className="text-center">
                  <Code className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h2 className="text-2xl font-bold mb-4">Error Handling</h2>
                  
                  <div className="text-left space-y-4 max-w-2xl mx-auto">
                    <div>
                      <h3 className="font-semibold mb-2">Error Response Format</h3>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`{
  "error": "Brief error description",
  "message": "Detailed error message (optional)",
  "status": 400
}`}</pre>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Common Errors</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">400 - Invalid SMILES</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{"error": "SMILES contains whitespace."}`}</pre>
                        </div>
                        <div>
                          <p className="font-medium">404 - Job Not Found</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{"error": "Job not not found"}`}</pre>
                        </div>
                        <div>
                          <p className="font-medium">404 - Output Not Found</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{"error": "Output not found for job"}`}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Usage Notes */}
              <Card className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Important Notes</h3>
                  <div className="text-muted-foreground space-y-2 max-w-2xl mx-auto text-left">
                    <p><strong>Rate Limiting:</strong> As we use a shared academic server to host the model, we currently limit our web service to one ligand-pair interaction prediction per request to ensure fair usage and server stability.</p>
                    <p><strong>Job Processing:</strong> Predictions are processed asynchronously - use the job status endpoint to monitor progress</p>
                    <p><strong>File Downloads:</strong> Results are available as ZIP files containing CSV, JSON, and visualization files</p>
                    <p><strong>Receptor Validation:</strong> Only amino acid sequences allowed. FASTA headers  are not accepted.</p>
                    <p><strong>SMILE Validation:</strong> For best results, convert your SMILES into canonical format using OpenBabel</p>
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

export default Api;