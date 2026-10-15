import dotenv from 'dotenv';

dotenv.config();

/**
 * Normalizes URLs by trimming whitespace and removing trailing slashes.
 * @param {string} url
 * @returns {string}
 */
const normalizeUrl = (url) => {
    return url.trim().replace(/\/+$/, '').toLowerCase();
};

/**
 * Parses a comma-separated string of origins into an array of normalized origins.
 * @param {string} [value]
 * @returns {string[]}
 */
const parseOrigins = (value) => {
    if (!value) return [];
    return value
        .split(',')
        .map((url) => normalizeUrl(url))
        .filter(Boolean);
};

/**
 * Base origins permitted in local and dev environments.
 */
const DEFAULT_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
];

/**
 * Determines whether an incoming request Origin header is permitted.
 * @param {string|undefined} origin
 * @returns {boolean}
 */
export const isOriginAllowed = (origin) => {
    // Requests without an Origin header (e.g. mobile apps, curl, uptime/health checks, same-origin GETs)
    if (!origin) return true;

    // Allow all origins during local development
    if (process.env.NODE_ENV !== 'production') return true;

    // Build the set of configured allowed origins dynamically
    const configuredOrigins = [
        ...DEFAULT_ALLOWED_ORIGINS,
        ...parseOrigins(process.env.CLIENT_URL),
        ...parseOrigins(process.env.RENDER_EXTERNAL_URL),
    ];

    const allowedSet = new Set(configuredOrigins);

    // Wildcard allowed if explicitly specified
    if (allowedSet.has('*')) return true;

    const normalizedOrigin = normalizeUrl(origin);
    if (allowedSet.has(normalizedOrigin)) return true;

    try {
        const { hostname } = new URL(normalizedOrigin);

        // Allow any deployment on Render (e.g., https://<service-name>.onrender.com)
        if (hostname.endsWith('.onrender.com')) {
            return true;
        }

        // Allow matching against RENDER_EXTERNAL_HOSTNAME if provided by Render
        if (
            process.env.RENDER_EXTERNAL_HOSTNAME &&
            hostname === process.env.RENDER_EXTERNAL_HOSTNAME.trim().toLowerCase()
        ) {
            return true;
        }
    } catch {
        return false;
    }

    return false;
};

/**
 * Shared CORS options object for Express and Socket.IO.
 */
export const corsOptions = {
    origin: (origin, callback) => {
        if (isOriginAllowed(origin)) {
            return callback(null, true);
        }

        // Return callback(null, false) instead of callback(new Error(...)).
        // Passing an Error causes Express to crash with a 500 status and log
        // "Error: Not allowed by CORS" to stdout/stderr. Returning false safely
        // suppresses CORS headers so the browser enforces the restriction.
        return callback(null, false);
    },
    credentials: true,
};
