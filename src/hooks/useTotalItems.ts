import {
  Ref, computed, ComputedRef, watch, ref,
} from 'vue';
import type {
  Item, FilterOption, ExactMatchDictionary, RowItem,
} from '../types/main';
import type { ClientSortOptions, EmitsEventName } from '../types/internal';
import { getItemValue } from '../utils';

export default function useTotalItems(
  exactMatch: Ref<boolean>,
  isExactMatchCaseSensitive: Ref<boolean>,
  headerColumns: Ref<string[]>,
  isMultiSelect: ComputedRef<boolean>,
  clientSortOptions: Ref<ClientSortOptions | null>,
  filterOptions: Ref<FilterOption[]>,
  isServerSideMode: ComputedRef<boolean>,
  items: Ref<RowItem[]>,
  itemsSelected: Ref<Item[]>,
  searchField: Ref<string | string[]>,
  searchValue: Ref<string>,
  serverItemsLength: Ref<number>,
  multiSort: Ref<boolean>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const exactMatchDictionary = ref<ExactMatchDictionary>({});

  const excludeControlKeysFromRowKeys = (objectKeys: string[]) => {
    const ignoreKeys = ['expand', 'index', 'checkbox', 'meta'];
    return objectKeys.filter((objectKey) => !ignoreKeys.includes(objectKey));
  };

  const fillExactMatchDictionary = (item: Item, itemUniqueIndex: string, dictionaryKey: string | null = null) => {
    excludeControlKeysFromRowKeys(Object.keys(item)).forEach((itemKey) => {
      if (typeof item[itemKey] === 'object') {
        fillExactMatchDictionary(item[itemKey], itemUniqueIndex, itemKey);
      } else {
        const exactMatchDictionaryKey = dictionaryKey ? `${dictionaryKey}.${itemKey}` : itemKey;
        const hasDictionaryItemsByUniqueIdx = Object.keys(exactMatchDictionary.value[itemUniqueIndex] || {}).length;
        const isExactMatch = (isExactMatchCaseSensitive.value
          ? item[itemKey].toString() === searchValue.value
          : item[itemKey].toString().toLowerCase() === searchValue.value.toLowerCase());
        exactMatchDictionary.value[itemUniqueIndex] = {
          ...(hasDictionaryItemsByUniqueIdx && exactMatchDictionary.value[itemUniqueIndex]),
          [exactMatchDictionaryKey]: isExactMatch,
        };
      }
    });
  };

  const flattenObj = (obj: Item, parent: string | null = null, res: Item = {}) => {
    Object.keys(obj).forEach((key) => {
      const propName = parent ? `${parent}_${key}` : key;
      if (typeof obj[key] === 'object') {
        flattenObj(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    });
    return res;
  };

  const generateSearchingTarget = (item: RowItem): string => {
    if (typeof searchField.value === 'string' && searchField.value !== '') return getItemValue(searchField.value, item);
    if (Array.isArray(searchField.value)) {
      let searchString = '';
      searchField.value.forEach((field) => {
        searchString += getItemValue(field, item);
      });
      return searchString;
    }
    const itemWithoutControlKeys = excludeControlKeysFromRowKeys(Object.keys(item))
      .reduce((acc: Item, key) => {
        acc[key] = item[key];
        return acc;
      }, {});
    return Object.values(flattenObj(itemWithoutControlKeys)).join(' ');
  };

  const sortExactMatchRows = (rows: RowItem[]) => {
    const matchDictionary = new Map();
    let exactMatchCounter = 1;
    rows.forEach((item, idx) => {
      let index = idx;
      if (item.meta.isExactMatch) {
        index = exactMatchCounter;
        exactMatchCounter += 1;
      }
      matchDictionary.set(item, {
        index,
        exactMatch: item.meta.isExactMatch,
      });
    });

    let maxExactMatchIndex = exactMatchCounter;
    matchDictionary.forEach((dictionaryValue) => {
      if (!dictionaryValue.exactMatch) {
        dictionaryValue.index = maxExactMatchIndex;
        maxExactMatchIndex += 1;
      }
    });

    rows.forEach((item) => {
      if (matchDictionary.has(item)) {
        const { index } = matchDictionary.get(item);
        item.index = index;
      }
    });

    rows.sort((a, b) => (a.index > b.index ? 1 : -1));
  };

  // items searching
  const itemsSearching = computed((): RowItem[] => {
    let entities = items.value;
    // searching feature is not available in server-side mode
    if (!isServerSideMode.value && searchValue.value !== '') {
      entities = items.value.filter((item) => new RegExp(searchValue.value, 'i').test(generateSearchingTarget(item)));
    }
    if (exactMatch.value && searchValue.value !== '') {
      entities.forEach((item) => {
        fillExactMatchDictionary(item, item.meta.uniqueIndex);
        item.meta.isExactMatch = Object.values(exactMatchDictionary.value[item.meta.uniqueIndex])
          .some((dictionaryItemKey) => dictionaryItemKey);
      });
      sortExactMatchRows(entities);
    }
    return entities;
  });

  // items filtering
  const itemsFiltering = computed((): Item[] => {
    let itemsFiltered = [...itemsSearching.value];
    if (filterOptions.value) {
      filterOptions.value.forEach((option: FilterOption) => {
        itemsFiltered = itemsFiltered.filter((item) => {
          const { field, comparison, criteria } = option;
          if (typeof comparison === 'function') {
            return comparison(getItemValue(field, item), criteria as string);
          }
          const itemValue = getItemValue(field, item);
          switch (comparison) {
            case '=':
              return itemValue === criteria;
            case '!=':
              return itemValue !== criteria;
            case '>':
              return itemValue > criteria;
            case '<':
              return itemValue < criteria;
            case '<=':
              return itemValue <= criteria;
            case '>=':
              return itemValue >= criteria;
            case 'between':
              return itemValue >= Math.min(...criteria) && itemValue <= Math.max(...criteria);
            default:
              return itemValue === criteria;
          }
        });
      });
      return itemsFiltered;
    }
    return itemsSearching.value;
  });

  watch(itemsFiltering, (newVal) => {
    if (filterOptions.value) {
      emits('updateFilter', newVal);
    }
  }, { immediate: true, deep: true });

  function recursionMuiltSort(sortByArr: string[], sortDescArr: boolean[], itemsToSort: Item[], index: number): Item[] {
    const sortBy = sortByArr[index];
    const sortDesc = sortDescArr[index];
    const sorted = (index === 0 ? itemsToSort
      : recursionMuiltSort(sortByArr, sortDescArr, itemsToSort, index - 1)).sort((a: Item, b: Item) => {
      let isAllSame = true;
      for (let i = 0; i < index; i += 1) {
        if (getItemValue(sortByArr[i], a) !== getItemValue(sortByArr[i], b)) {
          isAllSame = false;
          break;
        }
      }
      if (isAllSame) {
        if (getItemValue(sortBy as string, a) < getItemValue(sortBy as string, b)) return sortDesc ? 1 : -1;
        if (getItemValue(sortBy as string, a) > getItemValue(sortBy as string, b)) return sortDesc ? -1 : 1;
        return 0;
      }
      return 0;
    });
    return sorted;
  }

  // flow: searching => filtering => sorting
  // (last step: sorting)
  const totalItems = computed((): Item[] => {
    if (isServerSideMode.value) return items.value;
    if (clientSortOptions.value === null) return itemsFiltering.value;
    const { sortBy, sortDesc } = clientSortOptions.value;
    const itemsFilteringSorted = [...itemsFiltering.value];
    // multi sort
    if (multiSort && Array.isArray(sortBy) && Array.isArray(sortDesc)) {
      if (sortBy.length === 0) return itemsFilteringSorted;
      return recursionMuiltSort(sortBy, sortDesc, itemsFilteringSorted, sortBy.length - 1);
    }
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    return itemsFilteringSorted.sort((a, b) => {
      if (getItemValue(sortBy as string, a) < getItemValue(sortBy as string, b)) return sortDesc ? 1 : -1;
      if (getItemValue(sortBy as string, a) > getItemValue(sortBy as string, b)) return sortDesc ? -1 : 1;
      return 0;
    });
  });

  // eslint-disable-next-line max-len
  const totalItemsLength = computed((): number => (isServerSideMode.value ? serverItemsLength.value : totalItems.value.length));

  const selectItemsComputed: Ref<Item[]> = ref([]);
  watch(selectItemsComputed, (val) => {
    emits('update:itemsSelected', val);
  }, {
    deep: true,
  });

  const toggleSelectAll = (isChecked: boolean): void => {
    if (!isMultiSelect.value) {
      return;
    }
    selectItemsComputed.value = totalItems.value.map((item) => {
      item.meta.selected = isChecked;
      return item;
    });
    if (!isChecked) {
      selectItemsComputed.value = [];
    }
  };

  const toggleSelectItem = (item: Item):void => {
    const isAlreadySelected = item.meta.selected;
    item.meta.selected = !item.meta.selected;
    if (isAlreadySelected) {
      selectItemsComputed.value = selectItemsComputed.value
        .filter((selectedItem) => item.meta.uniqueIndex !== selectedItem.meta.uniqueIndex);
    } else if (!isMultiSelect.value && selectItemsComputed.value.length === 1) {
      selectItemsComputed.value[0].meta.selected = false;
      selectItemsComputed.value = [item];
    } else {
      const selectItemsArr: Item[] = selectItemsComputed.value;
      selectItemsArr.unshift(item);
      selectItemsComputed.value = selectItemsArr;
    }
  };

  return {
    exactMatchDictionary,
    totalItems,
    selectItemsComputed,
    totalItemsLength,
    toggleSelectAll,
    toggleSelectItem,
  };
}
