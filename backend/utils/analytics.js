function calculateAnalytics(records) {
  let totalDistance = 0;
  let totalTime = 0;

  let heartRates = [];
  let speeds = [];

  for (let i = 1; i < records.length; i++) {
    const prev = records[i - 1];
    const curr = records[i];

    // --- TIME (seconds) ---
    const timeDiff = curr.timestamp - prev.timestamp;
    totalTime += timeDiff;

    // --- DISTANCE (simple speed-based) ---
    if (curr.speed) {
      totalDistance += curr.speed * timeDiff; // meters
      speeds.push(curr.speed);
    }

    // --- HEART RATE ---
    if (curr.heart_rate) {
      heartRates.push(curr.heart_rate);
    }
  }

  // --- AVG HR ---
  const avgHR =
    heartRates.length > 0
      ? heartRates.reduce((a, b) => a + b, 0) / heartRates.length
      : 0;

  // --- MAX HR ---
  const maxHR =
    heartRates.length > 0
      ? Math.max(...heartRates)
      : 0;

  // --- AVG SPEED ---
  const avgSpeed =
    speeds.length > 0
      ? speeds.reduce((a, b) => a + b, 0) / speeds.length
      : 0;

  return {
    distance: totalDistance,       // meters
    duration: totalTime,           // seconds
    avgHeartRate: avgHR,
    maxHeartRate: maxHR,
    avgSpeed: avgSpeed
  };
}

module.exports = calculateAnalytics;