/*
api/analysis - Endpoint

Provides endpoints related to accepting video analysis related requests
and returning video analysis information.
*/

// Express
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Fetch
const fetch = require("node-fetch");

/**
 * @route GET api/analysis/download
 * @desc Download the analytical data for a video stream
 * @access Public
 */
 router.get("/download", async (req, res) => {
    console.log("GET /api/analysis/download", req.query);
    try {
        let stream = req.query.stream;
        const downloadPath = `./server/analysis/${stream}.json`;
        const destination = path.join(process.cwd(), `./server/analysis/${stream}.json`);
        if (fs.existsSync(downloadPath)) {
            return res.download(downloadPath);
        } else {
            const response = await fetch(`http://localhost:6000/api/download`+
                  `?stream=${stream}` +
                  `&destination=${destination}`);
            if (response.status == 400) {
                return res.status(400).send("Can't download file.")
            } else {
                if (fs.existsSync(downloadPath)) {
                    return res.download(downloadPath);
                }
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(424).send("Error downloading video stream analysis file");
    }
});

module.exports = router;