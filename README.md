# EvoLF - GPCR Dataset & Prediction Platform

## Project info

**URL**: https://lovable.dev/projects/95c100a9-7c19-4503-ab16-4fb4d9b4282f

## About EvoLF

EvoLF is a comprehensive web platform for exploring GPCR (G Protein-Coupled Receptor) datasets and making binding affinity predictions. The platform provides:

- **Dataset Browser**: Explore and filter comprehensive GPCR interaction data
- **Detail Pages**: View detailed receptor, ligand, and interaction information
- **3D Molecular Visualization**: Interactive PDB and SDF structure viewers
- **Prediction Model**: Submit receptor-ligand pairs for affinity predictions
- **Data Export**: Download dataset entries individually or in bulk

## Key Features

### Dataset Pages
- `/dataset/dashboard` - Browse paginated dataset with advanced filters
- `/dataset/detail?evolfid=X` - Overview of a specific entry
- `/dataset/receptor?evolfid=X` - Receptor details with FASTA sequence and 3D PDB viewer
- `/dataset/ligand?evolfid=X` - Ligand details with SMILES and 3D SDF viewer
- `/dataset/interaction?evolfid=X` - Interaction data and experimental parameters
- `/dataset/structures?evolfid=X` - 3D structure visualization

### API Integration
All dataset pages fetch data from the backend API:
- `GET /api/dataset/details/:evolfId` - Get complete entry details
- `GET /api/dataset/export/:evolfId` - Export single entry as ZIP
- `POST /api/dataset/export` - Export multiple entries as ZIP

See [API_README.md](./API_README.md) for complete API documentation.

## Technologies

This project is built with:

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn-ui, Tailwind CSS
- **3D Visualization**: 3Dmol.js for molecular structures
- **Routing**: React Router
- **API Integration**: REST API with fetch

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/95c100a9-7c19-4503-ab16-4fb4d9b4282f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/95c100a9-7c19-4503-ab16-4fb4d9b4282f) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
