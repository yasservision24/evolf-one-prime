import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Brain, Cpu, Layers, Network, Merge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ModelInfo = () => {
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
            <h1 className="text-4xl font-bold mb-4">Model Information</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Technical details about our Deep Learning Prediction Model
            </p>
          </div>

          {/* Centered Content */}
          <div className="flex justify-center">
            <div className="max-w-4xl space-y-6 w-full">
              <Card className="p-6">
                <div className="text-center">
                  <Brain className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Deep-Learning Architectures Overview</h3>
                  <div className="text-muted-foreground text-left space-y-4">
                    <p>
                      To develop a robust model for predicting GPCR-ligand interactions, five distinct deep-learning 
                      architectures were designed, each leveraging unique methodologies for embedding generation 
                      and feature integration. All architectures for ligands and GPCRs use the same input pre-
                      processed feature files, derived from multiple descriptor generation techniques. These features 
                      are fed into independent pipelines for ligands and GPCRs. While each architecture employs 
                      unique strategies for feature processing and embedding generation, they share a common 
                      modular structure. Each architecture comprises two primary components: embedding generators 
                      and fusion modules, as well as an additional classification module, which remains the same in all 
                      architectures. The embedding generator module features two separate but identical pipelines: 
                      one for ligands and one for GPCRs. These pipelines are designed to independently process the 
                      feature files of ligands and receptors, transforming different features into high-dimensional 
                      embeddings that encode essential biochemical and structural properties. These embeddings are 
                      generated through various combinations of transformers, convolutional layers, and recurrent 
                      networks, depending on the architecture. These methodologies enable the pipelines to capture 
                      both local and global features, providing a comprehensive representation of ligands and GPCRs 
                      in a shared latent space.
                    </p>
                    <p>
                      Following the embedding generation, the outputs from the ligand and GPCR pipelines are 
                      integrated in the fusion module. This module combines the embeddings to form a joint 
                      representation of the ligand-receptor pair. While the specific fusion strategies vary across 
                      architectures, ranging from simple concatenation to sophisticated transformer-based operations, 
                      the goal remains the same: to capture the complex dependencies and interactions between 
                      ligands and GPCRs. This joint representation is subsequently passed to the feed-forward 
                      network, where the model predicts whether the ligand-GPCR pair is an agonist (Class 1) or non-
                      agonist (Class 0). All models were trained for 100 epochs with a batch size of 64, using the Adam 
                      optimizer and CrossEntropyLoss as the loss function. A learning rate scheduler 
                      (ReduceLROnPlateau) dynamically adjusted the learning rate when validation loss plateaued for 
                      two consecutive epochs. The following subsections detail the specific designs and methodologies 
                      of each architecture.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <Layers className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Architecture 1</h3>
                  <div className="text-muted-foreground text-left">
                    <p>
                      Architecture 1 begins by concatenating multiple input feature sets for ligands into a single 
                      representation. The first stage of processing involves passing the ligand input through a 2D 
                      convolutional layer (in_channels=1, out_channels=10) with kernel sizes of 5 and 4 for ligands and 
                      GPCRs, respectively. This convolutional layer extracts localized spatial patterns within the ligand 
                      features. The output is then processed by an LSTM layer (input_size=124, hidden_size=128, 
                      num_layers=2, batch_first=True, dropout=0.2). The final hidden state from the LSTM serves as 
                      the compact embedding representation for the ligand. A parallel pipeline is used for receptor 
                      features. The embeddings generated by the ligand and receptor pipelines are concatenated to 
                      form a fused embedding vector which is then passed into a fully connected feed-forward network 
                      with a dropout rate of 0.2. The final layer of a softmax activation function is applied, yielding 
                      probabilities for the two interaction classes: agonist (Class 1) and non-agonist (Class 0). The 
                      model was trained with a learning rate of 5x10⁻⁶.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <Network className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Architecture 2</h3>
                  <div className="text-muted-foreground text-left">
                    <p>
                      The architecture begins by concatenating the input features derived from multiple sources, which 
                      are then passed through a transformer module (d_model=128, nhead=4, num_encoder_layers=2, 
                      num_decoder_layers=2, batch_first=True) to capture contextual relationships between the 
                      features. The transformer output is normalized using layer normalization and processed through 
                      a one-dimensional convolutional layer (out_channels = 1, kernel_size=2, groups=1) with 5 and 4 
                      in channels for ligands and GPCRs respectively, to refine spatial patterns and extract key feature 
                      representations. The processed outputs from the ligand and receptor pipelines are then combined 
                      through concatenation around dim=1. The combined embeddings undergo a mean-reduction 
                      operation to create a fused embedding that captures the interaction dynamics between ligands 
                      and receptors. To prevent overfitting during training, a dropout layer with a dropout probability of 
                      0.4 is applied to the fused embeddings before classification. This fused embedding is passed 
                      through a feed-forward network comprising three linear layers with ReLU activations. A final layer 
                      of softmax function is used to generate probabilities for binary classification into agonist or non-
                      agonist interactions. The model was trained with a learning rate of 1x10⁻⁵.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <Merge className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Architecture 3</h3>
                  <div className="text-muted-foreground text-left">
                    <p>
                      This architecture consists of two identical fusion pipelines for ligands and receptors, each 
                      leveraging a Transformer-LSTM combination. Each pipeline begins by concatenating multiple 
                      feature inputs for ligands and receptors, respectively. These concatenated feature sets are 
                      passed through a Transformer layer (d_model=128, nhead=4, num_encoder_layers=2, 
                      num_decoder_layers=2, batch_first=True). This module captures complex relationships within 
                      the input features through self-attention mechanisms. The Transformer output is subsequently 
                      fed into an LSTM (input_size=128, hidden_size=128, batch_first=True). The final hidden state of 
                      the LSTM is passed through a fully connected layer, generating compact embeddings for ligands 
                      and receptors, respectively. The ligand and receptor embeddings generated by the separate 
                      pipelines are fused into a unified representation. This fused vector is expanded into a three-
                      channel tensor by stacking the individual ligand and receptor embeddings alongside the fused 
                      representation. The resulting 2D tensor is then processed through a series of one-dimensional 
                      convolutional layers to extract hierarchical spatial features. The convolutional layers include two 
                      stages: the first with 32 filters and the second with 64 filters, both using a kernel size of 3 and a 
                      stride of 1, followed by max-pooling layers with a kernel size of 2. The convolutional output is 
                      flattened and passed to a fully connected feed-forward network with ReLU activation. Dropout 
                      rate of 0.2 is employed in the classifier to prevent overfitting. Xavier initialization is applied to all 
                      linear and convolutional layers, and orthogonal initialization is used for the LSTM weights to 
                      ensure efficient training. The softmax function is applied to predict the interaction classes: agonist 
                      (Class 1) or non-agonist (Class 0). The model was trained with a learning rate of 5x10⁻⁶ and 
                      weight decay of 1x10⁻⁴.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <Cpu className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Architecture 4</h3>
                  <div className="text-muted-foreground text-left">
                    <p>
                      This architecture includes two identical pipelines for ligands and receptors, each consisting of a 
                      Transformer module, a convolutional layer, and an LSTM. The feature vectors for ligands and 
                      receptors are first concatenated from multiple input features, five for ligands and four for 
                      receptors. These concatenated feature sets are passed through separate Transformer layers 
                      (d_model=128, nhead=4, num_encoder_layers=2, num_decoder_layers=2, batch_first=True). 
                      The Transformer blocks apply self-attention to model intra-feature relationships, enabling the 
                      extraction of meaningful patterns. The Transformer outputs are normalized using layer 
                      normalization before being passed to a 1D convolutional layer (out_channels=100, 
                      kernel_size=2) with 5 and 4 input channels for ligands and GPCRs, respectively. The 
                      convolutional operation enhances spatial feature extraction by focusing on local dependencies 
                      within the feature vectors. Following the convolutional layer, the features are further processed 
                      by an LSTM module (input_size = 127, hidden_size = 128, num_layers = 2, batch_first = True, 
                      dropout = 0.2). The final hidden state of the LSTM, representing the most informative temporal 
                      features, serves as the embedding for ligands and receptors, respectively. The ligand and 
                      receptor embeddings are concatenated along the first dimension to form a fused representation. 
                      This fused vector is mean-reduced to ensure that both embeddings contribute equally to the final 
                      prediction. To improve generalization, a dropout layer with a rate of 0.2 is applied to the resultant 
                      fused vector before it is passed to the feed-forward network, followed by a softmax activation 
                      function to generate class probabilities for agonist (Class 1) and non-agonist (Class 0) 
                      interactions. All linear layers in the classifier are initialized using Xavier initialization, with biases 
                      set to zero to ensure stable weight updates during training. Similarly, LSTM weights are initialized 
                      using Xavier initialization for weights and zero initialization for biases. The model was trained with 
                      a learning rate of 1x10⁻⁶.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <Brain className="h-10 w-10 text-accent mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">Architecture 5</h3>
                  <div className="text-muted-foreground text-left">
                    <p>
                      In Architecture 5, the pipeline begins by concatenating the input features for ligands and GPCRs, 
                      which are independently processed through a transformer module with self-attention 
                      (d_model=128, nhead=4, num_encoder_layers=2, num_decoder_layers=2, batch_first = True) to 
                      capture contextual relationships. This output is normalized and passed through one-dimensional 
                      convolutional layers (out_channels = 10, kernel_size = 2) to refine spatial patterns with 5 and 4 
                      in channels for ligands and GPCRs, respectively, followed by LSTM layers (input_size = 127, 
                      hidden_size = 128, num_layers = 2, batch_first = True, dropout = 0.1) that extract sequential 
                      dependencies. The final hidden states of the LSTMs serve as the ligand and GPCR embeddings, 
                      respectively. These embeddings are then fused using a dedicated fusion transformer 
                      (d_model=128, nhead=4, num_encoder_layers=2, num_decoder_layers=2, batch_first=True), 
                      which utilizes the concept of inter-attention and models the complex interdependencies between 
                      ligands and GPCRs. The output from the fusion transformer is normalized and passed through a 
                      fully connected feed-forward network consisting of dropout (0.2) and ReLU activations, 
                      culminating in a binary classification output. A softmax layer is applied at the end to convert the 
                      logits into probabilities, allowing for the final classification and confidence scoring of interaction 
                      predictions. The architecture's weights are initialized using Xavier initialization for linear and 
                      convolutional layers, with biases set to zero to ensure stability during training. The model was 
                      trained with a learning rate of 1x10⁻⁵.
                    </p>
                  </div>
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