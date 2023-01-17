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

/**
 * @route GET api/streams/all
 * @desc Returns all existing recorded video streams
 * @access Public
 */


router.get("/all", (_, res) => {
    try {
        fs.readdir("./server/streams", (err, files) => {
            console.log(err)
            if (err) return res.status(400).send("Error: Can't read local streams.");
            const data = files.map(file => path.basename(file));
            const tmpData =data.concat("livestream");//TODO: hardcoded livestream option
            res.send(tmpData);
        });
    } catch (err) {
        return res.status(400).send("Server side error retrieving streams." + err);
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

module.exports = router;