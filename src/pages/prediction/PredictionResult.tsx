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

const PredictionResult = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job-id');
  
  const [status, setStatus] = useState<JobStatus>('running');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [jobData, setJobData] = useState<any>(null);
  const [urlCopied, setUrlCopied] = useState(false);

  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  const fetchJobStatus = async () => {
    if (!jobId) return;
    
    try {
      const data = await getPredictionJobStatus(jobId);
      setJobData(data);
      setStatus(data.status);
      setLoading(false);
      
      // Poll every 5 seconds if still running
      if (data.status === 'running') {
        setTimeout(fetchJobStatus, 5000);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch job status',
        variant: 'destructive'
      });
      setLoading(false);
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
      toast({
        title: 'Download failed',
        description: error.message || 'Failed to download results',
        variant: 'destructive'
      });
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
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Running</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Completed</Badge>;
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
            <Button
              variant="outline"
              onClick={copyUrl}
              className="gap-2"
            >
              {urlCopied ? (
                <>
                  <Check className="h-4 w-4" />
                  URL Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Result URL
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
                      <h2 className="text-2xl font-semibold">Job Status</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {status === 'running' && 'Your prediction is being processed'}
                        {status === 'completed' && 'Your prediction is ready'}
                        {status === 'expired' && 'This job has expired'}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge()}
                </div>

                {/* Running State */}
                {status === 'running' && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Your prediction is being processed. This page will automatically update when results are ready.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Completed State */}
                {status === 'completed' && (
                  <div className="space-y-4">
                    <Alert className="bg-green-500/10 border-green-500/20">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-600">
                        Your prediction has completed successfully! Download the results below.
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
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-5 w-5 mr-2" />
                          Download Results (ZIP)
                        </>
                      )}
                    </Button>

                    {jobData?.results && (
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h3 className="font-semibold mb-3">Prediction Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ligands analyzed:</span>
                            <span className="font-medium">{jobData.results.ligands?.length || 0}</span>
                          </div>
                          {jobData.createdAt && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Submitted:</span>
                              <span className="font-medium">{new Date(jobData.createdAt).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Expired State */}
                {status === 'expired' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This prediction job has expired. Results are only available for 15 days after submission.
                      Please submit a new prediction request.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Expiry Notice */}
                {(status === 'running' || status === 'completed') && jobData?.expiresAt && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground text-center">
                      <Clock className="h-4 w-4 inline mr-1" />
                      This page will be available until {new Date(jobData.expiresAt).toLocaleDateString()}
                      <span className="block mt-1 text-xs">
                        Results are kept for 15 days
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Actions */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/prediction')}
            >
              Submit New Prediction
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PredictionResult;
