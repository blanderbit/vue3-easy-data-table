import {
  computed,
  ComputedRef,
  ref,
  Ref,
  watch,
  watchEffect,
} from 'vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Header, Row } from '../types/main';
import {
  GroupByHeader,
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
  pageItems: ComputedRef<Row[]>,
  groupedHeaders: Ref<HeaderForRender[]>,
) {
  const gropedByRows = ref<GroupByHeader[]>([]);
  const multipleCheckboxShift = ref(ZERO);
  const groupParentDictionary = ref<Record<string, number>>({});

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

  const fillGroupParentDictionary = (rows: Row[], shift: number) => {
    if (!rows.length) return;
    rows.forEach((row) => {
      const groupParent = row.meta.groupParent < shift ? shift : row.meta.groupParent;
      groupParentDictionary.value[row.meta.uniqueIndex] = groupParent + GROUP_PARENT_SHIFT;
      if (row.meta.children.length) {
        fillGroupParentDictionary(row.meta.children, groupParent + GROUP_PARENT_SHIFT);
      }
    });
  };

  const groupBy = (
    items: Row[],
    header: HeaderForRender,
    groupShift: number,
    pageItemsHaveAtLeastOneChildren: boolean,
  ): GroupByHeader[] => {
    const groupedByColumnRows = items.reduce((acc: Record<string, Row[]>, rowItem) => {
      const flattenItem = flattenObj(rowItem);
      const hasItemChildren = Boolean(rowItem.meta.children.length);
      let parentRowGroupParent = 0;
      if (pageItemsHaveAtLeastOneChildren) {
        parentRowGroupParent = groupShift + GROUP_PARENT_SHIFT;
        groupParentDictionary.value[rowItem.meta.uniqueIndex] = groupShift + GROUP_PARENT_SHIFT;
        multipleCheckboxShift.value = parentRowGroupParent;
      }
      if (hasItemChildren) {
        fillGroupParentDictionary(rowItem.meta.children, parentRowGroupParent);
      }
      (acc[flattenItem[header.value]] = acc[flattenItem[header.value]] || []).push(rowItem);
      return acc;
    }, {});

    return Object.keys(groupedByColumnRows).map((groupKey) => ({
      groupBy: header.groupBy instanceof Function ? header.groupBy : null,
      groupHeader: header,
      groupKey,
      meta: {
        groupParent: groupShift,
        children: groupedByColumnRows[groupKey],
        showChildren: true,
        isGroup: true,
      },
    })).sort((groupA, groupB) => {
      const direction = groupA.groupHeader.sortType === 'desc' ? -1 : 1;
      const sortValueA = groupA.groupKey;
      const sortValueB = groupB.groupKey;

      if (sortValueA < sortValueB) {
        return -direction;
      }

      if (sortValueA > sortValueB) {
        return direction;
      }
      return 0;
    });
  };

  const groupByRecursive = (
    groupedRows: GroupByHeader[],
    groupedHeaderIdx: number,
    groupParent: number,
    pageItemsHaveAtLeastOneChildren: boolean,
  ) => {
    if (groupedHeaders.value.length === groupedHeaderIdx) {
      return groupedRows;
    }
    groupedRows.forEach((groupRow) => {
      groupRow.meta.children = groupBy(
          groupRow.meta.children as Row[],
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
        groupedRow.groupKey = interpolateStr(
          groupedRow.groupBy(groupedRow.groupKey),
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
      groupParentDictionary.value = {};
      multipleCheckboxShift.value = ZERO;
      pageItems.value.forEach((pageItem) => {
        pageItem.meta.groupParent = ZERO;
      });
    }
  });

  // Use watch effect to set up grouped rows.
  watchEffect(() => {
    if (groupedHeaders.value.length) {
      const pageItemsHaveAtLeastOneChildren = pageItems.value.some((pageItem) => pageItem.meta.children.length);
      const grouped = groupBy(pageItems.value, groupedHeaders.value[ZERO], GROUP_SHIFT, pageItemsHaveAtLeastOneChildren);
      if (groupedHeaders.value.length > 1) {
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
    .filter((row) => !(row as GroupByHeader).meta.isGroup) as Row[]);

  const toggleGroupChildrenVisibility = (groupItem: GroupByHeader) => {
    groupItem.meta.showChildren = !groupItem.meta.showChildren;
  };

  return {
    groupParentDictionary,
    multipleCheckboxShift,
    flattenedRows,
    flattenedNonGroupedRows,
    group,
    ungroup,
    toggleGroupChildrenVisibility,
  };
}
