
// Define the Waypoint type
type Waypoint = {
  id: string;
  lat: number;
  lng: number;
  alt: number;
};

/**
 * Calculate distance between two waypoints using Haversine formula
 * @param wp1 First waypoint
 * @param wp2 Second waypoint
 * @returns Distance in meters
 */
const calculateDistance = (wp1: Waypoint, wp2: Waypoint): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (wp1.lat * Math.PI) / 180; // lat1 in radians
  const φ2 = (wp2.lat * Math.PI) / 180; // lat2 in radians
  const Δφ = ((wp2.lat - wp1.lat) * Math.PI) / 180;
  const Δλ = ((wp2.lng - wp1.lng) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

/**
 * Build a distance matrix between all waypoints
 * @param waypoints Array of waypoints
 * @returns Distance matrix
 */
const buildDistanceMatrix = (waypoints: Waypoint[]): number[][] => {
  const n = waypoints.length;
  const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        matrix[i][j] = calculateDistance(waypoints[i], waypoints[j]);
      }
    }
  }
  
  return matrix;
};

/**
 * Find the shortest path through all waypoints using a greedy approach
 * based on Dijkstra's algorithm principles
 * @param waypoints Array of waypoints to optimize
 * @returns Optimized array of waypoints
 */
export const calculateOptimizedPath = (waypoints: Waypoint[]): Waypoint[] => {
  if (waypoints.length <= 2) return [...waypoints];
  
  const distanceMatrix = buildDistanceMatrix(waypoints);
  const n = waypoints.length;
  
  // Start from the first waypoint for simplicity
  const startIndex = 0;
  const visited = new Set<number>([startIndex]);
  const path = [startIndex];
  
  // Find the shortest path that visits all waypoints
  while (path.length < n) {
    let currentIndex = path[path.length - 1];
    let minDistance = Infinity;
    let nextIndex = -1;
    
    // Find the closest unvisited waypoint
    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && distanceMatrix[currentIndex][i] < minDistance) {
        minDistance = distanceMatrix[currentIndex][i];
        nextIndex = i;
      }
    }
    
    if (nextIndex !== -1) {
      visited.add(nextIndex);
      path.push(nextIndex);
    }
  }
  
  // Reorder the waypoints according to the optimized path
  const optimizedWaypoints: Waypoint[] = path.map(index => waypoints[index]);
  return optimizedWaypoints;
};
