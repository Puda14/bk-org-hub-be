const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Entity = require("../models/Entity");

const clearData = async () => {
  await connectDB();
  await Entity.deleteMany({});
  console.log("All entities deleted");
  process.exit();
};

clearData();
