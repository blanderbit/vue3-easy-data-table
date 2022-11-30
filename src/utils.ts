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
    const propName = parent ? `${parent}_${key}` : key;
    if (typeof obj[key] === 'object') {
      flattenObj(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  });
  return res;
}
