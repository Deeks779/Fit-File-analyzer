const mongoose = require("mongoose");

// 🔥 remove old cached model
if (mongoose.models.Activity) {
  delete mongoose.models.Activity;
}

const ActivitySchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    // ✅ structured summary (safe now)
    summary: {
      distance: { type: Number, default: 0 },
      duration: { type: Number, default: 0 },
      avgHeartRate: { type: Number, default: 0 },
      maxHeartRate: { type: Number, default: 0 },
      avgSpeed: { type: Number, default: 0 },
      calories: { type: Number, default: 0 },
      type: { type: String, default: "unknown" },
    },

    // ✅ flexible full FIT data
    messages: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);