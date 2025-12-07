# Payload Chunking Strategy for D1 2MB Limit

## Decision Summary

**Date**: November 25, 2025
**Status**: Approved
**Context**: Cloudflare D1 has a 2MB row size limit that requires chunking large payloads

## Problem

Cloudflare D1 has a strict 2MB limit per database row. Large JSON Schema + instance data payloads may exceed this limit, causing insertion failures.

## Solution

### Schema Enhancement

Add chunking fields to the `shared_urls` table:

- `is_multipart` (BOOLEAN) - identifies if this is part of a chunked payload
- `part_index` (INTEGER) - the position of this chunk (0, 1, 2, etc.)
- `total_parts` (INTEGER) - total number of chunks for this payload
- `primary_part` (TEXT) - references the `short_id` of the first chunk (part 0)

### Chunking Logic

**Single Part (< 2MB)**:

- Store data normally in `data_blob`
- `is_multipart = FALSE`
- `part_index = NULL`
- `total_parts = NULL`
- `primary_part = NULL`

**Multi Part (≥ 2MB)**:

- Split data into ~1.5MB chunks (safety margin)
- First chunk: stored with original `short_id`, `part_index = 0`, `primary_part = short_id`
- Subsequent chunks: generate new `short_id`s with `part_index = 1, 2, 3...`
- All chunks have same `total_parts` and reference first chunk's `short_id` in `primary_part`

### Data Retrieval

1. Query by `short_id`
2. If `is_multipart = FALSE`: return `data_blob` directly
3. If `is_multipart = TRUE`:
   - Query all chunks: `WHERE primary_part = ? ORDER BY part_index`
   - Verify integrity: check parts 0 through `total_parts - 1` exist
   - Concatenate chunks in order to reconstruct full payload

### Deduplication Impact

- Hash calculated on **original uncompressed content** (before chunking)
- Same content always produces same hash regardless of chunking
- Deduplication works at the logical content level, not physical storage level

## Benefits

- Maintains current schema structure with minimal changes
- Transparent to API consumers (same URLs work regardless of size)
- Efficient retrieval with proper indexing
- Preserves deduplication effectiveness

## Implementation Notes

- Chunk size: ~1.5MB (safety margin below 2MB limit)
- Parallel retrieval: single query to fetch all chunks by `primary_part`
- Integrity validation: verify parts 0 through N-1 exist before reconstruction
- Error handling: detect missing parts and validate `total_parts` count
- Indexing: add indexes on new fields for efficient queries

## Migration

This requires a new migration to add the chunking fields to existing `shared_urls` table.
