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
      delete pageItem.checkbox;
      delete pageItem.index;
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
      delete pageItem.checkbox;
      delete pageItem.index;
      pageItem.meta.selected = true;
    });
    selectItemsComputed.value = pageItemsRange;
  };

  const handleCtrlKey = (row: Item) => {
    const oldSelected = row.meta.selected;
    if (!isMultiSelect.value) {
      console.log('not multi select');
      clearSelection();
    }
    firstSelectedRowIndex.value = row.meta.uniqueIndex;
    row.meta.selected = !oldSelected;

    const isAlreadyChecked = row.checkbox;
    delete row.checkbox;
    delete row.index;
    if (isAlreadyChecked) {
      selectItemsComputed.value = selectItemsComputed.value
        .filter((selectedItem) => row.meta.uniqueIndex !== selectedItem.meta.uniqueIndex);
    } else {
      // If use selectItemsComputed as computed.
      // selectItemsComputed.value = [
      //   row,
      //   ...selectItemsComputed.value,
      // ];
      selectItemsComputed.value.unshift(row);
    }

  // else if (!isMultiSelect.value) {
    // selectItemsComputed.value = [row];
    // }
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
      delete item.checkbox;
      delete item.index;
      selectItemsComputed.value = [item];
    }

    const clickRowArgument = { ...item };
    if (isMultipleSelectable.value) {
      const { checkbox } = item;
      delete clickRowArgument.checkbox;
      clickRowArgument.isSelected = checkbox;
    }
    if (showIndex.value) {
      const { index } = item;
      delete clickRowArgument.index;
      clickRowArgument.indexInCurrentPage = index;
    }
    emits('clickRow', clickRowArgument);
  };

  return {
    clickRow,
  };
}
