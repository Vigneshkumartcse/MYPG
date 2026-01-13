const mongoose = require("mongoose");

const pgMediaSchema = new mongoose.Schema({
  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PG",
    required: true
  },

  uploadedBy: {
    type: String,
    enum: ["owner", "student", "admin"],
    required: true
  },

  mediaType: {
    type: String,
    enum: ["room", "washroom", "food", "building", "other"]
  },

  url: {
    type: String,
    required: true
  },

  isApproved: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

const PGMedia = mongoose.model("PGMedia", pgMediaSchema);
module.exports = PGMedia;