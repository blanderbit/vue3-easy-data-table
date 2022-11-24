import {
  Ref, ComputedRef, ref, WritableComputedRef,
} from 'vue';

import type { Item } from '../types/main';
import type { EmitsEventName, ClickEventType } from '../types/internal';

export default function useClickRow(
  isMultiSelect: ComputedRef<boolean>,
  pageItems: ComputedRef<Item[]>,
  selectItemsComputed: Ref<Item[]>,
  clickEventType: Ref<ClickEventType>,
  isMultipleSelectable: ComputedRef<boolean>,
  showIndex: Ref<boolean>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const firstSelectedRowIndex = ref(null);

  const clearSelection = () => {
    pageItems.value.forEach((pageItem) => {
      pageItem.meta.selected = false;
    });
  };

  const handleShiftKey = (row: Item) => {
    const indexes = [
      row.meta.uniqueIndex,
      firstSelectedRowIndex.value,
    ];
    let minKey = pageItems.value.findIndex((item) => item.meta.uniqueIndex === indexes[0]);
    let maxKey = pageItems.value.findIndex((item) => item.meta.uniqueIndex === indexes[1]);
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
    pageItemsRange.forEach((pageItem) => {
      pageItem.meta.selected = true;
    });
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
    if (isMultipleSelectable.value) {
      const { checkbox } = item;
      clickRowArgument.isSelected = checkbox;
    }
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
