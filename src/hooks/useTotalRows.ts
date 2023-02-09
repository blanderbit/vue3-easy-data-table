import {
  computed,
  ComputedRef,
  Ref,
  ref,
  watch,
} from 'vue';
import type {
  FilterOption,
  Row,
} from '../types/main';
import type { ClientSortOptions, EmitsEventName } from '../types/internal';
import {
  excludeKeysFromObj,
  flattenObj,
  getRowValue,
  unFlattenObj,
  isValidDate,
} from '../utils';
import { ZERO } from '../constants';

export default function useTotalRows(
  manageTableProperties: Ref<boolean>,
  checkedTableProperties: Ref<string[]>,
  exactMatch: Ref<boolean>,
  isExactMatchCaseSensitive: Ref<boolean>,
  headerColumns: Ref<string[]>,
  isMultiSelect: ComputedRef<boolean>,
  filteredClientSortOptions: ComputedRef<ClientSortOptions | null>,
  filterOptions: Ref<FilterOption[]>,
  isServerSideMode: ComputedRef<boolean>,
  tableRows: Ref<Row[]>,
  searchField: Ref<string | string[]>,
  searchValue: Ref<string>,
  serverItemsLength: Ref<number>,
  multiSort: Ref<boolean>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const selectedRows: Ref<Row[]> = ref([]);
  const rowIgnoreKeys = ['expand', 'index', 'checkbox', 'meta'];

  const generateSearchingTarget = (row: Row): string => {
    const rowWithoutControlKeys = excludeKeysFromObj(row, rowIgnoreKeys);
    const flattenRow = flattenObj(rowWithoutControlKeys);
    // Obtain those header keys that are not visible to exclude it from row.
    const nonVisibleHeaderKeys = manageTableProperties.value ? Object.keys(flattenRow).filter(
      (key) => !checkedTableProperties.value.includes(key),
    ) : [];
    if (typeof searchField.value === 'string' && searchField.value !== '') {
      // Exclude non visible header keys from flatten row keys and un flat flatten row.
      const unFlattenRow = unFlattenObj(excludeKeysFromObj(flattenRow, nonVisibleHeaderKeys)) as Row;
      return getRowValue(searchField.value, unFlattenRow);
    }
    if (Array.isArray(searchField.value)) {
      const unFlattenRow = unFlattenObj(excludeKeysFromObj(flattenRow, nonVisibleHeaderKeys)) as Row;
      let searchString = '';
      searchField.value.forEach((field) => {
        searchString += getRowValue(field, unFlattenRow);
      });
      return searchString;
    }
    const flattenFilteredRow = excludeKeysFromObj(flattenRow, nonVisibleHeaderKeys);
    return Object.values(flattenFilteredRow).join(' ');
  };

  const updateExactMatchRowsMetaIndex = (rows: Row[]) => {
    const exactMatchRowsDictionary = new Map();
    let exactMatchCounter = ZERO;
    rows.forEach((row, idx) => {
      let index = idx;
      if (row.meta.isExactMatch) {
        index = exactMatchCounter;
        exactMatchCounter += 1;
      }
      exactMatchRowsDictionary.set(row, {
        index,
        exactMatch: row.meta.isExactMatch,
      });
    });

    let maxExactMatchIndex = exactMatchCounter;
    exactMatchRowsDictionary.forEach((dictionaryValue) => {
      if (!dictionaryValue.exactMatch) {
        dictionaryValue.index = maxExactMatchIndex;
        maxExactMatchIndex += 1;
      }
    });

    rows.forEach((row) => {
      if (exactMatchRowsDictionary.has(row)) {
        const { index } = exactMatchRowsDictionary.get(row);
        row.meta.index = index;
      }
    });
  };

  const handleExactMatch = (rows: Row[]) => {
    if (!rows.length) return;
    rows.forEach((row) => {
      row.meta.exactMatchColumns = [];
      const rowWithoutControlKeys = flattenObj(excludeKeysFromObj(row, rowIgnoreKeys));
      const rowKeys = Object.keys(rowWithoutControlKeys);
      rowKeys.forEach((rowKey) => {
        const hasColumnExactMatch = (isExactMatchCaseSensitive.value
          ? rowWithoutControlKeys[rowKey].toString() === searchValue.value
          : rowWithoutControlKeys[rowKey].toString().toLowerCase() === searchValue.value.toLowerCase());
        if (hasColumnExactMatch) {
          row.meta.exactMatchColumns.push(rowKey);
        }
      });
      row.meta.isExactMatch = Boolean(row.meta.exactMatchColumns.length);
      handleExactMatch(row.meta.children);
    });
    updateExactMatchRowsMetaIndex(rows);
  };

  const isFiltering = computed(() => searchValue.value !== '');

  const rowMatch = (row: Row) => {
    row.meta.children = row.meta.initialChildren.filter(rowMatch);

    if (!isFiltering.value) {
      return true;
    }

    if (row.meta.children.length) {
      row.meta.showChildren = true;
    }
    const isRowMatch = new RegExp(searchValue.value, 'i').test(generateSearchingTarget(row));
    return isRowMatch || row.meta.children.length;
  };

  // rows searching
  const rowsSearching = computed((): Row[] => {
    // searching feature is not available in server-side mode
    if (isServerSideMode.value) {
      return tableRows.value;
    }
    return tableRows.value.filter(rowMatch);
  });

  // rows filtering
  const rowsFiltering = computed((): Row[] => {
    let rowsFiltered = [...rowsSearching.value];
    if (filterOptions.value) {
      filterOptions.value.forEach((option: FilterOption) => {
        rowsFiltered = rowsFiltered.filter((row) => {
          const { field, comparison, criteria } = option;
          if (typeof comparison === 'function') {
            return comparison(getRowValue(field, row), criteria as string);
          }
          const rowValue = getRowValue(field, row);
          switch (comparison) {
            case '=':
              return rowValue === criteria;
            case '!=':
              return rowValue !== criteria;
            case '>':
              return rowValue > criteria;
            case '<':
              return rowValue < criteria;
            case '<=':
              return rowValue <= criteria;
            case '>=':
              return rowValue >= criteria;
            case 'between':
              return rowValue >= Math.min(...criteria) && rowValue <= Math.max(...criteria);
            default:
              return rowValue === criteria;
          }
        });
      });
      return rowsFiltered;
    }
    return rowsSearching.value;
  });

  const moveRowsToTheirPosition = (rows: Row[]) => {
    if (!rows.length) {
      return rows;
    }
    rows.forEach((row) => {
      moveRowsToTheirPosition(row.meta.children);
    });
    return rows.sort((rowA, rowB) => rowA.meta.index - rowB.meta.index);
  };

  const sortRows = (sortByArr: string[], sortDescArr: boolean[], rowsToSort: Row[], index: number): Row[] => {
    const sortBy = sortByArr[index];
    const sortDesc = sortDescArr[index];
    const sorted = (index === ZERO ? rowsToSort
      : sortRows(sortByArr, sortDescArr, rowsToSort, index - 1)).sort((rowA: Row, rowB: Row) => {
      let isAllSame = true;
      for (let i = ZERO; i < index; i += 1) {
        if (getRowValue(sortByArr[i], rowA) !== getRowValue(sortByArr[i], rowB)) {
          isAllSame = false;
          break;
        }
      }
      if (isAllSame) {
        const direction = sortDescArr[index] ? -1 : 1;
        const sortValueA = getRowValue(sortBy, rowA);
        const sortValueB = getRowValue(sortBy, rowB);

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
  const totalRows = computed((): Row[] => {
    const entities = isServerSideMode.value ? tableRows.value : rowsFiltering.value;
    if (isFiltering.value && exactMatch.value) {
      handleExactMatch(entities);
    }
    moveRowsToTheirPosition(entities);
    if (isServerSideMode.value || filteredClientSortOptions.value === null) {
      return entities;
    }
    const { sortBy, sortDesc } = filteredClientSortOptions.value;
    const rowsFilteringSorted = [...entities];
    // multi sort
    if (multiSort && Array.isArray(sortBy) && Array.isArray(sortDesc)) {
      if (!sortBy.length) {
        return rowsFilteringSorted;
      }
      return sortRows(sortBy, sortDesc, rowsFilteringSorted, sortBy.length - 1);
    }
    const isSortByColumnVisible = headerColumns.value.includes(sortBy as string);
    // If sort by column is not visible does not make sense to sort by it.
    if (!isSortByColumnVisible) return rowsFilteringSorted;
    return sortRows([sortBy as string], [sortDesc as boolean], rowsFilteringSorted, ZERO);
  });

  // eslint-disable-next-line max-len
  const totalRowsLength = computed((): number => (isServerSideMode.value ? serverItemsLength.value : totalRows.value.length));

  const clearSearching = (rows: Row[]) => {
    if (!rows.length) return;
    rows.forEach((row) => {
      row.meta.exactMatchColumns = [];
      if (row.meta.index !== row.meta.originalIndex) {
        row.meta.index = row.meta.originalIndex;
      }
      clearSearching(row.meta.children);
    });
  };

  watch(searchValue, () => {
    clearSearching(tableRows.value);
  });

  watch(rowsFiltering, (newVal) => {
    if (filterOptions.value) {
      emits('updateFilter', newVal);
    }
  }, { immediate: true, deep: true });

  watch(selectedRows, (val) => {
    emits('update:selectedRows', val);
  }, {
    deep: true,
  });

  const changeRowSelectedStateRecursively = (rows: Row[], isChecked: boolean) => {
    if (!rows.length) return;
    rows.forEach((row) => {
      row.meta.selected = isChecked;
      if (row.meta.children.length) {
        changeRowSelectedStateRecursively(row.meta.children, isChecked);
      }
    });
  };

  const toggleSelectAll = (isChecked: boolean): void => {
    if (!isMultiSelect.value) {
      return;
    }
    changeRowSelectedStateRecursively(totalRows.value, isChecked);
    if (!isChecked) {
      selectedRows.value = [];
      return;
    }
    selectedRows.value = totalRows.value;
  };

  const toggleSelectRow = (row: Row):void => {
    const isAlreadySelected = row.meta.selected;
    row.meta.selected = !row.meta.selected;
    if (isAlreadySelected) {
      selectedRows.value = selectedRows.value
        .filter((selectedRow) => row.meta.uniqueIndex !== selectedRow.meta.uniqueIndex);
    } else if (!isMultiSelect.value && selectedRows.value.length === 1) {
      selectedRows.value[0].meta.selected = false;
      selectedRows.value = [row];
    } else {
      const selectRowsArr: Row[] = selectedRows.value;
      selectRowsArr.unshift(row);
      selectedRows.value = selectRowsArr;
    }
  };

  return {
    totalRows,
    selectedRows,
    totalRowsLength,
    toggleSelectAll,
    toggleSelectRow,
  };
}
