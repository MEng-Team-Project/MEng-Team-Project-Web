/*
api/streams - Endpoint

Provides endpoints related to providing existing recorded videos via the
backend to the frontend or possibly also the ML microservice in the future.
*/

const moment = require("moment");

// Express
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const sqlite3 = require('sqlite3').verbose();
const { exec, spawn, execSync } = require('child_process');
const rimraf = require('rimraf');

let livestreams = {};

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

        await updateStartTimeInLiveStreamDB(db, runningRows);

        db.close();
        console.log(process.cwd());
        runningRows.forEach((livestream) => {
           // console.log(">>> livestream: ", runningLivestreams, livestream.name)
            if (!runningLivestreams.includes(livestream.name)) {
                console.log("yo pls do smth")
                const proc = exec(
                    `node ./server/utils/ffmpeg.js --source ${livestream.source} --livestreamDir ${livestream.name}`,
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
                    console.log(">>>>>>>>>>>>>>>>>>>data: ", data); 
                });
                livestreams[livestream.name] = proc;
                //TODO: edit livestream start time
            }
        })
        // console.log(livestreams);  
    } catch (err) {
        console.log("Server side error retrieving streams." + err);
    }
}

updateLiveStreams();

const updateStartTimeInLiveStreamDB = async (db, rows) => {
    for (const row of rows) {
        const livestream_stmt = db.prepare(
            'UPDATE livestream_times SET start_time = ? WHERE stream_source = ?');
        const start_time =  moment().format("YYYY-MM-DD HH:mm:ss");
        await livestream_stmt.run(start_time, row.source) 
        livestream_stmt.finalize();
    }
}

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
            "creation_date": moment().format("YYYY-MM-DD HH:mm:ss"),
        }));

        const stmt = `SELECT * FROM streams INNER JOIN livestream_times ON streams.source = livestream_times.stream_source;`
        const rows = await new Promise((resolve, reject) => {
            db.all(stmt, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
        //console.log(">>>>>>>>>>>>>>>>>>>>>rows: ", rows);
        rows.forEach(i => data = data.concat(i));
         console.log("data: ", data);
        res.send(data);
        db.close();
    } catch (err) {
        res.status(400).send("Server side error retrieving streams." + err);
    }
});

/** 
 * @route PUT api/streams/upload
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
    try {
        console.log(req.body);
        const db = new sqlite3.Database('main.db');
        const streams_stmt = db.prepare(`INSERT OR IGNORE INTO streams VALUES (?, ?, ?, ?, ?);`);
        const livestream_stmt = db.prepare(`INSERT OR IGNORE INTO livestream_times VALUES (?, ?, ?, ?);`);
        const name = req.body.streamName;
        const port = (req.body.port) ? `:${req.body.port}` : ""
        const source = `${req.body.protocol}://${req.body.ip}${port}/${req.body.directory}`;
        const isRunning = Number(1);
        const isLivestream = Number(1);
        const creation_date = moment(moment().format('YYYY/MM/DD HH:mm:ss')).format("YYYY-MM-DD HH:mm:ss");
        const end_time = null;
        streams_stmt.run(name, source, isRunning, isLivestream, creation_date);
        livestream_stmt.run(name, source, creation_date, end_time);
        streams_stmt.finalize();
        livestream_stmt.finalize();
        db.close();
        updateLiveStreams();
        res.send("Livestream added to database and HLS streaming initialised");
    } catch (err) {
        console.error(err);
        res.status(400).send(`Error: ${err}`);
    }
});

router.post('/edit', (req, res) => {
    try {
        console.log(req.body);
        const db = new sqlite3.Database('main.db');
        const ogSource = req.body.ogSource;
        const name = req.body.streamName;
        const port = (req.body.port) ? `:${req.body.port}` : "";
        const source = `${req.body.protocol}://${req.body.ip}${port}${req.body.directory}`;
        const isRunning = Number(1);
        const isLivestream = Number(1);
        const creation_date = moment(moment().format('YYYY/MM/DD HH:mm:ss')).format("YYYY-MM-DD HH:mm:ss");
        const end_time = null;
    
        const updateStream = new Promise((resolve, reject) => {
            db.run('UPDATE streams SET name=?, source=?, running=?, is_livestream=?, creation_date=? WHERE source=?',
                name, source, isRunning, isLivestream, creation_date, ogSource, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
        });
    
        const updateLivestream = new Promise((resolve, reject) => {
            db.run('UPDATE livestream_times SET stream_name=?, stream_source=?, start_time=?, end_time=? WHERE stream_source=?',
                name, source, creation_date, end_time, ogSource, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
        });
    
        (async() => {
            await Promise.all([updateStream, updateLivestream]);
            db.close();
            updateLiveStreams();
            res.send("Livestream edited in the database and HLS streaming initialized");
        })();
    } catch (err) {
        console.error(err);
        res.status(400).send(`Error: ${err}`);
    }
    
    // try {
    //     console.log(req.body);
    //     const db = new sqlite3.Database('main.db');
    //     const ogSource = req.body.ogSource;
    //     // const streams_stmt = db.prepare(`UPDATE streams SET name=(?), source=(?), running=(?), is_livestream=(?), creation_date=(?) WHERE source=(?);`);
    //     // const livestream_stmt =  db.prepare(`UPDATE livestream_times SET stream_name=(?), stream_source=(?), start_time=(?), end_time=(?), WHERE stream_source=(?);`);

    //     // const streams_livestreams_stmt = db.prepare('UPDATE streams SET name=(?), source=(?), running=(?), is_livestream=(?), creation_date=(?) WHERE source=(?); UPDATE livestream_times SET stream_name=(?), stream_source=(?), start_time=(?), end_time=(?), WHERE stream_source=(?);');
    //     const name = req.body.streamName;
    //     const port = (req.body.port) ? `:${req.body.port}` : ""
    //     const source = `${req.body.protocol}://${req.body.ip}${port}${req.body.directory}`;
    //     const isRunning = Number(1);
    //     const isLivestream = Number(1);
    //     const creation_date = moment(moment().format('YYYY/MM/DD HH:mm:ss')).format("YYYY-MM-DD HH:mm:ss");
    //     const end_time = null;
    //     streams_stmt.run(name, source, isRunning, isLivestream, creation_date, ogSource);
    //      streams_stmt.finalize();
    //     livestream_stmt.run(name, source, creation_date, end_time, ogSource);
    //     livestream_stmt.finalize();
    //     // streams_livestreams_stmt.run(name, source, isRunning, isLivestream, creation_date, ogSource, name, source, creation_date, end_time, ogSource);
    //     /// streams_livestreams_stmt.finalize();
    //     db.close();
    //     updateLiveStreams();
    //     res.send("Livestream edited in database and HLS streaming initialised");
    // } catch (err) {
    //     console.error(err);
    //     res.status(400).send(`Error: ${err}`);
    // }
});


/** 
 * @desc Receives livestream details and deletes database entry
*/
router.post('/delete', async (req, res) => {
    try {
        console.log(req.body);
        const db = new sqlite3.Database('main.db');
        const streams_stmt = db.prepare(`DELETE FROM streams WHERE source=(?);`);
        const livestream_stmt = db.prepare(`DELETE FROM livestream_times WHERE stream_source=(?);`);
        const source = req.body.source;
        await new Promise((resolve, reject) => {
            streams_stmt.run(source, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        await new Promise((resolve, reject) => {
            livestream_stmt.run(source, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        streams_stmt.finalize();
        livestream_stmt.finalize();
        db.close();
        const livestreamFullDir = `./server/livestream/${req.body.name}`;
        if (fs.existsSync(livestreamFullDir)) {
            try {
                deleteFolderRecursive(livestreamFullDir);
                console.log('File deletedd successfully.');
            } catch (error) {
                console.error(error);
            }
        }
        res.send("stream deleted from database/directory and HLS streaming updated");
        updateLiveStreams();
    } catch (err) {
        console.error(err);
        res.status(400).send(`Error: ${err}`);
    }
});

router.post('/deleteVideo', async (req, res) => {
    const livestreamFullDir = `./server/streams/${req.body.source}`;
    if (fs.existsSync(livestreamFullDir)) {
        try {
            rimraf.sync(livestreamFullDir);
            console.log('File deleted successfully.');
        } catch (error) {
            console.error(">>>>>>>>>>error", error);
        }
    }
    res.send("video deleted from directory");
});

function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    }
};

/** 
 * @desc Receives livestream details and updates livestream_times and updatesrunninlivestream
*/
router.post('/update_scrape', (req, res) => {
    try {
        console.log(req.body);
        const db = new sqlite3.Database('main.db');
        const streams_stmt = db.prepare(`UPDATE streams SET running=(?) WHERE source=(?);`);
        const livestream_stmt =  db.prepare(`UPDATE livestream_times SET start_time=(?), end_time=(?) WHERE stream_source=(?);`);
        streams_stmt.run(req.body.running, req.body.source);
        livestream_stmt.run(req.body.start_time, req.body.end_time, req.body.source);
        streams_stmt.finalize();
        livestream_stmt.finalize();
        db.close();
        updateLiveStreams();
        res.send("scrape info updated");
    } catch (err) {
        console.error(err);
        res.status(400).send(`Error: ${err}`);
    }
});

module.exports = router;