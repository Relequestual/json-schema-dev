-- Migration number: 0002 	 2025-11-25T00:00:00.000Z
-- Add payload chunking support and normalize content_hash storage

-- Add chunking fields to shared_urls table
ALTER TABLE shared_urls ADD COLUMN is_multipart BOOLEAN DEFAULT FALSE;
ALTER TABLE shared_urls ADD COLUMN part_index INTEGER DEFAULT NULL;
ALTER TABLE shared_urls ADD COLUMN total_parts INTEGER DEFAULT NULL;
ALTER TABLE shared_urls ADD COLUMN primary_part TEXT DEFAULT NULL;

-- Move content_hash to url_metadata for proper normalization
-- Note: Cannot add UNIQUE constraint directly, will add as separate index
ALTER TABLE url_metadata ADD COLUMN content_hash TEXT;

-- Remove content_hash from shared_urls (normalize schema)
ALTER TABLE shared_urls DROP COLUMN content_hash;

-- Add indexes for efficient chunking queries
CREATE INDEX idx_shared_urls_multipart ON shared_urls(is_multipart);
CREATE INDEX idx_shared_urls_primary_part ON shared_urls(primary_part);

-- Composite index for efficient chunk retrieval
CREATE INDEX idx_shared_urls_chunks ON shared_urls(primary_part, part_index);

-- Unique index on content_hash for deduplication queries (enforces uniqueness)
CREATE UNIQUE INDEX idx_url_metadata_content_hash ON url_metadata(content_hash);