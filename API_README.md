# EvOlf API Documentation

Complete REST API reference for the EvOlf platform with detailed examples in multiple programming languages.

---

## Table of Contents

1. [Base Configuration](#base-configuration)
2. [Dataset Endpoints](#dataset-endpoints)
   - [Get Paginated Dataset](#1-get-paginated-dataset)
   - [Get Dataset Details](#2-get-dataset-details)
   - [Export Multiple Entries](#3-export-multiple-entries)
   - [Export Single Entry](#4-export-single-entry)
   - [Download Complete Dataset](#5-download-complete-dataset)
3. [Search Endpoints](#search-endpoints)
   - [ElasticSearch Query](#elasticsearch-query)
4. [Prediction Endpoints](#prediction-endpoints)
   - [Submit SMILES Prediction](#1-submit-smiles-prediction)
   - [Get Job Status](#2-get-job-status)
   - [Download Job Results](#3-download-job-results)
5. [Error Handling](#error-handling)

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

// Using the API client
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

**Field Descriptions**:
- `data`: Array of dataset entries matching filters
- `pagination`: Pagination metadata (currentPage, totalPages, totalItems, itemsPerPage)
- `statistics`: Overall dataset statistics reflecting current filters
- `filterOptions`: Available filter values for dropdown menus
- `all_evolf_ids`: All EvOlf IDs matching current filters (useful for bulk exports)

**Search Implementation**:
- Primary: ElasticSearch with wildcard matching on Receptor, Ligand, Species
- Fallback: PostgreSQL trigram similarity search (similarity > 0.2)
- Results maintain relevance ordering from ElasticSearch

---

### 2. Get Dataset Details

Fetch complete details for a specific EvOlf entry including sequences, structures, and experimental data.

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

**JavaScript/TypeScript**:
```javascript
// Using fetch
const response = await fetch('https://evolf.ahujalab.iiitd.edu.in/api/dataset/details/EvOlf0100001', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
});
const details = await response.json();

// Using API client
import { fetchDatasetDetail } from '@/lib/api';
const details = await fetchDatasetDetail('EvOlf0100001');
console.log('Receptor:', details.receptor);
console.log('Sequence:', details.sequence);
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

**R**:
```r
library(httr)
library(jsonlite)

response <- GET(
  "https://evolf.ahujalab.iiitd.edu.in/api/dataset/details/EvOlf0100001",
  add_headers("Content-Type" = "application/json")
)
details <- fromJSON(content(response, "text"))
cat("Receptor:", details$receptor, "\n")
cat("Ligand:", details$ligand, "\n")
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
  "uniprotLink": "httpss://www.uniprot.org/uniprotkb/P14416",
  "chemblId": "CHEMBL228",
  "cid": "681",
  "pubchemId": "681",
  "pubchemLink": "httpss://pubchem.ncbi.nlm.nih.gov/compound/681",
  "smiles": "NCCc1ccc(O)c(O)c1",
  "inchi": "InChI=1S/C8H11NO2/c9-4-3-6-1-2-7(10)8(11)5-6/h1-2,5,10-11H,3-4,9H2",
  "inchiKey": "VYFYYTLLBUKUHU-UHFFFAOYSA-N",
  "iupacName": "4-(2-aminoethyl)benzene-1,2-diol",
  "sequence": "MDPLNLSWYDDDLERQNWSRPFNGSDGKADRPPYNYYATLLTLLIAVIVFGNVLVCMAVSREKALQTTTNYLIVSLAVADLLVATLVMPWVVYLEVVGEWKFSRIHCDIFVTLDVMMCTASILNLCAISIDRYTAVAMPMLYNT...",
  "pdbData": "ATOM      1  N   MET A   1     -12.345   8.901  23.456...",
  "sdfData": "\n  Mrv0541...",
  "structure2d": "httpss://pubchem.ncbi.nlm.nih.gov/image/imagefly.cgi?cid=681&width=300&height=300",
  "image": "httpss://pubchem.ncbi.nlm.nih.gov/image/imagefly.cgi?cid=681&width=300&height=300",
  "structure3d": "https://evolf.ahujalab.iiitd.edu.in/media/pdb_files/EvOlf0100001.pdb",
  "expressionSystem": "HEK293",
  "parameter": "Ki",
  "value": "2.1",
  "unit": "nM",
  "comments": "High affinity binding measured at 25°C",
  "geneSymbol": "DRD2",
  "source": "12345678",
  "sourceLinks": "httpss://pubmed.ncbi.nlm.nih.gov/12345678/"
}
```

**Field Descriptions**:
- **Identifiers**: `evolfId`, `uniprotId`, `chemblId`, `cid`, `pubchemId`
- **Names**: `receptor`, `ligand`, `receptorSubtype`, `geneSymbol`
- **Taxonomy**: `species`, `class`
- **Mutation**: `mutation`, `mutationStatus`, `mutationType`, `mutationImpact`
- **Sequences**: `sequence` (protein sequence), `smiles`, `inchi`, `inchiKey`, `iupacName`
- **Structures**: `pdbData` (3D protein structure), `sdfData` (3D ligand structure), `structure2d`, `structure3d`
- **External Links**: `uniprotLink`, `pubchemLink`, `sourceLinks` (pipe-delimited PubMed URLs)
- **Experimental**: `expressionSystem`, `parameter`, `value`, `unit`, `comments`
- **References**: `source` (PubMed IDs), `sourceLinks` (full URLs)

**Notes**:
- Empty strings or `"nan"` indicate missing data
- `sourceLinks` supports multiple pipe-delimited URLs: `"url1 | url2 | url3"`
- `structure3d` points to PDB file for 3D molecular visualization
- `pdbData` and `sdfData` contain complete file contents for offline use

**Error (404 Not Found)**:
```json
{
  "error": "Entry not found",
  "message": "No record with EvOlf ID: EvOlf0100001"
}
```

---

### 3. Export Dataset by Filters

Export filtered dataset entries as a ZIP file containing CSV data and metadata. This endpoint re-runs the filtered query on the server to avoid sending large lists of IDs (which can exceed 100MB with 100,000+ records).

#### Endpoint
```
POST /dataset/export
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `search` | string | No | Search term to filter results |
| `species` | string | No | Filter by species (e.g., 'Human', 'Mouse') |
| `class` | string | No | Filter by GPCR class (e.g., '0', '1') |
| `mutationType` | string | No | Filter by mutation status (e.g., 'Wild type', 'Mutant') |
| `sortBy` | string | No | Field to sort by: `EvOlf_ID`, `Receptor`, `Ligand`, `Species`, `Class`, `Mutation` |
| `sortOrder` | string | No | Sort direction: `asc` or `desc` |

**Example Request Body**:
```json
{
  "search": "dopamine",
  "species": "Human",
  "class": "1",
  "mutationType": "Wild type",
  "sortBy": "Receptor",
  "sortOrder": "asc"
}
```

#### Examples

**cURL**:
```bash
# Export all Human entries with class 1
curl -X POST "https://evolf.ahujalab.iiitd.edu.in/api/dataset/export" \
  -H "Content-Type: application/json" \
  -d '{"species": "Human", "class": "1"}' \
  --output filtered_export.zip

# Export with search term
curl -X POST "https://evolf.ahujalab.iiitd.edu.in/api/dataset/export" \
  -H "Content-Type: application/json" \
  -d '{"search": "dopamine", "sortBy": "Receptor", "sortOrder": "asc"}' \
  --output dopamine_export.zip

# Export entire dataset (no filters)
curl -X POST "https://evolf.ahujalab.iiitd.edu.in/api/dataset/export" \
  -H "Content-Type: application/json" \
  -d '{}' \
  --output complete_export.zip
```

**JavaScript/TypeScript**:
```javascript
// Using the API client
import { downloadDatasetByFilters } from '@/lib/api';

// Export with filters
const blob = await downloadDatasetByFilters({
  search: 'dopamine',
  species: 'Human',
  classFilter: '1',
  mutationType: 'Wild type',
  sortBy: 'Receptor',
  sortOrder: 'asc'
});

// Create download link
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'dataset_export.zip';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
window.URL.revokeObjectURL(url);

// Using fetch directly
const response = await fetch('https://evolf.ahujalab.iiitd.edu.in/api/dataset/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    species: 'Human',
    class: '1'
  })
});
const blob = await response.blob();
```

**Python**:
```python
import requests

# Export with filters
response = requests.post(
    'https://evolf.ahujalab.iiitd.edu.in/api/dataset/export',
    json={
        'search': 'dopamine',
        'species': 'Human',
        'class': '1',
        'mutationType': 'Wild type',
        'sortBy': 'Receptor',
        'sortOrder': 'asc'
    },
    headers={'Content-Type': 'application/json'},
    timeout=300  # 5 minute timeout for large exports
)

with open('filtered_export.zip', 'wb') as f:
    f.write(response.content)

print(f"Downloaded {len(response.content)} bytes")

# Export entire dataset
response = requests.post(
    'https://evolf.ahujalab.iiitd.edu.in/api/dataset/export',
    json={},
    headers={'Content-Type': 'application/json'},
    timeout=600  # 10 minute timeout for complete dataset
)

with open('complete_dataset.zip', 'wb') as f:
    f.write(response.content)
```

**R**:
```r
library(httr)

# Export with filters
response <- POST(
  "https://evolf.ahujalab.iiitd.edu.in/api/dataset/export",
  body = list(
    species = "Human",
    class = "1",
    mutationType = "Wild type"
  ),
  encode = "json",
  add_headers("Content-Type" = "application/json"),
  timeout(300)  # 5 minute timeout
)

writeBin(content(response, "raw"), "filtered_export.zip")
```

#### Response

**Success (200 OK)**:
- Content-Type: `application/zip`
- Content-Disposition: `attachment; filename=evolf_filtered_export.zip`
- Body: Binary ZIP file

**ZIP Contents**:
- `data.csv`: CSV file with columns: EvOlf_ID, Receptor, Species, Class, Ligand, Mutation_Status, Mutation, ChEMBL_ID, UniProt_ID, CID
- `metadata.json`: Export metadata (exportDate, totalRecords, filters, format, version)
- `README.txt`: Description of export contents

**Important Notes**:
- For large exports (100,000+ records), set a timeout of at least 5 minutes
- The server re-runs the filtered query, so results match what you see in the UI with the same filters
- Empty filter object `{}` exports the entire dataset

**Error (404 Not Found)**:
```json
{
  "error": "No records found for given filters"
}
```

---

### 4. Export Single Entry

Export a single dataset entry as a ZIP file.

#### Endpoint
```
GET /dataset/export/{evolfId}
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `evolfId` | string | Yes | EvOlf identifier |

#### Examples

**cURL**:
```bash
curl "https://evolf.ahujalab.iiitd.edu.in/api/dataset/export/EvOlf0100001" \
  --output single_entry.zip
```

**JavaScript/TypeScript**:
```javascript
import { downloadDatasetByEvolfId } from '@/lib/api';

const blob = await downloadDatasetByEvolfId('EvOlf0100001');
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'EvOlf0100001.zip';
a.click();
window.URL.revokeObjectURL(url);
```

**Python**:
```python
import requests

response = requests.get(
    'https://evolf.ahujalab.iiitd.edu.in/api/dataset/export/EvOlf0100001',
    headers={'Content-Type': 'application/json'}
)

with open('EvOlf0100001.zip', 'wb') as f:
    f.write(response.content)
```

#### Response

**Success (200 OK)**:
- Content-Type: `application/zip`
- Content-Disposition: `attachment; filename=EvOlf0100001_files.zip`
- Body: Binary ZIP file containing PDB, SDF, PNG files (if available)

**Error (404 Not Found)**:
```json
{
  "error": "No files found for this EvOlf ID"
}
```

---

### 5. Download Complete Dataset

Download the entire EvOlf database as a cached ZIP file.

#### Endpoint
```
GET /dataset/download
```

#### Examples

**cURL**:
```bash
curl "https://evolf.ahujalab.iiitd.edu.in/api/dataset/download" \
  --output evolf_complete_dataset.zip
```

**JavaScript/TypeScript**:
```javascript
import { downloadCompleteDataset } from '@/lib/api';

const blob = await downloadCompleteDataset();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'evolf_complete_dataset.zip';
a.click();
window.URL.revokeObjectURL(url);
```

**Python**:
```python
import requests

response = requests.get(
    'https://evolf.ahujalab.iiitd.edu.in/api/dataset/download',
    headers={'Content-Type': 'application/json'}
)

with open('evolf_complete_dataset.zip', 'wb') as f:
    f.write(response.content)

print(f"Downloaded {len(response.content)} bytes")
```

**R**:
```r
library(httr)

response <- GET(
  "https://evolf.ahujalab.iiitd.edu.in/api/dataset/download",
  add_headers("Content-Type" = "application/json")
)

writeBin(content(response, "raw"), "evolf_complete_dataset.zip")
```

#### Response

**Success (200 OK)**:
- Content-Type: `application/zip`
- Content-Disposition: `attachment; filename=evolf_complete_dataset.zip`
- Body: Binary ZIP file (may be 100MB+)

**ZIP Contents**:
- `evolf_complete_data.csv`: Complete dataset
- `metadata.json`: Export information
- `README.txt`: Dataset description

**Performance Note**: 
- First request generates and caches the ZIP file
- Subsequent requests serve the cached file for fast download
- Cache updates when database is modified

---

## Search Endpoints

### ElasticSearch Query

Perform full-text search across all dataset fields using ElasticSearch with PostgreSQL fallback.

#### Endpoint
```
GET /search/?q={query}
```

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query string |

#### Examples

**cURL**:
```bash
curl "https://evolf.ahujalab.iiitd.edu.in/api/search/?q=dopamine"
```

**JavaScript/TypeScript**:
```javascript
import { searchDataset } from '@/lib/api';

const results = await searchDataset('dopamine');
console.log(results.results);
```

**Python**:
```python
import requests

response = requests.get(
    'https://evolf.ahujalab.iiitd.edu.in/api/search/',
    params={'q': 'dopamine'},
    headers={'Content-Type': 'application/json'}
)

results = response.json()
for item in results['results']:
    print(f"{item['EvOlf_ID']}: {item['Receptor']} - {item['Ligand']}")
```

**R**:
```r
library(httr)
library(jsonlite)

response <- GET(
  "https://evolf.ahujalab.iiitd.edu.in/api/search/",
  query = list(q = "dopamine"),
  add_headers("Content-Type" = "application/json")
)

results <- fromJSON(content(response, "text"))
print(results$results)
```

#### Response Format

**Success (200 OK)**:
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
    },
    {
      "EvOlf_ID": "EvOlf0100046",
      "Receptor": "Dopamine D1 receptor",
      "Ligand": "Dopamine",
      "Species": "Human",
      "Class": "1",
      "Mutation": "Wild-type",
      "score": 0.92
    }
  ]
}
```

**Search Features**:
- **Primary Engine**: ElasticSearch with wildcard matching
  - Searches: Receptor, Ligand, Species fields
  - Case-insensitive matching
  - Relevance scoring
- **Fallback**: PostgreSQL trigram similarity (if ElasticSearch unavailable)
  - Minimum similarity threshold: 0.2
  - Searches Receptor field primarily
- **Performance**: Results limited to top matches by relevance

---

## Prediction Endpoints

### 1. Submit SMILES Prediction

Submit a ligand SMILES string for binding affinity prediction.

#### Endpoint
```
POST /predict/smiles/
```

#### Request Body

```json
{
  "smiles": "NCCc1c[nH]c2ccc(O)cc12",
  "sequence": "MDVLSPGQGNNTTSPPAPFET...",
  "temp_ligand_id": "ligand_001",
  "temp_rec_id": "receptor_001",
  "id": "custom_job_id"
}
```

**Field Descriptions**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `smiles` | string | **Yes** | SMILES notation of ligand (no whitespace, valid SMILES characters) |
| `sequence` | string | No | Receptor protein sequence (amino acid single-letter codes, no FASTA header) |
| `mutated_sequence` | string | No | Alternative field name for receptor sequence |
| `temp_ligand_id` | string | No | Temporary ligand identifier (default: auto-generated) |
| `temp_rec_id` | string | No | Temporary receptor identifier (default: auto-generated) |
| `id` | string | No | Custom job ID (default: auto-generated) |

**Validation Rules**:
- SMILES: No whitespace, valid characters: `A-Za-z0-9@+-[]()=#/\%.:\*`
- Sequence: No whitespace, no FASTA headers (no `>`), valid amino acids only
- No file uploads allowed (JSON/form fields only)
- No array values allowed

#### Examples

**cURL**:
```bash
curl -X POST "https://evolf.ahujalab.iiitd.edu.in/api/predict/smiles/" \
  -H "Content-Type: application/json" \
  -d '{
    "smiles": "NCCc1c[nH]c2ccc(O)cc12",
    "sequence": "MDVLSPGQGNNTTSPPAPFETGGNTTGISDVTFSYQVITSLLLGTLIFCAVLGN",
    "temp_ligand_id": "serotonin",
    "temp_rec_id": "5ht1a"
  }'
```

**JavaScript/TypeScript**:
```javascript
import { submitPrediction } from '@/lib/api';

const result = await submitPrediction({
  smiles: 'NCCc1c[nH]c2ccc(O)cc12',
  sequence: 'MDVLSPGQGNNTTSPPAPFETGGNTTGISDVTFSYQVITSLLLGTLIFCAVLGN',
  temp_ligand_id: 'serotonin',
  temp_rec_id: '5ht1a'
});

console.log('Job ID:', result.job_id);
```

**Python**:
```python
import requests

response = requests.post(
    'https://evolf.ahujalab.iiitd.edu.in/api/predict/smiles/',
    json={
        'smiles': 'NCCc1c[nH]c2ccc(O)cc12',
        'sequence': 'MDVLSPGQGNNTTSPPAPFETGGNTTGISDVTFSYQVITSLLLGTLIFCAVLGN',
        'temp_ligand_id': 'serotonin',
        'temp_rec_id': '5ht1a'
    },
    headers={'Content-Type': 'application/json'}
)

result = response.json()
print(f"Job ID: {result['job_id']}")
print(f"Message: {result['message']}")
```

**R**:
```r
library(httr)
library(jsonlite)

response <- POST(
  "https://evolf.ahujalab.iiitd.edu.in/api/predict/smiles/",
  body = list(
    smiles = "NCCc1c[nH]c2ccc(O)cc12",
    sequence = "MDVLSPGQGNNTTSPPAPFETGGNTTGISDVTFSYQVITSLLLGTLIFCAVLGN",
    temp_ligand_id = "serotonin",
    temp_rec_id = "5ht1a"
  ),
  encode = "json",
  add_headers("Content-Type" = "application/json")
)

result <- fromJSON(content(response, "text"))
cat("Job ID:", result$job_id, "\n")
```

#### Response Format

**Success (200 OK)**:
```json
{
  "job_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "message": "Job submitted to pipeline asynchronously."
}
```

**Error Responses**:

**400 Bad Request** - Invalid SMILES:
```json
{
  "error": "'smiles' is required."
}
```

**400 Bad Request** - SMILES with whitespace:
```json
{
  "error": "SMILES contains whitespace."
}
```

**400 Bad Request** - Invalid sequence:
```json
{
  "error": "Invalid amino-acid letters in sequence."
}
```

**400 Bad Request** - File upload attempted:
```json
{
  "error": "File uploads are not allowed. Send JSON or form fields (no files)."
}
```

**Implementation Details**:
- Job ID is a UUID v4
- CSV file created with columns: `ID`, `Temp_Ligand_ID`, `SMILES`, `Mutated_Sequence`, `TempRecID`
- Saved to: `{JOB_DATA_DIR}/{job_id}/{job_id}.csv`
- Submitted asynchronously to prediction pipeline
- Pipeline URL: `{PREDICT_DOCKER_URL}/pipeline/run`

---

### 2. Get Job Status

Check the status of a submitted prediction job.

#### Endpoint
```
GET /predict/job/{job_id}/
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `job_id` | string | Yes | Job UUID returned from submission |

#### Query Parameters (Optional)

| Parameter | Type | Description |
|-----------|------|-------------|
| `download` | string | Set to `"output"` to download results as ZIP |

#### Examples

**cURL**:
```bash
# Check status
curl "https://evolf.ahujalab.iiitd.edu.in/api/predict/job/a1b2c3d4-e5f6-7890-abcd-ef1234567890/"

# Download results
curl "https://evolf.ahujalab.iiitd.edu.in/api/predict/job/a1b2c3d4-e5f6-7890-abcd-ef1234567890/?download=output" \
  --output results.zip
```

**JavaScript/TypeScript**:
```javascript
import { getPredictionJobStatus } from '@/lib/api';

// Check status
const status = await getPredictionJobStatus('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
console.log('Status:', status.status);

if (status.status === 'completed') {
  console.log('Output files:', status.output_files);
}
```

**Python**:
```python
import requests
import time

job_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

# Poll for status
while True:
    response = requests.get(
        f'https://evolf.ahujalab.iiitd.edu.in/api/predict/job/{job_id}/',
        headers={'Content-Type': 'application/json'}
    )
    
    status = response.json()
    print(f"Status: {status['status']}")
    
    if status['status'] == 'finished':
        print(f"Output files: {status['output_files']}")
        break
    elif status['status'] == 'processing':
        print("Job still running, waiting 10 seconds...")
        time.sleep(10)
    else:
        break
```

**R**:
```r
library(httr)
library(jsonlite)

job_id <- "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

response <- GET(
  paste0("https://evolf.ahujalab.iiitd.edu.in/api/predict/job/", job_id, "/"),
  add_headers("Content-Type" = "application/json")
)

status <- fromJSON(content(response, "text"))
cat("Status:", status$status, "\n")
```

#### Response Formats

**Job Running (200 OK)**:
```json
{
  "status": "processing",
  "message": "Job started but no output files yet"
}
```

**Job Completed (200 OK)**:
```json
{
  "job_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "finished",
  "output_files": [
    "output/Receptor_Embeddings.csv",
    "output/Prediction_Output.csv",
    "output/LR_Pair_Embeddings.csv",
    "output/Ligand_Embeddings.csv"
  ],
  "predictions": [
    {
      "id": "1",
      "temp_ligand_id": "serotonin",
      "smiles": "NCCc1c[nH]c2ccc(O)cc12",
      "mutated_sequence": "MDVLSPGQGNNTTSPPAPFETGGNTTGISDVTFSYQVITSLLLGTLIFCAVLGN",
      "temp_rec_id": "5ht1a",
      "predicted_label": "Agonist (1)",
      "p1": "0.85"
    }
  ]
}
```

**Job Not Found (404 Not Found)**:
```json
{
  "error": "Job not not found"
}
```

**Status Values**:
- `processing`: Job submitted but no output files yet
- `finished`: Job completed with output files available

---

### 3. Download Job Results

Download prediction results as a ZIP file.

#### Endpoint
```
GET /predict/job/{job_id}/?download=output
```

Or alternative endpoint:
```
GET /predict/download/{job_id}/
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `job_id` | string | Yes | Job UUID |

#### Examples

**cURL**:
```bash
# Method 1
curl "https://evolf.ahujalab.iiitd.edu.in/api/predict/job/a1b2c3d4-e5f6-7890-abcd-ef1234567890/?download=output" \
  --output prediction_results.zip

# Method 2
curl "https://evolf.ahujalab.iiitd.edu.in/api/predict/download/a1b2c3d4-e5f6-7890-abcd-ef1234567890/" \
  --output prediction_results.zip
```

**JavaScript/TypeScript**:
```javascript
import { downloadPredictionResults } from '@/lib/api';

const blob = await downloadPredictionResults('a1b2c3d4-e5f6-7890-abcd-ef1234567890');

// Create download link
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'prediction_results.zip';
a.click();
window.URL.revokeObjectURL(url);
```

**Python**:
```python
import requests

job_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

# Method 1: Using query parameter
response = requests.get(
    f'https://evolf.ahujalab.iiitd.edu.in/api/predict/job/{job_id}/',
    params={'download': 'output'}
)

with open('prediction_results.zip', 'wb') as f:
    f.write(response.content)

# Method 2: Using dedicated download endpoint
response = requests.get(
    f'https://evolf.ahujalab.iiitd.edu.in/api/predict/download/{job_id}/'
)

with open('prediction_results.zip', 'wb') as f:
    f.write(response.content)
```

**R**:
```r
library(httr)

job_id <- "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

response <- GET(
  paste0("https://evolf.ahujalab.iiitd.edu.in/api/predict/job/", job_id, "/"),
  query = list(download = "output")
)

writeBin(content(response, "raw"), "prediction_results.zip")
```

#### Response

**Success (200 OK)**:
- Content-Type: `application/zip`
- Content-Disposition: `attachment; filename={job_id}_output.zip`
- Body: Binary ZIP file containing all output files

**ZIP Contents** (typical):
- `output/predictions.csv`: Prediction results
- `output/visualization.png`: Result visualizations
- `output/summary.json`: Summary statistics
- Additional files depending on pipeline configuration

**Error (404 Not Found)**:
```json
{
  "error": "Output not found for job"
}
```

---

## Error Handling

All API endpoints follow consistent error response formats.

### Error Response Structure

```json
{
  "error": "Brief error description",
  "message": "Detailed error message (optional)",
  "status": 400
}
```

### https Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid parameters, malformed data |
| 404 | Not Found | Resource doesn't exist (EvOlf ID, job ID) |
| 500 | Internal Server Error | Server-side errors, database issues |

### Common Error Scenarios

#### 1. Invalid EvOlf ID
```bash
curl "https://evolf.ahujalab.iiitd.edu.in/api/dataset/details/InvalidID"
```
**Response (404)**:
```json
{
  "error": "Entry not found",
  "message": "No record with EvOlf ID: InvalidID"
}
```

#### 2. Invalid SMILES Format
```bash
curl -X POST "https://evolf.ahujalab.iiitd.edu.in/api/predict/smiles/" \
  -H "Content-Type: application/json" \
  -d '{"smiles": "invalid smiles"}'
```
**Response (400)**:
```json
{
  "error": "SMILES contains whitespace."
}
```

#### 3. Job Not Found
```bash
curl "https://evolf.ahujalab.iiitd.edu.in/api/predict/job/nonexistent-job-id/"
```
**Response (404)**:
```json
{
  "error": "Job not not found"
}
```

#### 4. No Records Match Filters
```bash
curl -X POST "https://evolf.ahujalab.iiitd.edu.in/api/dataset/export" \
  -H "Content-Type: application/json" \
  -d '{"species": "NonexistentSpecies"}'
```
**Response (404)**:
```json
{
  "error": "No records found for given filters or IDs"
}
```

### Error Handling Best Practices

**JavaScript/TypeScript**:
```javascript
try {
  const data = await fetchDatasetDetail('EvOlf0100001');
  console.log(data);
} catch (error) {
  if (error.status === 404) {
    console.error('Entry not found');
  } else if (error.status === 500) {
    console.error('Server error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

**Python**:
```python
import requests

try:
    response = requests.get('https://evolf.ahujalab.iiitd.edu.in/api/dataset/details/EvOlf0100001')
    response.raise_for_status()
    data = response.json()
except requests.exceptions.httpsError as e:
    if e.response.status_code == 404:
        print("Entry not found")
    elif e.response.status_code == 500:
        print(f"Server error: {e.response.json().get('message')}")
except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
```

---

## API Client Libraries

### JavaScript/TypeScript

Full API client available at `src/lib/api.ts`:

```typescript
import {
  fetchDatasetPaginated,
  fetchDatasetDetail,
  downloadDatasetByIds,
  downloadDatasetByEvolfId,
  downloadCompleteDataset,
  submitPrediction,
  getPredictionJobStatus,
  downloadPredictionResults,
  searchDataset
} from '@/lib/api';
```

### Rate Limiting

Currently no rate limiting is enforced. For production use, implement:
- Request throttling on client side
- Caching for repeated requests
- Batch requests where possible

### Timeout Configuration

Default timeout: 30 seconds

To modify (JavaScript):
```javascript
export const API_CONFIG = {
  BASE_URL: 'https://evolf.ahujalab.iiitd.edu.in/api',
  TIMEOUT: 60000, // 60 seconds
  HEADERS: { 'Content-Type': 'application/json' }
};
```

---

## Support

For API issues or questions:
- **Documentation**: See `final_readme.md` for complete platform documentation
- **GitHub**: [Repository URL]
- **Email**: [Contact email]

---

**Version**: 1.0  
**Last Updated**: 2025  
**Base URL**: Configurable via `VITE_API_BASE_URL` environment variable
