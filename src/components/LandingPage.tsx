import { ArrowRight, Database, Brain, Beaker, FileText, Dna, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface LandingPageProps {
  onNavigate: (page: 'dataset' | 'model') => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sidebar-primary to-background text-foreground">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-grid-foreground/[0.05] bg-[size:30px_30px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sidebar-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-chart-4/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 md:mb-6 bg-secondary backdrop-blur-sm border-border text-foreground hover:bg-accent text-xs md:text-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              Deep Learning Powered Prediction
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 md:mb-6 px-4">
              Welcome to <span className="gradient-logo">EvOlf</span>
            </h1>
            
            <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              A comprehensive GPCR receptor-ligand interaction database and deep learning platform 
              for predicting binding affinity in drug discovery
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-10 md:mb-16 px-4">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                onClick={() => onNavigate('dataset')}
              >
                <Database className="mr-2 h-5 w-5" />
                Explore Dataset
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-border bg-secondary backdrop-blur-sm text-foreground hover:bg-accent"
                onClick={() => onNavigate('model')}
              >
                <Brain className="mr-2 h-5 w-5" />
                Try Prediction Model
              </Button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto px-4">
              <div className="bg-secondary backdrop-blur-md border border-border rounded-xl p-3 md:p-4">
                <div className="text-2xl md:text-3xl mb-1">10K+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Interactions</div>
              </div>
              <div className="bg-secondary backdrop-blur-md border border-border rounded-xl p-3 md:p-4">
                <div className="text-2xl md:text-3xl mb-1">487</div>
                <div className="text-xs md:text-sm text-muted-foreground">Receptors</div>
              </div>
              <div className="bg-secondary backdrop-blur-md border border-border rounded-xl p-3 md:p-4">
                <div className="text-2xl md:text-3xl mb-1">3.5K+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Ligands</div>
              </div>
              <div className="bg-secondary backdrop-blur-md border border-border rounded-xl p-3 md:p-4">
                <div className="text-2xl md:text-3xl mb-1">95%</div>
                <div className="text-xs md:text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-background to-secondary">
  <div className="container mx-auto px-4">
    <div className="text-center mb-10 md:mb-16">
      <h2 className="text-2xl md:text-4xl text-foreground mb-3 md:mb-4 px-4">
        Two Powerful Tools in One Platform
      </h2>
      <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
        Explore curated GPCR data or predict new interactions with our state-of-the-art deep learning model
      </p>
    </div>

    {/* Changed from grid to flex */}
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 max-w-5xl mx-auto">
      {/* Dataset Explorer Card */}
      {/* Added flex-1 and h-full */}
      <Card className="flex flex-col flex-1 p-6 md:p-8 hover:shadow-2xl transition-all border-2 border-border hover:border-sidebar-primary bg-gradient-to-br from-secondary to-secondary/50 h-full">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg flex-shrink-0">
          <Database className="h-6 w-6 md:h-7 md:w-7 text-primary-foreground" />
        </div>

        <h3 className="text-xl md:text-2xl text-foreground mb-3 md:mb-4">Dataset Explorer</h3>

        <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed">
          Access our comprehensive database of curated GPCR receptor-ligand interactions from peer-reviewed literature.
          Search, filter, and analyze thousands of validated experimental data points.
        </p>

        {/* Added flex-grow to push button to bottom */}
        <div className="space-y-2 md:space-y-3 mb-6 md:mb-8 flex-grow">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-chart-2 flex-shrink-0 mt-0.5" />
            <span className="text-xs md:text-sm text-muted-foreground">10,000+ curated interactions with experimental binding data</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-chart-2 flex-shrink-0 mt-0.5" />
            <span className="text-xs md:text-sm text-muted-foreground">3D structure visualization and molecular analysis tools</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-chart-2 flex-shrink-0 mt-0.5" />
            <span className="text-xs md:text-sm text-muted-foreground">Advanced filtering by species, mutations, and GPCR class</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-chart-2 flex-shrink-0 mt-0.5" />
            <span className="text-xs md:text-sm text-muted-foreground">Export capabilities for machine learning applications</span>
          </div>
        </div>

        {/* Added mt-auto to ensure button is at the bottom */}
        <Button
          className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-primary-foreground shadow-md text-sm md:text-base mt-auto"
          onClick={() => onNavigate('dataset')}
        >
          Explore Database
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Card>

      {/* Prediction Model Card */}
      {/* Added flex-1 and h-full */}
      <Card className="flex flex-col flex-1 p-6 md:p-8 hover:shadow-2xl transition-all border-2 border-border hover:border-chart-4 bg-gradient-to-br from-secondary to-secondary/50 h-full">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-chart-4 to-chart-4/80 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg flex-shrink-0">
          <Brain className="h-6 w-6 md:h-7 md:w-7 text-primary-foreground" />
        </div>

        <h3 className="text-xl md:text-2xl text-foreground mb-3 md:mb-4">EvOlf Prediction Model</h3>

        <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed">
          Predict GPCR-ligand binding affinity using our deep learning model trained on thousands of
          experimental interactions. Fast, accurate predictions for your drug discovery pipeline.
        </p>

        {/* Added flex-grow to push button to bottom */}
        <div className="space-y-2 md:space-y-3 mb-6 md:mb-8 flex-grow">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-chart-2 flex-shrink-0 mt-0.5" />
            <span className="text-xs md:text-sm text-muted-foreground">State-of-the-art deep learning architecture</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-chart-2 flex-shrink-0 mt-0.5" />
            <span className="text-xs md:text-sm text-muted-foreground">95%+ prediction accuracy on validation set</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-chart-2 flex-shrink-0 mt-0.5" />
            <span className="text-xs md:text-sm text-muted-foreground">Instant predictions with confidence scores</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-chart-2 flex-shrink-0 mt-0.5" />
            <span className="text-xs md:text-sm text-muted-foreground">Supports custom receptor sequences and mutations</span>
          </div>
        </div>

        {/* Added mt-auto to ensure button is at the bottom */}
        <Button
          className="w-full bg-chart-4 hover:bg-chart-4/90 text-primary-foreground shadow-md text-sm md:text-base mt-auto"
          onClick={() => onNavigate('model')}
        >
          Try Prediction Model
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Card>
    </div>
  </div>
</section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16 px-4">
            <h2 className="text-2xl md:text-4xl text-foreground mb-3 md:mb-4">
              How EvOlf Works
            </h2>
            <p className="text-base md:text-xl text-foreground max-w-2xl mx-auto">
              Our platform combines curated experimental data with cutting-edge machine learning
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            <div className="text-center px-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <FileText className="h-7 w-7 md:h-8 md:w-8 text-sidebar-primary" />
              </div>
              <h3 className="text-lg md:text-xl text-foreground mb-2 md:mb-3">Data Curation</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                We curate high-quality GPCR interaction data from peer-reviewed literature, 
                ensuring experimental validation and complete metadata.
              </p>
            </div>

            <div className="text-center px-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Dna className="h-7 w-7 md:h-8 md:w-8 text-chart-4" />
              </div>
              <h3 className="text-lg md:text-xl text-foreground mb-2 md:mb-3">Model Training</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Our deep learning model is trained on thousands of validated interactions, 
                learning complex patterns in receptor-ligand binding.
              </p>
            </div>

            <div className="text-center px-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <TrendingUp className="h-7 w-7 md:h-8 md:w-8 text-chart-2" />
              </div>
              <h3 className="text-lg md:text-xl text-foreground mb-2 md:mb-3">Prediction & Discovery</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Use our trained model to predict novel interactions and accelerate your 
                drug discovery research with confidence scores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16 px-4">
            <h2 className="text-2xl md:text-4xl text-foreground mb-3 md:mb-4">
              Built for Researchers
            </h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're exploring known interactions or predicting new ones, EvOlf supports your research
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            <Card className="p-5 md:p-6 hover:shadow-lg transition-shadow border-border">
              <Beaker className="h-8 w-8 md:h-10 md:w-10 text-sidebar-primary mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground mb-2">Drug Discovery</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Screen compounds against GPCR targets and predict binding affinities for lead optimization
              </p>
            </Card>

            <Card className="p-5 md:p-6 hover:shadow-lg transition-shadow border-border">
              <Brain className="h-8 w-8 md:h-10 md:w-10 text-chart-2 mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground mb-2">ML Model Training</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Download our curated dataset to train and validate your own machine learning models
              </p>
            </Card>

            <Card className="p-5 md:p-6 hover:shadow-lg transition-shadow border-border">
              <Dna className="h-8 w-8 md:h-10 md:w-10 text-chart-4 mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground mb-2">Mutation Analysis</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Study how receptor mutations affect ligand binding and predict effects of novel mutations
              </p>
            </Card>

            <Card className="p-5 md:p-6 hover:shadow-lg transition-shadow border-border">
              <Database className="h-8 w-8 md:h-10 md:w-10 text-chart-5 mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground mb-2">Literature Mining</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Access structured data extracted from thousands of publications with full references
              </p>
            </Card>

            <Card className="p-5 md:p-6 hover:shadow-lg transition-shadow border-border">
              <TrendingUp className="h-8 w-8 md:h-10 md:w-10 text-sidebar-primary mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground mb-2">Target Validation</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Validate GPCR targets using comprehensive binding data and 3D structure analysis
              </p>
            </Card>

            <Card className="p-5 md:p-6 hover:shadow-lg transition-shadow border-border">
              <FileText className="h-8 w-8 md:h-10 md:w-10 text-chart-4 mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground mb-2">Academic Research</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Cite our database in publications and contribute to the growing knowledge base
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-sidebar-primary to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl text-foreground mb-4 md:mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-base md:text-xl text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto px-4">
            Explore our database or try our prediction model to accelerate your GPCR research
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl text-sm md:text-base"
              onClick={() => onNavigate('dataset')}
            >
              <Database className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Browse Dataset
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-border bg-secondary backdrop-blur-sm text-foreground hover:bg-accent text-sm md:text-base"
              onClick={() => onNavigate('model')}
            >
              <Brain className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Predict Interactions
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
