const mongoose = require("mongoose");

const lostAndFoundSchema = new mongoose.Schema({
  founderId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  message: { type: String, required: true },
  ItemImageUrl:{type:String, required:true},
  timestamp: { type: Date, default: Date.now }
});

const LostAndFound = mongoose.model("lostAndFound", lostAndFoundSchema);

module.exports = LostAndFound;