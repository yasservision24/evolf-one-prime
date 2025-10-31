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

