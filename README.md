# Academic Knowledge Graph Agent

This application transforms unstructured academic text into a structured knowledge graph.

## Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL (optional, if running not in mock mode)
- OpenAI API Key

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    This application uses `dotenv`. You should create a `.env` file in the root directory (however, the code also accepts system environment variables).

    Required variables:
    - `OPENAI_API_KEY`: Your OpenAI API key.

    Optional variables:
    - `DATABASE_URL`: Connection string for PostgreSQL (e.g., `postgres://user:pass@localhost:5432/dbname`). Required if `USE_MOCK_DB` is not true.
    - `USE_MOCK_DB`: Set to `true` to use an in-memory mock database instead of PostgreSQL. Defaults to `false` (tries to connect to DB).

## Running the Application

### 1. Quick Start (Mock Mode)
To run the application without setting up a database, use the mock mode:

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="your-api-key"; $env:USE_MOCK_DB="true"; npx ts-node src/index.ts
```

**Linux/Mac:**
```bash
OPENAI_API_KEY=your-api-key USE_MOCK_DB=true npx ts-node src/index.ts
```

### 2. Full Setup (with PostgreSQL)

1.  Ensure PostgreSQL is running and you have a database created.
2.  Set `DATABASE_URL` in your environment or `.env` file.
3.  Run the application. The system will automatically initialize the schema (`src/db/schema.sql`) on the first run.

```bash
# Example with .env file created
npx ts-node src/index.ts
```

## Project Structure

- `src/index.ts`: Entry point.
- `src/pipeline.ts`: Orchestrates the reading, extraction, and saving process.
- `src/agents/`: LLM integration and extraction logic.
- `src/db/`: Database repository and schema.
- `src/ingestion/`: File loading logic.
