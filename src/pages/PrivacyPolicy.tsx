import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="other" onNavigate={handleNavigate} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm mb-8">Last updated: November 2025</p>

          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Data Processing and Storage</h2>
              <p className="text-muted-foreground mb-4">
                Data entered by users through the EvOlf platform will be processed and temporarily 
                stored on our shared academic servers for processing purposes.
              </p>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 my-4">
                <h3 className="font-semibold text-yellow-400 mb-2">Data Retention</h3>
                <p className="text-muted-foreground text-sm">
                  User-submitted data is temporarily stored for <strong>15 days</strong> 
                  (or according to our current scheduler configuration) before automatic deletion. 
                  This allows for processing completion and user access to results.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Recommendation for Sensitive Data</h2>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 my-4">
                <h3 className="font-semibold text-blue-400 mb-2">Important Notice</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  If you are working with sensitive or confidential data, we strongly recommend 
                  running EvOlf locally on your own infrastructure to maintain full data control 
                  and privacy.
                </p>
                <p className="text-muted-foreground text-sm">
                  You can access our open-source pipeline and run it locally:
                  <br />
                  <a 
                    href="https://github.com/evolf/evolf-pipeline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent hover:underline inline-flex items-center gap-1 mt-2"
                  >
                    GitHub Repository: evolf-pipeline
                  </a>
                </p>
              </div>
            </section>

              <section>
              <h2 className="text-2xl font-semibold mb-3">Contact</h2>
              <p className="text-muted-foreground">
                If you have questions about data handling practices, please contact us at{" "}
                <a 
                  href="mailto:gaurav.ahuja@iiitd.ac.in"
                  className="text-accent hover:underline"
                >
                  gaurav.ahuja@iiitd.ac.in
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;