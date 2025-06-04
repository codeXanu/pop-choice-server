import express from "express";
import { OpenAI } from "openai";
import { createClient } from "@supabase/supabase-js";
import { config } from 'dotenv'


const router = express.Router();
config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

router.post("/", async (req, res) => {
    
  const { input } = req.body;

  if (!input) return res.status(400).json({ error: "Missing input text" });

  try {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input
    });

    const embedding = embeddingResponse.data[0].embedding;

     const { data, error } = await supabase
      .from("documents")
      .insert([{ content: input, embedding }]);

    if (error) {
      throw error;
    }

      res.status(200).json({
      success: true,
      message: "Embedding stored successfully",
      storedData: data, 
    });
  } catch (err) {
    console.error("Error inserting into Supabase:", err.message);
    res.status(500).json({ error: "Embedding generation failed" });
  }
});



async function generateRecommendation({ userInfo, matchedMovie }) {
  const messages = [
    {
      role: "system",
      content: `You are a friendly movie expert. The user will give you:
- a short phrase with their favorite movie and what kind of movie they want to watch next (new/classic, genre, vibe).
- a suggested movie with full description.

Reply with a short, human-sounding recommendation using the suggested movie that fits the user’s preferences.`
    },
    {
      role: "user",
      content: `User preferences: ${userInfo}\nSuggested movie: ${matchedMovie}`
    }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
      max_tokens: 200
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Chat completion error:", error.message);
    return "Sorry, I couldn’t create a movie suggestion at the moment.";
  }
}


{/*to make embeddings of user input */}

router.post("/userInputs", async (req, res) => {
  const {input} = req.body;
  // console.log(input)
  if (!input) return  res.status(400).json({error: "Missing user input text"})

  try {
    const inputEmbeddings = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: input
    });
    const embeddings = inputEmbeddings.data[0].embedding;

    const { data } = await supabase.rpc('match_documents', {
      query_embedding: embeddings,
      match_threshold: 0.30,
      match_count: 1
    });

    const matchedMovie = data[0].content;
  
    const recommendation = await generateRecommendation({ userInfo: input, matchedMovie });
  

    res.status(200).json({
      success: true,
      // message: "Embedding done successfully",
      // embeddings: embeddings,
      // results: data,
      recommendation
    })
  } catch (err) {
    console.error("error occuring:", err.message)
  }
})

export default router;
