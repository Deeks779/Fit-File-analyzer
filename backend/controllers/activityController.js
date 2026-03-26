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

function semicirclesToDegrees(sc) {
  return sc * (180 / Math.pow(2, 31));
}

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

      // ---------- DETECT DATA ----------
      const records = data.records || [];
      const laps = data.laps || data.lap || [];
      const session = data.session || {};
      const device = data.device_info?.[0] || {};
      const fileId = data.file_id || {};

      // ---------- GRAPH DATA ----------
      let graphData = [];

      if (records.length > 0) {
        graphData = records.map(r => ({
          time: r.timestamp,
          lat: r.position_lat ? semicirclesToDegrees(r.position_lat) : null,
          lon: r.position_long ? semicirclesToDegrees(r.position_long) : null,
          distance: r.distance || 0,
          speed: r.speed || 0,
          altitude: r.altitude || 0,
        }));
      }

      // ---------- DERIVED ANALYTICS ----------
      const speeds = records.map(r => r.speed).filter(Boolean);
      const avgSpeed = speeds.length
        ? speeds.reduce((a, b) => a + b, 0) / speeds.length
        : 0;

      const maxSpeed = speeds.length ? Math.max(...speeds) : 0;

      // Distance fallback (if no session)
      let totalDistance = session.total_distance || 0;
      if (!totalDistance && records.length > 1) {
        totalDistance = records[records.length - 1].distance || 0;
      }

      // ---------- SUMMARY ----------
      const summary = {
        distance: totalDistance,
        duration: session.total_timer_time || 0,
        avgSpeed,
        maxSpeed,
        calories: session.total_calories || 0,
        sport: session.sport || "unknown",
        totalLaps: laps.length,
      };

      // ---------- TABLE DATA (VERY IMPORTANT) ----------
      const tableData = graphData.map(d => ({
        time: d.time,
        distance: d.distance,
        speed: d.speed,
        altitude: d.altitude,
      }));

      // ---------- SAVE ----------
      const activity = new Activity({
        fileName: file.originalname,

        summary,
        graphData,
        tableData,

        laps,
        session,
        device,
        fileId,

        rawData: data, // 🔥 for future ML / debugging
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