import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Mail, Users, MessageSquare } from 'lucide-react';
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
                  <a 
                    href="mailto:gaurav.ahuja@iiitd.ac.in" 
                    className="text-accent hover:underline font-medium"
                  >
                    gaurav.ahuja@iiitd.ac.in
                  </a>
                </Card>

                <Card className="p-6 text-center">
                  <Users className="h-12 w-12 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Research Collaborations</h3>
                  <p className="text-muted-foreground mb-4">
                    Interested in research partnerships
                  </p>
                  <a 
                    href="mailto:gaurav.ahuja@iiitd.ac.in" 
                    className="text-accent hover:underline font-medium"
                  >
                    gaurav.ahuja@iiitd.ac.in
                  </a>
                </Card>

                <Card className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Technical Support</h3>
                  <p className="text-muted-foreground mb-4">
                    API and integration assistance
                  </p>
                  <a 
                    href="mailto:gaurav.ahuja@iiitd.ac.in" 
                    className="text-accent hover:underline font-medium"
                  >
                    gaurav.ahuja@iiitd.ac.in
                  </a>
                </Card>
              </div>

              {/* Additional Information */}
              <Card className="p-6 mt-8 text-center">
                <h3 className="text-xl font-semibold mb-4">The Ahuja Lab</h3>
                <div className="text-muted-foreground space-y-2 max-w-2xl mx-auto">
                  <p>
                    Maintained by The Ahuja Lab at Indraprastha Institute of Information Technology Delhi
                  </p>
                  <p className="text-sm">
                    We welcome questions, feedback, and collaboration opportunities related to GPCR research 
                    and computational biology.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;