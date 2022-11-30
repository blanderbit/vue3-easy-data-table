<template>
  <template
    v-if="manageTableProperties"
  >
    <div
      v-click-outside="clickOutsideManageTablePropertiesArea"
      class="manage-table-properties-container"
    >
      <i
        class="sliders-icon fa fa-sliders-h"
        @click="toggleManageTablePropertiesVisibility"
      />
      <manage-table-properties
        v-if="isManageTablePropertiesVisible"
        v-model="checkedTableProperties"
        :columns="tableProperties"
        @set-checked-table-properties="setCheckedTableProperties"
      />
    </div>
  </template>
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
        'table-fixed': fixedHeaders.length,
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
              :class="[{
                sortable: header.sortable,
                'none': header.sortable && header.sortType === 'none',
                'desc': header.sortable && header.sortType === 'desc',
                'asc': header.sortable && header.sortType === 'asc',
                'shadow': header.value === lastFixedColumn,
              // eslint-disable-next-line max-len
              }, typeof headerItemClassName === 'string' ? headerItemClassName : headerItemClassName(header as Header, index)]"
              :style="getFixedDistance(header.value)"
              @click.stop="(header.sortable && header.sortType) ? updateSortField(header.value, header.sortType) : null"
            >
              <MultipleSelectCheckBox
                v-if="header.text === 'checkbox'"
                :key="multipleSelectStatus"
                :status="multipleSelectStatus"
                @change="toggleSelectAll"
              />
              <span
                v-else
                class="header"
                :class="`direction-${headerTextDirection}`"
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
                ></i>
                <span
                  v-if="multiSort && isMultiSorting(header.value)"
                  class="multi-sort__number"
                >
                  {{ getMultiSortNumber(header.value) }}
                </span>
              </span>
            </th>
          </tr>
        </thead>
        <slot
          v-if="ifHasBodySlot"
          name="body"
          v-bind="pageItems"
        />
        <tbody
          v-else-if="headerColumns.length"
          class="vue3-easy-data-table__body"
          :class="{'row-alternation': alternating}"
        >
          <slot
            name="body-prepend"
            v-bind="{
              items: pageItems,
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
            v-for="(item, index) in pageItems"
            :key="index"
          >
            <tr
              :class="[{'even-row': (index + 1) % 2 === 0 && !item.meta.selected},
                       {'selected': item.meta.selected},
                       typeof bodyRowClassName === 'string' ? bodyRowClassName : bodyRowClassName(item, index)]"
              data-test-id="table-row"
              @click="($event) => {
                clickRow($event, item, 'single');
                clickRowToExpand && updateExpandingItemIndexList(index + prevPageEndIndex, item, $event);
              }"
              @dblclick="clickRow($event, item, 'double')"
            >
              <td
                v-for="(column, i) in headerColumns"
                :key="i"
                :data-test-id="`table-row-${column}-column`"
                :style="getFixedDistance(column, 'td')"
                :class="[{
                  'shadow': column === lastFixedColumn,
                  'can-expand': column === 'expand',
                  'exactMatch': rowsWithExactMatchColumnsDictionary[item.meta.uniqueIndex]?.[column],
                // eslint-disable-next-line max-len
                }, typeof bodyItemClassName === 'string' ? bodyItemClassName : bodyItemClassName(column, i), `direction-${bodyTextDirection}`]"
                @click="column === 'expand' ? updateExpandingItemIndexList(index + prevPageEndIndex, item, $event) : null"
              >
                <slot
                  v-if="slots[`item-${column}`]"
                  :name="`item-${column}`"
                  v-bind="item"
                />
                <slot
                  v-else-if="slots[`item-${column.toLowerCase()}`]"
                  :name="`item-${column.toLowerCase()}`"
                  v-bind="item"
                />
                <template v-else-if="column === 'expand'">
                  <i
                    class="expand-icon"
                    :class="{'expanding': expandingItemIndexList.includes(prevPageEndIndex + index)}"
                  />
                </template>
                <template v-else-if="column === 'checkbox'">
                  <SingleSelectCheckBox
                    :checked="item.meta.selected"
                    @change="toggleSelectItem(item)"
                  />
                </template>
                <template v-else>
                  {{ generateColumnContent(column, item) }}
                </template>
              </td>
            </tr>
            <tr
              v-if="ifHasExpandSlot && expandingItemIndexList.includes(index + prevPageEndIndex)"
              :class="[{'even-row': (index + 1) % 2 === 0},
                       typeof bodyExpandRowClassName === 'string' ? bodyExpandRowClassName : bodyExpandRowClassName(item, index)]"
            >
              <td
                :colspan="headersForRender.length"
                class="expand"
              >
                <LoadingLine
                  v-if="item.expandLoading"
                  class="expand-loading"
                />
                <slot
                  name="expand"
                  v-bind="item"
                />
              </td>
            </tr>
          </template>
          <slot
            name="body-append"
            v-bind="{
              items: pageItems,
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
          <Loading v-else></Loading>
        </div>
      </div>

      <div
        v-if="!pageItems.length && !loading"
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
          {{ currentPaginationNumber }} of {{ maxPaginationNumber }}
        </span>
        <span
          v-else
          data-test-id="buttons-pagination-text"
        >
          {{ `${currentPageFirstIndex}–${currentPageLastIndex}` }}
          {{ rowsOfPageSeparatorMessage }} {{ totalItemsLength }}
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
</template>

<script setup lang="ts">
import {
  useSlots, computed, toRefs, ref, watch, provide, onMounted, PropType,
} from 'vue';
import { v4 as uuidv4 } from 'uuid';

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
import usePageItems from '../hooks/usePageItems';
import usePagination from '../hooks/usePagination';
import useRows from '../hooks/useRows';
import useServerOptions from '../hooks/useServerOptions';
import useTotalItems from '../hooks/useTotalItems';

import type { Header, Item, RowItem } from '../types/main';
import type { HeaderForRender } from '../types/internal';

// eslint-disable-next-line import/extensions
import { generateColumnContent } from '../utils';
import propsWithDefault from '../propsWithDefault';
import { SelectableEnum } from '../enums/main';

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
  itemsSelected,
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
} = toRefs(props);

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

const isManageTablePropertiesVisible = ref(false);
const checkedTableProperties = ref<string[]>([]);

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
  'update:itemsSelected',
  'update:serverOptions',
]);

const isMultipleSelectable = computed((): boolean => itemsSelected.value !== null);
const isServerSideMode = computed((): boolean => serverOptions.value !== null);

const isMultiSelect = computed((): boolean => selectable.value === SelectableEnum.MULTIPLE);

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

const tableProperties = computed(() => headers.value);

const {
  clientSortOptions,
  headerColumns,
  headersForRender,
  updateSortField,
  isMultiSorting,
  getMultiSortNumber,
} = useHeaders(
  checkedTableProperties,
  checkboxColumnWidth,
  expandColumnWidth,
  fixedCheckbox,
  fixedExpand,
  fixedIndex,
  headers,
  ifHasExpandSlot,
  indexColumnWidth,
  isMultipleSelectable,
  isServerSideMode,
  mustSort,
  serverOptionsComputed,
  showIndex,
  sortBy,
  sortType,
  multiSort,
  updateServerOptionsSort,
  emits,
);

const {
  rowsItemsComputed,
  rowsPerPageRef,
  updateRowsPerPage,
} = useRows(
  isServerSideMode,
  rowsItems,
  serverOptions,
  rowsPerPage,
);

const itemsWithMeta = computed((): RowItem[] => items.value.map((item: Item) => ({
  ...item,
  meta: {
    selected: false,
    uniqueIndex: uuidv4(),
    isExactMatch: false,
  },
})));

const {
  rowsWithExactMatchColumnsDictionary,
  totalItems,
  selectItemsComputed,
  totalItemsLength,
  toggleSelectAll,
  toggleSelectItem,
} = useTotalItems(
  exactMatch,
  isExactMatchCaseSensitive,
  headerColumns,
  isMultiSelect,
  clientSortOptions,
  filterOptions,
  isServerSideMode,
  itemsWithMeta,
  itemsSelected,
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
  totalItemsLength,
  rowsPerPageRef,
  serverOptions,
  updateServerOptionsPage,
);

const {
  currentPageFirstIndex,
  currentPageLastIndex,
  multipleSelectStatus,
  pageItems,
} = usePageItems(
  currentPaginationNumber,
  isMultipleSelectable,
  isServerSideMode,
  itemsWithMeta,
  rowsPerPageRef,
  selectItemsComputed,
  showIndex,
  totalItems,
  totalItemsLength,
);

const prevPageEndIndex = computed(() => {
  if (currentPaginationNumber.value === 0) return 0;
  return (currentPaginationNumber.value - 1) * rowsPerPageRef.value;
});

const {
  expandingItemIndexList,
  updateExpandingItemIndexList,
  clearExpandingItemIndexList,
} = useExpandableRow(
  pageItems,
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
  pageItems,
  selectItemsComputed,
  clickEventType,
  isMultipleSelectable,
  showIndex,
  emits,
);

// template style generation function
const getColStyle = (header: HeaderForRender): string | undefined => {
  const width = header.width ?? (fixedHeaders.value.length ? 100 : null);
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

const toggleManageTablePropertiesVisibility = () => {
  isManageTablePropertiesVisible.value = !isManageTablePropertiesVisible.value;
};

const clickOutsideManageTablePropertiesArea = () => {
  isManageTablePropertiesVisible.value = false;
};

const setCheckedTableProperties = (value: string[]) => {
  checkedTableProperties.value = value;
};

watch(manageTableProperties, (val) => {
  if (val) {
    checkedTableProperties.value = tableProperties.value.map((tableProperty) => tableProperty.value);
  }
}, {
  immediate: true,
});

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

watch([currentPaginationNumber, clientSortOptions, searchField, searchValue, filterOptions], () => {
  clearExpandingItemIndexList();
}, { deep: true });

const isTestMode = import.meta.env.MODE === 'test';
const exposeForTest = isTestMode ? {
  itemsWithMeta,
} : {};
defineExpose({
  currentPageFirstIndex,
  currentPageLastIndex,
  clientItemsLength: totalItemsLength,
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
    --easy-table-body-selected-row-background-color: #506c67;
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
    --easy-table-footer-padding: 0px 5px;
    --easy-table-footer-height: 36px;
    /**footer-rowsPerPage**/
    --easy-table-rows-per-page-selector-width: auto;
    --easy-table-rows-per-page-selector-option-padding: 5px;
    /*message*/
    --easy-table-message-font-color: #212121;
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
  justify-content: end;

  .sliders-icon {
    margin-right: 1rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
  }
}

.vue3-easy-data-table {
  .vue3-easy-data-table__main {
    min-height: v-bind(tableMinHeightPx);

    .vue3-easy-data-table__body {
      -webkit-user-select: none; /* Safari */
      user-select: none; /* Standard syntax */
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
