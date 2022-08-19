const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    TargetNo: Number,
    Writer_id: String,
    Score: Number,
    Comment: String
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema, "Feedback");