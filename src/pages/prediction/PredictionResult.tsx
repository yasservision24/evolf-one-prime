import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Download, Clock, CheckCircle, AlertCircle, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { getPredictionJobStatus, downloadPredictionResults } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface PredictionRow {
  id: string;
  smiles: string;
  mutated_sequence: string;
  predicted_label: string;
  p1: string;
}

type JobStatus = 'running' | 'completed' | 'expired';

const INITIAL_POLL_INTERVAL = 40000;
const MAX_POLL_INTERVAL = 900000;
const BACKOFF_MULTIPLIER = 1.5;

const PredictionResult = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job-id') || searchParams.get('jobId');

  const [status, setStatus] = useState<JobStatus>('running');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [jobData, setJobData] = useState<any>(null);
  const [predictions, setPredictions] = useState<PredictionRow[]>([]);
  const [urlCopied, setUrlCopied] = useState(false);
  const [pollHandle, setPollHandle] = useState<number | null>(null);
  const [currentPollInterval, setCurrentPollInterval] = useState(INITIAL_POLL_INTERVAL);
  const [expandedSequences, setExpandedSequences] = useState<Set<string>>(new Set());
  const [expandedSmiles, setExpandedSmiles] = useState<Set<string>>(new Set());

  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  const calculateNextInterval = (currentInterval: number): number => {
    const nextInterval = Math.floor(currentInterval * BACKOFF_MULTIPLIER);
    return Math.min(nextInterval, MAX_POLL_INTERVAL);
  };

  const scheduleNextPoll = (currentInterval: number) => {
    if (pollHandle) {
      clearTimeout(pollHandle);
    }

    const nextInterval = calculateNextInterval(currentInterval);
    const h = window.setTimeout(() => {
      fetchJobStatus();
    }, nextInterval);

    setPollHandle(h);
    setCurrentPollInterval(nextInterval);
  };

  const fetchJobStatus = async () => {
    if (!jobId) return;
    try {
      const data = await getPredictionJobStatus(jobId);
      setJobData(data);
      
      if (data.predictions && Array.isArray(data.predictions)) {
        setPredictions(data.predictions);
      }

      const s = (data.status || 'running') as JobStatus | string;
      if (s === 'completed' || s === 'running' || s === 'expired') {
        setStatus(s as JobStatus);
      } else if (s === 'finished') {
        setStatus('completed');
      } else {
        setStatus('running');
      }

      setLoading(false);

      if (status === 'running') {
        scheduleNextPoll(currentPollInterval);
      } else if (status === 'completed' || status === 'expired') {
        if (pollHandle) {
          clearTimeout(pollHandle);
          setPollHandle(null);
        }
      }
    } catch (err: any) {
      if (err && err.code === 404) {
        setStatus('expired');
        setLoading(false);
        setJobData(null);
        if (pollHandle) {
          clearTimeout(pollHandle);
          setPollHandle(null);
        }
        return;
      }

      toast({
        title: 'Error',
        description: err?.message || 'Failed to fetch job status',
        variant: 'destructive'
      });
      setLoading(false);
      
      if (status === 'running') {
        scheduleNextPoll(currentPollInterval);
      }
    }
  };

  useEffect(() => {
    if (!jobId) {
      toast({
        title: 'Invalid URL',
        description: 'No job ID provided',
        variant: 'destructive'
      });
      navigate('/prediction');
      return;
    }

    fetchJobStatus();

    return () => {
      if (pollHandle) clearTimeout(pollHandle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const handleDownload = async () => {
    if (!jobId) return;

    setDownloading(true);
    try {
      const blob = await downloadPredictionResults(jobId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prediction_${jobId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Download started',
        description: 'Your prediction results are downloading'
      });
    } catch (error: any) {
      if (error && error.code === 404) {
        toast({
          title: 'Download failed',
          description: 'Results not found or have expired',
          variant: 'destructive'
        });
        setStatus('expired');
      } else {
        toast({
          title: 'Download failed',
          description: error.message || 'Failed to download results',
          variant: 'destructive'
        });
      }
    } finally {
      setDownloading(false);
    }
  };

  const copyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setUrlCopied(true);
    toast({
      title: 'URL copied',
      description: 'Prediction URL copied to clipboard'
    });
    setTimeout(() => setUrlCopied(false), 2000);
  };

  const toggleSequenceExpansion = (id: string) => {
    const newSet = new Set(expandedSequences);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedSequences(newSet);
  };

  const toggleSmilesExpansion = (id: string) => {
    const newSet = new Set(expandedSmiles);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedSmiles(newSet);
  };

  const formatSequenceForDisplay = (sequence: string, id: string, maxChars: number = 80) => {
    if (!sequence) return 'N/A';
    
    const isExpanded = expandedSequences.has(id);
    const displaySequence = isExpanded ? sequence : sequence.length > maxChars ? sequence.substring(0, maxChars) + '...' : sequence;
    
    return (
      <div className="font-mono text-xs">
        <div className="whitespace-pre-wrap break-all">
          {displaySequence}
        </div>
        {sequence.length > maxChars && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 mt-1 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              toggleSequenceExpansion(id);
            }}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" /> Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" /> Show More ({sequence.length} aa)
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  const formatSmilesForDisplay = (smiles: string, id: string, maxChars: number = 60) => {
    if (!smiles) return 'N/A';
    
    const isExpanded = expandedSmiles.has(id);
    const displaySmiles = isExpanded ? smiles : smiles.length > maxChars ? smiles.substring(0, maxChars) + '...' : smiles;
    
    return (
      <div className="font-mono text-xs">
        <div className="whitespace-pre-wrap break-all">
          {displaySmiles}
        </div>
        {smiles.length > maxChars && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 mt-1 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              toggleSmilesExpansion(id);
            }}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" /> Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" /> Show More ({smiles.length} chars)
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  const formatSmilesForMobile = (smiles: string, id: string, maxChars: number = 40) => {
    if (!smiles) return 'N/A';
    
    const isExpanded = expandedSmiles.has(id);
    const displaySmiles = isExpanded ? smiles : smiles.length > maxChars ? smiles.substring(0, maxChars) + '...' : smiles;
    
    return (
      <div className="font-mono text-xs">
        <div className="whitespace-pre-wrap break-all">
          {displaySmiles}
        </div>
        {smiles.length > maxChars && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 mt-1 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              toggleSmilesExpansion(id);
            }}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" /> Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" /> Show More
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'expired':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'running':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Ready</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">Expired</Badge>;
    }
  };

  const formatScore = (p1: string) => {
    if (!p1 || p1.trim() === '') return 'N/A';
    const score = parseFloat(p1);
    return isNaN(score) ? 'N/A' : score.toFixed(4);
  };

  const getBindingStatusBadge = (label: string) => {
    if (label === 'Agonist (1)') {
      return <Badge variant="default" className="bg-green-500/20 text-green-600 border-green-500/30">Agonist</Badge>;
    } else if (label === 'Non-Agonist (0)') {
      return <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20">Non-Agonist</Badge>;
    } else {
      return <Badge variant="secondary">{label}</Badge>;
    }
  };

  return (
    <>
      <Header currentPage="model" onNavigate={handleNavigate} />
      <div className="min-h-screen bg-gradient-to-b from-secondary to-background py-6 md:py-12">
        <div className="container mx-auto px-3 md:px-4 max-w-6xl">

          {/* Header - Mobile Optimized */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl text-foreground mb-3 md:mb-4">Prediction Results</h1>
            <div className="inline-flex flex-wrap items-center justify-center gap-2 max-w-full">
              <p className="text-sm md:text-xl text-muted-foreground">Job ID:</p>
              <code className="text-xs md:text-sm bg-muted px-2 py-1 rounded break-all max-w-full">
                {jobId}
              </code>
            </div>
          </div>

          {/* Copy URL Button */}
          <div className="mb-4 md:mb-6 text-center">
            <Button variant="outline" onClick={copyUrl} className="gap-2 w-full md:w-auto">
              {urlCopied ? (
                <>
                  <Check className="h-4 w-4" /> URL Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy Result URL
                </>
              )}
            </Button>
          </div>

          {/* Status Card */}
          <Card className="p-4 md:p-8 mb-6">
            {loading ? (
              <div className="flex items-center justify-center py-8 md:py-12">
                <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon()}
                    <div>
                      <h2 className="text-lg md:text-2xl font-semibold">Prediction Status</h2>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">
                        {status === 'running' && 'Your prediction is being processed'}
                        {status === 'completed' && 'Your prediction results are ready'}
                        {status === 'expired' && 'This prediction has expired'}
                      </p>
                    </div>
                  </div>
                  <div className="md:self-start">
                    {getStatusBadge()}
                  </div>
                </div>

                {/* Running */}
                {status === 'running' && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Results will be available when processing is complete. This page will update automatically.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Completed */}
                {status === 'completed' && (
                  <div className="space-y-4 md:space-y-6">
                    <Alert className="bg-green-500/10 border-green-500/20">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-600 text-sm">
                        Your prediction has completed successfully!
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <Button 
                        onClick={handleDownload} 
                        disabled={downloading}
                        size="lg"
                        className="w-full"
                      >
                        {downloading ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="h-5 w-5 mr-2" /> Download Full Results (ZIP)
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/prediction')}
                        size="lg"
                        className="w-full"
                      >
                        Submit New Prediction
                      </Button>
                    </div>

                    {/* Predictions Table - Mobile Optimized */}
                    {predictions.length > 0 && (
                      <div className="mt-4 md:mt-6">
                        <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Binding Interaction Predictions</h3>
                        <div className="rounded-lg border">
                          <ScrollArea className="h-[400px] md:h-[500px]">
                            <div className="hidden md:block">
                              {/* Desktop Table */}
                              <Table>
                                <TableHeader className="sticky top-0 bg-background">
                                  <TableRow>
                                    <TableHead className="w-16">ID</TableHead>
                                    <TableHead className="min-w-[200px] max-w-[250px]">Ligand (SMILES)</TableHead>
                                    <TableHead className="min-w-[250px] max-w-[350px]">Receptor Sequence</TableHead>
                                    <TableHead className="w-32">Score</TableHead>
                                    <TableHead className="w-40">Binding Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {predictions.map((row) => (
                                    <TableRow key={row.id} className="hover:bg-muted/50">
                                      <TableCell className="font-mono font-medium">{row.id}</TableCell>
                                      <TableCell className="p-3">
                                        {formatSmilesForDisplay(row.smiles, row.id)}
                                      </TableCell>
                                      <TableCell className="p-3">
                                        {formatSequenceForDisplay(row.mutated_sequence, row.id)}
                                      </TableCell>
                                      <TableCell className="font-mono font-medium">
                                        <div className="flex flex-col">
                                          <span className={
                                            parseFloat(row.p1 || '0') > 0.7 ? 'text-green-600' : 
                                            parseFloat(row.p1 || '0') > 0.4 ? 'text-yellow-600' : 
                                            'text-red-600'
                                          }>
                                            {formatScore(row.p1)}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            P1 score
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        {getBindingStatusBadge(row.predicted_label)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden p-2 space-y-3">
                              {predictions.map((row) => (
                                <Card key={row.id} className="p-3">
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="font-medium">ID:</div>
                                    <div className="font-mono">{row.id}</div>
                                    
                                    <div className="font-medium">Ligand:</div>
                                    <div>{formatSmilesForMobile(row.smiles, row.id)}</div>
                                    
                                    <div className="font-medium">Sequence:</div>
                                    <div>{formatSequenceForDisplay(row.mutated_sequence, row.id, 40)}</div>
                                    
                                    <div className="font-medium">Score:</div>
                                    <div className="font-mono font-medium">
                                      <span className={
                                        parseFloat(row.p1 || '0') > 0.7 ? 'text-green-600' : 
                                        parseFloat(row.p1 || '0') > 0.4 ? 'text-yellow-600' : 
                                        'text-red-600'
                                      }>
                                        {formatScore(row.p1)}
                                      </span>
                                    </div>
                                    
                                    <div className="font-medium">Status:</div>
                                    <div>{getBindingStatusBadge(row.predicted_label)}</div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                        
                      </div>
                    )}

                    {jobData?.output_files && (
                      <div className="mt-4 md:mt-6 p-3 md:p-4 bg-muted rounded-lg">
                        <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Files included in download</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {jobData.output_files.map((f: string) => (
                            <div key={f} className="flex items-center justify-between p-2 bg-background rounded text-xs md:text-sm">
                              <code className="truncate">{f}</code>
                              <Badge variant="outline" className="ml-2 shrink-0 text-xs">CSV</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Expired */}
                {status === 'expired' && (
                  <div className="space-y-4">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        This prediction job has expired or was not found.
                      </AlertDescription>
                    </Alert>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/prediction')}
                      className="w-full"
                      size="lg"
                    >
                      Submit New Prediction
                    </Button>
                  </div>
                )}

                {/* Expiry Notice */}
                {(status === 'running' || status === 'completed') && jobData?.expiresAt && (
                  <div className="pt-3 md:pt-4 border-t">
                    <p className="text-xs md:text-sm text-muted-foreground text-center">
                      <Clock className="h-3 w-3 md:h-4 md:w-4 inline mr-1" />
                      Available until {new Date(jobData.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default PredictionResult;