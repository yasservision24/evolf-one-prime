/**
 * API Configuration and Utility Functions
 * 
 * This file provides a complete API client for interacting with the backend.
 * It includes error handling, request timeouts, and type-safe methods.
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
// TYPE DEFINITIONS
// ============================================================================

/**
 * Dataset Item Interface
 * Represents a single GPCR receptor-ligand interaction record
 * 
 * BACKEND NOTE: Your API should return data matching this structure
 */
export interface DatasetItem {
  id: string;
  receptor: string;           // GPCR receptor name (e.g., "5-HT2A", "D2")
  ligand: string;             // Ligand/compound name
  affinity: number;           // Binding affinity value (e.g., Ki, IC50)
  affinityUnit: string;       // Unit of measurement (e.g., "nM", "μM")
  species: string;            // Organism species (e.g., "Human", "Rat")
  mutation?: string;          // Optional: mutation information
  experimentType: string;     // Type of experiment (e.g., "Binding", "Functional")
  reference: string;          // PubMed ID or DOI
  dateAdded: string;          // ISO date string
}

/**
 * Paginated Response Interface
 * Standard structure for paginated API responses
 * 
 * BACKEND IMPLEMENTATION:
 * Your backend should return responses in this exact format for pagination to work
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
 * 
 * BACKEND IMPLEMENTATION:
 * These parameters will be sent as query strings:
 * GET /dataset?page=1&limit=20&search=dopamine&receptor=D2
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
// DATASET API FUNCTIONS
// ============================================================================

/**
 * Dataset-specific API functions
 * These functions provide typed, easy-to-use methods for dataset operations
 */

/**
 * Fetch paginated dataset with optional filters
 * 
 * BACKEND ENDPOINT SPECIFICATION:
 * - Method: GET
 * - Path: /dataset
 * - Query Parameters: page, limit, search, receptor, species, sortBy, sortOrder
 * - Response: PaginatedResponse<DatasetItem>
 * 
 * EXAMPLE BACKEND RESPONSE:
 * {
 *   "data": [
 *     {
 *       "id": "1",
 *       "receptor": "5-HT2A",
 *       "ligand": "Serotonin",
 *       "affinity": 5.2,
 *       "affinityUnit": "nM",
 *       "species": "Human",
 *       "experimentType": "Binding",
 *       "reference": "PMID:12345678",
 *       "dateAdded": "2024-01-15T10:30:00Z"
 *     }
 *   ],
 *   "pagination": {
 *     "currentPage": 1,
 *     "itemsPerPage": 20,
 *     "totalItems": 10234,
 *     "totalPages": 512
 *   }
 * }
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with paginated dataset response
 */
export async function getDatasetPaginated(
  params: DatasetQueryParams = {}
): Promise<PaginatedResponse<DatasetItem>> {
  // Build query string from parameters
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.receptor) queryParams.append('receptor', params.receptor);
  if (params.species) queryParams.append('species', params.species);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  
  const queryString = queryParams.toString();
  const endpoint = `/dataset${queryString ? `?${queryString}` : ''}`;
  
  return api.get<PaginatedResponse<DatasetItem>>(endpoint);
}

/**
 * Get total count of items in dataset
 * Useful for initializing pagination before fetching first page
 * 
 * BACKEND ENDPOINT SPECIFICATION:
 * - Method: GET
 * - Path: /dataset/count
 * - Query Parameters: search (optional, for filtered count)
 * - Response: { count: number }
 * 
 * EXAMPLE BACKEND RESPONSE:
 * {
 *   "count": 10234
 * }
 * 
 * @param search - Optional search query to get filtered count
 * @returns Promise with total item count
 */
export async function getDatasetCount(search?: string): Promise<number> {
  const queryParams = new URLSearchParams();
  if (search) queryParams.append('search', search);
  
  const queryString = queryParams.toString();
  const endpoint = `/dataset/count${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get<{ count: number }>(endpoint);
  return response.count;
}

/**
 * Get a single dataset item by ID
 * 
 * BACKEND ENDPOINT SPECIFICATION:
 * - Method: GET
 * - Path: /dataset/:id
 * - Response: DatasetItem
 * 
 * @param id - Dataset item ID
 * @returns Promise with dataset item
 */
export async function getDatasetById(id: string): Promise<DatasetItem> {
  return api.get<DatasetItem>(`/dataset/${id}`);
}

// ============================================================================
// MODEL PREDICTION API FUNCTIONS
// ============================================================================

/**
 * Model prediction interfaces and functions
 */

export interface PredictionRequest {
  receptor: string;
  ligand: string;
  mutation?: string;
  species?: string;
}

export interface PredictionResponse {
  id: string;
  predictedAffinity: number;
  confidence: number;
  timestamp: string;
}

/**
 * Submit a prediction request
 * 
 * BACKEND ENDPOINT SPECIFICATION:
 * - Method: POST
 * - Path: /model/predict
 * - Body: PredictionRequest
 * - Response: PredictionResponse
 * 
 * @param data - Prediction request data
 * @returns Promise with prediction result
 */
export async function submitPrediction(
  data: PredictionRequest
): Promise<PredictionResponse> {
  return api.post<PredictionResponse>('/model/predict', data);
}

/**
 * Get prediction result by ID
 * 
 * BACKEND ENDPOINT SPECIFICATION:
 * - Method: GET
 * - Path: /model/prediction/:id
 * - Response: PredictionResponse
 * 
 * @param id - Prediction ID
 * @returns Promise with prediction result
 */
export async function getPredictionById(id: string): Promise<PredictionResponse> {
  return api.get<PredictionResponse>(`/model/prediction/${id}`);
}
