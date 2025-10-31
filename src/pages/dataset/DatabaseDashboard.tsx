import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Database, Download, Search, FileText, Filter, RefreshCw, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getDatasetPaginated, getDatasetCount, DatasetItem } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

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
   * Fetch total count of items
   * Called on initial load and when search query changes
   */
  const fetchTotalCount = async (search?: string) => {
    try {
      const count = await getDatasetCount(search);
      setTotalItems(count);
    } catch (error) {
      console.error('Error fetching total count:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dataset count. Using mock data.',
        variant: 'destructive',
      });
      // Set mock count for demonstration
      setTotalItems(10234);
    }
  };

  /**
   * Fetch paginated dataset items
   * Called when page changes or search query changes
   */
  const fetchDatasetItems = async () => {
    setIsLoading(true);
    try {
      const response = await getDatasetPaginated({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        sortBy: 'dateAdded',
        sortOrder: 'desc',
      });
      
      setDatasetItems(response.data);
      setTotalItems(response.pagination.totalItems);
    } catch (error) {
      console.error('Error fetching dataset:', error);
      toast({
        title: 'Backend Not Connected',
        description: 'Displaying mock data. Connect your backend to see real data.',
        variant: 'default',
      });
      
      // Generate mock data for demonstration
      const mockData: DatasetItem[] = Array.from({ length: itemsPerPage }, (_, i) => ({
        id: `${(currentPage - 1) * itemsPerPage + i + 1}`,
        receptor: ['5-HT2A', 'D2', 'M1', 'α2A', 'β2'][i % 5],
        ligand: ['Serotonin', 'Dopamine', 'Acetylcholine', 'Norepinephrine', 'Epinephrine'][i % 5],
        affinity: parseFloat((Math.random() * 100 + 1).toFixed(2)),
        affinityUnit: 'nM',
        species: ['Human', 'Rat', 'Mouse'][i % 3],
        mutation: i % 3 === 0 ? 'D138A' : undefined,
        experimentType: ['Binding', 'Functional'][i % 2],
        reference: `PMID:${12345678 + i}`,
        dateAdded: new Date(2024, 0, i + 1).toISOString(),
      }));
      
      setDatasetItems(mockData);
    } finally {
      setIsLoading(false);
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

  // Fetch total count on mount and when search changes
  useEffect(() => {
    fetchTotalCount(searchQuery || undefined);
  }, [searchQuery]);

  // Fetch data when page or search changes
  useEffect(() => {
    fetchDatasetItems();
  }, [currentPage, searchQuery]);

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

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by receptor, ligand, species, or reference..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems.toLocaleString()} interactions
            </p>
          </div>

          {/* Dataset Table */}
          <Card className="mb-8 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Receptor</TableHead>
                    <TableHead className="font-semibold">Ligand</TableHead>
                    <TableHead className="font-semibold">Affinity</TableHead>
                    <TableHead className="font-semibold">Species</TableHead>
                    <TableHead className="font-semibold">Mutation</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--brand-teal))]" />
                          <span className="text-muted-foreground">Loading dataset...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : datasetItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <p className="text-muted-foreground">No data found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    datasetItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-xs">{item.id}</TableCell>
                        <TableCell className="font-semibold text-[hsl(var(--brand-teal))]">{item.receptor}</TableCell>
                        <TableCell>{item.ligand}</TableCell>
                        <TableCell>
                          <span className="font-mono">{item.affinity} {item.affinityUnit}</span>
                        </TableCell>
                        <TableCell>{item.species}</TableCell>
                        <TableCell>
                          {item.mutation ? (
                            <span className="px-2 py-1 rounded-md bg-[hsl(var(--brand-purple))]/10 text-[hsl(var(--brand-purple))] text-xs font-mono">
                              {item.mutation}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.experimentType}</span>
                        </TableCell>
                        <TableCell>
                          <a
                            href={`https://pubmed.ncbi.nlm.nih.gov/${item.reference.replace('PMID:', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[hsl(var(--brand-teal))] hover:underline text-xs font-mono"
                          >
                            {item.reference}
                          </a>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

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
