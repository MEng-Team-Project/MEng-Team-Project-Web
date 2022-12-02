const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const createTestStream = stream => {
    ffmpeg(`./streams/${stream}`, { timeout: 432000 }).addOptions([
        "-profile:v baseline",
        "-level 3.0",
        "-start_number 0",
        "-hls_time 5",
        "-hls_list_size 0",
        "-f hls",
    ]).output("./streams/output.m3u8")
    .on('error', function (err, stdout, stderr) {
        console.log('An error occurred: ' + err.message, err, stderr);
    })
    .on("end", () => {
        console.log(`Finished converting recording to livestream: ${stream}`);
    }).run();
}

createTestStream("SEM_ID_TRAFFIC_TEST_TILTON_TINY.mp4");