const mongoose = require("mongoose");
const { ENTITY_TYPES } = require("../sampleData");

const entitySchema = new mongoose.Schema({
  name: String,
  executive_board: {
    chairman: String,
    mentor: [String],
  },
  description: String,
  numberOfMembers: Number,
  yearOfEstablishment: Number,
  activities: [String],
  criteria: mongoose.Schema.Types.Mixed,
  belongTo: String,
  contact: String,
  image: String,
  gallery: [String],
  website: String,
  socialMediaLinks: {
    facebook: String,
    instagram: String,
    twitter: String,
    tiktok: String,
    youtube: String,
    linkedin: String,
    github: String,
    discord: String,
    telegram: String,
  },
  location: String,
  achievements: [String],
  partnersAndSponsors: [String],
  type: {
    type: String,
    enum: Object.values(ENTITY_TYPES),
  },
});

module.exports = mongoose.model("Entity", entitySchema);
