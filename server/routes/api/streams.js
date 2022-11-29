// Express
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

/**
 * @route GET api/streams/all
 * @desc List all streams
 * @access Public
 */
router.get("/all", (_, res) => {
    try {
        fs.readdir("./server/streams", (err, files) => {
            console.log(err)
            if (err) return res.status(400).send("Error: Can't read local streams.");
            const data = files.map(file => "/streams/" + path.basename(file));
            res.send(data);
        });
    } catch (err) {
        return res.status(400).send("Server side error retrieving streams." + err);
    }
});

module.exports = router;