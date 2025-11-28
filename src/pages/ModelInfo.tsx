import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Brain, Cpu, Layers, Network, Merge } from 'lucide-react';

const ModelInfo = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="model" onNavigate={() => {}} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Centered Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Model Information</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Technical details about our deep learning prediction model
            </p>
          </div>

          {/* Centered Content */}
          <div className="flex justify-center">
            <div className="max-w-4xl space-y-6 w-full">
              <Card className="p-6">
                <div className="text-center">
                  <Brain className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Deep-Learning Architectures Overview</h3>
                  <p className="text-muted-foreground">
                    To develop a robust model for predicting GPCR-ligand interactions, five distinct deep-learning 
                    architectures were designed, each leveraging unique methodologies for embedding generation 
                    and feature integration. All architectures for ligands and GPCRs use the same input pre-
                    processed feature files, derived from multiple descriptor generation techniques.
                  </p>
                  <p className="text-muted-foreground mt-4">
                    Each architecture comprises two primary components: embedding generators and fusion modules, 
                    with a common classification module. The embedding generator features two separate but identical 
                    pipelines for ligands and GPCRs, transforming features into high-dimensional embeddings through 
                    various combinations of transformers, convolutional layers, and recurrent networks.
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <Layers className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Architecture 1: CNN-LSTM Fusion</h3>
                  <p className="text-muted-foreground">
                    Begins by concatenating multiple input feature sets for ligands into a single representation. 
                    Processes through a 2D convolutional layer (in_channels=1, out_channels=10) with kernel sizes 
                    of 5 and 4 for ligands and GPCRs respectively, followed by LSTM layer (input_size=124, 
                    hidden_size=128, num_layers=2, dropout=0.2). Embeddings are concatenated and passed 
                    through feed-forward network with dropout 0.2. Trained with learning rate of 5×10⁻⁶.
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <Network className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Architecture 2: Transformer-CNN Fusion</h3>
                  <p className="text-muted-foreground">
                    Uses transformer module (d_model=128, nhead=4, num_encoder_layers=2, num_decoder_layers=2) 
                    followed by 1D convolutional layer (out_channels=1, kernel_size=2) with 5 and 4 input channels. 
                    Combined embeddings undergo mean-reduction with dropout 0.4. Three linear layers with ReLU 
                    activations. Trained with learning rate of 1×10⁻⁵.
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <Merge className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Architecture 3: Transformer-LSTM-CNN Fusion</h3>
                  <p className="text-muted-foreground">
                    Transformer-LSTM combination with Transformer (d_model=128, nhead=4) and LSTM 
                    (input_size=128, hidden_size=128). Fused vector expanded into three-channel tensor processed 
                    through 1D convolutional layers (32 and 64 filters, kernel size 3). Uses Xavier and orthogonal 
                    initialization. Trained with learning rate 5×10⁻⁶ and weight decay 1×10⁻⁴.
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <Cpu className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Architecture 4: Transformer-CNN-LSTM Fusion</h3>
                  <p className="text-muted-foreground">
                    Three-stage pipeline: Transformer → 1D CNN → LSTM for both ligands and receptors. 
                    Transformer (d_model=128, nhead=4), 1D convolutional (out_channels=100, kernel_size=2), 
                    LSTM (input_size=127, hidden_size=128, num_layers=2, dropout=0.2). Concatenation with 
                    mean-reduction and dropout 0.2. Trained with learning rate 1×10⁻⁶.
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <Brain className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Architecture 5: Advanced Fusion Transformer</h3>
                  <p className="text-muted-foreground">
                    Transformer → 1D CNN → LSTM pipeline with dedicated fusion transformer using inter-attention 
                    to model complex ligand-GPCR interdependencies. Fusion transformer (d_model=128, nhead=4, 
                    num_encoder_layers=2, num_decoder_layers=2). 1D convolutional (out_channels=10, 
                    kernel_size=2), LSTM (input_size=127, hidden_size=128, num_layers=2, dropout=0.1). 
                    Trained with learning rate 1×10⁻⁵.
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <Layers className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Training Configuration</h3>
                  <p className="text-muted-foreground mb-4">
                    All models were trained with common parameters:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 mx-auto max-w-md">
                    <li>100 epochs with batch size of 64</li>
                    <li>Adam optimizer with CrossEntropyLoss</li>
                    <li>ReduceLROnPlateau learning rate scheduler</li>
                    <li>Binary classification: agonist (Class 1) vs non-agonist (Class 0)</li>
                    <li>Softmax activation for probability outputs</li>
                  </ul>
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

export default ModelInfo;