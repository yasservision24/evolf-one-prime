# EvOlf API Documentation

Complete REST API reference for the EvOlf platform with detailed examples in multiple programming languages.

---

## Table of Contents

1. [Base Configuration](#base-configuration)
2. [Architecture Overview](#architecture-overview)
   - [Backend Architecture](#backend-architecture)
   - [Frontend Architecture](#frontend-architecture)
3. [Dataset Endpoints](#dataset-endpoints)
   - [Get Paginated Dataset](#1-get-paginated-dataset)
   - [Get Dataset Details](#2-get-dataset-details)
   - [Export Multiple Entries](#3-export-multiple-entries)
   - [Export Single Entry](#4-export-single-entry)
   - [Download Complete Dataset](#5-download-complete-dataset)
4. [Search Endpoints](#search-endpoints)
   - [ElasticSearch Query](#elasticsearch-query)
5. [Prediction Endpoints](#prediction-endpoints)
   - [Submit SMILES Prediction](#1-submit-smiles-prediction)
   - [Get Job Status](#2-get-job-status)
   - [Download Job Results](#3-download-job-results)
6. [Frontend Integration](#frontend-integration)
7. [Performance Optimizations](#performance-optimizations)
8. [Error Handling](#error-handling)

---

## Base Configuration

**Base URL**: `https://evolf.ahujalab.iiitd.edu.in/api` (configurable via `VITE_API_BASE_URL`)

**Required Headers**:
```json
{
  "Content-Type": "application/json"
}
```

**Request Timeout**: 30 seconds

---

## Architecture Overview

### Backend Architecture

**Technology Stack**:
- **Framework**: Django 4.x with Django REST Framework
- **Database**: PostgreSQL 14+ with pg_trgm extension for fuzzy search
- **Search Engine**: ElasticSearch 8.x (optional, with PostgreSQL fallback)
- **File Storage**: Django MEDIA_ROOT for PDB/SDF files
- **Job Queue**: Async task processing for predictions

**Key Components**:
```
backend/
├── core/
│   ├── models.py          # EvOlf database model
│   ├── serializers.py     # DRF serializers
│   ├── views/
│   │   ├── dataset_views.py      # Dataset CRUD operations
│   │   ├── elastic_search_views.py  # Search functionality
│   │   ├── prediction_views.py    # SMILES prediction endpoints
│   │   └── job_status_views.py    # Job status polling
│   ├── services/
│   │   └── job_scheduler.py    # Background job management
│   └── management/commands/
│       ├── import_evolf_data.py   # Data import utility
│       └── elastic_search.py      # ES indexing
└── evo_backend/
    ├── settings.py        # Django configuration
    └── urls.py            # API routing
```

**Database Model** (`core/models.py`):
```python
class EvOlf(models.Model):
    EvOlf_ID = models.CharField(max_length=100, unique=True)
    Receptor = models.CharField(max_length=500)
    Species = models.CharField(max_length=200)
    Class = models.CharField(max_length=100)
    Ligand = models.CharField(max_length=500)
    Mutation = models.TextField(blank=True)
    Mutation_Status = models.CharField(max_length=100)
    ChEMBL_ID = models.CharField(max_length=100)
    UniProt_ID = models.CharField(max_length=100)
    CID = models.CharField(max_length=100)
    # ... additional fields for sequences, structures, etc.
```

**API Views**:
- `DatasetListAPIView`: Paginated dataset with filters
- `FetchDatasetDetails`: Single entry details
- `DatasetExportView`: Bulk export (CSV/ZIP)
- `ElasticSearchView`: Full-text search
- `SmilesPredictionAPIView`: Submit predictions
- `JobStatusAPIView`: Check job status

### Frontend Architecture

**Technology Stack**:
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router 6.30.1
- **State Management**: React Context API + TanStack Query
- **Styling**: Tailwind CSS with shadcn/ui components
- **3D Visualization**: Custom molecular viewer component

**Key Components**:
```
src/
├── components/
│   ├── Header.tsx              # Main navigation
│   ├── Footer.tsx              # Footer links
│   ├── Molecular3DViewer.tsx   # 3D structure viewer
│   └── ui/                     # shadcn/ui components
├── contexts/
│   └── DatasetDetailContext.tsx  # Shared data context
├── pages/
│   ├── Index.tsx               # Home page
│   ├── dataset/
│   │   ├── DatabaseDashboard.tsx      # Main database browser
│   │   ├── DatasetDetailLayout.tsx    # Context provider wrapper
│   │   ├── DatasetOverview.tsx        # Entry overview tab
│   │   ├── DatasetReceptor.tsx        # Receptor details tab
│   │   ├── DatasetLigand.tsx          # Ligand details tab
│   │   ├── DatasetInteraction.tsx     # Interaction data tab
│   │   └── DatasetStructures.tsx      # 3D structures tab
│   └── prediction/
│       ├── PredictionDashboard.tsx    # Submit predictions
│       └── PredictionResult.tsx       # View results
├── lib/
│   ├── api.ts              # API client functions
│   └── utils.ts            # Utility functions
└── hooks/
    ├── use-toast.ts        # Toast notifications
    └── use-mobile.tsx      # Mobile detection
```

**State Management Pattern**:
- **Context API**: Shared dataset details across tabs (prevents duplicate API calls)
- **TanStack Query**: Server state caching and synchronization
- **Local State**: Component-specific UI state

**Data Flow**:
```
User Action → Component → API Client (lib/api.ts) → Backend API → Database/ElasticSearch
                    ↓
          Context Provider (shared state)
                    ↓
      All Tab Components (consume shared data)
```

---

## Dataset Endpoints

### 1. Get Paginated Dataset

Retrieve filtered and paginated dataset with server-side filtering, sorting, and search.

#### Endpoint
```
GET /dataset
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number (1-indexed) |
| `limit` | integer | No | 20 | Items per page (max: 1000) |
| `search` | string | No | - | Search term (ElasticSearch with trigram fallback) |
| `sortBy` | string | No | EvOlf_ID | Field to sort by: `EvOlf_ID`, `Receptor`, `Ligand`, `Species`, `Class`, `Mutation` |
| `sortOrder` | string | No | desc | Sort direction: `asc` or `desc` |
| `species` | string | No | - | Filter by species (e.g., 'Human', 'Mouse', 'Rat') |
| `class` | string | No | - | Filter by GPCR class (e.g., '0', '1') |
| `mutationType` | string | No | - | Filter by mutation status (e.g., 'Wild type', 'Mutant') |

#### Examples

**cURL**:
```bash
# Basic request
curl "https://evolf.ahujalab.iiitd.edu.in/api/dataset?page=1&limit=20"

# With search and filters
curl "https://evolf.ahujalab.iiitd.edu.in/api/dataset?page=1&limit=20&search=dopamine&species=Human&class=1&sortBy=Receptor&sortOrder=asc"
```

**JavaScript/TypeScript**:
```javascript
// Using fetch
const response = await fetch('https://evolf.ahujalab.iiitd.edu.in/api/dataset?page=1&limit=20&search=dopamine&species=Human', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(data);

// Using the API client (frontend)
import { fetchDatasetPaginated } from '@/lib/api';
const result = await fetchDatasetPaginated(
  1,           // page
  20,          // limit
  'dopamine',  // search
  'Receptor',  // sortBy
  'asc',       // sortOrder
  'Human',     // species
  '1',         // class
  'Wild type'  // mutationType
);
```

**Python**:
```python
import requests

# Basic request
response = requests.get(
    'https://evolf.ahujalab.iiitd.edu.in/api/dataset',
    params={
        'page': 1,
        'limit': 20,
        'search': 'dopamine',
        'species': 'Human',
        'sortBy': 'Receptor',
        'sortOrder': 'asc'
    },
    headers={'Content-Type': 'application/json'}
)
data = response.json()
print(f"Total items: {data['pagination']['totalItems']}")
print(f"Current page: {data['pagination']['currentPage']}")
for item in data['data']:
    print(f"{item['evolfId']}: {item['receptor']} - {item['ligand']}")
```

**R**:
```r
library(httr)
library(jsonlite)

response <- GET(
  "https://evolf.ahujalab.iiitd.edu.in/api/dataset",
  query = list(
    page = 1,
    limit = 20,
    search = "dopamine",
    species = "Human",
    sortBy = "Receptor",
    sortOrder = "asc"
  ),
  add_headers("Content-Type" = "application/json")
)

data <- fromJSON(content(response, "text"))
cat("Total items:", data$pagination$totalItems, "\n")
print(data$data)
```

#### Response Format

**Success (200 OK)**:
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
    "uniqueSpecies": ["Human", "Mouse", "Rat", "Guinea pig", "Pig"],
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

### 2. Get Dataset Details

Fetch complete details for a specific EvOlf entry including sequences, structures, and experimental data.

**IMPORTANT**: This endpoint is called **once per entry** via the Context API on the frontend, and the data is shared across all detail tabs (Overview, Receptor, Ligand, Interaction, 3D Structures).

#### Endpoint
```
GET /dataset/details/{evolfId}
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `evolfId` | string | Yes | EvOlf identifier (e.g., 'EvOlf0100001') |

#### Examples

**cURL**:
```bash
curl "https://evolf.ahujalab.iiitd.edu.in/api/dataset/details/EvOlf0100001"
```

**JavaScript/TypeScript (Frontend Integration)**:
```javascript
// Using API client with Context
import { useDatasetDetail } from '@/contexts/DatasetDetailContext';

function DatasetComponent() {
  const { data, loading, evolfId } = useDatasetDetail();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{data?.receptorName} - {data?.ligandName}</h1>
      <p>Species: {data?.species}</p>
      <p>SMILES: {data?.smiles}</p>
    </div>
  );
}
```

**Python**:
```python
import requests

response = requests.get(
    'https://evolf.ahujalab.iiitd.edu.in/api/dataset/details/EvOlf0100001',
    headers={'Content-Type': 'application/json'}
)
details = response.json()
print(f"Receptor: {details['receptor']}")
print(f"Ligand: {details['ligand']}")
print(f"Species: {details['species']}")
print(f"SMILES: {details['smiles']}")
```

#### Response Format

**Success (200 OK)**:
```json
{
  "evolfId": "EvOlf0100001",
  "receptor": "Dopamine D2 receptor",
  "receptorName": "Dopamine D2 receptor",
  "ligand": "Dopamine",
  "ligandName": "Dopamine",
  "species": "Human",
  "class": "1",
  "mutation": "Wild-type",
  "mutationStatus": "Wild-type",
  "mutationType": "",
  "mutationImpact": "",
  "receptorSubtype": "Dopamine D2",
  "uniprotId": "P14416",
  "uniprotLink": "https://www.uniprot.org/uniprotkb/P14416",
  "chemblId": "CHEMBL228",
  "cid": "681",
  "pubchemId": "681",
  "pubchemLink": "https://pubchem.ncbi.nlm.nih.gov/compound/681",
  "smiles": "NCCc1ccc(O)c(O)c1",
  "inchi": "InChI=1S/C8H11NO2/c9-4-3-6-1-2-7(10)8(11)5-6/h1-2,5,10-11H,3-4,9H2",
  "inchiKey": "VYFYYTLLBUKUHU-UHFFFAOYSA-N",
  "iupacName": "4-(2-aminoethyl)benzene-1,2-diol",
  "sequence": "MDPLNLSWYDDDLERQNWSRPFNGSDGKADRPPYNYYATLLTLLIAVIVFGNVLVCMAVSREKALQTTTNYLIVSLAVADLLVATLVMPWVVYLEVVGEWKFSRIHCDIFVTLDVMMCTASILNLCAISIDRYTAVAMPMLYNT...",
  "pdbData": "ATOM      1  N   MET A   1     -12.345   8.901  23.456...",
  "sdfData": "\n  Mrv0541...",
  "structure2d": "https://pubchem.ncbi.nlm.nih.gov/image/imagefly.cgi?cid=681&width=300&height=300",
  "image": "https://pubchem.ncbi.nlm.nih.gov/image/imagefly.cgi?cid=681&width=300&height=300",
  "structure3d": "https://evolf.ahujalab.iiitd.edu.in/media/pdb_files/EvOlf0100001.pdb",
  "expressionSystem": "HEK293",
  "parameter": "Ki",
  "value": "2.1",
  "unit": "nM",
  "comments": "High affinity binding measured at 25°C",
  "geneSymbol": "DRD2",
  "source": "12345678",
  "sourceLinks": "https://pubmed.ncbi.nlm.nih.gov/12345678/"
}
```

---

## Frontend Integration

### Context-Based State Management

The frontend uses React Context API to **prevent duplicate API calls** when navigating between detail tabs:

**DatasetDetailContext.tsx**:
```typescript
export function DatasetDetailProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams();
  const evolfId = searchParams.get('evolfid');
  const [data, setData] = useState<DatasetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const lastFetchedIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Only fetch if evolfId changed
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

**Router Configuration** (App.tsx):
```typescript
<Route element={<DatasetDetailLayout />}>
  <Route path="/dataset/detail" element={<DatasetOverview />} />
  <Route path="/dataset/receptor" element={<DatasetReceptor />} />
  <Route path="/dataset/ligand" element={<DatasetLigand />} />
  <Route path="/dataset/interaction" element={<DatasetInteraction />} />
  <Route path="/dataset/structures" element={<DatasetStructures />} />
</Route>
```

**Benefits**:
- **Single API call per entry**: Data fetched once when entering any detail tab
- **Instant tab switching**: No loading delay when switching between tabs
- **Reduced server load**: Fewer HTTP requests
- **Better UX**: Seamless navigation experience

---

## Performance Optimizations

### Backend Optimizations

1. **Pagination**: Server-side pagination limits response size
2. **Query Optimization**: Django ORM with `select_related` and `prefetch_related`
3. **ElasticSearch**: Fast full-text search with fallback to PostgreSQL trigram
4. **Indexing**: Database indexes on frequently queried fields
5. **Caching**: Response caching for static data (optional)

### Frontend Optimizations

1. **Context API**: Single data fetch shared across tabs
2. **Code Splitting**: Route-based lazy loading with React.lazy()
3. **Memoization**: useMemo for expensive computations
4. **Virtual Scrolling**: Large lists use virtualization
5. **Debounced Search**: Search input debounced to reduce API calls

**Example - Debounced Search**:
```typescript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearch) {
    fetchDatasetPaginated(1, 20, debouncedSearch);
  }
}, [debouncedSearch]);
```

---

## Error Handling

### Standard Error Responses

**404 Not Found**:
```json
{
  "error": "Entry not found",
  "message": "No record with EvOlf ID: EvOlf0100001"
}
```

**400 Bad Request**:
```json
{
  "error": "Invalid parameters",
  "message": "Page number must be greater than 0"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Server error",
  "message": "An unexpected error occurred"
}
```

### Frontend Error Handling

```typescript
try {
  const data = await fetchDatasetDetail(evolfId);
  setData(data);
} catch (error) {
  console.error('Failed to fetch entry:', error);
  toast({
    title: 'Error',
    description: 'Failed to load entry details. Please try again.',
    variant: 'destructive',
  });
}
```

---

## Additional Resources

- **Backend Code**: `backend/core/views/`
- **Frontend Code**: `src/lib/api.ts`, `src/contexts/`
- **API Tests**: `backend/core/tests.py`
- **Deployment Guide**: See `final_readme.md`

For more detailed setup instructions and architecture diagrams, refer to `final_readme.md`.
