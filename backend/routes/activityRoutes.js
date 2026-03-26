const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  uploadActivity,
  getActivity,
  getAllActivities
} = require("../controllers/activityController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("file"), uploadActivity);
router.get("/activity/:id", getActivity);
router.get("/activities", getAllActivities);

module.exports = router;