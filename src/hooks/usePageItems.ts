import {
  Ref, computed, ComputedRef,
} from 'vue';
import type { RowItem } from '../types/main';
import type { MultipleSelectStatus } from '../types/internal';

export default function usePageItems(
  currentPaginationNumber: Ref<number>,
  isServerSideMode: ComputedRef<boolean>,
  items: ComputedRef<RowItem[]>,
  rowsPerPageRef: Ref<number>,
  selectItemsComputed: Ref<RowItem[]>,
  showIndex: Ref<boolean>,
  totalItems: ComputedRef<RowItem[]>,
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
      return itemsInPage.value.map((item, idx) => {
        item.index = currentPageFirstIndex.value + idx;
        return item;
      });
    }
    return itemsInPage.value;
  });

  const multipleSelectStatus = computed((): MultipleSelectStatus => {
    if (selectItemsComputed.value.length === 0) {
      return 'noneSelected';
    }
    return selectItemsComputed.value.length === totalItems.value.length ? 'allSelected' : 'partSelected';
  });

  return {
    currentPageFirstIndex,
    currentPageLastIndex,
    multipleSelectStatus,
    pageItems,
  };
}
