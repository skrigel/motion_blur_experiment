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

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

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

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));