# Future Roadmap & Scalability

## Scalability and Maintenance

### 1. Ingestion at Scale
-   **Queue System**: Implement a message queue (e.g., RabbitMQ, Kafka) to manage ingestion jobs.
-   **Parallel Processing**: Run multiple extraction agents in parallel to process thousands of papers.
-   **Incremental Updates**: Monitor arXiv/RSS feeds for new papers. Check citation graphs to prioritize "seminal" papers.

### 2. Advanced Extraction
-   **Recursive Extraction**: First pass for high-level concepts, second pass for detailed method steps.
-   **Multi-Modal**: Use Vision-Language Models (VLMs) to extract information from diagrams and tables.
-   **Entity Linking**: Use vector embeddings (pgvector) to resolve entities. If "NeRF" and "Neural Radiance Fields" have high cosine similarity, link them to the same node.

### 3. User Experience
-   **Semantic Search**: "Find papers that improve rendering speed of NeRFs".
-   **Graph Visualization**: Interactive UI (using D3.js or Cytoscape) to explore the citation network.
-   **Q&A Agent**: A RAG (Retrieval Augmented Generation) system built on top of the graph to answer specific questions.

## Extension: User-Facing Features
-   **Dashboard**: View recent ingestions and graph statistics.
-   **Explorer**: Click on a node (e.g., "Gaussian Splatting") to see all connected methods and papers.
