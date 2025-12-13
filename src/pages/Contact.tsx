import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Mail, Users, MessageSquare, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="other" onNavigate={handleNavigate} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Centered Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get in touch with the EvOlf team
            </p>
          </div>

          {/* Centered Content */}
          <div className="flex justify-center">
            <div className="max-w-4xl w-full">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 text-center">
                  <Mail className="h-12 w-12 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">General Inquiries</h3>
                  <p className="text-muted-foreground mb-4">
                    For general questions about EvOlf
                  </p>
                </Card>

                <Card className="p-6 text-center">
                  <Users className="h-12 w-12 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Research Collaborations</h3>
                  <p className="text-muted-foreground mb-4">
                    Interested in research partnerships
                  </p>
                </Card>

                <Card className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Technical Support</h3>
                  <p className="text-muted-foreground mb-4">
                    API and integration assistance
                  </p>
                </Card>
              </div>

              {/* Single Email Section */}
              <Card className="p-8 mt-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-semibold mb-4">Contact Email</h3>
                  <p className="text-muted-foreground mb-6">
                    For all inquiries related to EvOlf, please contact:
                  </p>
                  <a 
                    href="mailto:gaurav.ahuja@iiitd.ac.in" 
                    className="text-accent hover:underline font-medium text-xl"
                  >
                    gaurav.ahuja@iiitd.ac.in
                  </a>
                </div>
              </Card>

              {/* Ahuja Lab Link */}
              <div className="mt-8 text-center">
                <a 
                  href="https://www.ahuja-lab.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
                >
                  <span>Maintained by The Ahuja Lab</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto">
                  We welcome questions, feedback, and collaboration opportunities related to GPCR research 
                  and computational biology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;