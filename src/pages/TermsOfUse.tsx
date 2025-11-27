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
          <p className="text-muted-foreground text-sm mb-8">Last updated: January 2025</p>

          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using evolf, you accept and agree to be bound by the terms and provision 
                of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Use License</h2>
              <p className="text-muted-foreground">
                Permission is granted to temporarily access the materials on evolf for personal, 
                non-commercial transitory viewing only. This license shall automatically terminate if you 
                violate any of these restrictions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Data Usage</h2>
              <p className="text-muted-foreground mb-2">
                The evolf database is provided under CC BY 4.0 license. You may:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Use the data for academic and research purposes</li>
                <li>Download and analyze the dataset</li>
                <li>Cite the data in publications</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Commercial use requires a separate license agreement. Contact us for more information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. API Usage</h2>
              <p className="text-muted-foreground">
                API access is subject to rate limits and fair use policies. Excessive usage may result 
                in temporary suspension of access. Commercial API usage requires a paid subscription.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Disclaimer</h2>
              <p className="text-muted-foreground">
                The materials on evolf are provided on an 'as is' basis. We make no warranties, expressed 
                or implied, and hereby disclaim and negate all other warranties including, without limitation, 
                implied warranties or conditions of merchantability, fitness for a particular purpose, or 
                non-infringement of intellectual property.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Limitations</h2>
              <p className="text-muted-foreground">
                In no event shall evolf or its suppliers be liable for any damages (including, without 
                limitation, damages for loss of data or profit, or due to business interruption) arising 
                out of the use or inability to use the materials on evolf.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Modifications</h2>
              <p className="text-muted-foreground">
                We may revise these terms of service at any time without notice. By using this website, 
                you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Contact</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us at legal@evolf.com.
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
