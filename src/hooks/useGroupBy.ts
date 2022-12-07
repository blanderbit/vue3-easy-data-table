import {
  computed,
  ComputedRef,
  Ref,
  ref, watch,
} from 'vue';
import { Header, Item } from '../types/main';
import {
  flattenObj,
  unFlattenObj,
  interpolateStr,
} from '../utils';

export default function useGroupBy(tableHeaders: Ref<Header[]>, pageItems: ComputedRef<Item[]>, groupedHeaders: Ref<Header[]>) {
  const firstHeaderItemPadding = ref<number | null>(null);

  watch(tableHeaders, (currVal) => {
    currVal.forEach((tableHeader) => {
      if (tableHeader.groupable && tableHeader.grouped) {
        groupedHeaders.value.push(tableHeader);
      }
    });
  }, {
    immediate: true,
  });

  const group = (headerGroup: Header) => {
    headerGroup.grouped = true;
    groupedHeaders.value.push(headerGroup);
  };

  const ungroup = (headerGroup: Header) => {
    headerGroup.grouped = false;
    groupedHeaders.value = groupedHeaders.value.filter((header) => header.value !== headerGroup.value);
  };

  const groupBy = (items: Item[], header: Header, groupParent: number) => {
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
    }));
  };

  const groupByRecursive = (items: Item[], groupedItems: Header[], groupedItemIdx: number, groupParent: number) => {
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
    const groupedRes = groupBy(pageItems.value, groupedHeaders.value[0], groupParent);
    if (groupedHeaders.value.length > 1) {
      groupByRecursive(groupedRes, groupedHeaders.value, 1, groupParent + 1);
    }
    setGroupLabelRecursive(groupedRes);
    return groupedRes;
  });

  const flattenArr = (rows: Item[]): Item[] => rows.reduce((flattenedRowsAcc: Item[], row) => {
    const flattenedChildren = row.children?.length
      ? flattenArr(row.children)
      : [];
    return flattenedRowsAcc.concat([
      row,
      ...flattenedChildren,
    ]);
  }, []);

  const flattenedRows = computed(() => flattenArr(groupedRows.value));
  const flattenedNonGroupedRows = computed(() => flattenedRows.value.filter((row) => !row.groupBy));

  return {
    flattenedRows,
    flattenedNonGroupedRows,
    firstHeaderItemPadding,
    group,
    ungroup,
  };
}
