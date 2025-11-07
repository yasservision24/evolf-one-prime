# EvoLF API Documentation

Complete API reference for EvoLF dataset endpoints and prediction model with examples and integration guides.

---

## Table of Contents
1. [Get Paginated Dataset](#1-get-paginated-dataset)
2. [Get Dataset Entry Details](#2-get-dataset-entry-details)
3. [Get Dataset Overview](#3-get-dataset-overview)
4. [Get Dataset Receptor Data](#4-get-dataset-receptor-data)
5. [Get Dataset Ligand Data](#5-get-dataset-ligand-data)
6. [Get Dataset Interaction Data](#6-get-dataset-interaction-data)
7. [Get Dataset Structures](#7-get-dataset-structures)
8. [Get Dataset Statistics](#8-get-dataset-statistics)
9. [Search Dataset (Autocomplete)](#9-search-dataset-autocomplete)
10. [Get GPCR Receptors List](#10-get-gpcr-receptors-list)
11. [Get Interactions Data](#11-get-interactions-data)
12. [Download Single Dataset Entry](#12-download-single-dataset-entry)
13. [Download Selected Dataset Items](#13-download-selected-dataset-items)
14. [Download Complete Dataset](#14-download-complete-dataset)
15. [Submit Prediction](#15-submit-prediction)
16. [Get Prediction Job Status](#16-get-prediction-job-status)
17. [Download Prediction Results](#17-download-prediction-results)

---

## Base Configuration

**Base URL:** `https://api.evolf.com/v1` (or configured via `VITE_API_BASE_URL`)

**Headers Required:**
```json
{
  "Content-Type": "application/json"
}
```

**Timeout:** 30 seconds for all requests

---

## 1. Get Paginated Dataset

Retrieve filtered and paginated dataset items with sorting and search capabilities.

### Endpoint
```
GET /dataset
```

### Function Signature
```typescript
fetchDatasetPaginated(
  page?: number,
  limit?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  species?: string,
  classFilter?: string,
  mutationType?: string
)
```

### Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number to retrieve (1-indexed) |
| `limit` | number | No | 20 | Number of items per page (max: 100) |
| `search` | string | No | - | Search query - searches across EvOlf ID, receptor, ligand, species, ChEMBL ID |
| `sortBy` | string | No | 'EvOlf_ID' | Field to sort by (backend field names: 'EvOlf_ID', 'Receptor', 'Ligand', 'Species', 'Class', 'Mutation') |
| `sortOrder` | string | No | 'desc' | Sort direction ('asc' or 'desc') |
| `species` | string | No | - | **Server-side filter** by species name |
| `class` | string | No | - | **Server-side filter** by GPCR class |
| `mutationType` | string | No | - | **Server-side filter** by mutation type |

**Note:** All filters are applied **server-side** for optimal performance. The API returns only the filtered results along with filter statistics.

### Example Request

**JavaScript/TypeScript:**
```javascript
import { fetchDatasetPaginated } from '@/lib/api';

// Basic request - first page with defaults
const response = await fetchDatasetPaginated();

// Advanced request with filters and sorting
const response = await fetchDatasetPaginated(
  2,                    // page 2
  50,                   // 50 items per page
  'receptor',           // search term
  'EvOlf_ID',           // sort by evolf ID
  'asc',                // ascending order
  'Human',              // filter by species
  '0',                  // filter by GPCR class
  'Wild-type'           // filter by mutation type
);
```

**cURL:**
```bash
# Basic request
curl "https://api.evolf.com/v1/dataset?page=1&limit=20&sortBy=EvOlf_ID&sortOrder=desc"

# With filters
curl "https://api.evolf.com/v1/dataset?page=2&limit=50&search=receptor&sortBy=EvOlf_ID&sortOrder=asc&species=Human&class=0&mutationType=Wild-type"
```

**Python:**
```python
import requests

# Basic request
response = requests.get(
    'https://api.evolf.com/v1/dataset',
    params={
        'page': 1,
        'limit': 20,
        'sortBy': 'EvOlf_ID',
        'sortOrder': 'desc'
    },
    headers={'Content-Type': 'application/json'}
)
data = response.json()

# With filters
response = requests.get(
    'https://api.evolf.com/v1/dataset',
    params={
        'page': 2,
        'limit': 50,
        'search': 'receptor',
        'sortBy': 'EvOlf_ID',
        'sortOrder': 'asc',
        'species': 'Human',
        'class': '0',
        'mutationType': 'Wild-type'
    },
    headers={'Content-Type': 'application/json'}
)
data = response.json()
```

**R:**
```r
library(httr)
library(jsonlite)

# Basic request
response <- GET(
  "https://api.evolf.com/v1/dataset",
  query = list(
    page = 1,
    limit = 20,
    sortBy = "EvOlf_ID",
    sortOrder = "desc"
  ),
  add_headers("Content-Type" = "application/json")
)
data <- fromJSON(content(response, "text"))

# With filters
response <- GET(
  "https://api.evolf.com/v1/dataset",
  query = list(
    page = 2,
    limit = 50,
    search = "receptor",
    sortBy = "EvOlf_ID",
    sortOrder = "asc",
    species = "Human",
    class = "0",
    mutationType = "Wild-type"
  ),
  add_headers("Content-Type" = "application/json")
)
data <- fromJSON(content(response, "text"))
```

### Response Format

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "1",
      "evolfId": "EvOlf0000001",
      "receptor": "OR8B8",
      "species": "Human",
      "class": "0",
      "ligand": "Musk xylol",
      "mutation": "Wild-type",
      "chemblId": "ChEMBL19208",
      "uniprotId": "",
      "ensembleId": "ENSG00000197125"
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
    "uniqueMutationTypes": ["Wild-type", "Mutant"]
  },
  "filterOptions": {
    "uniqueClasses": ["0", "1"],
    "uniqueSpecies": ["Human", "Mouse", "Rat"],
    "uniqueMutationTypes": ["Wild-type", "Mutant"]
  },
  "all_evolf_ids": ["EvOlf0000001", "EvOlf0000002", "..."]
}
```

**Field Descriptions:**
- `data`: Array of dataset items for current page
- `pagination`: Pagination metadata
- `statistics`: Statistics for filtered dataset
- `filterOptions`: Available filter values for dropdowns
- `all_evolf_ids`: All IDs matching current filters (useful for downloads)

---

## 2. Get Dataset Entry Details

Fetch complete details for a specific EvOlf ID.

### Endpoint
```
GET /dataset/details/:evolfId
```

### Function Signature
```typescript
fetchDatasetDetail(evolfId: string): Promise<DatasetDetail>
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `evolfId` | string | Yes | EvOlf ID (e.g., 'EvOlf0000001') |

### Example Request

**JavaScript/TypeScript:**
```javascript
import { fetchDatasetDetail } from '@/lib/api';

const details = await fetchDatasetDetail('EvOlf0000001');
```

**cURL:**
```bash
curl "https://api.evolf.com/v1/dataset/details/EvOlf0000001"
```

### Response Format

**Success Response (200 OK):**
```json
{
  "evolfId": "EvOlf0000001",
  "receptor": "OR8B8",
  "ligand": "Musk xylol",
  "species": "Human",
  "class": "0",
  "mutation": "",
  "mutationStatus": "Wild-type",
  "uniprotId": "Q8NGI8",
  "chemblId": "CHEMBL19208",
  "sequence": "MSEFLILGLPSNLSAVLGNLLVLFAVRDSHLHTPMYFFLSNLSFADLC...",
  "smiles": "CC1=CC(=C(C=C1)C)C(C)(C)C",
  "pdbData": "HEADER    RECEPTOR...\nATOM      1  N   MET A   1...",
  "sdfData": "\n  Mrv0541...\n 16 17  0  0..."
}
```

---

## 3. Get Dataset Overview

Fetch overview data for a specific EvOlf ID.

### Endpoint
```
GET /dataset/detail?evolfid={evolfId}
```

### Function Signature
```typescript
fetchDatasetOverview(evolfId: string)
```

### Example Request

**JavaScript/TypeScript:**
```javascript
import { fetchDatasetOverview } from '@/lib/api';

const overview = await fetchDatasetOverview('EvOlf0000001');
```

**cURL:**
```bash
curl "https://api.evolf.com/v1/dataset/detail?evolfid=EvOlf0000001"
```

---

## 4. Get Dataset Receptor Data

Fetch receptor-specific data for a specific EvOlf ID.

### Endpoint
```
GET /dataset/receptor?evolfid={evolfId}
```

### Function Signature
```typescript
fetchDatasetReceptor(evolfId: string)
```

### Example Request

**JavaScript/TypeScript:**
```javascript
import { fetchDatasetReceptor } from '@/lib/api';

const receptor = await fetchDatasetReceptor('EvOlf0000001');
```

**cURL:**
```bash
curl "https://api.evolf.com/v1/dataset/receptor?evolfid=EvOlf0000001"
```

---

## 5. Get Dataset Ligand Data

Fetch ligand-specific data for a specific EvOlf ID.

### Endpoint
```
GET /dataset/ligand?evolfid={evolfId}
```

### Function Signature
```typescript
fetchDatasetLigand(evolfId: string)
```

### Example Request

**JavaScript/TypeScript:**
```javascript
import { fetchDatasetLigand } from '@/lib/api';

const ligand = await fetchDatasetLigand('EvOlf0000001');
```

**cURL:**
```bash
curl "https://api.evolf.com/v1/dataset/ligand?evolfid=EvOlf0000001"
```

---

## 6. Get Dataset Interaction Data

Fetch interaction data for a specific EvOlf ID.

### Endpoint
```
GET /dataset/interaction?evolfid={evolfId}
```

### Function Signature
```typescript
fetchDatasetInteraction(evolfId: string)
```

### Example Request

**JavaScript/TypeScript:**
```javascript
import { fetchDatasetInteraction } from '@/lib/api';

const interaction = await fetchDatasetInteraction('EvOlf0000001');
```

**cURL:**
```bash
curl "https://api.evolf.com/v1/dataset/interaction?evolfid=EvOlf0000001"
```

---

## 7. Get Dataset Structures

Fetch 3D structure data (PDB/SDF) for a specific EvOlf ID.

### Endpoint
```
GET /dataset/structures?evolfid={evolfId}
```

### Function Signature
```typescript
fetchDatasetStructures(evolfId: string)
```

### Example Request

**JavaScript/TypeScript:**
```javascript
import { fetchDatasetStructures } from '@/lib/api';

const structures = await fetchDatasetStructures('EvOlf0000001');
```

**cURL:**
```bash
curl "https://api.evolf.com/v1/dataset/structures?evolfid=EvOlf0000001"
```

---

## 8. Get Dataset Statistics

Fetch overall dataset statistics.

### Endpoint
```
GET /dataset/stats
```

### Function Signature
```typescript
fetchDatasetStats()
```

### Example Request

**JavaScript/TypeScript:**
```javascript
import { fetchDatasetStats } from '@/lib/api';

const stats = await fetchDatasetStats();
```

**cURL:**
```bash
curl "https://api.evolf.com/v1/dataset/stats"
```

### Response Format

**Success Response (200 OK):**
```json
{
  "totalReceptors": 144,
  "totalLigands": 58,
  "totalMutations": 250,
  "totalSpecies": 10,
  "uniqueClasses": ["0", "1"],
  "uniqueSpecies": ["Human", "Mouse", "Rat"],
  "uniqueMutationTypes": ["Wild-type", "Mutant"],
  "totalRows": 250
}
```

---

## 9. Search Dataset (Autocomplete)

Search the dataset with autocomplete suggestions.

### Endpoint
```
GET /search/?q={query}
```

### Function Signature
```typescript
searchDataset(query: string): Promise<{ results: SearchResult[] }>
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query string |

### Example Request

**JavaScript/TypeScript:**
```javascript
import { searchDataset } from '@/lib/api';

const response = await searchDataset('human');
console.log(response.results);
```

**cURL:**
```bash
curl "https://api.evolf.com/v1/search/?q=human"
```

### Response Format

**Success Response (200 OK):**
```json
{
  "results": [
    {
      "EvOlf_ID": "EvOlf0000001",
      "Receptor": "OR8B8",
      "Ligand": "Musk xylol",
      "Species": "Human"
    }
  ]
}
```

---

## 10. Get GPCR Receptors List

Fetch list of available GPCR receptors.

### Endpoint
```
GET /receptors
```

### Function Signature
```typescript
fetchReceptors()
```

### Example Request

**JavaScript/TypeScript:**
```javascript
import { fetchReceptors } from '@/lib/api';

const receptors = await fetchReceptors();
```

**cURL:**
```bash
curl "https://api.evolf.com/v1/receptors"
```

---

## 11. Get Interactions Data

Fetch interactions data.

### Endpoint
```
GET /interactions
```

### Function Signature
```typescript
fetchInteractions()
```

### Example Request

**JavaScript/TypeScript:**
```javascript
import { fetchInteractions } from '@/lib/api';

const interactions = await fetchInteractions();
```

**cURL:**
```bash
curl "https://api.evolf.com/v1/interactions"
```

---

## 12. Download Single Dataset Entry

Export a single dataset entry by its EvOlf ID as a ZIP file.

### Endpoint
```
GET /dataset/export/:evolfId
```

### Function Signature
```typescript
downloadDatasetByEvolfId(evolfId: string): Promise<Blob>
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `evolfId` | string | Yes | Single EvoLF ID to export |

### Example Request

**JavaScript/TypeScript:**
```javascript
import { downloadDatasetByEvolfId } from '@/lib/api';

const blob = await downloadDatasetByEvolfId('EvOlf0000001');

// Create download link
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'EvOlf0000001_data.zip';
link.click();
window.URL.revokeObjectURL(url);
```

**cURL:**
```bash
curl "https://api.evolf.com/v1/dataset/export/EvOlf0000001" \
  --output EvOlf0000001_data.zip
```

### Response Format

**Success Response (200 OK):**
- **Content-Type:** `application/zip`
- **Body:** Binary ZIP file containing complete entry data

---

## 13. Download Selected Dataset Items

Export specific dataset items by their EvoLF IDs as a ZIP file.

### Endpoint
```
POST /dataset/export
```

### Function Signature
```typescript
downloadDatasetByIds(evolfIds: string[]): Promise<Blob>
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `evolfIds` | string[] | Yes | Array of EvoLF IDs to export |

### Example Request

**JavaScript/TypeScript:**
```javascript
import { downloadDatasetByIds } from '@/lib/api';

const evolfIds = ['EvOlf0000001', 'EvOlf0000002', 'EvOlf0000003'];
const blob = await downloadDatasetByIds(evolfIds);

// Create download link
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'evolf_selected_data.zip';
link.click();
window.URL.revokeObjectURL(url);
```

**cURL:**
```bash
curl -X POST "https://api.evolf.com/v1/dataset/export" \
  -H "Content-Type: application/json" \
  -d '{
    "evolfIds": ["EvOlf0000001", "EvOlf0000002", "EvOlf0000003"]
  }' \
  --output evolf_selected_data.zip
```

**Python:**
```python
import requests

evolf_ids = ['EvOlf0000001', 'EvOlf0000002', 'EvOlf0000003']

response = requests.post(
    'https://api.evolf.com/v1/dataset/export',
    json={'evolfIds': evolf_ids},
    headers={'Content-Type': 'application/json'}
)

with open('evolf_selected_data.zip', 'wb') as f:
    f.write(response.content)
```

### Response Format

**Success Response (200 OK):**
- **Content-Type:** `application/zip`
- **Body:** Binary ZIP file containing selected entries

---

## 14. Download Complete Dataset

Download the entire EvoLF dataset as a ZIP file.

### Endpoint
```
GET /dataset/download
```

### Function Signature
```typescript
downloadCompleteDataset(): Promise<Blob>
```

### Example Request

**JavaScript/TypeScript:**
```javascript
import { downloadCompleteDataset } from '@/lib/api';

const blob = await downloadCompleteDataset();

// Create download link
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'evolf_complete_dataset.zip';
link.click();
window.URL.revokeObjectURL(url);
```

**cURL:**
```bash
curl "https://api.evolf.com/v1/dataset/download" \
  --output evolf_complete_dataset.zip
```

**Python:**
```python
import requests

response = requests.get(
    'https://api.evolf.com/v1/dataset/download',
    headers={'Content-Type': 'application/json'}
)

with open('evolf_complete_dataset.zip', 'wb') as f:
    f.write(response.content)
```

### Response Format

**Success Response (200 OK):**
- **Content-Type:** `application/zip`
- **Body:** Binary ZIP file containing complete dataset

---

## 15. Submit Prediction

Submit GPCR-ligand binding affinity predictions.

### Endpoint
```
POST /predict
```

### Function Signature
```typescript
submitPrediction(data: {
  receptor: {
    sequence: string;
    name?: string;
  };
  ligands: Array<{
    smiles: string;
    name?: string;
  }>;
})
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `receptor.sequence` | string | Yes | FASTA format receptor sequence |
| `receptor.name` | string | No | Optional receptor identifier |
| `ligands` | array | Yes | Array of ligand objects |
| `ligands[].smiles` | string | Yes | SMILES notation for ligand |
| `ligands[].name` | string | No | Optional ligand identifier |

### Example Request

**JavaScript/TypeScript:**
```javascript
import { submitPrediction } from '@/lib/api';

const result = await submitPrediction({
  receptor: {
    sequence: ">A2A_HUMAN\nMPIMGSSVYITVELAIAVLAILGNVLVCWAVWLNSNLQ...",
    name: "Adenosine A2A Receptor"
  },
  ligands: [
    {
      smiles: "CCN1C=NC2=C1C(=O)N(C(=O)N2C)C",
      name: "Caffeine"
    }
  ]
});

console.log('Job ID:', result.jobId);
```

**cURL:**
```bash
curl -X POST "https://api.evolf.com/v1/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "receptor": {
      "sequence": ">A2A_HUMAN\nMPIMGSSVYITVELAIAVLAILGNVLVCWAVWLNSNLQ...",
      "name": "Adenosine A2A Receptor"
    },
    "ligands": [
      {
        "smiles": "CCN1C=NC2=C1C(=O)N(C(=O)N2C)C",
        "name": "Caffeine"
      }
    ]
  }'
```

### Response Format

**Success Response (200 OK):**
```json
{
  "jobId": "pred_abc123xyz789",
  "message": "Prediction submitted successfully"
}
```

---

## 16. Get Prediction Job Status

Get prediction job status and results.

### Endpoint
```
GET /predict/job/:jobId
```

### Function Signature
```typescript
getPredictionJobStatus(jobId: string)
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `jobId` | string | Yes | Job ID from prediction submission |

### Example Request

**JavaScript/TypeScript:**
```javascript
import { getPredictionJobStatus } from '@/lib/api';

const status = await getPredictionJobStatus('pred_abc123xyz789');
console.log('Status:', status.status);
```

**cURL:**
```bash
curl "https://api.evolf.com/v1/predict/job/pred_abc123xyz789"
```

### Response Format

**Running:**
```json
{
  "status": "running",
  "jobId": "pred_abc123xyz789",
  "createdAt": "2024-01-15T10:30:00Z",
  "expiresAt": "2024-01-30T10:30:00Z"
}
```

**Completed:**
```json
{
  "status": "completed",
  "jobId": "pred_abc123xyz789",
  "results": {
    "downloadUrl": "https://api.evolf.com/v1/predict/download/pred_abc123xyz789",
    "ligands": [
      {
        "name": "Caffeine",
        "smiles": "CCN1C=NC2=C1C(=O)N(C(=O)N2C)C",
        "predictedAffinity": 7.5,
        "confidenceScore": 0.92,
        "affinityClass": "moderate"
      }
    ]
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "expiresAt": "2024-01-30T10:30:00Z"
}
```

**Expired:**
```json
{
  "status": "expired",
  "jobId": "pred_abc123xyz789"
}
```

---

## 17. Download Prediction Results

Download prediction results as ZIP file.

### Endpoint
```
GET /predict/download/:jobId
```

### Function Signature
```typescript
downloadPredictionResults(jobId: string): Promise<Blob>
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `jobId` | string | Yes | Job ID from prediction submission |

### Example Request

**JavaScript/TypeScript:**
```javascript
import { downloadPredictionResults } from '@/lib/api';

const blob = await downloadPredictionResults('pred_abc123xyz789');

// Create download link
const url = window.URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = `prediction_pred_abc123xyz789.zip`;
link.click();
window.URL.revokeObjectURL(url);
```

**cURL:**
```bash
curl "https://api.evolf.com/v1/predict/download/pred_abc123xyz789" \
  --output prediction_results.zip
```

### Response Format

**Success Response (200 OK):**
- **Content-Type:** `application/zip`
- **Body:** Binary ZIP file containing prediction results

---

## Error Handling

All endpoints use consistent error response format:

```json
{
  "error": "Error type",
  "status": 400,
  "message": "Human-readable error description"
}
```

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |
| 503 | Service Unavailable |
| 504 | Gateway Timeout (>30s) |

### Error Handling Example

```javascript
import { fetchDatasetPaginated, ApiError } from '@/lib/api';

try {
  const data = await fetchDatasetPaginated(1, 20);
  console.log('Success:', data);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', {
      message: error.message,
      status: error.status,
      data: error.data
    });
  }
}
```

---

## Rate Limiting

**Current Limits:** No rate limiting enforced (subject to change)

**Best Practices:**
- Implement exponential backoff for retries
- Cache responses when appropriate
- Batch requests when possible

---

## Support & Resources

- **GitHub Repository:** [github.com/evolf/dataset](https://github.com/evolf/dataset)
- **Issue Tracker:** [github.com/evolf/dataset/issues](https://github.com/evolf/dataset/issues)
- **Documentation:** [docs.evolf.com](https://docs.evolf.com)
