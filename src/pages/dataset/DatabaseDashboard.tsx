import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Database, Download, Search, FileText, Filter, RefreshCw, Loader2, ChevronRight, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchDatasetPaginated, downloadDataset as downloadDatasetAPI, fetchDatasetStats } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Dataset Item Interface
 * Represents a single GPCR receptor-ligand interaction record
 */
export interface DatasetItem {
  id: string;
  evolfId: string;            // EvOlf unique identifier (e.g., "EVLF_001234")
  class: string;              // GPCR class (e.g., "Class A", "Class B")
  receptor: string;           // GPCR receptor name (e.g., "Adenosine A2A receptor")
  species: string;            // Organism species in scientific name (e.g., "Homo sapiens")
  ligand: string;             // Ligand/compound name
  chemblId: string;           // ChEMBL database ID (e.g., "CHEMBL191")
  mutation?: string;          // Optional: mutation information (e.g., "L249A", "Wild-type")
  quality: string;            // Data quality level ("High", "Medium", "Low")
  qualityScore: number;       // Quality score 0-100 for progress bar
  affinity?: number;          // Optional: Binding affinity value (e.g., Ki, IC50)
  affinityUnit?: string;      // Optional: Unit of measurement (e.g., "nM", "μM")
  experimentType?: string;    // Optional: Type of experiment (e.g., "Binding", "Functional")
  reference?: string;         // Optional: PubMed ID or DOI
  dateAdded: string;          // ISO date string
}

/**
 * Paginated Response Interface
 * Standard structure for paginated API responses
 */
export interface PaginatedResponse<T> {
  data: T[];                  // Array of items for current page
  pagination: {
    currentPage: number;      // Current page number (1-indexed)
    itemsPerPage: number;     // Number of items per page
    totalItems: number;       // Total number of items across all pages
    totalPages: number;       // Total number of pages
  };
}

/**
 * Dataset Search/Filter Parameters
 * Used for server-side filtering and pagination
 */
export interface DatasetQueryParams {
  page?: number;              // Page number (default: 1)
  limit?: number;             // Items per page (default: 20)
  search?: string;            // Search query (searches across all fields)
  receptor?: string;          // Filter by specific receptor
  species?: string;           // Filter by species
  sortBy?: string;            // Sort field (e.g., "affinity", "dateAdded")
  sortOrder?: 'asc' | 'desc'; // Sort direction
}

const DatabaseDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [datasetItems, setDatasetItems] = useState<DatasetItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 20;

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };


  /**
   * Fetch paginated dataset items
   */
  const fetchDatasetItems = async () => {
    setIsLoading(true);
    try {
      const data: PaginatedResponse<DatasetItem> = await fetchDatasetPaginated(
        currentPage,
        itemsPerPage,
        searchQuery,
        'dateAdded',
        'desc'
      );
      
      setDatasetItems(data.data);
      setTotalItems(data.pagination.totalItems);
    } catch (error) {
      console.error('Error fetching dataset:', error);
      toast({
        title: 'Backend Not Connected',
        description: 'Please connect your backend to view real data.',
        variant: 'destructive',
      });
      
      setDatasetItems([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Download dataset as CSV/JSON
   */
  const downloadDataset = async (format: 'csv' | 'json' = 'csv') => {
    try {
      const blob = await downloadDatasetAPI(format, searchQuery);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evolf-dataset.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Download Started',
        description: `Dataset is being downloaded as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Error downloading dataset:', error);
      toast({
        title: 'Download Failed',
        description: 'Could not download dataset. Please try again.',
        variant: 'destructive',
      });
    }
  };

  /**
   * Handle search input change
   * Debounced to avoid excessive API calls
   */
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of table
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Generate page numbers for pagination
   * Shows: First ... Current-1 Current Current+1 ... Last
   */
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis');
      }
      
      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Fetch data when page or search changes
  useEffect(() => {
    fetchDatasetItems();
  }, [currentPage, searchQuery]);

  const stats = [
    { label: 'Total Interactions', value: totalItems > 0 ? totalItems.toLocaleString() : '—', change: 'Curated records', icon: Database, color: 'text-[hsl(var(--brand-teal))]' },
    { label: 'GPCR Receptors', value: '—', change: 'Connect backend', icon: Database, color: 'text-green-400' },
    { label: 'Unique Ligands', value: '—', change: 'Connect backend', icon: Database, color: 'text-[hsl(var(--brand-purple))]' },
    { label: 'Mutations Studied', value: '—', change: 'Connect backend', icon: Database, color: 'text-red-400' },
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
      <Header currentPage="dataset" onNavigate={handleNavigate} />
      
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

          {/* Enhanced Search Bar */}
          <div className="mb-8">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[hsl(var(--brand-teal))]" />
                    <Input
                      type="text"
                      placeholder="Search by EvOlf ID, receptor name, ligand, ChEMBL ID, species..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-12 h-14 text-base bg-background/50 border-border/50 focus:border-[hsl(var(--brand-teal))] transition-colors"
                    />
                  </div>
                  <Button 
                    size="lg"
                    className="h-14 px-6 bg-[hsl(var(--brand-teal))] text-foreground hover:bg-[hsl(var(--brand-teal))]/90"
                    onClick={() => fetchDatasetItems()}
                  >
                    <Search className="w-5 h-5" />
                    Search
                  </Button>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <p>
                    {totalItems > 0 ? (
                      <>Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems.toLocaleString()} interactions</>
                    ) : (
                      <>No data available. Please connect your backend.</>
                    )}
                  </p>
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSearchChange('')}
                      className="text-[hsl(var(--brand-teal))] hover:text-[hsl(var(--brand-teal))]/80"
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Dataset Cards Grid */}
          <div className="mb-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-[hsl(var(--brand-teal))]" />
                  <p className="text-muted-foreground text-lg">Loading dataset...</p>
                </div>
              </div>
            ) : datasetItems.length === 0 ? (
              <Card className="p-12 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex flex-col items-center gap-4 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground" />
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-2">No Data Available</h3>
                    <p className="text-muted-foreground">
                      Please connect your backend to view the dataset. Check the API documentation for setup instructions.
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {datasetItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-[hsl(var(--brand-teal))]/50 transition-all cursor-pointer group"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[auto,1fr,1fr,auto,auto,auto] gap-6 items-center">
                      {/* EvOlf ID & Class */}
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <p className="text-xs text-muted-foreground font-medium">EvOlf ID</p>
                        <p className="text-[hsl(var(--brand-teal))] font-mono text-sm font-semibold">{item.evolfId}</p>
                        <Badge variant="outline" className="w-fit border-[hsl(var(--brand-teal))]/30 text-[hsl(var(--brand-teal))] text-xs">
                          {item.class}
                        </Badge>
                      </div>

                      {/* Receptor */}
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-muted-foreground font-medium">Receptor</p>
                        <p className="font-heading font-semibold text-base">{item.receptor}</p>
                        <p className="text-sm text-muted-foreground italic">{item.species}</p>
                      </div>

                      {/* Ligand */}
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-muted-foreground font-medium">Ligand</p>
                        <p className="font-heading font-semibold text-base">{item.ligand}</p>
                        <a
                          href={`https://www.ebi.ac.uk/chembl/compound_report_card/${item.chemblId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[hsl(var(--brand-teal))] hover:underline text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.chemblId}
                        </a>
                      </div>

                      {/* Mutation */}
                      <div className="flex flex-col gap-2 min-w-[100px]">
                        <p className="text-xs text-muted-foreground font-medium">Mutation</p>
                        {item.mutation && item.mutation !== 'Wild-type' ? (
                          <Badge 
                            variant="secondary" 
                            className="w-fit bg-[hsl(var(--brand-purple))]/10 text-[hsl(var(--brand-purple))] border-[hsl(var(--brand-purple))]/20 font-mono text-xs"
                          >
                            {item.mutation}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">Wild-type</span>
                        )}
                      </div>

                      {/* Quality */}
                      <div className="flex flex-col gap-2 min-w-[140px]">
                        <p className="text-xs text-muted-foreground font-medium">Quality</p>
                        <div className="flex items-center gap-2">
                          <div className="relative w-24 h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${
                                item.quality === 'High' 
                                  ? 'bg-[hsl(var(--brand-teal))]' 
                                  : item.quality === 'Medium' 
                                  ? 'bg-[hsl(45,93%,58%)]' 
                                  : 'bg-[hsl(0,72%,51%)]'
                              }`}
                              style={{ width: `${item.qualityScore}%` }}
                            />
                          </div>
                          <span className={`text-xs font-semibold ${
                            item.quality === 'High' 
                              ? 'text-[hsl(var(--brand-teal))]' 
                              : item.quality === 'Medium' 
                              ? 'text-[hsl(45,93%,58%)]' 
                              : 'text-[hsl(0,72%,51%)]'
                          }`}>
                            {item.quality}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center justify-center">
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[hsl(var(--brand-teal))] transition-colors" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {!isLoading && datasetItems.length > 0 && (
            <div className="flex flex-col items-center gap-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages.toLocaleString()}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <Button 
              className="bg-[hsl(var(--brand-teal))] text-foreground hover:bg-[hsl(var(--brand-teal))]/90"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
            <Button 
              className="bg-[hsl(var(--brand-teal))] text-foreground hover:bg-[hsl(var(--brand-teal))]/90"
              onClick={() => downloadDataset('csv')}
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
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DatabaseDashboard;
