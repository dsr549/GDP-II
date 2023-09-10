const sqlite3 = require('sqlite3').verbose();

// Change ':memory:' to the path of the database file
const db = new sqlite3.Database('.src/services/admin.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE,
            password TEXT)`,
            (err) => {
                if (err) {
                    console.error('Could not create table', err);
                }
            });
    }
});

module.exports = db;