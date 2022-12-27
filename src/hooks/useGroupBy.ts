import {
  computed,
  ComputedRef,
  ref,
  Ref,
  watch,
  watchEffect,
} from 'vue';
import { Header, RowItem } from '../types/main';
import {
  GroupByItem,
  HeaderForRender,
  FlattenRows,
} from '../types/internal';
import {
  flattenObj,
  interpolateStr,
} from '../utils';

export default function useGroupBy(
  tableHeaders: Ref<Header[]>,
  pageItems: ComputedRef<RowItem[]>,
  groupedHeaders: Ref<HeaderForRender[]>,
) {
  const gropedByRows = ref<GroupByItem[]>([]);
  const multipleCheckboxShift = ref(0);

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

  const updateChildrenGroupParent = (rows: RowItem[], parentRow: RowItem) => rows.map((row) => {
    const itemChildren: RowItem[] = Array.isArray(row.meta.children) && row.meta.children.length
      ? updateChildrenGroupParent(row.meta.children, row)
      : [];
    return {
      ...row,
      meta: {
        ...row.meta,
        groupParent: parentRow.meta.groupParent + 2,
        children: itemChildren,
      },
    };
  });

  const groupBy = (items: RowItem[], header: HeaderForRender, groupParent: number): GroupByItem[] => {
    const itemsHaveChildren = items.some((item) => item.meta.children.length);
    if (itemsHaveChildren) {
      multipleCheckboxShift.value = 2;
    }
    const groupedByColumnRows = items.reduce((acc: Record<string, RowItem[]>, item) => {
      item.meta.isGrouped = true;
      const flattenItem = flattenObj(item);
      const hasItemChildren = Boolean(item.meta.children.length);
      item.meta.groupParent = itemsHaveChildren ? groupParent + 1 : 0;
      if (hasItemChildren) {
        item.meta.children = updateChildrenGroupParent(item.meta.children, item);
      }
      (acc[flattenItem[header.value]] = acc[flattenItem[header.value]] || [])
        .push(item);
      return acc;
    }, {});
    return Object.keys(groupedByColumnRows).map((key) => ({
      groupBy: header.groupBy instanceof Function ? header.groupBy : null,
      groupHeader: header,
      [header.value]: key,
      headerValue: header.value,
      meta: {
        groupParent,
        children: groupedByColumnRows[key],
        showChildren: true,
        isGroup: true,
      },
    }));
  };

  const groupByRecursive = (
    items: GroupByItem[],
    groupedItems: HeaderForRender[],
    groupedItemIdx: number,
    groupParent: number,
  ) => {
    if (groupedItems.length === groupedItemIdx) {
      return items;
    }
    items.forEach((item) => {
      item.meta.children = groupBy(item.meta.children as RowItem[], groupedItems[groupedItemIdx], groupParent);
      groupByRecursive(
        item.meta.children,
        groupedItems,
        groupedItemIdx + 1,
        groupParent + 1,
      );
    });
    return null;
  };

  const setGroupLabelRecursive = (items: FlattenRows) => {
    if (!items.length) return;
    items.forEach((groupedRow) => {
      if (groupedRow.groupBy instanceof Function) {
        groupedRow[groupedRow.headerValue as keyof GroupByItem] = interpolateStr(
          groupedRow.groupBy(groupedRow[groupedRow.headerValue as keyof GroupByItem]),
          {
            rowsLength: groupedRow.meta.children.length,
          },
        );
      }
      setGroupLabelRecursive(groupedRow.meta.children || []);
    });
  };

  watch(tableHeaders, (currVal) => {
    const groupedTableHeaders = currVal.filter((header) => header.groupable && header.grouped);
    if (groupedTableHeaders.length) {
      groupedHeaders.value = groupedTableHeaders;
    }
  }, {
    immediate: true,
  });

  watch(groupedHeaders, (val) => {
    if (!val.length) {
      multipleCheckboxShift.value = 0;
      pageItems.value.forEach((pageItem) => {
        pageItem.meta.groupParent = 0;
        pageItem.meta.isGrouped = false;
      });
    }
  });

  watchEffect(() => {
    if (groupedHeaders.value.length) {
      const groupParent = 1;
      const grouped = groupBy(pageItems.value, groupedHeaders.value[0], groupParent);
      if (groupedHeaders.value.length > 1) {
        groupByRecursive(grouped, groupedHeaders.value, 1, groupParent + 1);
      }
      setGroupLabelRecursive(grouped);
      gropedByRows.value = grouped;
    }
  });

  const groupedRows = computed((): FlattenRows => {
    if (!groupedHeaders.value.length) return pageItems.value;
    return gropedByRows.value;
  });

  const flattenArr = (rows: FlattenRows): FlattenRows => rows.reduce((flattenedRowsAcc: FlattenRows, row) => {
    const flattenedChildren = row.meta.showChildren && row.meta.children?.length
      ? flattenArr(row.meta.children)
      : [];
    return flattenedRowsAcc.concat([
      row,
      ...flattenedChildren,
    ]);
  }, []);

  const flattenedRows = computed(() => flattenArr(groupedRows.value));
  const flattenedNonGroupedRows = computed(() => flattenedRows.value
    .filter((row) => !(row as GroupByItem).meta.isGroup) as RowItem[]);

  const toggleGroupChildrenVisibility = (groupItem: GroupByItem) => {
    groupItem.meta.showChildren = !groupItem.meta.showChildren;
  };

  return {
    multipleCheckboxShift,
    flattenedRows,
    flattenedNonGroupedRows,
    group,
    ungroup,
    toggleGroupChildrenVisibility,
  };
}
