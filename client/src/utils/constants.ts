/**
 * Application-wide constants
 */

// API Configuration
export const API_CONFIG = {
    DEFAULT_PAGINATION_LIMIT: 50,
    DEFAULT_PAGINATION_OFFSET: 0,
    MAX_PAGINATION_LIMIT: 100,
    SEARCH_MIN_QUERY_LENGTH: 2,
    SEARCH_DEBOUNCE_MS: 300,
} as const;

// Cache Times (in milliseconds)
export const CACHE_TIMES = {
    MINISTRIES: 5 * 60 * 1000,      // 5 minutes
    PARISHES: 10 * 60 * 1000,       // 10 minutes  
    DIOCESES: 20 * 60 * 1000,       // 20 minutes
    SUGGESTIONS: 1 * 60 * 1000,     // 1 minute
} as const;

// UI Constants
export const UI_CONFIG = {
    CARD_HOVER_SCALE: 1.02,
    ANIMATION_DURATION_MS: 200,
    MOBILE_BREAKPOINT: 768,
    TABLET_BREAKPOINT: 1024,
} as const;

// Ministry Configuration
export const MINISTRY_CONFIG = {
    MAX_NAME_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 1000,
    MAX_CONTACT_NAME_LENGTH: 50,
    MAX_CONTACT_EMAIL_LENGTH: 100,
    MAX_PARTICIPANTS: 1000,
} as const;

// Test/Development
export const DEV_CONFIG = {
    PLACEHOLDER_KEYWORDS: ['placeholder', 'example', 'sample', 'test', 'demo', 'fake'],
    PLACEHOLDER_EMAIL_DOMAIN: 'PLACEHOLDER@example.com',
} as const;