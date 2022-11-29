// Modules
const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Host and Port
const host = "0.0.0.0";
const port = process.env.PORT || 5000;

app.get('/api/', (req, res) => {
    res.send("Hello, World!");
})

// Init
app.listen(port, host, () => {
    console.log(`Hosting server on ${host}:${port}!`) 
});