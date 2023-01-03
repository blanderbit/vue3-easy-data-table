import { ref, ComputedRef } from 'vue';
import type { EmitsEventName } from '../types/internal';
import { Row } from '../types/main';

export default function useExpandableRow(
  items: ComputedRef<Row[]>,
  prevPageEndIndex: ComputedRef<number>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const expandingItemIndexList = ref<string[]>([]);

  const updateExpandingItemIndexList = (expandingItemIndex: number, expandingItem: Row, event: Event) => {
    event.stopPropagation();
    const index = expandingItemIndexList.value.indexOf(expandingItem.meta.uniqueIndex);
    if (index !== -1) {
      expandingItemIndexList.value.splice(index, 1);
    } else {
      const currentPageExpandIndex = items.value.findIndex((item) => JSON.stringify(item) === JSON.stringify(expandingItem));
      emits('expandRow', prevPageEndIndex.value + currentPageExpandIndex);
      expandingItemIndexList.value.push(expandingItem.meta.uniqueIndex);
    }
  };

  const clearExpandingItemIndexList = () => {
    expandingItemIndexList.value = [];
  };

  return {
    expandingItemIndexList,
    updateExpandingItemIndexList,
    clearExpandingItemIndexList,
  };
}
