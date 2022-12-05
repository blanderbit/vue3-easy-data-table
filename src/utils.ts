import type { Item } from './types/main';

export function getItemValue(column: string, item: Item) {
  if (column.includes('.')) {
    let content: any = '';
    const keys = column.split('.');
    const { length } = keys;
    let i = 0;
    while (i < length) {
      content = (i === 0 ? item[keys[i]] : content[keys[i]]);
      i += 1;
      if (content === undefined) break;
    }
    return content;
  }
  return item[column];
}

export function generateColumnContent(column: string, item: Item) {
  const content = getItemValue(column, item);
  return Array.isArray(content) ? content.join(',') : content;
}

/**
 * Check if passed value is an object
 * @param {Object} object - Input object
 * @return {Boolean} - true | false
 */
export function isObject(object: Item) {
  return typeof object === 'object'
        && !Array.isArray(object)
        && object !== null;
}

/**
 * Obtain a new object in which all elements of nested objects
 * have been recursively "raised" to the top level.
 * @param {Object} obj - Input object.
 * @param {Object} parent - Parent object.
 * @param {Object} res - Flatten object.
 */
export function flattenObj(obj: Item, parent: string | null = null, res: Item = {}) {
  if (typeof obj !== 'object') return res;
  const objKeys = Object.keys(obj);
  if (!objKeys.length) return res;
  objKeys.forEach((key) => {
    const propName = parent ? `${parent}.${key}` : key;
    if (typeof obj[key] === 'object') {
      flattenObj(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  });
  return res;
}

/**
 * Exclude ignored keys from object.
 * @param {Object} obj - Input object.
 * @param {Array} ignoreObjectKeys - Array of keys that should be excluded.
 * @return {Object} - The object without ignored keys.
 */
export function excludeKeysFromObj(obj: Item, ignoreObjectKeys: string[] = []) {
  if (!isObject(obj) || !Array.isArray(ignoreObjectKeys) || !ignoreObjectKeys.length) return obj;
  const objKeys = Object.keys(obj);
  if (!objKeys.length) return obj;
  return objKeys.filter((objectKey) => !ignoreObjectKeys.includes(objectKey))
    .reduce((acc: Item, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

/**
 * Make un flatten object.
 * @param {Object} flattedObject - Input object.
 * @return {Object} - Un flatten object.
 */
export function unFlattenObj(flattedObject: Item) {
  if (!isObject(flattedObject)) return flattedObject;
  const flattedObjectKeys = Object.keys(flattedObject);
  if (!flattedObjectKeys.length) return flattedObject;
  const result = {};
  flattedObjectKeys.forEach((key) => {
    const keys = key.split('.');
    keys.reduce((acc: Item, currentKey, idx) => {
      if (acc[currentKey]) {
        return acc[currentKey];
      }
      if (!Number.isNaN(Number(keys[idx + 1]))) {
        acc[currentKey] = [];
        return acc[currentKey];
      }
      acc[currentKey] = keys.length - 1 === idx ? flattedObject[key] : {};
      return acc[currentKey];
    }, result);
  });
  return result;
}
