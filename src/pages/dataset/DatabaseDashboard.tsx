import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Database, Download, Search, FileText, Filter, RefreshCw, Loader2, ChevronRight, AlertCircle, Dna, FlaskConical, CheckCircle, ChevronDown, ArrowUpDown, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { fetchDatasetPaginated, downloadDatasetByIds, downloadCompleteDataset, searchDataset } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

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
  receptor: string;           // GPCR receptor name (e.g., "Adenosine A2A receptor")
  species: string;            // Organism species in scientific name (e.g., "Homo sapiens")
  ligand: string;             // Ligand/compound name
  chemblId: string;           // ChEMBL database ID or PubMed ID
  mutation: string;           // Mutation information (e.g., "L249A", "Wild-type")
  class: string;              // GPCR class (e.g., "Class A", "Class B", "Class C")
  uniprotId?: string;         // Optional: UniProt identifier
  ensembleId?: string;        // Optional: Ensemble identifier
}

/**
 * Paginated Response Interface
 * Standard structure for paginated API responses
 */
export interface PaginatedResponse<T> {
  data: T[];                  // Array of items for current page
  all_evolf_ids?: string[];   // Array of all evolf IDs matching the current filters
  pagination: {
    currentPage: number;      // Current page number (1-indexed)
    itemsPerPage: number;     // Number of items per page
    totalItems: number;       // Total number of items across all pages
    totalPages: number;       // Total number of pages
  };
  statistics?: {
    totalRows: number;        // Total data rows
    uniqueClasses: string[];  // Array of unique GPCR classes
    uniqueSpecies: string[];  // Array of unique species
    uniqueMutationTypes: string[]; // Array of unique mutation types
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
  class?: string;             // Filter by GPCR class
  sortBy?: string;            // Sort field (e.g., "receptor", "ligand", "evolfId")
  sortOrder?: 'asc' | 'desc'; // Sort direction
}

// Sorting options
type SortField = 'receptor' | 'ligand' | 'evolfId' | 'species' | 'class';
type SortOrder = 'asc' | 'desc';

const DatabaseDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [datasetItems, setDatasetItems] = useState<DatasetItem[]>([]);
  const [allEvolfIds, setAllEvolfIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const itemsPerPage = 20;
  
  // Autocomplete search state
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchDebounceRef = useRef<NodeJS.Timeout>();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Statistics from backend
  const [statistics, setStatistics] = useState({
    totalRows: 0,
    uniqueClasses: [] as string[],
    uniqueSpecies: [] as string[],
    uniqueMutationTypes: [] as string[]
  });

  // Sorting state
  const [sortBy, setSortBy] = useState<SortField>('evolfId');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Filter state - now using arrays for multiple selections
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedMutations, setSelectedMutations] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Filter counts
  const [filterCounts, setFilterCounts] = useState<{
    species: Record<string, number>;
    classes: Record<string, number>;
    mutations: Record<string, number>;
  }>({
    species: {},
    classes: {},
    mutations: {}
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  /**
   * Fetch paginated dataset items with backend filtering
   */
  const fetchDatasetItems = async () => {
    setIsLoading(true);
    try {
      // Convert selected filters to comma-separated strings
      const speciesFilter = selectedSpecies.length > 0 ? selectedSpecies.join(',') : undefined;
      const classFilter = selectedClasses.length > 0 ? selectedClasses.join(',') : undefined;
      const mutationFilter = selectedMutations.length > 0 ? selectedMutations.join(',') : undefined;
      
      console.log('Fetching dataset with params:', {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        sortBy,
        sortOrder,
        species: speciesFilter,
        class: classFilter,
        mutationType: mutationFilter
      });
      
      const data: PaginatedResponse<DatasetItem> = await fetchDatasetPaginated(
        currentPage,
        itemsPerPage,
        searchQuery,
        sortBy,
        sortOrder,
        speciesFilter,
        classFilter,
        mutationFilter
      );
      
      setDatasetItems(data.data);
      setTotalItems(data.pagination.totalItems);
      setAllEvolfIds(data.all_evolf_ids || []);
      
      // Update statistics if available
      if (data.statistics) {
        setStatistics({
          totalRows: data.statistics.totalRows,
          uniqueClasses: data.statistics.uniqueClasses,
          uniqueSpecies: data.statistics.uniqueSpecies,
          uniqueMutationTypes: data.statistics.uniqueMutationTypes
        });
        
        // Calculate filter counts (for now using statistics, could be enhanced with actual counts per filter)
        const speciesCounts: Record<string, number> = {};
        const classCounts: Record<string, number> = {};
        const mutationCounts: Record<string, number> = {};
        
        data.statistics.uniqueSpecies.forEach(species => {
          speciesCounts[species] = Math.floor(Math.random() * 500) + 10; // TODO: Replace with actual counts from backend
        });
        
        data.statistics.uniqueClasses.forEach(cls => {
          classCounts[cls] = Math.floor(Math.random() * 1000) + 50; // TODO: Replace with actual counts from backend
        });
        
        data.statistics.uniqueMutationTypes.forEach(mutation => {
          mutationCounts[mutation] = Math.floor(Math.random() * 300) + 5; // TODO: Replace with actual counts from backend
        });
        
        setFilterCounts({
          species: speciesCounts,
          classes: classCounts,
          mutations: mutationCounts
        });
      }
    } catch (error) {
      console.error('Error fetching dataset:', error);
      toast({
        title: 'Error Loading Data',
        description: 'Failed to fetch dataset from API.',
        variant: 'destructive',
      });
      
      setDatasetItems([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  /**
   * Handle sorting
   */
  const handleSort = (field: SortField) => {
    console.log('Sorting by field:', field);
    if (sortBy === field) {
      // Toggle sort order if same field
      const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      console.log('Toggling sort order to:', newOrder);
      setSortOrder(newOrder);
    } else {
      // Set new sort field and default to ascending
      console.log('Setting new sort field:', field, 'with order: asc');
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  /**
   * Get sort icon for a column
   */
  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) {
      return <ChevronDown className="w-4 h-4 opacity-50" />;
    }
    return sortOrder === 'asc' ? 
      <ChevronDown className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4 rotate-180" />;
  };

  /**
   * Download filtered dataset by evolf IDs (ZIP)
   */
  const downloadDataset = async () => {
    try {
      const blob = await downloadDatasetByIds(allEvolfIds);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evolf-dataset-${allEvolfIds.length}-items.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Export Started',
        description: `Exporting ${allEvolfIds.length} items as ZIP file.`,
      });
    } catch (error) {
      console.error('Error exporting dataset:', error);
      toast({
        title: 'Export Failed',
        description: 'Could not export dataset. Please try again.',
        variant: 'destructive',
      });
    }
  };

  /**
   * Download complete dataset (all data)
   */
  const handleDownloadAll = async () => {
    try {
      setIsDownloading(true);
      const blob = await downloadCompleteDataset();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evolf-complete-dataset-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: 'Complete Dataset Downloaded',
        description: 'Successfully downloaded the complete EvOlf dataset.',
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download Failed',
        description: 'Failed to download complete dataset. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * Fetch search suggestions
   */
  const fetchSearchSuggestions = async (query: string) => {
    if (!query || query.trim().length === 0) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchDataset(query);
      setSearchSuggestions(data.results || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      setSearchSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Handle search input change with debounce
   */
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Clear previous debounce timeout
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    // Debounce search suggestions
    if (value.trim().length > 0) {
      searchDebounceRef.current = setTimeout(() => {
        fetchSearchSuggestions(value);
      }, 300);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  /**
   * Handle suggestion click
   */
  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.Receptor || suggestion.Ligand || suggestion.Species || '');
    setShowSuggestions(false);
    setCurrentPage(1);
  };

  /**
   * Handle search submit
   */
  const handleSearchSubmit = () => {
    setShowSuggestions(false);
    setCurrentPage(1);
  };

  /**
   * Handle page change
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Handle filter checkbox changes
   */
  const toggleFilter = (type: 'species' | 'class' | 'mutation', value: string) => {
    if (type === 'species') {
      setSelectedSpecies(prev => 
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else if (type === 'class') {
      setSelectedClasses(prev => 
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else if (type === 'mutation') {
      setSelectedMutations(prev => 
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    }
    setCurrentPage(1); // Reset to first page when filters change
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setSelectedSpecies([]);
    setSelectedClasses([]);
    setSelectedMutations([]);
    setCurrentPage(1);
  };
  
  /**
   * Apply filters and close modal
   */
  const applyFilters = () => {
    setShowFilterModal(false);
    setCurrentPage(1);
    fetchDatasetItems();
  };

  /**
   * Generate page numbers for pagination
   */
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis');
      }
      
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  /**
   * Handle card click to view details
   */
  const handleCardClick = (item: DatasetItem) => {
    console.log('Viewing details for:', item.evolfId);
    // navigate(`/dataset/${item.evolfId}`);
  };

  // Fetch data when page, search, sort, or filters change
  useEffect(() => {
    fetchDatasetItems();
  }, [currentPage, searchQuery, sortBy, sortOrder, selectedSpecies, selectedClasses, selectedMutations]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Dynamic statistics data from backend
  const stats = [
    { 
      label: 'Total Interactions', 
      value: "10,234", 
      change: 'Curated records', 
      icon: Database, 
      color: 'text-[hsl(var(--brand-teal))]',
      bgColor: 'bg-[hsl(var(--brand-teal))]/10'
    },
    { 
      label: 'GPCR Classes', 
      value: 487, 
      change: 'Unique classes', 
      icon: Dna, 
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    { 
      label: 'Species', 
      value: "3,542", 
      change: 'Organisms studied', 
      icon: FlaskConical, 
      color: 'text-[hsl(var(--brand-purple))]',
      bgColor: 'bg-[hsl(var(--brand-purple))]/10'
    },
    { 
      label: 'Mutation Types', 
      value: "1,876", 
      change: 'Variants analyzed', 
      icon: CheckCircle, 
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    },
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

  // Check if any filters are active
  const areFiltersActive = selectedSpecies.length > 0 || selectedClasses.length > 0 || selectedMutations.length > 0;

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
                  <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                  <p className="text-muted-foreground text-xs">{stat.change}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full sm:min-w-[180px] sm:w-auto justify-between bg-background/50 border-border/50 hover:border-[hsl(var(--brand-teal))]/50"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4" />
                      <span className="capitalize">{sortBy === 'evolfId' ? 'EvOlf ID' : sortBy}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px] bg-background border-border z-50">
                  <DropdownMenuItem onClick={() => handleSort('evolfId')} className="cursor-pointer">
                    EvOlf ID {sortBy === 'evolfId' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('receptor')} className="cursor-pointer">
                    Receptor Name {sortBy === 'receptor' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('ligand')} className="cursor-pointer">
                    Ligand Name {sortBy === 'ligand' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('species')} className="cursor-pointer">
                    Species {sortBy === 'species' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('class')} className="cursor-pointer">
                    Class {sortBy === 'class' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filters Button */}
              <Button 
                variant="outline" 
                className="w-full sm:w-auto border-border/50 bg-background/50 hover:border-[hsl(var(--brand-teal))]/50 hover:bg-[hsl(var(--brand-teal))]/10"
                onClick={() => setShowFilterModal(true)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters {areFiltersActive && `(${selectedSpecies.length + selectedClasses.length + selectedMutations.length})`}
              </Button>

              {/* Export Button */}
              <Button 
                className="w-full sm:w-auto bg-[hsl(var(--brand-teal))] text-foreground hover:bg-[hsl(var(--brand-teal))]/90"
                onClick={downloadDataset}
                disabled={allEvolfIds.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-muted-foreground text-sm">
                {isInitialLoad ? 'Start searching...' : `${totalItems.toLocaleString()} interactions found`}
                {areFiltersActive && ' (filtered)'}
              </p>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="mb-8">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[hsl(var(--brand-teal))]" />
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search by EvOlf ID, receptor name, ligand, ChEMBL ID, species..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearchSubmit();
                        } else if (e.key === 'Escape') {
                          setShowSuggestions(false);
                        }
                      }}
                      onFocus={() => {
                        if (searchSuggestions.length > 0) {
                          setShowSuggestions(true);
                        }
                      }}
                      className="pl-12 h-14 text-base bg-background/50 border-border/50 focus:border-[hsl(var(--brand-teal))] transition-colors"
                    />
                    
                    {/* Autocomplete Suggestions Dropdown */}
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                        {isSearching && (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="w-5 h-5 animate-spin text-[hsl(var(--brand-teal))]" />
                          </div>
                        )}
                        
                        {!isSearching && searchSuggestions.map((suggestion, index) => (
                          <div
                            key={`${suggestion.EvOlf_ID}-${index}`}
                            className="p-4 hover:bg-accent/50 cursor-pointer border-b border-border/50 last:border-b-0 transition-colors"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs bg-[hsl(var(--brand-teal))]/10 text-[hsl(var(--brand-teal))] border-[hsl(var(--brand-teal))]/30">
                                    {suggestion.EvOlf_ID}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{suggestion.Species}</span>
                                </div>
                                <p className="font-medium text-sm truncate">{suggestion.Receptor}</p>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">{suggestion.Ligand}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                            </div>
                          </div>
                        ))}
                        
                        <div className="p-2 bg-muted/30 text-center">
                          <p className="text-xs text-muted-foreground">
                            Showing {searchSuggestions.length} suggestion{searchSuggestions.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button 
                    size="lg"
                    className="h-14 px-6 bg-[hsl(var(--brand-teal))] text-foreground hover:bg-[hsl(var(--brand-teal))]/90"
                    onClick={handleSearchSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </div>


                {searchQuery && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p>
                      {totalItems > 0 ? (
                        <>Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems.toLocaleString()} interactions</>
                      ) : (
                        <>No results found for "{searchQuery}"</>
                      )}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSearchChange('')}
                      className="text-[hsl(var(--brand-teal))] hover:text-[hsl(var(--brand-teal))]/80"
                    >
                      Clear search
                    </Button>
                  </div>
                )}
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
            ) : datasetItems.length === 0 && !isInitialLoad ? (
              <Card className="p-12 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex flex-col items-center gap-4 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground" />
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-2">
                      {searchQuery || areFiltersActive ? 'No Results Found' : 'No Data Available'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery || areFiltersActive 
                        ? 'Try adjusting your search terms or filters.'
                        : 'No dataset entries found.'
                      }
                    </p>
                  </div>
                </div>
              </Card>
            ) : datasetItems.length > 0 ? (
              <div className="space-y-3">
                {/* Sorting Header - Hidden on Mobile */}
                <Card className="hidden md:block p-4 bg-card/30 backdrop-blur-sm border-border/50">
                  <div className="grid grid-cols-[auto,1fr,1fr,auto,auto,auto,auto] gap-6 items-center text-sm text-muted-foreground font-medium">
                    {/* EvOlf ID */}
                    <div 
                      className="flex items-center gap-1 min-w-[120px] cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('evolfId')}
                    >
                      <span>EvOlf ID</span>
                      {getSortIcon('evolfId')}
                    </div>

                    {/* Receptor */}
                    <div 
                      className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('receptor')}
                    >
                      <span>Receptor</span>
                      {getSortIcon('receptor')}
                    </div>

                    {/* Ligand */}
                    <div 
                      className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('ligand')}
                    >
                      <span>Ligand</span>
                      {getSortIcon('ligand')}
                    </div>

                    {/* Class */}
                    <div 
                      className="flex items-center gap-1 min-w-[100px] cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => handleSort('class')}
                    >
                      <span>Class</span>
                      {getSortIcon('class')}
                    </div>

                    {/* Mutation */}
                    <div className="min-w-[100px]">
                      Mutation
                    </div>

                    {/* Database IDs */}
                    <div className="min-w-[140px]">
                      Database IDs
                    </div>

                    {/* Actions */}
                    <div className="min-w-[40px]"></div>
                  </div>
                </Card>

                {/* Dataset Items */}
                {datasetItems.map((item) => (
                  <Card 
                    key={item.evolfId}
                    className="p-4 md:p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-[hsl(var(--brand-teal))]/50 transition-all cursor-pointer group"
                    onClick={() => handleCardClick(item)}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[auto,1fr,1fr,auto,auto,auto,auto] gap-4 md:gap-6">
                      {/* EvOlf ID */}
                      <div className="flex flex-col gap-1 md:gap-2 md:min-w-[120px]">
                        <p className="text-xs text-muted-foreground font-medium md:block">EvOlf ID</p>
                        <p className="text-[hsl(var(--brand-teal))] font-mono text-sm font-semibold">
                          {item.evolfId}
                        </p>
                      </div>

                      {/* Receptor & Species */}
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-muted-foreground font-medium md:block">Receptor</p>
                        <p className="font-heading font-semibold text-sm md:text-base">{item.receptor}</p>
                        <p className="text-xs md:text-sm text-muted-foreground italic">{item.species}</p>
                      </div>

                      {/* Ligand & ChEMBL/PubMed ID */}
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-muted-foreground font-medium md:block">Ligand</p>
                        <p className="font-heading font-semibold text-sm md:text-base">{item.ligand}</p>
                        {item.chemblId.startsWith('CHEMBL') ? (
                          <a
                            href={`https://www.ebi.ac.uk/chembl/compound_report_card/${item.chemblId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[hsl(var(--brand-teal))] hover:underline text-xs md:text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.chemblId}
                          </a>
                        ) : (
                          <a
                            href={`https://pubmed.ncbi.nlm.nih.gov/${item.chemblId.replace('PMID:', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[hsl(var(--brand-teal))] hover:underline text-xs md:text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.chemblId}
                          </a>
                        )}
                      </div>

                      {/* Class */}
                      <div className="flex flex-col gap-1 md:gap-2 md:min-w-[100px]">
                        <p className="text-xs text-muted-foreground font-medium md:block">Class</p>
                        <Badge 
                          variant="secondary" 
                          className="w-fit bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs"
                        >
                          {item.class}
                        </Badge>
                      </div>

                      {/* Mutation */}
                      <div className="flex flex-col gap-1 md:gap-2 md:min-w-[100px]">
                        <p className="text-xs text-muted-foreground font-medium md:block">Mutation</p>
                        {item.mutation && item.mutation !== 'Wild-type' ? (
                          <Badge 
                            variant="secondary" 
                            className="w-fit bg-[hsl(var(--brand-purple))]/10 text-[hsl(var(--brand-purple))] border-[hsl(var(--brand-purple))]/20 font-mono text-xs"
                          >
                            {item.mutation}
                          </Badge>
                        ) : (
                          <span className="text-xs md:text-sm text-muted-foreground">Wild-type</span>
                        )}
                      </div>

                      {/* UniProt/Ensemble */}
                      <div className="flex flex-col gap-1 md:gap-2 md:min-w-[140px]">
                        <p className="text-xs text-muted-foreground font-medium md:block">Database IDs</p>
                        <div className="flex flex-col gap-1">
                          {item.uniprotId && (
                            <a
                              href={`https://www.uniprot.org/uniprot/${item.uniprotId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[hsl(var(--brand-teal))] hover:underline text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              UniProt: {item.uniprotId}
                            </a>
                          )}
                          {item.ensembleId && (
                            <a
                              href={`https://www.ensembl.org/id/${item.ensembleId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[hsl(var(--brand-teal))] hover:underline text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Ensembl: {item.ensembleId}
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Arrow - Hidden on Mobile */}
                      <div className="hidden md:flex items-center justify-center">
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[hsl(var(--brand-teal))] transition-colors" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : null}
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
                {areFiltersActive && ' (filtered)'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <Button 
              className="bg-[hsl(var(--brand-teal))] text-foreground hover:bg-[hsl(var(--brand-teal))]/90"
              onClick={() => {
                setCurrentPage(1);
                setSearchQuery('');
                clearFilters();
                fetchDatasetItems();
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button 
              className="bg-[hsl(var(--brand-teal))] text-foreground hover:bg-[hsl(var(--brand-teal))]/90"
              onClick={handleDownloadAll}
              disabled={isDownloading}
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download All Data'}
            </Button>
          </div>
        </div>
      </main>

      {/* Filter Modal */}
      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background border-border">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-heading">Filter Results</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilterModal(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">Refine your search with advanced filters</p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* GPCR Class Filter */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">GPCR Class</h3>
              <div className="space-y-2">
                {statistics.uniqueClasses.map((cls) => (
                  <div key={cls} className="flex items-center space-x-3 p-2 hover:bg-accent/50 rounded-md transition-colors">
                    <Checkbox
                      id={`class-${cls}`}
                      checked={selectedClasses.includes(cls)}
                      onCheckedChange={() => toggleFilter('class', cls)}
                    />
                    <label
                      htmlFor={`class-${cls}`}
                      className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {cls}
                      {filterCounts.classes[cls] && (
                        <span className="ml-2 text-muted-foreground">({filterCounts.classes[cls]})</span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Species Filter */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Species</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {statistics.uniqueSpecies.map((species) => (
                  <div key={species} className="flex items-center space-x-3 p-2 hover:bg-accent/50 rounded-md transition-colors">
                    <Checkbox
                      id={`species-${species}`}
                      checked={selectedSpecies.includes(species)}
                      onCheckedChange={() => toggleFilter('species', species)}
                    />
                    <label
                      htmlFor={`species-${species}`}
                      className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer italic"
                    >
                      {species}
                      {filterCounts.species[species] && (
                        <span className="ml-2 text-muted-foreground not-italic">({filterCounts.species[species]})</span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Mutation Status Filter */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Mutation Status</h3>
              <div className="space-y-2">
                {statistics.uniqueMutationTypes.map((mutation) => (
                  <div key={mutation} className="flex items-center space-x-3 p-2 hover:bg-accent/50 rounded-md transition-colors">
                    <Checkbox
                      id={`mutation-${mutation}`}
                      checked={selectedMutations.includes(mutation)}
                      onCheckedChange={() => toggleFilter('mutation', mutation)}
                    />
                    <label
                      htmlFor={`mutation-${mutation}`}
                      className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {mutation}
                      {filterCounts.mutations[mutation] && (
                        <span className="ml-2 text-muted-foreground">({filterCounts.mutations[mutation]})</span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={!areFiltersActive}
            >
              Clear All
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilterModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[hsl(var(--brand-teal))] text-foreground hover:bg-[hsl(var(--brand-teal))]/90"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default DatabaseDashboard;