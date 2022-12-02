// Modules
const express = require("express");
const app = express();
const path = require("path");
const fileUpload = require('express-fileupload');
const fs  = require("fs");
const hls = require("hls-server");

// Middleware
app.use(express.json());
app.use(fileUpload());
app.use("/streams", express.static(__dirname + "/streams"))

// Routes
const streams = require("./routes/api/streams");
const analysis = require("./routes/api/analysis");

// Host and Port
const host = "0.0.0.0";
const port = process.env.PORT || 5000;

// Routes
app.use("/api/analysis", analysis);
app.use("/api/streams",  streams);

// Init Express
const server = app.listen(port, host, () => {
    console.log(`Hosting server on ${host}:${port}!`) 
});

// HLS Server
new hls(server, {
    provider: {
        exists: (req, cb) => {
            const ext = req.url.split(".").pop();
            if (ext !== "m3u8" && ext != "ts")
                return cb(null, true);
            fs.access(__dirname + req.url, fs.constants.F_OK, (err) => {
                if (err) {
                    console.log(err);
                    return cb(null, false);
                }
                cb(null, true);
            });
        },
        getManifestStream: (req, cb) => {
            const stream = fs.createReadStream(__dirname + req.url);
            cb(null, stream);
        },
        getSegmentStream: (req, cb) => {
            const stream = fs.createReadStream(__dirname + req.url);
            cb(null, stream);
        },
    }
});