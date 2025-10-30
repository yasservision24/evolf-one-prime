import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dataset = () => {
  const navigate = useNavigate();

  const handleNavigate = (page: 'home' | 'dataset' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'dataset') navigate('/dataset');
    else if (page === 'model') navigate('/prediction');
  };

  return (
    <>
      <Header currentPage="dataset" onNavigate={handleNavigate} showSearch={true} />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Dataset Explorer</h1>
          <p className="text-muted-foreground mb-4">Dataset page coming soon...</p>
          <Button onClick={() => navigate('/')} className="hover:bg-accent hover:text-accent-foreground transition-colors">
            Back to Home
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dataset;
