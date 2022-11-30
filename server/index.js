// Modules
const express = require("express");
const app = express();
const path = require("path");
const fileUpload = require('express-fileupload');

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
app.use("/api/streams", streams);

// Init
app.listen(port, host, () => {
    console.log(`Hosting server on ${host}:${port}!`) 
});