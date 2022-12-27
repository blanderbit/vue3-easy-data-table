export type SortType = 'asc' | 'desc';

export type FilterComparison = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'between';

export type Item = Record<string, any>;

export type RowItem = Item & {
  meta: {
    selected: boolean,
    uniqueIndex: string,
    isExactMatch: boolean,
    groupParent: number,
    isGrouped: boolean,
    children: RowItem[],
    showChildren: boolean,
  }
};

export type FilterOption = {
  field: string
  comparison: 'between'
  criteria: [number, number]
} | {
  field: string
  comparison: '=' | '!='
  criteria: number | string
} | {
  field: string
  comparison: '>' | '>=' | '<' | '<='
  criteria: number
} | {
  field: string
  comparison: (value: any, criteria: string) => boolean
  criteria: string
};

export type Header = {
  text: string
  value: string
  sortable?: boolean
  fixed?: boolean
  visible?: boolean
  width?: number
  groupable?: boolean
  grouped?: boolean
  groupBy?: (value: string) => string
};

export type ServerOptions = {
  page: number
  rowsPerPage: number
  sortBy?: string | string[]
  sortType?: SortType | SortType[]
};

export type ClickRowArgument = RowItem & {
  indexInCurrentPage?: number
};

export type UpdateSortArgument = {
  sortType: SortType | null
  sortBy: string
};

export type ExactMatchDictionary = {
  [key: string]: {
    [key: string]: boolean
  }
};

export type HeaderItemClassNameFunction = (header: Header, index: number) => string;
export type BodyRowClassNameFunction = (item: Item, index: number) => string;
export type BodyItemClassNameFunction = (column: string, index: number) => string;

export type TextDirection = 'center' | 'left' | 'right';
