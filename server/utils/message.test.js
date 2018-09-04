var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        var from = 'Jen';
        var text = 'Some message';
        var message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({
            from,
            text
        });
    });
});

describe('generateLocation', () => {
    it('should generate the correct location object', () => {
        var from = 'Tester';
        var lat = 32;
        var long = -3;
        var locationMessage = generateLocationMessage(from, lat, long);

        expect(typeof locationMessage.createdAt).toBe('number');
        expect(typeof locationMessage.url).toBe('string');
        expect(locationMessage).toMatchObject({
            from,
            url: `https://www.google.com/maps?q=${lat},${long}`
        });
    });
});