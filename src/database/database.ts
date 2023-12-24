import sqlite3 from "sqlite3";
import crypto from "crypto";

interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

function generatePassword(length = 8) {
  return crypto.randomBytes(length).toString("hex");
}

let db = new sqlite3.Database("./src/database/users.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQLite database.");
});

export function createTable() {
  console.log("Creating a table");
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            password TEXT NOT NULL
          );`,
    (err) => {
      if (err) {
        console.error("Error in creating table ", err.message);
      } else {
        console.log("Table created");
      }
    }
  );
}

export function insertData(
  name: string,
  email: string,
  username: string,
  firstName: string,
  lastName: string
) {
  const password = generatePassword();

  db.run(
    `INSERT INTO users (name, email, username, firstName, lastName, password) VALUES (?, ?, ?, ?,?,?)`,
    [name, email, username, firstName, lastName, password],
    function (err) {
      if (err) {
        return console.error("Error in inserting data ", err.message);
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    }
  );
}

export function queryAllUsers() {
  db.all(`SELECT * FROM users`, [], (err, rows: User[]) => {
    if (err) {
      console.log("Error in querying data");
      throw err;
    }
    rows.forEach((row) => {
      console.log(row.firstName + " " + row.lastName);
      console.log(row.email);
    });
  });
}

export function getUserByEmail(email: User["email"]) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(row);
    });
  });
}

queryAllUsers();
