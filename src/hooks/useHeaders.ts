import {
  ref, Ref, computed, ComputedRef, WritableComputedRef, watch,
} from 'vue';
import type { Header, SortType } from '../types/main';
import type {
  ServerOptionsComputed, HeaderForRender, ClientSortOptions, EmitsEventName,
} from '../types/internal';

export default function useHeaders(
  tableProperties: Ref<Header[]>,
  manageTableProperties: Ref<boolean>,
  checkedTableProperties: Ref<string[]>,
  checkboxColumnWidth: Ref<number>,
  expandColumnWidth: Ref<number>,
  fixedCheckbox: Ref<boolean>,
  fixedExpand: Ref<boolean>,
  fixedIndex: Ref<boolean>,
  headers: Ref<Header[]>,
  ifHasExpandSlot: ComputedRef<boolean>,
  indexColumnWidth: Ref<number>,
  isServerSideMode: ComputedRef<boolean>,
  mustSort: Ref<boolean>,
  serverOptionsComputed: WritableComputedRef<ServerOptionsComputed | null>,
  showIndex: Ref<boolean>,
  sortBy: Ref<string | string[]>,
  sortType: Ref<SortType | SortType[]>,
  multiSort: Ref<boolean>,
  updateServerOptionsSort: (newSortBy: string, newSortType: SortType | null) => void,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const groupedHeaders = ref<HeaderForRender[]>([]);
  const initialHeaders = computed(() => headers.value.map((header) => ({
    ...header,
    visible: header.visible ?? true,
  })));
  const initialVisibleHeaders = computed(() => initialHeaders.value.filter((header) => header.visible));

  watch(initialVisibleHeaders, (currVal) => {
    tableProperties.value = currVal;
    if (manageTableProperties.value) {
      checkedTableProperties.value = currVal.map((header) => header.value);
    }
  }, {
    immediate: true,
  });

  // Visible headers if user change visibility of table properties.
  const visibleHeaders = computed(() => {
    if (manageTableProperties.value) {
      return initialVisibleHeaders.value.filter((header) => checkedTableProperties.value.includes(header.value));
    }
    return initialVisibleHeaders.value;
  });
  const hasFixedColumnsFromUser = computed(() => visibleHeaders.value.findIndex((header) => header.fixed) !== -1);
  const fixedHeadersFromUser = computed(() => {
    if (hasFixedColumnsFromUser.value) return visibleHeaders.value.filter((header) => header.fixed);
    return [];
  });
  const unFixedHeaders = computed(() => visibleHeaders.value.filter((header) => !header.fixed));

  // eslint-disable-next-line max-len
  const generateClientSortOptions = (sortByValue: string | string[], sortTypeValue: SortType | SortType[]): ClientSortOptions | null => {
    // multi sort
    if (Array.isArray(sortByValue) && Array.isArray(sortTypeValue)) {
      return {
        sortBy: sortByValue,
        sortDesc: sortTypeValue.map((val: SortType) => val === 'desc'),
      };
    }
    // single sort
    if (sortByValue !== '') {
      return {
        sortBy: sortBy.value,
        sortDesc: sortType.value === 'desc',
      };
    }
    return null;
  };

  const clientSortOptions = ref<ClientSortOptions | null>(generateClientSortOptions(sortBy.value, sortType.value));

  // headers for render (integrating sortType,z checkbox...)
  const headersForRender = computed((): HeaderForRender[] => {
    // fixed order
    const fixedHeaders = [...fixedHeadersFromUser.value,
      ...unFixedHeaders.value] as HeaderForRender[];
    // sorting
    const headersSorting: HeaderForRender[] = fixedHeaders.map((header: HeaderForRender) => {
      const headerSorting: HeaderForRender = Object.assign(header);

      if (headerSorting.sortable) headerSorting.sortType = 'none';

      // server mode
      if (serverOptionsComputed.value) {
        if (Array.isArray(serverOptionsComputed.value.sortBy) && Array.isArray(serverOptionsComputed.value.sortType)
        && serverOptionsComputed.value.sortBy.includes(headerSorting.value)) {
          // multi sort
          const index = serverOptionsComputed.value.sortBy.indexOf(headerSorting.value);
          headerSorting.sortType = serverOptionsComputed.value.sortType[index];
        } else if (headerSorting.value === serverOptionsComputed.value.sortBy && serverOptionsComputed.value.sortType) {
          // single sort
          headerSorting.sortType = serverOptionsComputed.value.sortType as SortType;
        }
      }

      // client mode
      // multi sort
      if (clientSortOptions.value
          && Array.isArray(clientSortOptions.value.sortBy)
          && Array.isArray(clientSortOptions.value.sortDesc)
          && clientSortOptions.value.sortBy.includes(headerSorting.value)) {
        const index = clientSortOptions.value.sortBy.indexOf(headerSorting.value);
        headerSorting.sortType = clientSortOptions.value.sortDesc[index] ? 'desc' : 'asc';
      } else if (clientSortOptions.value && headerSorting.value === clientSortOptions.value.sortBy) {
        // single sort
        headerSorting.sortType = clientSortOptions.value.sortDesc ? 'desc' : 'asc';
      }
      return headerSorting;
    });
    // expand icon
    let headersWithExpand: HeaderForRender[] = [];
    if (!ifHasExpandSlot.value) {
      headersWithExpand = headersSorting;
    } else {
      const headerExpand: HeaderForRender = (fixedExpand.value || hasFixedColumnsFromUser.value) ? {
        text: '', value: 'expand', fixed: true, width: expandColumnWidth.value,
      } : { text: '', value: 'expand' };
      headersWithExpand = [headerExpand, ...headersSorting];
    }
    // show index
    let headersWithIndex: HeaderForRender[] = [];
    if (!showIndex.value) {
      headersWithIndex = headersWithExpand;
    } else {
      const headerIndex: HeaderForRender = (fixedIndex.value || hasFixedColumnsFromUser.value) ? {
        text: '#', value: 'index', fixed: true, width: indexColumnWidth.value,
      } : { text: '#', value: 'index' };
      headersWithIndex = [headerIndex, ...headersWithExpand];
    }
    // checkbox
    let headersWithCheckbox: HeaderForRender[] = [];
    const headerCheckbox: HeaderForRender = (fixedCheckbox.value || hasFixedColumnsFromUser.value) ? {
      text: 'checkbox', value: 'checkbox', fixed: true, width: checkboxColumnWidth.value ?? 36,
    } : { text: 'checkbox', value: 'checkbox' };
    headersWithCheckbox = [headerCheckbox, ...headersWithIndex];
    return headersWithCheckbox.filter((header) => !header.grouped);
  });

  const headerColumns = computed((): string[] => headersForRender.value.map((header) => header.value));

  const updateSortField = (newSortBy: string, oldSortType: SortType | 'none') => {
    let newSortType: SortType | null = null;
    if (oldSortType === 'none') {
      newSortType = 'asc';
    } else if (oldSortType === 'asc') {
      newSortType = 'desc';
    } else {
      newSortType = (mustSort.value) ? 'asc' : null;
    }

    if (isServerSideMode.value) {
      // update server options
      updateServerOptionsSort(newSortBy, newSortType);
    }

    // multi sort
    if (clientSortOptions.value && Array.isArray(clientSortOptions.value.sortBy)
      && Array.isArray(clientSortOptions.value.sortDesc)) {
      const index = clientSortOptions.value.sortBy.indexOf(newSortBy);
      if (index === -1) {
        if (newSortType !== null) {
          clientSortOptions.value.sortBy.push(newSortBy);
          clientSortOptions.value.sortDesc.push(newSortType === 'desc');
        }
      } else if (newSortType === null) {
        clientSortOptions.value.sortDesc.splice(index, 1);
        clientSortOptions.value.sortBy.splice(index, 1);
      } else {
        clientSortOptions.value.sortDesc[index] = newSortType === 'desc';
      }
    } else if (newSortType === null) {
      clientSortOptions.value = null;
    } else {
      clientSortOptions.value = {
        sortBy: newSortBy,
        sortDesc: newSortType === 'desc',
      };
    }
    emits('updateSort', {
      sortType: newSortType,
      sortBy: newSortBy,
    });
  };

  const filteredClientSortOptions = computed(() => {
    if (!clientSortOptions.value) return null;
    if (Array.isArray(clientSortOptions.value.sortBy) && Array.isArray(clientSortOptions.value.sortDesc)) {
      if (!manageTableProperties.value) return clientSortOptions.value;
      // If the sortBy property includes the column that is not visible
      //  it should be excluded from sortBy array because it does not make sense
      //  to sort by column that is not visible.
      const nonVisibleSortByColumnKeys = clientSortOptions.value.sortBy.reduce((acc: number[], sortByColumn, idx) => {
        if (!headerColumns.value.includes(sortByColumn)) {
          acc.push(idx);
        }
        return acc;
      }, []);
      const filteredSortBy = clientSortOptions.value.sortBy
        .filter((_, idx) => !nonVisibleSortByColumnKeys.includes(idx));
      const filteredSortDesc = clientSortOptions.value.sortDesc
        .filter((_, idx) => !nonVisibleSortByColumnKeys.includes(idx));
      return {
        sortBy: filteredSortBy,
        sortDesc: filteredSortDesc,
      };
    }
    return clientSortOptions.value;
  });

  const isMultiSorting = (headerText: string): boolean => {
    if (serverOptionsComputed.value && Array.isArray(serverOptionsComputed.value.sortBy)) {
      return serverOptionsComputed.value.sortBy.includes(headerText);
    }
    if (filteredClientSortOptions.value && Array.isArray(filteredClientSortOptions.value.sortBy)) {
      return filteredClientSortOptions.value.sortBy.includes(headerText);
    }
    return false;
  };

  const getMultiSortNumber = (headerText: string) => {
    if (serverOptionsComputed.value && Array.isArray(serverOptionsComputed.value.sortBy)) {
      return serverOptionsComputed.value.sortBy.indexOf(headerText) + 1;
    }
    if (filteredClientSortOptions.value && Array.isArray(filteredClientSortOptions.value.sortBy)) {
      return filteredClientSortOptions.value.sortBy.indexOf(headerText) + 1;
    }
    return false;
  };

  return {
    groupedHeaders,
    filteredClientSortOptions,
    headerColumns,
    headersForRender,
    updateSortField,
    isMultiSorting,
    getMultiSortNumber,
  };
}
