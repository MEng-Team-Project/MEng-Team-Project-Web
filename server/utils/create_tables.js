const fs = require("fs");
const path = require("path");
const sqlite3 = require('sqlite3').verbose();

const createTables = (fileName) => {
    const db = new sqlite3.Database(fileName)
    const stmtPath = path.join(__dirname, "..", '/models/create_tables.sql')
    const sqlStatement = fs.readFileSync(stmtPath, encoding = "utf-8");
    db.exec(sqlStatement, (err) => console.error(err));
    db.close();
}  

// createTables("main.db");
module.exports = createTables;