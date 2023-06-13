const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { response } = require('express');

describe('Backend test suite', () => {
    // NEED TO ADD TESTS FOR /api/streams/add
    // NEED TO ADD TESTS FOR /api/streams/edit


    it('tests posting to /api/analysis endpoint', async () => {
        // arrange
        // upload video to be analyzed
        const potentialExistingFilePath = path.join(__dirname, '..', 'server', 'streams', 'test_video_1.mp4');
        if (fs.existsSync(potentialExistingFilePath)) {
            fs.unlinkSync(potentialExistingFilePath);
        }

        const filePath = path.join(__dirname, 'resources', 'videos', 'test_video_1.mp4');
        const uploadVideoResponse = await request('http://localhost:3000')
            .put('/api/streams/upload')
            .attach('stream', filePath);

        const initResponse = await request('http://localhost:3000')
            .post("/api/init")
            .send({
                "stream": filePath
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
        try {
            expect(response.statusCode).toBe(200);
        } catch (err) {
            console.error(response.body);
        }
        expect(response.body).toHaveProperty("metadata");
        expect(response.body).toHaveProperty("tracking_format");
        expect(response.body).toHaveProperty("counts");
        expect(response.body).toHaveProperty("routes");
    }, 30000);

    it('tests deleting from /api/streams/deleteVideo endpoint', async () => {
        // arrange
        // upload video to be deleted
        const potentialExistingFilePath = path.join(__dirname, '..', 'server', 'streams', 'test_video_1.mp4');
        if (fs.existsSync(potentialExistingFilePath)) {
            fs.unlinkSync(potentialExistingFilePath);
        }
        
        const filePath = path.join(__dirname, 'resources', 'videos', 'test_video_1.mp4');
        const uploadVideoResponse = await request('http://localhost:3000')
        .put('/api/streams/upload')
        .attach('stream', filePath);

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

    it('tests retrieving from /api/streams/all endpoint', async() => {

        // arrange
        // add stream to streams

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
                "name": "00001.01350_2022-12-07T15-35-24.000Z.mp4"
            })
        ]));

    }, 10000);


    it('tests /api/init endpoint', async() => {

        // arrange
        // add video file to be analysed
        // Already added in /tests/resources/test_video_1.mp4

        // act
        // send request to /api/init
        const response = await request('http://localhost:3000')
            .post("/api/init")
            .send({
                "stream": __dirname + "/resources/test_video_1.mp4"
            });

        // assert
        // expect response to be 200
        // expect text to be "Video stream analysis successfully started"\n
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Video stream analysis successfully started');
    }, 10000);
});