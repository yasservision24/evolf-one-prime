# EvoLF API Documentation

Complete API reference for EvoLF dataset endpoints and prediction model with examples and integration guides.

---

## Table of Contents
1. [Get Paginated Dataset](#1-get-paginated-dataset)
2. [Search Dataset (Autocomplete)](#2-search-dataset-autocomplete)
3. [Download Selected Dataset Items](#3-download-selected-dataset-items)
4. [Download Complete Dataset](#4-download-complete-dataset)
5. [Prediction Model API](#5-prediction-model-api)

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
| `sortBy` | string | No | 'evolfId' | Field to sort by ('evolfId', 'receptor', 'ligand', 'species', 'class') |
| `sortOrder` | string | No | 'desc' | Sort direction ('asc' or 'desc') |
| `species` | string | No | - | **Server-side filter** by species name (e.g., 'Homo sapiens') |
| `class` | string | No | - | **Server-side filter** by GPCR class (e.g., 'Class A', 'Class B1') |
| `mutationType` | string | No | - | **Server-side filter** by mutation type (e.g., 'Wild-type', 'Point Mutation') |

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
  'evolfId',            // sort by evolf ID
  'asc',                // ascending order
  'Homo sapiens',       // filter by species
  'Class A',            // filter by GPCR class
  'Point Mutation'      // filter by mutation type
);
```

**cURL:**
```bash
# Basic request
curl "https://api.evolf.com/v1/dataset?page=1&limit=20&sortBy=evolfId&sortOrder=desc"

# With filters
curl "https://api.evolf.com/v1/dataset?page=2&limit=50&search=receptor&sortBy=evolfId&sortOrder=asc&species=Homo%20sapiens&class=Class%20A&mutationType=Point%20Mutation"
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
        'sortBy': 'evolfId',
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
        'sortBy': 'evolfId',
        'sortOrder': 'asc',
        'species': 'Homo sapiens',
        'class': 'Class A',
        'mutationType': 'Point Mutation'
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
    sortBy = "evolfId",
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
    sortBy = "evolfId",
    sortOrder = "asc",
    species = "Homo sapiens",
    class = "Class A",
    mutationType = "Point Mutation"
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
      "id": "uuid-string",
      "evolfId": "EVOLF001234",
      "receptor": "5-HT2A Receptor",
      "species": "Homo sapiens",
      "class": "Class A",
      "ligand": "Serotonin",
      "mutation": "F340A",
      "chemblId": "CHEMBL12345",
      "uniprotId": "P28223",
      "ensembleId": "ENSG00000149295"
    }
    // ... more items
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 100,
    "totalItems": 2000,
    "itemsPerPage": 20
  },
  "statistics": {
    "totalRows": 2000,
    "uniqueClasses": ["Class A", "Class B1", "Class B2", "Class C", "Class F"],
    "uniqueSpecies": ["Homo sapiens", "Mus musculus", "Rattus norvegicus"],
    "uniqueMutationTypes": ["Wild-type", "Point Mutation", "Deletion", "Insertion"]
  },
  "all_evolf_ids": ["EVOLF001234", "EVOLF001235", "..."],
  "filterOptions": {
    "classes": ["Class A", "Class B1", "Class B2", "Class C", "Class F"],
    "species": ["Homo sapiens", "Mus musculus", "Rattus norvegicus"],
    "mutationTypes": ["Wild-type", "Point Mutation", "Deletion", "Insertion"]
  }
}
```

**Important Notes:**
- `all_evolf_ids`: Contains all EvOlf IDs matching current filters (not just the current page) - useful for filtered downloads
- `statistics`: Reflects the **filtered** dataset statistics when filters are applied
- `filterOptions`: Available filter values for dropdown menus - updates based on current data
- **Server-side filtering** ensures fast performance even with large datasets

**Error Response (400/500):**
```json
{
  "error": "Invalid page number",
  "status": 400,
  "message": "Page number must be a positive integer"
}
```

---

## 2. Search Dataset (Autocomplete)

Search the dataset with autocomplete suggestions for quick lookup of receptors, ligands, species, and EvOlf IDs.

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

// Search for "human"
const response = await searchDataset('human');
console.log(response.results);
```

**cURL:**
```bash
curl "http://localhost:8000/api/search/?q=human"
```

**Python:**
```python
import requests

response = requests.get(
    'http://localhost:8000/api/search/',
    params={'q': 'human'},
    headers={'Content-Type': 'application/json'}
)
results = response.json()
```

**R:**
```r
library(httr)
library(jsonlite)

response <- GET(
  "http://localhost:8000/api/search/",
  query = list(q = "human"),
  add_headers("Content-Type" = "application/json")
)
data <- fromJSON(content(response, "text"))
```

### Response Structure

**Success Response (200):**
```json
{
  "results": [
    {
      "EvOlf_ID": "EvOlf0000008",
      "Receptor": "OR8U3",
      "Ligand": "Musk xylol",
      "Species": "Human"
    },
    {
      "EvOlf_ID": "EvOlf0000009",
      "Receptor": "OR10P1",
      "Ligand": "Musk xylol",
      "Species": "Human"
    }
  ]
}
```

**Empty Results Response (200):**
```json
{
  "results": []
}
```

### Notes
- Search is performed across EvOlf IDs, receptor names, ligands, and species
- Results are returned in order of relevance
- Typically returns a limited number of suggestions (e.g., 10-20 results)
- Empty query strings return empty results

---

## 3. Download Selected Dataset Items

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

// Download specific items
const evolfIds = ['EVOLF001234', 'EVOLF001235', 'EVOLF001236'];
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
    "evolfIds": ["EVOLF001234", "EVOLF001235", "EVOLF001236"]
  }' \
  --output evolf_selected_data.zip
```

**Python:**
```python
import requests

evolf_ids = ['EVOLF001234', 'EVOLF001235', 'EVOLF001236']

response = requests.post(
    'https://api.evolf.com/v1/dataset/export',
    json={'evolfIds': evolf_ids},
    headers={'Content-Type': 'application/json'}
)

# Save to file
with open('evolf_selected_data.zip', 'wb') as f:
    f.write(response.content)
```

**R:**
```r
library(httr)

evolf_ids <- c('EVOLF001234', 'EVOLF001235', 'EVOLF001236')

response <- POST(
  "https://api.evolf.com/v1/dataset/export",
  body = list(evolfIds = evolf_ids),
  encode = "json",
  add_headers("Content-Type" = "application/json")
)

# Save to file
writeBin(content(response, "raw"), "evolf_selected_data.zip")
```

### Response Format

**Success Response (200 OK):**
- **Content-Type:** `application/zip`
- **Body:** Binary ZIP file containing:
  - `data.csv` - Selected dataset records in CSV format
  - `metadata.json` - Export metadata (timestamp, count, IDs)
  - `README.txt` - Dataset information and column descriptions

**ZIP Contents Example:**

`data.csv`:
```csv
evolfId,receptor,species,gpcrClass,ligand,mutationType,mutationDetails,wildtypeActivity,mutantActivity,foldChange,reference,pubmedId
EVOLF001234,5-HT2A Receptor,Homo sapiens,Class A,Serotonin,Point Mutation,F340A,8.5,6.2,0.73,Smith et al. 2023,12345678
...
```

`metadata.json`:
```json
{
  "exportDate": "2024-01-15T10:30:00Z",
  "totalRecords": 3,
  "evolfIds": ["EVOLF001234", "EVOLF001235", "EVOLF001236"],
  "format": "csv",
  "version": "1.0"
}
```

**Error Response (400/500):**
```json
{
  "error": "Invalid request",
  "status": 400,
  "message": "evolfIds array is required and must not be empty"
}
```

---

## 4. Download Complete Dataset

Download the entire EvoLF dataset as a pre-generated ZIP file.

### Endpoint
```
GET /dataset/download
```

### Function Signature
```typescript
downloadCompleteDataset(): Promise<Blob>
```

### Request Parameters

None required. This endpoint returns the complete pre-generated dataset.

### Example Request

**JavaScript/TypeScript:**
```javascript
import { downloadCompleteDataset } from '@/lib/api';

// Download complete dataset
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

# Save to file
with open('evolf_complete_dataset.zip', 'wb') as f:
    f.write(response.content)

print(f"Downloaded {len(response.content)} bytes")
```

**R:**
```r
library(httr)

response <- GET(
  "https://api.evolf.com/v1/dataset/download",
  add_headers("Content-Type" = "application/json")
)

# Save to file
writeBin(content(response, "raw"), "evolf_complete_dataset.zip")

# Check file size
file.info("evolf_complete_dataset.zip")$size
```

### Response Format

**Success Response (200 OK):**
- **Content-Type:** `application/zip`
- **Content-Disposition:** `attachment; filename="evolf_complete_dataset.zip"`
- **Body:** Binary ZIP file containing:
  - `evolf_complete_data.csv` - All dataset records
  - `metadata.json` - Dataset statistics and export info
  - `README.txt` - Comprehensive dataset documentation
  - `LICENSE.txt` - Usage terms and citation requirements
  - `column_descriptions.txt` - Detailed field explanations

**ZIP Contents Example:**

`evolf_complete_data.csv`:
```csv
evolfId,receptor,species,gpcrClass,ligand,mutationType,mutationDetails,wildtypeActivity,mutantActivity,foldChange,reference,pubmedId
EVOLF000001,5-HT2A Receptor,Homo sapiens,Class A,Serotonin,Point Mutation,F340A,8.5,6.2,0.73,Smith et al. 2023,12345678
EVOLF000002,D2 Dopamine Receptor,Homo sapiens,Class A,Dopamine,Deletion,D114del,7.8,5.1,0.65,Johnson et al. 2023,87654321
...
```

`metadata.json`:
```json
{
  "exportDate": "2024-01-15T00:00:00Z",
  "totalRecords": 2000,
  "version": "1.0",
  "datasetVersion": "2024.01",
  "statistics": {
    "totalReceptors": 150,
    "totalLigands": 300,
    "totalMutations": 2000,
    "totalSpecies": 25
  },
  "lastUpdated": "2024-01-15T00:00:00Z"
}
```

**Error Response (500):**
```json
{
  "error": "Server error",
  "status": 500,
  "message": "Failed to generate or retrieve complete dataset"
}
```

---

## Error Handling

All endpoints use consistent error response format:

```typescript
{
  error: string;      // Error type
  status: number;     // HTTP status code
  message: string;    // Human-readable error description
  details?: any;      // Optional additional error context
}
```

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side issue |
| 503 | Service Unavailable - Temporary unavailability |
| 504 | Gateway Timeout - Request exceeded 30s timeout |

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
  } else {
    console.error('Unknown error:', error);
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
- **Citation:** See LICENSE.txt in complete dataset download

---

## 5. Prediction Model API

Submit GPCR-ligand binding affinity predictions using the evolf deep learning model. Predictions are processed asynchronously and results are available via job ID.

### Submit Prediction

**Endpoint:**
```
POST /predict
```

**Function Signature:**
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

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `receptor.sequence` | string | Yes | FASTA format receptor sequence |
| `receptor.name` | string | No | Optional receptor identifier |
| `ligands` | array | Yes | Array of ligand objects (max 10) |
| `ligands[].smiles` | string | Yes | SMILES notation for ligand |
| `ligands[].name` | string | No | Optional ligand identifier |

### SMILES CSV Format

For bulk ligand upload, use CSV format:

```csv
smiles,ligand_name,description
CCN1C=NC2=C1C(=O)N(C(=O)N2C)C,Caffeine,Adenosine receptor antagonist
CC(C)NCC(COC1=CC=C(C=C1)COCCOC2=CC=CC=C2)O,Propranolol,Beta-adrenergic receptor antagonist
```

**Download sample CSV:** [/samples/smiles_sample.csv](/samples/smiles_sample.csv)

### Example Request

**JavaScript/TypeScript:**
```javascript
import { submitPrediction, getPredictionJobStatus, downloadPredictionResults } from '@/lib/api';

// Submit prediction
const predictionData = {
  receptor: {
    sequence: ">A2A_HUMAN Adenosine receptor A2a\nMPIMGSSVYITVELAIAVLAILGNVLVCWAVWLNSNLQNVTNYFVVSLAAADIAVGVLAIPFAITISTGFCAACHGCLFIACFVLVLTQSSIFSLLAIAIDRYIAIRIPLRYNGLVTGTRAKGIIAICWVLSFAIGLTPMLGWNNCGQPKEGKNHSQGCGEGQVACLFEDVVPMNYMVYFNFFACVLVPLLLMLGVYLRIFLAARRQLKQMESQPLPGERARSTLQKEVHAAKSLAIIVGLFALCWLPLHIINCFTFFCPDCSHAPLWLMYLAIVLSHTNSVVNPFIYAYRIREFRQTFRKIIRSHVLRQQEPFKAAGTSARVLAAHGSDGEQVSLRLNGHPPGVWANGSAPHPERRPNGYALGLVSGGSAQESQGNTGLPDVELLSHELKGVCPEPPGLDDPLAQDGAGVS",
    name: "Adenosine A2A Receptor"
  },
  ligands: [
    {
      smiles: "CCN1C=NC2=C1C(=O)N(C(=O)N2C)C",
      name: "Caffeine"
    },
    {
      smiles: "CC(C)NCC(COC1=CC=C(C=C1)COCCOC2=CC=CC=C2)O",
      name: "Propranolol"
    }
  ]
};

const result = await submitPrediction(predictionData);
console.log('Job ID:', result.jobId);
// Save this URL to check results later
const resultUrl = `https://yoursite.com/prediction-result?job-id=${result.jobId}`;

// Check job status
const jobStatus = await getPredictionJobStatus(result.jobId);
console.log('Status:', jobStatus.status); // 'running', 'completed', or 'expired'

// Download results when completed
if (jobStatus.status === 'completed') {
  const blob = await downloadPredictionResults(result.jobId);
  // Save ZIP file
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `prediction_${result.jobId}.zip`;
  link.click();
}
```

**cURL:**
```bash
# Submit prediction
curl -X POST "https://api.evolf.com/v1/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "receptor": {
      "sequence": ">A2A_HUMAN\nMPIMGSSVYITVELAIAVLAILGNVLVCWAVWLNSNLQNVTNYFVVSLAAADIAVGVLAIPFAITISTGFCAACHGCLFIACFVLVLTQSSIFSLLAIAIDRYIAIRIPLRYNGLVTGTRAKGIIAICWVLSFAIGLTPMLGWNNCGQPKEGKNHSQGCGEGQVACLFEDVVPMNYMVYFNFFACVLVPLLLMLGVYLRIFLAARRQLKQMESQPLPGERARSTLQKEVHAAKSLAIIVGLFALCWLPLHIINCFTFFCPDCSHAPLWLMYLAIVLSHTNSVVNPFIYAYRIREFRQTFRKIIRSHVLRQQEPFKAAGTSARVLAAHGSDGEQVSLRLNGHPPGVWANGSAPHPERRPNGYALGLVSGGSAQESQGNTGLPDVELLSHELKGVCPEPPGLDDPLAQDGAGVS",
      "name": "Adenosine A2A Receptor"
    },
    "ligands": [
      {
        "smiles": "CCN1C=NC2=C1C(=O)N(C(=O)N2C)C",
        "name": "Caffeine"
      }
    ]
  }'

# Check job status
curl "https://api.evolf.com/v1/predict/job/JOB_ID_HERE"

# Download results
curl "https://api.evolf.com/v1/predict/download/JOB_ID_HERE" \
  --output prediction_results.zip
```

**Python:**
```python
import requests
import time

# Submit prediction
prediction_data = {
    "receptor": {
        "sequence": ">A2A_HUMAN Adenosine receptor A2a\nMPIMGSSVYITVELAIAVLAILGNVLVCWAVWLNSNLQNVTNYFVVSLAAADIAVGVLAIPFAITISTGFCAACHGCLFIACFVLVLTQSSIFSLLAIAIDRYIAIRIPLRYNGLVTGTRAKGIIAICWVLSFAIGLTPMLGWNNCGQPKEGKNHSQGCGEGQVACLFEDVVPMNYMVYFNFFACVLVPLLLMLGVYLRIFLAARRQLKQMESQPLPGERARSTLQKEVHAAKSLAIIVGLFALCWLPLHIINCFTFFCPDCSHAPLWLMYLAIVLSHTNSVVNPFIYAYRIREFRQTFRKIIRSHVLRQQEPFKAAGTSARVLAAHGSDGEQVSLRLNGHPPGVWANGSAPHPERRPNGYALGLVSGGSAQESQGNTGLPDVELLSHELKGVCPEPPGLDDPLAQDGAGVS",
        "name": "Adenosine A2A Receptor"
    },
    "ligands": [
        {
            "smiles": "CCN1C=NC2=C1C(=O)N(C(=O)N2C)C",
            "name": "Caffeine"
        },
        {
            "smiles": "CC(C)NCC(COC1=CC=C(C=C1)COCCOC2=CC=CC=C2)O",
            "name": "Propranolol"
        }
    ]
}

response = requests.post(
    'https://api.evolf.com/v1/predict',
    json=prediction_data,
    headers={'Content-Type': 'application/json'}
)

result = response.json()
job_id = result['jobId']
print(f"Job ID: {job_id}")
print(f"Result URL: https://yoursite.com/prediction-result?job-id={job_id}")

# Poll for completion
while True:
    status_response = requests.get(
        f'https://api.evolf.com/v1/predict/job/{job_id}',
        headers={'Content-Type': 'application/json'}
    )
    status = status_response.json()
    
    if status['status'] == 'completed':
        print("Prediction completed!")
        # Download results
        download_response = requests.get(
            f'https://api.evolf.com/v1/predict/download/{job_id}',
            headers={'Content-Type': 'application/json'}
        )
        with open(f'prediction_{job_id}.zip', 'wb') as f:
            f.write(download_response.content)
        print(f"Results saved to prediction_{job_id}.zip")
        break
    elif status['status'] == 'expired':
        print("Job expired!")
        break
    else:
        print("Still processing...")
        time.sleep(5)
```

**R:**
```r
library(httr)
library(jsonlite)

# Submit prediction
prediction_data <- list(
  receptor = list(
    sequence = ">A2A_HUMAN Adenosine receptor A2a\nMPIMGSSVYITVELAIAVLAILGNVLVCWAVWLNSNLQNVTNYFVVSLAAADIAVGVLAIPFAITISTGFCAACHGCLFIACFVLVLTQSSIFSLLAIAIDRYIAIRIPLRYNGLVTGTRAKGIIAICWVLSFAIGLTPMLGWNNCGQPKEGKNHSQGCGEGQVACLFEDVVPMNYMVYFNFFACVLVPLLLMLGVYLRIFLAARRQLKQMESQPLPGERARSTLQKEVHAAKSLAIIVGLFALCWLPLHIINCFTFFCPDCSHAPLWLMYLAIVLSHTNSVVNPFIYAYRIREFRQTFRKIIRSHVLRQQEPFKAAGTSARVLAAHGSDGEQVSLRLNGHPPGVWANGSAPHPERRPNGYALGLVSGGSAQESQGNTGLPDVELLSHELKGVCPEPPGLDDPLAQDGAGVS",
    name = "Adenosine A2A Receptor"
  ),
  ligands = list(
    list(
      smiles = "CCN1C=NC2=C1C(=O)N(C(=O)N2C)C",
      name = "Caffeine"
    )
  )
)

response <- POST(
  "https://api.evolf.com/v1/predict",
  body = prediction_data,
  encode = "json",
  add_headers("Content-Type" = "application/json")
)

result <- fromJSON(content(response, "text"))
job_id <- result$jobId
cat("Job ID:", job_id, "\n")
cat("Result URL: https://yoursite.com/prediction-result?job-id=", job_id, "\n")

# Check job status
status_response <- GET(
  paste0("https://api.evolf.com/v1/predict/job/", job_id),
  add_headers("Content-Type" = "application/json")
)
status <- fromJSON(content(status_response, "text"))

# Download results when completed
if (status$status == "completed") {
  download_response <- GET(
    paste0("https://api.evolf.com/v1/predict/download/", job_id)
  )
  writeBin(content(download_response, "raw"), paste0("prediction_", job_id, ".zip"))
}
```

### Submit Prediction Response

**Success Response (200 OK):**
```json
{
  "jobId": "pred_abc123xyz789",
  "message": "Prediction submitted successfully"
}
```

### Get Job Status

**Endpoint:**
```
GET /predict/job/:jobId
```

**Response - Running:**
```json
{
  "status": "running",
  "jobId": "pred_abc123xyz789",
  "createdAt": "2024-01-15T10:30:00Z",
  "expiresAt": "2024-01-30T10:30:00Z"
}
```

**Response - Completed:**
```json
{
  "status": "completed",
  "jobId": "pred_abc123xyz789",
  "results": {
    "ligands": [
      {
        "name": "Caffeine",
        "smiles": "CCN1C=NC2=C1C(=O)N(C(=O)N2C)C",
        "predictedAffinity": 2.45,
        "confidenceScore": 94.2,
        "affinityClass": "High"
      }
    ]
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "expiresAt": "2024-01-30T10:30:00Z"
}
```

**Response - Expired:**
```json
{
  "status": "expired",
  "jobId": "pred_abc123xyz789",
  "message": "Job has expired. Results are available for 15 days."
}
```

### Download Results

**Endpoint:**
```
GET /predict/download/:jobId
```

**Success Response (200 OK):**
- **Content-Type:** `application/zip`
- **Body:** ZIP file containing prediction results in CSV and JSON formats

**Error Response (400 Bad Request):**
```json
{
  "error": "Validation error",
  "status": 400,
  "message": "Invalid FASTA format in receptor sequence",
  "details": {
    "field": "receptor.sequence",
    "issue": "Missing header line starting with '>'"
  }
}
```

**Error Response (413 Payload Too Large):**
```json
{
  "error": "Payload too large",
  "status": 413,
  "message": "Maximum 10 ligands allowed per request",
  "details": {
    "provided": 15,
    "maximum": 10
  }
}
```

### Validation Rules

- **Receptor sequence**: Must be valid FASTA format
- **SMILES notation**: Must be chemically valid SMILES strings
- **Ligand count**: Maximum 10 ligands per request

### Job Retention

- Results are kept for **15 days** from submission
- After 15 days, jobs expire and results are no longer available
- Job URLs remain valid until expiration: `/prediction-result?job-id=YOUR_JOB_ID`

### Affinity Classification

| Class | Range (nM) | Description |
|-------|------------|-------------|
| High | < 10 | Strong binding affinity |
| Medium | 10-100 | Moderate binding affinity |
| Low | > 100 | Weak binding affinity |

---

## Changelog

### Version 1.1 (2024-01-20)
- Added prediction model endpoint
- Added SMILES CSV upload support
- Enhanced error handling and validation

### Version 1.0 (2024-01-15)
- Initial API release
- Added paginated dataset endpoint
- Added selective export functionality
- Added complete dataset download 
 