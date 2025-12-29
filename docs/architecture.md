# System Architecture & Design Rationale

## Overview
The Academic Knowledge Graph Agent is designed to transform unstructured academic text into a structured knowledge graph. The system uses an agentic pipeline to read papers, extract entities and relationships using LLMs, and store them in a Postgres database.

## Architecture

### Components
1.  **Ingestion Layer (`src/ingestion`)**: Responsible for loading content from files (PDFs, text). Currently supports text files.
2.  **Agent Layer (`src/agents`)**:
    -   **LLM Service**: Abstraction over LLM providers (e.g., OpenAI).
    -   **Extraction Agent**: specialized agent with prompts designed to identify specific node types (Paper, Method, Concept) and edge types (Cites, Improves_On).
3.  **Data Layer (`src/db`)**:
    -   **Repository**: Handles CRUD operations for Nodes and Edges.
    -   **Postgres Schema**: Relational schema optimized for graph data (Nodes table + Edges table).
4.  **Pipeline Orchestrator (`src/pipeline.ts`)**: Coordinates the flow from ingestion to storage.

### Data Flow
1.  **Input**: Raw text from a research paper.
2.  **Processing**: The Extraction Agent sends chunks of text to the LLM with a schema-enforcing prompt.
3.  **Output**: Structured JSON containing Nodes and Edges.
4.  **Storage**: The Pipeline resolves entity identities (simple name matching) and persists them to Postgres.

## Design Rationale

### 1. Representing Data in the Graph
We chose a flexible schema with `Nodes` and `Edges` tables rather than a native graph DB for this PoC.
-   **Pros**: Postgres is ubiquitous, robust, and handles relational data well. JSONB columns allow for flexible properties (e.g., storing vectors later).
-   **Cons**: Deep graph traversals can be slower than native graph DBs (Neo4j), but recursive CTEs in SQL handle most common queries.

### 2. Extracting Entities
-   **Prompt Engineering**: We use a single-pass extraction for the PoC, instructing the LLM to output specific JSON structures.
-   **Validation**: The system attempts to parse JSON and handles errors gracefully. Future versions would use "Retry" logic or constrained decoding (e.g., JSON mode).

### 3. Scalability
-   **Stateless Agents**: The extraction logic is stateless, allowing horizontal scaling of worker nodes.
-   **Database**: Postgres can scale vertically and supports read replicas. For massive graphs, we might migrate to a dedicated graph store or use a sharding strategy.

## Limitations
-   **Context Window**: Currently processes text in chunks (or assumes fit). Long papers need intelligent chunking and context management.
-   **Entity Resolution**: Simple name matching is brittle ("Gaussian Splatting" vs "3D Gaussian Splatting"). We need vector-based entity linking.
