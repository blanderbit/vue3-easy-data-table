<template>
  <span>search field:</span>
  <select v-model="searchField">
    <option>name</option>
    <option>indicator.weight</option>
  </select>

  <br />

  <span>search value: </span>
  <input
    type="text"
    :value="searchValue"
    @input="debouncedInput"
  >
  <div>
    <DataTable
      ref="dataTable"
      v-model:selected-rows="selectedRows"
      :click-row-to-expand="false"
      :exact-match="true"
      :is-exact-match-case-sensitive="true"
      :show-index="true"
      :manage-table-properties="true"
      manage-table-properties-label="Custom properties label"
      selectable="single"
      alternating
      border-cell
      no-hover
      :headers="headers"
      :items="items"
      :search-field="searchField"
      :search-value="searchValue"
      :rows-per-page="10"
      :buttons-pagination="false"
      :pagination-with-input="true"
      :columns-resizable="true"
      :has-checkbox-column="true"
      :sort-by="sortBy"
      :sort-type="sortType"
      theme-color="#1d90ff"
      table-class-name="hc-table"
      header-class-name="hc-header"
      :body-row-class-name="bodyRowClassNameFunction"
      :header-item-class-name="headerItemClassNameFunction"
      :body-item-class-name="bodyItemClassNameFunction"
      :body-expand-row-class-name="bodyExpandRowClassNameFunction"
      multi-sort
      body-text-direction="left"
      header-text-direction="left"
      :filter-options="filterOptions"
      click-event-type="single"
      @click-row="showItem"
      @update-sort="updateSort"
      @update-filter="updateFilter"
    >
      <template #expand="row">
        <div style="padding: 15px">
          {{ row.player }} in {{ row.team }} won championships.
        </div>
      </template>

      <template #header-name="header">
        <div class="filter-column">
          <span
            class="filter-icon"
            @click.stop="showNameFilter=!showNameFilter"
          >
            icon
          </span>
          {{ header.text }}
          <div
            v-if="showNameFilter"
            class="filter-menu filter-age-menu"
          >
            <input v-model="nameCriteria">
          </div>
        </div>
      </template>

      <template #row-lastAttended="row">
        <div style="padding: 15px">
          {{ row.lastAttended }} camelCase
        </div>
      </template>

      <template #row-player="row">
        <div style="padding: 15px">
          {{ row.player }} player
        </div>
      </template>

      <template #body.append>
        <span>body.append</span>
      </template>
    </DataTable>

    <!-- <div class="customize-footer">
      <div class="customize-rows-per-page">
        <select
          class="select-items"
          @change="updateRowsPerPageSelect"
        >
          <option
            v-for="item in rowsPerPageOptions"
            :key="item"
            :selected="item === rowsPerPageActiveOption"
            :value="item"
          >
            {{ item }} rows per page
          </option>
        </select>
      </div>
      <div class="customize-index">
        Now displaying: {{ currentPageFirstIndex }} ~ {{ currentPageLastIndex }} of {{ totalItemsLength }}
      </div>
      <div class="customize-buttons">
        <span
          v-for="paginationNumber in maxPaginationNumber"
          class="customize-button"
          :class="{'active': paginationNumber === currentPaginationNumber}"
          @click="updatePage(paginationNumber)"
        >
          {{ paginationNumber }}
        </span>
      </div>
      <div class="customize-pagination">
        <button
          class="prev-page"
          :disabled="isFirstPage"
          @click="prevPage"
        >
          prev page
        </button>
        <button
          class="next-page"
          :disabled="isLastPage"
          @click="nextPage"
        >
          next page
        </button>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import {
  computed, ref, watch,
} from 'vue';
// import { useRowsPerPage } from 'use-vue3-easy-data-table';
// import type { UseRowsPerPageReturn } from 'use-vue3-easy-data-table';
import type {
  Header,
  Item,
  ClickRowArgument,
  UpdateSortArgument,
  HeaderItemClassNameFunction,
  BodyItemClassNameFunction,
  BodyRowClassNameFunction,
  SortType,
  Row,
} from '../types/main';
import DataTable from '../components/DataTable.vue';
import {
  mockClientNestedItems,
} from '../mock';
import { tableHeaders, tableItems } from '../data/table-data';
import { createDebounce } from '../utils';

// null | 'player' | 'indicator.weight' | ['indicator.weight'] | ['indicator.weight', 'indicator.height']
const searchField = ref(null);
const searchValue = ref('');
const sortBy = ref([]); // ['indicator.weight', 'number'] | 'number'
const sortType = ref<SortType | SortType[] | undefined>([]); // ['desc', 'asc']

const filterOptions = [
  // {
  //   field: 'indicator.height',
  //   comparison: (value: string, criteria: string) => value === criteria,
  //   criteria: '6-9',
  // },
];

// const headers: Header[] = headersMocked;

const updateFilter = (items: Item[]) => {
  // console.log('filter items');
  // console.log(JSON.stringify(items));
};

const items = ref(tableItems);

// const items = ref<Item[]>(mockClientItems());
const headers = tableHeaders;

const selectedRows = ref<Row[]>([]);

watch(selectedRows, (val) => {
  console.log('debug selectedRows on client side', val);
}, {
  immediate: true,
  deep: true,
});

const switchToNested300 = () => {
  items.value = mockClientNestedItems(300);
};

const switchToNested = () => {
  items.value = mockClientNestedItems(100);
};

const showItem = (item: ClickRowArgument) => {
  console.log('showItem', JSON.stringify(item));
};

const updateSort = (sortOption: UpdateSortArgument) => {
  console.log('sortOption', sortOption);
};
// filtering

const ageCriteria = ref<[number, number]>([1, 15]);

const favouriteSportCriteria = ref('all');

const showNameFilter = ref(false);
const nameCriteria = ref('');

// const filterOptions = computed((): FilterOption[] => {
//   const filterOptionsArray: FilterOption[] = [];
//   if (favouriteSportCriteria.value !== 'all') {
//     filterOptionsArray.push({
//       field: 'favouriteSport',
//       comparison: '=',
//       criteria: favouriteSportCriteria.value,
//     });
//   }
//   filterOptionsArray.push({
//     field: 'age',
//     comparison: 'between',
//     criteria: ageCriteria.value,
//   });
//   filterOptionsArray.push({
//     field: 'name',
//     criteria: nameCriteria.value,
//     comparison: (value, criteria): boolean => (value != null
//       && value.includes(`name-${criteria}`)),
//   });
//   return filterOptionsArray;
// });
const bodyRowClassNameFunction: BodyRowClassNameFunction = (item: Item, index: number): string => (index === 0 ? 'first-row test-row' : '');
const bodyExpandRowClassNameFunction: BodyRowClassNameFunction = (item: Item, index: number): string => 'expand-row';

const headerItemClassNameFunction: HeaderItemClassNameFunction = (header: Header, index: number): string => (header.value === 'name' ? 'name-header' : '');
const bodyItemClassNameFunction: BodyItemClassNameFunction = (column: string, index: number): string => (column === 'name' ? 'name-item' : '');
// $ref dataTable
const dataTable = ref();

// index related
const currentPageFirstIndex = computed(() => dataTable.value?.currentPageFirstIndex);
const currentPageLastIndex = computed(() => dataTable.value?.currentPageLastIndex);

const totalItemsLength = computed(() => dataTable.value?.totalItemsLength);

// paginations related
const maxPaginationNumber = computed(() => dataTable.value?.maxPaginationNumber);
const currentPaginationNumber = computed(() => dataTable.value?.currentPaginationNumber);

const isFirstPage = computed(() => dataTable.value?.isFirstPage);
const isLastPage = computed(() => dataTable.value?.isLastPage);

const nextPage = () => {
  dataTable.value.nextPage();
};
const prevPage = () => {
  dataTable.value.prevPage();
};
const updatePage = (paginationNumber: number) => {
  dataTable.value.updatePage(paginationNumber);
};
const isDataHeader = (header: Header) => !(header.value === 'checkbox' || header.value === 'index' || header.value === 'expand');

// rows per page
const rowsPerPageOptions = computed(() => dataTable.value?.rowsPerPageOptions);
const rowsPerPageActiveOption = computed(() => dataTable.value?.rowsPerPageActiveOption);

const updateRowsPerPageSelect = (e: Event) => {
  dataTable.value.updateRowsPerPageActiveOption(Number((e.target as HTMLInputElement).value));
};

const debouncedInput = (event: InputEvent) => {
  createDebounce()(() => {
    const { value } = event.target as HTMLInputElement;
    searchValue.value = value;
  });
};

// const {
//   rowsPerPageOptions,
//   rowsPerPageActiveOption,
//   updateRowsPerPageActiveOption,
// }: UseRowsPerPageReturn = useRowsPerPage(dataTable);

// const updateRowsPerPageSelect = (e: Event) => {
//   updateRowsPerPageActiveOption(Number((e.target as HTMLInputElement).value));
// };
</script>

<style scoped>
.customize-footer {
  margin: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.customize-footer div {
  margin: 5px;
}
.customize-button {
  display: inline-block;
  width: 20px;
  height: 20px;
  text-align: center;
  border-radius: 100%;
  cursor: pointer;
  padding: 3px;
  line-height: 20px;
}
.customize-button.active {
  color: #fff;
  background-color: #3db07f;
}
.customize-pagination button {
  margin: 0 5px;
  cursor: pointer;
}
.filter-wrapper {
  display: flex;
  align-items: center;
}
.slider {
  flex-grow: 1;
}
</style>

<style>
.hc-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;

  --easy-table-header-font-size: 12px;
  --easy-table-header-height: 80px;
  --easy-table-header-font-color: #c1cad4;
  --easy-table-header-background-color: #2d3a4f;
  /*--easy-table-footer-pagination-input-width: 50px;*/
  /* --easy-table-header-item-padding: 10px 15px; */

  --easy-table-body-even-row-font-color: #fff;
  --easy-table-body-even-row-background-color: #4c5d7a;

  --easy-table-body-row-font-color: #c0c7d2;
  --easy-table-body-row-background-color: #2d3a4f;
  --easy-table-body-row-height: 40px;
  --easy-table-body-row-font-size: 14px;
  --easy-table-body-row-hover-font-color: #2d3a4f;
  --easy-table-body-row-hover-background-color: #eee;
  --easy-table-body-selected-row-background-color: #506c67;

  /* --easy-table-body-item-padding: 10px 15px; */

  --easy-table-footer-background-color: #2d3a4f;
  --easy-table-footer-font-color: #c0c7d2;
  --easy-table-footer-font-size: 14px;
  --easy-table-footer-padding: 0px 10px;
  --easy-table-footer-height: 40px;

  --easy-table-rows-per-page-selector-width: 70px;
  --easy-table-rows-per-page-selector-option-padding: 10px;

  --easy-table-scrollbar-track-color: #4c5d7a;
  --easy-table-scrollbar-color: #4c5d7a;
  --easy-table-scrollbar-corner-color: #4c5d7a;
  --easy-table-scrollbar-thumb-color: #2d3a4f;

  --easy-table-loading-mask-background-color: #2d3a4f;
}

</style>
