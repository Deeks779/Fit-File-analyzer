const mongoose = require("mongoose");

// 🔥 remove old cached model (for dev hot reload issues)
if (mongoose.models.Activity) {
  delete mongoose.models.Activity;
}

const ActivitySchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },

  // 📊 SUMMARY (combined GPS + monitoring)
  summary: {
    distance: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    avgSpeed: { type: Number, default: 0 },
    maxSpeed: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },

    // ✅ NEW (monitoring support)
    totalSteps: { type: Number, default: 0 },
    avgIntensity: { type: Number, default: 0 },

    sport: { type: String, default: "unknown" },
    totalLaps: { type: Number, default: 0 },
  },

  // 📈 GRAPH DATA (DYNAMIC — supports all types)
  graphData: [
    {
      time: Number,

      // GPS fields
      lat: Number,
      lon: Number,
      distance: Number,
      speed: Number,
      altitude: Number,

      // Monitoring fields
      steps: Number,
      intensity: Number,
      activityType: String,
      calories: Number,
      activeTime: Number,
    },
  ],

  // 📋 TABLE DATA (same structure as graphData)
  tableData: [
    {
      time: Number,
      lat: Number,
      lon: Number,
      distance: Number,
      speed: Number,
      altitude: Number,

      steps: Number,
      intensity: Number,
      activityType: String,
      calories: Number,
      activeTime: Number,
    },
  ],

  // 🧾 Extra structured FIT data
  laps: { type: Array, default: [] },
  session: { type: Object, default: {} },
  device: { type: Object, default: {} },
  fileId: { type: Object, default: {} },

  // 🔥 RAW BACKUP (VERY IMPORTANT for future ML)
  rawData: { type: Object, default: {} },

}, { timestamps: true });

module.exports = mongoose.model("Activity", ActivitySchema);