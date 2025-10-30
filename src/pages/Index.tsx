import { ArrowRight, Database, Brain, Beaker, FileText, Dna, TrendingUp, CheckCircle2, Sparkles,Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { system } from '@/config/system';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const handleNavigate = (page: 'home' | 'dataset' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'dataset') navigate('/dataset');
    else if (page === 'model') navigate('/prediction');
  };

  return (
    <div className="min-h-screen">
      <Header currentPage="home" onNavigate={handleNavigate} />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sidebar-primary to-background text-foreground">
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
              Welcome to <span className="gradient-logo">{system.app.name}</span>
            </h1>
            
            <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              {system.app.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-10 md:mb-16 px-4">
              <Button
                size="lg"
                className="bg-muted text-foreground hover:bg-[hsl(var(--brand-teal))] hover:text-white shadow-lg transition-all duration-300"
                onClick={() => handleNavigate('dataset')}
              >
                <Database className="mr-2 h-5 w-5" />
                Explore Dataset
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border border-border/40 bg-muted text-foreground hover:border-[hsl(var(--brand-purple))] hover:bg-[hsl(var(--brand-purple)/0.1)] hover:text-[hsl(var(--brand-purple))] transition-all duration-300"
                onClick={() => handleNavigate('model')}
              >
                <Brain className="mr-2 h-5 w-5" />
                Try Prediction Model
              </Button>


            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto px-4">
              {Object.entries(system.app.stats).map(([key, value]) => (
                <div key={key} className="bg-secondary backdrop-blur-md border border-border rounded-xl p-3 md:p-4">
                  <div className="text-2xl md:text-3xl mb-1">{value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground capitalize">{key}</div>
                </div>
              ))}
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

          <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto mt-12 px-4 md:px-0">
            {/* Dataset Explorer */}
            <Card className="group flex flex-col flex-1 p-6 md:p-8 rounded-3xl border border-border bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--background)/0.85)] hover:from-[hsl(var(--brand-teal)/0.08)] hover:to-[hsl(var(--brand-teal)/0.12)] hover:border-[hsl(var(--brand-teal))] hover:shadow-[0_0_35px_-5px_hsl(var(--brand-teal)/0.5)] transition-all duration-500 ease-out">
              {/* Icon */}
              <div className="w-14 h-14 md:w-16 md:h-16 border-2 border-[hsl(var(--brand-teal))] rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:bg-[hsl(var(--brand-teal))] transition-all duration-300">
                <Database className="h-7 w-7 md:h-8 md:w-8 text-[hsl(var(--brand-teal))] group-hover:text-white transition-colors duration-300" />
              </div>

              <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 md:mb-4 tracking-tight group-hover:text-[hsl(var(--brand-teal))] transition-colors duration-300">
                Dataset Explorer
              </h3>

              <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
                Explore an extensive repository of GPCR receptor–ligand interactions curated from peer-reviewed research. Ideal for bioinformatics workflows and ML model training.
              </p>

              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  '10,000+ curated receptor–ligand interactions',
                  '3D molecular visualization & interactive plots',
                  'Advanced filtering by mutation, species, & GPCR class',
                  'Data export for machine learning integration',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[hsl(var(--brand-teal))] flex-shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full border border-[hsl(var(--brand-teal))] bg-transparent text-[hsl(var(--brand-teal))] font-medium text-sm md:text-base py-2.5 md:py-3 rounded-xl 
                shadow-md transition-all duration-300 hover:bg-[hsl(var(--brand-teal))] hover:text-white hover:shadow-[0_0_20px_-5px_hsl(var(--brand-teal)/0.6)]"
                onClick={() => handleNavigate('dataset')}
              >
                Explore Database
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>

            {/* EvOlf Prediction Model */}
            <Card className="group flex flex-col flex-1 p-6 md:p-8 rounded-3xl border border-border bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--background)/0.85)] hover:from-[hsl(var(--brand-purple)/0.08)] hover:to-[hsl(var(--brand-purple)/0.12)] hover:border-[hsl(var(--brand-purple))] hover:shadow-[0_0_35px_-5px_hsl(var(--brand-purple)/0.5)] transition-all duration-500 ease-out">
              {/* Brain Icon (outline style) */}
              <div className="w-14 h-14 md:w-16 md:h-16 border-2 border-[hsl(var(--brand-purple))] rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:bg-[hsl(var(--brand-purple))] transition-all duration-300">
                <Brain className="h-7 w-7 md:h-8 md:w-8 text-[hsl(var(--brand-purple))] group-hover:text-white transition-colors duration-300" />
              </div>

              <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 md:mb-4 tracking-tight group-hover:text-[hsl(var(--brand-purple))] transition-colors duration-300">
                EvOlf Prediction Model
              </h3>

              <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
                Leverage our deep learning engine to predict GPCR-ligand binding affinity with high accuracy, confidence scores, and support for mutated receptor sequences.
              </p>

              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  'State-of-the-art transformer-based architecture',
                  '95%+ validated prediction accuracy',
                  'Real-time confidence-based predictions',
                  'Supports custom receptor variants and mutations',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[hsl(var(--brand-purple))] flex-shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full border border-[hsl(var(--brand-purple))] bg-transparent text-[hsl(var(--brand-purple))] font-medium text-sm md:text-base py-2.5 md:py-3 rounded-xl 
                shadow-md transition-all duration-300 hover:bg-[hsl(var(--brand-purple))] hover:text-white hover:shadow-[0_0_20px_-5px_hsl(var(--brand-purple)/0.6)] flex items-center justify-center gap-2"
                onClick={() => handleNavigate('model')}
              >
                Try Prediction Model
                <Brain className="h-4 w-4 md:h-5 md:w-5 text-[hsl(var(--brand-purple))] group-hover:text-white transition-colors duration-300" />
              </Button>

            </Card>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[hsl(var(--background))] text-foreground">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 bg-gradient-to-r from-[hsl(var(--brand-teal))] via-[hsl(var(--brand-purple))] to-[hsl(var(--brand-purple-alt))] bg-clip-text text-transparent">
            How EvOlf Works
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-3xl mx-auto mb-12 leading-relaxed">
            EvOlf integrates data curation, model training, and prediction into a unified pipeline for GPCR–ligand interaction analysis.
          </p>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-left">
            
            {/* Step 1: Data Curation */}
            <div className="group bg-gradient-to-br from-secondary to-secondary/50 rounded-3xl border border-border p-6 md:p-8 hover:border-[hsl(var(--brand-teal))] hover:shadow-[0_0_30px_-5px_hsl(var(--brand-teal)/0.5)] transition-all duration-500">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[hsl(var(--brand-teal))] to-[hsl(var(--brand-teal)/0.8)] rounded-2xl flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Database className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-foreground group-hover:text-[hsl(var(--brand-teal))] transition-colors duration-300">
                Data Curation
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Aggregates and cleans GPCR–ligand interaction datasets from peer-reviewed sources, integrating structural and binding affinity data for downstream modeling.
              </p>
            </div>

            {/* Step 2: Model Training */}
            <div className="group bg-gradient-to-br from-secondary to-secondary/50 rounded-3xl border border-border p-6 md:p-8 hover:border-[hsl(var(--primary))] hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] transition-all duration-500">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.8)] rounded-2xl flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Cpu className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-foreground group-hover:text-[hsl(var(--primary))] transition-colors duration-300">
                Model Training
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Employs deep learning and graph-based architectures to learn molecular binding patterns, ensuring high generalization and interpretability across GPCR families.
              </p>
            </div>

            {/* Step 3: Prediction */}
            <div className="group bg-gradient-to-br from-secondary to-secondary/50 rounded-3xl border border-border p-6 md:p-8 hover:border-[hsl(var(--brand-purple))] hover:shadow-[0_0_30px_-5px_hsl(var(--brand-purple)/0.5)] transition-all duration-500">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[hsl(var(--brand-purple))] to-[hsl(var(--brand-purple)/0.8)] rounded-2xl flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-foreground group-hover:text-[hsl(var(--brand-purple))] transition-colors duration-300">
                Prediction
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Predicts GPCR–ligand binding affinities with confidence scores, supporting custom receptor sequences and mutation analyses for experimental validation.
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
              Whether you're exploring known interactions or predicting new ones
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {/* Drug Discovery */}
            <Card className="p-5 md:p-6 rounded-2xl border border-border hover:shadow-[0_0_20px_-5px_hsl(210,90%,60%)] transition-all duration-300">
              <Beaker className="h-8 w-8 md:h-10 md:w-10 text-[hsl(210,90%,60%)] mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground font-medium mb-2">
                Drug Discovery
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Screen compounds against GPCR targets and predict binding affinities for lead optimization.
              </p>
            </Card>

            {/* ML Model Training */}
            <Card className="p-5 md:p-6 rounded-2xl border border-border hover:shadow-[0_0_20px_-5px_hsl(150,70%,45%)] transition-all duration-300">
              <Brain className="h-8 w-8 md:h-10 md:w-10 text-[hsl(150,70%,45%)] mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground font-medium mb-2">
                ML Model Training
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Download our curated dataset to train and validate your own machine learning models.
              </p>
            </Card>

            {/* Mutation Analysis */}
            <Card className="p-5 md:p-6 rounded-2xl border border-border hover:shadow-[0_0_20px_-5px_hsl(270,70%,65%)] transition-all duration-300">
              <Dna className="h-8 w-8 md:h-10 md:w-10 text-[hsl(270,70%,65%)] mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground font-medium mb-2">
                Mutation Analysis
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Study how receptor mutations affect ligand binding and predict effects of novel mutations.
              </p>
            </Card>

            {/* Literature Mining */}
            <Card className="p-5 md:p-6 rounded-2xl border border-border hover:shadow-[0_0_20px_-5px_hsl(330,75%,60%)] transition-all duration-300">
              <Database className="h-8 w-8 md:h-10 md:w-10 text-[hsl(330,75%,60%)] mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground font-medium mb-2">
                Literature Mining
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Access structured data extracted from thousands of publications with full references.
              </p>
            </Card>

            {/* Target Validation */}
            <Card className="p-5 md:p-6 rounded-2xl border border-border hover:shadow-[0_0_20px_-5px_hsl(210,90%,60%)] transition-all duration-300">
              <TrendingUp className="h-8 w-8 md:h-10 md:w-10 text-[hsl(210,90%,60%)] mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground font-medium mb-2">
                Target Validation
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Validate GPCR targets using comprehensive binding data and 3D structure analysis.
              </p>
            </Card>

            {/* Academic Research */}
            <Card className="p-5 md:p-6 rounded-2xl border border-border hover:shadow-[0_0_20px_-5px_hsl(270,70%,65%)] transition-all duration-300">
              <FileText className="h-8 w-8 md:h-10 md:w-10 text-[hsl(270,70%,65%)] mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground font-medium mb-2">
                Academic Research
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Cite our database in publications and contribute to the growing knowledge base.
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
                className="bg-muted text-foreground hover:bg-[hsl(var(--brand-teal))] hover:text-white shadow-lg transition-all duration-300"
                onClick={() => handleNavigate('dataset')}
              >
                <Database className="mr-2 h-5 w-5" />
                Explore Dataset
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border border-border/40 bg-muted text-foreground hover:border-[hsl(var(--brand-purple))] hover:bg-[hsl(var(--brand-purple)/0.1)] hover:text-[hsl(var(--brand-purple))] transition-all duration-300"
                onClick={() => handleNavigate('model')}
              >
                <Brain className="mr-2 h-5 w-5" />
                Try Prediction Model
              </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
