// livestream endpoint

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");


router.get("/all", (_, res) => {
   
});

/** 
 * @desc Receives livestream details and stores them in database
*/
router.post('/add', (req, res) => {
    console.log(req.body);
    res.send("Deets recieved!");
});

module.exports = router;