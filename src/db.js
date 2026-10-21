const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const dir = path.join(__dirname, "..", "data");
fs.mkdirSync(dir, { recursive: true });
const db = new Database(path.join(dir, "internships.db"));
db.pragma("journal_mode = WAL");
db.exec(`CREATE TABLE IF NOT EXISTS internships (
id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, company TEXT NOT NULL,
domain TEXT NOT NULL, location TEXT NOT NULL DEFAULT 'Remote', duration TEXT NOT NULL,
stipend TEXT NOT NULL DEFAULT 'Not specified', description TEXT NOT NULL,
created_at TEXT NOT NULL DEFAULT (datetime('now')))`); 
module.exports = db;
