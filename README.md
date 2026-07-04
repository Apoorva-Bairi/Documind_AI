# DocuMind AI

DocuMind AI is a full-stack AI-powered document assistant built with the MERN stack. It allows users to upload TXT and PDF documents, ask questions based on the uploaded content, and receive AI-generated answers with source references using Retrieval-Augmented Generation (RAG).

---

## Live Links

### Frontend (Netlify)
https://documindai-qa.netlify.app/

### Backend (Render)
https://documind-ai-zsii.onrender.com/

### GitHub Repository
https://github.com/Apoorva-Bairi/Documind_AI

---

## Features

- User Authentication with JWT
- Secure Protected Routes
- Upload TXT and PDF documents
- File validation (type, size, duplicate checks)
- Document chunking for efficient retrieval
- Embedding generation for semantic search
- MongoDB Vector Search integration
- AI-powered answers using Groq API
- Source chunk transparency
- Chat history management
- Clear chat history with custom confirmation modal
- Responsive modern UI

---

## Tech Stack

### Frontend
- React
- TypeScript
- Redux Toolkit
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Multer

### AI / RAG
- Groq API
- MongoDB Vector Search
- Text Chunking
- Custom Embeddings

---

## Deployment

Frontend deployed on Netlify  
Backend deployed on Render

## Project Workflow

Upload Document  
→ Extract Text  
→ Chunk Document  
→ Generate Embeddings  
→ Store in MongoDB  
→ Ask Question  
→ Generate Question Embedding  
→ Vector Search Matching  
→ Send Context to LLM  
→ Return Answer + Sources

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Apoorva-Bairi/Documind_AI.git
cd Documind AI

```

### Backend Setup

```bash
cd node-rag-mongodb
npm install
```

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GROQ_API_KEY=your_groq_key
```

Run backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Create `.env`

```env

VITE_API_URL=http://localhost:5000

```

---

## Supported File Types

- TXT
- PDF

Maximum file size:

```txt
5MB
```

---

## Future Improvements

- DOCX support
- Markdown file support
- Upload progress bar
- Chat history click-to-restore
- Multi-document support
- Document deletion

---

## Author

Apoorva Bairi