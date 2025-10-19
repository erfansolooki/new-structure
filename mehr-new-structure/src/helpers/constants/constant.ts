// ============================================
// API CONSTANTS
// ============================================
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    DELETE: '/user/delete',
    LIST: '/user/list',
  },
  // Add more endpoints as needed
} as const;

// ============================================
// HTTP STATUS CODES
// ============================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// ============================================
// LOCAL STORAGE KEYS
// ============================================
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'user_preferences',
  RECENT_SEARCHES: 'recent_searches',
} as const;

// ============================================
// ROUTE PATHS
// ============================================
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  SERVER_ERROR: '/500',
} as const;

// ============================================
// DATE & TIME FORMATS
// ============================================
export const DATE_FORMATS = {
  DEFAULT: 'YYYY-MM-DD',
  DISPLAY: 'MMM DD, YYYY',
  FULL: 'MMMM DD, YYYY',
  WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY HH:mm',
  TIME_ONLY: 'HH:mm:ss',
  TIME_12H: 'hh:mm A',
  ISO: 'ISO8601',
} as const;

// ============================================
// VALIDATION CONSTANTS
// ============================================
export const VALIDATION = {
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_LENGTH: 255,
    MIN_LENGTH: 5,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    REQUIREMENTS: {
      LOWERCASE: /[a-z]/,
      UPPERCASE: /[A-Z]/,
      NUMBER: /\d/,
      SPECIAL_CHAR: /[@$!%*?&]/,
    },
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    REGEX: /^[a-zA-Z0-9_-]+$/,
  },
  PHONE: {
    REGEX: /^[\d\s\-\+\(\)]+$/,
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
  URL: {
    REGEX: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  },
} as const;

// ============================================
// RESPONSIVE BREAKPOINTS
// ============================================
export const BREAKPOINTS = {
  XS: 320,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

export const MEDIA_QUERIES = {
  XS: `(min-width: ${BREAKPOINTS.XS}px)`,
  SM: `(min-width: ${BREAKPOINTS.SM}px)`,
  MD: `(min-width: ${BREAKPOINTS.MD}px)`,
  LG: `(min-width: ${BREAKPOINTS.LG}px)`,
  XL: `(min-width: ${BREAKPOINTS.XL}px)`,
  XXL: `(min-width: ${BREAKPOINTS.XXL}px)`,
} as const;

// ============================================
// Z-INDEX LAYERS
// ============================================
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  NOTIFICATION: 1080,
  MAX: 9999,
} as const;

// ============================================
// PAGINATION
// ============================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100] as const,
  MAX_PAGE_SIZE: 100,
} as const;

// ============================================
// FILE UPLOAD
// ============================================
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'] as const,
  DOCUMENT_EXTENSIONS: ['.pdf', '.doc', '.docx'] as const,
} as const;

// ============================================
// DEBOUNCE & THROTTLE DELAYS
// ============================================
export const DELAYS = {
  DEBOUNCE_DEFAULT: 300,
  DEBOUNCE_SEARCH: 500,
  THROTTLE_DEFAULT: 1000,
  THROTTLE_SCROLL: 100,
  AUTO_SAVE: 2000,
  NOTIFICATION_DURATION: 3000,
  TOOLTIP_DELAY: 500,
} as const;

// ============================================
// MESSAGES
// ============================================
export const MESSAGES = {
  SUCCESS: {
    DEFAULT: 'Operation completed successfully',
    SAVE: 'Saved successfully',
    UPDATE: 'Updated successfully',
    DELETE: 'Deleted successfully',
    CREATE: 'Created successfully',
    LOGIN: 'Login successful',
    LOGOUT: 'Logout successful',
    REGISTER: 'Registration successful',
  },
  ERROR: {
    DEFAULT: 'Something went wrong',
    NETWORK: 'Network error. Please check your connection',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    NOT_FOUND: 'The requested resource was not found',
    SERVER: 'Server error. Please try again later',
    VALIDATION: 'Please check your input and try again',
    TIMEOUT: 'Request timeout. Please try again',
  },
  WARNING: {
    UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
    DELETE_CONFIRMATION: 'Are you sure you want to delete this item?',
    IRREVERSIBLE_ACTION: 'This action cannot be undone',
  },
  INFO: {
    LOADING: 'Loading...',
    NO_DATA: 'No data available',
    EMPTY_RESULTS: 'No results found',
    PROCESSING: 'Processing...',
  },
} as const;

// ============================================
// APPLICATION CONSTANTS
// ============================================
export const APP_CONFIG = {
  NAME: 'Your App Name',
  VERSION: '1.0.0',
  DESCRIPTION: 'Your app description',
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'de', 'fr', 'es'] as const,
  DEFAULT_THEME: 'light' as const,
  THEMES: ['light', 'dark'] as const,
  DATE_LOCALE: 'en-US',
} as const;

// ============================================
// REGEX PATTERNS
// ============================================
export const REGEX = {
  EMAIL: VALIDATION.EMAIL.REGEX,
  PASSWORD: VALIDATION.PASSWORD.REGEX,
  USERNAME: VALIDATION.USERNAME.REGEX,
  PHONE: VALIDATION.PHONE.REGEX,
  URL: VALIDATION.URL.REGEX,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHABETIC: /^[a-zA-Z]+$/,
  NUMERIC: /^\d+$/,
  DECIMAL: /^\d+(\.\d{1,2})?$/,
  POSTAL_CODE: /^\d{5}(-\d{4})?$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  IPV4: /^(\d{1,3}\.){3}\d{1,3}$/,
  CREDIT_CARD: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
} as const;

// ============================================
// STATUS
// ============================================
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

// ============================================
// SORTING
// ============================================
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

// ============================================
// PERMISSIONS
// ============================================
export const PERMISSIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

// ============================================
// USER ROLES
// ============================================
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
  GUEST: 'guest',
} as const;

// ============================================
// TYPES
// ============================================
export type ApiEndpoint = typeof API_ENDPOINTS;
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
export type Route = (typeof ROUTES)[keyof typeof ROUTES];
export type DateFormat = (typeof DATE_FORMATS)[keyof typeof DATE_FORMATS];
export type Breakpoint = (typeof BREAKPOINTS)[keyof typeof BREAKPOINTS];
export type ZIndex = (typeof Z_INDEX)[keyof typeof Z_INDEX];
export type Status = (typeof STATUS)[keyof typeof STATUS];
export type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type Theme = (typeof APP_CONFIG.THEMES)[number];
export type Language = (typeof APP_CONFIG.SUPPORTED_LANGUAGES)[number];
