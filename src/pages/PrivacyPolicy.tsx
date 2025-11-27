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
          <p className="text-muted-foreground text-sm mb-8">Last updated: January 2025</p>

          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-2">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Name and email address when you create an account</li>
                <li>Data you submit through our platform</li>
                <li>Communications with our support team</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-2">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your requests and transactions</li>
                <li>Send you technical notices and updates</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns to improve user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Data Sharing</h2>
              <p className="text-muted-foreground">
                We do not sell or share your personal information with third parties except as described 
                in this policy. We may share information with service providers who perform services on 
                our behalf, subject to confidentiality obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. However, 
                no internet transmission is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Cookies and Tracking</h2>
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to collect information about your browsing 
                activities. You can control cookies through your browser settings, though some features may 
                not function properly if cookies are disabled.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
              <p className="text-muted-foreground mb-2">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our services are not directed to individuals under 18. We do not knowingly collect personal 
                information from children. If you become aware that a child has provided us with personal 
                information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Changes to Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of any changes by 
                posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy, please contact us at privacy@evolf.com.
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
