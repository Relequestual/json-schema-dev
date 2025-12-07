/**
 * URL ID Generation Utilities
 * Generates random short IDs for shared URLs with collision handling
 */

const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Configuration for ID generation
 */
export interface IdGenerationConfig {
  /** Minimum length for generated IDs */
  minLength: number;
  /** Maximum length before giving up */
  maxLength: number;
  /** Maximum retry attempts for collision detection */
  maxRetries: number;
}

/**
 * Default configuration for ID generation
 */
export const DEFAULT_ID_CONFIG: IdGenerationConfig = {
  minLength: 6,
  maxLength: 12,
  maxRetries: 10,
};

/**
 * Generate a random Base62 ID of specified length
 * Uses crypto.getRandomValues for cryptographically secure randomness
 */
export function generateRandomId(length: number): string {
  // Use crypto for secure random generation
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  return Array.from(array, (byte) => BASE62_CHARS[byte % BASE62_CHARS.length]).join('');
}

/**
 * Generate a short ID with collision checking
 * Optimized for the common case: first attempt is usually unique
 */
export async function generateShortId(
  isCollision: (id: string) => Promise<boolean>,
  config: IdGenerationConfig = DEFAULT_ID_CONFIG
): Promise<string> {
  let currentLength = config.minLength;
  let retryCount = 0;

  do {
    const id = generateRandomId(currentLength);
    const hasCollision = await isCollision(id);

    if (!hasCollision) {
      return id; // Success - exit immediately
    }

    retryCount++;

    // Increase length by one after every 3 attempts
    if (retryCount % 3 === 0) {
      currentLength++;
    }
  } while (retryCount < config.maxRetries && currentLength <= config.maxLength);

  throw new Error(
    `Failed to generate unique ID after ${config.maxRetries} attempts ` +
      `(max length: ${config.maxLength})`
  );
}

/**
 * Validate that an ID contains only Base62 characters
 */
export function isValidShortId(id: string): boolean {
  if (!id || id.length === 0) {
    return false;
  }

  return id.split('').every((char) => BASE62_CHARS.includes(char));
}
