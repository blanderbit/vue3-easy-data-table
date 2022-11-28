/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import crypto from 'crypto';
import DataTable from '../src/components/DataTable.vue';
import { mockClientItems, headersMocked, mockServerItems } from '../src/mock';

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
  },
});

// Button Pagination
describe('Button Pagination', () => {
  it('should render', () => {
    const wrapper = mount(DataTable, {
      props: {
        items: mockClientItems(200),
        buttonsPagination: true,
        headers: headersMocked,
        rowsPerPage: 5,
      },
    });
    expect(wrapper.find('.vue3-easy-data-table').exists()).toBe(true);
  });

  /**
   * conditions:
   *  1. total items count is 200
   *  2. rows per page is 5
   * expection:
   *  max pagination number should be 40
   */
  it('Max pagination number should be 40', () => {
    const wrapper = mount(DataTable, {
      props: {
        items: mockClientItems(200),
        buttonsPagination: true,
        headers: headersMocked,
        rowsPerPage: 5,
      },
    });
    expect(wrapper.find('.item.button:last-of-type').exists()).toBe(true);
    expect(wrapper.find('.item.button:last-of-type').text()).toBe('40');
  });

  it('Prev arrow button unavailable in first page', () => {
    const wrapper = mount(DataTable, {
      props: {
        items: mockClientItems(200),
        buttonsPagination: true,
        headers: headersMocked,
        rowsPerPage: 5,
      },
    });
    expect(wrapper.find('.previous-page__click-button').classes()).include('first-page');
  });

  it('Click the second pagination button to navigate to the second page', async () => {
    const wrapper = mount(DataTable, {
      props: {
        items: mockClientItems(200),
        buttonsPagination: true,
        headers: headersMocked,
        rowsPerPage: 5,
      },
    });
    const buttonArr = wrapper.findAll('.item.button');
    const secondButton = buttonArr.at(1);
    await secondButton.trigger('click');
    expect(secondButton.classes()).include('active');

    const tdArr = wrapper.findAll('td');
    const firstTd = tdArr.at(0);
    expect(firstTd.text()).toBe(mockClientItems(200)[5].name);
    const trArr = wrapper.findAll('tbody tr');
    expect(trArr.length).equal(5);
  });
});

// Selecting
describe('Selecting', () => {
  describe('Single selection', () => {
    it('Should select only one row by clicking on row', async () => {
      const wrapper = mount(DataTable, {
        props: {
          itemsSelected: [],
          items: mockClientItems(3),
          headers: headersMocked,
          selection: 'single',
          rowsPerPage: 3,
        },
      });

      const { itemsWithMeta } = wrapper.vm;
      const tableRows = wrapper.findAll("[data-test-id='table-row']");
      const firstTableRow = tableRows.at(0);
      const firstTableRowSelectCheckbox = firstTableRow.findComponent('.easy-checkbox');
      expect(firstTableRow.classes()).not.toContain('selected');
      expect(firstTableRowSelectCheckbox.props().checked).toBeFalsy();
      await firstTableRow.trigger('click');
      expect(firstTableRow.classes()).toContain('selected');
      expect(firstTableRowSelectCheckbox.props().checked).toBeTruthy();
      const updateItemsSelectedEvent = wrapper.emitted('update:itemsSelected');
      expect(updateItemsSelectedEvent).toHaveLength(1);
      expect(updateItemsSelectedEvent[0][0][0].meta.selected).toBeTruthy(); // element at 0 index.
      expect(updateItemsSelectedEvent[0]).toEqual([[itemsWithMeta[0]]]);
    });

    it('Should select only one row by clicking on 1 select checkboxes', async () => {
      const mockItems = mockClientItems(200);
      const wrapper = mount(DataTable, {
        props: {
          itemsSelected: [],
          items: mockItems,
          headers: headersMocked,
          selection: 'single',
          rowsPerPage: 5,
        },
      });
      const { itemsWithMeta } = wrapper.vm;
      const tableRows = wrapper.findAll("[data-test-id='table-row']");
      const firstTableRow = tableRows.at(0);
      const firstSingleCheckbox = firstTableRow.find('.easy-checkbox');
      expect(firstTableRow.classes()).not.toContain('selected');
      expect(firstSingleCheckbox.find('input').attributes()).not.toHaveProperty('checked');
      await firstSingleCheckbox.trigger('click');
      expect(firstTableRow.classes()).toContain('selected');
      expect(firstSingleCheckbox.find('input').attributes()).toHaveProperty('checked');
      const updateItemsSelectedEvent = wrapper.emitted('update:itemsSelected');
      expect(updateItemsSelectedEvent).toHaveLength(1);
      expect(updateItemsSelectedEvent[0][0][0].meta.selected).toBeTruthy(); // element at 0 index.
      expect(updateItemsSelectedEvent[0]).toEqual([[itemsWithMeta[0]]]);
    });

    it('Should select only one row using ctrl key', async () => {
      const wrapper = mount(DataTable, {
        props: {
          itemsSelected: [],
          items: mockClientItems(3),
          headers: headersMocked,
          selection: 'single',
          rowsPerPage: 3,
        },
      });

      const { itemsWithMeta } = wrapper.vm;
      const tableRows = wrapper.findAll("[data-test-id='table-row']");
      const firstTableRow = tableRows.at(0);
      const secondTableRow = tableRows.at(1);
      const firstTableRowSelectCheckbox = firstTableRow.findComponent('.easy-checkbox');
      const secondTableRowSelectCheckbox = secondTableRow.findComponent('.easy-checkbox');
      expect(firstTableRowSelectCheckbox.props().checked).toBeFalsy();
      expect(firstTableRow.classes()).not.toContain('selected');
      await firstTableRow.trigger('click');
      expect(firstTableRow.classes()).toContain('selected');
      expect(firstTableRowSelectCheckbox.props().checked).toBeTruthy();
      expect(secondTableRow.classes()).not.toContain('selected');
      await secondTableRow.trigger('click', { ctrlKey: true });
      expect(firstTableRow.classes()).toEqual([]);
      expect(secondTableRow.classes()).toContain('selected');
      expect(firstTableRowSelectCheckbox.props().checked).toBeFalsy();
      expect(secondTableRowSelectCheckbox.props().checked).toBeTruthy();

      const updateItemsSelectedEvent = wrapper.emitted('update:itemsSelected');
      expect(updateItemsSelectedEvent).toHaveLength(2);
      expect(updateItemsSelectedEvent[0][0][0].meta.selected).toBeFalsy(); // element at 0 index.
      expect(updateItemsSelectedEvent[1][0][0].meta.selected).toBeTruthy(); // element at 1 index.
      expect(updateItemsSelectedEvent[1]).toEqual([[itemsWithMeta[1]]]);
    });

    it('Should select only one row using shift key', async () => {
      const wrapper = mount(DataTable, {
        props: {
          itemsSelected: [],
          items: mockClientItems(3),
          headers: headersMocked,
          selection: 'single',
          rowsPerPage: 3,
        },
      });

      const { itemsWithMeta } = wrapper.vm;
      const tableRows = wrapper.findAll("[data-test-id='table-row']");
      const firstTableRow = tableRows.at(0);
      const secondTableRow = tableRows.at(1);
      const firstTableRowSelectCheckbox = firstTableRow.findComponent('.easy-checkbox');
      const secondTableRowSelectCheckbox = secondTableRow.findComponent('.easy-checkbox');
      expect(firstTableRow.classes()).not.toContain('selected');
      expect(firstTableRowSelectCheckbox.props().checked).toBeFalsy();
      await firstTableRow.trigger('click');
      expect(firstTableRow.classes()).toContain('selected');
      expect(secondTableRow.classes()).not.toContain('selected');
      expect(firstTableRowSelectCheckbox.props().checked).toBeTruthy();
      await secondTableRow.trigger('click', { ctrlKey: true });
      expect(firstTableRow.classes()).not.toContain('selected');
      expect(secondTableRow.classes()).toContain('selected');
      expect(firstTableRowSelectCheckbox.props().checked).toBeFalsy();
      expect(secondTableRowSelectCheckbox.props().checked).toBeTruthy();

      const updateItemsSelectedEvent = wrapper.emitted('update:itemsSelected');
      expect(updateItemsSelectedEvent).toHaveLength(2);
      expect(updateItemsSelectedEvent[0][0][0].meta.selected).toBeFalsy(); // element at 0 index.
      expect(updateItemsSelectedEvent[1][0][0].meta.selected).toBeTruthy(); // element at 1 index.
      expect(updateItemsSelectedEvent[1]).toEqual([[itemsWithMeta[1]]]);
    });

    it('Should select only one row by clicking on 2 rows', async () => {
      const wrapper = mount(DataTable, {
        props: {
          itemsSelected: [],
          items: mockClientItems(3),
          headers: headersMocked,
          selection: 'single',
          rowsPerPage: 3,
        },
      });

      const { itemsWithMeta } = wrapper.vm;
      const tableRows = wrapper.findAll("[data-test-id='table-row']");
      const firstTableRow = tableRows.at(0);
      const secondTableRow = tableRows.at(1);
      const firstTableRowSelectCheckbox = firstTableRow.findComponent('.easy-checkbox');
      const secondTableRowSelectCheckbox = secondTableRow.findComponent('.easy-checkbox');
      expect(firstTableRow.classes()).not.toContain('selected');
      expect(firstTableRowSelectCheckbox.props().checked).toBeFalsy();
      await firstTableRow.trigger('click');
      expect(firstTableRow.classes()).toContain('selected');
      expect(firstTableRowSelectCheckbox.props().checked).toBeTruthy();
      expect(secondTableRow.classes()).not.toContain('selected');
      await secondTableRow.trigger('click');
      expect(firstTableRow.classes()).not.toContain('selected');
      expect(secondTableRow.classes()).toContain('selected');
      expect(firstTableRowSelectCheckbox.props().checked).toBeFalsy();
      expect(secondTableRowSelectCheckbox.props().checked).toBeTruthy();

      const updateItemsSelectedEvent = wrapper.emitted('update:itemsSelected');
      expect(updateItemsSelectedEvent).toHaveLength(2);
      expect(updateItemsSelectedEvent[0][0][0].meta.selected).toBeFalsy(); // element at 0 index.
      expect(updateItemsSelectedEvent[1][0][0].meta.selected).toBeTruthy(); // element at 1 index.
      expect(updateItemsSelectedEvent[1]).toEqual([[itemsWithMeta[1]]]);
    });

    it('Should select only one row by clicking on 2 select checkboxes', async () => {
      const mockItems = mockClientItems(200);
      const wrapper = mount(DataTable, {
        props: {
          itemsSelected: [],
          items: mockItems,
          headers: headersMocked,
          selection: 'single',
          rowsPerPage: 5,
        },
      });
      const { itemsWithMeta } = wrapper.vm;
      const tableRows = wrapper.findAll("[data-test-id='table-row']");
      const firstTableRow = tableRows.at(0);
      const secondTableRow = tableRows.at(1);
      const firstSingleCheckbox = firstTableRow.find('.easy-checkbox');
      const secondSingleCheckbox = secondTableRow.find('.easy-checkbox');
      const firstSingleCheckboxInput = firstSingleCheckbox.find('input');
      const secondSingleCheckboxInput = secondSingleCheckbox.find('input');
      expect(firstSingleCheckboxInput.attributes()).not.toHaveProperty('checked');
      expect(firstTableRow.classes()).not.toContain('selected');
      await firstSingleCheckbox.trigger('click');
      expect(firstTableRow.classes()).toContain('selected');
      expect(secondTableRow.classes()).not.toContain('selected');
      expect(firstSingleCheckboxInput.attributes()).toHaveProperty('checked');
      expect(secondSingleCheckboxInput.attributes()).not.toHaveProperty('checked');
      await secondSingleCheckbox.trigger('click');
      expect(secondTableRow.classes()).toContain('selected');
      expect(firstTableRow.classes()).not.toContain('selected');
      expect(firstSingleCheckboxInput.attributes()).not.toHaveProperty('checked');
      expect(secondSingleCheckboxInput.attributes()).toHaveProperty('checked');
      const updateItemsSelectedEvent = wrapper.emitted('update:itemsSelected');
      expect(updateItemsSelectedEvent).toHaveLength(2);
      expect(updateItemsSelectedEvent[0][0][0].meta.selected).toBeFalsy(); // element at 0 index.
      expect(updateItemsSelectedEvent[1][0][0].meta.selected).toBeTruthy(); // element at 1 index.
      expect(updateItemsSelectedEvent[1]).toEqual([[itemsWithMeta[1]]]);
    });

    it('Should not select all rows by clicking on multi select', async () => {
      const wrapper = mount(DataTable, {
        props: {
          itemsSelected: [],
          items: mockClientItems(3),
          headers: headersMocked,
          rowsPerPage: 3,
          selectable: 'single',
        },
      });
      const { itemsWithMeta } = wrapper.vm;
      const tableRows = wrapper.findAll("[data-test-id='table-row']");
      tableRows.forEach((tableRow) => {
        expect(tableRow.classes()).not.toContain('selected');
      });
      await wrapper.find('thead .easy-checkbox').trigger('click');
      const updateItemsSelectedEvent = wrapper.emitted('update:itemsSelected');
      expect(updateItemsSelectedEvent).toBeFalsy();
      tableRows.forEach((tableRow) => {
        expect(tableRow.classes()).not.toContain('selected');
      });
    });
  });

  describe('Multi selection', () => {
    it('Should select only 2 rows by clicking on rows', async () => {
      const mockItems = mockClientItems(200);
      const wrapper = mount(DataTable, {
        props: {
          itemsSelected: [],
          items: mockItems,
          headers: headersMocked,
          rowsPerPage: 5,
          selectable: 'multi',
        },
      });
      const { itemsWithMeta } = wrapper.vm;
      const tableRows = wrapper.findAll("[data-test-id='table-row']");
      const firstTableRow = tableRows.at(0);
      const thirdTableRow = tableRows.at(2);
      const firstTableRowSelectCheckbox = firstTableRow.findComponent('.easy-checkbox');
      const thirdTableRowSelectCheckbox = thirdTableRow.findComponent('.easy-checkbox');
      expect(firstTableRow.classes()).not.toContain('selected');
      expect(firstTableRowSelectCheckbox.props().checked).toBeFalsy();
      expect(thirdTableRowSelectCheckbox.props().checked).toBeFalsy();
      await firstTableRow.trigger('click');
      expect(firstTableRowSelectCheckbox.props().checked).toBeTruthy();
      expect(firstTableRow.classes()).toContain('selected');
      expect(thirdTableRow.classes()).not.toContain('selected');
      await thirdTableRow.trigger('click');
      expect(firstTableRowSelectCheckbox.props().checked).toBeFalsy();
      expect(thirdTableRowSelectCheckbox.props().checked).toBeTruthy();
      const updateItemsSelectedEvent = wrapper.emitted('update:itemsSelected');
      expect(updateItemsSelectedEvent).toHaveLength(2);
      updateItemsSelectedEvent[1][0].forEach((updateItemsSelectedEventElement) => {
        expect(updateItemsSelectedEventElement.meta.selected).toBeTruthy();
      });
      expect(firstTableRow.classes()).not.toContain('selected');
      expect(thirdTableRow.classes()).toContain('selected');
      const expected = [[updateItemsSelectedEvent[0][0][0], updateItemsSelectedEvent[1][0][0]]];
      const received = [[itemsWithMeta[0], itemsWithMeta[2]]];
      expect(expected).toEqual(received);
    });

    it('Should select only 2 rows by clicking on select checkboxes', async () => {
      const mockItems = mockClientItems(200);
      const wrapper = mount(DataTable, {
        props: {
          itemsSelected: [],
          items: mockItems,
          headers: headersMocked,
          rowsPerPage: 5,
          selectable: 'multi',
        },
      });
      const { itemsWithMeta } = wrapper.vm;
      const tableRows = wrapper.findAll("[data-test-id='table-row']");
      const firstTableRow = tableRows.at(0);
      const secondTableRow = tableRows.at(1);
      const firstTableRowSelectCheckbox = firstTableRow.findComponent('.easy-checkbox');
      const secondTableRowSelectCheckbox = secondTableRow.findComponent('.easy-checkbox');
      expect(firstTableRow.classes()).not.toContain('selected');
      expect(secondTableRow.classes()).not.toContain('selected');
      expect(firstTableRowSelectCheckbox.props().checked).toBeFalsy();
      expect(secondTableRowSelectCheckbox.props().checked).toBeFalsy();
      await firstTableRowSelectCheckbox.trigger('click');
      expect(firstTableRow.classes()).toContain('selected');
      expect(firstTableRowSelectCheckbox.props().checked).toBeTruthy();
      await secondTableRowSelectCheckbox.trigger('click');
      expect(firstTableRow.classes()).toContain('selected');
      expect(firstTableRowSelectCheckbox.props().checked).toBeTruthy();
      expect(secondTableRowSelectCheckbox.props().checked).toBeTruthy();
      expect(secondTableRow.classes()).toContain('selected');
      const updateItemsSelectedEvent = wrapper.emitted('update:itemsSelected');
      expect(updateItemsSelectedEvent).toHaveLength(2);
      updateItemsSelectedEvent[1][0].forEach((updateItemsSelectedEventElement) => {
        expect(updateItemsSelectedEventElement.meta.selected).toBeTruthy();
      });
      expect(updateItemsSelectedEvent[1]).toEqual([[itemsWithMeta[1], itemsWithMeta[0]]]);
    });

    it('Should gather data of the the first and sixth row items', async () => {
      const mockItems = mockClientItems(200);
      const wrapper = mount(DataTable, {
        props: {
          itemsSelected: [],
          items: mockItems,
          headers: headersMocked,
          rowsPerPage: 5,
          selectable: 'multi',
        },
      });
      const { itemsWithMeta } = wrapper.vm;
      const singleCheckboxArr = wrapper.findAll('.easy-checkbox');
      const firstSingleCheckbox = singleCheckboxArr.at(1);
      await firstSingleCheckbox.trigger('click');

      const nextPageButton = wrapper.find('.next-page__click-button');
      await nextPageButton.trigger('click');

      const singleCheckboxArrInSecondPage = wrapper.findAll('.easy-checkbox');
      const firstSingleCheckboxInSecondPage = singleCheckboxArrInSecondPage.at(1);
      await firstSingleCheckboxInSecondPage.trigger('click');

      const updateItemsSelectedEvent = wrapper.emitted('update:itemsSelected');
      expect(updateItemsSelectedEvent).toHaveLength(2);
      updateItemsSelectedEvent[1][0].forEach((updateItemsSelectedEventElement) => {
        expect(updateItemsSelectedEventElement.meta.selected).toBeTruthy();
      });
      expect(updateItemsSelectedEvent[1]).toEqual([[itemsWithMeta[5], itemsWithMeta[0]]]);
    });

    it('Should select rows using shift key', async () => {
      const wrapper = mount(DataTable, {
        props: {
          itemsSelected: [],
          items: mockClientItems(7),
          headers: headersMocked,
          rowsPerPage: 5,
          selectable: 'multi',
        },
      });
      const { itemsWithMeta } = wrapper.vm;
      const tableRows = wrapper.findAll("[data-test-id='table-row']");
      const firstTableRow = tableRows.at(0);
      await firstTableRow.trigger('click');
      const thirdTableRow = tableRows.at(2);
      await thirdTableRow.trigger('click', { shiftKey: true });
      const updateItemsSelectedEvent = wrapper.emitted('update:itemsSelected');
      expect(updateItemsSelectedEvent).toHaveLength(2);
      tableRows.slice(0, 2).forEach((tableRow) => {
        expect(tableRow.classes()).toContain('selected');
      });
      updateItemsSelectedEvent[1][0].forEach((updateItemsSelectedEventElement) => {
        expect(updateItemsSelectedEventElement.meta.selected).toBeTruthy();
      });
      expect(updateItemsSelectedEvent[1]).toEqual([[itemsWithMeta[0], itemsWithMeta[1], itemsWithMeta[2]]]);
    });

    it('Should select rows using ctrl key', async () => {
      const wrapper = mount(DataTable, {
        props: {
          itemsSelected: [],
          items: mockClientItems(200),
          headers: headersMocked,
          rowsPerPage: 5,
          selectable: 'multi',
        },
      });
      const { itemsWithMeta } = wrapper.vm;
      const tableRows = wrapper.findAll("[data-test-id='table-row']");
      const firstTableRow = tableRows.at(0);
      const thirdTableRow = tableRows.at(2);
      expect(firstTableRow.classes()).not.toContain('selected');
      expect(thirdTableRow.classes()).not.toContain('selected');
      await firstTableRow.trigger('click');
      await thirdTableRow.trigger('click', { ctrlKey: true });
      const updateItemsSelectedEvent = wrapper.emitted('update:itemsSelected');
      expect(updateItemsSelectedEvent).toHaveLength(2);
      updateItemsSelectedEvent[1][0].forEach((updateItemsSelectedEventElement) => {
        expect(updateItemsSelectedEventElement.meta.selected).toBeTruthy();
      });
      expect(firstTableRow.classes()).toContain('selected');
      expect(thirdTableRow.classes()).toContain('selected');
      expect(updateItemsSelectedEvent[1]).toEqual([[itemsWithMeta[2], itemsWithMeta[0]]]);
    });

    it('Should select all rows by clicking on multi select', async () => {
      const wrapper = mount(DataTable, {
        props: {
          itemsSelected: [],
          items: mockClientItems(3),
          headers: headersMocked,
          rowsPerPage: 3,
          selectable: 'multi',
        },
      });
      const { itemsWithMeta } = wrapper.vm;
      const tableRows = wrapper.findAll("[data-test-id='table-row']");
      tableRows.forEach((tableRow) => {
        expect(tableRow.classes()).not.toContain('selected');
      });
      await wrapper.find('thead .easy-checkbox').trigger('click');
      const updateItemsSelectedEvent = wrapper.emitted('update:itemsSelected');
      expect(updateItemsSelectedEvent).toHaveLength(1);
      updateItemsSelectedEvent[0][0].forEach((updateItemsSelectedEventElement, idx) => {
        expect(tableRows[idx].classes()).toContain('selected');
        expect(updateItemsSelectedEventElement.meta.selected).toBeTruthy();
      });
      expect(updateItemsSelectedEvent[0]).toEqual([[itemsWithMeta[0], itemsWithMeta[1], itemsWithMeta[2]]]);
    });
  });
});

// Single field sorting
describe('Single field sorting', () => {
  it('Sorting by height column', async () => {
    const mockItems = mockClientItems(200);
    const wrapper = mount(DataTable, {
      props: {
        items: mockItems,
        headers: headersMocked,
        rowsPerPage: 5,
        sortBy: 'height',
        sortType: 'desc',
      },
    });
    const trArr = wrapper.findAll('tbody tr');
    const firstTr = trArr.at(0);
    expect(firstTr.findAll('td').at(0).text()).toBe(mockItems[mockItems.length - 1].name);
  });

  it('Sorting by height column', async () => {
    const mockItems = mockClientItems(200);
    const wrapper = mount(DataTable, {
      props: {
        items: mockItems,
        headers: headersMocked,
        rowsPerPage: 5,
        sortBy: 'height',
        sortType: 'desc',
      },
    });
    const sortableTh = wrapper.find('.sortable');
    await sortableTh.trigger('click');
    expect(sortableTh.classes()).include('none');

    const trArr = wrapper.findAll('tbody tr');
    const firstTr = trArr.at(0);
    expect(firstTr.findAll('td').at(0).text()).toBe(mockItems[0].name);
  });
});

// Searching
describe('Searching', () => {
  it('Searching by specific field', async () => {
    const mockItems = mockClientItems(200);
    const wrapper = mount(DataTable, {
      props: {
        items: mockItems,
        headers: headersMocked,
        rowsPerPage: 5,
        searchField: 'address',
        searchValue: 'address-115',
      },
    });
    const trArr = wrapper.findAll('tbody tr');
    expect(trArr.length).toBe(1);
    expect(wrapper.findAll('tbody td').at(0).text()).toBe(mockItems[114].name);
  });
});

// Server side paginate and sort
describe('Server side paginate and sort', () => {
  it('Click next page button to load from server', async () => {
    const serverOptions = {
      page: 1,
      rowsPerPage: 100,
      sortBy: 'height',
      sortType: 'desc',
    };

    const {
      serverCurrentPageItems,
      serverTotalItemsLength,
    } = await mockServerItems(serverOptions);

    const wrapper = mount(DataTable, {
      props: {
        serverItemsLength: serverTotalItemsLength,
        serverOptions,
        items: serverCurrentPageItems,
        headers: headersMocked,
      },
    });
    expect(wrapper.findAll('tbody td').at(0).text()).toBe(serverCurrentPageItems[0].name);

    const nextPageButton = wrapper.find('.next-page__click-button');
    await nextPageButton.trigger('click');

    const updateServerOptionsEvent = wrapper.emitted('update:serverOptions');
    expect(updateServerOptionsEvent).toHaveLength(1);
    expect(updateServerOptionsEvent[0]).toEqual([{
      page: 2,
      rowsPerPage: 100,
      sortBy: 'height',
      sortType: 'desc',
    }]);
  });
});
