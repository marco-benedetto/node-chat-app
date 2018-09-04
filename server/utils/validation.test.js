const expect = require('expect');
const {isRealString} = require('./validation');

describe('validation - isRealString', () => {
    it('should reject non-string values', () => {
        var str = '';
        var res = isRealString(str);

        expect(typeof res).toBe('boolean');
        expect(res).toBe(false);
    });

    it('should reject string with only spaces', () => {
        var str = '    ';
        var res = isRealString(str);

        expect(typeof res).toBe('boolean');
        expect(res).toBe(false);
    });

    it('should allow string with non-space characters', () => {
        var str = '  test  ';
        var res = isRealString(str);

        expect(typeof res).toBe('boolean');
        expect(res).toBe(true);
    });
});