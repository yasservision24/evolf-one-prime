# EvOlf Platform - Complete Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Frontend Features](#frontend-features)
- [Database Schema](#database-schema)
- [Search Functionality](#search-functionality)
- [Deployment](#deployment)

---

## Project Overview

EvOlf is a comprehensive platform for GPCR (G Protein-Coupled Receptors) research, providing:
- **Database Dashboard**: Browse and search curated GPCR interaction data
- **Prediction System**: Submit SMILES-based ligand predictions
- **3D Visualization**: Interactive molecular structure viewers
- **Data Export**: Download datasets in multiple formats

---

## Technology Stack

### Frontend
- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query (React Query)
- **3D Visualization**: Custom molecular viewer components

### Backend
- **Framework**: Django 4.x with Django REST Framework
- **Database**: PostgreSQL
- **Search Engine**: ElasticSearch
- **Task Queue**: Background job processing for predictions
- **File Storage**: Media files for PDB/SDF structures

### Design System
- **Primary Colors**: White, Black, Yellow (EMBO-inspired)
- **Accent Colors**: 
  - Green (#00C9A7) for Database/Curation section
  - Purple (#8B5CF6) for Prediction section
- **Typography**: Responsive with semantic tokens

---

## Architecture

```
evolf-platform/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── lib/            # Utilities and API client
│   │   └── config/         # Configuration files
│   └── public/             # Static assets
│
└── backend/
    ├── core/               # Main application
    │   ├── models.py       # Database models
    │   ├── serializers.py  # DRF serializers
    │   ├── views/          # API endpoints
    │   ├── documents.py    # ElasticSearch documents
    │   └── services/       # Business logic
    └── evo_backend/        # Django settings
```

---

## Setup Instructions

### Backend Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd evolf-platform/backend
```

2. **Create Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure Environment Variables**
Create `.env` file in backend root:
```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/evolf_db
ELASTICSEARCH_HOST=localhost:9200
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
```

5. **Setup Database**
```bash
python manage.py migrate
python manage.py createsuperuser
```

6. **Import Initial Data**
```bash
python manage.py import_evolf_data
python manage.py elastic_search --rebuild
```

7. **Run Development Server**
```bash
python manage.py runserver 0.0.0.0:3000
```

### Frontend Setup

1. **Navigate to Frontend**
```bash
cd frontend
```

2. **Install Dependencies**
```bash
npm install
# or
bun install
```

3. **Configure Environment**
Create `.env` file in frontend root:
```env
VITE_API_BASE_URL=http://127.0.0.1:3000/api
```

4. **Run Development Server**
```bash
npm run dev
# or
bun dev
```

Frontend will be available at `http://localhost:8080`

---

## API Documentation

### Base Configuration

**Base URL**: `http://127.0.0.1:3000/api` (configurable via `VITE_API_BASE_URL`)

**Headers Required**:
```json
{
  "Content-Type": "application/json"
}
```

**Timeout**: 30 seconds for all requests

---

### Dataset Endpoints

#### 1. Get Paginated Dataset

**Endpoint**: `GET /dataset`

**Description**: Retrieve paginated dataset with filtering, sorting, and search capabilities.

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number |
| `limit` | integer | No | 20 | Items per page |
| `search` | string | No | - | Search query (searches across all fields) |
| `sortBy` | string | No | EvOlf_ID | Field to sort by (EvOlf_ID, Receptor, Ligand, Species, Class, Mutation) |
| `sortOrder` | string | No | desc | Sort direction (asc, desc) |
| `species` | string | No | - | Filter by species |
| `class` | string | No | - | Filter by GPCR class |
| `mutationType` | string | No | - | Filter by mutation type |

**Request Example**:
```bash
GET /api/dataset?page=1&limit=20&search=dopamine&sortBy=EvOlf_ID&sortOrder=desc&species=Human&class=Class%20A
```

**Response Format**:
```json
{
  "data": [
    {
      "id": "1",
      "evolfId": "EvOlf0100001",
      "receptor": "5-HT1A receptor",
      "species": "Human",
      "class_field": "Class A",
      "ligand": "Serotonin",
      "mutation": "Wild-type",
      "chemblId": "CHEMBL228",
      "uniprotId": "P08908",
      "cid": "5202"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "itemsPerPage": 20,
    "totalItems": 150,
    "totalPages": 8
  },
  "statistics": {
    "totalRows": 150,
    "uniqueClasses": ["Class A", "Class B", "Class C"],
    "uniqueSpecies": ["Human", "Mouse", "Rat"],
    "uniqueMutationTypes": ["Wild-type", "Point Mutation", "Deletion"]
  },
  "filterOptions": {
    "uniqueClasses": ["Class A", "Class B", "Class C"],
    "uniqueSpecies": ["Human", "Mouse", "Rat"],
    "uniqueMutationTypes": ["Wild-type", "Point Mutation", "Deletion"]
  },
  "all_evolf_ids": ["EvOlf0100001", "EvOlf0100002", "..."]
}
```

**Field Mapping** (Frontend ↔ Backend):
- `evolfId` ↔ `EvOlf_ID`
- `receptor` ↔ `Receptor`
- `ligand` ↔ `Ligand`
- `species` ↔ `Species`
- `class` ↔ `Class`
- `mutation` ↔ `Mutation`

---

#### 2. Get Dataset Details

**Endpoint**: `GET /dataset/details/{evolfId}`

**Description**: Retrieve detailed information for a specific EvOlf entry.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `evolfId` | string | Yes | EvOlf identifier (e.g., EvOlf0100001) |

**Request Example**:
```bash
GET /api/dataset/details/EvOlf0100001
```

**Response Format**:
```json
{
  "evolfId": "EvOlf0100001",
  "receptor": "5-HT1A receptor",
  "ligand": "Serotonin",
  "species": "Human",
  "mutation": "Wild-type",
  "mutationType": "Wild-type",
  "mutationImpact": "",
  "mutationStatus": "Wild-type",
  "class_field": "Class A",
  "receptorSubtype": "5-HT1A",
  "uniprotId": "P08908",
  "uniprotLink": "https://www.uniprot.org/uniprotkb/P08908",
  "chemblId": "CHEMBL228",
  "cid": "5202",
  "pubchemId": "5202",
  "pubchemLink": "https://pubchem.ncbi.nlm.nih.gov/compound/5202",
  "expressionSystem": "HEK293",
  "parameter": "Ki",
  "value": "1.2",
  "unit": "nM",
  "structure2d": "",
  "image": "",
  "structure3d": "http://127.0.0.1:3000/media/pdb_files/EvOlf0100001.pdb",
  "sdfData": "",
  "comments": "High affinity binding",
  "geneSymbol": "HTR1A",
  "sequence": "MDVLSPGQGNNTTSPPAPFETGGNTTGISDVTFSYQVITSLLLGTLIFCAVLGNACVVAAIALERSLQNVANYLIGSLAVTDLMVSVLVLPMAALYQVLNKWTLGQVTCDLFIALDVLCCTSSILHLCAIALDRYWAITDPIDYVNKRTPRRAAALISLTWLIGFLISIPPMLGWRTP...",
  "smiles": "NCCc1c[nH]c2ccc(O)cc12",
  "inchi": "InChI=1S/C10H12N2O/c11-4-3-7-6-12-10-2-1-8(13)5-9(7)10/h1-2,5-6,12-13H,3-4,11H2",
  "inchiKey": "INDKZZNDGWSSKC-UHFFFAOYSA-N",
  "iupacName": "2-(1H-indol-3-yl)ethanamine",
  "pdbData": "ATOM    1  N   MET A   1      -0.123   0.456   0.789...",
  "source": "8450829|11343685|8549774",
  "sourceLinks": "https://pubmed.ncbi.nlm.nih.gov/8450829/ | https://pubmed.ncbi.nlm.nih.gov/11343685/ | https://pubmed.ncbi.nlm.nih.gov/8549774/"
}
```

**Response Fields**:
- All fields return `"N/A"` or empty string when data is unavailable
- `sourceLinks` contains pipe-delimited URLs (can be multiple)
- `structure3d` points to PDB file URL for 3D visualization
- `sequence` contains protein sequence in single-letter format
- `smiles` contains ligand structure in SMILES notation

---

#### 3. Export Dataset (Multiple Entries)

**Endpoint**: `POST /dataset/export`

**Description**: Export multiple dataset entries as a ZIP file.

**Request Body**:
```json
{
  "evolfIds": ["EvOlf0100001", "EvOlf0100002", "EvOlf0100003"]
}
```

**Response**: Binary ZIP file containing:
- CSV file with dataset entries
- PDB files (if available)
- SDF files (if available)
- Metadata JSON

**Response Headers**:
```
Content-Type: application/zip
Content-Disposition: attachment; filename=evolf_dataset_export.zip
```

**Request Example**:
```javascript
const response = await fetch('/api/dataset/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    evolfIds: ['EvOlf0100001', 'EvOlf0100002'] 
  })
});
const blob = await response.blob();
// Create download link
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'dataset.zip';
a.click();
```

---

#### 4. Export Single Entry

**Endpoint**: `GET /dataset/export/{evolfId}`

**Description**: Export a single dataset entry as a ZIP file.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `evolfId` | string | Yes | EvOlf identifier |

**Request Example**:
```bash
GET /api/dataset/export/EvOlf0100001
```

**Response**: Binary ZIP file (same structure as multiple export)

---

#### 5. Download Complete Dataset

**Endpoint**: `GET /dataset/download`

**Description**: Download the entire EvOlf database as a ZIP file.

**Request Example**:
```bash
GET /api/dataset/download
```

**Response**: Binary ZIP file containing complete database

**Note**: This may be a large file (100MB+) depending on database size.

---

### Search Endpoints

#### ElasticSearch Query

**Endpoint**: `GET /search/`

**Description**: Perform full-text search across all dataset fields using ElasticSearch.

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query |

**Request Example**:
```bash
GET /api/search/?q=dopamine
```

**Response Format**:
```json
{
  "results": [
    {
      "EvOlf_ID": "EvOlf0100045",
      "Receptor": "Dopamine D2 receptor",
      "Ligand": "Dopamine",
      "Species": "Human",
      "Class": "Class A",
      "Mutation": "Wild-type",
      "score": 0.95
    }
  ]
}
```

**Search Capabilities**:
- **Full-text search**: Searches across all text fields
- **Fuzzy matching**: Handles typos and variations
- **Relevance scoring**: Results ordered by relevance
- **Field boosting**: Receptor and Ligand names weighted higher
- **Autocomplete**: Supports partial matches

**Search Algorithm**:
1. Query parsed and tokenized
2. ElasticSearch indexes queried across fields:
   - EvOlf_ID (exact match boost)
   - Receptor (high weight)
   - Ligand (high weight)
   - Species, Class, Mutation (medium weight)
   - ChEMBL_ID, UniProt_ID (exact match)
3. Results ranked by relevance score
4. Fuzzy matching applied for typos (max edit distance: 2)

---

### Prediction Endpoints

#### 1. Submit SMILES Prediction

**Endpoint**: `POST /predict/smiles/`

**Description**: Submit a ligand SMILES string for binding affinity prediction.

**Request Body**:
```json
{
  "smiles": "NCCc1c[nH]c2ccc(O)cc12",
  "mutated_sequence": "MDVLSPGQGNNTTSPPAPFET...",
  "temp_ligand_id": "ligand_001",
  "temp_rec_id": "receptor_001",
  "id": "custom_job_id"
}
```

**Request Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `smiles` | string | Yes | SMILES notation of ligand |
| `mutated_sequence` | string | No | Receptor protein sequence (if mutant) |
| `temp_ligand_id` | string | No | Temporary ligand identifier |
| `temp_rec_id` | string | No | Temporary receptor identifier |
| `id` | string | No | Custom job ID |

**Response Format**:
```json
{
  "job_id": "pred_20240315_123456_abc123",
  "status": "submitted",
  "message": "Prediction job submitted successfully",
  "estimated_time": "2-5 minutes"
}
```

**Request Example**:
```javascript
const response = await fetch('/api/predict/smiles/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    smiles: 'NCCc1c[nH]c2ccc(O)cc12',
    mutated_sequence: 'MDVLSPGQGNNTTSPPAPFET...'
  })
});
const data = await response.json();
console.log('Job ID:', data.job_id);
```

---

#### 2. Check Job Status

**Endpoint**: `GET /predict/job/{jobId}/`

**Description**: Check the status of a prediction job and retrieve results when complete.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `jobId` | string | Yes | Job identifier returned from submit endpoint |

**Request Example**:
```bash
GET /api/predict/job/pred_20240315_123456_abc123/
```

**Response Format (Running)**:
```json
{
  "job_id": "pred_20240315_123456_abc123",
  "status": "running",
  "progress": 45,
  "message": "Processing prediction...",
  "created_at": "2024-03-15T12:34:56Z"
}
```

**Response Format (Completed)**:
```json
{
  "job_id": "pred_20240315_123456_abc123",
  "status": "completed",
  "created_at": "2024-03-15T12:34:56Z",
  "completed_at": "2024-03-15T12:37:23Z",
  "results": {
    "predicted_affinity": 7.8,
    "confidence_score": 0.92,
    "affinity_class": "High",
    "binding_mode": "Competitive",
    "ligand": {
      "smiles": "NCCc1c[nH]c2ccc(O)cc12",
      "name": "Serotonin"
    }
  },
  "download_url": "/api/predict/download/pred_20240315_123456_abc123/"
}
```

**Status Values**:
- `submitted`: Job queued for processing
- `running`: Prediction in progress
- `completed`: Prediction finished successfully (frontend shows as "completed")
- `finished`: Backend status (mapped to "completed" in frontend)
- `failed`: Error occurred during prediction
- `expired`: Job results expired (removed after retention period)

**Response Format (Failed)**:
```json
{
  "job_id": "pred_20240315_123456_abc123",
  "status": "failed",
  "error": "Invalid SMILES format",
  "message": "The provided SMILES string could not be parsed"
}
```

**Response Format (Expired/404)**:
```json
{
  "error": "Job not found",
  "message": "Job has expired or does not exist"
}
```

---

#### 3. Download Prediction Results

**Endpoint**: `GET /predict/job/{jobId}/?download=output`

**Description**: Download complete prediction results as a ZIP file.

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `jobId` | string | Yes | Job identifier |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `download` | string | Yes | Must be "output" |

**Request Example**:
```bash
GET /api/predict/job/pred_20240315_123456_abc123/?download=output
```

**Response**: Binary ZIP file containing:
- `results.json`: Detailed prediction results
- `ligand.sdf`: 3D ligand structure
- `receptor.pdb`: Receptor structure (if provided)
- `complex.pdb`: Predicted ligand-receptor complex
- `binding_site.pdb`: Predicted binding site residues
- `visualization.png`: 2D interaction diagram
- `log.txt`: Prediction log

**Response Headers**:
```
Content-Type: application/zip
Content-Disposition: attachment; filename=prediction_results_{jobId}.zip
```

---

## Frontend Features

### Pages

#### 1. Home Page (`/`)
- Hero section with gradient logo
- Feature cards for Database and Prediction
- Quick links to main sections
- Responsive layout

#### 2. Database Dashboard (`/dataset/dashboard`)
**Features**:
- Paginated data table (20 items per page)
- Multi-field sorting (EvOlf ID, Receptor, Ligand, Species, Class, Mutation)
- Real-time search across all fields
- Advanced filters:
  - Species dropdown
  - Class dropdown
  - Mutation type dropdown
- Bulk export functionality
- Download complete dataset
- Click rows to view details
- Sticky search bar with high z-index

**State Management**:
- TanStack Query for data fetching
- URL-based state for pagination and filters
- Debounced search input (300ms)

#### 3. Dataset Detail Pages

**Receptor Details** (`/dataset/receptor/:evolfId`):
- Receptor information card
- Protein sequence display
- 3D structure viewer (PDB)
- UniProt integration
- Source links (pipe-delimited, scrollable)
- Mutation status indicator (star for mutants)

**Ligand Details** (`/dataset/ligand/:evolfId`):
- Ligand information card
- Chemical structure display
- 3D structure viewer (SDF)
- PubChem integration
- SMILES, InChI, InChI Key display
- IUPAC name

**Interaction Details** (`/dataset/interaction/:evolfId`):
- Experimental details card
- Parameter, value, unit display
- Expression system information
- Source and source links display
- Comments section
- Scrollable source links with PubMed IDs

#### 4. Prediction Dashboard (`/prediction/dashboard`)
**Features**:
- SMILES string input (single ligand only)
- Optional receptor sequence input
- Form validation
- Real-time submission feedback
- Job ID display and copy
- Redirect to results page

**Removed Features** (as per constraints):
- CSV upload option (completely removed)
- Multiple ligand submission

#### 5. Prediction Results (`/prediction/result/:jobId`)
**Features**:
- Real-time job status polling
- Progress indicator
- Results display:
  - Predicted affinity
  - Confidence score
  - Affinity classification
- Download results button
- 3D visualization of predicted complex
- Error handling and retry options

### Components

#### UI Components (shadcn/ui)
- Button, Card, Table, Select, Input
- Dialog, Sheet, Tabs, Accordion
- Toast notifications (Sonner)
- Loading skeletons
- Progress indicators

#### Custom Components
- `Molecular3DViewer`: Interactive 3D molecule viewer
- `Header`: Navigation with responsive menu
- `Footer`: Links and copyright
- Loading states for all data views

### Design System

**Color Tokens** (defined in `index.css`):
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 47.9 95.8% 53.1%; /* Yellow */
  --secondary: 210 40% 96.1%;
  --accent: 47.9 95.8% 53.1%;
  --database-primary: 168 76% 42%; /* Green for database */
  --prediction-primary: 258 90% 66%; /* Purple for prediction */
}
```

**Responsive Breakpoints**:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## Database Schema

### EvOlf Model

**Table**: `core_evolf`

**Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `id` | AutoField | Primary key |
| `EvOlf_ID` | CharField(50) | Unique EvOlf identifier |
| `Receptor` | CharField(200) | Receptor name |
| `Species` | CharField(100) | Organism species |
| `Class` | CharField(50) | GPCR class |
| `Ligand` | CharField(200) | Ligand name |
| `Mutation` | CharField(200) | Mutation description |
| `ChEMBL_ID` | CharField(50) | ChEMBL identifier |
| `UniProt_ID` | CharField(50) | UniProt identifier |
| `CID` | CharField(50) | PubChem CID |
| `Gene_Symbol` | CharField(50) | Gene symbol |
| `Expression_System` | CharField(100) | Expression system |
| `Parameter` | CharField(50) | Assay parameter |
| `Value` | CharField(50) | Measured value |
| `Unit` | CharField(50) | Unit of measurement |
| `Sequence` | TextField | Protein sequence |
| `SMILES` | TextField | Ligand SMILES |
| `InChI` | TextField | InChI string |
| `InChI_Key` | CharField(100) | InChI Key |
| `IUPAC_Name` | TextField | IUPAC name |
| `PDB_Data` | TextField | PDB file content |
| `SDF_Data` | TextField | SDF file content |
| `Structure_2D` | CharField(500) | 2D structure image URL |
| `Structure_3D` | CharField(500) | 3D structure file URL |
| `Comments` | TextField | Additional comments |
| `Source` | CharField(500) | Data source |
| `Source_Links` | TextField | Pipe-delimited URLs |

**Indexes**:
- `EvOlf_ID` (unique)
- `Receptor`
- `Ligand`
- `Species`
- `Class`

---

## Search Functionality

### ElasticSearch Configuration

**Index**: `evolf_dataset`

**Document Mapping**:
```python
class EvOlfDocument(Document):
    evolf_id = Text(fields={'keyword': Keyword()})
    receptor = Text(analyzer='standard')
    ligand = Text(analyzer='standard')
    species = Text(fields={'keyword': Keyword()})
    class_field = Text(fields={'keyword': Keyword()})
    mutation = Text()
    chembl_id = Text(fields={'keyword': Keyword()})
    uniprot_id = Text(fields={'keyword': Keyword()})
    cid = Text(fields={'keyword': Keyword()})
    
    class Index:
        name = 'evolf_dataset'
```

### Search Query Building

**Multi-Match Query**:
```python
{
    "multi_match": {
        "query": "user_search_term",
        "fields": [
            "evolf_id^3",      # Boost by 3x
            "receptor^2",      # Boost by 2x
            "ligand^2",        # Boost by 2x
            "species",
            "class_field",
            "mutation",
            "chembl_id^1.5",
            "uniprot_id^1.5"
        ],
        "fuzziness": "AUTO",
        "type": "best_fields"
    }
}
```

**Features**:
- Fuzzy matching for typo tolerance
- Field boosting for relevance
- Autocomplete suggestions
- Result ranking by score

### Search Workflow

1. User enters query in search bar
2. Frontend debounces input (300ms delay)
3. Request sent to `/api/search/?q={query}`
4. Backend queries ElasticSearch
5. Results ranked by relevance score
6. Top results returned to frontend
7. User can click result to view details

---

## Deployment

### Production Environment Variables

**Backend** (`.env.production`):
```env
DEBUG=False
SECRET_KEY=<strong-random-key>
DATABASE_URL=postgresql://user:password@db-host:5432/evolf_production
ELASTICSEARCH_HOST=elasticsearch-host:9200
ALLOWED_HOSTS=api.evolf.com,www.evolf.com
CORS_ALLOWED_ORIGINS=https://evolf.com,https://www.evolf.com
MEDIA_ROOT=/var/www/evolf/media/
STATIC_ROOT=/var/www/evolf/static/
```

**Frontend** (`.env.production`):
```env
VITE_API_BASE_URL=https://api.evolf.com/api
```

### Build Commands

**Frontend**:
```bash
npm run build
# or
bun build
```

Output: `dist/` directory (static files)

**Backend**:
```bash
python manage.py collectstatic --noinput
python manage.py migrate
gunicorn evo_backend.wsgi:application --bind 0.0.0.0:8000
```

### Server Configuration

**Nginx Example**:
```nginx
server {
    listen 80;
    server_name evolf.com www.evolf.com;
    
    # Frontend (SPA)
    location / {
        root /var/www/evolf/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Media files
    location /media/ {
        alias /var/www/evolf/media/;
    }
}
```

---

## API Client Usage Examples

### JavaScript/TypeScript

```typescript
import { 
  fetchDatasetPaginated, 
  fetchDatasetDetail,
  submitPrediction,
  getPredictionJobStatus,
  searchDataset 
} from './lib/api';

// Fetch paginated dataset
const data = await fetchDatasetPaginated(1, 20, 'dopamine');

// Get specific entry details
const detail = await fetchDatasetDetail('EvOlf0100001');

// Submit prediction
const job = await submitPrediction({
  smiles: 'NCCc1c[nH]c2ccc(O)cc12',
  mutated_sequence: 'MDVLSPGQG...'
});

// Check job status
const status = await getPredictionJobStatus(job.job_id);

// Search
const results = await searchDataset('dopamine receptor');
```

### Python

```python
import requests

BASE_URL = "http://127.0.0.1:3000/api"

# Fetch dataset
response = requests.get(f"{BASE_URL}/dataset", params={
    "page": 1,
    "limit": 20,
    "search": "dopamine"
})
data = response.json()

# Submit prediction
response = requests.post(f"{BASE_URL}/predict/smiles/", json={
    "smiles": "NCCc1c[nH]c2ccc(O)cc12"
})
job = response.json()

# Check status
response = requests.get(f"{BASE_URL}/predict/job/{job['job_id']}/")
status = response.json()
```

### cURL

```bash
# Fetch dataset
curl "http://127.0.0.1:3000/api/dataset?page=1&limit=20&search=dopamine"

# Submit prediction
curl -X POST http://127.0.0.1:3000/api/predict/smiles/ \
  -H "Content-Type: application/json" \
  -d '{"smiles":"NCCc1c[nH]c2ccc(O)cc12"}'

# Check job status
curl http://127.0.0.1:3000/api/predict/job/pred_20240315_123456_abc123/

# Download results
curl "http://127.0.0.1:3000/api/predict/job/pred_20240315_123456_abc123/?download=output" \
  -o results.zip
```

### R

```r
library(httr)
library(jsonlite)

BASE_URL <- "http://127.0.0.1:3000/api"

# Fetch dataset
response <- GET(
  paste0(BASE_URL, "/dataset"),
  query = list(page = 1, limit = 20, search = "dopamine")
)
data <- content(response, "parsed")

# Submit prediction
response <- POST(
  paste0(BASE_URL, "/predict/smiles/"),
  body = list(smiles = "NCCc1c[nH]c2ccc(O)cc12"),
  encode = "json"
)
job <- content(response, "parsed")

# Check status
response <- GET(paste0(BASE_URL, "/predict/job/", job$job_id, "/"))
status <- content(response, "parsed")
```

---

## Error Handling

### Common Error Responses

**400 Bad Request**:
```json
{
  "error": "Invalid request",
  "message": "SMILES string is required",
  "code": "VALIDATION_ERROR"
}
```

**404 Not Found**:
```json
{
  "error": "Not found",
  "message": "EvOlf ID not found in database",
  "code": "NOT_FOUND"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Server error",
  "message": "An unexpected error occurred",
  "code": "INTERNAL_ERROR"
}
```

### Frontend Error Handling

```typescript
try {
  const data = await fetchDatasetDetail('EvOlf0100001');
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      toast.error('Entry not found');
    } else {
      toast.error(`Error: ${error.message}`);
    }
  }
}
```

---

## Rate Limiting

**Current Limits**:
- Dataset endpoints: 100 requests/minute
- Search endpoint: 50 requests/minute
- Prediction submission: 10 requests/minute
- Job status checks: 200 requests/minute

**Headers** (included in responses):
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1647345600
```

---

## Support and Contact

For issues, questions, or feature requests:
- **GitHub**: [repository-url]/issues
- **Email**: support@evolf.com
- **Documentation**: https://docs.evolf.com

---

## License

[Specify license information here]

---

## Changelog

### Version 1.0.0 (2024-03-15)
- Initial release
- Dataset browsing and search
- SMILES-based prediction system
- 3D molecular visualization
- Export functionality

---

*Last Updated: 2024-03-15*
