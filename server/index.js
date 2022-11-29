// Modules
const express = require("express");
const app = express();
const path = require("path");

// Middleware
app.use(express.json());
console.log(__dirname + "/streams")
app.use("/streams", express.static(__dirname + "/streams"))

// Host and Port
const host = "0.0.0.0";
const port = process.env.PORT || 5000;

app.get('/api/', (req, res) => {
    res.send("Hello, World!");
})

// Routes
// app.use("/api/streams")

// Init
app.listen(port, host, () => {
    console.log(`Hosting server on ${host}:${port}!`) 
});