# MEng-Team-Project-Web

## About

(Industrial Project) React Frontend and Node.js Backend for Traffic Analysis.

## Docker

Create a new Docker volume for `node_modules`.
This will allow us to use
Node.js modules installed within the Docker container but still allow us
to live-reload our code from the git repo stored outside of Docker during development.
This is required as you might be running a different OS (e.g. Windows, MacOS, etc.) or config, etc. than the container.

```bash
docker volume create --name nodemodules
```

Build the docker image locally.

```bash
docker build -t traffic-web .
```

Run the frontend and backend simultaneously (Powershell)

<!-- NOTE: Add `--name traffic-web \` if you want to only use one container>
<!--Powershell-->

```bash
docker run `
    -p 3000:3000 `
    -p 5000:5000 `
    -v ${pwd}/:/usr/src/app `
    -v nodemodules:/usr/src/app/node_modules `
    traffic-web npm run dev
```

<!-- Bash -->
Run the frontend and backend simultaneously (Bash, etc.)

```bash
docker run \
    -p 3000:3000 \
    -p 5000:5000 \
    -v `pwd`/:/usr/src/app \
    -v nodemodules:/usr/src/app/node_modules \
    traffic-web npm run dev
```

<!--
```bash
docker run -p 3000:3000 -p 5000:5000 traffic-web
```
-->

## Setup

To setup this repository, you need to run the following steps:

Firstly, you need to install the node modules required by the backend
server by running the following command:

```bash
npm i
```

Then you need to install the ReactJS modules required by the client. To do this,
run the following commmands:

```bash
cd client
npm i
```

Finally, the backend server is dependent on 3 directories being present to
work properly. To do this, run the following code:

```bash
cd server
mkdir streams
mkdir analysis
mkdir livestream
```

## Usage

To run both the frontend and backend (and have them update every time
you save either one of them, handy for fast development!) just run:

```bash
npm run dev
```

If you only want to run the backend server, run:

```bash
npm run server
```

If you only want to run the client without the server, run:

```bash
npm run client
```

## Livestream Testing

### Local Test

For local testing only, you can use a pre-recorded video and livestream it
from the backend to the frontend. To do this, make sure the bottom
line of `./server/utils/ffmpeg.js` is
```js
createTestRecordedStream("SEM_ID_TRAFFIC_TEST_TILTON_TINY.mp4");
```
and run `node ./server/utils/ffmpeg.js`;

### Production Test

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