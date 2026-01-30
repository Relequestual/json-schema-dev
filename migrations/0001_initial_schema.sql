-- Migration number: 0001 	 2025-12-07T13:30:00.000Z
-- JSON Schema Playground Database Schema
-- Complete normalized schema with chunking support

-- Main table for shared URLs with chunking support
CREATE TABLE shared_urls (
  short_id TEXT PRIMARY KEY,           -- Random string ID (e.g., 'abc123')
  data_blob BLOB NOT NULL,             -- Gzip compressed JSON data (binary)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- Chunking fields for D1 2MB limit support
  is_multipart BOOLEAN DEFAULT FALSE,  -- Whether this is part of a chunked payload
  part_index INTEGER DEFAULT NULL,     -- Position in sequence (0, 1, 2...) - NULL for single parts
  total_parts INTEGER DEFAULT NULL,    -- Total number of chunks for this payload
  primary_part TEXT DEFAULT NULL      -- References the short_id of the first chunk (part 0)
);

-- Metadata table for analytics and content deduplication
CREATE TABLE url_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  short_id TEXT NOT NULL,
  content_hash TEXT UNIQUE,            -- SHA-256 hash for deduplication (normalized here)
  user_agent TEXT,                     -- Browser/client that created the share
  ip_address TEXT,                     -- IP that created the share
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  access_count INTEGER DEFAULT 0,
  last_accessed_at DATETIME,

  FOREIGN KEY (short_id) REFERENCES shared_urls(short_id) ON DELETE CASCADE
);

-- Indexes for efficient queries
CREATE INDEX idx_shared_urls_multipart ON shared_urls(is_multipart);
CREATE INDEX idx_shared_urls_primary_part ON shared_urls(primary_part);
CREATE INDEX idx_shared_urls_chunks ON shared_urls(primary_part, part_index);

-- Note: UNIQUE constraint on content_hash is enforced by table definition