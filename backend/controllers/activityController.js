const Activity = require("../models/Activity");
const FitParser = require("fit-file-parser").default;
const fs = require("fs");

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const toRad = (x) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// POST /upload
exports.uploadActivity = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const fitParser = new FitParser({ mode: "list", force: true });

    const buffer = fs.readFileSync(file.path);

    fitParser.parse(buffer, async (error, data) => {
      if (error) {
        return res.status(500).json({ message: "FIT parse error" });
      }

      // GROUP ALL DATA
      const messages = {
        file_id: data.file_id || {},
        device_info: data.device_info || {},
        user_profile: data.user_profile || {},
        session: data.session || {},
        lap: data.lap || [],
        record: data.records || [],
        event: data.events || [],
        monitoring: data.monitoring || [],
      };

      // SUMMARY CALCULATION
      const records = data.records || [];

      const heartRates = records
        .map(r => r.heart_rate)
        .filter(Boolean);

      const avgHR = heartRates.length
        ? heartRates.reduce((a, b) => a + b, 0) / heartRates.length
        : 0;

      const maxHR = heartRates.length
        ? Math.max(...heartRates)
        : 0;

      const speeds = records.map(r => r.speed).filter(Boolean);
      const avgSpeed = speeds.length
        ? speeds.reduce((a, b) => a + b, 0) / speeds.length
        : 0;

      const activity = new Activity({
        fileName: file.originalname,

        summary: {
          distance: data.session?.total_distance || 0,
          duration: data.session?.total_timer_time || 0,
          avgHeartRate: avgHR,
          maxHeartRate: maxHR,
          avgSpeed,
          calories: data.session?.total_calories || 0,
          type: data.session?.sport || "unknown",
        },

        messages,
      });

      await activity.save();

      res.json({ message: "Uploaded", id: activity._id });
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getActivity = async (req, res) => {
  try {
    const Activity = require("../models/Activity");
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(activity);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAllActivities = async (req, res) => {
  try {
    const Activity = require("../models/Activity");
    const activities = await Activity.find().sort({ createdAt: -1 });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};