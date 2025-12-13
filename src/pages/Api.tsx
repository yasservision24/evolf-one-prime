import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Code, Play, Download, Clock, Copy, AlertCircle, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Api = () => {
  const navigate = useNavigate();
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
  
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
  ],
  "predictions": [
    {
      "id": "1",
      "temp_ligand_id": "serotonin",
      "smiles": "NCCc1c[nH]c2ccc(O)cc12",
      "mutated_sequence": "MDVLSPGQGNNTTSPPAPFETGGNTTGISDVTFSYQVITSLLLGTLIFCAVLGN",
      "temp_rec_id": "5ht1a",
      "predicted_label": "Agonist (1)",
      "p1": "0.85"
    }
  ]
}`,
    errorFormat: `{
  "error": "Brief error description",
  "message": "Detailed error message (optional)",
  "status": 400
}`
  };

  // Code block component with copy button
  const CodeBlock = ({ code, copyKey, className = "" }: { code: string; copyKey: string; className?: string }) => {
    const isCopied = copiedStates[copyKey];
    
    return (
      <div className={`relative rounded-md border bg-muted/50 p-4 ${className}`}>
        <div className="absolute right-3 top-3 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(code, copyKey)}
            className="h-8 w-8 p-0"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="pr-10">
          <pre className="text-sm overflow-x-auto whitespace-pre-wrap break-words font-mono">
            {code}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="other" onNavigate={handleNavigate} />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-3 md:px-4">
          {/* Centered Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">API Documentation</h1>
            <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
              Complete REST API reference for the EvOlf prediction service
            </p>
          </div>

          {/* Centered Content */}
          <div className="flex justify-center">
            <div className="max-w-4xl w-full space-y-6 md:space-y-8">
              {/* Base Configuration */}
              <Card className="p-4 md:p-6">
                <div className="text-center">
                  <Code className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 mx-auto" />
                  <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Base Configuration</h2>
                  <div className="text-muted-foreground space-y-2 max-w-2xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="flex-1 bg-muted px-3 py-2 rounded text-sm md:text-base overflow-x-auto">
                        <code className="whitespace-nowrap">https://evolf.ahujalab.iiitd.edu.in/api</code>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopy(apiExamples.baseUrl, 'baseUrl')}
                        className="shrink-0"
                      >
                        {copiedStates.baseUrl ? (
                          <>
                            <Check className="h-4 w-4 mr-2" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" /> Copy URL
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="text-left">
                      <p className="text-sm"><strong>Required Headers:</strong> <code className="text-xs md:text-sm">Content-Type: application/json</code></p>
                      <p className="text-sm"><strong>Request Timeout:</strong> 30 seconds</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Input Validation & Requirements */}
              <Card className="p-4 md:p-6">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 mx-auto" />
                  <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Input Requirements</h2>
                  <div className="text-muted-foreground space-y-3 max-w-2xl mx-auto text-left">
                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Receptor Sequence</h3>
                      <ul className="space-y-1 text-xs md:text-sm list-disc list-inside">
                        <li>Only plain receptor sequences are allowed, FASTA headers (&gt;) are <strong>NOT</strong> accepted</li>
                        <li>Sequences must contain only the 20 standard amino acids: <code className="text-xs">A, C, D, E, F, G, H, I, K, L, M, N, P, Q, R, S, T, V, W, Y</code></li>
                        <li>The receptor sequence must be less than 1024 amino acids</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Ligand SMILES</h3>
                      <ul className="space-y-1 text-xs md:text-sm list-disc list-inside">
                        <li>Ligand SMILES strings must be fewer than 512 characters</li>
                        <li>For best results, convert SMILES to canonical format using OpenBabel (optional but recommended)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Submit Prediction */}
              <Card className="p-4 md:p-6">
                <div className="text-center">
                  <Play className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 mx-auto" />
                  <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">1. Submit Prediction</h2>
                  <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
                    Submit a ligand SMILES string and receptor sequence for binding affinity prediction
                  </p>
                  
                  <div className="space-y-4 max-w-2xl mx-auto text-left">
                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Endpoint</h3>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="flex-1 bg-muted px-3 py-2 rounded text-sm overflow-x-auto">
                          <code className="whitespace-nowrap">POST /predict/smiles/</code>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCopy('POST /predict/smiles/', 'submitEndpoint')}
                          className="shrink-0"
                        >
                          {copiedStates.submitEndpoint ? (
                            <>
                              <Check className="h-4 w-4 mr-2" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" /> Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Request Body</h3>
                      <CodeBlock 
                        code={apiExamples.requestBody}
                        copyKey="requestBody"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Field Descriptions</h3>
                      <ul className="space-y-1 text-xs md:text-sm">
                        <li><strong>smiles</strong> (required) - SMILES notation of ligand (max 511 characters)</li>
                        <li><strong>sequence</strong> (required) - Receptor protein sequence (max 1023 amino acids, no FASTA headers, only standard amino acids)</li>
                        <li><strong>temp_ligand_id</strong> (optional) - Temporary ligand identifier</li>
                        <li><strong>temp_rec_id</strong> (optional) - Temporary receptor identifier</li>
                        <li><strong>id</strong> (optional) - Ligand-Receptor Pair identifier</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Example Request</h3>
                      <Tabs defaultValue="bash" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-2">
                          <TabsTrigger value="bash" className="text-xs md:text-sm">Linux/macOS</TabsTrigger>
                          <TabsTrigger value="cmd" className="text-xs md:text-sm">Windows CMD</TabsTrigger>
                          <TabsTrigger value="powershell" className="text-xs md:text-sm">PowerShell</TabsTrigger>
                        </TabsList>
                        <TabsContent value="bash">
                          <CodeBlock 
                            code={apiExamples.submitRequest.bash}
                            copyKey="submitRequestBash"
                          />
                        </TabsContent>
                        <TabsContent value="cmd">
                          <CodeBlock 
                            code={apiExamples.submitRequest.cmd}
                            copyKey="submitRequestCmd"
                          />
                        </TabsContent>
                        <TabsContent value="powershell">
                          <CodeBlock 
                            code={apiExamples.submitRequest.powershell}
                            copyKey="submitRequestPowershell"
                          />
                        </TabsContent>
                      </Tabs>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Response</h3>
                      <CodeBlock 
                        code={apiExamples.submitResponse}
                        copyKey="submitResponse"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Get Job Status */}
              <Card className="p-4 md:p-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 mx-auto" />
                  <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">2. Get Job Status</h2>
                  <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
                    Check the status of a submitted prediction job
                  </p>
                  
                  <div className="space-y-4 max-w-2xl mx-auto text-left">
                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Endpoint</h3>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="flex-1 bg-muted px-3 py-2 rounded text-sm overflow-x-auto">
                          <code className="whitespace-nowrap">GET /predict/job/&#123;job_id&#125;/</code>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCopy('GET /predict/job/{job_id}/', 'statusEndpoint')}
                          className="shrink-0"
                        >
                          {copiedStates.statusEndpoint ? (
                            <>
                              <Check className="h-4 w-4 mr-2" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" /> Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Path Parameters</h3>
                      <ul className="space-y-1 text-xs md:text-sm">
                        <li><strong>job_id</strong> (required) - Job UUID returned from submission</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Example Request</h3>
                      <Tabs defaultValue="bash" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-2">
                          <TabsTrigger value="bash" className="text-xs md:text-sm">Linux/macOS</TabsTrigger>
                          <TabsTrigger value="cmd" className="text-xs md:text-sm">Windows CMD</TabsTrigger>
                          <TabsTrigger value="powershell" className="text-xs md:text-sm">PowerShell</TabsTrigger>
                        </TabsList>
                        <TabsContent value="bash">
                          <CodeBlock 
                            code={apiExamples.statusRequest.bash}
                            copyKey="statusRequestBash"
                          />
                        </TabsContent>
                        <TabsContent value="cmd">
                          <CodeBlock 
                            code={apiExamples.statusRequest.cmd}
                            copyKey="statusRequestCmd"
                          />
                        </TabsContent>
                        <TabsContent value="powershell">
                          <CodeBlock 
                            code={apiExamples.statusRequest.powershell}
                            copyKey="statusRequestPowershell"
                          />
                        </TabsContent>
                      </Tabs>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Response Examples</h3>
                      
                      <div className="mb-4">
                        <p className="text-xs md:text-sm font-medium mb-1">Job Running:</p>
                        <CodeBlock 
                          code={apiExamples.statusResponseRunning}
                          copyKey="statusResponseRunning"
                          className="text-xs"
                        />
                      </div>

                      <div>
                        <p className="text-xs md:text-sm font-medium mb-1">Job Completed:</p>
                        <CodeBlock 
                          code={apiExamples.statusResponseComplete}
                          copyKey="statusResponseComplete"
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Download Results */}
              <Card className="p-4 md:p-6">
                <div className="text-center">
                  <Download className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 mx-auto" />
                  <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">3. Download Job Results</h2>
                  <p className="text-muted-foreground mb-4 md:mb-6 text-sm md:text-base">
                    Download prediction results as a ZIP file containing CSV files
                  </p>
                  
                  <div className="space-y-4 max-w-2xl mx-auto text-left">
                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Endpoints</h3>
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <div className="flex-1 bg-muted px-3 py-2 rounded text-sm overflow-x-auto">
                            <code className="whitespace-nowrap">GET /predict/job/&#123;job_id&#125;/?download=output</code>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCopy('GET /predict/job/{job_id}/?download=output', 'downloadEndpoint1')}
                            className="shrink-0"
                          >
                            {copiedStates.downloadEndpoint1 ? (
                              <>
                                <Check className="h-4 w-4 mr-2" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" /> Copy
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <div className="flex-1 bg-muted px-3 py-2 rounded text-sm overflow-x-auto">
                            <code className="whitespace-nowrap">GET /predict/download/&#123;job_id&#125;/</code>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCopy('GET /predict/download/{job_id}/', 'downloadEndpoint2')}
                            className="shrink-0"
                          >
                            {copiedStates.downloadEndpoint2 ? (
                              <>
                                <Check className="h-4 w-4 mr-2" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" /> Copy
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Example Request</h3>
                      <Tabs defaultValue="bash" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-2">
                          <TabsTrigger value="bash" className="text-xs md:text-sm">Linux/macOS</TabsTrigger>
                          <TabsTrigger value="cmd" className="text-xs md:text-sm">Windows CMD</TabsTrigger>
                          <TabsTrigger value="powershell" className="text-xs md:text-sm">PowerShell</TabsTrigger>
                        </TabsList>
                        <TabsContent value="bash">
                          <CodeBlock 
                            code={apiExamples.downloadRequest.bash}
                            copyKey="downloadRequestBash"
                          />
                        </TabsContent>
                        <TabsContent value="cmd">
                          <CodeBlock 
                            code={apiExamples.downloadRequest.cmd}
                            copyKey="downloadRequestCmd"
                          />
                        </TabsContent>
                        <TabsContent value="powershell">
                          <CodeBlock 
                            code={apiExamples.downloadRequest.powershell}
                            copyKey="downloadRequestPowershell"
                          />
                        </TabsContent>
                      </Tabs>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Response</h3>
                      <ul className="space-y-1 text-xs md:text-sm">
                        <li><strong>Content-Type:</strong> application/zip</li>
                        <li><strong>Content-Disposition:</strong> attachment; filename=&#123;job_id&#125;_output.zip</li>
                        <li><strong>Body:</strong> Binary ZIP file containing all output CSV files</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">ZIP Contents (CSV Files Only)</h3>
                      <ul className="space-y-1 text-xs md:text-sm list-disc list-inside">
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
              <Card className="p-4 md:p-6">
                <div className="text-center">
                  <Code className="h-8 w-8 md:h-10 md:w-10 text-accent mb-3 md:mb-4 mx-auto" />
                  <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Error Handling</h2>
                  
                  <div className="space-y-4 max-w-2xl mx-auto text-left">
                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Error Response Format</h3>
                      <CodeBlock 
                        code={apiExamples.errorFormat}
                        copyKey="errorFormat"
                        className="text-xs"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-sm md:text-base">Common Errors</h3>
                      <div className="space-y-3">
                        {[
                          { title: '400 - Invalid SMILES', code: '{"error": "SMILES contains whitespace or invalid characters."}' },
                          { title: '400 - Invalid Receptor Sequence', code: '{"error": "Receptor sequence contains invalid characters. Only standard amino acids (ACDEFGHIKLMNPQRSTVWY) allowed."}' },
                          { title: '400 - Sequence Too Long', code: '{"error": "Receptor sequence exceeds maximum length of 1023 amino acids."}' },
                          { title: '400 - SMILES Too Long', code: '{"error": "SMILES string exceeds maximum length of 511 characters."}' },
                          { title: '400 - FASTA Header Detected', code: '{"error": "FASTA headers (&gt;) are not accepted. Please provide only the protein sequence."}' },
                          { title: '404 - Job Not Found', code: '{"error": "Job not found"}' },
                          { title: '404 - Output Not Found', code: '{"error": "Output files not found for the specified job"}' },
                        ].map((error, index) => (
                          <div key={index}>
                            <p className="text-xs md:text-sm font-medium mb-1">{error.title}</p>
                            <div className="bg-muted p-2 rounded text-xs overflow-x-auto font-mono">
                              {error.code}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Usage Notes */}
              <Card className="p-4 md:p-6">
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Important Notes</h3>
                  <div className="text-muted-foreground space-y-3 max-w-2xl mx-auto text-left text-xs md:text-sm">
                    <p><strong>Rate Limiting:</strong> As we use a shared academic server to host the model, we currently limit our web service to one ligand-receptor pair interaction prediction per request to ensure fair usage and server stability.</p>
                    <p><strong>Job Processing:</strong> Predictions are processed asynchronously - use the job status endpoint to monitor progress</p>
                    <p><strong>File Downloads:</strong> Results are available as ZIP files containing CSV files only (no JSON or image files)</p>
                    <p><strong>Output Format:</strong> All CSV files use comma as delimiter and include headers. Predictions include columns for ligand ID, receptor ID, predicted binding affinity, and confidence scores.</p>
                    <p><strong>Prediction Results:</strong> When a job is completed, the API returns detailed predictions including ID, SMILES, receptor sequence, predicted label (Agonist (1) or Non-Agonist (0)), and confidence score (P1).</p>
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