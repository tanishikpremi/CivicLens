// Mock AI Service for image classification

const MOCK_RESULTS = [
  { type: 'pothole', severity: 'high', confidence: 0.92 },
  { type: 'garbage', severity: 'medium', confidence: 0.88 },
  { type: 'road_damage', severity: 'high', confidence: 0.95 },
  { type: 'dead_animal', severity: 'high', confidence: 0.99 },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const AIService = {
  classifyImage: async (imageFileOrBase64) => {
    console.log("Analyzing image via AI...");
    await delay(1500); // Simulate API latency
    
    // Pick random result for demo purposes, or deterministic based on name if possible
    // For a hackathon demo, randomization shows the app's dynamic capability
    const randomResult = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
    
    return randomResult;
  },

  // Helper to calculate haversine distance in meters
  getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // in metres
  },

  checkDuplicates: async (lat, lng, dbIssues) => {
    await delay(800);
    // Find issues within 50 meters
    const nearby = dbIssues.filter(issue => {
      if(!issue.latitude || !issue.longitude) return false;
      const distance = AIService.getDistance(lat, lng, issue.latitude, issue.longitude);
      return distance <= 50; 
    });

    if (nearby.length > 0) {
      // Return the most likely duplicate
      return {
        isDuplicate: true,
        duplicateOf: nearby[0],
        similarityScore: 0.85 + (Math.random() * 0.1) // Simulate 85-95% similarity
      };
    }

    return { isDuplicate: false };
  }
};
