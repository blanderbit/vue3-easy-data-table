import {
  Ref,
  ComputedRef,
  ref,
} from 'vue';

import type { Item, Row } from '../types/main';
import type { EmitsEventName, ClickEventType } from '../types/internal';

export default function useClickRow(
  isMultiSelect: ComputedRef<boolean>,
  pageRows: ComputedRef<Row[]>,
  selectedRows: Ref<Row[]>,
  clickEventType: Ref<ClickEventType>,
  showIndex: Ref<boolean>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const firstSelectedRowIndex = ref<string | null>(null);

  const setSelectedMetaForRows = (rows: Row[], selected: boolean) => {
    rows.forEach((row) => {
      row.meta.selected = selected;
    });
  };

  const clearSelection = () => {
    setSelectedMetaForRows(pageRows.value, false);
  };

  const handleShiftKey = (row: Item) => {
    let minKey = pageRows.value.findIndex((pageRow) => pageRow.meta.uniqueIndex === row.meta.uniqueIndex);
    let maxKey = pageRows.value.findIndex((pageRow) => pageRow.meta.uniqueIndex === firstSelectedRowIndex.value);
    const keys = [
      minKey,
      maxKey,
    ];
    [
      minKey,
      maxKey,
    ] = keys.sort((a, b) => a - b);
    clearSelection();
    const pageItemsRange = pageRows.value.slice(minKey, maxKey + 1);
    setSelectedMetaForRows(pageItemsRange, true);
    selectedRows.value = pageItemsRange;
  };

  const handleCtrlKey = (row: Row) => {
    const isAlreadySelected = row.meta.selected;
    if (!isMultiSelect.value) {
      clearSelection();
    }
    firstSelectedRowIndex.value = row.meta.uniqueIndex;
    row.meta.selected = !isAlreadySelected;
    if (isAlreadySelected) {
      selectedRows.value = selectedRows.value
        .filter((selectedRow) => row.meta.uniqueIndex !== selectedRow.meta.uniqueIndex);
    } else if (!isMultiSelect.value && selectedRows.value.length === 1) {
      // If multi select is not allowed, then we need to reset selected flag for
      //  current item and replace array el with the clicked row.
      selectedRows.value[0].meta.selected = false;
      selectedRows.value = [row];
    } else {
      selectedRows.value.unshift(row);
    }
  };

  const clickRow = (event: PointerEvent, row: Row, clickType: ClickEventType) => {
    if (clickEventType.value !== clickType) return;

    if (event.shiftKey && isMultiSelect.value) {
      handleShiftKey(row);
    } else if (event.ctrlKey) {
      handleCtrlKey(row);
    } else {
      clearSelection();
      firstSelectedRowIndex.value = row.meta.uniqueIndex;
      row.meta.selected = true;
      selectedRows.value = [row];
    }

    const clickRowArgument = { ...row };
    if (showIndex.value) {
      const { index } = row;
      clickRowArgument.indexInCurrentPage = index;
    }
    emits('clickRow', clickRowArgument);
  };

  return {
    clickRow,
  };
}
