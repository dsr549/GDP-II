const jwt = require('jsonwebtoken');
const db = require('../services/database');

class User {
    static async create({ email, password }) {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO users (name, password) VALUES (?, ?)`,
                [email, password],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID, email });
                    }
                });
        });
    }

    static async authenticate({ email, password }) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE name = ?', [email], async (err, row) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(null);
                } else {
                    if (!password === row.password) {
                        resolve(null);
                    } else {
                        const token = jwt.sign({ id: row.id }, "0jLWgauDKDrZ/v0sqtgxX/Z+HwFte6XTK/0cJAGH8YU=");
                        resolve({ id: row.id, email: row.email, token });
                    }
                }
            });
        });
    }
}

module.exports = User;