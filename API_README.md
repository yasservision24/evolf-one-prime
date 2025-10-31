# EvoLF API Documentation

Complete API reference for EvoLF dataset endpoints and prediction model with examples and integration guides.

---

## Table of Contents
1. [Get Paginated Dataset](#1-get-paginated-dataset)
2. [Download Selected Dataset Items](#2-download-selected-dataset-items)
3. [Download Complete Dataset](#3-download-complete-dataset)
4. [Prediction Model API](#4-prediction-model-api)

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
| `page` | number | No | 1 | Page number to retrieve |
| `limit` | number | No | 20 | Number of items per page |
| `search` | string | No | - | Search query for filtering results |
| `sortBy` | string | No | 'evolfId' | Field to sort by |
| `sortOrder` | string | No | 'desc' | Sort direction ('asc' or 'desc') |
| `species` | string | No | - | Filter by species name |
| `classFilter` | string | No | - | Filter by GPCR class |
| `mutationType` | string | No | - | Filter by mutation type |

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
      "gpcrClass": "Class A",
      "ligand": "Serotonin",
      "mutationType": "Point Mutation",
      "mutationDetails": "F340A",
      "wildtypeActivity": 8.5,
      "mutantActivity": 6.2,
      "foldChange": 0.73,
      "reference": "Smith et al. 2023",
      "pubmedId": "12345678",
      "createdAt": "2024-01-15T10:30:00Z"
    }
    // ... more items
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 100,
    "totalItems": 2000,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "statistics": {
    "totalReceptors": 150,
    "totalLigands": 300,
    "totalMutations": 2000,
    "totalSpecies": 25
  }
}
```

**Error Response (400/500):**
```json
{
  "error": "Invalid page number",
  "status": 400,
  "message": "Page number must be a positive integer"
}
```

---

## 2. Download Selected Dataset Items

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

## 3. Download Complete Dataset

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

## 4. Prediction Model API

Submit GPCR-ligand binding affinity predictions using the evolf deep learning model.

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
  mutation?: string;
})
```

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `receptor.sequence` | string | Yes | FASTA format receptor sequence |
| `receptor.name` | string | No | Optional receptor identifier |
| `ligands` | array | Yes | Array of ligand objects (max 10) |
| `ligands[].smiles` | string | Yes | SMILES notation for ligand |
| `ligands[].name` | string | No | Optional ligand identifier |
| `mutation` | string | No | Point mutation (e.g., "L249A") |

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
import { submitPrediction } from '@/lib/api';

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
  ],
  mutation: "L249A"
};

const result = await submitPrediction(predictionData);
console.log('Prediction results:', result);
```

**cURL:**
```bash
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
```

**Python:**
```python
import requests

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
    ],
    "mutation": "L249A"
}

response = requests.post(
    'https://api.evolf.com/v1/predict',
    json=prediction_data,
    headers={'Content-Type': 'application/json'}
)

result = response.json()
print(f"Prediction ID: {result['predictionId']}")
print(f"Processing time: {result['processingTime']}s")
for pred in result['results']:
    print(f"{pred['ligandName']}: {pred['predictedAffinity']} nM (confidence: {pred['confidenceScore']}%)")
```

**R:**
```r
library(httr)
library(jsonlite)

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
  ),
  mutation = "L249A"
)

response <- POST(
  "https://api.evolf.com/v1/predict",
  body = prediction_data,
  encode = "json",
  add_headers("Content-Type" = "application/json")
)

result <- fromJSON(content(response, "text"))
print(result$results)
```

### Response Format

**Success Response (200 OK):**
```json
{
  "predictionId": "pred_abc123xyz789",
  "results": [
    {
      "ligandIndex": 0,
      "ligandName": "Caffeine",
      "smiles": "CCN1C=NC2=C1C(=O)N(C(=O)N2C)C",
      "predictedAffinity": 2.45,
      "confidenceScore": 94.2,
      "affinityClass": "High"
    },
    {
      "ligandIndex": 1,
      "ligandName": "Propranolol",
      "smiles": "CC(C)NCC(COC1=CC=C(C=C1)COCCOC2=CC=CC=C2)O",
      "predictedAffinity": 15.8,
      "confidenceScore": 87.5,
      "affinityClass": "Medium"
    }
  ],
  "modelInfo": {
    "version": "evolf-v2.1",
    "trainingSetSize": 10234,
    "performanceMetrics": {
      "r2": 0.89,
      "rmse": 0.65
    }
  },
  "processingTime": 1.8,
  "mutation": "L249A"
}
```

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
- **Mutation format**: Must match pattern `[A-Z]\d+[A-Z]` (e.g., "L249A")

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
 