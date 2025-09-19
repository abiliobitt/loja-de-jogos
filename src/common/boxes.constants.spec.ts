import { volumeOf } from './boxes.constants';

describe('volumeOf', () => {
    it('calculates the volume for [30, 40, 80]', () => {
        expect(volumeOf([30, 40, 80])).toBe(30 * 40 * 80);
    });

    it('calculates the volume for [50, 50, 40]', () => {
        expect(volumeOf([50, 50, 40])).toBe(50 * 50 * 40);
    });

    it('calculates the volume for [50, 80, 60]', () => {
        expect(volumeOf([50, 80, 60])).toBe(50 * 80 * 60);
    });

    it('returns NaN if dims has less than 3 elements', () => {
        expect(volumeOf([1, 2])).toBeNaN();
        expect(volumeOf([])).toBeNaN();
    });

    it('returns NaN if dims contains non-numeric values', () => {
        expect(volumeOf([1, 2, 'a' as any])).toBeNaN();
    });
});