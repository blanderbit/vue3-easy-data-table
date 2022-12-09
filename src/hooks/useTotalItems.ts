import {
  Ref, computed, ComputedRef, watch, ref,
} from 'vue';
import type {
  Item, FilterOption, ExactMatchDictionary, RowItem,
} from '../types/main';
import type { ClientSortOptions, EmitsEventName } from '../types/internal';
import {
  getItemValue,
  flattenObj,
  excludeKeysFromObj,
  unFlattenObj,
} from '../utils';

export default function useTotalItems(
  manageTableProperties: Ref<boolean>,
  checkedTableProperties: Ref<string[]>,
  exactMatch: Ref<boolean>,
  isExactMatchCaseSensitive: Ref<boolean>,
  headerColumns: Ref<string[]>,
  isMultiSelect: ComputedRef<boolean>,
  filteredClientSortOptions: ComputedRef<ClientSortOptions | null>,
  filterOptions: Ref<FilterOption[]>,
  isServerSideMode: ComputedRef<boolean>,
  items: ComputedRef<RowItem[]>,
  itemsSelected: Ref<Item[]>,
  searchField: Ref<string | string[]>,
  searchValue: Ref<string>,
  serverItemsLength: Ref<number>,
  multiSort: Ref<boolean>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  // A dictionary containing unique row IDs as keys and as values an object,
  // which containing the column name as a key, a flag indicating whether
  // there is an exact match as a value.
  const rowsWithExactMatchColumnsDictionary = ref<ExactMatchDictionary>({});
  const itemIgnoreKeys = ['expand', 'index', 'checkbox', 'meta'];

  const fillRowsWithExactMatchColumnsDictionary = (item: Item, itemUniqueIndex: string, dictionaryKey: string | null = null) => {
    if (typeof item !== 'object') return;
    const itemWithoutControlKeys = excludeKeysFromObj(item, itemIgnoreKeys);
    const itemKeys = Object.keys(itemWithoutControlKeys);
    if (!itemKeys.length) return;
    itemKeys.forEach((itemKey) => {
      if (typeof item[itemKey] === 'object') {
        fillRowsWithExactMatchColumnsDictionary(item[itemKey], itemUniqueIndex, itemKey);
      } else {
        const exactMatchDictionaryKey = dictionaryKey ? `${dictionaryKey}.${itemKey}` : itemKey;
        const hasDictionaryItemsByRowUniqueIdx = Object
          .keys(rowsWithExactMatchColumnsDictionary.value[itemUniqueIndex] || {}).length;
        const isExactMatch = (isExactMatchCaseSensitive.value
          ? item[itemKey].toString() === searchValue.value
          : item[itemKey].toString().toLowerCase() === searchValue.value.toLowerCase());
        rowsWithExactMatchColumnsDictionary.value[itemUniqueIndex] = {
          ...(hasDictionaryItemsByRowUniqueIdx && rowsWithExactMatchColumnsDictionary.value[itemUniqueIndex]),
          [exactMatchDictionaryKey]: isExactMatch,
        };
      }
    });
  };

  const generateSearchingTarget = (item: RowItem): string => {
    const itemWithoutControlKeys = excludeKeysFromObj(item, itemIgnoreKeys);
    const flattenItem = flattenObj(itemWithoutControlKeys);
    // Obtain those header keys that are not visible to exclude it from item.
    const nonVisibleHeaderKeys = manageTableProperties.value ? Object.keys(flattenItem).filter(
      (key) => !checkedTableProperties.value.includes(key),
    ) : [];
    if (typeof searchField.value === 'string' && searchField.value !== '') {
      // Exclude non visible header keys from flatten item keys and un flat flatten item.
      const unFlattenItem = unFlattenObj(excludeKeysFromObj(flattenItem, nonVisibleHeaderKeys));
      return getItemValue(searchField.value, unFlattenItem);
    }
    if (Array.isArray(searchField.value)) {
      const unFlattenItem = unFlattenObj(excludeKeysFromObj(flattenItem, nonVisibleHeaderKeys));
      let searchString = '';
      searchField.value.forEach((field) => {
        searchString += getItemValue(field, unFlattenItem);
      });
      return searchString;
    }
    const flattenFilteredItem = excludeKeysFromObj(flattenItem, nonVisibleHeaderKeys);
    return Object.values(flattenFilteredItem).join(' ');
  };

  const moveExactMatchRowsUp = (rows: RowItem[]) => {
    const exactMatchRowsDictionary = new Map();
    let exactMatchCounter = 1;
    rows.forEach((item, idx) => {
      let index = idx;
      if (item.meta.isExactMatch) {
        index = exactMatchCounter;
        exactMatchCounter += 1;
      }
      exactMatchRowsDictionary.set(item, {
        index,
        exactMatch: item.meta.isExactMatch,
      });
    });

    let maxExactMatchIndex = exactMatchCounter;
    exactMatchRowsDictionary.forEach((dictionaryValue) => {
      if (!dictionaryValue.exactMatch) {
        dictionaryValue.index = maxExactMatchIndex;
        maxExactMatchIndex += 1;
      }
    });

    rows.forEach((item) => {
      if (exactMatchRowsDictionary.has(item)) {
        const { index } = exactMatchRowsDictionary.get(item);
        item.index = index;
      }
    });

    rows.sort((a, b) => (a.index > b.index ? 1 : -1));
  };

  // items searching
  const itemsSearching = computed((): RowItem[] => {
    rowsWithExactMatchColumnsDictionary.value = {};
    let entities = items.value;
    // searching feature is not available in server-side mode
    if (!isServerSideMode.value && searchValue.value !== '') {
      entities = items.value.filter((item) => new RegExp(searchValue.value, 'i').test(generateSearchingTarget(item)));
    }
    if (exactMatch.value && searchValue.value !== '') {
      entities.forEach((item) => {
        fillRowsWithExactMatchColumnsDictionary(item, item.meta.uniqueIndex);
        item.meta.isExactMatch = Object.values(rowsWithExactMatchColumnsDictionary.value[item.meta.uniqueIndex])
          .some((dictionaryItemKey) => dictionaryItemKey);
      });
      moveExactMatchRowsUp(entities);
    }
    return entities;
  });

  // items filtering
  const itemsFiltering = computed((): RowItem[] => {
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

  function recursionMultiSort(sortByArr: string[], sortDescArr: boolean[], itemsToSort: RowItem[], index: number): RowItem[] {
    const sortBy = sortByArr[index];
    const sortDesc = sortDescArr[index];
    const sorted = (index === 0 ? itemsToSort
      : recursionMultiSort(sortByArr, sortDescArr, itemsToSort, index - 1)).sort((a: RowItem, b: RowItem) => {
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
  const totalItems = computed((): RowItem[] => {
    if (isServerSideMode.value) return items.value;
    if (filteredClientSortOptions.value === null) return itemsFiltering.value;
    const { sortBy, sortDesc } = filteredClientSortOptions.value;
    const itemsFilteringSorted = [...itemsFiltering.value];
    // multi sort
    if (multiSort && Array.isArray(sortBy) && Array.isArray(sortDesc)) {
      if (sortBy.length === 0) return itemsFilteringSorted;
      return recursionMultiSort(sortBy, sortDesc, itemsFilteringSorted, sortBy.length - 1);
    }
    const isSortByColumnVisible = headerColumns.value.includes(sortBy as string);
    // If sort by column is not visible does not make sense to sort by it.
    if (!isSortByColumnVisible) return itemsFilteringSorted;
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    return itemsFilteringSorted.sort((a, b) => {
      if (getItemValue(sortBy as string, a) < getItemValue(sortBy as string, b)) return sortDesc ? 1 : -1;
      if (getItemValue(sortBy as string, a) > getItemValue(sortBy as string, b)) return sortDesc ? -1 : 1;
      return 0;
    });
  });

  // eslint-disable-next-line max-len
  const totalItemsLength = computed((): number => (isServerSideMode.value ? serverItemsLength.value : totalItems.value.length));

  const selectItemsComputed: Ref<RowItem[]> = ref([]);
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

  const toggleSelectItem = (item: RowItem):void => {
    const isAlreadySelected = item.meta.selected;
    item.meta.selected = !item.meta.selected;
    if (isAlreadySelected) {
      selectItemsComputed.value = selectItemsComputed.value
        .filter((selectedItem) => item.meta.uniqueIndex !== selectedItem.meta.uniqueIndex);
    } else if (!isMultiSelect.value && selectItemsComputed.value.length === 1) {
      selectItemsComputed.value[0].meta.selected = false;
      selectItemsComputed.value = [item];
    } else {
      const selectItemsArr: RowItem[] = selectItemsComputed.value;
      selectItemsArr.unshift(item);
      selectItemsComputed.value = selectItemsArr;
    }
  };

  return {
    rowsWithExactMatchColumnsDictionary,
    totalItems,
    selectItemsComputed,
    totalItemsLength,
    toggleSelectAll,
    toggleSelectItem,
  };
}
