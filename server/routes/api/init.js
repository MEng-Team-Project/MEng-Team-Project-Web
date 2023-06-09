/*
api/routeAnalytics - Endpoint

Provides endpoints related to accepting video routeAnalytics related requests
and returning video routeAnalytics information.
*/

// Express
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Fetch
const fetch = require("node-fetch");

/**
 * @route POST api/routeAnalytics/
 * @desc Get analytical information for a stream between frames and with classes
 * @access Public
 */
router.post("/", async (req, res) => {
    console.log("POST /api/init/");
    try {
        const body = req.body;
        const response = await fetch(`http://localhost:6000/api/init`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (response.status == 400) {
            return res.status(400).send(data);
        } else {
            return res.send(data);
        }
    } catch (err) {
        console.error(err);
        return res.status(424).send("Error posting init:", err);
    }
})

module.exports = router;