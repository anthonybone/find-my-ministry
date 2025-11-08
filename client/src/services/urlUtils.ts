/**
 * URL building utilities for API endpoints
 */

export interface ParamMap {
    [key: string]: string | number | boolean | string[] | undefined;
}

/**
 * Build URL search parameters from an object, handling arrays and filtering undefined values
 */
export const buildUrlParams = (params: ParamMap): URLSearchParams => {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }

        if (Array.isArray(value)) {
            if (value.length > 0) {
                urlParams.append(key, value.join(','));
            }
        } else {
            urlParams.append(key, value.toString());
        }
    });

    return urlParams;
};

/**
 * Build URL with query parameters
 */
export const buildApiUrl = (endpoint: string, params?: ParamMap): string => {
    if (!params || Object.keys(params).length === 0) {
        return endpoint;
    }

    const urlParams = buildUrlParams(params);
    const paramString = urlParams.toString();

    return paramString ? `${endpoint}?${paramString}` : endpoint;
};