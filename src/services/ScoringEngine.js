import { addHours } from 'date-fns';

export const ScoringEngine = {
  // Configurable Weights
  weights: {
    dead_animal: 1.0,
    pothole: 0.7,
    garbage: 0.6,
    road_damage: 0.8
  },

  // Map severity (1-10) to a normalized 0-1 range
  normalizeSeverity: (severityLevel) => {
    const map = { 'low': 0.3, 'medium': 0.6, 'high': 1.0 };
    return map[severityLevel] || 0.5;
  },

  // (severity * 0.4) + (upvotes * 0.2) + (density * 0.2) + (typeWeight * 0.2)
  calculatePriorityScore: (type, severity, upvotes = 0, clusterDensity = 0) => {
    const typeWeight = ScoringEngine.weights[type] || 0.5;
    const normSeverity = ScoringEngine.normalizeSeverity(severity);
    
    // Cap upvotes at 50 for max effect in this formula
    const normUpvotes = Math.min(upvotes / 50, 1.0);
    // Cap density at 10 issues nearby
    const normDensity = Math.min(clusterDensity / 10, 1.0);

    const score = (normSeverity * 0.4) + (normUpvotes * 0.2) + (normDensity * 0.2) + (typeWeight * 0.2);
    
    // Return max 100
    return Math.round(score * 100);
  },

  // Priority Labeling
  getPriorityLabel: (score) => {
    if (score >= 80) return 'High';
    if (score >= 50) return 'Medium';
    return 'Low';
  },

  // SLA Time limits in hours
  calculateSLA: (type, createdAtDate) => {
    let hoursToAdd = 72; // default 3 days
    
    if (type === 'dead_animal') {
      hoursToAdd = 18; // 12-24h
    } else if (type === 'garbage') {
      hoursToAdd = 24;
    } else if (type === 'pothole') {
      hoursToAdd = 72;
    } else if (type === 'road_damage') {
      hoursToAdd = 48;
    }

    return addHours(createdAtDate, hoursToAdd).toISOString();
  }
};
