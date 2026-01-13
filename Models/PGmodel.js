const mongoose = require('mongoose');

const PGSchema = new mongoose.Schema({

   name:{
    type:String,
    required:true,
    trim:true

   },
   ownerID:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'owner'
   },
    location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number] // [longitude, latitude]
    }
  },
  city:{
    type:String,
    required:true,
    trim:true
  },
  area:{
    type:String,
    required:true,
    trim:true
  },
  address:{
    type:String,
    required:true,
  },
  priceRange: {
    min: Number,
    max: Number
  },
  genderType:{
    type:String,
    enum:['Male','Female','Co-Ed'],
    required:true
  },
    amenities: {
    ac: Boolean,
    wifi: Boolean,
    food: Boolean,
    laundry: Boolean
  },
   roomType: {
    type: String,
    enum: ["single", "double", "triple", "four", "other"]
  },
  pgRules:{
    type:String,
    trim:true,
  },
   foodDetails: String,

  safetyScore: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
   
}, { timestamps: true });

PGSchema.index({ location: "2dsphere" });



const PG = mongoose.model('PG', PGSchema);
module.exports = PG;