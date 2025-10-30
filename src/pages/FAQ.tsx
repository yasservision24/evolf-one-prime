import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="home" onNavigate={() => {}} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Find answers to common questions about evolf
          </p>

          <div className="max-w-3xl">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is evolf?</AccordionTrigger>
                <AccordionContent>
                  evolf is a comprehensive platform combining a curated database of GPCR receptor-ligand 
                  interactions with a deep learning model for predicting binding affinity. It's designed to 
                  accelerate drug discovery research.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How accurate is the prediction model?</AccordionTrigger>
                <AccordionContent>
                  Our model achieves 95%+ accuracy on validation sets with an R² score of 0.87 and mean 
                  absolute error of 0.52 pKi units. Performance varies depending on the receptor family 
                  and ligand type.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Is the dataset freely available?</AccordionTrigger>
                <AccordionContent>
                  Yes, the evolf database is available for download under the CC BY 4.0 license. 
                  We only ask that you cite our work if you use the data in your research.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Can I use the API for commercial purposes?</AccordionTrigger>
                <AccordionContent>
                  API access for commercial use requires a separate license agreement. Please contact us 
                  for more information about commercial licensing options.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>How often is the database updated?</AccordionTrigger>
                <AccordionContent>
                  We update the database quarterly with new interactions from recent publications. 
                  Users can also submit data for inclusion through our submission portal.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>What GPCR families are covered?</AccordionTrigger>
                <AccordionContent>
                  Our database covers all major GPCR families (Class A, B, C, and F), with particular 
                  emphasis on therapeutically relevant receptors. Over 50 different receptor subtypes 
                  are represented.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
