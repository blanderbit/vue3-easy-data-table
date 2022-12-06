import {
  Ref, ComputedRef, ref, WritableComputedRef, watch,
} from 'vue';

import type { Item, RowItem } from '../types/main';
import type { EmitsEventName, ClickEventType } from '../types/internal';

export default function useClickRow(
  initialRows: Ref<RowItem[]>,
  isMultiSelect: ComputedRef<boolean>,
  pageItems: ComputedRef<Item[]>,
  selectItemsComputed: Ref<Item[]>,
  clickEventType: Ref<ClickEventType>,
  showIndex: Ref<boolean>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const firstSelectedRowIndex = ref<string | null>(null);

  const setSelectedMetaForItems = (items: Item[], selected: boolean) => {
    items.forEach((item) => {
      const rowItem = initialRows.value.find((initialRow) => initialRow.meta.uniqueIndex === item.meta.uniqueIndex);
      if (rowItem) {
        rowItem.meta.selected = selected;
      }
    });
  };

  const clearSelection = () => {
    setSelectedMetaForItems(pageItems.value, false);
  };

  const handleShiftKey = (row: Item) => {
    let minKey = pageItems.value.findIndex((item) => item.meta.uniqueIndex === row.meta.uniqueIndex);
    let maxKey = pageItems.value.findIndex((item) => item.meta.uniqueIndex === firstSelectedRowIndex.value);
    const keys = [
      minKey,
      maxKey,
    ];
    [
      minKey,
      maxKey,
    ] = keys.sort((a, b) => a - b);
    clearSelection();
    const pageItemsRange = pageItems.value.slice(minKey, maxKey + 1);
    setSelectedMetaForItems(pageItemsRange, true);
    selectItemsComputed.value = pageItemsRange;
  };

  const handleCtrlKey = (row: Item) => {
    const isAlreadySelected = row.meta.selected;
    if (!isMultiSelect.value) {
      clearSelection();
    }
    firstSelectedRowIndex.value = row.meta.uniqueIndex;
    row.meta.selected = !isAlreadySelected;
    if (isAlreadySelected) {
      selectItemsComputed.value = selectItemsComputed.value
        .filter((selectedItem) => row.meta.uniqueIndex !== selectedItem.meta.uniqueIndex);
    } else if (!isMultiSelect.value && selectItemsComputed.value.length === 1) {
      // If multi select is not allowed, then we need to reset selected flag for
      //  current item and replace array el with the clicked row.
      selectItemsComputed.value[0].meta.selected = false;
      selectItemsComputed.value = [row];
    } else {
      selectItemsComputed.value.unshift(row);
    }
  };

  const clickRow = (event: PointerEvent, item: Item, clickType: ClickEventType) => {
    if (clickEventType.value !== clickType) return;

    if (event.shiftKey && isMultiSelect.value) {
      handleShiftKey(item);
    } else if (event.ctrlKey) {
      handleCtrlKey(item);
    } else {
      clearSelection();
      firstSelectedRowIndex.value = item.meta.uniqueIndex;
      item.meta.selected = true;
      selectItemsComputed.value = [item];
    }

    const clickRowArgument = { ...item };
    if (showIndex.value) {
      const { index } = item;
      clickRowArgument.indexInCurrentPage = index;
    }
    emits('clickRow', clickRowArgument);
  };

  return {
    clickRow,
  };
}
