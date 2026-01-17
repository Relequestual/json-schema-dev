/**
 * Share Data Types
 * Type definitions for JSON Schema playground sharing functionality
 *
 * (render with https://www.devtoolsdaily.com/diagrams/mermaidjs/playground/)
 *
 * Type Hierarchy:
 * ```mermaid
 * graph TD
 *   Base[ShareDataBase<br/>schema, instance<br/>implementations?]
 *   Version[BaseVersioned<br/>version: string]
 *
 *   Base -->|extends| Req[ShareRequest<br/>client input]
 *   Base -->|Required| Core[ShareDataCore<br/>all fields required]
 *
 *   Core -->|extends| Stored[StoredShareV1<br/>version: '1.0'<br/>internalMetadata?]
 *   Version -->|extends| Stored
 *
 *   Stored -->|type alias| Current[StoredShare<br/>current version]
 *   Stored -->|type alias| Any[AnyStoredShare<br/>union of versions]
 *   Stored -->|omit metadata| Resp[ShareResponse<br/>public data only]
 * ```
 */

/**
 * Base interface for versioned data
 */
export interface BaseVersioned {
  /** Version identifier for backward compatibility */
  version: string;
}

/**
 * Validator implementation configuration
 */
export interface ValidationImplementation {
  /** Array of validator identifiers */
  validators?: string[];
  /** Validator-specific configuration */
  configs?: Record<string, unknown>;
}

/**
 * Base share data fields (all optional implementations)
 * Foundation for both client requests and stored data
 */
export interface ShareDataBase {
  /** JSON Schema as a string */
  schema: string;
  /** JSON instance data as a string */
  instance: string;
  /** Optional implementation configuration for validators */
  implementations?: ValidationImplementation;
}

/**
 * Core share data fields (required implementations)
 * Used for stored data where implementations must be fully resolved
 */
export type ShareDataCore = Required<ShareDataBase>;

/**
 * Client request structure for creating shared URLs
 * What the client sends in POST /api/share
 * While this is identical at time of writing, may diverge later.
 */
export type ShareRequest = ShareDataBase;

/**
 * Version 1.0 of stored share data
 * What gets saved in the database
 */
export interface StoredShareV1 extends BaseVersioned, ShareDataCore {
  version: '1.0';
  /** Internal server metadata (never sent to clients) */
  internalMetadata?: Record<string, unknown>;
}

/**
 * Current version of stored share data
 * Always points to the latest stable version
 */
export type StoredShare = StoredShareV1;

/**
 * Union type of all supported stored share versions
 * Add new versions here as they are implemented
 */
export type AnyStoredShare = StoredShareV1;

/**
 * Public share data returned to clients
 * Omits internal metadata
 */
export type ShareResponse = Omit<StoredShareV1, 'internalMetadata'>;

/**
 * Type guard to check if stored share is version 1.0
 */
export function isStoredShareV1(share: AnyStoredShare): share is StoredShareV1 {
  return share.version === '1.0';
}

/**
 * Create a new stored share with current version defaults
 */
export function createStoredShare(
  schema: string,
  instance: string,
  implementations: StoredShareV1['implementations'] = {
    validators: ['ajv'],
    configs: {},
  },
  internalMetadata?: StoredShareV1['internalMetadata']
): StoredShare {
  return {
    version: '1.0',
    schema,
    instance,
    implementations,
    internalMetadata,
  };
}
