import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Code, Play, Download, Clock, Copy, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Api = () => {
  const navigate = useNavigate();
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
  const [activeFormat, setActiveFormat] = useState<'bash' | 'cmd' | 'powershell'>('bash');
  
  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({...prev, [key]: true}));
      setTimeout(() => {
        setCopiedStates(prev => ({...prev, [key]: false}));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Format-specific API examples
  const apiExamples = {
    baseUrl: 'https://evolf.ahujalab.iiitd.edu.in/api',
    
    // Submit request examples
    submitRequest: {
      bash: `curl -X POST "https://evolf.ahujalab.iiitd.edu.in/api/predict/smiles/" \\
  -H "Content-Type: application/json" \\
  -d '{
    "smiles": "NCCc1c[nH]c2ccc(O)cc12",
    "sequence": "MDVLSPGQGNNTTSPPAPFETGGNTTGISDVTFSYQVITSLLLGTLIFCAVLGN",
    "temp_ligand_id": "serotonin",
    "temp_rec_id": "5ht1a"
  }'`,
      cmd: `curl -X POST "https://evolf.ahujalab.iiitd.edu.in/api/predict/smiles/" ^
  -H "Content-Type: application/json" ^
  -d "{\\"smiles\\": \\"NCCc1c[nH]c2ccc(O)cc12\\", \\"sequence\\": \\"MDVLSPGQGNNTTSPPAPFETGGNTTGISDVTFSYQVITSLLLGTLIFCAVLGN\\", \\"temp_ligand_id\\": \\"serotonin\\", \\"temp_rec_id\\": \\"5ht1a\\"}"`,
      powershell: `curl -X POST "https://evolf.ahujalab.iiitd.edu.in/api/predict/smiles/" \`
  -H "Content-Type: application/json" \`
  -d '{
    "smiles": "NCCc1c[nH]c2ccc(O)cc12",
    "sequence": "MDVLSPGQGNNTTSPPAPFETGGNTTGISDVTFSYQVITSLLLGTLIFCAVLGN",
    "temp_ligand_id": "serotonin",
    "temp_rec_id": "5ht1a"
  }'`
    },
    
    // Status request examples
    statusRequest: {
      bash: `curl "https://evolf.ahujalab.iiitd.edu.in/api/predict/job/a1b2c3d4-e5f6-7890-abcd-ef1234567890/"`,
      cmd: `curl "https://evolf.ahujalab.iiitd.edu.in/api/predict/job/a1b2c3d4-e5f6-7890-abcd-ef1234567890/"`,
      powershell: `curl "https://evolf.ahujalab.iiitd.edu.in/api/predict/job/a1b2c3d4-e5f6-7890-abcd-ef1234567890/"`
    },
    
    // Download request examples
    downloadRequest: {
      bash: `curl "https://evolf.ahujalab.iiitd.edu.in/api/predict/job/a1b2c3d4-e5f6-7890-abcd-ef1234567890/?download=output" \\
  --output prediction_results.zip`,
      cmd: `curl "https://evolf.ahujalab.iiitd.edu.in/api/predict/job/a1b2c3d4-e5f6-7890-abcd-ef1234567890/?download=output" ^
  --output prediction_results.zip`,
      powershell: `curl "https://evolf.ahujalab.iiitd.edu.in/api/predict/job/a1b2c3d4-e5f6-7890-abcd-ef1234567890/?download=output" \`
  --output prediction_results.zip`
    },
    
    // Other examples
    requestBody: `{
  "smiles": "NCCc1c[nH]c2ccc(O)cc12",
  "sequence": "MDVLSPGQGNNTTSPPAPFET...",
  "temp_ligand_id": "ligand_001",
  "temp_rec_id": "receptor_001",
  "id": "ligand_receptor_pair_id"
}`,
    submitResponse: `{
  "job_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "message": "Job submitted to pipeline asynchronously."
}`,
    statusResponseRunning: `{
  "status": "processing",
  "message": "Job started but no output files yet"
}`,
    statusResponseComplete: `{
  "job_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "finished",
  "output_files": [
    "output/Receptor_Embeddings.csv",
    "output/Prediction_Output.csv",
    "output/LR_Pair_Embeddings.csv",
    "output/Ligand_Embeddings.csv"
  ]
}`,
    errorFormat: `{
  "error": "Brief error description",
  "message": "Detailed error message (optional)",
  "status": 400
}`
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
                    <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                      <code className="text-sm flex-1 mr-2">https://evolf.ahujalab.iiitd.edu.in/api</code>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCopy(apiExamples.baseUrl, 'baseUrl')}
                        className="h-6 px-2 shrink-0"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        {copiedStates.baseUrl ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <p><strong>Required Headers:</strong> <code>Content-Type: application/json</code></p>
                    <p><strong>Request Timeout:</strong> 30 seconds</p>
                  </div>
                </div>
              </Card>

              {/* Input Validation & Requirements */}
              <Card className="p-6">
                <div className="text-center">
                  <AlertCircle className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h2 className="text-2xl font-bold mb-4">Input Requirements</h2>
                  <div className="text-muted-foreground space-y-3 max-w-2xl mx-auto text-left">
                    <div>
                      <h3 className="font-semibold mb-2">Receptor Sequence</h3>
                      <ul className="space-y-1 text-sm list-disc list-inside">
                        <li>Only plain receptor sequences are allowed, FASTA headers (&gt;) are <strong>NOT</strong> accepted</li>
                        <li>Sequences must contain only the 20 standard amino acids: <code>A, C, D, E, F, G, H, I, K, L, M, N, P, Q, R, S, T, V, W, Y</code></li>
                        <li>The receptor sequence must be less than 1024 amino acids</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Ligand SMILES</h3>
                      <ul className="space-y-1 text-sm list-disc list-inside">
                        <li>Ligand SMILES strings must be fewer than 512 characters</li>
                        <li>For best results, convert SMILES to canonical format using OpenBabel (optional but recommended)</li>
                      </ul>
                    </div>
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
                      <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                        <code className="text-sm flex-1 mr-2">POST /predict/smiles/</code>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCopy('POST /predict/smiles/', 'submitEndpoint')}
                          className="h-6 px-2 shrink-0"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          {copiedStates.submitEndpoint ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Request Body</h3>
                      <div className="relative bg-gray-100 p-4 rounded">
                        <pre className="text-sm overflow-x-auto">
                          {apiExamples.requestBody}
                        </pre>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCopy(apiExamples.requestBody, 'requestBody')}
                          className="absolute top-2 right-2 h-6 px-2"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          {copiedStates.requestBody ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Field Descriptions</h3>
                      <ul className="space-y-1 text-sm">
                        <li><strong>smiles</strong> (required) - SMILES notation of ligand (max 511 characters)</li>
                        <li><strong>sequence</strong> (required) - Receptor protein sequence (max 1023 amino acids, no FASTA headers, only standard amino acids)</li>
                        <li><strong>temp_ligand_id</strong> (optional) - Temporary ligand identifier</li>
                        <li><strong>temp_rec_id</strong> (optional) - Temporary receptor identifier</li>
                        <li><strong>id</strong> (optional) - Ligand-Receptor Pair identifier</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Example Request</h3>
                      <div>
                        {/* Format Switcher */}
                        <div className="flex space-x-2 mb-2">
                          <Button 
                            variant={activeFormat === 'bash' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setActiveFormat('bash')}
                          >
                            Linux/macOS
                          </Button>
                          <Button 
                            variant={activeFormat === 'cmd' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setActiveFormat('cmd')}
                          >
                            Windows CMD
                          </Button>
                          <Button 
                            variant={activeFormat === 'powershell' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setActiveFormat('powershell')}
                          >
                            PowerShell
                          </Button>
                        </div>
                        
                        <div className="relative bg-gray-100 p-4 rounded">
                          <pre className="text-sm overflow-x-auto">
                            {apiExamples.submitRequest[activeFormat]}
                          </pre>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopy(apiExamples.submitRequest[activeFormat], 'submitRequest')}
                            className="absolute top-2 right-2 h-6 px-2"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            {copiedStates.submitRequest ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Response</h3>
                      <div className="relative bg-gray-100 p-4 rounded">
                        <pre className="text-sm overflow-x-auto">
                          {apiExamples.submitResponse}
                        </pre>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCopy(apiExamples.submitResponse, 'submitResponse')}
                          className="absolute top-2 right-2 h-6 px-2"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          {copiedStates.submitResponse ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
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
                      <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                        <code className="text-sm flex-1 mr-2">GET /predict/job/&#123;job_id&#125;/</code>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCopy('GET /predict/job/{job_id}/', 'statusEndpoint')}
                          className="h-6 px-2 shrink-0"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          {copiedStates.statusEndpoint ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Path Parameters</h3>
                      <ul className="space-y-1 text-sm">
                        <li><strong>job_id</strong> (required) - Job UUID returned from submission</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Example Request</h3>
                      <div>
                        <div className="flex space-x-2 mb-2">
                          <Button 
                            variant={activeFormat === 'bash' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setActiveFormat('bash')}
                          >
                            Linux/macOS
                          </Button>
                          <Button 
                            variant={activeFormat === 'cmd' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setActiveFormat('cmd')}
                          >
                            Windows CMD
                          </Button>
                          <Button 
                            variant={activeFormat === 'powershell' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setActiveFormat('powershell')}
                          >
                            PowerShell
                          </Button>
                        </div>
                        
                        <div className="relative bg-gray-100 p-4 rounded">
                          <pre className="text-sm overflow-x-auto">
                            {apiExamples.statusRequest[activeFormat]}
                          </pre>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopy(apiExamples.statusRequest[activeFormat], 'statusRequest')}
                            className="absolute top-2 right-2 h-6 px-2"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            {copiedStates.statusRequest ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Response Examples</h3>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-1">Job Running:</p>
                        <div className="relative bg-gray-100 p-4 rounded">
                          <pre className="text-sm overflow-x-auto">
                            {apiExamples.statusResponseRunning}
                          </pre>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopy(apiExamples.statusResponseRunning, 'statusResponseRunning')}
                            className="absolute top-2 right-2 h-6 px-2"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            {copiedStates.statusResponseRunning ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-1">Job Completed:</p>
                        <div className="relative bg-gray-100 p-4 rounded">
                          <pre className="text-sm overflow-x-auto">
                            {apiExamples.statusResponseComplete}
                          </pre>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopy(apiExamples.statusResponseComplete, 'statusResponseComplete')}
                            className="absolute top-2 right-2 h-6 px-2"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            {copiedStates.statusResponseComplete ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
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
                    Download prediction results as a ZIP file containing CSV files
                  </p>
                  
                  <div className="text-left space-y-4 max-w-2xl mx-auto">
                    <div>
                      <h3 className="font-semibold mb-2">Endpoints</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                          <code className="text-sm flex-1 mr-2">GET /predict/job/&#123;job_id&#125;/?download=output</code>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopy('GET /predict/job/{job_id}/?download=output', 'downloadEndpoint1')}
                            className="h-6 px-2 shrink-0"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            {copiedStates.downloadEndpoint1 ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                          <code className="text-sm flex-1 mr-2">GET /predict/download/&#123;job_id&#125;/</code>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopy('GET /predict/download/{job_id}/', 'downloadEndpoint2')}
                            className="h-6 px-2 shrink-0"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            {copiedStates.downloadEndpoint2 ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Example Request</h3>
                      <div>
                        <div className="flex space-x-2 mb-2">
                          <Button 
                            variant={activeFormat === 'bash' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setActiveFormat('bash')}
                          >
                            Linux/macOS
                          </Button>
                          <Button 
                            variant={activeFormat === 'cmd' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setActiveFormat('cmd')}
                          >
                            Windows CMD
                          </Button>
                          <Button 
                            variant={activeFormat === 'powershell' ? 'default' : 'outline'} 
                            size="sm"
                            onClick={() => setActiveFormat('powershell')}
                          >
                            PowerShell
                          </Button>
                        </div>
                        
                        <div className="relative bg-gray-100 p-4 rounded">
                          <pre className="text-sm overflow-x-auto">
                            {apiExamples.downloadRequest[activeFormat]}
                          </pre>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopy(apiExamples.downloadRequest[activeFormat], 'downloadRequest')}
                            className="absolute top-2 right-2 h-6 px-2"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            {copiedStates.downloadRequest ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Response</h3>
                      <ul className="space-y-1 text-sm">
                        <li><strong>Content-Type:</strong> application/zip</li>
                        <li><strong>Content-Disposition:</strong> attachment; filename=&#123;job_id&#125;_output.zip</li>
                        <li><strong>Body:</strong> Binary ZIP file containing all output CSV files</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">ZIP Contents (CSV Files Only)</h3>
                      <ul className="space-y-1 text-sm list-disc list-inside">
                        <li><code>output/Receptor_Embeddings.csv</code> - Numerical embeddings generated from receptor protein sequences</li>
                        <li><code>output/Prediction_Output.csv</code> - Binding affinity predictions with confidence scores</li>
                        <li><code>output/LR_Pair_Embeddings.csv</code> - Combined embeddings of ligand-receptor pairs</li>
                        <li><code>output/Ligand_Embeddings.csv</code> - Numerical embeddings generated from ligand SMILES strings</li>
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
                      <div className="relative bg-gray-100 p-4 rounded">
                        <pre className="text-sm overflow-x-auto">
                          {apiExamples.errorFormat}
                        </pre>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCopy(apiExamples.errorFormat, 'errorFormat')}
                          className="absolute top-2 right-2 h-6 px-2"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          {copiedStates.errorFormat ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Common Errors</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">400 - Invalid SMILES</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{"error": "SMILES contains whitespace or invalid characters."}`}</pre>
                        </div>
                        <div>
                          <p className="font-medium">400 - Invalid Receptor Sequence</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{"error": "Receptor sequence contains invalid characters. Only standard amino acids (ACDEFGHIKLMNPQRSTVWY) allowed."}`}</pre>
                        </div>
                        <div>
                          <p className="font-medium">400 - Sequence Too Long</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{"error": "Receptor sequence exceeds maximum length of 1023 amino acids."}`}</pre>
                        </div>
                        <div>
                          <p className="font-medium">400 - SMILES Too Long</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{"error": "SMILES string exceeds maximum length of 511 characters."}`}</pre>
                        </div>
                        <div>
                          <p className="font-medium">400 - FASTA Header Detected</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{"error": "FASTA headers (&gt;) are not accepted. Please provide only the protein sequence."}`}</pre>
                        </div>
                        <div>
                          <p className="font-medium">404 - Job Not Found</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{"error": "Job not found"}`}</pre>
                        </div>
                        <div>
                          <p className="font-medium">404 - Output Not Found</p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`{"error": "Output files not found for the specified job"}`}</pre>
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
                  <div className="text-muted-foreground space-y-3 max-w-2xl mx-auto text-left">
                    <p><strong>Rate Limiting:</strong> As we use a shared academic server to host the model, we currently limit our web service to one ligand-receptor pair interaction prediction per request to ensure fair usage and server stability.</p>
                    <p><strong>Job Processing:</strong> Predictions are processed asynchronously - use the job status endpoint to monitor progress</p>
                    <p><strong>File Downloads:</strong> Results are available as ZIP files containing CSV files only (no JSON or image files)</p>
                    <p><strong>Output Format:</strong> All CSV files use comma as delimiter and include headers. Predictions include columns for ligand ID, receptor ID, predicted binding affinity, and confidence scores.</p>
                    <p><strong>Receptor Validation:</strong> Only plain amino acid sequences allowed. FASTA headers (&gt;) are NOT accepted. Sequences must contain only the 20 standard amino acids and be less than 1024 characters.</p>
                    <p><strong>SMILES Validation:</strong> For best results, convert your SMILES into canonical format using OpenBabel. SMILES strings must be fewer than 512 characters.</p>
                    <p><strong>Output Files:</strong> All output files are in CSV format and include Receptor_Embeddings.csv, Prediction_Output.csv, LR_Pair_Embeddings.csv, and Ligand_Embeddings.csv</p>
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