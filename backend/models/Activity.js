const mongoose = require("mongoose");

// 🔥 remove old cached model
if (mongoose.models.Activity) {
  delete mongoose.models.Activity;
}

const ActivitySchema = new mongoose.Schema({
  fileName: String,

  summary: {
    distance: Number,
    duration: Number,
    avgSpeed: Number,
    maxSpeed: Number,
    calories: Number,
    sport: String,
    totalLaps: Number,
  },

  // 📊 For charts
  graphData: [
    {
      time: Number,
      lat: Number,
      lon: Number,
      distance: Number,
      speed: Number,
      altitude: Number,
    },
  ],

  // 📋 For tables
  tableData: [
    {
      time: Number,
      distance: Number,
      speed: Number,
      altitude: Number,
    },
  ],

  // 🧾 Extra structured data
  laps: Array,
  session: Object,
  device: Object,
  fileId: Object,

  // 🔥 raw backup (very important)
  rawData: Object,

}, { timestamps: true });

module.exports = mongoose.model("Activity", ActivitySchema);