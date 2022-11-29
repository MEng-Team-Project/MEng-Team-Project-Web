// Express
const express = require("express");
const router = express.Router();

/**
 * @route GET api/streams/all
 * @desc List all streams
 * @access Public
 */
router.get("/all", (_, res) => {
    const streams = ["/streams/00001.06585.mp4"];
    res.send(streams);
});

module.exports = router;