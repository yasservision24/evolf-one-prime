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
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
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
 * @param sortBy - Sort field (default: 'evolfId')
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
  sortBy: string = 'evolfId',
  sortOrder: 'asc' | 'desc' = 'desc',
  species?: string,
  classFilter?: string,
  mutationType?: string
) {
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  if (search && search.trim()) queryParams.append('search', search.trim());
  queryParams.append('sortBy', sortBy);
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

  return await response.json();
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
 * Fetch dataset statistics
 * Endpoint: GET /dataset/stats
 * @returns Statistics object with total receptors, ligands, mutations, etc.
 */
export async function fetchDatasetStats() {
  const response = await fetch(`${API_CONFIG.BASE_URL}/dataset/stats`, {
    method: 'GET',
    headers: API_CONFIG.HEADERS,
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch dataset stats: ${response.statusText}`, response.status);
  }

  return await response.json();
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
export async function submitPrediction(data: {
  receptor: {
    sequence: string;
    name?: string;
  };
  ligands: Array<{
    smiles: string;
    name?: string;
  }>;
}) {
  const response = await fetch(`${API_CONFIG.BASE_URL}/predict`, {
    method: 'POST',
    headers: API_CONFIG.HEADERS,
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
 * @param jobId - Job ID from prediction submission
 * @returns Job status and results
 */
export async function getPredictionJobStatus(jobId: string) {
  const response = await fetch(`${API_CONFIG.BASE_URL}/predict/job/${jobId}`, {
    method: 'GET',
    headers: API_CONFIG.HEADERS,
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch prediction job: ${response.statusText}`, response.status);
  }

  return await response.json();
}

/**
 * Download prediction results as ZIP
 * Endpoint: GET /predict/download/:jobId
 * @param jobId - Job ID from prediction submission
 * @returns Blob (ZIP file) for download
 */
export async function downloadPredictionResults(jobId: string) {
  const response = await fetch(`${API_CONFIG.BASE_URL}/predict/download/${jobId}`, {
    method: 'GET',
    headers: API_CONFIG.HEADERS,
  });

  if (!response.ok) {
    throw new ApiError(`Failed to download results: ${response.statusText}`, response.status);
  }

  return await response.blob();
}


/**
 * Fetch GPCR receptors list
 * Endpoint: GET /receptors
 * @returns List of available receptors
 */
export async function fetchReceptors() {
  const response = await fetch(`${API_CONFIG.BASE_URL}/receptors`, {
    method: 'GET',
    headers: API_CONFIG.HEADERS,
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch receptors: ${response.statusText}`, response.status);
  }

  return await response.json();
}

/**
 * Fetch interactions data
 * Endpoint: GET /interactions
 * @returns Interaction data
 */
export async function fetchInteractions() {
  const response = await fetch(`${API_CONFIG.BASE_URL}/interactions`, {
    method: 'GET',
    headers: API_CONFIG.HEADERS,
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch interactions: ${response.statusText}`, response.status);
  }

  return await response.json();
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

/**
 * Fetch single dataset entry by EvOlf ID
 * Endpoint: GET /dataset/:evolfId
 * 
 * Response Format:
 * {
 *   entry: {
 *     evolfId: string,
 *     receptorName: string,
 *     geneSymbol: string,
 *     uniprotId: string,
 *     // ... all detailed fields
 *   }
 * }
 * 
 * @param evolfId - EvOlf ID of the entry
 * @returns Detailed entry data
 */
export async function fetchDatasetEntry(evolfId: string) {
  const response = await fetch(`${API_CONFIG.BASE_URL}/dataset/${evolfId}`, {
    method: 'GET',
    headers: API_CONFIG.HEADERS,
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch dataset entry: ${response.statusText}`, response.status);
  }

  return await response.json();
}

/**
 * Fetch receptor details for specific entry
 * Endpoint: GET /dataset/:evolfId/receptor
 * 
 * @param evolfId - EvOlf ID of the entry
 * @returns Receptor details including sequence, mutations, etc.
 */
export async function fetchReceptorDetails(evolfId: string) {
  const response = await fetch(`${API_CONFIG.BASE_URL}/dataset/${evolfId}/receptor`, {
    method: 'GET',
    headers: API_CONFIG.HEADERS,
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch receptor details: ${response.statusText}`, response.status);
  }

  return await response.json();
}

/**
 * Fetch ligand details for specific entry
 * Endpoint: GET /dataset/:evolfId/ligand
 * 
 * @param evolfId - EvOlf ID of the entry
 * @returns Ligand details including chemical properties, identifiers, etc.
 */
export async function fetchLigandDetails(evolfId: string) {
  const response = await fetch(`${API_CONFIG.BASE_URL}/dataset/${evolfId}/ligand`, {
    method: 'GET',
    headers: API_CONFIG.HEADERS,
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch ligand details: ${response.statusText}`, response.status);
  }

  return await response.json();
}

/**
 * Fetch interaction data for specific entry
 * Endpoint: GET /dataset/:evolfId/interaction
 * 
 * @param evolfId - EvOlf ID of the entry
 * @returns Interaction data including binding affinity, experimental conditions, etc.
 */
export async function fetchInteractionDetails(evolfId: string) {
  const response = await fetch(`${API_CONFIG.BASE_URL}/dataset/${evolfId}/interaction`, {
    method: 'GET',
    headers: API_CONFIG.HEADERS,
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch interaction details: ${response.statusText}`, response.status);
  }

  return await response.json();
}

/**
 * Fetch 3D structure data for specific entry
 * Endpoint: GET /dataset/:evolfId/structures
 * 
 * @param evolfId - EvOlf ID of the entry
 * @returns 3D structure data including PDB, SDF files, etc.
 */
export async function fetch3DStructures(evolfId: string) {
  const response = await fetch(`${API_CONFIG.BASE_URL}/dataset/${evolfId}/structures`, {
    method: 'GET',
    headers: API_CONFIG.HEADERS,
  });

  if (!response.ok) {
    throw new ApiError(`Failed to fetch 3D structures: ${response.statusText}`, response.status);
  }

  return await response.json();
}

