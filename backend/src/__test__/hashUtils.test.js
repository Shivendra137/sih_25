const { canonicalize, reportHashHex, sha256HexFromString } = require('../utils/hash'); 
const crypto = require('crypto');
describe('Hash Utilities', () => {

  describe('reportHashHex', () => {
    test('should produce consistent hash for the same object', () => {
      const obj1 = { b: 2, a: 1 };
      const obj2 = { a: 1, b: 2 };

      const hash1 = reportHashHex(obj1);
      const hash2 = reportHashHex(obj2);

      console.log('Hash of obj1:', hash1);
      console.log('Hash of obj2:', hash2);

      expect(hash1).toBe(hash2);
    });

    test('should produce different hash for different objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 3 };

      const hash1 = reportHashHex(obj1);
      const hash2 = reportHashHex(obj2);

      console.log('Hash of obj1:', hash1);
      console.log('Hash of obj2:', hash2);

      expect(hash1).not.toBe(hash2);
    });

    test('should handle nested objects and arrays', () => {
      const obj = { a: { x: 10, y: [1,2,3] }, b: 5 };
      const hash = reportHashHex(obj);

      console.log('Hash of nested object:', hash);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64); // SHA256 hex length
    });
  });

});
// replace with your module path