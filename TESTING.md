Test environment and running integration tests
===========================================

This project uses PostgreSQL for integration tests. When running tests, the application loads configuration from `.test.env` (when `NODE_ENV=test`).

Quick setup (local machine):

1. Create a Postgres role and test database (example using psql):

   ```bash
   psql -U postgres -c "CREATE ROLE developer WITH LOGIN PASSWORD 'developer';"
   psql -U postgres -c "CREATE DATABASE forum_test OWNER developer;"
   ```

2. Ensure `.test.env` at project root has matching credentials. A sample `.test.env` is included.

3. Run migrations for test DB:

   ```bash
   npm run migrate:test
   ```

4. Run the test suite:

   ```bash
   npm test
   ```

CI notes:
- Provide secure values for `PGUSER`/`PGPASSWORD`/`PGDATABASE` and the auth keys (`ACCESS_TOKEN_KEY`, `REFRESH_TOKEN_KEY`) via CI secrets.
- Run `npm run migrate:test` before executing tests.

Docker (recommended for local CI-free runs)
----------------------------------------

You can spin up a disposable Postgres test server with Docker Compose. The included `docker-compose.test.yml` starts Postgres with credentials matching the sample `.test.env`.

1. Start Postgres:

```bash
docker-compose -f docker-compose.test.yml up -d
```

2. Wait for Postgres to be healthy (the compose healthcheck uses `pg_isready`).

3. Run migrations and tests:

```bash
npm run migrate:test
npm test
```

4. Stop and remove the test DB when done:

```bash
docker-compose -f docker-compose.test.yml down -v
```

Note: If port 5432 is already used on your machine, either stop the local Postgres service or edit `docker-compose.test.yml` to map the container port to another host port.
