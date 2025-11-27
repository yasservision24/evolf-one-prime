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

  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  return (
    <div className="min-h-screen">
      <Header currentPage="home" onNavigate={handleNavigate} />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-sidebar-primary/50 text-foreground">
        <div className="absolute inset-0 bg-grid-foreground/[0.05] bg-[size:30px_30px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sidebar-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-chart-4/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 md:mb-6 bg-background/80 backdrop-blur-sm border-border text-foreground hover:bg-accent text-xs md:text-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              Deep Learning Powered Prediction
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 md:mb-6 px-4">
              Welcome to <span className="gradient-evolf font-bold">{system.app.name}</span>
            </h1>
            
            <p className="text-base md:text-xl text-foreground/90 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              {system.app.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-10 md:mb-16 px-4">
              <Button
                size="lg"
                className="bg-brand-teal text-white hover:bg-brand-teal hover:scale-105 hover:shadow-[0_0_25px_-5px_hsl(var(--brand-teal))] shadow-lg transition-all duration-300 group"
                onClick={() => navigate('/dataset/dashboard')}
              >
                <Database className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Explore Dataset
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>

              <Button
                size="lg"
                className="bg-brand-purple text-white hover:bg-brand-purple hover:scale-105 hover:shadow-[0_0_25px_-5px_hsl(var(--brand-purple))] shadow-lg transition-all duration-300 group"
                onClick={() => handleNavigate('model')}
              >
                <Brain className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Try Prediction Model
              </Button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto px-4">
              {Object.entries(system.app.stats).map(([key, value]) => (
                <div key={key} className="bg-background/80 backdrop-blur-md border border-border rounded-xl p-3 md:p-4 shadow-sm">
                  <div className="text-2xl md:text-3xl mb-1 font-semibold text-foreground">{value}</div>
                  <div className="text-xs md:text-sm text-foreground/80 capitalize">{key}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-background to-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl text-foreground mb-3 md:mb-4 px-4">
              Two Powerful Tools in One Platform
            </h2>
            <p className="text-base md:text-xl text-foreground/80 max-w-2xl mx-auto px-4">
              Explore curated GPCR data or predict new interactions with our state-of-the-art deep learning model
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto mt-12 px-4 md:px-0">
            {/* Dataset Explorer */}
            <Card className="group flex flex-col flex-1 p-6 md:p-8 rounded-3xl border border-border bg-background/80 backdrop-blur-sm hover:from-brand-teal/5 hover:to-brand-teal/10 hover:border-brand-teal hover:shadow-[0_0_35px_-5px_hsl(var(--brand-teal)/0.5)] transition-all duration-500 ease-out">
              {/* Icon */}
              <div className="w-14 h-14 md:w-16 md:h-16 border-2 border-brand-teal rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:bg-brand-teal group-hover:scale-105 transition-all duration-300">
                <Database className="h-7 w-7 md:h-8 md:w-8 text-brand-teal group-hover:text-white transition-colors duration-300" />
              </div>

              <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 md:mb-4 tracking-tight group-hover:text-brand-teal transition-colors duration-300">
                Dataset Explorer
              </h3>

              <p className="text-sm md:text-base text-foreground/80 mb-6 leading-relaxed">
                Explore an extensive repository of GPCR receptor–ligand interactions curated from peer-reviewed research. Ideal for bioinformatics workflows and ML model training.
              </p>

              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  '100,000+ curated receptor–ligand interactions',
                  '3D molecular visualization & interactive plots',
                  'Advanced filtering by mutation, species, & GPCR class',
                  'Data export for machine learning integration',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-teal flex-shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full border border-brand-teal bg-transparent text-brand-teal font-medium text-sm md:text-base py-2.5 md:py-3 rounded-xl 
                shadow-md transition-all duration-300 hover:bg-brand-teal hover:text-white hover:shadow-[0_0_20px_-5px_hsl(var(--brand-teal))] hover:scale-[1.02] group"
                onClick={() => navigate('/dataset/dashboard')}
              >
                Explore Database
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button> 
            </Card>

            {/* EvOlf Prediction Model */}
            <Card className="group flex flex-col flex-1 p-6 md:p-8 rounded-3xl border border-border bg-background/80 backdrop-blur-sm hover:from-brand-purple/5 hover:to-brand-purple/10 hover:border-brand-purple hover:shadow-[0_0_35px_-5px_hsl(var(--brand-purple)/0.5)] transition-all duration-500 ease-out">
              {/* Brain Icon (outline style) */}
              <div className="w-14 h-14 md:w-16 md:h-16 border-2 border-brand-purple rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:bg-brand-purple group-hover:scale-105 transition-all duration-300">
                <Brain className="h-7 w-7 md:h-8 md:w-8 text-brand-purple group-hover:text-white transition-colors duration-300" />
              </div>

              <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 md:mb-4 tracking-tight group-hover:text-brand-purple transition-colors duration-300">
                EvOlf Prediction Model
              </h3>

              <p className="text-sm md:text-base text-foreground/80 mb-6 leading-relaxed">
                Leverage our deep learning engine to predict GPCR-ligand interaction with high accuracy, confidence scores, and support for mutated receptor sequences.
              </p>

              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  'State-of-the-art transformer-based architecture',
                  '95%+ validated prediction accuracy',
                  'Real-time confidence-based predictions',
                  'Supports custom receptor variants and mutations',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-purple flex-shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full border border-brand-purple bg-transparent text-brand-purple font-medium text-sm md:text-base py-2.5 md:py-3 rounded-xl 
                shadow-md transition-all duration-300 hover:bg-brand-purple hover:text-white hover:shadow-[0_0_20px_-5px_hsl(var(--brand-purple))] hover:scale-[1.02] group flex items-center justify-center gap-2"
                onClick={() => handleNavigate('model')}
              >
                Try Prediction Model
                <Brain className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform duration-300" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            How <span className="gradient-evolf">EvOlf</span> Works
          </h2>
          <p className="text-foreground/80 text-sm md:text-base max-w-3xl mx-auto mb-12 leading-relaxed">
            EvOlf integrates data curation, model training, and prediction into a unified pipeline for GPCR–ligand interaction analysis.
          </p>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-left">
            
            {/* Step 1: Data Curation */}
            <div className="group bg-background/80 backdrop-blur-sm border border-border p-6 md:p-8 hover:border-brand-teal hover:shadow-[0_0_30px_-5px_hsl(var(--brand-teal)/0.5)] transition-all duration-500 rounded-3xl">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-brand-teal to-brand-teal/80 rounded-2xl flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Database className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-brand-teal transition-colors duration-300">
                Data Curation
              </h3>
              <p className="text-foreground/80 text-sm md:text-base leading-relaxed">
                Aggregates and cleans GPCR–ligand interaction datasets from peer-reviewed sources, integrating structural and interaction data for downstream modeling.
              </p>
            </div>

            {/* Step 2: Model Training */}
            <div className="group bg-background/80 backdrop-blur-sm border border-border p-6 md:p-8 hover:border-brand-gold hover:shadow-[0_0_30px_-5px_hsl(var(--brand-gold)/0.5)] transition-all duration-500 rounded-3xl">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-brand-gold to-brand-gold/80 rounded-2xl flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Cpu className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-brand-gold transition-colors duration-300">
                Model Training
              </h3>
              <p className="text-foreground/80 text-sm md:text-base leading-relaxed">
                Employs deep learning architectures to learn molecular ineteraction patterns , ensuring high generalization and interpretability across GPCR families.
              </p>
            </div>

            {/* Step 3: Prediction */}
            <div className="group bg-background/80 backdrop-blur-sm border border-border p-6 md:p-8 hover:border-brand-purple hover:shadow-[0_0_30px_-5px_hsl(var(--brand-purple)/0.5)] transition-all duration-500 rounded-3xl">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-brand-purple to-brand-purple/80 rounded-2xl flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-brand-purple transition-colors duration-300">
                Prediction
              </h3>
              <p className="text-foreground/80 text-sm md:text-base leading-relaxed">
                Predicts GPCR–ligand interaction with confidence scores, supporting custom receptor sequences and mutation analyses for experimental validation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16 px-4">
            <h2 className="text-2xl md:text-4xl text-foreground mb-3 md:mb-4">
              Built for Researchers
            </h2>
            <p className="text-base md:text-xl text-foreground/80 max-w-2xl mx-auto">
              Whether you're exploring known interactions or predicting new ones
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {/* Drug Discovery */}
            <Card className="p-5 md:p-6 rounded-2xl border border-border bg-background/80 backdrop-blur-sm hover:shadow-[0_0_20px_-5px_hsl(210,90%,60%)] hover:scale-[1.02] transition-all duration-300">
              <Beaker className="h-8 w-8 md:h-10 md:w-10 text-[hsl(210,90%,60%)] mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground font-medium mb-2">
                Drug Discovery
              </h3>
              <p className="text-xs md:text-sm text-foreground/80">
                Screen compounds against GPCR targets and predict interaction for lead optimization.
              </p>
            </Card>

            {/* ML Model Training */}
            <Card className="p-5 md:p-6 rounded-2xl border border-border bg-background/80 backdrop-blur-sm hover:shadow-[0_0_20px_-5px_hsl(150,70%,45%)] hover:scale-[1.02] transition-all duration-300">
              <Brain className="h-8 w-8 md:h-10 md:w-10 text-[hsl(150,70%,45%)] mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground font-medium mb-2">
                ML Model Training
              </h3>
              <p className="text-xs md:text-sm text-foreground/80">
                Download our curated dataset to train and validate your own machine learning models.
              </p>
            </Card>

            {/* Mutation Analysis */}
            <Card className="p-5 md:p-6 rounded-2xl border border-border bg-background/80 backdrop-blur-sm hover:shadow-[0_0_20px_-5px_hsl(270,70%,65%)] hover:scale-[1.02] transition-all duration-300">
              <Dna className="h-8 w-8 md:h-10 md:w-10 text-[hsl(270,70%,65%)] mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground font-medium mb-2">
                Mutation Analysis
              </h3>
              <p className="text-xs md:text-sm text-foreground/80">
                Study how receptor mutations affect ligand interaction and predict effects of novel mutations.
              </p>
            </Card>

            {/* Literature Mining */}
            <Card className="p-5 md:p-6 rounded-2xl border border-border bg-background/80 backdrop-blur-sm hover:shadow-[0_0_20px_-5px_hsl(330,75%,60%)] hover:scale-[1.02] transition-all duration-300">
              <Database className="h-8 w-8 md:h-10 md:w-10 text-[hsl(330,75%,60%)] mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground font-medium mb-2">
                Literature Mining
              </h3>
              <p className="text-xs md:text-sm text-foreground/80">
                Access structured data extracted from thousands of publications with full references.
              </p>
            </Card>

            {/* Target Validation */}
            <Card className="p-5 md:p-6 rounded-2xl border border-border bg-background/80 backdrop-blur-sm hover:shadow-[0_0_20px_-5px_hsl(210,90%,60%)] hover:scale-[1.02] transition-all duration-300">
              <TrendingUp className="h-8 w-8 md:h-10 md:w-10 text-[hsl(210,90%,60%)] mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground font-medium mb-2">
                Target Validation
              </h3>
              <p className="text-xs md:text-sm text-foreground/80">
                Validate GPCR targets using comprehensive interaction data and 3D structure analysis.
              </p>
            </Card>

            {/* Academic Research */}
            <Card className="p-5 md:p-6 rounded-2xl border border-border bg-background/80 backdrop-blur-sm hover:shadow-[0_0_20px_-5px_hsl(270,70%,65%)] hover:scale-[1.02] transition-all duration-300">
              <FileText className="h-8 w-8 md:h-10 md:w-10 text-[hsl(270,70%,65%)] mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg text-foreground font-medium mb-2">
                Academic Research
              </h3>
              <p className="text-xs md:text-sm text-foreground/80">
                Cite our database in publications and contribute to the growing knowledge base.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-background to-sidebar-primary/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl text-foreground mb-4 md:mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-base md:text-xl text-foreground/90 mb-8 md:mb-10 max-w-2xl mx-auto px-4">
            Explore our database or try our prediction model to accelerate your GPCR research
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Button
              size="lg"
              className="bg-brand-teal text-white hover:bg-brand-teal hover:scale-105 hover:shadow-[0_0_25px_-5px_hsl(var(--brand-teal))] shadow-lg transition-all duration-300 group"
              onClick={() => navigate('/dataset/dashboard')}
            >
              <Database className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Explore Dataset
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            <Button
              size="lg"
              className="bg-brand-purple text-white hover:bg-brand-purple hover:scale-105 hover:shadow-[0_0_25px_-5px_hsl(var(--brand-purple))] shadow-lg transition-all duration-300 group"
              onClick={() => handleNavigate('model')}
            >
              <Brain className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
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