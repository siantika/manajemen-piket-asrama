describe('Basic test', () => {
    it('should always pass', () => {
        expect(true).toBe(true);
    });

    it('should always pass with another basic check', () => {
        expect(1 + 1).toBe(2);
    });

    it('should always pass with string comparison', () => {
        expect('hello').toBe('hello');
    });

    it('should always pass with array comparison', () => {
        expect([1, 2, 3]).toEqual([1, 2, 3]);
    });
})
