import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'civiclens.db');
const exists = fs.existsSync(DB_FILE);
const db = new sqlite3.Database(DB_FILE);

db.runAsync = promisify(db.run.bind(db));
db.allAsync = promisify(db.all.bind(db));
db.getAsync = promisify(db.get.bind(db));

export async function initDB() {
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS Users (
      id TEXT PRIMARY KEY,
      name TEXT,
      role TEXT
    )
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS Posts (
      id TEXT PRIMARY KEY,
      title TEXT,
      description TEXT,
      image_url TEXT,
      issue_type TEXT,
      severity TEXT,
      status TEXT,
      latitude REAL,
      longitude REAL,
      reporter_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      upvotes INTEGER DEFAULT 0
    )
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS Votes (
      user_id TEXT,
      post_id TEXT,
      PRIMARY KEY (user_id, post_id)
    )
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS AdminActions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id TEXT,
      action_taken TEXT,
      updated_status TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  if (!exists) {
    console.log('Seeding initial data...');
    const seedUsers = [
      { id: '1', name: 'Citizen One', role: 'citizen' },
      { id: 'admin1', name: 'Admin One', role: 'admin' }
    ];
    for (const u of seedUsers) {
      await db.runAsync(`INSERT INTO Users (id, name, role) VALUES (?, ?, ?)`, [u.id, u.name, u.role]);
    }

    const seedPosts = [
      { id: 'p1', title: 'Massive Pothole on main road', description: 'Deep pothole causing traffic slowdowns and vehicle damage near the intersection.', image_url: 'https://picsum.photos/400/300?random=1', issue_type: 'Pothole', severity: 'High', status: 'Pending', lat: 28.6139, lng: 77.2090, reporter: 'Citizen A' },
      { id: 'p2', title: 'Overflowing Garbage Bin', description: 'Garbage hasn\'t been collected for 3 days. Strong odor.', image_url: 'https://picsum.photos/400/300?random=2', issue_type: 'Garbage', severity: 'Medium', status: 'In Progress', lat: 19.0760, lng: 72.8777, reporter: 'Citizen B' },
      { id: 'p3', title: 'Broken Street Light', description: 'Completely dark street, unsafe for pedestrians at night.', image_url: 'https://picsum.photos/400/300?random=3', issue_type: 'Infrastructure', severity: 'High', status: 'Pending', lat: 12.9716, lng: 77.5946, reporter: 'Citizen C' },
      { id: 'p4', title: 'Stray Animal Corpse', description: 'Dead stray dog on the side of the road, needs immediate removal.', image_url: 'https://picsum.photos/400/300?random=4', issue_type: 'Dead Animal', severity: 'Medium', status: 'Resolved', lat: 13.0827, lng: 80.2707, reporter: 'Citizen D' },
      { id: 'p5', title: 'Water Pipe Leak', description: 'Clean drinking water is being wasted due to a burst pipe.', image_url: 'https://picsum.photos/400/300?random=5', issue_type: 'Water', severity: 'High', status: 'Pending', lat: 22.5726, lng: 88.3639, reporter: 'Citizen E' },
      { id: 'p6', title: 'Cave-in on Road', description: 'Small sinkhole starting to form near the drainage.', image_url: 'https://picsum.photos/400/300?random=6', issue_type: 'Road Damage', severity: 'High', status: 'Pending', lat: 26.9124, lng: 75.7873, reporter: 'Citizen F' },
      { id: 'p7', title: 'Open Manhole', description: 'Manhole cover is missing, highly dangerous.', image_url: 'https://picsum.photos/400/300?random=7', issue_type: 'Infrastructure', severity: 'High', status: 'In Progress', lat: 21.1702, lng: 72.8311, reporter: 'Citizen G' },
      { id: 'p8', title: 'Illegal Garbage Dumping', description: 'Construction waste dumped in the park.', image_url: 'https://picsum.photos/400/300?random=8', issue_type: 'Garbage', severity: 'Low', status: 'Pending', lat: 23.0225, lng: 72.5714, reporter: 'Citizen H' },
      { id: 'p9', title: 'Fallen Tree Branch', description: 'Large branch blocking half of the road after the storm.', image_url: 'https://picsum.photos/400/300?random=9', issue_type: 'Blockage', severity: 'Medium', status: 'Pending', lat: 18.5204, lng: 73.8567, reporter: 'Citizen I' },
      { id: 'p10', title: 'Flooded Underpass', description: 'Water logging makes it impossible for 2-wheelers to cross.', image_url: 'https://picsum.photos/400/300?random=10', issue_type: 'Water Logging', severity: 'High', status: 'Resolved', lat: 26.8467, lng: 80.9462, reporter: 'Citizen J' }
    ];
    for (const p of seedPosts) {
      await db.runAsync(
        `INSERT INTO Posts (id, title, description, image_url, issue_type, severity, status, latitude, longitude, reporter_name, upvotes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.id, p.title, p.description, p.image_url, p.issue_type, p.severity, p.status, p.lat, p.lng, p.reporter, Math.floor(Math.random() * 50)]
      );
    }
    console.log('Seeded 10 civic posts.');
  }
}

export { db };
