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

## Blog image uploads

The blog services accept category `image` and post `thumbnail` and `image`
as optional `UploadedFile` arguments. For multipart requests, controllers must
pass these files from `await request.file("image")` and
`await request.file("thumbnail")`; the form request excludes those fields from
validated data. Multipart text values for these fields are not used. JSON
requests can continue to provide image paths as strings. A new post requires
a thumbnail upload or path; omitting an upload on update preserves the existing
path. Uploads are limited to 2 MiB JPEG, PNG, or WebP files and checked for
matching file signatures. After a successful update, replaced images in the
corresponding blog upload directory are deleted; external or other storage
paths are left untouched. If cleanup fails, the update remains saved and an
error is reported.
The combined request-body limits are 3 MiB for categories and 5 MiB for posts.

## Admin blog routes

Under `/v1/admin/blog`, each of `categories`, `posts`, and `comments` supports
`GET /{resource}`, `GET /{resource}/{id}`, `POST /{resource}/create`,
`PUT /{resource}/{id}/update`, and `DELETE /{resource}/{id}/delete`. These routes
require an authenticated administrator.
