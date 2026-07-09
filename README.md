# GrowEasy CRM Importer

An intelligent, AI-powered CSV importer for CRM leads. It maps messy, unstructured CSV data into strict CRM schemas using Google's Gemini AI, handling duplicates, missing fields, and varied formats seamlessly.

## 🚀 Features

- **AI-Powered Extraction**: Uses Gemini to map unpredictable column names (e.g. "Location") to strict schema fields (e.g. "city", "state").
- **Drag & Drop Upload**: A smooth, native drag-and-drop interface for uploading CSV files.
- **Incremental Streaming**: Processes files in batches with a real-time progress bar.
- **Virtualized Tables**: Uses `react-window` to smoothly render thousands of rows without browser lag.
- **Smart Retries & Failsafes**: Built-in exponential backoff for Google API rate limits (429), with programmatic parsing fallbacks.
- **Dark Mode**: Beautiful, system-aware light and dark mode toggling.
- **Full Test Coverage**: API tests implemented using `jest` and `supertest`.
- **Dockerized**: Easy to run locally using Docker Compose.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Lucide Icons, react-window, PapaParse
- **Backend**: Node.js, Express, @google/genai SDK
- **Testing**: Jest, Supertest
- **DevOps**: Docker, Vercel, Render

## ⚙️ Local Setup

1. **Clone the repository** and navigate to the project root.
2. **Setup Backend**:
   - Navigate to `cd backend`
   - Create a `.env` file and add:
     ```env
     PORT=5000
     GEMINI_API_KEY=your_gemini_api_key_here
     ```
   - Install dependencies: `npm install`
   - Run server: `npm start`
3. **Setup Frontend**:
   - Navigate to `cd frontend`
   - Create a `.env.local` file and add:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:5000
     ```
   - Install dependencies: `npm install`
   - Run development server: `npm run dev`
4. **Access the Application**: Open [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Setup

You can run the entire stack with a single command using Docker Compose:
```bash
docker-compose up --build
```
This will start both the Node.js API and the Next.js frontend in isolated containers.

## 🚀 Deployment

- **Frontend**: Ready for deployment to [Vercel](https://vercel.com/) via the included `vercel.json` configuration.
- **Backend**: Ready for deployment to [Render](https://render.com/) or Railway via the included `render.yaml` specification.

## 🧪 Testing

To run the backend unit tests:
```bash
cd backend
npm test
```
