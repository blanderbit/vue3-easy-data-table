<template>
  <div>
    <div
      v-if="manageTableProperties"
      class="manage-table-properties-container"
    >
      <div class="area">
        <app-icon
          class="sliders-icon"
          icon="sliders-h"
          data-test-id="manage-table-properties-icon"
          @click.stop="toggleManageTablePropertiesVisibility"
        />
        <ManageTableProperties
          v-if="isManageTablePropertiesVisible"
          v-model="checkedTableProperties"
          data-test-id="manage-table-properties"
          :columns="tableProperties"
          :label="manageTablePropertiesLabel"
          @set-checked-table-properties="setCheckedTableProperties"
          @close="toggleManageTablePropertiesVisibility"
        />
      </div>
    </div>
    <div
      ref="dataTable"
      class="vue3-easy-data-table"
      :class="[tableClassName]"
    >
      <div
        ref="tableBody"
        class="vue3-easy-data-table__main"
        :class="{
          'fixed-header': fixedHeader,
          'fixed-height': tableHeight,
          'show-shadow': showShadow,
          'hoverable': !noHover,
          'border-cell': borderCell,
        }"
      >
        <table>
          <colgroup>
            <col
              v-for="(header, index) in headersForRender"
              :key="index"
              :style="getColStyle(header)"
            />
          </colgroup>
          <thead
            v-if="headersForRender.length && !hideHeader"
            class="vue3-easy-data-table__header"
            :class="[headerClassName]"
          >
            <tr>
              <th
                v-for="(header, index) in headersForRender"
                :key="index"
                data-test-id="table-header-item"
                :class="[{
                  sortable: header.sortable,
                  'none': header.sortable && header.sortType === 'none',
                  'desc': header.sortable && header.sortType === 'desc',
                  'asc': header.sortable && header.sortType === 'asc',
                  'shadow': header.value === lastFixedColumn,
                  resizable: columnsResizable,
                  // eslint-disable-next-line max-len
                }, typeof headerItemClassName === 'string' ? headerItemClassName : headerItemClassName(header as Header, index)]"
                :style="[
                  getFixedDistance(header.value),
                  header.text === 'checkbox' && !index && multipleCheckboxShift
                    && { 'padding-left': `${multipleCheckboxShift}rem`}
                ]"
              >
                <div
                  v-if="header.text === 'checkbox'"
                  class="checkbox-container"
                >
                  <app-icon
                    v-if="rowsHaveChildren"
                    class="expand-children-icon"
                    icon="plus-square"
                    :style="{ 'visibility': 'hidden' }"
                  />
                  <MultipleSelectCheckBox
                    :key="multipleSelectStatus"
                    :status="multipleSelectStatus"
                    :class="{ 'has-children': rowsHaveChildren }"
                    @change="toggleSelectAll"
                  />
                </div>
                <span
                  v-else
                  class="header"
                  :class="`direction-${headerTextDirection}`"
                  @click="header.sortable && header.sortType && updateSortField(header)"
                >
                  <slot
                    v-if="slots[`header-${header.value}`]"
                    :name="`header-${header.value}`"
                    v-bind="header"
                  />
                  <slot
                    v-else-if="slots[`header-${header.value.toLowerCase()}`]"
                    :name="`header-${header.value.toLowerCase()}`"
                    v-bind="header"
                  />
                  <span
                    v-else
                    class="header-text"
                  >
                    {{ header.text }}
                  </span>
                  <i
                    v-if="header.sortable"
                    :key="header.sortType ? header.sortType : 'none'"
                    class="sortType-icon"
                    :class="{'desc': header.sortType === 'desc'}"
                  />
                  <span
                    v-if="multiSort && isMultiSorting(header.value)"
                    class="multi-sort__number"
                  >
                    {{ getMultiSortNumber(header.value) }}
                  </span>
                  <app-icon
                    v-if="header.groupable && !header.grouped"
                    class="group-icon"
                    icon="stream"
                    @click.stop="group(header)"
                  />
                </span>
              </th>
            </tr>
          </thead>
          <slot
            v-if="ifHasBodySlot"
            name="body"
            v-bind="pageRows"
          />
          <tbody
            v-else-if="headerColumns.length"
            class="vue3-easy-data-table__body"
            :class="{'row-alternation': alternating}"
          >
            <slot
              name="body-prepend"
              v-bind="{
                rows: pageRows,
                pagination: {
                  isFirstPage,
                  isLastPage,
                  currentPaginationNumber,
                  maxPaginationNumber,
                  nextPage,
                  prevPage
                },
                headers: headersForRender
              }"
            />
            <template
              v-for="(row, index) in flattenedRows"
              :key="index"
            >
              <tr v-if="row.groupHeader">
                <td
                  colspan="100%"
                  :style="{ 'padding-left': `${row.meta.groupParent}rem` }"
                >
                  <div class="group-column">
                    <span
                      class="group-column__label"
                      @click="toggleGroupChildrenVisibility(row)"
                    >
                      <app-icon
                        class="square-icon"
                        :icon="{
                          'minus-square': row.meta.showChildren,
                          'plus-square': !row.meta.showChildren
                        }"
                      />
                      <span>{{ row.groupKey }}</span>
                      <app-icon
                        v-if="row.groupHeader.sortable"
                        class="sort-icon"
                        :icon="
                          {
                            'sort-up': row.groupHeader.sortType === 'asc',
                            'sort-down': row.groupHeader.sortType === 'desc',
                            'sort': row.groupHeader.sortType === 'none'
                          }"
                        @click.stop="updateSortField(row.groupHeader)"
                      />
                    </span>
                    <app-icon
                      class="group-column__icon"
                      icon="times-circle"
                      @click="ungroup(row.groupHeader)"
                    />
                  </div>
                </td>
              </tr>
              <tr
                v-else
                :class="[{'even-row': (index + 1) % 2 === 0 && !row.meta.selected},
                         {'selected': row.meta.selected},
                         typeof bodyRowClassName === 'string' ? bodyRowClassName : bodyRowClassName(row, index)]"
                data-test-id="table-row"
                @click="($event) => {
                  clickRow($event, row, 'single');
                  clickRowToExpand && updateExpandingItemIndexList(index + prevPageEndIndex, row, $event);
                }"
                @dblclick="clickRow($event, row, 'double')"
              >
                <td
                  v-for="(column, i) in headerColumns"
                  :key="i"
                  :data-test-id="`table-row-${column}-column`"
                  :style="[
                    getFixedDistance(column, 'td'),
                    !i && row.meta.groupParent && { 'padding-left': `${row.meta.groupParent}rem` },
                    !i && groupParentDictionary[row.meta.uniqueIndex]
                      && { 'padding-left': `${ groupParentDictionary[row.meta.uniqueIndex]}rem` },
                  ]"
                  :class="[{
                    'shadow': column === lastFixedColumn,
                    'can-expand': column === 'expand',
                    'exactMatch': row.meta.exactMatchColumns.includes(column),
                    // eslint-disable-next-line max-len
                  }, typeof bodyItemClassName === 'string' ? bodyItemClassName : bodyItemClassName(column, i), `direction-${bodyTextDirection}`]"
                  @click="column === 'expand' ? updateExpandingItemIndexList(index + prevPageEndIndex, row, $event) : null"
                >
                  <slot
                    v-if="slots[`row-${column}`]"
                    :name="`row-${column}`"
                    v-bind="row"
                  />
                  <slot
                    v-else-if="slots[`row-${column.toLowerCase()}`]"
                    :name="`row-${column.toLowerCase()}`"
                    v-bind="row"
                  />
                  <template v-else-if="column === 'expand'">
                    <i
                      class="expand-icon"
                      :class="{'expanding': expandingRowIndexList.includes(row.meta.uniqueIndex)}"
                    />
                  </template>
                  <template v-else-if="column === 'checkbox'">
                    <div
                      class="checkbox-container"
                    >
                      <app-icon
                        v-if="rowsHaveChildren"
                        class="expand-children-icon"
                        :icon="
                          {
                            'plus-square': !row.meta.showChildren,
                            'minus-square': row.meta.showChildren
                          }"
                        :style="{ 'visibility': row.meta.children?.length ? 'visible' : 'hidden' }"
                        @click="toggleChildrenVisibility($event, row)"
                      />
                      <SingleSelectCheckBox
                        :checked="row.meta.selected"
                        :class="{ 'has-children': rowsHaveChildren }"
                        @change="toggleSelectRow(row)"
                      />
                    </div>
                  </template>
                  <template v-else>
                    {{ generateColumnContent(column, row) }}
                  </template>
                </td>
              </tr>
              <tr
                v-if="ifHasExpandSlot && !row.groupHeader && expandingRowIndexList.includes(row.meta.uniqueIndex)"
                :class="[
                  { 'even-row': (index + 1) % 2 === 0},
                  typeof bodyExpandRowClassName === 'string' ?
                    bodyExpandRowClassName :
                    bodyExpandRowClassName(row, index)
                ]"
              >
                <td
                  :colspan="headersForRender.length"
                  class="expand"
                >
                  <LoadingLine
                    v-if="row.expandLoading"
                    class="expand-loading"
                  />
                  <slot
                    name="expand"
                    v-bind="row"
                  />
                </td>
              </tr>
            </template>
            <slot
              name="body-append"
              v-bind="{
                rows: pageRows,
                pagination: {
                  isFirstPage,
                  isLastPage,
                  currentPaginationNumber,
                  maxPaginationNumber,
                  nextPage,
                  prevPage,
                  updatePage
                },
                headers: headersForRender
              }"
            />
          </tbody>
        </table>
        <div
          v-if="loading"
          class="vue3-easy-data-table__loading"
        >
          <div
            class="vue3-easy-data-table__loading-mask "
          ></div>
          <div class="loading-entity">
            <slot
              v-if="ifHasLoadingSlot"
              name="loading"
            />
            <Loading v-else />
          </div>
        </div>

        <div
          v-if="!pageRows.length && !loading"
          class="vue3-easy-data-table__message"
        >
          {{ emptyMessage }}
        </div>
      </div>
      <div
        v-if="!hideFooter"
        class="vue3-easy-data-table__footer"
      >
        <div
          v-if="!hideRowsPerPage"
          class="pagination__rows-per-page"
        >
          {{ rowsPerPageMessage }}
          <RowsSelector
            v-model="rowsPerPageRef"
            :rows-items="rowsItemsComputed"
          />
        </div>
        <div class="pagination__items-index">
          <span
            v-if="paginationWithInput"
            data-test-id="pagination-with-input-text"
          >
            {{ currentPaginationNumber }} {{ rowsOfPageSeparatorMessage }} {{ maxPaginationNumber }}
          </span>
          <span
            v-else
            data-test-id="buttons-pagination-text"
          >
            {{ `${currentPageFirstIndex}–${currentPageLastIndex}` }}
            {{ rowsOfPageSeparatorMessage }} {{ totalRowsLength }}
          </span>
        </div>
        <slot
          v-if="ifHasPaginationSlot"
          name="pagination"
          v-bind="{
            isFirstPage,
            isLastPage,
            currentPaginationNumber,
            maxPaginationNumber,
            nextPage,
            prevPage,
          }"
        />
        <PaginationArrows
          v-else
          :is-first-page="isFirstPage"
          :is-last-page="isLastPage"
          :has-double-arrows="paginationWithInput"
          @click-next-page="nextPage"
          @click-prev-page="prevPage"
          @click-first-page="firstPage"
          @click-last-page="lastPage"
        >
          <template
            v-if="buttonsPagination"
            #buttonsPagination
          >
            <ButtonsPagination
              :current-pagination-number="currentPaginationNumber"
              :max-pagination-number="maxPaginationNumber"
              @update-page="updatePage"
            />
          </template>
          <template
            v-if="paginationWithInput"
            #paginationWithInput
          >
            <PaginationWithInput
              :current-pagination-number="currentPaginationNumber"
              :max-pagination-number="maxPaginationNumber"
              @update-page="updatePage"
            />
          </template>
        </PaginationArrows>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useSlots,
  computed,
  toRefs,
  ref,
  watch,
  provide,
  onMounted,
  PropType,
} from 'vue';

import MultipleSelectCheckBox from './MultipleSelectCheckBox.vue';
import SingleSelectCheckBox from './SingleSelectCheckBox.vue';
import RowsSelector from './RowsSelector.vue';
import Loading from './Loading.vue';
import LoadingLine from './LoadingLine.vue';
import ButtonsPagination from './ButtonsPagination.vue';
import PaginationArrows from './PaginationArrows.vue';
import PaginationWithInput from './PaginationWithInput.vue';
import ManageTableProperties from './ManageTableProperties.vue';

import useClickRow from '../hooks/useClickRow';
import useExpandableRow from '../hooks/useExpandableRow';
import useFixedColumn from '../hooks/useFixedColumn';
import useHeaders from '../hooks/useHeaders';
import usePageRows from '../hooks/usePageRows';
import usePagination from '../hooks/usePagination';
import useRows from '../hooks/useRows';
import useServerOptions from '../hooks/useServerOptions';
import useTotalRows from '../hooks/useTotalRows';
import useTableProperties from '../hooks/useTableProperties';
import useGroupBy from '../hooks/useGroupBy';

import type { Header, Item } from '../types/main';
import type { HeaderForRender } from '../types/internal';

// eslint-disable-next-line import/extensions
import { generateColumnContent } from '../utils';
import propsWithDefault from '../propsWithDefault';
import { SELECTABLE } from '../constants';
import AppIcon from './AppIcon.vue';

const props = defineProps({
  ...propsWithDefault,
  items: {
    type: Array as PropType<Item[]>,
    required: true,
  },
  headers: {
    type: Array as PropType<Header[]>,
    required: true,
  },
});

const {
  clickEventType,
  bodyTextDirection,
  checkboxColumnWidth,
  currentPage,
  expandColumnWidth,
  filterOptions,
  fixedCheckbox,
  fixedExpand,
  fixedHeader,
  fixedIndex,
  headers,
  headerTextDirection,
  indexColumnWidth,
  items,
  loading,
  mustSort,
  multiSort,
  rowsItems,
  rowsPerPage,
  searchField,
  searchValue,
  serverItemsLength,
  serverOptions,
  showIndex,
  sortBy,
  sortType,
  tableHeight,
  tableMinHeight,
  themeColor,
  rowsOfPageSeparatorMessage,
  selectable,
  exactMatch,
  isExactMatchCaseSensitive,
  manageTableProperties,
  hasCheckboxColumn,
  manageTablePropertiesLabel,
} = toRefs(props);

const tableHeaders = ref(headers.value);
// style related computed variables
const tableHeightPx = computed(() => (tableHeight.value ? `${tableHeight.value}px` : null));
const tableMinHeightPx = computed(() => `${tableMinHeight.value}px`);

// global style related variable
provide('themeColor', themeColor.value);

// slot
const slots = useSlots();
const ifHasPaginationSlot = computed(() => !!slots.pagination);
const ifHasLoadingSlot = computed(() => !!slots.loading);
const ifHasExpandSlot = computed(() => !!slots.expand);
const ifHasBodySlot = computed(() => !!slots.body);

// global dataTable $ref
const dataTable = ref();
const tableBody = ref();
provide('dataTable', dataTable);

// fixed-columns shadow
const showShadow = ref(false);
onMounted(() => {
  tableBody.value.addEventListener('scroll', () => {
    showShadow.value = tableBody.value.scrollLeft > 0;
  });
});

const emits = defineEmits([
  'clickRow',
  'expandRow',
  'updateSort',
  'updateFilter',
  'update:selectedRows',
  'update:serverOptions',
]);

const isServerSideMode = computed((): boolean => serverOptions.value !== null);
const isMultiSelect = computed((): boolean => selectable.value === SELECTABLE.MULTIPLE);

const {
  serverOptionsComputed,
  updateServerOptionsPage,
  updateServerOptionsSort,
  updateServerOptionsRowsPerPage,
} = useServerOptions(
  serverOptions,
  multiSort,
  emits,
);

const {
  tableProperties,
  isManageTablePropertiesVisible,
  checkedTableProperties,
  toggleManageTablePropertiesVisibility,
  setCheckedTableProperties,
} = useTableProperties();

const {
  initialHeaders,
  groupedHeaders,
  filteredClientSortOptions,
  headerColumns,
  headersForRender,
  updateSortField,
  isMultiSorting,
  getMultiSortNumber,
} = useHeaders(
  tableProperties,
  manageTableProperties,
  checkedTableProperties,
  checkboxColumnWidth,
  expandColumnWidth,
  fixedCheckbox,
  fixedExpand,
  fixedIndex,
  tableHeaders,
  ifHasExpandSlot,
  indexColumnWidth,
  isServerSideMode,
  mustSort,
  serverOptionsComputed,
  showIndex,
  sortBy,
  sortType,
  multiSort,
  hasCheckboxColumn,
  updateServerOptionsSort,
  emits,
);

const {
  initialRows,
  rowsItemsComputed,
  rowsPerPageRef,
  rowsHaveChildren,
  updateRowsPerPage,
  toggleChildrenVisibility,
} = useRows(
  items,
  isServerSideMode,
  rowsItems,
  serverOptions,
  rowsPerPage,
);

const {
  totalRows,
  selectedRows,
  totalRowsLength,
  toggleSelectAll,
  toggleSelectRow,
} = useTotalRows(
  manageTableProperties,
  checkedTableProperties,
  exactMatch,
  isExactMatchCaseSensitive,
  headerColumns,
  isMultiSelect,
  filteredClientSortOptions,
  filterOptions,
  isServerSideMode,
  initialRows,
  searchField,
  searchValue,
  serverItemsLength,
  multiSort,
  emits,
);

const {
  currentPaginationNumber,
  maxPaginationNumber,
  isLastPage,
  isFirstPage,
  firstPage,
  nextPage,
  prevPage,
  lastPage,
  updatePage,
  updateCurrentPaginationNumber,
} = usePagination(
  currentPage,
  isServerSideMode,
  loading,
  totalRowsLength,
  rowsPerPageRef,
  serverOptions,
  updateServerOptionsPage,
);

const {
  currentPageFirstIndex,
  currentPageLastIndex,
  multipleSelectStatus,
  pageRows,
} = usePageRows(
  currentPaginationNumber,
  isServerSideMode,
  initialRows,
  rowsPerPageRef,
  selectedRows,
  showIndex,
  totalRows,
  totalRowsLength,
);

const {
  groupParentDictionary,
  multipleCheckboxShift,
  flattenedRows,
  flattenedNonGroupedRows,
  group,
  ungroup,
  toggleGroupChildrenVisibility,
} = useGroupBy(
  initialHeaders,
  pageRows,
  groupedHeaders,
);

const prevPageEndIndex = computed(() => {
  if (currentPaginationNumber.value === 0) return 0;
  return (currentPaginationNumber.value - 1) * rowsPerPageRef.value;
});

const {
  expandingRowIndexList,
  updateExpandingItemIndexList,
  clearExpandingItemIndexList,
} = useExpandableRow(
  flattenedNonGroupedRows,
  prevPageEndIndex,
  emits,
);

const {
  fixedHeaders,
  lastFixedColumn,
  fixedColumnsInfos,
} = useFixedColumn(
  headersForRender,
);

const {
  clickRow,
} = useClickRow(
  isMultiSelect,
  flattenedNonGroupedRows,
  selectedRows,
  clickEventType,
  showIndex,
  emits,
);

// template style generation function
const getColStyle = (header: HeaderForRender): string | undefined => {
  const width = header.width ?? (header.fixed ? 100 : null);
  if (width) return `width: ${width}px; min-width: ${width}px;`;
  return undefined;
};

const getFixedDistance = (column: string, type: 'td' | 'th' = 'th') => {
  if (!fixedHeaders.value.length) return undefined;
  const columInfo = fixedColumnsInfos.value.find((info) => info.value === column);
  if (columInfo) {
    return `left: ${columInfo.distance}px;z-index: ${type === 'th' ? 3 : 1};position: sticky;`;
  }
  return undefined;
};

watch(loading, (newVal, oldVal) => {
  if (serverOptionsComputed.value) {
    // in server-side mode, turn to next page when api request finished.
    if (newVal === false && oldVal === true) {
      updateCurrentPaginationNumber(serverOptionsComputed.value.page);
      clearExpandingItemIndexList();
    }
  }
});

watch(rowsPerPageRef, (value) => {
  if (!isServerSideMode.value) {
    updatePage(1);
  } else {
    updateServerOptionsRowsPerPage(value);
  }
});

watch(searchValue, () => {
  if (!isServerSideMode.value) {
    updatePage(1);
  }
});

watch([currentPaginationNumber, filteredClientSortOptions, searchField, searchValue, filterOptions], () => {
  clearExpandingItemIndexList();
}, { deep: true });

const isTestMode = import.meta.env.MODE === 'test';
const exposeForTest = isTestMode ? {
  initialRows,
} : {};
defineExpose({
  currentPageFirstIndex,
  currentPageLastIndex,
  clientRowsLength: totalRowsLength,
  maxPaginationNumber,
  currentPaginationNumber,
  isLastPage,
  isFirstPage,
  firstPage,
  nextPage,
  prevPage,
  lastPage,
  updatePage,
  rowsPerPageOptions: rowsItemsComputed,
  rowsPerPageActiveOption: rowsPerPageRef,
  updateRowsPerPageActiveOption: updateRowsPerPage,
  ...exposeForTest,
});
</script>

<style>
  :root {
    /*table*/
    --easy-table-border: 1px solid #e0e0e0;
    --easy-table-row-border: 1px solid #e0e0e0;
    /*header-row*/
    --easy-table-header-font-size: 12px;
    --easy-table-header-height: 36px;
    --easy-table-header-font-color: #373737;
    --easy-table-header-background-color: #fff;
    /*header-item*/
    --easy-table-header-item-padding: 0px 10px;
    /*body-row*/
    --easy-table-body-row-height: 36px;
    --easy-table-body-row-font-size: 12px;
    --easy-table-body-selected-row-background-color: #aab7d1;
    --easy-table-body-row-font-color: #212121;
    --easy-table-body-row-background-color: #fff;
    --easy-table-body-exact-match-row-column-background-color: #4c4c12;
    --easy-table-body-selected-row-and-exact-match-row-column-background-color: #778f0e;

    --easy-table-body-row-hover-font-color: #212121;
    --easy-table-body-row-hover-background-color: #eee;

    --easy-table-body-even-row-font-color: #212121;
    --easy-table-body-even-row-background-color: #fafafa;
    /*body-item*/
    --easy-table-body-item-padding: 0px 10px;
    /*footer*/
    --easy-table-footer-background-color: #fff;
    --easy-table-footer-font-color: #212121;
    --easy-table-footer-font-size: 12px;
    --easy-table-footer-pagination-input-width: 1.875rem;
    --easy-table-footer-pagination-arrow-background-color: #000;
    --easy-table-footer-pagination-arrow-disabled-background-color: #a5a3a3;
    --easy-table-footer-padding: 0px 5px;
    --easy-table-footer-height: 36px;
    /**footer-rowsPerPage**/
    --easy-table-rows-per-page-selector-width: auto;
    --easy-table-rows-per-page-selector-option-padding: 5px;
    /*message*/
    --easy-table-message-font-color: #212121;
    --easy-table-message-font-weight: 500;
    --easy-table-message-font-size: 12px;
    --easy-table-message-padding: 20px;
    /*loading-mask*/
    --easy-table-loading-mask-background-color: #fff;
    --easy-table-loading-mask-opacity: 0.5;
    /*scroll-bar*/
    --easy-table-scrollbar-track-color: #fff;
    --easy-table-scrollbar-color: #fff;
    --easy-table-scrollbar-thumb-color: #c1c1c1;
    --easy-table-scrollbar-corner-color: #fff;
    /*buttons-pagination*/
    --easy-table-buttons-pagination-border: 1px solid #e0e0e0;
  }
</style>

<style lang="scss" scoped>
@import '../scss/vue3-easy-data-table.scss';

.manage-table-properties-container {
  display: flex;
  justify-content: flex-end;

  .area {
    margin-right: 1rem;
    margin-bottom: 0.5rem;

    .sliders-icon {
      cursor: pointer;
    }
  }
}

.vue3-easy-data-table {
  $easy-data-table: &;

  .resizable {
    resize: horizontal;
    overflow: hidden;
  }

  &__main {
    min-height: v-bind(tableMinHeightPx);

    #{$easy-data-table}__body {
      -webkit-user-select: none; /* Safari */
      user-select: none; /* Standard syntax */
    }

    .easy-checkbox {
      &.has-children {
        margin: 0;
      }
    }

    .checkbox-container {
      display: flex;
      align-items: center;

      .expand-children-icon {
        cursor: pointer;
        margin-right: 0.375rem;
      }
    }

    .group-icon {
      cursor: pointer;
      margin-left: 0.625rem;
    }

    .group-column {
      padding-right: 0.5rem;
      display: flex;

      .square-icon {
        cursor: pointer;
        margin-right: 0.5rem;
      }

      &__label {
        cursor: pointer;
        flex-grow: 1;

        .sort-icon {
          margin-left: 0.5rem;
        }
      }

      &__icon {
        cursor: pointer;
      }
    }

    tr {
      &.selected {
        background: var(--easy-table-body-selected-row-background-color);

        td {
          background: none;

          &.exactMatch {
            background: var(--easy-table-body-selected-row-and-exact-match-row-column-background-color);
          }
        }
      }

      &.even-row {
        td {
          &.exactMatch {
            background: var(--easy-table-body-exact-match-row-column-background-color);
          }
        }
      }

      td {
        &.exactMatch {
          background: var(--easy-table-body-exact-match-row-column-background-color);
        }
      }
    }

    &.fixed-height {
      height: v-bind(tableHeightPx);
    }
  }
}
</style>
