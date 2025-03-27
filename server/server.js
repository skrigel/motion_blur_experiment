import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
// import Response from "./response";
// Load environment variables
dotenv.config();

const responseSchema = new mongoose.Schema({
  image: {type: String, required: true},
  selection: {type: String, required: true},  
  trialType: {type: String, required: true},
  timestamp: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
    name: String,
    response: responseSchema
})



const Response = mongoose.model("Response", responseSchema);
import { WebSocketServer } from "ws";

const app = express();
const PORT = process.env.PORT || 5001;


// Create WebSocket server and attach it to the same port


// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Allow requests from your frontend (Vercel)
const allowedOrigins = ['https://motion-blur-experiment-64p3fw3qv-sashas-projects-116bdc35.vercel.app'];  // Replace with your Vercel URL

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


// API Route to Save Responses
app.post("/api/responses", async (req, res) => {
  try {
    const { image, selection, trialType } = req.body;
    const newResponse = new Response({ image: image, selection: selection, trialType: trialType });
    await newResponse.save();
    res.status(201).json({ message: "Response saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

// Start Server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


  
const wss = new WebSocketServer({ server });  // Attach WebSocket server to the HTTP server
  
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
});
// const wss = new WebSocketServer({ server });

// wss.on('connection', (ws) => {
//   ws.on('message', (message) => {
//     console.log('received: %s', message);
//   });
//   ws.send('Hello from the server!');
// });