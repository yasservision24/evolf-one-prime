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
      <Header currentPage="dataset" onNavigate={handleNavigate} />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Dataset Explorer</h1>
          <p className="text-muted-foreground mb-6">Explore our comprehensive GPCR database</p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/dataset/dashboard')} 
              className="bg-[hsl(var(--brand-teal))] text-foreground hover:bg-[hsl(var(--brand-teal))]/90"
            >
              View Database Dashboard
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="border-[hsl(var(--brand-teal))]/50 hover:bg-[hsl(var(--brand-teal))]/10"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dataset;
