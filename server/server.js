import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import path from 'path';


import { fileURLToPath } from "url";

// Convert __filename and __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const allowedOrigins = ['https://motion-blur-experiment-64p3fw3qv-sashas-projects-116bdc35.vercel.app'];  // Replace with your Vercel URL

// Set up the WebSocket server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Middleware
app.use(express.static(path.join(__dirname, '../src')));  // Serve static files
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(express.json()); // Parse JSON request bodies

// MongoDB Schema Setup
const responseSchema = new mongoose.Schema({
  image: {type: String, required: true},
  selection: {type: String, required: true},  
  trialType: {type: String, required: true},
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

// Define your API route for /api/responses
app.get('/api/responses', (req, res) => {
  res.json({ message: 'This is the API response' });
});

// API Route to Save Responses
app.post("/api/responses", async (req, res) => {
  try {
    const { image, selection, trialType } = req.body;
    const newResponse = new Response({ image, selection, trialType });
    await newResponse.save();
    res.status(201).json({ message: "Response saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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



// import express from "express";


// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// const path = require('path')

// app.use(express.static(path.join(__dirname, '../src')));

// // Serve the front-end (index.html) when the root URL is requested
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../index.html'));
// });

// // Define your API route for /api/responses
// app.get('/api/responses', (req, res) => {
//   // Return some response, for example:
//   res.json({ message: 'This is the API response' });
// });
// // import Response from "./response";
// // Load environment variables
// dotenv.config();

// const responseSchema = new mongoose.Schema({
//   image: {type: String, required: true},
//   selection: {type: String, required: true},  
//   trialType: {type: String, required: true},
//   timestamp: { type: Date, default: Date.now },
// });

// const userSchema = new mongoose.Schema({
//     name: String,
//     response: responseSchema
// })



// const Response = mongoose.model("Response", responseSchema);
// import { WebSocketServer } from "ws";

// const app = express();
// const PORT = process.env.PORT || 10000;


// // Create WebSocket server and attach it to the same port


// // Middleware
// app.use(cors());
// app.use(express.json()); // Parse JSON request bodies

// // Allow requests from your frontend (Vercel)
// const allowedOrigins = ['https://motion-blur-experiment-64p3fw3qv-sashas-projects-116bdc35.vercel.app'];  // Replace with your Vercel URL

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };
// // const corsOptions = {
// //     origin: "*",  // Allow all origins during development
// //   };
  
// app.use(cors(corsOptions));

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"))
//   .catch(err => console.log(err));


// // API Route to Save Responses
// app.post("/api/responses", async (req, res) => {
//   try {
//     const { image, selection, trialType } = req.body;
//     const newResponse = new Response({ image: image, selection: selection, trialType: trialType });
//     await newResponse.save();
//     res.status(201).json({ message: "Response saved" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// const server = app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });

// // Start Server
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


  
// const wss = new WebSocketServer({ server });  // Attach WebSocket server to the HTTP server
  
// wss.on('connection', (ws) => {
//   console.log('New WebSocket connection established');
// });
// // const wss = new WebSocketServer({ server });

// // wss.on('connection', (ws) => {
// //   ws.on('message', (message) => {
// //     console.log('received: %s', message);
// //   });
// //   ws.send('Hello from the server!');
// // });