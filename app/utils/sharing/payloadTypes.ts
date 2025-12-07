/**
 * Shareable Payload Types
 * Versioned interfaces for JSON Schema playground shared content
 */

/**
 * Base interface for all payload versions
 */
export interface BaseShareablePayload {
  /** Version identifier for backward compatibility */
  version: string;
}

/**
 * Version 1.0 of shareable payload structure
 * Initial implementation for JSON Schema + instance data sharing
 */
export interface ShareablePayloadV1 extends BaseShareablePayload {
  version: '1.0';
  /** Raw schema text (JSON, YAML, or other format) */
  schema: string;
  /** Raw instance text (JSON, YAML, or other format) */
  instance: string;
  /** Implementation configuration for validators */
  implementations: {
    /** Array of validator identifiers to use for validation */
    validators: string[];
    /** Configuration object for each validator */
    configs: Record<string, unknown>;
  };
  /** Optional metadata that doesn't affect content hash */
  metadata?: Record<string, unknown>;
}

/**
 * Current version of shareable payload
 * Always points to the latest stable version
 */
export type ShareablePayload = ShareablePayloadV1;

/**
 * Union type of all supported payload versions
 * Add new versions here as they are implemented
 */
export type AnyShareablePayload = ShareablePayloadV1;

/**
 * Type guard to check if payload is version 1.0
 */
export function isShareablePayloadV1(payload: AnyShareablePayload): payload is ShareablePayloadV1 {
  return payload.version === '1.0';
}

// Removed untill multi-version support is required
// /**
//  * Migrate any payload version to the current version
//  * Handles backward compatibility for older payload formats
//  */
// export function migrateToCurrentVersion(payload: AnyShareablePayload): ShareablePayload {
//   // Currently only v1.0 exists, so no migration needed
//   if (isShareablePayloadV1(payload)) {
//     return payload;
//   }

//   // Future versions would have migration logic here
//   throw new Error(`Unsupported payload version: ${(payload as BaseShareablePayload).version}`);
// }

/**
 * Create a new payload with current version defaults
 */
export function createShareablePayload(
  schema: string,
  instance: string,
  validators: string[],
  validatorConfigs: Record<string, unknown> = {},
  metadata?: ShareablePayloadV1['metadata']
): ShareablePayload {
  return {
    version: '1.0',
    schema,
    instance,
    implementations: {
      validators,
      configs: validatorConfigs,
    },
    metadata,
  };
}
