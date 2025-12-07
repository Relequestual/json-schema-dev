-- Migration number: 0001 	 2025-11-22T10:26:46.933Z
-- JSON Schema Playground Database Schema
-- Tables for storing shared URLs with metadata

-- Main table for shared URLs with deduplication support
CREATE TABLE shared_urls (
  short_id TEXT PRIMARY KEY,           -- Random string ID (e.g., 'abc123')
  data_blob TEXT NOT NULL,             -- Base64-encoded gzip compressed JSON data
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  content_hash TEXT UNIQUE NOT NULL    -- Hash of uncompressed data for deduplication
);

-- Metadata table for analytics and tracking
CREATE TABLE url_metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  short_id TEXT NOT NULL,
  user_agent TEXT,           -- Browser/client that created the share
  ip_address TEXT,           -- IP that created the share
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  access_count INTEGER DEFAULT 0,
  last_accessed_at DATETIME,

  FOREIGN KEY (short_id) REFERENCES shared_urls(short_id) ON DELETE CASCADE
);

-- Indexes are automatically created for PRIMARY KEY and UNIQUE constraints
-- No additional indexes needed for our current use case