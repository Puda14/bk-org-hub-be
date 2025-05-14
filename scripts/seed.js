const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Entity = require("../models/Entity");
const { clubs } = require("../sampleData");

const seedData = async () => {
  await connectDB();
  await Entity.deleteMany({});
  console.log("Old entities deleted");
  await Entity.insertMany(clubs);
  console.log("Sample data inserted");
  process.exit();
};

seedData();
