import {
  Ref, computed, ComputedRef, WritableComputedRef,
} from 'vue';
import type { Item } from '../types/main';
import type { MultipleSelectStatus } from '../types/internal';

export default function usePageItems(
  currentPaginationNumber: Ref<number>,
  isServerSideMode: ComputedRef<boolean>,
  items: Ref<Item[]>,
  rowsPerPageRef: Ref<number>,
  selectItemsComputed: Ref<Item[]>,
  showIndex: Ref<boolean>,
  totalItems: ComputedRef<Item[]>,
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
  const itemsInPage = computed((): Item[] => {
    if (isServerSideMode.value) return items.value;
    return totalItems.value.slice(currentPageFirstIndex.value - 1, currentPageLastIndex.value);
  });

  // items for render
  const pageItems = computed((): Item[] => {
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
