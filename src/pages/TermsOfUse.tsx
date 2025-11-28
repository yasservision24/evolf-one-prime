import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const TermsOfUse = () => {
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
          <h1 className="text-4xl font-bold mb-4">Terms of Use</h1>
          <p className="text-muted-foreground text-sm mb-8">Last updated: November 2025</p>

          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using EvOlf, you accept and agree to be bound by these terms of use. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Resource Usage Limitations</h2>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 my-4">
                <h3 className="font-semibold text-yellow-400 mb-2">Important: Responsible Usage</h3>
                <p className="text-muted-foreground text-sm">
                  Users are expected to be respectful of resource constraints when using the EvOlf web 
                  interface and APIs. Do not send continuous calls or automated requests to the EvOlf 
                  server for predictions.
                </p>
              </div>
              <p className="text-muted-foreground">
                The EvOlf service operates on shared academic infrastructure with limited computational 
                resources. Excessive or abusive usage that impacts service availability for other users 
                may result in temporary or permanent access restrictions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Fair Use Policy</h2>
              <p className="text-muted-foreground mb-2">
                To ensure fair access for all users:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Do not attempt to overwhelm the service with high-frequency requests</li>
                <li>Allow reasonable intervals between prediction requests</li>
                
                <li>Consider running EvOlf locally for high-volume or production usage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Service Limitations</h2>
              <p className="text-muted-foreground">
                The EvOlf web service is provided for research and academic use. We do not guarantee 
                uninterrupted service availability and reserve the right to limit usage or implement 
                rate limiting as necessary to maintain service stability for all users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Contact</h2>
              <p className="text-muted-foreground">
                If you have questions about appropriate usage or need higher volume access, please contact us at {" "}
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

export default TermsOfUse;