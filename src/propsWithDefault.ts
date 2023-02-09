import { PropType } from 'vue';
import type {
  SortType, ServerOptions, FilterOption,
  HeaderItemClassNameFunction, BodyItemClassNameFunction, BodyRowClassNameFunction,
  TextDirection,
} from './types/main';
import type { ClickEventType } from './types/internal';
import { Selectable } from './types/main';
import { SELECTABLE } from './constants';

export default {
  alternating: {
    type: Boolean,
    default: false,
  },
  buttonsPagination: {
    type: Boolean,
    default: false,
  },
  paginationWithInput: {
    type: Boolean,
    default: false,
  },
  hasCheckboxColumn: {
    type: Boolean,
    default: true,
  },
  checkboxColumnWidth: {
    type: Number,
    default: null,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  emptyMessage: {
    type: String,
    default: 'No Available Data',
  },
  expandColumnWidth: {
    type: Number,
    default: 36,
  },
  filterOptions: {
    type: Array as PropType<FilterOption[]>,
    default: null,
  },
  fixedExpand: {
    type: Boolean,
    default: false,
  },
  fixedHeader: {
    type: Boolean,
    default: true,
  },
  fixedCheckbox: {
    type: Boolean,
    default: false,
  },
  fixedIndex: {
    type: Boolean,
    default: false,
  },
  headerTextDirection: {
    type: String as PropType<TextDirection>,
    default: 'left',
  },
  bodyTextDirection: {
    type: String as PropType<TextDirection>,
    default: 'left',
  },
  hideFooter: {
    type: Boolean,
    default: false,
  },
  hideRowsPerPage: {
    type: Boolean,
    default: false,
  },
  hideHeader: {
    type: Boolean,
    default: false,
  },
  indexColumnWidth: {
    type: Number,
    default: 60,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  rowsPerPage: {
    type: Number,
    default: 25,
  },
  rowsItems: {
    type: Array as PropType<number[]>,
    default: () => [25, 50, 100],
  },
  rowsPerPageMessage: {
    type: String,
    default: 'rows per page:',
  },
  searchField: {
    type: [String, Array] as PropType<string | string[]>,
    default: '',
  },
  searchValue: {
    type: String,
    default: '',
  },
  serverOptions: {
    type: Object as PropType<ServerOptions> | null,
    default: null,
  },
  serverItemsLength: {
    type: Number,
    default: 0,
  },
  showIndex: {
    type: Boolean,
    default: false,
  },
  sortBy: {
    type: [String, Array] as PropType<string | string[]>,
    default: '',
  },
  sortType: {
    type: [String, Array] as PropType<SortType | SortType[]>,
    default: 'asc',
  },
  multiSort: {
    type: Boolean,
    default: false,
  },
  tableMinHeight: {
    type: Number,
    default: 180,
  },
  tableHeight: {
    type: Number,
    default: null,
  },
  themeColor: {
    type: String,
    default: '#42b883',
  },
  tableClassName: {
    type: String,
    default: '',
  },
  headerClassName: {
    type: String,
    default: '',
  },
  headerItemClassName: {
    type: [Function, String] as PropType<HeaderItemClassNameFunction | string>,
    default: '',
  },
  bodyRowClassName: {
    type: [Function, String] as PropType<BodyRowClassNameFunction | string>,
    default: '',
  },
  bodyExpandRowClassName: {
    type: [Function, String] as PropType<BodyRowClassNameFunction | string>,
    default: '',
  },
  bodyItemClassName: {
    type: [Function, String] as PropType<BodyItemClassNameFunction | string>,
    default: '',
  },
  noHover: {
    type: Boolean,
    default: false,
  },
  borderCell: {
    type: Boolean,
    default: false,
  },
  mustSort: {
    type: Boolean,
    default: false,
  },
  rowsOfPageSeparatorMessage: {
    type: String,
    default: 'of',
  },
  clickEventType: {
    type: String as PropType<ClickEventType>,
    default: 'single',
  },
  clickRowToExpand: {
    type: Boolean,
    default: false,
  },
  selectable: {
    type: String,
    validator(value: Selectable) {
      return [
        SELECTABLE.SINGLE,
        SELECTABLE.MULTIPLE,
      ].includes(value);
    },
    default: SELECTABLE.SINGLE,
  },
  exactMatch: {
    type: Boolean,
    default: false,
  },
  isExactMatchCaseSensitive: {
    type: Boolean,
    default: false,
  },
  manageTableProperties: {
    type: Boolean,
    default: false,
  },
  manageTablePropertiesLabel: {
    type: String,
    default: 'Properties',
  },
  columnsResizable: {
    type: Boolean,
    default: false,
  },
};
