const Activity = require("../models/Activity");
const FitParser = require("fit-file-parser").default;
const fs = require("fs");

// Convert Garmin semicircles → degrees
function semicirclesToDegrees(sc) {
  return sc * (180 / Math.pow(2, 31));
}

// POST /upload
exports.uploadActivity = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const fitParser = new FitParser({ mode: "list", force: true });
    const buffer = fs.readFileSync(file.path);

    fitParser.parse(buffer, async (error, data) => {
      try {
        if (error) {
          return res.status(500).json({ message: "FIT parse error" });
        }

        console.log("FULL DATA KEYS:", Object.keys(data));

        // ---------- DETECT DATA ----------
        const records = data.records || [];
        const monitoring =
          data.monitoring ||
          data.monitors ||
          data.monitor ||
          [];

        const laps = data.laps || data.lap || [];
        const session = data.session || {};
        const device = data.device_info?.[0] || {};
        const fileId = data.file_id || {};

        let graphData = [];
        let tableData = [];

        // =====================================================
        // 🟢 CASE 1: GPS ACTIVITY
        // =====================================================
        if (records.length > 0) {
          graphData = records.map(r => ({
            time: r.timestamp || 0,
            lat: r.position_lat ? semicirclesToDegrees(r.position_lat) : null,
            lon: r.position_long ? semicirclesToDegrees(r.position_long) : null,
            distance: r.distance || 0,
            speed: r.speed || 0,
            altitude: r.altitude || 0,
          }));

          tableData = graphData;
        }

        // =====================================================
        // 🟢 CASE 2: MONITORING DATA (FIXED)
        // =====================================================
        else if (monitoring.length > 0) {
          graphData = monitoring.map((m, i) => ({
            time: m.timestamp || m.timestamp_16 || i,

            steps: m.steps || 0,
            intensity: m.intensity || 0,

            // ✅ FIXED: readable labels
            activityType:
              m.activity_type === 0 ? "sedentary" :
              m.activity_type === 1 ? "walking" :
              m.activity_type === 2 ? "running" :
              "unknown",

            // ❌ REMOVE garbage values
            calories:
              m.active_calories && m.active_calories > 0
                ? m.active_calories
                : null,

            activeTime:
              m.active_time && m.active_time > 1
                ? m.active_time
                : null,
          }));

          tableData = graphData;
        }

        // =====================================================
        // 📊 DERIVED ANALYTICS
        // =====================================================

        // Speed
        const speeds = records.map(r => r.speed).filter(Boolean);

        const avgSpeed = speeds.length
          ? speeds.reduce((a, b) => a + b, 0) / speeds.length
          : 0;

        const maxSpeed = speeds.length ? Math.max(...speeds) : 0;

        // Distance fallback
        let totalDistance = session.total_distance || 0;
        if (!totalDistance && records.length > 1) {
          totalDistance = records[records.length - 1].distance || 0;
        }

        // Monitoring analytics
        let totalSteps = 0;
        let avgIntensity = 0;
        let activeMinutes = 0;

        if (monitoring.length > 0) {
          const stepsArr = monitoring.map(m => m.steps).filter(Boolean);
          totalSteps = stepsArr.length
            ? stepsArr[stepsArr.length - 1]
            : 0;

          const intensityArr = monitoring.map(m => m.intensity).filter(Boolean);
          avgIntensity = intensityArr.length
            ? intensityArr.reduce((a, b) => a + b, 0) / intensityArr.length
            : 0;

          // ✅ BETTER: derived active time
          activeMinutes = monitoring.filter(m => m.intensity > 20).length;
        }

        // =====================================================
        // 📦 SUMMARY
        // =====================================================
        const summary = {
          distance: totalDistance,
          duration: session.total_timer_time || 0,
          avgSpeed,
          maxSpeed,
          calories: session.total_calories || 0,

          totalSteps,
          avgIntensity,
          activeMinutes, // ✅ NEW (better than raw activeTime)

          sport: session.sport || "unknown",
          totalLaps: laps.length,
        };

        // =====================================================
        // 💾 SAVE
        // =====================================================
        const activity = new Activity({
          fileName: file.originalname,
          summary,
          graphData,
          tableData,
          laps,
          session,
          device,
          fileId,
          rawData: data,
        });

        await activity.save();

        return res.json({
          message: "Uploaded successfully",
          id: activity._id,
        });

      } catch (err) {
        console.error("Parse Error:", err);

        if (!res.headersSent) {
          return res.status(500).json({ message: "Server error" });
        }
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ONE
exports.getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL
exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};