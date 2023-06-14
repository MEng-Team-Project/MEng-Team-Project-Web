/*
api/routes - Endpoint

Provides endpoints related to the manually annotated route polygons
which are used to denote which parts of a video stream relate to which
roads on our minimap when the user is analysing data.
*/

// Express
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const sqlite3 = require('sqlite3').verbose();
const fetch = require('node-fetch');

/**
 * @route GET api/routes/
 * @desc Returns the route polygon information for a stream in JSON format
 * @param {String} Stream - Stream Name
 * @access Public
 */
router.get("/", async (req, res) => {
    console.log("GET /api/routes/:streamName", req.query);
    const dbPath = path.join(__dirname, "../../..", 'main.db');
    console.log("req.query.stream_name:", req.query.stream_name);
    try {
        let stream = req.query.stream_name;

        // Ensure a recorded video is added to the DB if it hasn't already been (for livestreams this doesn't matter)
        const livestreamDetails = {"directory": "", "ip": "", "port": 0, "streamName": stream.streamName, "protocol": ""};
        fetch("/api/streams/add", {
            method: 'POST',
            body: livestreamDetails
        })
            .then(res => console.log(res))
            .catch(err => console.error(err))

        const db = new sqlite3.Database(dbPath);
        const stmt = `SELECT polygon_json FROM routes WHERE stream_name=?;`;
        const rows = await new Promise((resolve, reject) => {
            db.all(stmt, [stream], (err, rows) => {
                console.log("API ROUTES :streamName", err, rows);
                if (err) reject(err);
                resolve(rows);
            });
        });
        console.log("data: ", rows);
        res.send(rows);
        db.close();
    } catch (err) {
        console.error(err);
        return res.status(424).send(`Error retrieving routes for stream: ${err}`);
    }
});

/** 
 * @route DELETE api/routes/
 * @desc Delete existing route information for a stream
 * @param {String} Stream - Stream Name
*/
router.delete('/', (req, res) => {
    try {
        console.log(req.body);
        const db = new sqlite3.Database('main.db');
        const delete_stmt = db.prepare(`DELETE FROM routes WHERE stream_name = ?;`);
        const name = req.query.stream_name;
        delete_stmt.run(name);
        delete_stmt.finalize();
        db.close();
        res.send(`Route deleted: ${name}`);
    } catch (err) {
        console.error(err);
        res.status(400).send(`Error: ${err}`);
    }
});

/** 
 * @route POST api/routes/set
 * @desc Sets the `polygon_json` information for a stream
 * @param {String} Stream - Stream Name
 * @param {String} polygon_json - Polygon JSON data
*/
router.post('/set', (req, res) => {
    try {
        console.log(req.body);
        const db = new sqlite3.Database('main.db');
        const routes_stmt = db.prepare(`INSERT OR REPLACE INTO routes VALUES (?, ?);`);
        const name = req.body.stream_name;
        const polygon_json = JSON.stringify(req.body.polygon_json);
        routes_stmt.run(name, polygon_json);
        routes_stmt.finalize();
        db.close();
        res.send(`Routes inserted from livestream source: ${name}`);
    } catch (err) {
        console.error(err);
        res.status(400).send(`Error: ${err}`);
    }
});

module.exports = router;