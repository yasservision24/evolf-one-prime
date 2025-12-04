import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, Clock, CheckCircle, AlertCircle, Copy, Check } from 'lucide-react';
import { getPredictionJobStatus, downloadPredictionResults } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

type JobStatus = 'running' | 'completed' | 'expired';

const INITIAL_POLL_INTERVAL = 40000; // Start with 40seconds
const MAX_POLL_INTERVAL = 900000;    // Max 15 minutes
const BACKOFF_MULTIPLIER = 1.5;      // Increase by 1.5x each time

const PredictionResult = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job-id') || searchParams.get('jobId');

  const [status, setStatus] = useState<JobStatus>('running');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [jobData, setJobData] = useState<any>(null);
  const [urlCopied, setUrlCopied] = useState(false);
  const [pollHandle, setPollHandle] = useState<number | null>(null);
  const [currentPollInterval, setCurrentPollInterval] = useState(INITIAL_POLL_INTERVAL);

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

      const s = (data.status || 'running') as JobStatus | string;
      if (s === 'completed' || s === 'running' || s === 'expired') {
        setStatus(s as JobStatus);
      } else if (s === 'finished') {
        setStatus('completed');
      } else {
        setStatus('running');
      }

      setLoading(false);

      // Schedule next poll only if still running
      if (status === 'running') {
        scheduleNextPoll(currentPollInterval);
      } else if (status === 'completed' || status === 'expired') {
        // Stop polling when job is done
        if (pollHandle) {
          clearTimeout(pollHandle);
          setPollHandle(null);
        }
      }
    } catch (err: any) {
      // 404 → expired
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
      
      // Continue polling even on error (unless expired)
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

  return (
    <>
      <Header currentPage="model" onNavigate={handleNavigate} />
      <div className="min-h-screen bg-gradient-to-b from-secondary to-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl text-foreground mb-4">Prediction Results</h1>
            <p className="text-xl text-muted-foreground">
              Job ID: <code className="text-sm bg-muted px-2 py-1 rounded">{jobId}</code>
            </p>
          </div>

          {/* Copy URL Button */}
          <div className="mb-6 text-center">
            <Button variant="outline" onClick={copyUrl} className="gap-2">
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
          <Card className="p-8 mb-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-6">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon()}
                    <div>
                      <h2 className="text-2xl font-semibold">Prediction Status</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {status === 'running' && 'Your prediction is being processed'}
                        {status === 'completed' && 'Your prediction results are ready'}
                        {status === 'expired' && 'This prediction has expired'}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge()}
                </div>

                {/* Running */}
                {status === 'running' && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Results will be available when processing is complete. This page will update automatically.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Completed */}
                {status === 'completed' && (
                  <div className="space-y-4">
                    <Alert className="bg-green-500/10 border-green-500/20">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-600">
                        Your prediction has completed successfully!
                      </AlertDescription>
                    </Alert>

                    <Button 
                      onClick={handleDownload} 
                      disabled={downloading}
                      className="w-full"
                      size="lg"
                    >
                      {downloading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-5 w-5 mr-2" /> Download Results (ZIP)
                        </>
                      )}
                    </Button>

                    {jobData?.output_files && (
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h3 className="font-semibold mb-3">Output files</h3>
                        <ul className="text-sm space-y-1">
                          {jobData.output_files.map((f: string) => (
                            <li key={f} className="flex justify-between">
                              <span className="truncate max-w-lg">{f}</span>
                              <span className="text-muted-foreground text-xs">file</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Expired */}
                {status === 'expired' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This prediction job has expired or was not found.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Expiry Notice */}
                {(status === 'running' || status === 'completed') && jobData?.expiresAt && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground text-center">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Available until {new Date(jobData.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Actions - Only show for running or expired status */}
          <div className="text-center space-y-4">
            {status === 'running' && (
              <Button variant="outline" onClick={() => navigate('/prediction')}>
                Submit New Prediction
              </Button>
            )}
            {status === 'expired' && (
              <Button variant="outline" onClick={() => navigate('/prediction')}>
                Submit New Prediction
              </Button>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default PredictionResult;