# traffic-web

## About

(Industrial Project) React Frontend and Node.js Backend for Traffic Analysis.

## Livestream Testing

To test the livestream, you need to host a local rtmp server. The instructions
for how to do so are below:

1. Download `MonaServer` (Windows and Linux binaries available, not sure about MacOS)
   Extract it to a local folder and inside you will see `/www/` folder. Create a new
   folder called `temp`. You will use this folder along with OBS to host the rtmp
   live stream. Then run the MonaServer executable (double click `MonaServer.exe` on
   Windows, or execute `./MonaServer` on Linux and MacOS). The RTMP server needs to
   be running as OBS will send the data to this server for other clients to connect
   to.
2. Download `OBS` and setup the stream settings. Set it to custom stream and set the
   server to `rtmp://localhost` and the stream key to `test`. These are the default
   settings for `MonaServer`. Then click `Start Streaming`.
3. (Optional) To confirm that the RTMP stream is working correctly, download `VLC`,
   click on `Media`, go to `Open Network Stream...`, for the network URL enter
   `rtmp://127.0.0.1/temp/test` and click play. If it has all worked, you should see
   what OBS is streaming in VLC which means that other clients can also connect to it,
   including our frontend.
4. At this stage, if we want our frontend to be able to view the RTMP livestream,
   we need to convert it into a format which modern browsers can play back. The
   original RTMP standard relied on a custom Adobe Flash player to interpret it
   which most modern browsers do not support. Instead, we need to use a utility
   in this directory within `./server/utils/ffmpeg.js` which will automatically
   transcribe `rtmp://127.0.0.1/temp/test` and save the on-going stream contents
   into `./server/livestream/`. Our backend will then serve the on-going livestream
   video segments from this server to the frontend after it has converted it into
   the popular `HLS` livestream format. To run this, cd to `./server` and run
   ```bash
   node utils/ffmpeg.js
   ```