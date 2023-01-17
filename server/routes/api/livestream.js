// livestream endpoint

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const sqlite3 = require('sqlite3').verbose();


router.get("/all", (_, res) => {
   
});

/** 
 * @desc Receives livestream details and stores them in database
*/
router.post('/add', (req, res) => {
    console.log(req.body);
    const db = new sqlite3.Database('main.db');
    const stmt = db.prepare(`INSERT INTO streams VALUES (?, ?, ?, ?);`);
    const name = req.body.streamName;
    const source =`rtmp://${req.body.ip}:${req.body.port}/${req.body.directory}`;
    const isRunning = Number(0); 
    const isLivestream = Number(1);
    stmt.run(name, source, isRunning, isLivestream);
    stmt.finalize();
    res.send("Deets recieved!");
});

module.exports = router;