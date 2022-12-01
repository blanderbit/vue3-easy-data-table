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
  if (typeof obj !== 'object') return obj;
  const objKeys = Object.keys(obj);
  if (!objKeys.length) return obj;
  return objKeys.filter((objectKey) => !ignoreObjectKeys.includes(objectKey)).reduce((acc: Item, key) => {
    acc[key] = obj[key];
    return acc;
  }, {});
}
