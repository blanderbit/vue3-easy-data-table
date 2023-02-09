import {
  Ref,
  computed,
  ComputedRef,
} from 'vue';
import type { Row } from '../types/main';
import type { MultipleSelectStatus } from '../types/internal';

export default function usePageItems(
  currentPaginationNumber: Ref<number>,
  isServerSideMode: ComputedRef<boolean>,
  items: Ref<Row[]>,
  rowsPerPageRef: Ref<number>,
  selectedRows: Ref<Row[]>,
  showIndex: Ref<boolean>,
  totalItems: ComputedRef<Row[]>,
  totalItemsLength: ComputedRef<number>,
) {
  const currentPageFirstIndex = computed((): number => (currentPaginationNumber.value - 1)
    * rowsPerPageRef.value + 1);

  const currentPageLastIndex = computed((): number => {
    if (isServerSideMode.value) {
      return Math.min(totalItemsLength.value, currentPaginationNumber.value * rowsPerPageRef.value);
    }
    return Math.min(
      totalItems.value.length,
      currentPaginationNumber.value * rowsPerPageRef.value,
    );
  });

  // items in current page
  const itemsInPage = computed(() => {
    if (isServerSideMode.value) return items.value;
    return totalItems.value.slice(currentPageFirstIndex.value - 1, currentPageLastIndex.value);
  });

  // items for render
  const pageItems = computed(() => {
    if (showIndex.value) {
      itemsInPage.value.forEach((rowItem, idx) => {
        rowItem.index = currentPageFirstIndex.value + idx;
      });
    }
    return itemsInPage.value;
  });

  const multipleSelectStatus = computed((): MultipleSelectStatus => {
    if (!selectedRows.value.length) {
      return 'noneSelected';
    }
    return selectedRows.value.length === totalItems.value.length ? 'allSelected' : 'partSelected';
  });

  return {
    currentPageFirstIndex,
    currentPageLastIndex,
    multipleSelectStatus,
    pageItems,
  };
}
