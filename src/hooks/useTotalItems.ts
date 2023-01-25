import {
  computed,
  ComputedRef,
  Ref,
  ref,
  watch,
} from 'vue';
import type {
  FilterOption,
  Item,
  Row,
} from '../types/main';
import type { ClientSortOptions, EmitsEventName } from '../types/internal';
import {
  excludeKeysFromObj,
  flattenObj,
  getItemValue,
  unFlattenObj,
  isValidDate,
} from '../utils';
import { ZERO } from '../constants';

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
  items: Ref<Row[]>,
  itemsSelected: Ref<Item[]>,
  searchField: Ref<string | string[]>,
  searchValue: Ref<string>,
  serverItemsLength: Ref<number>,
  multiSort: Ref<boolean>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const selectedItems: Ref<Row[]> = ref([]);
  const itemIgnoreKeys = ['expand', 'index', 'checkbox', 'meta'];

  const generateSearchingTarget = (item: Row): string => {
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

  const updateExactMatchRowsMetaIndex = (rows: Row[]) => {
    const exactMatchRowsDictionary = new Map();
    let exactMatchCounter = ZERO;
    rows.forEach((rowItem, idx) => {
      let index = idx;
      if (rowItem.meta.isExactMatch) {
        index = exactMatchCounter;
        exactMatchCounter += 1;
      }
      exactMatchRowsDictionary.set(rowItem, {
        index,
        exactMatch: rowItem.meta.isExactMatch,
      });
    });

    let maxExactMatchIndex = exactMatchCounter;
    exactMatchRowsDictionary.forEach((dictionaryValue) => {
      if (!dictionaryValue.exactMatch) {
        dictionaryValue.index = maxExactMatchIndex;
        maxExactMatchIndex += 1;
      }
    });

    rows.forEach((rowItem) => {
      if (exactMatchRowsDictionary.has(rowItem)) {
        const { index } = exactMatchRowsDictionary.get(rowItem);
        rowItem.meta.index = index;
      }
    });
  };

  const handleExactMatch = (rowItems: Row[]) => {
    if (!rowItems.length) return;
    rowItems.forEach((rowItem) => {
      rowItem.meta.exactMatchColumns = [];
      const rowItemWithoutControlKeys = flattenObj(excludeKeysFromObj(rowItem, itemIgnoreKeys));
      const rowItemKeys = Object.keys(rowItemWithoutControlKeys);
      rowItemKeys.forEach((rowItemKey) => {
        const hasColumnExactMatch = (isExactMatchCaseSensitive.value
          ? rowItemWithoutControlKeys[rowItemKey].toString() === searchValue.value
          : rowItemWithoutControlKeys[rowItemKey].toString().toLowerCase() === searchValue.value.toLowerCase());
        if (hasColumnExactMatch) {
          rowItem.meta.exactMatchColumns.push(rowItemKey);
        }
      });
      rowItem.meta.isExactMatch = Boolean(rowItem.meta.exactMatchColumns.length);
      handleExactMatch(rowItem.meta.children);
    });
    updateExactMatchRowsMetaIndex(rowItems);
  };

  const isFiltering = computed(() => searchValue.value !== '');

  const rowMatch = (rowItem: Row) => {
    rowItem.meta.children = rowItem.meta.initialChildren.filter(rowMatch);

    if (!isFiltering.value) {
      return true;
    }

    if (rowItem.meta.children.length) {
      rowItem.meta.showChildren = true;
    }
    const isRowMatch = new RegExp(searchValue.value, 'i').test(generateSearchingTarget(rowItem));
    return isRowMatch || rowItem.meta.children.length;
  };

  // items searching
  const itemsSearching = computed((): Row[] => {
    // searching feature is not available in server-side mode
    if (isServerSideMode.value) {
      return items.value;
    }
    return items.value.filter(rowMatch);
  });

  // items filtering
  const itemsFiltering = computed((): Row[] => {
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

  const moveRowsToTheirPosition = (rows: Row[]) => {
    if (!rows.length) {
      return rows;
    }
    rows.forEach((rowItem) => {
      moveRowsToTheirPosition(rowItem.meta.children);
    });
    return rows.sort((rowA, rowB) => rowA.meta.index - rowB.meta.index);
  };

  const sortRows = (sortByArr: string[], sortDescArr: boolean[], itemsToSort: Row[], index: number): Row[] => {
    const sortBy = sortByArr[index];
    const sortDesc = sortDescArr[index];
    const sorted = (index === ZERO ? itemsToSort
      : sortRows(sortByArr, sortDescArr, itemsToSort, index - 1)).sort((rowA: Row, rowB: Row) => {
      let isAllSame = true;
      for (let i = ZERO; i < index; i += 1) {
        if (getItemValue(sortByArr[i], rowA) !== getItemValue(sortByArr[i], rowB)) {
          isAllSame = false;
          break;
        }
      }
      if (isAllSame) {
        const direction = sortDescArr[index] ? -1 : 1;
        const sortValueA = getItemValue(sortBy, rowA);
        const sortValueB = getItemValue(sortBy, rowB);

        if (sortValueA < sortValueB) {
          return -direction;
        }

        if (sortValueA > sortValueB) {
          return direction;
        }

        if (typeof sortValueA === 'string' && typeof sortValueB === 'string') {
          if (isValidDate(sortValueA) && isValidDate(sortValueB)) {
            return direction > ZERO
              ? new Date(sortValueA).getTime() - new Date(sortValueB).getTime()
              : new Date(sortValueB).getTime() - new Date(sortValueA).getTime();
          }
          return direction * sortValueA.localeCompare(sortValueB);
        }
        return ZERO;
      }
      return ZERO;
    });

    // Recursively sort child elements.
    sorted
      .filter((row) => row.meta.children.length)
      .forEach((row) => {
        row.meta.children = sortRows(sortByArr, sortDescArr, row.meta.children, index);
      });
    return sorted;
  };

  // flow: searching => filtering => sorting
  // (last step: sorting)
  const totalItems = computed((): Row[] => {
    const entities = isServerSideMode.value ? items.value : itemsFiltering.value;
    if (isFiltering.value && exactMatch.value) {
      handleExactMatch(entities);
    }
    moveRowsToTheirPosition(entities);
    if (isServerSideMode.value || filteredClientSortOptions.value === null) {
      return entities;
    }
    const { sortBy, sortDesc } = filteredClientSortOptions.value;
    const itemsFilteringSorted = [...entities];
    // multi sort
    if (multiSort && Array.isArray(sortBy) && Array.isArray(sortDesc)) {
      if (!sortBy.length) {
        return itemsFilteringSorted;
      }
      return sortRows(sortBy, sortDesc, itemsFilteringSorted, sortBy.length - 1);
    }
    const isSortByColumnVisible = headerColumns.value.includes(sortBy as string);
    // If sort by column is not visible does not make sense to sort by it.
    if (!isSortByColumnVisible) return itemsFilteringSorted;
    return sortRows([sortBy as string], [sortDesc as boolean], itemsFilteringSorted, ZERO);
  });

  // eslint-disable-next-line max-len
  const totalItemsLength = computed((): number => (isServerSideMode.value ? serverItemsLength.value : totalItems.value.length));

  const clearSearching = (rows: Row[]) => {
    if (!rows.length) return;
    rows.forEach((rowItem) => {
      rowItem.meta.exactMatchColumns = [];
      if (rowItem.meta.index !== rowItem.meta.originalIndex) {
        rowItem.meta.index = rowItem.meta.originalIndex;
      }
      clearSearching(rowItem.meta.children);
    });
  };

  watch(searchValue, () => {
    clearSearching(items.value);
  });

  watch(itemsFiltering, (newVal) => {
    if (filterOptions.value) {
      emits('updateFilter', newVal);
    }
  }, { immediate: true, deep: true });

  watch(selectedItems, (val) => {
    emits('update:itemsSelected', val);
  }, {
    deep: true,
  });

  const changeRowSelectedStateRecursively = (rows: Row[], isChecked: boolean) => {
    if (!rows.length) return;
    rows.forEach((rowItem) => {
      rowItem.meta.selected = isChecked;
      if (rowItem.meta.children.length) {
        changeRowSelectedStateRecursively(rowItem.meta.children, isChecked);
      }
    });
  };

  const toggleSelectAll = (isChecked: boolean): void => {
    if (!isMultiSelect.value) {
      return;
    }
    changeRowSelectedStateRecursively(totalItems.value, isChecked);
    if (!isChecked) {
      selectedItems.value = [];
      return;
    }
    selectedItems.value = totalItems.value;
  };

  const toggleSelectItem = (item: Row):void => {
    const isAlreadySelected = item.meta.selected;
    item.meta.selected = !item.meta.selected;
    if (isAlreadySelected) {
      selectedItems.value = selectedItems.value
        .filter((selectedItem) => item.meta.uniqueIndex !== selectedItem.meta.uniqueIndex);
    } else if (!isMultiSelect.value && selectedItems.value.length === 1) {
      selectedItems.value[0].meta.selected = false;
      selectedItems.value = [item];
    } else {
      const selectItemsArr: Row[] = selectedItems.value;
      selectItemsArr.unshift(item);
      selectedItems.value = selectItemsArr;
    }
  };

  return {
    totalItems,
    selectedItems,
    totalItemsLength,
    toggleSelectAll,
    toggleSelectItem,
  };
}
