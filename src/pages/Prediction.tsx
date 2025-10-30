import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Prediction = () => {
  const navigate = useNavigate();

  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  return (
    <>
      <Header currentPage="model" onNavigate={handleNavigate} />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl mb-4">Prediction Model</h1>
          <p className="text-muted-foreground mb-4">Model page coming soon...</p>
          <Button onClick={() => navigate('/')} className="hover:bg-accent hover:text-accent-foreground transition-colors">
            Back to Home
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Prediction;
