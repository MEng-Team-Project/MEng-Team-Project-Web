const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { response } = require('express');

describe('Backend test suite', () => {
    // Helper to remove and reupload test_video_1.mp4
    const uploadVideoIfNotExist = async () => {
        const potentialExistingFilePath = path.join(__dirname, '..', 'server', 'streams', 'test_video_1.mp4');
        if (fs.existsSync(potentialExistingFilePath)) {
            fs.unlinkSync(potentialExistingFilePath);
        }

        const filePath = path.join(__dirname, 'resources', 'videos', 'test_video_1.mp4');
        await request('http://localhost:3000')
            .put('/api/streams/upload')
            .attach('stream', filePath);
    };

    const copyDatabaseFileIfNotExist = () => {
        const potentialExistingFilePath = path.join(__dirname, '..', 'server', 'analysis', 'test_video_1.db');
        if (!fs.existsSync(potentialExistingFilePath)) {
            fs.copyFileSync(
                path.join(__dirname, 'resources', 'databases', 'test_video_1.db'),
                path.join(potentialExistingFilePath),
            );
        }
    }

    it('tests posting to /api/streams/add endpoint', async() => {
        // arrange
        // check if stream already exists in
        // /api/streams/all
        // if it does, delete it
        const checkResponse = await request('http://localhost:3000')
            .get("/api/streams/all")
            .set('Accept', 'application/json');

        const hasTestStream = checkResponse.body.some(obj => obj.stream_name === "test_stream");

        if (hasTestStream) {
            await request('http://localhost:3000')
                .post("/api/streams/delete")
                .send({
                    "source": "rtmp://127.0.0.1:1935/test_stream"
                });
        }

        // act
        // send request to /api/streams
        const response = await request('http://localhost:3000')
            .post("/api/streams/add")
            .send({
                "directory": "test_stream",
                "ip": "127.0.0.1",
                "port": "1935",
                "streamName": "test_stream",
                "protocol": "rtmp"
            }
        );

        // assert
        // expect response to be 200
        // expect response.text to contain "Livestream added to database and HLS streaming initialised"
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Livestream added to database and HLS streaming initialised');
    }, 10000);

    it('tests posting to /api/streams/edit endpoint', async() => {
        // arrange 
        // add stream to be edited

        // check if stream already exists in
        // /api/streams/all
        // if it does, delete it

        const checkIfExistsResponse = await request('http://localhost:3000')
            .get("/api/streams/all")
            .set('Accept', 'application/json');

        const hasTestStreamToEdit = checkIfExistsResponse.body.some(obj => obj.stream_name === "test_stream_to_edit");
        const hasEditedTestStream = checkIfExistsResponse.body.some(obj => obj.stream_name === "edited_test_stream");

        if (hasTestStreamToEdit) {
            await request('http://localhost:3000')
                .post("/api/streams/delete")
                .send({
                    "source": "rtmp://127.0.0.1:1935/test_stream_to_edit"
                });
        }

        if (hasEditedTestStream) {
            await request('http://localhost:3000')
                .post("/api/streams/delete")
                .send({
                    "source": "rtmp://127.0.0.1:1935/edited_test_stream"
                });
        }

        const addResponse = await request('http://localhost:3000')
            .post("/api/streams/add")
            .send({
                "directory":  "test_stream_to_edit",
                "ip":         "127.0.0.1",
                "port":       "1935",
                "streamName": "test_stream_to_edit",
                "protocol":   "rtmp"
            }
        );
        

        // act
        // send request to /api/streams
        const response = await request('http://localhost:3000')
            .post("/api/streams/edit")
            .send({
                "directory":  "/edited_test_stream",
                "ip":         "127.0.0.1",
                "port":       "1935",
                "streamName": "edited_test_stream",
                "protocol":   "rtmp",
                "ogSource":   "rtmp://127.0.0.1:1935/test_stream_to_edit"
            }
        );

        // assert
        // expect response to be 200
        // expect response.text to contain "Livestream edited in database and HLS streaming initialised"
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Livestream edited in the database and HLS streaming initialized');
    }, 10000);

    it('tests posting to /api/streams/delete endpoint', async() => {
        // arrange
        const checkIfExistsResponse = await request('http://localhost:3000')
            .get("/api/streams/all")
            .set('Accept', 'application/json');

        const hasTestStreamToDelete = checkIfExistsResponse.body.some(obj => obj.stream_name === "test_stream_to_delete");

        if (hasTestStreamToDelete) {
            await request('http://localhost:3000')
                .post("/api/streams/delete")
                .send({
                    "source": "rtmp://127.0.0.1:1935/test_stream_to_delete"
                });
        }

        const addResponse = await request('http://localhost:3000')
            .post("/api/streams/add")
            .send({
                "directory":  "test_stream_to_delete",
                "ip":         "127.0.0.1",
                "port":       "1935",
                "streamName": "test_stream_to_delete",
                "protocol":   "rtmp"
            }
        );
        
        // act
        const response = await request('http://localhost:3000')
            .post("/api/streams/delete")
            .send({
                "source": "rtmp://127.0.0.1:1935/test_stream_to_delete"
            }
        );

        // assert
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('stream deleted from database/directory and HLS streaming updated');
    });



    it('tests putting to /api/streams/upload endpoint', async () => {
        // arrange
        // Remove if already exists so test is accurate
        const potentialExistingFilePath = path.join(__dirname, '..', 'server', 'streams', 'test_video_1.mp4');
        if (fs.existsSync(potentialExistingFilePath)) {
            fs.unlinkSync(potentialExistingFilePath);
        }
        
        const filePath = path.join(__dirname, 'resources', 'videos', 'test_video_1.mp4');
        // act
        const response = await request('http://localhost:3000')
          .put('/api/streams/upload')
          .attach('stream', filePath);
        //   .set('Content-Type', 'multipart/form-data')
        //   .send(formData);
      
        // assert
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Video stream file uploaded!');

        const checkResponse = await request('http://localhost:3000')
        .get("/api/streams/all")
        .set('Accept', 'application/json');
        expect(checkResponse.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                "name": "test_video_1.mp4"
            })
        ]));

      }, 10000);

      it('tests getting from /api/streams/all endpoint', async() => {

        // arrange
        // add stream to streams
        await uploadVideoIfNotExist()

        // act
        // send request to /api/streams/all
        const response = await request('http://localhost:3000')
            .get("/api/streams/all")
            .set('Accept', 'application/json');

        // assert
        // expect response to be 200
        // expect response to contain stream
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                "name": "test_video_1.mp4"
            })
        ]));

    }, 10000);

      it('tests deleting from /api/streams/deleteVideo endpoint', async () => {
        // arrange
        // upload video to be deleted
        await uploadVideoIfNotExist()

        // act
        // send request to /api/streams/deleteVideo
        const response = await request('http://localhost:3000')
            .post("/api/streams/deleteVideo")
            .send({
                "source": "test_video_1.mp4"
            });

        // assert
        // expect response to be 200
        // expect response.text to be "video deleted from directory"
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('video deleted from directory');
    }, 10000);

    it('tests posting to /api/init endpoint', async() => {

        // arrange
        // add video file to be analysed
        await uploadVideoIfNotExist()
        // remove db from analysis folder if already exists
        const potentialExistingFilePath = path.join(__dirname, '..', 'server', 'analysis', 'test_video_1.db');
        if (fs.existsSync(potentialExistingFilePath)) {
            fs.unlinkSync(potentialExistingFilePath);
        }

        // Remove db from init if already exists
        const potentialExistingDb = path.join(__dirname, '..', 'server', 'analysis', 'test_video_1.db');
        if (fs.existsSync(potentialExistingDb)) {
            fs.unlinkSync(potentialExistingDb);
        }

        // act
        // send request to /api/init
        const response = await request('http://localhost:3000')
            .post("/api/init")
            .send({
                "stream": path.join(__dirname, '..', 'server', 'streams', 'test_video_1.mp4')
            });

        // assert
        // expect response to be 200
        // expect text to be "Video stream analysis successfully started"\n
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Video stream analysis successfully started');
    }, 120000);

    it('tests posting to /api/analysis endpoint', async () => {
        // arrange
        // upload video to be analyzed
        await uploadVideoIfNotExist()
        copyDatabaseFileIfNotExist()

        // act
        // send request to /api/analysis
        const response = await request('http://localhost:3000')
            .post("/api/analysis")
            .send({
                "stream": "test_video_1.mp4",
                "start": 1,
                "end": 10,
            });

        // assert
        // expect response to be 200
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("metadata");
        expect(response.body).toHaveProperty("tracking_format");
        expect(response.body).toHaveProperty("counts");
        expect(response.body).toHaveProperty("routes");
    }, 30000);


    it('tests getting from /api/analysis/download endpoint', async () => {
        // arrange
        // upload video to be analyzed
        await uploadVideoIfNotExist()
        copyDatabaseFileIfNotExist()

        // const analysisResponse = await request('http://localhost:3000')
        //     .post("/api/analysis")
        //     .send({
        //         "stream": "test_video_1.mp4",
        //         "start": 1,
        //         "end": 10,
        //     });

        // act
        // send request to /api/analysis/download
        const response = await request('http://localhost:3000')
            .get("/api/analysis/download?stream=test_video_1")
            .set('Accept', 'application/json');

        // assert
        // expect response to be 200
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                "counts": expect.any(Array),
                "metadata": expect.any(Object),
                "routes": expect.any(Object),
                "tracking_format": expect.any(String)
            })
        );

    }, 30000);

    it('tests posting to /api/routeAnalytics endpoint', async () => {
        // arrange
        // upload video to be analyzed
        await uploadVideoIfNotExist()
        copyDatabaseFileIfNotExist()

        // act
        // send request to /api/routeAnalytics
        const response = await request('http://localhost:3000')
            .post("/api/routeAnalytics")
            .set('Accept', 'application/json')
            .send({
                "stream": 'test_video_1',
                "regions" : {
                    "region1": [[0, 0], [640, 0], [640, 360], [0, 360], [0, 0]],
                    "region2": [[640, 0], [1280, 0], [1280, 360], [640, 360], [640, 0]],
                    "region3": [[0, 360], [640, 360], [640, 720], [0, 720], [0, 360]],
                    "region4": [[640, 360], [1280, 360], [1280, 720], [640, 720], [640, 360]]
                },
                "classes": ['car', 'hgv', 'bicycle', 'person'],
                "time_of_recording": new Date("2020-01-01T00:00").toISOString(),
                "start_time": new Date("2020-01-01T00:00").toISOString()
            });

        // assert
        // expect response to be 200
        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual(
            expect.objectContaining({
                "countsAtTimes": expect.any(Array),
                "dataSource": expect.any(String),
                "regions": expect.any(Array)
            })
        );
                
    }, 30000);
});