const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Database error:", err.message);
  else console.log("✅ Connected to SQLite database");
});

db.runAsync = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    this.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

db.getAsync = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    this.get(sql, params, function (err, row) {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.allAsync = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    this.all(sql, params, function (err, rows) {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

async function initDb() {
  await db.runAsync(
    "CREATE TABLE IF NOT EXISTS users (" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "username TEXT UNIQUE NOT NULL, " +
    "email TEXT UNIQUE NOT NULL, " +
    "password_hash TEXT NOT NULL, " +
    "created_at DATETIME DEFAULT CURRENT_TIMESTAMP" +
    ")"
  );

  await db.runAsync(
    "CREATE TABLE IF NOT EXISTS tasks (" +
    "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
    "user_id INTEGER NOT NULL, " +
    "title TEXT NOT NULL, " +
    "day TEXT NOT NULL, " +
    "due_date TEXT NOT NULL, " +
    "completed INTEGER DEFAULT 0, " +
    "created_at DATETIME DEFAULT CURRENT_TIMESTAMP" +
    ")"
  );

  console.log("✅ Tables created automatically");
}

initDb();

module.exports = db;
