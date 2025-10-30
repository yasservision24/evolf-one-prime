import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Database, Download, Search, FileText, Filter, RefreshCw } from 'lucide-react';

const DatabaseDashboard = () => {
  const navigate = useNavigate();

  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  const stats = [
    { label: 'Total Interactions', value: '10,234', change: '+12% this month', icon: Database, color: 'text-[hsl(var(--brand-teal))]' },
    { label: 'GPCR Receptors', value: '487', change: '15 species', icon: Database, color: 'text-green-400' },
    { label: 'Unique Ligands', value: '3,542', change: 'From ChEMBL', icon: Database, color: 'text-[hsl(var(--brand-purple))]' },
    { label: 'Mutations Studied', value: '1,876', change: 'Validated', icon: Database, color: 'text-red-400' },
  ];

  const features = [
    {
      title: 'Comprehensive Coverage',
      description: 'Curated data from thousands of peer-reviewed publications',
      icon: Database,
    },
    {
      title: 'Validated Data',
      description: 'Quality-controlled experimental binding affinity measurements',
      icon: FileText,
    },
    {
      title: 'Rich Annotations',
      description: 'Detailed mutation data, 3D structures, and experimental conditions',
      icon: Search,
    },
  ];

  return (
    <>
      <Header currentPage="home" onNavigate={handleNavigate} />
      
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-heading font-bold mb-4">
              EvOlf Dataset Explorer
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl">
              A comprehensive, curated database of GPCR receptor-ligand interactions from scientific
              literature. Providing high-quality training data for machine learning models in drug discovery
              and computational biology.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-[hsl(var(--brand-teal))]/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-[hsl(var(--brand-teal))]/10">
                    <feature.icon className="w-6 h-6 text-[hsl(var(--brand-teal))]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-[hsl(var(--brand-teal))]/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <stat.icon className="w-5 h-5 text-[hsl(var(--brand-teal))]" />
                  </div>
                </div>
                <div>
                  <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                  <p className="text-muted-foreground text-xs">{stat.change}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-[hsl(var(--brand-teal))] text-foreground hover:bg-[hsl(var(--brand-teal))]/90"
            >
              <Search className="w-4 h-4" />
              Browse Dataset
            </Button>
            <Button 
              className="bg-[hsl(var(--brand-teal))] text-foreground hover:bg-[hsl(var(--brand-teal))]/90"
            >
              <Download className="w-4 h-4" />
              Download Data
            </Button>
            <Button 
              variant="outline" 
              className="border-[hsl(var(--brand-teal))]/50 text-foreground hover:bg-[hsl(var(--brand-teal))]/10"
            >
              <Filter className="w-4 h-4" />
              Apply Filters
            </Button>
            <Button 
              variant="outline" 
              className="border-[hsl(var(--brand-teal))]/50 text-foreground hover:bg-[hsl(var(--brand-teal))]/10"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DatabaseDashboard;
