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

  const groupBy = (items: Item[], column: Header, groupParent: number) => {
    const groupedByColumnRows = items.reduce((acc, item) => {
      item.meta.groupParent = groupParent + 1;
      firstHeaderItemPadding.value = groupParent + 1;
      const flattenItem = flattenObj(item);
      (acc[flattenItem[column.value]] = acc[flattenItem[column.value]] || [])
        .push(unFlattenObj(flattenItem));
      return acc;
    }, {});
    return Object.keys(groupedByColumnRows).map((key) => ({
      groupBy: column.groupBy instanceof Function ? column.groupBy : null,
      [column.value]: key,
      headerValue: column.value,
      children: groupedByColumnRows[key],
      groupHeader: column,
      groupParent,
    }));
  };

  const groupByHeaderRecursive = (items: Item[], groupProperties: Header[], groupPropertiesIdx: number, groupParent: number) => {
    if (groupProperties.length === groupPropertiesIdx) {
      return items;
    }
    items.forEach((item) => {
      item.children = groupBy(item.children, groupProperties[groupPropertiesIdx], groupParent);
      groupByHeaderRecursive(
        item.children,
        groupProperties,
        groupPropertiesIdx + 1,
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
      groupByHeaderRecursive(groupedRes, groupedHeaders.value, 1, groupParent + 1);
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
