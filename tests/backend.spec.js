const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { response } = require('express');



describe('Backend test suite', () => {
    // NEED TO ADD TESTS FOR /api/streams/add
    // NEED TO ADD TESTS FOR /api/streams/edit

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

      it('tests retrieving from /api/streams/all endpoint', async() => {

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

    it('tests /api/init endpoint', async() => {

        // arrange
        // add video file to be analysed
        await uploadVideoIfNotExist()

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
    }, 10000);

    it('tests posting to /api/analysis endpoint', async () => {
        // arrange
        // upload video to be analyzed
        await uploadVideoIfNotExist()

        const initResponse = await request('http://localhost:3000')
            .post("/api/init")
            .send({
                "stream": path.join(__dirname, '..', 'server', 'streams', 'test_video_1.mp4')
            });

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
        
        const initResponse = await request('http://localhost:3000')
            .post("/api/init")
            .send({
                "stream": path.join(__dirname, '..', 'server', 'streams', 'test_video_1.mp4')
            });

        const analysisResponse = await request('http://localhost:3000')
            .post("/api/analysis")
            .send({
                "stream": "test_video_1.mp4",
                "start": 1,
                "end": 10,
            });

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
        const initResponse = await request('http://localhost:3000')
            .post("/api/init")
            .send({
                "stream": path.join(__dirname, '..', 'server', 'streams', 'test_video_1.mp4')
            });

        // act
        // send request to /api/routeAnalytics
        const response = await request('http://localhost:3000')
            .post("/api/routeAnalytics")
            .set('Accept', 'application/json')
            .send({
                "stream": 'test_video_1',
                "regions" : {
                    "region1": [[0, 0], [960, 0], [960, 540], [0, 540], [0, 0]],
                    "region2": [[960, 0], [1920, 0], [1920, 540], [960, 540], [960, 0]],
                    "region3": [[0, 540], [960, 540], [960, 1080], [0, 1080], [0, 540]],
                    "region4": [[960, 540], [1920, 540], [1920, 1080], [960, 1080], [960, 540]]
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

    // it('tests posting to /api/streams/add endpoint', async() => {
    //     // arrange
    //     // add stream to streams


    //     // act
    //     // send request to /api/streams
    //     const response = await request('http://localhost:3000')
    //         .post("/api/streams/add")
    //         .send({
    //             "directory": directoryValue,
    //             "ip": ipValue,
    //             "port": numericValue,
    //             "streamName": streamName,
    //             "protocol": protocolValue
    //         }
    //     );

    //     // assert
    //     // expect response to be 200
    //     // expect response.text to contain "Livestream added to database and HLS streaming initialised"
    //     expect(response.statusCode).toBe(200);
    //     expect(response.text).toBe('Livestream added to database and HLS streaming initialised');
    // }, 10000);
});