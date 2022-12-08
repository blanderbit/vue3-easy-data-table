import {
  computed,
  ComputedRef,
  Ref,
  ref, watch,
} from 'vue';
import { Header, Item, RowItem } from '../types/main';
import { GroupByItem, HeaderForRender } from '../types/internal';
import {
  flattenObj,
  unFlattenObj,
  interpolateStr,
} from '../utils';

type FlattenItems = (GroupByItem | RowItem)[]

export default function useGroupBy(
  tableHeaders: Ref<Header[]>,
  pageItems: ComputedRef<RowItem[]>,
  groupedHeaders: Ref<HeaderForRender[]>,
) {
  const firstHeaderItemPadding = ref<number | null>(null);
  const gropedByRows = ref<GroupByItem[]>([]);

  watch(tableHeaders, (currVal) => {
    currVal.forEach((tableHeader) => {
      if (tableHeader.groupable && tableHeader.grouped) {
        groupedHeaders.value.push(tableHeader);
      }
    });
  }, {
    immediate: true,
  });

  const group = (headerGroup: HeaderForRender) => {
    const header = tableHeaders.value.find((tableHeader) => tableHeader.value === headerGroup.value);
    if (header) {
      header.grouped = true;
      groupedHeaders.value.push(headerGroup);
    }
  };

  const ungroup = (headerGroup: HeaderForRender) => {
    const header = tableHeaders.value.find((tableHeader) => tableHeader.value === headerGroup.value);
    if (header) {
      header.grouped = false;
      groupedHeaders.value = groupedHeaders.value.filter((groupedHeader) => groupedHeader.value !== headerGroup.value);
    }
  };

  const groupBy = (items: Item[], header: HeaderForRender, groupParent: number): GroupByItem[] => {
    const groupedByColumnRows = items.reduce((acc, item) => {
      item.meta.groupParent = groupParent + 1;
      firstHeaderItemPadding.value = groupParent + 1;
      const flattenItem = flattenObj(item);
      (acc[flattenItem[header.value]] = acc[flattenItem[header.value]] || [])
        .push(unFlattenObj(flattenItem));
      return acc;
    }, {});
    return Object.keys(groupedByColumnRows).map((key) => ({
      groupBy: header.groupBy instanceof Function ? header.groupBy : null,
      [header.value]: key,
      headerValue: header.value,
      children: groupedByColumnRows[key],
      groupHeader: header,
      groupParent,
      showChildren: true,
      isGroup: true,
    }));
  };

  const groupByRecursive = (items: Item[], groupedItems: HeaderForRender[], groupedItemIdx: number, groupParent: number) => {
    if (groupedItems.length === groupedItemIdx) {
      return items;
    }
    items.forEach((item) => {
      item.children = groupBy(item.children, groupedItems[groupedItemIdx], groupParent);
      groupByRecursive(
        item.children,
        groupedItems,
        groupedItemIdx + 1,
        groupParent + 1,
      );
    });
    return null;
  };

  const setGroupLabelRecursive = (items: Item[]) => {
    if (!items.length) return;
    items.forEach((groupedRow) => {
      if (groupedRow.groupBy instanceof Function) {
        groupedRow[groupedRow.headerValue] = interpolateStr(
          groupedRow.groupBy(groupedRow[groupedRow.headerValue]),
          {
            rowsLength: groupedRow.children.length,
          },
        );
      }
      setGroupLabelRecursive(groupedRow.children || []);
    });
  };

  const groupedRows = computed(() => {
    if (!groupedHeaders.value.length) return pageItems.value;
    const groupParent = 1;
    gropedByRows.value = groupBy(pageItems.value, groupedHeaders.value[0], groupParent);
    if (groupedHeaders.value.length > 1) {
      groupByRecursive(gropedByRows.value, groupedHeaders.value, 1, groupParent + 1);
    }
    setGroupLabelRecursive(gropedByRows.value);
    return gropedByRows.value;
  });

  const flattenArr = (rows: FlattenItems): FlattenItems => rows.reduce((flattenedRowsAcc: FlattenItems, row) => {
    const flattenedChildren = row.showChildren && row.children?.length
      ? flattenArr(row.children)
      : [];
    return flattenedRowsAcc.concat([
      row,
      ...flattenedChildren,
    ]);
  }, []);

  const flattenedRows = computed(() => flattenArr(groupedRows.value));
  const flattenedNonGroupedRows = computed(() => flattenedRows.value.filter((row): row is RowItem => !row.isGroup));

  const toggleGroupChildrenVisibility = (groupItem: GroupByItem) => {
    groupItem.showChildren = !groupItem.showChildren;
  };

  return {
    flattenedRows,
    flattenedNonGroupedRows,
    firstHeaderItemPadding,
    group,
    ungroup,
    toggleGroupChildrenVisibility,
  };
}
