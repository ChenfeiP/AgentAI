# Agent AI

A full-stack AI chat app that answers questions in two ways: **RAG over uploaded PDFs** and **live web search via MCP**. The frontend also supports voice input and text-to-speech in Chat Mode.

## Live Demo

Deployed on AWS Amplify: [https://full-version.d14wnj5ihlfkwk.amplifyapp.com/](https://full-version.d14wnj5ihlfkwk.amplifyapp.com/)

> The Amplify deployment hosts the React frontend only. PDF upload, RAG, and MCP search require the Express backend running locally (or deployed separately).

## Features

- **PDF upload** — Drag and drop PDF files to use as the knowledge base for RAG.
- **RAG answers** — LangChain loads and splits the PDF, retrieves relevant chunks with OpenAI embeddings, and generates concise answers with GPT.
- **MCP web search** — An MCP server exposes a `search_web` tool (SerpAPI + Google). The backend summarizes live search results with GPT.
- **Dual answers** — Each question returns both a document-based RAG answer and a web-search MCP answer side by side.
- **Voice chat** — Toggle Chat Mode for speech recognition input and spoken RAG responses (text-to-speech).

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Ant Design, Axios, react-speech-recognition, speak-tts |
| Backend | Express, Multer, LangChain, OpenAI, MCP SDK, SerpAPI |

## Project Structure

```
agentai/
├── src/
│   ├── App.js                 # Main layout
│   └── components/
│       ├── PdfUploader.js     # PDF drag-and-drop upload
│       ├── ChatComponent.js   # Search input, voice chat, API calls
│       └── RenderQA.js        # RAG + MCP answer display
├── server/
│   ├── server.js              # Express API (port 5001)
│   ├── chat.js                # RAG pipeline (PDF → vector store → GPT)
│   ├── chat-mcp.js            # MCP client + web search summarization
│   └── mcp-service.js         # MCP server (SerpAPI search_web tool)
└── build/                     # Production frontend build
```

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/uploads` | Upload a PDF file (multipart form field: `file`) |
| `GET` | `/chat?question=...` | Returns `{ ragAnswer, mcpAnswer }` |

## Getting Started

### Prerequisites

- Node.js 18+
- [OpenAI API key](https://platform.openai.com/)
- [SerpAPI key](https://serpapi.com/)

### Environment Variables

Create `server/.env`:

```env
OPENAI_API_KEY=your_openai_api_key
SERPAPI_API_KEY=your_serpapi_api_key
```

### Install

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server && npm install && cd ..
```

### Run Locally

Start both frontend and backend:

```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5001](http://localhost:5001)

Or run them separately:

```bash
npm start          # React dev server
npm run server     # Express API
```

### Build for Production

```bash
npm run build
```

Output is written to the `build/` folder. Zip the contents for manual deploy to AWS Amplify:

```bash
cd build && zip -r ../build.zip .
```

## How It Works

1. Upload a PDF — the backend stores it and uses it as the RAG source on the next chat request.
2. Ask a question — the backend runs two pipelines in parallel:
   - **RAG**: PDF → text chunks → vector retrieval → GPT answer from document context.
   - **MCP**: MCP client calls `search_web` on the SerpAPI MCP server → GPT summarizes search results.
3. The UI shows both answers. In Chat Mode, the RAG answer is also read aloud.
