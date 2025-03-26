import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  image: String,
  objectChoice: String,
  motionChoice: String,
  timestamp: { type: Date, default: Date.now },
});

const Response = mongoose.model("Response", responseSchema);

export default Response;