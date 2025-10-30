import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquare, Users } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="home" onNavigate={() => {}} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Get in touch with the evolf team
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
            <div className="space-y-6">
              <Card className="p-6">
                <Mail className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground">
                  For general inquiries and support
                </p>
                <a href="mailto:contact@evolf.com" className="text-accent hover:underline">
                  contact@evolf.com
                </a>
              </Card>

              <Card className="p-6">
                <Users className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Collaborations</h3>
                <p className="text-muted-foreground">
                  Interested in research partnerships
                </p>
                <a href="mailto:partnerships@evolf.com" className="text-accent hover:underline">
                  partnerships@evolf.com
                </a>
              </Card>

              <Card className="p-6">
                <MessageSquare className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Technical Support</h3>
                <p className="text-muted-foreground">
                  API and integration assistance
                </p>
                <a href="mailto:support@evolf.com" className="text-accent hover:underline">
                  support@evolf.com
                </a>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name</label>
                  <Input placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="your.email@example.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="What is this regarding?" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea 
                    placeholder="Tell us more about your inquiry..." 
                    rows={6}
                  />
                </div>
                <Button className="w-full bg-accent hover:bg-accent/80">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
