import {
  computed,
  ComputedRef,
  ref,
  Ref,
  watch,
  watchEffect,
} from 'vue';
import { cloneDeep } from 'lodash';
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
import { GROUP_SHIFT, GROUP_PARENT_SHIFT, ZERO } from '../constants';

export default function useGroupBy(
  tableHeaders: Ref<Header[]>,
  pageItems: ComputedRef<RowItem[]>,
  groupedHeaders: Ref<HeaderForRender[]>,
) {
  const gropedByRows = ref<GroupByItem[]>([]);
  const multipleCheckboxShift = ref(ZERO);

  const group = (headerGroup: HeaderForRender) => {
    const header = tableHeaders.value
      .find((tableHeader) => tableHeader.value === headerGroup.value);
    if (header) {
      header.grouped = true;
      groupedHeaders.value.push(headerGroup);
    }
  };

  const ungroup = (headerGroup: HeaderForRender) => {
    const header = tableHeaders.value.find((tableHeader) => tableHeader.value === headerGroup.value);
    if (header) {
      header.grouped = false;
      groupedHeaders.value = groupedHeaders.value
        .filter((groupedHeader) => groupedHeader.value !== headerGroup.value);
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
        groupParent: parentRow.meta.groupParent + GROUP_PARENT_SHIFT,
        children: itemChildren,
      },
    };
  });

  const groupBy = (
    items: RowItem[],
    header: HeaderForRender,
    groupShift: number,
    pageItemsHaveAtLeastOneChildren: boolean,
  ): GroupByItem[] => {
    const groupedByColumnRows = items.reduce((acc: Record<string, RowItem[]>, rowItem) => {
      rowItem.meta.isGrouped = true;
      const flattenItem = flattenObj(rowItem);
      const hasItemChildren = Boolean(rowItem.meta.children.length);
      if (pageItemsHaveAtLeastOneChildren) {
        rowItem.meta.groupParent = groupShift + GROUP_PARENT_SHIFT;
        multipleCheckboxShift.value = rowItem.meta.groupParent;
      }
      if (hasItemChildren) {
        rowItem.meta.children = updateChildrenGroupParent(rowItem.meta.children, rowItem);
      }
      (acc[flattenItem[header.value]] = acc[flattenItem[header.value]] || [])
        .push(rowItem);
      return acc;
    }, {});
    return Object.keys(groupedByColumnRows).map((key) => ({
      groupBy: header.groupBy instanceof Function ? header.groupBy : null,
      groupHeader: header,
      [header.value]: key,
      headerValue: header.value,
      meta: {
        groupParent: groupShift,
        children: groupedByColumnRows[key],
        showChildren: true,
        isGroup: true,
      },
    }));
  };

  const groupByRecursive = (
    groupedRows: GroupByItem[],
    groupedHeaderIdx: number,
    groupParent: number,
    pageItemsHaveAtLeastOneChildren: boolean,
  ) => {
    if (groupedHeaders.value.length === groupedHeaderIdx) {
      return groupedRows;
    }
    groupedRows.forEach((groupRow) => {
      groupRow.meta.children = groupBy(
          groupRow.meta.children as RowItem[],
          groupedHeaders.value[groupedHeaderIdx],
          groupParent,
          pageItemsHaveAtLeastOneChildren,
      );
      groupByRecursive(
        groupRow.meta.children,
        groupedHeaderIdx + 1,
        groupParent + 1,
        pageItemsHaveAtLeastOneChildren,
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

  watch(groupedHeaders, (currVal) => {
    if (!currVal.length) {
      multipleCheckboxShift.value = ZERO;
      pageItems.value.forEach((pageItem) => {
        pageItem.meta.groupParent = ZERO;
        pageItem.meta.isGrouped = false;
      });
    }
  });

  watchEffect(() => {
    if (groupedHeaders.value.length) {
      const pageItemsCloneDeep: RowItem[] = cloneDeep(pageItems.value);
      const pageItemsHaveAtLeastOneChildren = pageItemsCloneDeep.some((pageItem) => pageItem.meta.children.length);
      const grouped = groupBy(pageItemsCloneDeep, groupedHeaders.value[ZERO], GROUP_SHIFT, pageItemsHaveAtLeastOneChildren);
      if (groupedHeaders.value.length) {
        groupByRecursive(grouped, 1, GROUP_PARENT_SHIFT, pageItemsHaveAtLeastOneChildren);
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
