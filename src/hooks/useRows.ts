import {
  ref,
  Ref,
  computed,
  watch,
} from 'vue';
import { v4 as uuidv4 } from 'uuid';
import type { ServerOptions } from '../types/main';
import { Item, RowItem } from '../types/main';
import { GROUP_PARENT_SHIFT } from '../constants';

export default function useRows(
  items: Ref<Item[]>,
  isServerSideMode: Ref<boolean>,
  rowsItems: Ref<number[]>,
  serverOptions: Ref<ServerOptions | null>,
  rowsPerPage: Ref<number>,
) {
  const initialRows = ref<RowItem[]>([]);

  const initializeRows = (rows: Item[], groupParent = 0) => rows.map((row) => {
    const rowChildren: RowItem[] = Array.isArray(row._children) && row._children.length
      ? initializeRows(row._children, groupParent + GROUP_PARENT_SHIFT)
      : [];
    return {
      ...row,
      meta: {
        selected: false,
        uniqueIndex: uuidv4(),
        isExactMatch: false,
        groupParent,
        children: rowChildren,
        initialChildren: rowChildren,
        showChildren: row._showChildren || false,
      },
    } as RowItem;
  });

  watch(items, (currValue) => {
    initialRows.value = initializeRows(currValue);
  }, {
    immediate: true,
  });

  const rowsHaveChildren = computed(() => initialRows.value.some((row) => row.meta.children.length));

  const rowsItemsComputed = computed((): number[] => {
    if (!isServerSideMode.value && rowsItems.value.findIndex((item) => item === rowsPerPage.value) === -1) {
      return [rowsPerPage.value, ...rowsItems.value];
    }
    return rowsItems.value;
  });

  const rowsPerPageRef = ref(serverOptions.value ? serverOptions.value.rowsPerPage : rowsPerPage.value);

  const updateRowsPerPage = (option: number) => {
    rowsPerPageRef.value = option;
  };

  const toggleChildrenVisibility = (event: Event, row: RowItem) => {
    event.stopPropagation();
    row.meta.showChildren = !row.meta.showChildren;
  };

  return {
    initialRows,
    rowsItemsComputed,
    rowsPerPageRef,
    rowsHaveChildren,
    updateRowsPerPage,
    toggleChildrenVisibility,
  };
}
