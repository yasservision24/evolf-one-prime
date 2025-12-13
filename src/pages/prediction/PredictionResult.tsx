import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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

  const formatSequenceForDisplay = (sequence: string, id: string, maxChars: number = 40) => {
    if (!sequence) return <span className="text-muted-foreground text-xs">N/A</span>;
    
    const isExpanded = expandedSequences.has(id);
    const displaySequence = isExpanded ? sequence : sequence.length > maxChars ? sequence.substring(0, maxChars) + '...' : sequence;
    
    return (
      <div className="font-mono text-xs">
        <div className="whitespace-pre-wrap break-all bg-muted/10 p-1.5 rounded">
          {displaySequence}
        </div>
        {sequence.length > maxChars && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-1.5 mt-0.5 text-[10px] hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              toggleSequenceExpansion(id);
            }}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-2.5 w-2.5 mr-0.5" /> Less
              </>
            ) : (
              <>
                <ChevronDown className="h-2.5 w-2.5 mr-0.5" /> More
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  const formatSmilesForDisplay = (smiles: string, id: string, maxChars: number = 25) => {
    if (!smiles) return <span className="text-muted-foreground text-xs">N/A</span>;
    
    const isExpanded = expandedSmiles.has(id);
    const displaySmiles = isExpanded ? smiles : smiles.length > maxChars ? smiles.substring(0, maxChars) + '...' : smiles;
    
    return (
      <div className="font-mono text-xs">
        <div className="whitespace-pre-wrap break-all bg-muted/10 p-1.5 rounded">
          {displaySmiles}
        </div>
        {smiles.length > maxChars && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-1.5 mt-0.5 text-[10px] hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              toggleSmilesExpansion(id);
            }}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-2.5 w-2.5 mr-0.5" /> Less
              </>
            ) : (
              <>
                <ChevronDown className="h-2.5 w-2.5 mr-0.5" /> More
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
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'running':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px] py-0.5 px-1.5">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] py-0.5 px-1.5">Ready</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 text-[10px] py-0.5 px-1.5">Expired</Badge>;
    }
  };

  const formatScore = (p1: string) => {
    if (!p1 || p1.trim() === '') return <span className="text-muted-foreground text-xs">N/A</span>;
    const score = parseFloat(p1);
    return isNaN(score) ? <span className="text-muted-foreground text-xs">N/A</span> : score.toFixed(4);
  };

  const getBindingStatusBadge = (label: string) => {
    if (label === 'Agonist (1)') {
      return <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs py-0.5 px-2">Agonist ( 1 )</Badge>;
    } else if (label === 'Non-Agonist (0)') {
      return <Badge className="bg-gray-500/20 text-gray-600 border-gray-500/30 text-xs py-0.5 px-2">Non-Agonist ( 0 )</Badge>;
    } else {
      return <Badge variant="outline" className="text-xs py-0.5 px-2">{label}</Badge>;
    }
  };

  const getScoreColor = (p1: string) => {
    const score = parseFloat(p1 || '0');
    if (score > 0.7) return 'bg-green-500/10 text-green-700';
    if (score > 0.4) return 'bg-yellow-500/10 text-yellow-700';
    return 'bg-red-500/10 text-red-700';
  };

  return (
    <>
      <Header currentPage="model" onNavigate={handleNavigate} />
      <div className="min-h-screen bg-gradient-to-b from-secondary to-background py-4 md:py-6">
        <div className="container mx-auto px-3 md:px-6 max-w-7xl">

          {/* Header */}
          <div className="text-center mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2">Prediction Results</h1>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">Job ID:</span>
              <code className="text-xs bg-muted/50 px-3 py-1 rounded-md border font-medium">
                {jobId}
              </code>
            </div>
          </div>

          {/* Copy URL Button */}
          <div className="mb-4 text-center">
            <Button 
              variant="outline" 
              onClick={copyUrl} 
              size="sm"
              className="gap-2 h-8 text-xs"
            >
              {urlCopied ? (
                <>
                  <Check className="h-3.5 w-3.5" /> URL Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy Results URL
                </>
              )}
            </Button>
          </div>

          {/* Main Card */}
          <Card className="p-4 md:p-6 mb-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                <span className="text-sm">Loading results...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon()}
                    <div>
                      <h2 className="text-lg font-semibold">Prediction Status</h2>
                      <p className="text-sm text-muted-foreground">
                        {status === 'running' && 'Your job is being processed'}
                        {status === 'completed' && 'Results are ready for download'}
                        {status === 'expired' && 'This job has expired'}
                      </p>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge()}
                  </div>
                </div>

                {/* Running Status */}
                {status === 'running' && (
                  <Alert className="border-blue-500/20 bg-blue-500/5">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="text-sm">
                      Your prediction is being processed. This page will refresh automatically when complete.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Completed Status */}
                {status === 'completed' && (
                  <div className="space-y-4">
                    <Alert className="border-green-500/20 bg-green-500/5">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-sm">
                        Your prediction has completed successfully!
                      </AlertDescription>
                    </Alert>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={handleDownload} 
                        disabled={downloading}
                        className="flex-1 h-10"
                      >
                        {downloading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" /> Download Full Results (ZIP)
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/prediction')}
                        className="flex-1 h-10"
                      >
                        Submit New Prediction
                      </Button>
                    </div>

                    {/* Results Table Section */}
                    {predictions.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Binding Interaction Predictions</h3>
                          
                        </div>

                        {/* Desktop Table - Clean and Compact */}
                        <div className="hidden md:block">
                          <div className="border rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-muted/30 border-b">
                                  <tr className="text-xs font-medium text-muted-foreground">
                                    <th className="py-2 px-3 text-left w-12">ID</th>
                                    <th className="py-2 px-3 text-left min-w-[150px]">Ligand (SMILES)</th>
                                    <th className="py-2 px-3 text-left min-w-[200px]">Receptor Sequence</th>
                                    <th className="py-2 px-3 text-left w-24">Score</th>
                                    <th className="py-2 px-3 text-left w-28">Binding Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y">
                                  {predictions.map((row) => (
                                    <tr key={row.id} className="hover:bg-muted/10 transition-colors">
                                      <td className="py-2 px-3">
                                        <div className="font-mono text-xs font-medium">{row.id}</div>
                                      </td>
                                      <td className="py-2 px-3">
                                        {formatSmilesForDisplay(row.smiles, row.id)}
                                      </td>
                                      <td className="py-2 px-3">
                                        {formatSequenceForDisplay(row.mutated_sequence, row.id)}
                                      </td>
                                      <td className="py-2 px-3">
                                        <div className="flex flex-col items-start">
                                          <span className={`font-mono text-sm font-bold ${getScoreColor(row.p1)}`}>
                                            {formatScore(row.p1)}
                                          </span>
                                          <span className="text-[10px] text-muted-foreground">P1 score</span>
                                        </div>
                                      </td>
                                      <td className="py-2 px-3">
                                        {getBindingStatusBadge(row.predicted_label)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-3">
                          {predictions.map((row) => (
                            <Card key={row.id} className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground">ID:</span>
                                    <span className="font-mono text-sm font-medium">{row.id}</span>
                                  </div>
                                  {getBindingStatusBadge(row.predicted_label)}
                                </div>
                                
                                <div>
                                  <div className="text-xs font-medium text-muted-foreground mb-1">Score</div>
                                  <div className={`font-mono text-sm font-bold px-3 py-1 rounded-full ${getScoreColor(row.p1)} inline-block`}>
                                    {formatScore(row.p1)} (P1)
                                  </div>
                                </div>

                                <div>
                                  <div className="text-xs font-medium text-muted-foreground mb-1">Ligand (SMILES)</div>
                                  {formatSmilesForDisplay(row.smiles, row.id, 20)}
                                </div>

                                <div>
                                  <div className="text-xs font-medium text-muted-foreground mb-1">Receptor Sequence</div>
                                  {formatSequenceForDisplay(row.mutated_sequence, row.id, 30)}
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>

                        {/* Legend - Fixed with proper escaping */}
                        
                      </div>
                    )}

                    {/* Files List */}
                    {jobData?.output_files && jobData.output_files.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Files included in download:</h4>
                        <div className="flex flex-wrap gap-2">
                          {jobData.output_files.map((f: string) => (
                            <Badge 
                              key={f} 
                              variant="outline" 
                              className="text-xs"
                            >
                              {f}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Expired Status */}
                {status === 'expired' && (
                  <div className="space-y-4">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This prediction job has expired or was not found.
                      </AlertDescription>
                    </Alert>
                    <Button 
                      onClick={() => navigate('/prediction')}
                      className="w-full h-10"
                    >
                      Submit New Prediction
                    </Button>
                  </div>
                )}

                {/* Expiry Notice */}
                {(status === 'running' || status === 'completed') && jobData?.expiresAt && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Results available until {new Date(jobData.expiresAt).toLocaleDateString()}</span>
                    </div>
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