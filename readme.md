# BookMvcApp — Containerize a .NET App and SQL Server with Docker

Companion repository for the Mace Labs tutorial on containerizing a .NET application
together with a SQL Server database.

- 📺 **Video:** https://www.youtube.com/watch?v=sl9gH8HU0qA
- 📄 **Article:** https://macelabs.com/how-to-containerize-a-dotnet-and-sql-server-app/

The app itself is deliberately simple — a .NET 9 MVC app with basic CRUD over a library
of books, backed by Entity Framework Core and SQL Server. The interesting part is the
Docker setup around it.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (on Windows, accept
  the prompt to install WSL so Linux containers can run)

That's it. You don't need the .NET SDK installed — it's supplied by the build container.

## Quick start

```bash
git clone https://github.com/Tolvic/BookMvcApp.git
cd BookMvcApp
cp .env.example .env          # Windows cmd: copy .env.example .env
docker compose up --build
```

Then browse to **http://localhost:8080**. You should land on the book list with three
seeded books.

`docker compose up` builds the app image from the `Dockerfile`, pulls the SQL Server
image from Docker Hub, creates a private network so the two can talk, and starts both
containers.

### About the `.env` file

`docker-compose.yaml` never hardcodes the database password — it reads `${DB_PASSWORD}`,
which Docker Compose loads from `.env` automatically. That file is **gitignored**, which
is why you have to create it from `.env.example` before the first run. Keeping secrets
out of source control is the point; copy the template, and change the value to whatever
you like.

To stop everything:

```bash
docker compose down       # keeps the database volume
docker compose down -v    # also deletes the database volume
```

## Running without Docker

You can still run the app directly:

```bash
dotnet run
```

This path uses the connection string in `appsettings.json`, which points at
`(localdb)\mssqllocaldb`, so you'll need SQL Server LocalDB installed. The Docker route
above is the easier one.

## What's in here

### `Dockerfile`

A multi-stage build, so the final image contains only the published app and the runtime
— no source code and no build tools:

| Stage | Base image | Does |
| --- | --- | --- |
| `base` | `dotnet/aspnet:9.0` | Minimal runtime, runs as a non-root user, documents ports 8080/8081 |
| `build` | `dotnet/sdk:9.0` | Restores dependencies and compiles the app |
| `publish` | `build` | Packages the app into `/app/publish` |
| `final` | `base` | Copies in just the published output and sets the entrypoint |

The `.csproj` is copied and restored *before* the rest of the source. Dependencies
change less often than code, so this lets Docker reuse the cached restore layer on most
rebuilds.

### `.dockerignore`

Keeps `bin`, `obj`, IDE folders and local config out of the build context. Faster
builds, smaller images, and no risk of accidentally baking local settings into an image.

### `docker-compose.yaml`

Two services:

- **`web`** — built from the `Dockerfile`, published on port 8080.
- **`db`** — the official `mcr.microsoft.com/mssql/server:2022-latest` image from Docker
  Hub, published on port 1433, with its data directory mapped to the named volume
  `mssql-data` so the database survives the container being removed.

The app's connection string uses `Server=db` — not an IP address. Compose puts both
containers on a private network where they can find each other by service name.

## Notes

A few things worth knowing if you're reading this a while after the video was published:

- **`BookDbContext` creates the database on startup.** It checks whether the database
  and tables exist and creates them if not. This is convenient for a demo, but it is
  **not** what you should do in production — use EF Core migrations instead. The video
  calls this out too.
- **`version: '3.9'` in `docker-compose.yaml` is obsolete.** Compose v2 ignores the
  top-level `version` key and prints a warning about it. Harmless — it's kept so the
  file matches what's on screen in the video.
- **`SA_PASSWORD` has been superseded by `MSSQL_SA_PASSWORD`** in the SQL Server image.
  The old name still works, and is likewise kept for consistency with the video.

## Following along with the video

The `before-docker` tag marks the app as it was before any Docker work, if you'd like to
start from scratch and add the containerization yourself:

```bash
git checkout before-docker
```

## License

Released under the [MIT License](LICENSE) — take any of it and use it however you like.
