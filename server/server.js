import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import path from 'path';
import Papa from 'papaparse';
import fs from 'fs';


import { fileURLToPath } from "url";

let responses = {}; // { prolificId: [{trialId, ...data}] }

// Convert __filename and __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Set up the WebSocket server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Middleware
// app.use(express.static(path.join(__dirname, '../src')));  // Serve static files
const allowedOrigins = [
  "https://motion-blur-experiment-git-main-sashas-projects-116bdc35.vercel.app",
  "https://motion-blur-experiment.vercel.app",
];

// ✅ Middleware to handle CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Fix: Ensure preflight (OPTIONS) requests are handled
app.options("*", cors());

app.use(express.json()); // Parse JSON request bodies

// MongoDB Schema Setup
const responseSchema = new mongoose.Schema({
  image: {type: String, required: true},
  selection: {type: String, required: true},  
  trueLabel: {type:String, required: true},
  trialType: {type: String, required: true},
  trialId: {type: String, required: true},
  prolificId: {type: String, required: true},
  timestamp: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: String,
  response: responseSchema
});

const Response = mongoose.model("Response", responseSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Serve the front-end (index.html) when the root URL is requested
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// // Define your API route for /api/responses
// app.get('/api/responses', (req, res) => {
//   res.json({ message: 'This is the API response' });
// });

// API Route to Save Responses
app.get('/api/get-progress', async (req, res) => {
  const { prolificId } = req.query;
  try {
    const userResponses = await Response.find({ prolificId: prolificId });
    const completed = userResponses.map(r => r.trialId);
    res.json({ completedTrialIds: completed });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve progress" });
  }
});

app.post("/api/responses", async (req, res) => {
  try {
    const { image, selection, trueLabel, trialType, trialId, prolificId } = req.body;

    // if (!responses[prolificId]) responses[prolificId] = [];

    // const alreadyExists = responses[prolificId].some(r => r.trialId === trialId);
    // if (!alreadyExists) responses[prolificId].push(trialId);

    const newResponse = new Response({ image, selection, trueLabel, trialType, trialId, prolificId });
    await newResponse.save();
    res.status(201).json({ message: "Response saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/data', (req, res) => {
  const filePath = path.join(__dirname, 'data.csv'); // ✅ Points to /server/data.csv
  console.log('Reading file from:', filePath);

  fs.readFile(filePath, 'utf8', (err, csvData) => {
    if (err) {
      console.error('❌ Failed to read file:', err.message);
      return res.status(500).json({ error: 'Failed to read CSV file' });
    }

    const results = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });
    res.json(results.data);
  });
});



// Create WebSocket server and attach it to the HTTP server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
  ws.on('message', (message) => {
    console.log('received: %s', message);
  });
  ws.send('Hello from the server!');
});

