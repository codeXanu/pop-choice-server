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
      storedData: data, // optional: return what was stored
    });
  } catch (err) {
    console.error("Error inserting into Supabase:", err.message);
    res.status(500).json({ error: "Embedding generation failed" });
  }
});

export default router;
