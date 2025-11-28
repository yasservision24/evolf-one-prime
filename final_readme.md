# EvOlf Platform - Complete Documentation

Comprehensive documentation for the EvOlf GPCR research platform, covering full-stack architecture, setup, features, and deployment.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
   - [Frontend Stack](#frontend-stack)
   - [Backend Stack](#backend-stack)
3. [System Architecture](#system-architecture)
   - [Full-Stack Data Flow](#full-stack-data-flow)
   - [Backend Architecture](#backend-architecture)
   - [Frontend Architecture](#frontend-architecture)
4. [Setup Instructions](#setup-instructions)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
   - [Docker Setup](#docker-setup-optional)
5. [Features](#features)
   - [Dataset Browser](#dataset-browser)
   - [Detail Pages](#detail-pages)
   - [Search Functionality](#search-functionality)
   - [Prediction System](#prediction-system)
6. [Performance Optimizations](#performance-optimizations)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

**EvOlf** is a full-stack web platform for GPCR (G Protein-Coupled Receptors) research, providing:

### Core Features

- **Curated Database**: Browse 250+ GPCR-ligand interactions with comprehensive annotations
- **Advanced Search**: ElasticSearch-powered full-text search with PostgreSQL fallback
- **Detail Views**: Multi-tab interface for receptors, ligands, interactions, and 3D structures
- **Prediction System**: Submit SMILES-based binding affinity predictions
- **3D Visualization**: Interactive molecular structure viewers (PDB/SDF formats)
- **Data Export**: Bulk downloads in CSV/ZIP formats
- **RESTful API**: Complete programmatic access for researchers

### Key Capabilities

- **Server-Side Operations**: Pagination, filtering, and sorting on the backend
- **Real-Time Search**: Debounced search with instant results
- **Async Job Processing**: Background prediction pipeline
- **Responsive Design**: Mobile-optimized with hamburger navigation
- **Dark Mode**: Full dark mode support
- **Context-Based State**: Shared data across tabs to prevent duplicate API calls

---

## Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Vite** | Latest | Build tool & dev server (port 8080) |
| **React Router** | 6.30.1 | Client-side routing |
| **TanStack Query** | 5.83.0 | Server state management |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **Radix UI** | Latest | Accessible UI primitives |
| **shadcn/ui** | Latest | Pre-built component library |

**Additional Libraries**:
- `lucide-react`: Icon system
- `recharts`: Data visualization
- `sonner`: Toast notifications
- `vaul`: Drawer/sheet components
- `react-hook-form`: Form management
- `zod`: Schema validation

**State Management**:
- **Context API**: Shared dataset details across tabs
- **TanStack Query**: API response caching
- **Local State**: Component-specific UI state

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Django** | 4.x | Web framework |
| **Django REST Framework** | 3.x | API framework |
| **PostgreSQL** | 14+ | Primary database |
| **ElasticSearch** | 8.x | Full-text search engine |
| **Pandas** | Latest | Data processing |
| **Gunicorn** | Latest | WSGI server (production) |

**Backend Dependencies**:
- `psycopg2-binary`: PostgreSQL adapter
- `django-cors-headers`: CORS middleware
- `python-decouple`: Environment variables
- `elasticsearch-dsl`: ElasticSearch integration

### Design System

**Color Palette** (EMBO-inspired):
- **Primary**: White (#FFFFFF), Black (#000000), Yellow (#FFD700)
- **Accent Colors**:
  - **Teal** (#00C9A7): Database/Curation section
  - **Purple** (#8B5CF6): Prediction section
- **Gradients**: Teal-to-purple for branding ("EvOlf" logo)
- **Semantic Tokens**: All colors use HSL format in `index.css`

**Typography**:
- System font stack with fallbacks
- Responsive scaling (text-xs to text-2xl)
- Consistent heading hierarchy

---

## System Architecture

### Full-Stack Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                            Frontend (React)                         │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    User Interface Layer                       │  │
│  │  • Home Page          • Dataset Browser                      │  │
│  │  • Detail Pages       • Prediction Dashboard                 │  │
│  └───────────────────────┬──────────────────────────────────────┘  │
│                          │                                          │
│  ┌───────────────────────▼──────────────────────────────────────┐  │
│  │              Routing (React Router)                          │  │
│  │  • Nested routes for dataset details                        │  │
│  │  • DatasetDetailLayout wraps detail tabs                    │  │
│  └───────────────────────┬──────────────────────────────────────┘  │
│                          │                                          │
│  ┌───────────────────────▼──────────────────────────────────────┐  │
│  │         State Management Layer                               │  │
│  │                                                               │  │
│  │  ┌──────────────────┐  ┌────────────────┐                   │  │
│  │  │ Context API      │  │ TanStack Query │                   │  │
│  │  │ (Shared State)   │  │ (API Caching)  │                   │  │
│  │  └──────────────────┘  └────────────────┘                   │  │
│  │         ↓                      ↓                              │  │
│  │  DatasetDetailContext   queryClient                          │  │
│  │  - Fetches once per ID   - Caches responses                  │  │
│  │  - Shares across tabs     - Auto-refetch                     │  │
│  └───────────────────────┬──────────────────────────────────────┘  │
│                          │                                          │
│  ┌───────────────────────▼──────────────────────────────────────┐  │
│  │              API Client (lib/api.ts)                         │  │
│  │  • fetchDatasetPaginated()  • fetchDatasetDetail()          │  │
│  │  • searchDataset()          • submitPrediction()            │  │
│  │  • downloadDataset()        • checkJobStatus()              │  │
│  └───────────────────────┬──────────────────────────────────────┘  │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
                   HTTP/REST (JSON)
                             │
┌────────────────────────────▼─────────────────────────────────────────┐
│                      Backend (Django + DRF)                          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    URL Router (urls.py)                       │  │
│  │  • /api/dataset                • /api/search/                │  │
│  │  • /api/dataset/details/:id   • /api/predict/smiles/        │  │
│  │  • /api/dataset/export        • /api/job-status/:id         │  │
│  └───────────────────────┬──────────────────────────────────────┘  │
│                          │                                          │
│  ┌───────────────────────▼──────────────────────────────────────┐  │
│  │                  API Views (DRF ViewSets)                    │  │
│  │                                                               │  │
│  │  • DatasetListAPIView        (GET /dataset)                 │  │
│  │  • FetchDatasetDetails       (GET /dataset/details/:id)     │  │
│  │  • DatasetExportView         (POST /dataset/export)         │  │
│  │  • ElasticSearchView         (GET /search/)                 │  │
│  │  • SmilesPredictionAPIView   (POST /predict/smiles/)        │  │
│  │  • JobStatusAPIView          (GET /job-status/:id)          │  │
│  └──────────┬─────────────────────────────┬─────────────────────┘  │
│             │                             │                         │
│  ┌──────────▼──────────┐     ┌───────────▼──────────────┐         │
│  │  Serializers        │     │  Services/Utils          │         │
│  │  (Data Transform)   │     │  • job_scheduler.py      │         │
│  └──────────┬──────────┘     │  • Data processors       │         │
│             │                 └──────────────────────────┘         │
│             │                                                       │
│  ┌──────────▼──────────────────────────────────────────────────┐  │
│  │                    ORM (Django Models)                       │  │
│  │                    core/models.py                            │  │
│  │  • EvOlf model with all fields                               │  │
│  └──────────┬─────────────────────────┬────────────────────────┘  │
└─────────────┼─────────────────────────┼────────────────────────────┘
              │                         │
       ┌──────▼─────────┐     ┌────────▼─────────────┐
       │  PostgreSQL    │     │  ElasticSearch       │
       │  Database      │     │  Search Index        │
       │                │     │                      │
       │  • core_evolf  │     │  • Full-text search  │
       │  • Indexes     │     │  • Fuzzy matching    │
       │  • Constraints │     │  • Autocomplete      │
       └────────┬───────┘     └──────────────────────┘
                │
       ┌────────▼───────────────────────┐
       │     File Storage               │
       │     (MEDIA_ROOT)               │
       │                                │
       │  • pdb_files/                  │
       │  • sdf_files/                  │
       │  • smiles_2d/                  │
       │  • job_data/                   │
       └────────────────────────────────┘
```

### Backend Architecture

**Directory Structure**:
```
backend/
├── core/
│   ├── __init__.py
│   ├── models.py                  # Database models
│   ├── serializers.py             # DRF serializers
│   ├── admin.py                   # Django admin config
│   ├── urls.py                    # URL routing
│   ├── views/
│   │   ├── __init__.py
│   │   ├── admin_views.py         # Admin endpoints
│   │   ├── dataset_views.py       # Dataset CRUD
│   │   ├── elastic_search_views.py  # Search
│   │   ├── prediction_views.py    # ML predictions
│   │   ├── job_status_views.py    # Job polling
│   │   └── structure_views.py     # 3D structures
│   ├── services/
│   │   └── job_scheduler.py       # Async jobs
│   ├── management/
│   │   └── commands/
│   │       ├── import_evolf_data.py
│   │       ├── fetch_evolf_data.py
│   │       └── elastic_search.py
│   └── migrations/
│       └── 0001_initial.py
├── evo_backend/
│   ├── __init__.py
│   ├── settings.py                # Django settings
│   ├── urls.py                    # Root URL config
│   └── wsgi.py                    # WSGI entry point
├── manage.py
└── requirements.txt
```

**Key Components**:

1. **Models (`core/models.py`)**:
```python
class EvOlf(models.Model):
    EvOlf_ID = models.CharField(max_length=100, unique=True, db_index=True)
    Receptor = models.CharField(max_length=500)
    Receptor_Name = models.CharField(max_length=500)
    Species = models.CharField(max_length=200, db_index=True)
    Class = models.CharField(max_length=100, db_index=True)
    Ligand = models.CharField(max_length=500)
    Ligand_Name = models.CharField(max_length=500)
    Mutation = models.TextField(blank=True, null=True)
    Mutation_Status = models.CharField(max_length=100, db_index=True)
    ChEMBL_ID = models.CharField(max_length=100)
    UniProt_ID = models.CharField(max_length=100)
    CID = models.CharField(max_length=100)
    Sequence = models.TextField(blank=True, null=True)
    SMILES = models.TextField(blank=True, null=True)
    InChI = models.TextField(blank=True, null=True)
    InChIKey = models.CharField(max_length=500, blank=True, null=True)
    IUPAC_Name = models.TextField(blank=True, null=True)
    PDB_Data = models.TextField(blank=True, null=True)
    SDF_Data = models.TextField(blank=True, null=True)
    Comments = models.TextField(blank=True, null=True)
    Source = models.CharField(max_length=500, blank=True, null=True)
    Source_Links = models.TextField(blank=True, null=True)
    # ... additional fields
```

2. **Serializers (`core/serializers.py`)**:
- Transform database models to/from JSON
- Handle nested relationships
- Custom field mappings

3. **Views (`core/views/`)**:
- RESTful endpoints using Django REST Framework
- Pagination, filtering, sorting logic
- ElasticSearch integration with PostgreSQL fallback

4. **Services (`core/services/job_scheduler.py`)**:
- Background job management
- Prediction pipeline coordination
- Status tracking

### Frontend Architecture

**Directory Structure**:
```
src/
├── components/
│   ├── Header.tsx                 # Main navigation
│   ├── Footer.tsx                 # Footer links
│   ├── Molecular3DViewer.tsx      # 3D molecular viewer
│   └── ui/                        # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── table.tsx
│       ├── dialog.tsx
│       └── ... (30+ components)
├── contexts/
│   └── DatasetDetailContext.tsx   # Shared state for detail pages
├── hooks/
│   ├── use-toast.ts               # Toast notifications
│   └── use-mobile.tsx             # Mobile detection
├── lib/
│   ├── api.ts                     # API client functions
│   └── utils.ts                   # Utility functions
├── pages/
│   ├── Index.tsx                  # Home page
│   ├── dataset/
│   │   ├── DatabaseDashboard.tsx       # Main browser
│   │   ├── DatasetDetailLayout.tsx     # Context wrapper
│   │   ├── DatasetOverview.tsx         # Overview tab
│   │   ├── DatasetReceptor.tsx         # Receptor tab
│   │   ├── DatasetLigand.tsx           # Ligand tab
│   │   ├── DatasetInteraction.tsx      # Interaction tab
│   │   └── DatasetStructures.tsx       # 3D structures tab
│   ├── prediction/
│   │   ├── PredictionDashboard.tsx     # Submit predictions
│   │   └── PredictionResult.tsx        # View results
│   ├── Documentation.tsx
│   ├── ModelInfo.tsx
│   ├── Links.tsx
│   ├── FAQ.tsx
│   ├── Contact.tsx
│   └── CiteUs.tsx
├── config/
│   └── system.ts                  # System configuration
├── App.tsx                        # Root component & routing
├── main.tsx                       # Entry point
└── index.css                      # Global styles & design tokens
```

**Key Patterns**:

1. **Context API for Shared State**:
```typescript
// DatasetDetailContext.tsx
export function DatasetDetailProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DatasetDetail | null>(null);
  const lastFetchedIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Fetch data only once per evolfId
    if (lastFetchedIdRef.current === evolfId && data) return;
    
    const loadData = async () => {
      lastFetchedIdRef.current = evolfId;
      const response = await fetchDatasetDetail(evolfId!);
      setData(response);
    };
    loadData();
  }, [evolfId]);

  return (
    <DatasetDetailContext.Provider value={{ data, loading, evolfId }}>
      {children}
    </DatasetDetailContext.Provider>
  );
}
```

2. **Nested Routing**:
```typescript
// App.tsx
<Route element={<DatasetDetailLayout />}>
  <Route path="/dataset/detail" element={<DatasetOverview />} />
  <Route path="/dataset/receptor" element={<DatasetReceptor />} />
  <Route path="/dataset/ligand" element={<DatasetLigand />} />
  <Route path="/dataset/interaction" element={<DatasetInteraction />} />
  <Route path="/dataset/structures" element={<DatasetStructures />} />
</Route>
```

3. **API Client**:
```typescript
// lib/api.ts
export const fetchDatasetDetail = async (evolfId: string): Promise<DatasetDetail> => {
  const response = await fetch(
    `${API_BASE_URL}/dataset/details/${evolfId}`,
    { headers: { 'Content-Type': 'application/json' } }
  );
  if (!response.ok) throw new Error('Failed to fetch dataset details');
  return response.json();
};
```

---

## Setup Instructions

### Backend Setup

#### Prerequisites
- Python 3.9+
- PostgreSQL 14+
- ElasticSearch 8.x (optional)

#### Installation Steps

1. **Clone Repository**:
```bash
git clone <repository-url>
cd evolf-platform/backend
```

2. **Create Virtual Environment**:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows
```

3. **Install Dependencies**:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**requirements.txt**:
```txt
Django>=4.2,<5.0
djangorestframework>=3.14
psycopg2-binary>=2.9
django-cors-headers>=4.0
elasticsearch>=8.0
elasticsearch-dsl>=8.0
pandas>=2.0
python-decouple>=3.8
gunicorn>=20.1
```

4. **Configure Environment**:

Create `backend/.env`:
```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1,192.168.24.13

# Database
DATABASE_URL=postgresql://evolf_user:password@localhost:5432/evolf_db

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080

# ElasticSearch (optional)
ELASTIC_HOST=http://localhost:9200
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=your-password

# File Storage
MEDIA_ROOT=/path/to/media
MEDIA_URL=/media/

# Prediction
PREDICT_DOCKER_URL=http://localhost:5000
JOB_DATA_DIR=/path/to/jobs
ENABLE_SCHEDULER=False
```

5. **Setup PostgreSQL**:
```bash
# Create database
createdb evolf_db

# Or via psql
psql -U postgres
CREATE DATABASE evolf_db;
CREATE USER evolf_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE evolf_db TO evolf_user;

# Enable trigram extension for fuzzy search
\c evolf_db
CREATE EXTENSION pg_trgm;
\q
```

6. **Run Migrations**:
```bash
python manage.py migrate
```

7. **Create Superuser**:
```bash
python manage.py createsuperuser
```

8. **Import Data**:
```bash
# Import dataset
python manage.py import_evolf_data

# Build search index (if using ElasticSearch)
python manage.py elastic_search --rebuild
```

9. **Start Server**:
```bash
# Development
python manage.py runserver 0.0.0.0:8001

# Production
gunicorn evo_backend.wsgi:application --bind 0.0.0.0:8001
```

**Backend running at**: `http://localhost:8001`

---

### Frontend Setup

#### Prerequisites
- Node.js 18+ (or Bun)
- npm or bun

#### Installation Steps

1. **Navigate to Frontend**:
```bash
cd frontend
# or from root: cd ../
```

2. **Install Dependencies**:
```bash
# Using npm
npm install

# Or using bun (faster)
bun install
```

3. **Configure Environment**:

Create `.env`:
```env
VITE_API_BASE_URL=https://evolf.ahujalab.iiitd.edu.in/api
```

4. **Start Development Server**:
```bash
# Using npm
npm run dev

# Or using bun
bun dev
```

**Frontend running at**: `http://localhost:8080`

5. **Build for Production**:
```bash
npm run build
# Output: dist/ directory
```

---

### Docker Setup (Optional)

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: evolf_db
      POSTGRES_USER: evolf_user
      POSTGRES_PASSWORD: password
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
    command: gunicorn evo_backend.wsgi:application --bind 0.0.0.0:8001
    volumes:
      - ./backend:/app
      - media_files:/app/media
    ports:
      - "8001:8001"
    depends_on:
      - postgres
      - elasticsearch
    env_file:
      - ./backend/.env

  frontend:
    build: ./frontend
    command: npm run dev -- --host
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "8080:8080"
    environment:
      VITE_API_BASE_URL: http://localhost:8001/api

volumes:
  postgres_data:
  es_data:
  media_files:
```

**Run**:
```bash
docker-compose up -d
```

---

## Features

### Dataset Browser

**Location**: `/dataset/dashboard`

**Features**:
- Server-side pagination (20 items/page, configurable up to 1000)
- Real-time search with debouncing (300ms)
- Multi-column filtering (Species, Class, Mutation Status)
- Sortable columns (click headers)
- Bulk export (filtered or all data)
- Responsive table with mobile optimization

**Backend Endpoint**: `GET /api/dataset`

**Query Parameters**:
- `page`, `limit`: Pagination
- `search`: Full-text search
- `sortBy`, `sortOrder`: Sorting
- `species`, `class`, `mutationType`: Filters

### Detail Pages

**Location**: `/dataset/detail?evolfid=EvOlf0100001`

**Tabs**:
1. **Overview**: Summary, identifiers, mutation info
2. **Receptor**: Protein sequence, UniProt links, mutation impact
3. **Ligand**: SMILES, InChI, 2D structure image
4. **Interaction**: Experimental methods, binding values, source links
5. **3D Structures**: Interactive PDB/SDF viewers

**Architecture**:
- **Single API call** via Context API when entering any tab
- **Instant tab switching** with shared state
- **No duplicate requests** when navigating between tabs

**Implementation**:
```typescript
// DatasetDetailLayout wraps all tabs
<DatasetDetailProvider>
  <Outlet />  {/* Renders active tab */}
</DatasetDetailProvider>

// Each tab consumes shared context
const { data, loading } = useDatasetDetail();
```

### Search Functionality

**Primary**: ElasticSearch with wildcard matching
**Fallback**: PostgreSQL trigram similarity (pg_trgm)

**Search Fields**:
- Receptor name
- Ligand name
- Species
- EvOlf ID

**Frontend Implementation**:
```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearch) {
    fetchDatasetPaginated(1, 20, debouncedSearch);
  }
}, [debouncedSearch]);
```

### Prediction System

**Location**: `/prediction`

**Workflow**:
1. Upload CSV with SMILES and sequences
2. Backend creates job and returns job ID
3. Frontend polls job status every 2 seconds
4. Display results when complete
5. Download results as ZIP

**Backend**:
- Async job processing with Docker container
- Job status tracking in database
- File storage in `JOB_DATA_DIR`

---

## Performance Optimizations

### Backend

1. **Database Indexing**:
```python
class EvOlf(models.Model):
    EvOlf_ID = models.CharField(db_index=True)  # Indexed
    Species = models.CharField(db_index=True)   # Indexed
    Class = models.CharField(db_index=True)     # Indexed
```

2. **Query Optimization**:
- Use `select_related()` for foreign keys
- Use `prefetch_related()` for many-to-many
- Limit query results with pagination

3. **ElasticSearch**:
- Fast full-text search (< 50ms typical)
- Automatic fallback to PostgreSQL

4. **Response Caching** (optional):
```python
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)  # 15 minutes
def dataset_list(request):
    # ...
```

### Frontend

1. **Context API** (prevents duplicate API calls):
```typescript
// Fetch once, share across tabs
const lastFetchedIdRef = useRef<string | null>(null);
if (lastFetchedIdRef.current === evolfId && data) return;
```

2. **Code Splitting**:
```typescript
const DatasetOverview = lazy(() => import('./pages/dataset/DatasetOverview'));
```

3. **Memoization**:
```typescript
const processedData = useMemo(() => {
  return data?.smiles?.split(',') || [];
}, [data?.smiles]);
```

4. **Debounced Search**:
```typescript
const debouncedSearch = useDebounce(searchTerm, 300);
```

5. **Virtual Scrolling** (for large lists):
- Consider `react-window` or `react-virtual` for 1000+ items

---

## API Documentation

See `API_README.md` for complete API reference with examples in multiple languages.

**Key Endpoints**:
- `GET /api/dataset` - Paginated dataset
- `GET /api/dataset/details/:id` - Entry details
- `POST /api/dataset/export` - Bulk export
- `GET /api/search/` - ElasticSearch
- `POST /api/predict/smiles/` - Submit prediction
- `GET /api/job-status/:id` - Check job status

---

## Database Schema

**Main Table**: `core_evolf`

**Key Fields**:
```sql
CREATE TABLE core_evolf (
    id SERIAL PRIMARY KEY,
    EvOlf_ID VARCHAR(100) UNIQUE NOT NULL,
    Receptor VARCHAR(500),
    Receptor_Name VARCHAR(500),
    Species VARCHAR(200),
    Class VARCHAR(100),
    Ligand VARCHAR(500),
    Ligand_Name VARCHAR(500),
    Mutation TEXT,
    Mutation_Status VARCHAR(100),
    Mutation_Type VARCHAR(100),
    Mutation_Impact TEXT,
    ChEMBL_ID VARCHAR(100),
    UniProt_ID VARCHAR(100),
    CID VARCHAR(100),
    Sequence TEXT,
    SMILES TEXT,
    InChI TEXT,
    InChIKey VARCHAR(500),
    IUPAC_Name TEXT,
    PDB_Data TEXT,
    SDF_Data TEXT,
    Comments TEXT,
    Source VARCHAR(500),
    Source_Links TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_evolf_id ON core_evolf(EvOlf_ID);
CREATE INDEX idx_species ON core_evolf(Species);
CREATE INDEX idx_class ON core_evolf(Class);
CREATE INDEX idx_mutation_status ON core_evolf(Mutation_Status);

-- Trigram index for fuzzy search
CREATE INDEX idx_receptor_trgm ON core_evolf USING GIN (Receptor gin_trgm_ops);
CREATE INDEX idx_ligand_trgm ON core_evolf USING GIN (Ligand gin_trgm_ops);
```

---

## Deployment

### Backend Deployment

**Production Checklist**:
1. Set `DEBUG=False`
2. Configure `ALLOWED_HOSTS`
3. Set strong `SECRET_KEY`
4. Use environment variables
5. Setup HTTPS/SSL
6. Configure static file serving
7. Setup logging

**Gunicorn**:
```bash
gunicorn evo_backend.wsgi:application \
  --bind 0.0.0.0:8001 \
  --workers 4 \
  --timeout 60 \
  --access-logfile - \
  --error-logfile -
```

**Nginx** (reverse proxy):
```nginx
server {
    listen 80;
    server_name evolf.ahujalab.iiitd.edu.in;

    location /api/ {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /media/ {
        alias /path/to/media/;
    }
}
```

### Frontend Deployment

**Build**:
```bash
npm run build
# Output: dist/
```

**Static Hosting**:
- **Nginx**: Serve `dist/` directory
- **Vercel**: `vercel deploy`
- **Netlify**: Connect Git repo
- **AWS S3**: Upload to bucket

**Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name evolf.ahujalab.iiitd.edu.in;
    root /path/to/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Troubleshooting

### Backend Issues

**Database Connection Error**:
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U evolf_user -d evolf_db
```

**ElasticSearch Not Working**:
- System automatically falls back to PostgreSQL
- Check `ELASTIC_HOST` in `.env`
- Verify ES is running: `curl http://localhost:9200`

**CORS Errors**:
- Add frontend URL to `CORS_ALLOWED_ORIGINS` in `.env`
- Verify `django-cors-headers` is installed

### Frontend Issues

**API Connection Failed**:
- Check `VITE_API_BASE_URL` in `.env`
- Verify backend is running
- Check browser console for CORS errors

**Build Errors**:
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Or with bun
rm -rf node_modules bun.lockb
bun install
```

**Context Not Working**:
- Ensure `DatasetDetailLayout` wraps all detail routes
- Check `useDatasetDetail()` is called inside provider
- Verify `evolfid` query parameter is present

---

## Additional Resources

- **API Documentation**: See `API_README.md`
- **Backend Code**: `backend/core/`
- **Frontend Code**: `src/`
- **Component Library**: shadcn/ui documentation
- **Django REST Framework**: https://www.django-rest-framework.org/

---

## Contributing

For questions or contributions, contact the development team.

## License

[Add license information]
