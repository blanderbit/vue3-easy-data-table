import { describe, it, expect } from 'vitest';
import { flattenObj, excludeKeysFromObj } from '../src/utils';

describe('Utils', () => {
  describe('flattenObj', () => {
    it('should return flatten object', () => {
      const inputObj = {
        name: 'test',
        nestedProperty: {
          level: 1,
        },
      };
      const expectedResult = {
        name: 'test',
        'nestedProperty.level': 1,
      };
      expect(flattenObj(inputObj)).toEqual(expectedResult);
    });

    it('should not return flatten object because of a non-object param', () => {
      expect(flattenObj([])).toEqual({});
    });

    it('should not return flatten object because of an empty object', () => {
      expect(flattenObj({})).toEqual({});
    });
  });

  describe('excludeKeysFromObj', () => {
    it('should exclude keys from object', () => {
      const inputObj = {
        name: 'test',
        age: 34,
      };
      const expectedResult = {
        name: 'test',
      };
      expect(excludeKeysFromObj(inputObj, ['age'])).toEqual(expectedResult);
    });

    it('should not exclude keys from object because of an empty array of keys', () => {
      const inputObj = {
        name: 'test',
        age: 34,
      };
      expect(excludeKeysFromObj(inputObj, [])).toEqual(inputObj);
    });

    it('should not exclude keys from object because of an empty array of keys', () => {
      const inputObj = {
        name: 'test',
        age: 34,
      };
      expect(excludeKeysFromObj(inputObj)).toEqual(inputObj);
    });

    it('should not exclude keys from object because of an empty object', () => {
      expect(excludeKeysFromObj({}, ['age'])).toEqual({});
    });

    it('should not exclude keys from object because of a non-object param', () => {
      expect(excludeKeysFromObj([], ['age'])).toEqual([]);
    });
  });
});
