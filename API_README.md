# EvOlf Backend API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Directory Structure](#directory-structure)
5. [Database Schema](#database-schema)
6. [Elasticsearch Integration](#elasticsearch-integration)
7. [API Endpoints](#api-endpoints)
8. [Prediction System](#prediction-system)
9. [Data Flow](#data-flow)
10. [Configuration](#configuration)
11. [Setup Instructions](#setup-instructions)
12. [Code Examples](#code-examples)

---

## Overview

The EvOlf backend is a Django REST Framework-based API that powers the EvOlf GPCR (G Protein-Coupled Receptor) research platform. It provides:

- **Dataset Management**: Paginated access to GPCR-ligand interaction data
- **Advanced Search**: Elasticsearch-powered search with PostgreSQL fallback
- **Data Export**: ZIP-based export with filter support for large datasets (100MB+)
- **Structure Visualization**: PDB and SDF file serving for 3D molecular viewers
- **Prediction System**: Async job processing for SMILES-based predictions
- **Job Queue**: Background task management with status tracking

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (React Frontend)                        │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │ HTTP/REST
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DJANGO REST FRAMEWORK                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │  Dataset Views  │  │ Prediction Views│  │  Search Views   │              │
│  │  - List/Filter  │  │  - Submit Job   │  │  - Elasticsearch│              │
│  │  - Export ZIP   │  │  - Job Status   │  │  - Autocomplete │              │
│  │  - Details      │  │  - Download     │  │  - Suggestions  │              │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘              │
│           │                    │                    │                        │
│  ┌────────┴────────────────────┴────────────────────┴────────┐              │
│  │                      Serializers                          │              │
│  │                   (EvOlfSerializer)                       │              │
│  └────────────────────────────┬──────────────────────────────┘              │
└───────────────────────────────┼──────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│  PostgreSQL   │      │ Elasticsearch │      │  File System  │
│  (Primary DB) │      │  (Search)     │      │  (Media/Jobs) │
│               │      │               │      │               │
│  - EvOlf      │      │  - evolf      │      │  - PDB files  │
│    table      │      │    index      │      │  - SDF files  │
│  - Indexes    │      │  - Suggest    │      │  - Job data   │
└───────────────┘      └───────────────┘      └───────────────┘
```

### Request Flow

1. **Incoming Request** → Django URL Router
2. **URL Matching** → Appropriate View Class
3. **View Processing**:
   - Parse query parameters/body
   - Query Elasticsearch or PostgreSQL
   - Process data through serializers
4. **Response** → JSON or File stream

---

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | Django 4.x | Web framework |
| API Layer | Django REST Framework | RESTful API |
| Primary Database | PostgreSQL | Persistent storage |
| Search Engine | Elasticsearch | Full-text search & autocomplete |
| Data Processing | Pandas | CSV/data manipulation |
| Task Queue | Custom Job Scheduler | Async prediction jobs |
| File Serving | Django FileResponse | PDB/SDF/ZIP downloads |
| CORS | django-cors-headers | Cross-origin requests |

---

## Directory Structure

```
backend/
├── core/                          # Main application
│   ├── management/
│   │   └── commands/
│   │       ├── elastic_search.py   # Index data to Elasticsearch
│   │       ├── fetch_evolf_data.py # Fetch external data
│   │       └── import_evolf_data.py# Import CSV to PostgreSQL
│   ├── migrations/                 # Database migrations
│   ├── services/
│   │   └── job_scheduler.py        # Async job management
│   ├── views/
│   │   ├── __init__.py
│   │   ├── admin_views.py          # Admin endpoints
│   │   ├── dataset_views.py        # Dataset CRUD & export
│   │   ├── elastic_search_views.py # Search endpoints
│   │   ├── job_status_views.py     # Job tracking
│   │   ├── prediction_views.py     # SMILES prediction
│   │   └── structure_views.py      # PDB/SDF serving
│   ├── admin.py                    # Django admin config
│   ├── apps.py                     # App configuration
│   ├── documents.py                # Elasticsearch documents
│   ├── models.py                   # Django ORM models
│   ├── serializers.py              # DRF serializers
│   ├── tests.py                    # Unit tests
│   └── urls.py                     # URL routing
├── evo_backend/                    # Project settings
│   ├── __init__.py
│   ├── asgi.py                     # ASGI config
│   ├── settings.py                 # Django settings
│   ├── urls.py                     # Root URL config
│   └── wsgi.py                     # WSGI config
└── manage.py                       # Django CLI
```

---

## Database Schema

### EvOlf Model (PostgreSQL)

```python
class EvOlf(models.Model):
    # Primary Identifier
    EvOlf_ID = models.CharField(max_length=100)      # Unique dataset ID (e.g., "EvOlf_00001")
    
    # Classification
    Class = models.CharField(max_length=100)          # GPCR class (I, II, III, etc.)
    Species = models.CharField(max_length=100)        # Species name
    
    # Receptor Information
    Receptor_ID = models.CharField(max_length=100)    # Receptor identifier
    Receptor = models.CharField(max_length=255)       # Receptor name
    UniProt_ID = models.CharField(max_length=50)      # UniProt accession
    Sequence = models.TextField()                     # Amino acid sequence
    
    # Ligand Information
    Ligand = models.CharField(max_length=255)         # Ligand name
    CID = models.CharField(max_length=50)             # PubChem Compound ID
    ChEMBL_ID = models.CharField(max_length=50)       # ChEMBL identifier
    SMILES = models.TextField()                       # SMILES notation
    
    # Interaction Data
    EC50 = models.CharField(max_length=100)           # EC50 value
    Mutation_Type = models.CharField(max_length=100)  # Wild-type or mutant
    
    # Metadata
    Comments = models.TextField()                     # Additional notes
    Reference = models.TextField()                    # Literature reference
```

### Database Indexes

```sql
-- Performance indexes for common queries
CREATE INDEX idx_evolf_species ON core_evolf(Species);
CREATE INDEX idx_evolf_class ON core_evolf(Class);
CREATE INDEX idx_evolf_mutation ON core_evolf(Mutation_Type);
CREATE INDEX idx_evolf_id ON core_evolf(EvOlf_ID);
CREATE INDEX idx_evolf_ligand ON core_evolf(Ligand);
CREATE INDEX idx_evolf_receptor ON core_evolf(Receptor);
```

---

## Elasticsearch Integration

### Index Configuration

The `evolf` index is configured for optimal search performance:

```json
{
  "settings": {
    "analysis": {
      "analyzer": {
        "autocomplete": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "autocomplete_filter"]
        }
      },
      "filter": {
        "autocomplete_filter": {
          "type": "edge_ngram",
          "min_gram": 2,
          "max_gram": 20
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "EvOlf_ID": { "type": "keyword" },
      "Ligand": { "type": "text", "analyzer": "autocomplete" },
      "Receptor": { "type": "text", "analyzer": "autocomplete" },
      "Species": { "type": "keyword" },
      "Sequence": { "type": "text" },
      "UniProt_ID": { "type": "keyword" },
      "CID": { "type": "keyword" },
      "ChEMBL_ID": { "type": "keyword" },
      "suggest": { "type": "completion" }
    }
  }
}
```

### Search Query Building

The backend constructs multi-strategy Elasticsearch queries:

```python
def build_elasticsearch_query(search_term, filters=None):
    """
    Build ES query with multiple matching strategies:
    1. Exact phrase match (highest score)
    2. Multi-match across fields (medium score)
    3. Wildcard prefix match (lower score)
    """
    query = {
        "bool": {
            "should": [
                # Exact phrase match
                {"match_phrase": {"Ligand": {"query": search_term, "boost": 10}}},
                {"match_phrase": {"Receptor": {"query": search_term, "boost": 10}}},
                
                # Multi-match across indexed fields
                {"multi_match": {
                    "query": search_term,
                    "fields": ["EvOlf_ID^5", "Ligand^4", "Receptor^4", 
                              "Species^3", "CID^3", "ChEMBL_ID^3", "UniProt_ID^3"],
                    "type": "best_fields",
                    "fuzziness": "AUTO"
                }},
                
                # Wildcard for partial matches
                {"wildcard": {"Ligand": f"*{search_term.lower()}*"}}
            ],
            "minimum_should_match": 1
        }
    }
    
    # Apply filters if provided
    if filters:
        query["bool"]["filter"] = []
        if filters.get("species"):
            query["bool"]["filter"].append({"term": {"Species": filters["species"]}})
        # ... additional filters
    
    return query
```

### Autocomplete Suggestions

```python
# Suggestion query alongside search
"suggest": {
    "autocomplete_suggest": {
        "prefix": query,
        "completion": {"field": "suggest"}
    }
}
```

---

## API Endpoints

### Dataset Endpoints

#### `GET /api/dataset`

Fetches paginated dataset with filtering, sorting, and search.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | int | 1 | Page number |
| `limit` | int | 20 | Items per page |
| `search` | string | "" | Search query |
| `species` | string | "" | Filter by species |
| `class` | string | "" | Filter by GPCR class |
| `mutationType` | string | "" | Filter by mutation type |
| `sortBy` | string | "evolfId" | Sort field |
| `sortOrder` | string | "asc" | Sort direction |

**Response:**

```json
{
  "data": [
    {
      "evolfId": "EvOlf_00001",
      "class": "Class I",
      "species": "Homo sapiens",
      "receptor": "OR1A1",
      "ligand": "Octanal",
      "ec50": "10.5 μM",
      "mutationType": "Wild-type"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 500,
    "totalItems": 10000,
    "itemsPerPage": 20,
    "hasNext": true,
    "hasPrev": false
  },
  "stats": {
    "totalRows": 10000,
    "uniqueSpecies": 45,
    "uniqueClasses": 5,
    "uniqueMutationTypes": 3
  },
  "filters": {
    "species": ["Homo sapiens", "Mus musculus", ...],
    "classes": ["Class I", "Class II", ...],
    "mutationTypes": ["Wild-type", "Mutant"]
  },
  "searchSuggestions": ["Octanal", "Octanol", ...]
}
```

---

#### `GET /api/dataset/details/<evolfId>/`

Fetches complete details for a single dataset entry.

**Response:**

```json
{
  "evolfId": "EvOlf_00001",
  "class": "Class I",
  "species": "Homo sapiens",
  "receptor": {
    "id": "OR1A1",
    "name": "Olfactory receptor 1A1",
    "uniprotId": "Q9Y2T5",
    "sequence": "MTEKNLSSS..."
  },
  "ligand": {
    "name": "Octanal",
    "cid": "454",
    "chemblId": "CHEMBL545",
    "smiles": "CCCCCCCC=O"
  },
  "interaction": {
    "ec50": "10.5 μM",
    "mutationType": "Wild-type",
    "comments": "...",
    "reference": "..."
  }
}
```

---

#### `POST /api/dataset/export`

Exports filtered dataset as ZIP file. **Supports large datasets (100MB+).**

**Request Body:**

```json
{
  "search": "octanal",
  "species": "Homo sapiens",
  "class": "Class I",
  "mutationType": "Wild-type",
  "sortBy": "EvOlf_ID",
  "sortOrder": "asc"
}
```

**Important**: This endpoint re-runs the filtered query server-side instead of accepting IDs, avoiding large request payloads for datasets with 100,000+ records.

**Response**: Binary ZIP file containing:
- `data.csv` - Filtered dataset
- `metadata.json` - Export info (count, filters, timestamp)
- `README.txt` - Data dictionary

**cURL Example:**

```bash
curl -X POST "https://api.evolf.example.com/api/dataset/export" \
  -H "Content-Type: application/json" \
  -d '{"species": "Homo sapiens", "search": "octanal"}' \
  --output evolf_export.zip \
  --max-time 300
```

---

#### `GET /api/dataset/download`

Downloads complete dataset as cached ZIP.

**Response**: Pre-generated ZIP file (~100MB+)

---

#### `GET /api/dataset/download/<evolfId>/`

Downloads all files for a single entry.

**Response**: ZIP containing:
- CSV row data
- PDB structure file
- SDF molecule file
- PNG visualization

---

### Structure Endpoints

#### `GET /api/structures/<evolf_id>/`

Returns molecular structure data for 3D visualization.

**Response:**

```json
{
  "evolfId": "EvOlf_00001",
  "pdbData": "ATOM      1  N   ALA A   1...",
  "sdfData": "Octanal\n  ChemDraw...",
  "pdbUrl": "/media/structures/EvOlf_00001.pdb",
  "sdfUrl": "/media/structures/EvOlf_00001.sdf"
}
```

---

### Search Endpoints

#### `GET /api/search?q=<query>`

Elasticsearch-powered search with autocomplete.

**Response:**

```json
{
  "query": "octan",
  "results": [
    {
      "EvOlf_ID": "EvOlf_00001",
      "Ligand": "Octanal",
      "Receptor": "OR1A1",
      "Species": "Homo sapiens"
    }
  ],
  "suggestions": ["Octanal", "Octanol", "Octanoic acid"]
}
```

---

### Prediction Endpoints

#### `POST /api/predict`

Submits SMILES-based prediction job.

**Request Body:**

```json
{
  "receptor": "MTEKNLSSS...",
  "smiles": ["CCCCCCCC=O", "CCCCCCC=O"],
  "jobName": "my_prediction"
}
```

**Response:**

```json
{
  "jobId": "abc123-def456",
  "status": "queued",
  "message": "Job submitted successfully",
  "estimatedTime": "5-10 minutes"
}
```

---

#### `GET /api/predict/job/<job_id>/`

Checks prediction job status.

**Response (Pending):**

```json
{
  "jobId": "abc123-def456",
  "status": "running",
  "progress": 45,
  "message": "Processing SMILES 45 of 100"
}
```

**Response (Complete):**

```json
{
  "jobId": "abc123-def456",
  "status": "completed",
  "results": [
    {"smiles": "CCCCCCCC=O", "prediction": 0.85, "confidence": 0.92}
  ],
  "downloadUrl": "/api/predict/job/abc123-def456/download"
}
```

---

#### `GET /api/predict/job/<job_id>/download`

Downloads prediction results as ZIP.

---

## Prediction System

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  POST /predict  │────▶│  Job Scheduler  │────▶│  Docker Worker  │
│  (Submit Job)   │     │  (Queue Mgmt)   │     │  (ML Inference) │
└─────────────────┘     └────────┬────────┘     └────────┬────────┘
                                 │                       │
                                 ▼                       ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │   Job Status    │◀────│   Output Files  │
                        │   (Tracking)    │     │   (Results)     │
                        └─────────────────┘     └─────────────────┘
```

### Job Lifecycle

1. **Submission**: Client POSTs SMILES data
2. **Validation**: Backend validates SMILES format and count
3. **Queueing**: Job added to scheduler queue
4. **Processing**: Docker container runs ML model
5. **Completion**: Results written to job directory
6. **Retrieval**: Client polls status and downloads results

### Job Directory Structure

```
JOB_DATA_DIR/
└── <job_id>/
    ├── input.json          # Original request
    ├── status.json         # Current status
    ├── output/
    │   ├── predictions.csv # Results
    │   └── summary.json    # Statistics
    └── logs/
        └── processing.log  # Debug logs
```

### Configuration

```python
# settings.py
PREDICT_DOCKER_URL = os.getenv("PREDICT_DOCKER_URL")  # Docker API endpoint
JOB_DATA_DIR = os.getenv("JOB_DATA_DIR", "/data/jobs")
MAX_SMILES_LIMIT = int(os.getenv("MAX_SMILES_LIMIT", 1000))
ENABLE_SCHEDULER = os.getenv("ENABLE_SCHEDULER", "true") == "true"
```

---

## Data Flow

### Dataset List Request Flow

```
1. GET /api/dataset?search=octanal&species=Homo+sapiens&page=1
   │
   ▼
2. DatasetListAPIView.get()
   │
   ├─── Check if Elasticsearch available
   │    │
   │    ├── YES: build_elasticsearch_query()
   │    │         search_with_elasticsearch()
   │    │         │
   │    │         └── Returns: matched IDs, suggestions, total count
   │    │
   │    └── NO:  PostgreSQL fallback query
   │              EvOlf.objects.filter(...)
   │
   ▼
3. Apply additional filters (species, class, mutationType)
   │
   ▼
4. Apply sorting and pagination
   │
   ▼
5. Serialize with EvOlfSerializer
   │
   ▼
6. Build response with pagination info, stats, suggestions
   │
   ▼
7. Return JsonResponse
```

### Export Request Flow

```
1. POST /api/dataset/export
   Body: {"search": "octanal", "species": "Homo sapiens"}
   │
   ▼
2. DatasetExportAPIView.post()
   │
   ▼
3. Re-run search/filter query (same as list endpoint)
   │   - Uses Elasticsearch if available
   │   - Falls back to PostgreSQL
   │
   ▼
4. Fetch all matching records (no pagination)
   │
   ▼
5. Generate export files:
   │   ├── data.csv (pandas DataFrame)
   │   ├── metadata.json
   │   └── README.txt
   │
   ▼
6. Create ZIP in memory (BytesIO)
   │
   ▼
7. Return FileResponse (streaming)
```

---

## Configuration

### Environment Variables

```bash
# Django Core
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=api.evolf.example.com,localhost

# Database
DB_NAME=evolf_db
DB_USER=evolf_user
DB_PASSWORD=secure_password
DB_HOST=localhost
DB_PORT=5432

# Elasticsearch
ELASTIC_HOST=https://elasticsearch.example.com:9200
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=elastic_password

# Prediction System
PREDICT_DOCKER_URL=http://ml-worker:8000
JOB_DATA_DIR=/data/jobs
MAX_SMILES_LIMIT=1000
ENABLE_SCHEDULER=true

# Paths
MEDIA_ROOT=/data/media
STATIC_ROOT=/data/static
PATH_AFTER_BASE_DIR=data
```

### CORS Configuration

```python
# settings.py
CORS_ALLOW_ALL_ORIGINS = True  # Development
# or
CORS_ALLOWED_ORIGINS = [
    "https://evolf.example.com",
    "http://localhost:8080",
]
```

### Rate Limiting

```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
    }
}
```

---

## Setup Instructions

### Prerequisites

- Python 3.10+
- PostgreSQL 14+
- Elasticsearch 8.x
- Docker (for prediction system)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/your-org/evolf.git
cd evolf/backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env with your settings

# 5. Run migrations
python manage.py migrate

# 6. Import data
python manage.py import_evolf_data --csv-path=/path/to/evolf_data.csv

# 7. Index to Elasticsearch
python manage.py elastic_search --action=create_index
python manage.py elastic_search --action=index_data

# 8. Run development server
python manage.py runserver 0.0.0.0:8000
```

### Production Deployment

```bash
# Using Gunicorn
gunicorn evo_backend.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 4 \
  --timeout 300 \
  --access-logfile - \
  --error-logfile -
```

---

## Code Examples

### JavaScript/TypeScript

```typescript
// Fetch paginated dataset
const response = await fetch(
  'https://api.evolf.example.com/api/dataset?' +
  new URLSearchParams({
    page: '1',
    limit: '20',
    search: 'octanal',
    species: 'Homo sapiens'
  })
);
const data = await response.json();

// Export filtered data
const exportResponse = await fetch(
  'https://api.evolf.example.com/api/dataset/export',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      search: 'octanal',
      species: 'Homo sapiens'
    })
  }
);
const blob = await exportResponse.blob();
// Save blob as ZIP file
```

### Python

```python
import requests

# Search dataset
response = requests.get(
    'https://api.evolf.example.com/api/dataset',
    params={
        'search': 'octanal',
        'species': 'Homo sapiens',
        'page': 1,
        'limit': 50
    }
)
data = response.json()

# Export with filters (large datasets)
export_response = requests.post(
    'https://api.evolf.example.com/api/dataset/export',
    json={
        'search': 'octanal',
        'species': 'Homo sapiens'
    },
    timeout=300  # 5 minutes for large exports
)

with open('evolf_export.zip', 'wb') as f:
    f.write(export_response.content)
```

### R

```r
library(httr)
library(jsonlite)

# Fetch dataset
response <- GET(
  "https://api.evolf.example.com/api/dataset",
  query = list(
    search = "octanal",
    species = "Homo sapiens",
    page = 1,
    limit = 100
  )
)
data <- fromJSON(content(response, "text"))

# Export filtered data
export_response <- POST(
  "https://api.evolf.example.com/api/dataset/export",
  body = list(
    search = "octanal",
    species = "Homo sapiens"
  ),
  encode = "json",
  timeout(300)
)

writeBin(content(export_response, "raw"), "evolf_export.zip")
```

### cURL

```bash
# List dataset
curl "https://api.evolf.example.com/api/dataset?search=octanal&page=1&limit=20"

# Get details
curl "https://api.evolf.example.com/api/dataset/details/EvOlf_00001/"

# Export with filters
curl -X POST "https://api.evolf.example.com/api/dataset/export" \
  -H "Content-Type: application/json" \
  -d '{"search": "octanal", "species": "Homo sapiens"}' \
  --output evolf_export.zip \
  --max-time 300

# Submit prediction
curl -X POST "https://api.evolf.example.com/api/predict" \
  -H "Content-Type: application/json" \
  -d '{"receptor": "MTEKNLSSS...", "smiles": ["CCCCCCCC=O"]}'

# Check job status
curl "https://api.evolf.example.com/api/predict/job/abc123-def456/"
```

---

## Error Handling

### Standard Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional context"
}
```

### HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | Success | Request completed |
| 400 | Bad Request | Missing/invalid parameters |
| 404 | Not Found | Invalid ID or endpoint |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Database/ES connection issue |
| 504 | Gateway Timeout | Large export timeout |

---

## Performance Considerations

### For Large Exports

- Use filter-based export (`POST /api/dataset/export`) instead of ID-based
- Set client timeout to 5+ minutes for datasets > 50,000 records
- Consider background job queue for very large exports

### For Search

- Elasticsearch handles most queries efficiently
- PostgreSQL fallback may be slower for complex searches
- Use specific filters to reduce result sets

### For Predictions

- Maximum 1,000 SMILES per request (configurable)
- Jobs are processed asynchronously
- Poll status endpoint for completion

---

## License

MIT License - See LICENSE file for details.
