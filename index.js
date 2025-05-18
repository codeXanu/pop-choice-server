import express from 'express'
import { config } from 'dotenv'
import embedRoute from "./routes/embed.js"
import cors from 'cors';

config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors())


app.use(express.json());

app.use("/api/embed", embedRoute);



app.listen(PORT, ()=> console.log(`server is connected on port ${PORT}`))
