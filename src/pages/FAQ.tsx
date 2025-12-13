import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
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
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find answers to common questions about EvOlf
            </p>
          </div>

          {/* Centered Content */}
          <div className="flex justify-center">
            <div className="max-w-3xl w-full">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">What is EvOlf?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    EvOlf is a cutting-edge deep-learning framework designed to predict ligand-GPCR interactions, 
                    integrating odorant and non-odorant GPCRs across 24 species. It enables accurate predictions 
                    and GPCR deorphanization using advanced modeling techniques.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">How many deep-learning architectures does EvOlf use?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    EvOlf employs five distinct deep-learning architectures, each with unique methodologies for 
                    embedding generation and feature integration. All architectures share a common modular structure 
                    with embedding generators and fusion modules.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">What types of GPCRs does EvOlf cover?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    EvOlf integrates both odorant and non-odorant GPCRs across 24 different species, providing 
                    comprehensive coverage of GPCR-ligand interactions.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">Why is web service prediction limited to one interaction per request?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    As we use a shared academic server to host the model, we currently limit our web service to 
                    one ligand-pair interaction prediction per request to ensure fair usage and server stability 
                    for all users.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">How can I run high-throughput predictions?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    For high-throughput predictions on large numbers of ligand-GPCR interactions, we strongly 
                    recommend using our local Nextflow pipeline. Check out our{' '}
                    <a 
                      href="https://github.com/the-ahuja-lab/EvOlf/tree/main/evolf-pipeline-source" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-medium"
                    >
                      EvOlf Local Pipeline Source Code
                    </a>{' '}
                    for complete instructions on running the pipeline locally.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">Is EvOlf open-source?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    Yes, EvOlf is completely open-source! All the code, models, and scripts used to build the 
                    pipeline are hosted in our GitHub repositories. We encourage the community to explore, 
                    contribute, and adapt the pipeline to their specific needs. Visit our{' '}
                    <a 
                      href="/links" 
                      className="text-accent hover:underline font-medium"
                    >
                      Useful Links page
                    </a>{' '}
                    for all repository links.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-left">What are the different architecture types available?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    The five architectures include: CNN-LSTM Fusion, Transformer-CNN Fusion, Transformer-LSTM-CNN Fusion, 
                    Transformer-CNN-LSTM Fusion, and Advanced Fusion Transformer. Each uses different combinations 
                    of transformers, convolutional layers, and recurrent networks.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-left">How were the models trained?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    All models were trained for 100 epochs with a batch size of 64, using the Adam optimizer and 
                    CrossEntropyLoss as the loss function. A ReduceLROnPlateau scheduler dynamically adjusted 
                    the learning rate when validation loss plateaued.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger className="text-left">What is GPCR deorphanization?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    GPCR deorphanization refers to the process of identifying ligands for orphan GPCRs (receptors 
                    without known ligands). EvOlf's prediction capabilities can help identify potential ligands 
                    for these orphan receptors.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10">
                  <AccordionTrigger className="text-left">Can I access EvOlf programmatically?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    Yes, EvOlf provides API endpoints for programmatic access. You can fetch datasets, explore 
                    data, and use the prediction model via our REST API. However, prediction calls are limited 
                    to one ligand-GPCR interaction per request. Access the API documentation at:{' '}
                    <a 
                      href="/api-docs" 
                      className="text-accent hover:underline font-medium"
                    >
                      API Documentation
                    </a>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-11">
                  <AccordionTrigger className="text-left">What input features does EvOlf use?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    EvOlf uses pre-processed feature files derived from multiple descriptor generation techniques. 
                    These features are fed into independent pipelines for ligands and GPCRs, with five feature 
                    inputs for ligands and four for receptors.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-12">
                  <AccordionTrigger className="text-left">What is the classification output of the model?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    The model performs binary classification, predicting whether a ligand-GPCR pair is an 
                    agonist (Class 1) or non-agonist (Class 0). The final layer uses softmax activation to 
                    generate probability scores for both classes.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-13">
                  <AccordionTrigger className="text-left">Where can I find the source code?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    All source code is available in our GitHub Repository:{' '}
                    <a 
                      href="https://github.com/the-ahuja-lab/EvOlf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-medium"
                    >
                      EvOlf
                    </a>{' '}
                    and{' '}
                    <a 
                      href="https://github.com/the-ahuja-lab/EvOlf/tree/main/evolf-pipeline-source" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-medium"
                    >
                      Pipeline Source Code
                    </a>
                    . Both are maintained by The Ahuja Lab.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-14">
                  <AccordionTrigger className="text-left">Are Docker images available?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    <p className="mb-3">
                      Yes, multiple specialized Docker images are available on{' '}
                      <a
                        href="https://hub.docker.com/repositories/ahujalab"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline font-medium"
                      >
                        Docker Hub under the ahujalab repository
                      </a>
                      .
                    </p>
                    <p className="mb-3">
                      The images provide containerized environments for different stages and techniques in the EvOlf pipeline.
                    </p>
                    <ul className="space-y-2 mb-3 text-sm">
                      <li><a href="https://hub.docker.com/r/ahujalab/evolfdl_env" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">evolfdl_env</a> - EvOlf Deep Learning Image</li>
                      <li><a href="https://hub.docker.com/r/ahujalab/signaturizer_env" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">signaturizer_env</a> - EvOlf Signaturizer Image</li>
                      <li><a href="https://hub.docker.com/r/ahujalab/mol2vec_env" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">mol2vec_env</a> - EvOlf Mol2Vec Image</li>
                      <li><a href="https://hub.docker.com/r/ahujalab/mathfeaturizer_env" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">mathfeaturizer_env</a> - EvOlf MathFeaturizer Image</li>
                      <li><a href="https://hub.docker.com/r/ahujalab/evolfprediction_env" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">evolfprediction_env</a> - EvOlf Prediction Model Image</li>
                      <li><a href="https://hub.docker.com/r/ahujalab/evolfr_env" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">evolfr_env</a> - EvOlf R Image</li>
                      <li><a href="https://hub.docker.com/r/ahujalab/graph2vec_env" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">graph2vec_env</a> - EvOlf Graph2Vec Image</li>
                      <li><a href="https://hub.docker.com/r/ahujalab/mordred_env" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">mordred_env</a> - EvOlf Mordred Image</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">
                      Please refer to the main <a href="https://github.com/the-ahuja-lab/EvOlf/tree/main/evolf-pipeline-source" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">pipeline documentation</a> for guidance on using these images.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-15">
                  <AccordionTrigger className="text-left">How can I contribute to the project?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    You can contribute by exploring our{' '}
                    <a 
                      href="https://github.com/the-ahuja-lab/EvOlf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-medium"
                    >
                      GitHub Repository
                    </a>
                    , submitting issues, creating pull requests, or suggesting improvements. We welcome community 
                    contributions to enhance EvOlf's capabilities and expand its features.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-16">
                  <AccordionTrigger className="text-left">How can I run EvOlf locally for sensitive data?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    For sensitive or confidential data, we recommend running EvOlf locally using our{' '}
                    <a 
                      href="https://github.com/the-ahuja-lab/EvOlf/tree/main/evolf-pipeline-source" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-medium"
                    >
                      EvOlf Local Pipeline
                    </a>
                    . This ensures your data never leaves your infrastructure. See our{' '}
                    <a 
                      href="/privacy-policy" 
                      className="text-accent hover:underline font-medium"
                    >
                      Privacy Policy
                    </a>{' '}
                    for more details on data handling.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-17">
                  <AccordionTrigger className="text-left">What are the system requirements for running EvOlf locally?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    For optimal performance, we recommend: 16GB+ RAM, 4+ CPU cores, 50GB+ free disk space, 
                    and a GPU with 8GB+ VRAM for faster training/inference. Docker and Nextflow are required 
                    for running the pipeline. Check the{' '}
                    <a 
                      href="https://github.com/the-ahuja-lab/EvOlf/tree/main/evolf-pipeline-source" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-medium"
                    >
                      pipeline documentation
                    </a>{' '}
                    for detailed requirements.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-18">
                  <AccordionTrigger className="text-left">What file formats are supported for input?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    For the web interface: SMILES strings for ligands and plain amino acid sequences for receptors 
                    (no FASTA headers). For local pipeline: CSV files with specific column formats as described in 
                    the pipeline documentation. The sequence must only contain standard 20 amino acids.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-19">
                  <AccordionTrigger className="text-left">How accurate are EvOlf's predictions?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    EvOlf achieves high accuracy across its five architectures, with performance validated through 
                    rigorous cross-validation and testing on diverse datasets. Specific accuracy metrics are 
                    available in our research publications and documentation.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-20">
                  <AccordionTrigger className="text-left">Who maintains EvOlf?</AccordionTrigger>
                  <AccordionContent className="text-justify">
                    EvOlf is developed and maintained by{' '}
                    <a 
                      href="https://www.ahuja-lab.in/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-medium"
                    >
                      The Ahuja Lab
                    </a>{' '}
                    at Indraprastha Institute of Information Technology Delhi (IIIT-Delhi). We welcome collaborations 
                    and contributions from the research community.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;