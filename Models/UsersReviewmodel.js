const mongoose = require("mongoose");

const userReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
    pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PG",
    required: true,
    },


    rating: {
    type: Number,
    required: true,
    min: 1, 
    max: 5
  },


    reviewText: {   
    type: String,
    trim: true
  }

  
}, { timestamps: true });

const UsersReview = mongoose.model("UsersReview", userReviewSchema);
module.exports = UsersReview;