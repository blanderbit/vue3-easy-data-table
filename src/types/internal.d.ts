import type { Row, SortType } from './main';

export type ServerOptionsComputed = {
  page: number
  rowsPerPage: number
  sortBy: string | string[] | null
  sortType: SortType | SortType[] | null
}

export type HeaderForRender = {
  text: string,
  value: string,
  sortable?: boolean,
  sortType?: SortType | 'none',
  fixed?: Boolean,
  width?: number,
  groupable?: boolean,
  grouped?: boolean,
  groupBy?: (value: string) => string
}

export type GroupByHeader = {
  groupBy: ((value: string) => string) | null,
  groupHeader: HeaderForRender,
  groupKey: string,
  meta: {
    groupParent: number
    showChildren: boolean
    children: Row[] | GroupByHeader[],
    isGroup: boolean
  }
}

export type FlattenRows = (GroupByHeader | Row)[]

export type ClientSortOptions = {
  sortBy: string | string[],
  sortDesc: boolean | boolean[],
}

export type ClickEventType = 'single' | 'double'

export type MultipleSelectStatus = 'allSelected' | 'noneSelected' | 'partSelected'

// eslint-disable-next-line max-len
export type EmitsEventName = 'clickRow' | 'expandRow' | 'updateSort' | 'update:itemsSelected' | 'update:serverOptions' | 'updateFilter'
export type ObjectValues<T> = T[keyof T];
