// Express
const express = require("express");
const router = express.Router();

/**
 * @route GET api/analysis/download
 * @desc Download the analytical data for a video stream
 * @access Public
 */
 router.get("/download", (req, res) => {
    console.log("GET /api/analysis/download", req.query);
    try {
        let stream = req.query.stream;
        const downloadPath = `./server/analysis/${stream}.csv`;
        res.download(downloadPath);
    } catch (err) {
        console.error(err);
        return res.status(424).send("Error downloading video stream analysis file");
    }
});

module.exports = router;