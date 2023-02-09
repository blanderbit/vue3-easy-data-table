import {
  Ref,
  computed,
  ComputedRef,
} from 'vue';
import type { Row } from '../types/main';
import type { MultipleSelectStatus } from '../types/internal';

export default function usePageRows(
  currentPaginationNumber: Ref<number>,
  isServerSideMode: ComputedRef<boolean>,
  rows: Ref<Row[]>,
  rowsPerPageRef: Ref<number>,
  selectedRows: Ref<Row[]>,
  showIndex: Ref<boolean>,
  totalRows: ComputedRef<Row[]>,
  totalRowsLength: ComputedRef<number>,
) {
  const currentPageFirstIndex = computed((): number => (currentPaginationNumber.value - 1)
    * rowsPerPageRef.value + 1);

  const currentPageLastIndex = computed((): number => {
    if (isServerSideMode.value) {
      return Math.min(totalRowsLength.value, currentPaginationNumber.value * rowsPerPageRef.value);
    }
    return Math.min(
      totalRows.value.length,
      currentPaginationNumber.value * rowsPerPageRef.value,
    );
  });

  // rows in current page
  const rowsInPage = computed(() => {
    if (isServerSideMode.value) return rows.value;
    return totalRows.value.slice(currentPageFirstIndex.value - 1, currentPageLastIndex.value);
  });

  // rows for render
  const pageRows = computed(() => {
    if (showIndex.value) {
      rowsInPage.value.forEach((row, idx) => {
        row.index = currentPageFirstIndex.value + idx;
      });
    }
    return rowsInPage.value;
  });

  const multipleSelectStatus = computed((): MultipleSelectStatus => {
    if (!selectedRows.value.length) {
      return 'noneSelected';
    }
    return selectedRows.value.length === totalRows.value.length ? 'allSelected' : 'partSelected';
  });

  return {
    currentPageFirstIndex,
    currentPageLastIndex,
    multipleSelectStatus,
    pageRows,
  };
}
