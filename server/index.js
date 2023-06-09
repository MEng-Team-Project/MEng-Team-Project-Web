// Argparse Module (Commandline Arguments)
const { ArgumentParser } = require('argparse');
const { version } = require('../package.json');
const parser = new ArgumentParser({
    description: 'Backend for Traffic Analysis. Uses port 5000.'
});
parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('--host', {
    help: "Change IP address backend is hosted",
    default: "0.0.0.0" });
parser.add_argument('--port', {
    help: "Change port of IP address where backend is hosted",
    default: "5000" });
const args = parser.parse_args();

// Modules
const express    = require("express");
const app        = express();
const path       = require("path");
const fileUpload = require('express-fileupload');
const fs         = require("fs");
const hls        = require("hls-server");

// Middleware
app.use(express.json());
app.use(fileUpload());

//init databse
const createTables = require('./utils/create_tables.js');
createTables('main.db');

// NOTE: This directly provides HLS livestreams and recorded MP4 streams
// via this endpoint as it is easier to host it as an endpoint which can
// be preprocessed in future if needed, especially for the livestreams

// Static Video Delivery
app.use("/streams",    express.static(__dirname + "/streams"));
app.use("/livestream", express.static(__dirname + "/livestream"));

// Routes
const init  = require("./routes/api/init");
const streams  = require("./routes/api/streams");
const analysis = require("./routes/api/analysis");
const routeAnalytics = require("./routes/api/routeAnalytics");

// Host and Port
const host = args.host; // "0.0.0.0";
const port = args.port; // 5000;

// Routes
app.use("/api/init", init);
app.use("/api/analysis", analysis);
app.use("/api/streams",  streams);
app.use("/api/routeAnalytics", routeAnalytics);

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
            try {
                console.log(req.filePath);
            } catch (err) {
                
            }
            cb(null, stream);
        },
    }
});