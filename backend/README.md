# backend

A high-performance Python ASGI backend powered by the [SwiftPY](https://github.com/swiftpy/swiftpy) framework.

## Prerequisites

- Python >= 3.12
- PostgreSQL 16 (with `pgvector` extension if using AI vector stores)
- Redis 7

## Getting Started

1. Install dependencies using `uv` (recommended) or `pip`:
   ```bash
   uv sync
   source .venv/bin/activate
   ```
   Or with standard `venv` + `pip`:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -e .
   ```

2. Environment configuration:
   The `.env` file has been automatically initialized with a secure `APP_KEY`.
   Update database and Redis credentials in `.env` if needed.

3. Run outstanding database migrations:
   ```bash
   swiftpy migrate
   ```

4. Create symbolic link for public storage files:
   ```bash
   swiftpy storage:link
   ```

5. Start the development server with live reload:
   ```bash
   swiftpy start --reload
   ```

## Development & CLI Commands

- `swiftpy make:model <Name> -m`: Create model and migration
- `swiftpy make:controller <Name>`: Create an HTTP controller
- `swiftpy make:service <Name>`: Create a domain service
- `swiftpy make:repository <Name>`: Create a data repository
- `swiftpy make:schema <Name>`: Create an input/output schema
- `swiftpy make:seeder <Name>`: Create a database seeder
- `swiftpy db:seed`: Seed the database
- `swiftpy queue:work`: Start background queue worker

## Docker Deployment

To spin up the entire application stack (App, PostgreSQL, and Redis):
```bash
docker compose up -d
```
