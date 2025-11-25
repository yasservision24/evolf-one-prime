# EvOlf Platform - Complete Documentation

Comprehensive documentation for the EvOlf GPCR research platform, covering architecture, setup, API, and features.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Setup Instructions](#setup-instructions)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
   - [Docker Setup (Optional)](#docker-setup-optional)
5. [API Documentation](#api-documentation)
   - [Dataset Endpoints](#dataset-endpoints)
   - [Search Endpoints](#search-endpoints)
   - [Prediction Endpoints](#prediction-endpoints)
6. [Frontend Features](#frontend-features)
7. [Database Schema](#database-schema)
8. [Search Functionality](#search-functionality)
9. [File Structure](#file-structure)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

**EvOlf** is a comprehensive platform for GPCR (G Protein-Coupled Receptors) research, providing:

- **Curated Database**: Browse 250+ GPCR-ligand interactions with detailed annotations
- **Advanced Search**: ElasticSearch-powered full-text search with filtering
- **Prediction System**: Submit SMILES-based ligand predictions for binding affinity
- **3D Visualization**: Interactive molecular structure viewers (PDB/SDF)
- **Data Export**: Download datasets in multiple formats (CSV, ZIP)
- **RESTful API**: Complete programmatic access for integration

**Key Features**:
- Server-side pagination and filtering for performance
- Real-time search with autocomplete
- Asynchronous job processing for predictions
- Responsive design with dark mode support
- Export filtered or complete datasets

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **TypeScript** | 5.x | Type safety |
| **Vite** | Latest | Build tool and dev server |
| **React Router** | 6.30.1 | Client-side routing |
| **TanStack Query** | 5.83.0 | Server state management |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **Radix UI** | Latest | Accessible UI primitives |
| **shadcn/ui** | Latest | Pre-built components |

**UI Component Libraries**:
- `lucide-react`: Icons
- `recharts`: Data visualization
- `sonner`: Toast notifications
- `vaul`: Drawer components

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Django** | 4.x | Web framework |
| **Django REST Framework** | 3.x | API framework |
| **PostgreSQL** | 14+ | Primary database |
| **ElasticSearch** | 8.x | Search engine |
| **Pandas** | Latest | Data processing |

**Backend Dependencies**:
- `psycopg2`: PostgreSQL adapter
- `django-cors-headers`: CORS support
- `python-decouple`: Environment config

### Design System

**Color Scheme** (EMBO-inspired):
- **Primary**: White, Black, Yellow
- **Accent Colors**:
  - **Green** (#00C9A7 - teal): Database/Curation section
  - **Purple** (#8B5CF6): Prediction section
- **Gradient**: "EvOlf" logo uses teal-to-purple gradient
- **Semantic Tokens**: All colors defined in `index.css` using HSL

**Typography**:
- Responsive font scaling
- System font stack with fallbacks
- Semantic heading hierarchy

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │   React    │  │ React Router │  │  TanStack Query │    │
│  │ Components │→ │   (Routes)   │→ │  (API Calls)    │    │
│  └────────────┘  └──────────────┘  └─────────────────┘    │
│         ↓                                    ↓              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         API Client (src/lib/api.ts)                │    │
│  │  - fetchDatasetPaginated()                         │    │
│  │  - fetchDatasetDetail()                            │    │
│  │  - submitPrediction()                              │    │
│  │  - searchDataset()                                 │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                         Backend                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │      Django REST Framework API Views               │    │
│  │  - DatasetListAPIView (GET /dataset)               │    │
│  │  - FetchDatasetDetails (GET /dataset/details/:id)  │    │
│  │  - SmilesPredictionAPIView (POST /predict/smiles/) │    │
│  │  - ElasticSearchView (GET /search/)                │    │
│  └─────────────┬──────────────────────┬─────────────────┘  │
│                ↓                      ↓                     │
│  ┌──────────────────────┐  ┌───────────────────────┐      │
│  │   PostgreSQL DB      │  │   ElasticSearch       │      │
│  │  - EvOlf Model       │  │  - Full-text search   │      │
│  │  - Relationships     │  │  - Fuzzy matching     │      │
│  └──────────────────────┘  └───────────────────────┘      │
│                ↓                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         File Storage (MEDIA_ROOT)                   │   │
│  │  - pdb_files/     (3D protein structures)           │   │
│  │  - sdf_files/     (3D ligand structures)            │   │
│  │  - smiles_2d/     (2D structure images)             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│               Prediction Pipeline (Docker)                  │
│  - Accepts CSV with SMILES and sequences                    │
│  - Processes binding affinity predictions                   │
│  - Returns results to job directory                         │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

**1. Dataset Retrieval**:
```
User → Frontend → API Client → Backend View → PostgreSQL/ElasticSearch → Response
```

**2. Search**:
```
User Types → Frontend → API Client → Backend → ElasticSearch (primary) 
                                              → PostgreSQL (fallback) → Results
```

**3. Prediction**:
```
User Submits → Frontend → API → CSV Creation → Async Pipeline → Job Status Polling
```

---

## Setup Instructions

### Backend Setup

#### 1. Prerequisites

- Python 3.9+
- PostgreSQL 14+
- ElasticSearch 8.x (optional, fallback to PostgreSQL)

#### 2. Clone Repository

```bash
git clone <repository-url>
cd evolf-platform
```

#### 3. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

#### 4. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Key Dependencies**:
```txt
Django>=4.2
djangorestframework>=3.14
psycopg2-binary>=2.9
django-cors-headers>=4.0
elasticsearch>=8.0
pandas>=2.0
python-decouple>=3.8
```

#### 5. Configure Environment

Create `.env` file in `backend/` directory:

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1,192.168.24.13

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/evolf_db

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080

# ElasticSearch (optional)
ELASTIC_HOST=http://localhost:9200
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=your-elastic-password

# File Storage
MEDIA_ROOT=/path/to/media/files
MEDIA_URL=/media/

# Prediction Pipeline
PREDICT_DOCKER_URL=http://localhost:5000
JOB_DATA_DIR=/path/to/job/data
ENABLE_SCHEDULER=False
DEBUG_LOG=True

# Pagination
DEFAULT_PAGE_SIZE=20
```

#### 6. Setup PostgreSQL Database

```bash
# Create database
createdb evolf_db

# Or using psql:
psql -U postgres
CREATE DATABASE evolf_db;
CREATE USER evolf_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE evolf_db TO evolf_user;
\q
```

#### 7. Run Migrations

```bash
cd backend
python manage.py migrate
```

**This creates tables**:
- `core_evolf`: Main dataset table
- Django admin tables
- Migration history

#### 8. Create Superuser

```bash
python manage.py createsuperuser
```

#### 9. Import Initial Data

```bash
# Import dataset from CSV
python manage.py import_evolf_data

# Build ElasticSearch index (if using ES)
python manage.py elastic_search --rebuild
```

#### 10. Start Development Server

```bash
python manage.py runserver 0.0.0.0:3000
```

**Backend now running at**: `http://127.0.0.1:3000`

**Admin panel**: `http://127.0.0.1:3000/admin`

#### 11. Verify Installation

```bash
# Test API endpoint
curl http://127.0.0.1:3000/api/dataset?page=1&limit=5

# Should return JSON with dataset entries
```

---

### Frontend Setup

#### 1. Prerequisites

- Node.js 18+ (or Bun)
- npm or bun package manager

#### 2. Navigate to Frontend

```bash
cd frontend
# or if in root:
cd ..
```

#### 3. Install Dependencies

```bash
# Using npm
npm install

# Or using bun (faster)
bun install
```

#### 4. Configure Environment

Create `.env` file in frontend root:

```env
# API Base URL
VITE_API_BASE_URL=http://127.0.0.1:3000/api

# Optional: Analytics, feature flags, etc.
```

#### 5. Start Development Server

```bash
# Using npm
npm run dev

# Or using bun
bun dev
```

**Frontend now running at**: `http://localhost:8080`

#### 6. Build for Production

```bash
# Using npm
npm run build

# Or using bun
bun run build
```

**Output**: `dist/` directory contains production-ready files

---

### Docker Setup (Optional)

#### Docker Compose Configuration

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: evolf_db
      POSTGRES_USER: evolf_user
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data

  backend:
    build: ./backend
    command: python manage.py runserver 0.0.0.0:3000
    volumes:
      - ./backend:/app
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - elasticsearch
    environment:
      DATABASE_URL: postgresql://evolf_user:your_password@postgres:5432/evolf_db
      ELASTIC_HOST: http://elasticsearch:9200

  frontend:
    build: ./frontend
    command: npm run dev -- --host
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "8080:8080"
    environment:
      VITE_API_BASE_URL: http://localhost:3000/api

volumes:
  postgres_data:
  es_data:
```

#### Run with Docker

```bash
docker-compose up -d
```

---

## API Documentation

Complete REST API reference with all endpoints, parameters, and examples.

### Base Configuration

**Base URL**: `http://127.0.0.1:3000/api`

**Request Headers**:
```json
{
  "Content-Type": "application/json"
}
```

**Timeout**: 30 seconds

---

### Dataset Endpoints

#### 1. GET /dataset - Paginated Dataset

Retrieve filtered and paginated dataset with server-side processing.

**Query Parameters**:
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20, max: 1000)
- `search` (string): Search term (ElasticSearch or trigram fallback)
- `sortBy` (string): Field to sort by (`EvOlf_ID`, `Receptor`, `Ligand`, `Species`, `Class`, `Mutation`)
- `sortOrder` (string): `asc` or `desc` (default: `desc`)
- `species` (string): Filter by species
- `class` (string): Filter by GPCR class
- `mutationType` (string): Filter by mutation status

**Example Request**:
```bash
curl "http://127.0.0.1:3000/api/dataset?page=1&limit=20&search=dopamine&species=Human&sortBy=Receptor&sortOrder=asc"
```

**Response (200 OK)**:
```json
{
  "data": [
    {
      "id": "1",
      "evolfId": "EvOlf0100001",
      "receptor": "Dopamine D2 receptor",
      "species": "Human",
      "class_field": "1",
      "ligand": "Dopamine",
      "mutation": "Wild-type",
      "chemblId": "CHEMBL228",
      "uniprotId": "P14416",
      "ensembleId": "ENSG00000149295"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 13,
    "totalItems": 250,
    "itemsPerPage": 20
  },
  "statistics": {
    "totalRows": 250,
    "uniqueClasses": ["0", "1"],
    "uniqueSpecies": ["Human", "Mouse", "Rat"],
    "uniqueMutationTypes": ["Wild type", "Mutant"]
  },
  "filterOptions": {
    "uniqueClasses": ["0", "1"],
    "uniqueSpecies": ["Human", "Mouse", "Rat"],
    "uniqueMutationTypes": ["Wild type", "Mutant"]
  },
  "all_evolf_ids": ["EvOlf0100001", "EvOlf0100002", "..."]
}
```

---

#### 2. GET /dataset/details/{evolfId} - Entry Details

Fetch complete details for a specific EvOlf entry.

**Path Parameters**:
- `evolfId` (string, required): EvOlf identifier (e.g., `EvOlf0100001`)

**Example Request**:
```bash
curl "http://127.0.0.1:3000/api/dataset/details/EvOlf0100001"
```

**Response (200 OK)**:
```json
{
  "evolfId": "EvOlf0100001",
  "receptor": "Dopamine D2 receptor",
  "ligand": "Dopamine",
  "species": "Human",
  "class": "1",
  "mutation": "Wild-type",
  "mutationStatus": "Wild-type",
  "uniprotId": "P14416",
  "uniprotLink": "https://www.uniprot.org/uniprotkb/P14416",
  "chemblId": "CHEMBL228",
  "pubchemId": "681",
  "pubchemLink": "https://pubchem.ncbi.nlm.nih.gov/compound/681",
  "smiles": "NCCc1ccc(O)c(O)c1",
  "inchi": "InChI=1S/C8H11NO2/c9-4-3-6-1-2-7(10)8(11)5-6/h1-2,5,10-11H,3-4,9H2",
  "inchiKey": "VYFYYTLLBUKUHU-UHFFFAOYSA-N",
  "sequence": "MDPLNLSWYDDDLERQNWSRPFNGSDGKADRPPYNYYATLLTLLIAVIVFGNVLVCMAVSREKALQTTTNYLIVSLAVADLLVATLVMPWVVYLEVVGEWKFSRIHCDIFVTLDVMMCTASILNLCAISIDRYTAVAMPMLYNT...",
  "pdbData": "ATOM      1  N   MET A   1...",
  "sdfData": "\\n  Mrv0541...",
  "structure3d": "http://127.0.0.1:3000/media/pdb_files/EvOlf0100001.pdb",
  "expressionSystem": "HEK293",
  "parameter": "Ki",
  "value": "2.1",
  "unit": "nM",
  "comments": "High affinity binding",
  "source": "12345678",
  "sourceLinks": "https://pubmed.ncbi.nlm.nih.gov/12345678/"
}
```

**Field Descriptions**:
- **Identifiers**: `evolfId`, `uniprotId`, `chemblId`, `pubchemId`
- **Sequences**: `sequence`, `smiles`, `inchi`, `inchiKey`
- **Structures**: `pdbData` (full PDB), `sdfData` (full SDF), `structure3d` (URL)
- **External Links**: `uniprotLink`, `pubchemLink`, `sourceLinks` (pipe-delimited)
- **Experimental**: `parameter`, `value`, `unit`, `expressionSystem`, `comments`

---

#### 3. POST /dataset/export - Export Multiple Entries

Export dataset entries as ZIP file (CSV + metadata).

**Request Body (Option A - by IDs)**:
```json
{
  "evolfIds": ["EvOlf0100001", "EvOlf0100002"]
}
```

**Request Body (Option B - by filters)**:
```json
{
  "species": "Human",
  "class": "1",
  "search": "dopamine"
}
```

**Example**:
```bash
curl -X POST "http://127.0.0.1:3000/api/dataset/export" \
  -H "Content-Type: application/json" \
  -d '{"evolfIds": ["EvOlf0100001", "EvOlf0100002"]}' \
  --output export.zip
```

**Response**: Binary ZIP file

---

#### 4. GET /dataset/export/{evolfId} - Export Single Entry

Export a single entry's files (PDB, SDF, PNG).

**Example**:
```bash
curl "http://127.0.0.1:3000/api/dataset/export/EvOlf0100001" \
  --output entry_files.zip
```

---

#### 5. GET /dataset/download - Download Complete Dataset

Download entire database as cached ZIP.

**Example**:
```bash
curl "http://127.0.0.1:3000/api/dataset/download" \
  --output complete_dataset.zip
```

---

### Search Endpoints

#### GET /search/?q={query} - ElasticSearch Query

Full-text search with ElasticSearch (PostgreSQL fallback).

**Query Parameters**:
- `q` (string, required): Search query

**Example**:
```bash
curl "http://127.0.0.1:3000/api/search/?q=dopamine"
```

**Response (200 OK)**:
```json
{
  "results": [
    {
      "EvOlf_ID": "EvOlf0100045",
      "Receptor": "Dopamine D2 receptor",
      "Ligand": "Dopamine",
      "Species": "Human",
      "Class": "1",
      "Mutation": "Wild-type",
      "score": 0.95
    }
  ]
}
```

**Search Features**:
- **Primary**: ElasticSearch wildcard matching (Receptor, Ligand, Species)
- **Fallback**: PostgreSQL trigram similarity (similarity > 0.2)
- **Case-insensitive**
- **Relevance scoring**

---

### Prediction Endpoints

#### 1. POST /predict/smiles/ - Submit Prediction

Submit SMILES for binding affinity prediction.

**Request Body**:
```json
{
  "smiles": "NCCc1c[nH]c2ccc(O)cc12",
  "sequence": "MDVLSPGQGNNTTSPPAPFET...",
  "temp_ligand_id": "serotonin",
  "temp_rec_id": "5ht1a",
  "id": "custom_job_id"
}
```

**Required Fields**:
- `smiles` (string): SMILES notation (no whitespace, valid SMILES characters)

**Optional Fields**:
- `sequence` / `mutated_sequence`: Receptor amino acid sequence (no FASTA headers)
- `temp_ligand_id`: Ligand identifier
- `temp_rec_id`: Receptor identifier
- `id`: Custom job ID

**Validation**:
- SMILES: No whitespace, characters: `A-Za-z0-9@+-[]()=#/\%.:\*`
- Sequence: No whitespace, no `>`, valid amino acids only
- No file uploads
- No arrays

**Example**:
```bash
curl -X POST "http://127.0.0.1:3000/api/predict/smiles/" \
  -H "Content-Type: application/json" \
  -d '{
    "smiles": "NCCc1c[nH]c2ccc(O)cc12",
    "sequence": "MDVLSPGQGNNTTSPPAPFETGGNTTGISDVTFSYQVITSLLLGTLIFCAVLGN"
  }'
```

**Response (200 OK)**:
```json
{
  "job_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "message": "Job submitted to pipeline asynchronously."
}
```

---

#### 2. GET /predict/job/{job_id}/ - Get Job Status

Check prediction job status.

**Path Parameters**:
- `job_id` (string, required): Job UUID

**Query Parameters** (optional):
- `download=output`: Download results as ZIP

**Example**:
```bash
curl "http://127.0.0.1:3000/api/predict/job/a1b2c3d4-e5f6-7890-abcd-ef1234567890/"
```

**Response (Processing)**:
```json
{
  "status": "processing",
  "message": "Job started but no output files yet"
}
```

**Response (Finished)**:
```json
{
  "job_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "finished",
  "output_files": [
    "output/predictions.csv",
    "output/visualization.png"
  ]
}
```

---

#### 3. GET /predict/download/{job_id}/ - Download Results

Download job results as ZIP.

**Example**:
```bash
curl "http://127.0.0.1:3000/api/predict/download/a1b2c3d4-e5f6-7890-abcd-ef1234567890/" \
  --output results.zip
```

**Response**: Binary ZIP with output files

---

## Frontend Features

### Pages

#### 1. Home (`/`)
- Hero section with EvOlf branding
- Feature highlights
- Quick navigation to database and prediction tools

#### 2. Database Dashboard (`/dataset/dashboard`)
- Paginated table with 20 items per page
- Server-side filters: Species, Class, Mutation Type
- Real-time search bar
- Sort by: EvOlf ID, Receptor, Ligand, Species, Class
- Bulk export with selection
- Statistics panel

#### 3. Dataset Detail Pages
- **Interaction** (`/dataset/detail/:id`): Overview with experimental details
- **Receptor** (`/dataset/receptor/:id`): Receptor info, sequence, 3D structure
- **Ligand** (`/dataset/ligand/:id`): Ligand properties, SMILES, 2D/3D structures
- **Structures** (`/dataset/structures/:id`): Combined 3D viewer

#### 4. Prediction Dashboard (`/prediction/dashboard`)
- SMILES input form
- Optional receptor sequence input
- Job submission
- Recent jobs list

#### 5. Prediction Results (`/prediction/result/:jobId`)
- Job status polling
- Results visualization
- Download results ZIP
- Error handling for expired/failed jobs

### UI Components

Built with **shadcn/ui** and **Radix UI**:

- `<Button>`: Primary, secondary, outline variants
- `<Card>`: Content containers with headers
- `<Table>`: Sortable data tables with pagination
- `<Select>`: Dropdown filters
- `<Input>`: Text fields with validation
- `<Textarea>`: Multi-line input
- `<Dialog>`: Modal overlays
- `<Toast>`: Notifications
- `<Skeleton>`: Loading states
- `<Tabs>`: Navigation between related content

### State Management

**TanStack Query** (React Query) for server state:

```typescript
// Fetch dataset with automatic caching
const { data, isLoading } = useQuery({
  queryKey: ['dataset', page, limit, filters],
  queryFn: () => fetchDatasetPaginated(page, limit, search, sortBy, sortOrder, species, classFilter, mutationType)
});

// Submit prediction with mutation
const mutation = useMutation({
  mutationFn: submitPrediction,
  onSuccess: (data) => {
    navigate(`/prediction/result/${data.job_id}`);
  }
});
```

**Features**:
- Automatic caching and invalidation
- Background refetching
- Optimistic updates
- Error retry logic

---

## Database Schema

### EvOlf Model

**Table**: `core_evolf`

**Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `id` | Integer (PK) | Auto-increment primary key |
| `EvOlf_ID` | String (Unique) | EvOlf identifier (e.g., EvOlf0100001) |
| `Receptor` | String | Receptor name |
| `Species` | String | Species name |
| `Class` | String | GPCR class (0, 1) |
| `Ligand` | String | Ligand name |
| `Mutation_Status` | String | Wild type or Mutant |
| `Mutation` | String | Mutation description |
| `ChEMBL_ID` | String | ChEMBL identifier |
| `UniProt_ID` | String | UniProt identifier |
| `CID` | String | PubChem CID |
| `Ensemble_ID` | String | Ensembl gene ID |
| `Gene_Symbol` | String | Gene symbol |
| `Receptor_Subtype` | String | Receptor subtype |
| `Expression_System` | String | Expression system used |
| `Parameter` | String | Measurement parameter (e.g., Ki) |
| `Value` | String | Parameter value |
| `Unit` | String | Value unit |
| `Comments` | Text | Additional notes |
| `Source` | String | PubMed IDs (pipe-delimited) |
| `Source_Links` | Text | Full PubMed URLs (pipe-delimited) |
| `SMILES` | Text | SMILES notation |
| `InChi` | Text | InChI string |
| `InChiKey` | String | InChI key |
| `IUPAC_Name` | String | IUPAC name |
| `Sequence` | Text | Protein sequence |

**Indexes**:
- `EvOlf_ID` (unique)
- `Receptor` (btree)
- `Species` (btree)
- `Class` (btree)
- `Mutation_Status` (btree)

**Relationships**:
- One-to-many with file storage (PDB, SDF, images)

---

## Search Functionality

### ElasticSearch Configuration

**Index**: `evolf`

**Mapping**:
```json
{
  "properties": {
    "EvOlf_ID": { "type": "keyword" },
    "Receptor": { "type": "text" },
    "Ligand": { "type": "text" },
    "Species": { "type": "text" },
    "Class": { "type": "keyword" },
    "Mutation": { "type": "text" }
  }
}
```

**Query Structure**:
```python
{
  "query": {
    "bool": {
      "should": [
        {"wildcard": {"Receptor": {"value": f"*{search}*", "case_insensitive": True}}},
        {"wildcard": {"Ligand": {"value": f"*{search}*", "case_insensitive": True}}},
        {"wildcard": {"Species": {"value": f"*{search}*", "case_insensitive": True}}}
      ]
    }
  }
}
```

### PostgreSQL Fallback

**Trigram Similarity**:
```python
from django.contrib.postgres.search import TrigramSimilarity

queryset = EvOlf.objects.annotate(
    similarity=TrigramSimilarity('Receptor', search_term)
).filter(similarity__gt=0.2).order_by('-similarity')
```

**Extension Required**:
```sql
CREATE EXTENSION pg_trgm;
```

---

## File Structure

```
evolf-platform/
├── backend/
│   ├── core/
│   │   ├── management/
│   │   │   ├── commands/
│   │   │   │   ├── elastic_search.py
│   │   │   │   ├── import_evolf_data.py
│   │   │   │   └── fetch_evolf_data.py
│   │   │   └── evolf_data.csv
│   │   ├── migrations/
│   │   ├── views/
│   │   │   ├── dataset_views.py
│   │   │   ├── prediction_views.py
│   │   │   ├── job_status_views.py
│   │   │   ├── structure_views.py
│   │   │   └── elastic_search_views.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── documents.py
│   ├── evo_backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── media/
│   │   ├── pdb_files/
│   │   ├── sdf_files/
│   │   └── smiles_2d/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # shadcn components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Molecular3DViewer.tsx
│   │   ├── pages/
│   │   │   ├── Index.tsx
│   │   │   ├── dataset/
│   │   │   │   ├── DatabaseDashboard.tsx
│   │   │   │   ├── DatasetInteraction.tsx
│   │   │   │   ├── DatasetReceptor.tsx
│   │   │   │   ├── DatasetLigand.tsx
│   │   │   │   └── DatasetStructures.tsx
│   │   │   ├── prediction/
│   │   │   │   ├── PredictionDashboard.tsx
│   │   │   │   └── PredictionResult.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── api.ts            # API client
│   │   │   └── utils.ts
│   │   ├── config/
│   │   │   └── system.ts
│   │   ├── hooks/
│   │   ├── index.css             # Design system
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── docker-compose.yml
├── API_README.md
├── final_readme.md
└── README.md
```

---

## Deployment

### Production Checklist

**Backend**:
1. Set `DEBUG=False` in `.env`
2. Configure `ALLOWED_HOSTS`
3. Use production database (PostgreSQL)
4. Set up static file serving
5. Configure CORS properly
6. Use environment variables for secrets
7. Set up SSL/TLS
8. Configure Gunicorn/uWSGI
9. Set up Nginx reverse proxy
10. Enable database backups

**Frontend**:
1. Build production bundle: `npm run build`
2. Serve `dist/` directory with web server
3. Configure API base URL
4. Set up CDN for assets
5. Enable compression (gzip/brotli)
6. Configure caching headers
7. Set up SSL/TLS

### Nginx Configuration Example

```nginx
# Backend API
server {
    listen 80;
    server_name api.evolf.com;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /media/ {
        alias /path/to/media/;
    }
}

# Frontend
server {
    listen 80;
    server_name evolf.com;
    root /path/to/frontend/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors

**Symptom**: `Access-Control-Allow-Origin` error in browser

**Solution**:
```python
# backend/evo_backend/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080"
]
```

#### 2. ElasticSearch Connection Failed

**Symptom**: Search falls back to PostgreSQL

**Solution**:
```bash
# Check ElasticSearch status
curl http://localhost:9200

# Verify credentials in .env
ELASTIC_HOST=http://localhost:9200
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=your_password
```

#### 3. Media Files Not Found

**Symptom**: 404 for PDB/SDF files

**Solution**:
```python
# Check settings.py
MEDIA_ROOT = '/correct/path/to/media'
MEDIA_URL = '/media/'

# Ensure files exist
ls /path/to/media/pdb_files/
```

#### 4. API Timeout

**Symptom**: Requests timeout after 30 seconds

**Solution**:
```typescript
// Increase timeout in api.ts
export const API_CONFIG = {
  TIMEOUT: 60000  // 60 seconds
};
```

#### 5. Prediction Jobs Stuck

**Symptom**: Jobs remain in "processing" status

**Solution**:
```bash
# Check job directory
ls /path/to/job/data/{job_id}/output/

# Verify pipeline URL
curl http://localhost:5000/health
```

---

## Contributing

### Development Workflow

1. Fork repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes
4. Run tests: `python manage.py test` (backend), `npm test` (frontend)
5. Commit: `git commit -m "Add new feature"`
6. Push: `git push origin feature/new-feature`
7. Create Pull Request

### Code Style

**Backend**:
- Follow PEP 8
- Use type hints
- Document functions with docstrings

**Frontend**:
- Follow TypeScript best practices
- Use functional components with hooks
- Document complex logic with comments

---

## Support & Contact

- **Documentation**: This README and `API_README.md`
- **Issues**: GitHub Issues
- **Email**: [Contact email]

---

**Version**: 1.0  
**Last Updated**: 2025  
**License**: [License type]
