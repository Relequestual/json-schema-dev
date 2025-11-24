# D1 Database Tests

Basic smoke tests for D1 database infrastructure using `@cloudflare/vitest-pool-workers`.

## Test Structure

### Smoke Tests (`d1.test.ts`)

- **Database Connection**: Verify D1 binding is accessible via `env.DB`
- **Schema Validation**: Confirm migrated tables exist (`shared_urls`, `url_metadata`)

### Supporting Files

- **Migration Setup** (`apply-migrations.ts`): Automatically applies migrations before tests
- **Type Definitions** (`env.d.ts`): TypeScript types for D1 bindings and migrations

## Running Tests

```bash
# Run D1 smoke tests
pnpm test tests/d1.test.ts

# Run all tests
pnpm test:run
```

## Integration with CI/CD

These smoke tests are designed to:

- Validate D1 infrastructure is properly configured
- Confirm migration system works correctly
- Run quickly in CI environments (< 1 second)

## References

- [D1 Local Development](https://developers.cloudflare.com/d1/build-with-d1/local-development/#test-programmatically) - Official Cloudflare documentation for testing D1 databases
- [vitest-pool-workers D1 Example](https://github.com/cloudflare/workers-sdk/tree/main/fixtures/vitest-pool-workers-examples/d1) - Official example implementation showing migration setup and testing patterns
