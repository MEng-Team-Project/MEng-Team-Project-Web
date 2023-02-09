/*
api/streams - Endpoint

Provides endpoints related to providing existing recorded videos via the
backend to the frontend or possibly also the ML microservice in the future.
*/


// Express
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const sqlite3 = require('sqlite3').verbose();
const { exec, spawn, execSync } = require('child_process');

let livestreams = { "testStream": null }

const updateLiveStreams = async () => {
    const dbPath = path.join(__dirname, "../../..", 'main.db');
    try {
        const db = new sqlite3.Database(dbPath);
        const stmt = `SELECT * FROM streams;`
        const getRows = new Promise((resolve, reject) => {
            db.all(stmt, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
        const rows = await getRows
        const runningLivestreams = Object.keys(livestreams)
        //console.log(rows);
        const runningRows = rows.filter((livestream) =>
            Boolean(livestream.running)
        )

       // console.log(livestreams);
       // console.log(runningRows);
        console.log(process.cwd());
        runningRows.forEach((livestream) => {
            console.log(">>> livestream: ", runningLivestreams, livestream.name)
            if (!runningLivestreams.includes(livestream.name)) {
                console.log("ello pls do smth")
                const proc = exec(
                    `node ./server/utils/ffmpeg.js --source ${livestream.source}`,
                    (error, stdout, stderr) => {
                        if (error) {
                            console.error(`error: ${error.message}`);
                            return;
                        }
                        if (stderr) {
                            console.error(`stderr: ${stderr}`);
                            return;
                        }
                        console.log(`stdout:\n${JSON.parse(stdout)}`);
                    }
                );
                proc.stdout.on('data', function(data) {
                    console.log(data); 
                });
                livestreams[livestream.name] = proc;
            }
        })
        // console.log(livestreams);
        db.close();
    } catch (err) {
        console.log("Server side error retrieving streams." + err);
    }
}

updateLiveStreams();

/**
 * @route GET api/streams/all
 * @desc Returns all existing recorded video streams
 * @access Public
 */
router.get("/all", async (_, res) => {
    // console.log(__dirname);
    const dbPath = path.join(__dirname, "../../..", 'main.db');
    //console.log(dbPath)

    try {
        const files = await fs.promises.readdir("./server/streams")
        const db = new sqlite3.Database(dbPath);
        let data = files.map(file => ({
            "name": path.basename(file),
            "source": path.basename(file),
            "running": 0,
            "is_livestream": 0,
        }));
        const stmt = `SELECT * FROM streams;`
        const rows = await new Promise((resolve, reject) => {
            db.all(stmt, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
        // console.log("rows: ", rows);
        rows.forEach(i => data = data.concat(i));
        // console.log("data: ", data);
        res.send(data);
        db.close();
    } catch (err) {
        res.status(400).send("Server side error retrieving streams." + err);
    }
});

/** 
 * @route GET api/streams/upload
 * @desc Receives a video recording from the user and uploads it to local storage
 * @param {files} Stream - Video Stream File
 * @access Public
*/
router.put('/upload', (req, res) => {
    console.log("req.files", req.files);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    } else if (!req.files.stream) {
        return res.status(400).send('No video files were uploaded.');
    }

    // Get Upload Path for Stream File
    const streamFile = req.files.stream;
    const fileExt = streamFile.name.split('.').pop();
    if (fileExt != "mp4") {
        return res.status(400).send('Uploaded file is not an mp4 file.');
    }
    const uploadPath = "./server/streams/" + streamFile.name;

    // Use mv() method to place the file in the server
    streamFile.mv(uploadPath, (err) => {
        if (err)
            return res.status(500).send(err);
        res.send("Video stream file uploaded!");
    })
});

/** 
 * @desc Receives livestream details and stores them in database
*/
router.post('/add', (req, res) => {
    console.log(req.body);
    const db = new sqlite3.Database('main.db');
    const stmt = db.prepare(`INSERT INTO streams VALUES (?, ?, ?, ?);`);
    const name = req.body.streamName;
    const port = (req.body.port) ? `:${req.body.port}` : ""
    const source = `${req.body.protocol}://${req.body.ip}${port}/${req.body.directory}`;
    const isRunning = Number(1);
    const isLivestream = Number(1);
    stmt.run(name, source, isRunning, isLivestream);
    stmt.finalize();
    res.send("Deets recieved!");
});

module.exports = router;