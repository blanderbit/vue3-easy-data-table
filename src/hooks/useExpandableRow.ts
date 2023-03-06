import { ref, ComputedRef } from 'vue';
import type { EmitsEventName } from '../types/internal';
import { Row } from '../types/main';

export default function useExpandableRow(
  rows: ComputedRef<Row[]>,
  prevPageEndIndex: ComputedRef<number>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const expandingRowIndexList = ref<string[]>([]);

  const updateExpandingItemIndexList = (expandingItemIndex: number, expandingItem: Row, event: Event) => {
    event.stopPropagation();
    const index = expandingRowIndexList.value.indexOf(expandingItem.meta.uniqueIndex);
    if (index !== -1) {
      expandingRowIndexList.value.splice(index, 1);
    } else {
      const currentPageExpandIndex = rows.value.findIndex((row) => row.meta.uniqueIndex === expandingItem.meta.uniqueIndex);
      emits('expandRow', prevPageEndIndex.value + currentPageExpandIndex);
      expandingRowIndexList.value.push(expandingItem.meta.uniqueIndex);
    }
  };

  const clearExpandingItemIndexList = () => {
    expandingRowIndexList.value = [];
  };

  return {
    expandingRowIndexList,
    updateExpandingItemIndexList,
    clearExpandingItemIndexList,
  };
}
