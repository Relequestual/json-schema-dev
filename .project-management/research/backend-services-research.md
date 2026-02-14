# Backend Services Research & Decision

## Status

**Research Phase** - Pending decision on storage solution

## Storage Options Under Evaluation

### D1 (SQLite)

- **Type**: Relational database
- **Best For**: Structured data with relationships
- **Pros**: SQL familiarity, relationships, ACID transactions
- **Cons**: More complex setup, potential overkill for simple key-value storage

### KV (Key-Value)

- **Type**: Simple key-value store
- **Best For**: Simple schema/instance storage with high performance
- **Pros**: Excellent performance, global replication, simple API
- **Cons**: Limited query capabilities, no relationships

### R2 (Object Storage)

- **Type**: S3-compatible object storage
- **Best For**: Larger payloads, file-like storage
- **Pros**: Cost-effective for large data, familiar S3 API
- **Cons**: Not optimized for small frequent reads/writes

### Durable Objects

- **Type**: Stateful objects with strong consistency
- **Best For**: Complex stateful operations
- **Pros**: Strong consistency, stateful logic, real-time features
- **Cons**: More complex, higher cost, may be overkill

## Migration Strategy

- **Phase 3**: Client-side URL encoding (legacy compatibility)
- **Phase 3**: Schema Sharing Service - Dedicated API on Cloudflare Workers
- **Phase 4**: Hybrid loading from both systems, save only to Cloudflare
- **Phase 5**: Migrate existing URL shortener data to Cloudflare storage

## Current vs Proposed Architecture

### Current Approach (Legacy)

1. Client encodes schema + instance data into URL-safe string
2. URL is added to browser URL (creates long URLs)
3. Third-party URL shortener service stores/retrieves full URLs
4. Client decodes data from retrieved URL when sharing link is accessed

**Limitations**:

- Very long URLs before shortening
- Dependency on third-party service
- No analytics or usage tracking
- Limited control over permalink stability

### Proposed Cloudflare Workers Approach

1. Client sends schema + instance data to Workers API endpoint
2. Workers service stores data in Cloudflare database (storage TBD)
3. Returns short ID for sharing (e.g., `jsonschema.dev/s/abc123`)
4. Retrieval via Workers API using short ID
5. Client receives and displays schema + instance data

**Benefits**:

- Shorter URLs from the start
- Better UX with custom domain
- Usage analytics and tracking
- Permalink stability and reliability
- Full control over service
- Seamless transition path

## Decision Required

Target decision date: Phase 3 start
