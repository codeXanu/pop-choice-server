# 🎬 Pop Choice Server

**Pop Choice Server** is the backend for an AI-powered movie recommendation app. It accepts user preferences, generates text embeddings with OpenAI, stores them in Supabase, and returns personalized movie suggestions using semantic search and GPT-4.

## 🚀 Features

- Accepts natural language user input describing movie preferences.
- Generates text embeddings using OpenAI's `text-embedding-3-small` model.
- Stores user inputs in a Supabase `documents` table with vector embeddings.
- Finds the closest matching movie using Supabase's `match_documents` RPC.
- Generates friendly recommendations with GPT-4 using matched data.

## 🛠️ Tech Stack

- **Backend Framework:** Express.js
- **AI Embedding & Chat:** OpenAI API
- **Database & Vector Search:** Supabase
- **Environment Config:** dotenv
- **CORS & Middleware:** Enabled

## 📂 Project Structure

```
pop-choice-server/
├── index.js              # Entry point: Sets up Express app and routes
├── routes/
│   └── embed.js          # Core logic for embedding, storing, searching, and recommendations
├── .env                  # Environment variables (not committed)
├── package.json          # Project metadata and dependencies
```

## 📦 Installation

```bash
git clone https://github.com/your-username/pop-choice-server.git
cd pop-choice-server
npm install
```

## 🧪 Environment Variables

Create a `.env` file in the root directory and add:

```env
PORT=8000
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

## ▶️ Running the Server

```bash
npm start
```

Server will run on `http://localhost:8000` (or your defined `PORT`).

## 📡 API Endpoints

### `POST /api/embed/`

**Description:** Stores user input and its vector embedding in Supabase.

**Request Body:**
```json
{
  "input": "Inputs a movie complete details."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Embedding stored successfully",
  "storedData": [ ... ]
}
```

### `POST /api/embed/userInputs`

**Description:** Accepts a user input, embeds it, finds a similar movie from Supabase, and returns a GPT-4-generated recommendation.

**Request Body:**
```json
{
  "input": "intersteller and dune is my favorite movie. I want to watch new. I want something serious, epic and emotional."
}
```

**Response:**
```json
{
  "success": true,
  "recommendation": "You might love watching *Avatar:The Way of water* – this movie will sure to satisfy ypur craving for something serious and new......"
}
```

## 🧠 How It Works

1. **Input Handling:** User describes their mood or preference.
2. **Embedding:** Text is converted into a vector using OpenAI.
3. **Storage/Similarity Search:** Supabase stores the vectors and runs `match_documents` to find the most similar.
4. **GPT-4 Chat Completion:** A movie description is used with user preference to generate a natural recommendation.

## 👤 Author

**Anuj Kumar Maurya** – [@codeXanu](https://github.com/codeXanu)

## 📃 License

Licensed under the [ISC License](https://opensource.org/licenses/ISC)