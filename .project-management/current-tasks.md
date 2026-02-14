# Current Tasks (Phase 3)

## Key Decisions Needed

### Backend Service Selection ✅

- Choose Cloudflare storage solution for URL sharing ✅ (D1 selected)
- Design database schema for shared URLs and metadata ✅
- Define data structure and access patterns ✅

### D1 Database Setup ✅

- Configure D1 database in wrangler.toml ✅
- Create database schema with shared_urls and url_metadata tables ✅
- Set up database bindings for Workers access ✅
- Test database connection and basic CRUD operations ✅
- Set up proper migration system with wrangler d1 migrations ✅
- Configure development workflow with npm scripts (db:migrate, db:setup) ✅
- Resolve assets + D1 bindings configuration with main script ✅
- Schema normalization migration ✅ (content_hash placed in url_metadata table)

### URL Generation & Deduplication Logic ✅

- Implement random short ID generation with configurable minimum length ✅
- Create content hashing for deduplication ✅
- Build database queries for checking existing content and inserting new URLs ✅
- Handle collision detection and retry logic ✅
  - Allow importing of existing short URLs that cannot be used. Regenerate short ID if colission occurs ✅
- Must be able to split payload if row would be larger than 2MB. Cloudflare D1 limit. May need to adjust schema for this. Need to consider the impact of hashing and the ID of the row. ✅
- Code optimization and database normalization design ✅
- Bruno API test collection created ✅

### Client Side and Server Side Compression Integration

**Client Side Responsibilities**

- Payload format: send the original payload as JSON in the request body (`Content-Type: application/json`).
- Transport compression: gzip the request body and include `Content-Encoding: gzip`.
- No chunking: do NOT split or chunk payloads; send the full document in one request.
- No hashing: do NOT compute or send any content hash.
- No binary blobs: keep payload as JSON (transport may be gzip).
- UX checks only: perform client-side size/validation checks for UX and show guidance for oversized payloads; do not attempt to divide or store chunks client-side.
- Metadata: include application metadata inside the JSON as needed.

**Server Side Responsibilities**

- Accept `application/json` with `Content-Encoding: gzip`; decompress transport gzip to obtain raw UTF‑8 JSON bytes.
- Authoritative hash: always compute the authoritative `content_hash` server-side over the raw UTF‑8 JSON bytes; ignore any client-provided hashes.
- Deduplication: use the server-computed `content_hash` for indexed lookup; if found, return existing short URL.
- Storage compression & chunking: if not deduplicated, compress for storage (binary gzip or configured), split compressed data into D1-safe BLOB chunks, and store them; server controls chunking.
- No reassembly step from client: server does its own chunking pipeline; client does not send chunks.
- Verification & atomicity: verify integrity during compression/chunking and commit atomically; reject requests that fail verification or exceed configured limits.
- Validation & security: validate payload contents, sanitize inputs, enforce rate/size limits, and never rely on client-supplied data for authorization or deduplication decisions.
- Errors: return clear 4xx for client errors and 5xx for server failures.

### API Endpoints Development ✅

- Create POST /api/share endpoint for creating shared URLs ✅
- Create GET /api/share/:id endpoint for retrieving shared data ✅
- Implement proper error handling and validation ✅

### Legacy URL Compatibility

- Implement dual lookup system (D1 first, then legacy system)
- Create legacy URL decoder for existing shared URLs
- Design post-launch migration strategy for bulk data transfer
- Handle error cases and fallback strategies

### URL Encoding Strategy ✅

- Choose compression for new data
- Backward compatibility via dual lookup ✅ (no LZ-string requirement for new URLs)
- Migration approach defined ✅ (on-demand when URLs accessed)

### Sharing Implementation Approach ✅

- Server API approach selected ✅ (Workers endpoints)
- Hybrid system for compatibility ✅ (dual lookup)
- Error handling strategy defined ✅

## Status Legend

x2

- ✅ Complete
- 🔄 In Progress
- [no icon] Not Started
