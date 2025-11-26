/**
 * API Configuration and Utility Functions
 * 
 * This file provides a complete API client for interacting with the backend.
 * It includes error handling, request timeouts, and type-safe methods.
 * 
 * ============================================================================
 * REST API ENDPOINTS
 * ============================================================================
 * 
 * Base URL: https://api.evolf.com/v1 (or set via VITE_API_BASE_URL env variable)
 * 
 * Available Endpoints:
 * - GET  /interactions       - Retrieve interaction data
 * - POST /predict           - Submit prediction requests
 * - GET  /receptors         - List available GPCR receptors
 * - GET  /dataset           - Get paginated dataset with filters
 * - GET  /dataset/count     - Get total count of dataset items
 * - GET  /dataset/:id       - Get single dataset item by ID
 * - GET  /model/prediction/:id - Get prediction result by ID
 * 
 * ============================================================================
 * AUTHENTICATION
 * ============================================================================
 * 
 * API access requires authentication via API key.
 * Include your key in the request header:
 * 
 *   Authorization: Bearer YOUR_API_KEY
 * 
 * ============================================================================
 * RESPONSE FORMAT
 * ============================================================================
 * 
 * All responses are returned in JSON format with standardized structure:
 * 
 * {
 *   "status": "success",
 *   "data": {...},
 *   "meta": {...}
 * }
 * 
 * ============================================================================
 * CODE EXAMPLES
 * ============================================================================
 * 
 * Sample code snippets available for Python, R, JavaScript, and cURL.
 * Visit the GitHub repository for complete examples and client libraries.
 */

// ============================================================================
// API CONFIGURATION
// ============================================================================

/**
 * Core API configuration object
 * 
 * BACKEND SETUP INSTRUCTIONS:
 * 1. Set VITE_API_BASE_URL in your .env file to point to your backend
 *    Example: VITE_API_BASE_URL=https://your-api.com/api
 * 2. Ensure your backend supports CORS for the frontend domain
 * 3. All API responses should return JSON format
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL ||  "http://192.168.24.13:3000/api",
  TIMEOUT: 30000, // 30 second timeout for all requests
  HEADERS: {
    'Content-Type': 'application/json',
  },
};


// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Custom API Error Class
 * Provides structured error information from API responses
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,      // HTTP status code
    public data?: any            // Additional error data from backend
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================================================
// GENERIC API REQUEST HANDLER
// ============================================================================

/**
 * Generic API request function with error handling and timeout
 * 
 * @param endpoint - API endpoint path (e.g., '/dataset')
 * @param options - Fetch API options
 * @returns Promise with typed response data
 * 
 * FEATURES:
 * - Automatic timeout after 30 seconds
 * - Structured error handling
 * - Automatic JSON parsing
 * - Request cancellation support
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.HEADERS,
      ...options.headers,
    },
  };

  try {
    // Setup request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || 'API request failed',
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new ApiError(error.message);
    }
    throw new ApiError('Unknown error occurred');
  }
}

// ============================================================================
// BASE API METHODS
// ============================================================================

/**
 * Core API methods for making HTTP requests
 * These wrap the generic apiRequest function with specific HTTP methods
 */
export const api = {
  /**
   * GET request
   * Use for retrieving data
   */
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  /**
   * POST request
   * Use for creating new resources
   */
  post: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * PUT request
   * Use for updating entire resources
   */
  put: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * PATCH request
   * Use for partial updates
   */
  patch: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * DELETE request
   * Use for deleting resources
   */
  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

// ============================================================================
// INDEPENDENT ENDPOINT FUNCTIONS
// ============================================================================

/**
 * Fetch paginated dataset items with filters
 * Endpoint: GET /dataset
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 20)
 * @param search - Search query (optional)
 * @param sortBy - Sort field (default: 'EvOlf_ID')
 * @param sortOrder - Sort direction (default: 'desc')
 * @param species - Filter by species (optional) 
 * @param classFilter - Filter by GPCR class (optional)
 * @param mutationType - Filter by mutation type (optional)
 * @returns Response with data, pagination, and statistics
 */
export async function fetchDatasetPaginated(
  page: number = 1,
  limit: number = 20,
  search?: string,
  sortBy: string = 'EvOlf_ID',
  sortOrder: 'asc' | 'desc' = 'desc',
  species?: string,
  classFilter?: string,
  mutationType?: string
) {
  // Map frontend field names to backend field names
  const fieldMapping: Record<string, string> = {
    'evolfId': 'EvOlf_ID',
    'receptor': 'Receptor',
    'ligand': 'Ligand',
    'species': 'Species',
    'class': 'Class',
    'mutation': 'Mutation'
  };
  
  const backendSortBy = fieldMapping[sortBy] || sortBy;
  
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  if (search && search.trim()) queryParams.append('search', search.trim());
  queryParams.append('sortBy', backendSortBy);
  queryParams.append('sortOrder', sortOrder);
  if (species) queryParams.append('species', species);
  if (classFilter) queryParams.append('class', classFilter);
  if (mutationType) queryParams.append('mutationType', mutationType);

  const url = `${API_CONFIG.BASE_URL}/dataset?${queryParams.toString()}`;
  console.log('API Request URL:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: API_CONFIG.HEADERS,
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch dataset: ${response.statusText}`, response.status);
  }

  const apiResponse = await response.json();
  
  // Transform API response field names from API format to frontend format
  // API returns camelCase fields with class_field instead of class
  const transformDataItem = (item: any) => ({
    id: item.id?.toString() || '',
    evolfId: item.evolfId || '',
    receptor: item.receptor || '',
    species: item.species || '',
    ligand: item.ligand || '',
    chemblId: item.chemblId || '',
    mutation: item.mutation || '',
    class: item.class_field || item.class || '',  // Handle class_field from API
    uniprotId: item.uniprotId || '',
    ensembleId: item.ensembleId || '',
    cid: item.cid || ''
  });
  
  // Transform API response to match expected structure
  // API directly returns: { data, pagination, statistics, filterOptions, all_evolf_ids }
  const transformedData = (apiResponse.data || []).map(transformDataItem);
  
  return {
    data: transformedData,
    pagination: apiResponse.pagination || {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: 0,
      totalPages: 0
    },
    statistics: apiResponse.statistics || {
      totalRows: 0,
      uniqueClasses: [],
      uniqueSpecies: [],
      uniqueMutationTypes: []
    },
    all_evolf_ids: apiResponse.all_evolf_ids || transformedData.map(item => item.evolfId),
    // Map API filterOptions (uniqueX) to frontend format (x)
    filterOptions: {
      classes: apiResponse.filterOptions?.uniqueClasses || [],
      species: apiResponse.filterOptions?.uniqueSpecies || [],
      mutationTypes: apiResponse.filterOptions?.uniqueMutationTypes || []
    }
  };
}

/**
 * Fetch detailed data for a specific EvOlf ID
 * Endpoint: GET /dataset/details/:evolfId
 * @param evolfId - The EvOlf ID to fetch details for
 * @returns Detailed dataset entry information
 */
export async function fetchDatasetDetail(evolfId: string) {
  const url = `${API_CONFIG.BASE_URL}/dataset/details/${evolfId}`;
  console.log('API Request URL:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: API_CONFIG.HEADERS,
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch dataset detail: ${response.statusText}`, response.status);
  }

  const apiResponse = await response.json();
  
  // Transform API response to match frontend structure
  return {
    evolfId: apiResponse.evolfId || '',
    receptor: apiResponse.receptor || '',
    receptorName: apiResponse.receptor || '',
    ligand: apiResponse.ligand || '',
    ligandName: apiResponse.ligand || '',
    species: apiResponse.species || '',
    mutation: apiResponse.mutation || '',
    mutationType: apiResponse.mutationType || '',
    mutationImpact: apiResponse.mutationImpact || '',
    mutationStatus: apiResponse.mutationStatus || '',
    class: apiResponse.class_field || apiResponse.class || '',
    receptorSubtype: apiResponse.receptorSubtype || '',
    uniprotId: apiResponse.uniprotId || '',
    uniprotLink: apiResponse.uniprotLink || '',
    chemblId: apiResponse.chemblId || '',
   
    cid: apiResponse.cid || '',
    pubchemId: apiResponse.pubchemId || '',
    pubchemLink: apiResponse.pubchemLink || '',
    
    
    
    value: apiResponse.value || '',
    method: apiResponse.method || '',
    structure2d: apiResponse.structure2d || '',
    image: apiResponse.image || '',
    comments: apiResponse.comments || '',
    geneSymbol: apiResponse.geneSymbol || '',
    
 
    // New fields for 3D structures and sequences
    sequence: apiResponse.sequence || '',
    smiles: apiResponse.smiles || '',
    inchi: apiResponse.inchi || '',
    inchiKey: apiResponse.inchiKey || '',
    iupacName: apiResponse.iupacName || '',
    pdbData: apiResponse.pdbData || '',
    sdfData: apiResponse.sdfData || '',
    structure3d: apiResponse.structure3d || '', 
    source:apiResponse.source || "",
    sourceLinks: apiResponse.sourceLinks || "",
  };
}

/**
 * Download dataset by evolf IDs (returns ZIP)
 * Endpoint: POST /dataset/export
 * @param evolfIds - Array of evolf IDs to export
 * @returns Blob (ZIP file) for download
 */
export async function downloadDatasetByIds(evolfIds: string[]) {
  const response = await fetch(`${API_CONFIG.BASE_URL}/dataset/export`, {
    method: 'POST',
    headers: API_CONFIG.HEADERS,
    body: JSON.stringify({ evolfIds }),
  });

  if (!response.ok) {
    throw new ApiError(`Failed to export dataset: ${response.statusText}`, response.status);
  }

  return await response.blob();
}

/**
 * Download single dataset entry by evolf ID (returns ZIP)
 * Endpoint: GET /dataset/export/:evolfId
 * @param evolfId - Single evolf ID to export
 * @returns Blob (ZIP file) for download
 */
export async function downloadDatasetByEvolfId(evolfId: string) {
  const response = await fetch(`${API_CONFIG.BASE_URL}/dataset/export/${evolfId}`, {
    method: 'GET',
    headers: API_CONFIG.HEADERS,
  });

  if (!response.ok) {
    throw new ApiError(`Failed to export dataset entry: ${response.statusText}`, response.status);
  }

  return await response.blob();
}

/**
 * Download complete dataset (returns ZIP)
 * Endpoint: GET /dataset/download
 * @returns Blob (ZIP file) for download
 */
export async function downloadCompleteDataset() {
  const response = await fetch(`${API_CONFIG.BASE_URL}/dataset/download`, {
    method: 'GET',
    headers: API_CONFIG.HEADERS,
  });

  if (!response.ok) {
    throw new ApiError(`Failed to download complete dataset: ${response.statusText}`, response.status);
  }

  return await response.blob();
}

/**
 * Submit prediction request with receptor and ligands
 * Endpoint: POST /predict
 * 
 * Request Body Format:
 * {
 *   receptor: {
 *     sequence: string,        // FASTA format sequence
 *     name?: string           // Optional receptor name
 *   },
 *   ligands: Array<{
 *     smiles: string,         // SMILES notation
 *     name?: string          // Optional ligand name
 *   }>
 * }
 * 
 * Response Format:
 * {
 *   jobId: string,              // Job ID for tracking prediction
 *   message: string             // Status message
 * }
 * 
 * @param data - Prediction request data with receptor and ligands
 * @returns Prediction response with job ID
 */
// lib/api.ts

export type PredictionRequestBody = {
  smiles: string;
  mutated_sequence?: string;
  temp_ligand_id?: string;
  temp_rec_id?: string;
  id?: string;
};

export async function submitPrediction(data: PredictionRequestBody) {
  const response = await fetch(`${API_CONFIG.BASE_URL}/predict/smiles/`, {
    method: 'POST',
    headers: {
      ...API_CONFIG.HEADERS,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `Failed to submit prediction: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  return await response.json();
}


/**
 * Get prediction job status and results
 * Endpoint: GET /predict/job/:jobId
 * 
 * Response Format:
 * {
 *   status: "running" | "completed" | "expired",
 *   jobId: string,
 *   results?: {
 *     downloadUrl?: string,     // URL to download results ZIP
 *     ligands: Array<{
 *       name?: string,
 *       smiles: string,
 *       predictedAffinity: number,
 *       confidenceScore: number,
 *       affinityClass: string
 *     }>
 *   },
 *   expiresAt?: string,         // ISO timestamp when job expires
 *   createdAt?: string          // ISO timestamp when job was created
 * }
 * 
 

/**
 * Get prediction job status and metadata.
 * Maps backend "finished" -> frontend "completed".
 */
export async function getPredictionJobStatus(jobId: string) {
  if (!jobId) throw new ApiError("Missing jobId", 400);

  const url = `${API_CONFIG.BASE_URL}/predict/job/${encodeURIComponent(jobId)}/`; // note trailing slash
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      ...API_CONFIG.HEADERS, // but don't include Content-Type for GET
      Accept: 'application/json',
    }
  });

  // treat 404 specially (job removed / expired)
  if (resp.status === 404) {
    const body = await safeJson(resp);
    const err = new ApiError('Job not found', 404);
    (err as any).body = body;
    throw err;
  }

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new ApiError(text || `HTTP ${resp.status}`, resp.status);
  }

  const data = await resp.json().catch(() => ({}));

  // normalize backend status -> frontend
  const normalized = { ...data };
  if (data.status === 'finished') normalized.status = 'completed';

  return normalized;
}

/**
 * Download prediction results as ZIP.
 * Uses the job endpoint with ?download=output so it matches backend implementation.
 */
export async function downloadPredictionResults(jobId: string) {
  if (!jobId) throw new ApiError("Missing jobId", 400);

  const url = `${API_CONFIG.BASE_URL}/predict/job/${encodeURIComponent(jobId)}/?download=output`;
  const resp = await fetch(url, {
    method: 'GET'
    // no Content-Type header
  });

  if (resp.status === 404) {
    const body = await safeJson(resp);
    const err = new ApiError('Output not found', 404);
    (err as any).body = body;
    throw err;
  }

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new ApiError(text || `HTTP ${resp.status}`, resp.status);
  }

  const blob = await resp.blob();
  return blob;
}

/** helper to safely parse json (returns null on parse failure) */
async function safeJson(resp: Response) {
  try {
    return await resp.json();
  } catch {
    return null;
  }
}



/**
 * Search dataset with autocomplete suggestions
 * Endpoint: GET /search/?q={query}
 * 
 * Response Format:
 * {
 *   results: Array<{
 *     EvOlf_ID: string,
 *     Receptor: string,
 *     Ligand: string,
 *     Species: string
 *   }>
 * }
 * 
 * @param query - Search query string
 * @returns Array of search results
 */
export async function searchDataset(query: string) {
  if (!query || query.trim().length === 0) {
    return { results: [] };
  }

  const queryParams = new URLSearchParams();
  queryParams.append('q', query.trim());

  const response = await fetch(`${API_CONFIG.BASE_URL}/search/?${queryParams.toString()}`, {
    method: 'GET',
    headers: API_CONFIG.HEADERS,
  });

  if (!response.ok) {
    throw new ApiError(`Failed to search dataset: ${response.statusText}`, response.status);
  }

  return await response.json();
}



