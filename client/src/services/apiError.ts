/**
 * API Error types and handling utilities
 */

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export interface ErrorResponse {
    message: string;
    code?: string;
    details?: any;
}

/**
 * Handle API response errors consistently
 */
export const handleApiError = (error: any): never => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { status, data } = error.response;
        const message = data?.message || data?.error || 'An error occurred';
        const code = data?.code;

        throw new ApiError(message, status, code);
    } else if (error.request) {
        // The request was made but no response was received
        throw new ApiError('Network error - please check your connection', 0);
    } else {
        // Something happened in setting up the request that triggered an Error
        throw new ApiError(error.message || 'An unexpected error occurred', 0);
    }
};

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: ErrorResponse;
    pagination?: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}