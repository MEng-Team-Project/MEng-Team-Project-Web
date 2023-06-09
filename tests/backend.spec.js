const request = require('supertest');

describe('Backend test suite', () => {
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