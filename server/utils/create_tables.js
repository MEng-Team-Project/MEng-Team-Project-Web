const fs = require("fs");
const path = require("path");
const sqlite3 = require('sqlite3').verbose();

const createTables = (fileName) => {
    const db = new sqlite3.Database(fileName)
    const stmtPath = path.join(__dirname, "..", '/models/create_tables.sql')
    const sqlStatement = fs.readFileSync(stmtPath, encoding = "utf-8");
    db.run(sqlStatement);
    db.close();
}  

//createTables("main.db");
//export default createTables;
module.exports = createTables;