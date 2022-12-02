import { describe, it, expect } from 'vitest';
import {
  flattenObj,
  excludeKeysFromObj,
  unFlattenObj,
  isObject,
} from '../src/utils';

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

    it('should return flatten object', () => {
      const inputObj = {
        name: 'test',
        nestedProperty: [
          {
            level: 1,
          },
        ],
      };
      const expectedResult = {
        name: 'test',
        'nestedProperty.0.level': 1,
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

    it('should not exclude keys from object because of a non object param (number)', () => {
      expect(excludeKeysFromObj(2, ['age'])).toEqual(2);
    });

    it('should not exclude keys from object because of a non object param (string)', () => {
      expect(excludeKeysFromObj('2', ['age'])).toEqual('2');
    });

    it('should not exclude keys from object because of a non object param (array)', () => {
      expect(excludeKeysFromObj(['age'], ['age'])).toEqual(['age']);
    });

    it('should not exclude keys from object because of a non object param', () => {
      expect(excludeKeysFromObj(undefined, ['age'])).toEqual(undefined);
    });

    it('should not exclude keys from object because of a non object param', () => {
      expect(excludeKeysFromObj(null, ['age'])).toEqual(null);
    });

    it('should not exclude keys from object because of a non-object param', () => {
      expect(excludeKeysFromObj([], ['age'])).toEqual([]);
    });
  });

  describe('unFlattenObj', () => {
    it('should return unFlatten object', () => {
      const input = {
        level1: 1,
        'nested.level2.value1': '1',
        'nested.level2.value2': '2',
      };
      const expected = {
        level1: 1,
        nested: {
          level2: {
            value1: '1',
            value2: '2',
          },
        },
      };
      expect(unFlattenObj(input)).toEqual(expected);
    });

    it('should return unFlatten object', () => {
      const input = {
        level1: 1,
        'nested.0.value1': '1',
        'nested.0.value2': '2',
      };
      const expected = {
        level1: 1,
        nested: [
          {
            value1: '1',
            value2: '2',
          },
        ],
      };
      expect(unFlattenObj(input)).toEqual(expected);
    });

    it('should not unFlatt object because of an empty object', () => {
      expect(unFlattenObj({})).toEqual({});
    });

    it('should not unFlatt object because of a non object param', () => {
      expect(unFlattenObj('string')).toEqual('string');
    });

    it('should not unFlatt object because of a non object param', () => {
      expect(unFlattenObj(26)).toEqual(26);
    });

    it('should not unFlatt object because of a non object param', () => {
      expect(unFlattenObj([])).toEqual([]);
    });

    it('should not unFlatt object because of a non object param', () => {
      expect(unFlattenObj(undefined)).toEqual(undefined);
    });

    it('should not unFlatt object because of a non object param', () => {
      expect(unFlattenObj(null)).toEqual(null);
    });
  });

  describe('isObject', () => {
    it('should return true', () => {
      expect(isObject({})).toBe(true);
    });

    it('should return true', () => {
      expect(isObject({ someValue: 1 })).toBe(true);
    });

    it('should return false', () => {
      expect(isObject([])).toBe(false);
    });

    it('should return false', () => {
      expect(isObject(null)).toBe(false);
    });

    it('should return false', () => {
      expect(isObject(undefined)).toBe(false);
    });

    it('should return false', () => {
      expect(isObject('some str')).toBe(false);
    });

    it('should return false', () => {
      expect(isObject(28)).toBe(false);
    });
  });
});
