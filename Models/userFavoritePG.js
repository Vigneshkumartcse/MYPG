const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PG",
    required: true
  }

}, { timestamps: true });

// Prevent duplicate favorites
favoriteSchema.index({ userId: 1, pgId: 1 }, { unique: true });

const FavoritePG = mongoose.model("FavoritePG", favoriteSchema);

module.exports = FavoritePG;