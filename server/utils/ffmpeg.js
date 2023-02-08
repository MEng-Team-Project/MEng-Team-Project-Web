/*
Utility file which uses ffmpeg wrapped around a node module to provide
a livestream of either:
1) a pre-recorded video
2) an OBS or other RTMP livestream
*/
const { ArgumentParser } = require('argparse');
const parser = new ArgumentParser({
    description: 'Backend for Traffic Analysis. Uses port 5000.'
});
parser.add_argument('--host', {
    help: "Change IP address backend is hosted",
    default: "0.0.0.0" });
parser.add_argument('--source', {
    help: "Stream source",
    default: "0.0.0.0" });
parser.add_argument('--port', {
    help: "Change port of IP address where backend is hosted",
    default: "" });
parser.add_argument('--dir', {
    help: "IP camera sub directory",
    default: "0.0.0.0" });

const args = parser.parse_args();


const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/** 
 * Runs ffmpeg to continuously transcribe a recorded video as a HLS livestream
 * 
 * @param {string} stream VideoID in the backend to host as a livestream
*/
const createTestRecordedStream = stream => {
    ffmpeg(`./streams/${stream}`, { timeout: 432000 }).addOptions([
        "-profile:v baseline",
        "-level 3.0",
        "-start_number 0",
        "-hls_time 5",
        "-hls_list_size 0",
        "-f hls",
    ]).output("./livestreams/output.m3u8")
    .on('error', function (err, stdout, stderr) {
        console.log('An error occurred: ' + err.message, err, stderr);
    })
    .on("end", () => {
        console.log(`Finished converting recording to livestream: ${stream}`);
    }).run();
}

/** 
 * Runs ffmpeg to continuously transcribe a running RTMP stream as a HLS livestream
 * 
 * @param {string} host Host IP address of RTMP stream
 * @param {number} port Host IP address port of RTMP stream
 * @param {path}   path Sub directory within RTMP server to transcribe to HLS livestream
*/
const createTestLiveStream = (source) => {  
    // const url = `rtmp://${host}${path}`;
    console.log(source)
    ffmpeg(source, { timeout: 432000 }).addOptions([
        '-c:v libx264',
        '-c:a aac',
        '-ac 1',
        '-strict -2',
        '-crf 18',
        '-profile:v baseline',
        '-maxrate 400k',
        '-bufsize 1835k',
        '-pix_fmt yuv420p',
        '-hls_time 5',
        '-hls_list_size 6',
        '-hls_wrap 10',
        '-start_number 1'
    ]).output(`./livestream/output.m3u8`)
    .on('error', function (err, stdout, stderr) {
        console.log('An error occurred: ' + err.message, err, stderr);
    })
    .on("end", () => {
        //console.log(`Finished converting recording to livestream: ${stream}`);
        console.log("Stream Ended")
    }).run();
};

// createTestRecordedStream("SEM_ID_TRAFFIC_TEST_TILTON_TINY.mp4");
createTestLiveStream(args.source);