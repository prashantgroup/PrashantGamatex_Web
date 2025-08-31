/**
 * JWT Token utilities for authentication
 */

interface JWTPayload {
  exp: number;
  iat: number;
  [key: string]: any;
}

/**
 * Decode JWT token without verification (client-side only)
 * This is safe for checking expiry as we don't rely on the payload for security
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // Remove Bearer prefix if present
    const cleanToken = token.replace(/^Bearer\s+/i, '');
    
    // Split token into parts
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload (middle part)
    const payload = parts[1];
    
    // Add padding if needed for base64 decoding
    let paddedPayload = payload;
    while (paddedPayload.length % 4) {
      paddedPayload += '=';
    }
    
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload) as JWTPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * Check if JWT token is valid (exists and not expired)
 */
export function isTokenValid(token: string | null | undefined): boolean {
  if (!token) {
    return false;
  }

  return !isTokenExpired(token);
}

/**
 * Get time until token expires (in milliseconds)
 * Returns 0 if token is already expired or invalid
 */
export function getTokenTimeToExpiry(token: string): number {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const timeToExpiry = payload.exp - currentTime;
  
  return timeToExpiry > 0 ? timeToExpiry * 1000 : 0;
}
