import { ref, Ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import type { ServerOptions } from '../types/main';
import { Item, RowItem } from '../types/main';

export default function useRows(
  items: Ref<Item[]>,
  isServerSideMode: Ref<boolean>,
  rowsItems: Ref<number[]>,
  serverOptions: Ref<ServerOptions | null>,
  rowsPerPage: Ref<number>,
) {
  const initialRows = computed((): RowItem[] => items.value.map((item: Item) => ({
    ...item,
    meta: {
      selected: false,
      uniqueIndex: uuidv4(),
      isExactMatch: false,
      groupParent: 0,
    },
  })));

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

  return {
    initialRows,
    rowsItemsComputed,
    rowsPerPageRef,
    updateRowsPerPage,
  };
}
