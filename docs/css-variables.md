# CSS variables

| Name                                               | Default            | Description                                                                                                                  |
|----------------------------------------------------|--------------------|------------------------------------------------------------------------------------------------------------------------------|
| --easy-table-border                                | 1px solid #e0e0e0; |                                                                                                                              |
| --easy-table-row-border                            | 1px solid #e0e0e0; |                                                                                                                              |
| --easy-table-header-font-size                      | 12px;              |                                                                                                                              |
| --easy-table-header-height                         | 36px;              |                                                                                                                              |
| --easy-table-header-font-color                     | #373737;           |                                                                                                                              |
| --easy-table-header-background-color               | #fff;              |                                                                                                                              |
| --easy-table-header-item-padding                   | 0px 10px;          |                                                                                                                              |
| --easy-table-body-row-height                       | 36px;              |                                                                                                                              |
| --easy-table-body-row-font-size                    | 12px;              |                                                                                                                              |
| --easy-table-body-row-font-color                   | #212121;           |                                                                                                                              |
| --easy-table-body-row-background-color             | #fff;              |                                                                                                                              |
| --easy-table-body-row-hover-font-color             | #212121;           |                                                                                                                              |
| --easy-table-body-row-hover-background-color       | #eee;              |                                                                                                                              |
| --easy-table-body-even-row-font-color              | #373737;           | Don't forget to use with [alternating](https://hc200ok.github.io/vue3-easy-data-table-doc/features/alternating.html) feature |
| --easy-table-body-even-row-background-color        | #fff;              | Don't forget to use with [alternating](https://hc200ok.github.io/vue3-easy-data-table-doc/features/alternating.html) feature |
| --easy-table-body-item-padding                     | 0px 10px;          |                                                                                                                              |
| --easy-table-footer-background-color               | #fff;              |                                                                                                                              |
| --easy-table-footer-font-color                     | #212121;           |                                                                                                                              |
| --easy-table-footer-font-size                      | 12px;              |                                                                                                                              |
| --easy-table-footer-padding                        | 0px 5px;           |                                                                                                                              |
| --easy-table-footer-height                         | 36px;              |                                                                                                                              |
| --easy-table-rows-per-page-selector-width          | auto               | Width of rows-per-page selector                                                                                              |
| --easy-table-rows-per-page-selector-option-padding | 5px                | Padding of rows-per-page selector option                                                                                     |
| --easy-table-message-font-color                    | #212121;           | Empty message related, when no items in table                                                                                |
| --easy-table-message-font-size                     | 12px;              | Empty message related, when no items in table                                                                                |
| --easy-table-message-padding                       | 20px;              | Empty message related, when no items in table                                                                                |
| --easy-table-loading-mask-background-color         | #fff;              |                                                                                                                              |
| --easy-table-loading-mask-opacity                  | 0.5;               |                                                                                                                              |
| --easy-table-scrollbar-track-color                 | #fff;              |                                                                                                                              |
| --easy-table-scrollbar-color                       | #fff;              |                                                                                                                              |
| --easy-table-scrollbar-thumb-color                 | #c1c1c1;           |                                                                                                                              |
| --easy-table-scrollbar-corner-color                | #fff;              |                                                                                                                              |
| --easy-table-buttons-pagination-border             | 1px solid #e0e0e0; |                                                                                                                              |
| --easy-table-body-selected-row-background-color    | 1px solid #e0e0e0; | Set background color for selected row(s)                                                                                     |
| --easy-table-footer-pagination-input-width         | 1.875rem           | Set pagination input width                                                                                                   |


## Example

```html
<template>
  <EasyDataTable
    theme-color="#1d90ff"
    table-class-name="customize-table"
    header-text-direction="center"
    body-text-direction="center"
  />
</template>
<style>
.customize-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;

  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: #c1cad4;
  --easy-table-header-background-color: #2d3a4f;

  --easy-table-header-item-padding: 10px 15px;

  --easy-table-body-even-row-font-color: #fff;
  --easy-table-body-even-row-background-color: #4c5d7a;

  --easy-table-body-row-font-color: #c0c7d2;
  --easy-table-body-row-background-color: #2d3a4f;
  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-size: 14px;

  --easy-table-body-row-hover-font-color: #2d3a4f;
  --easy-table-body-row-hover-background-color: #eee;

  --easy-table-body-item-padding: 10px 15px;

  --easy-table-footer-background-color: #2d3a4f;
  --easy-table-footer-font-color: #c0c7d2;
  --easy-table-footer-font-size: 14px;
  --easy-table-footer-padding: 0px 10px;
  --easy-table-footer-height: 50px;

  --easy-table-rows-per-page-selector-width: 70px;
  --easy-table-rows-per-page-selector-option-padding: 10px;

  --easy-table-scrollbar-track-color: #2d3a4f;
  --easy-table-scrollbar-color: #2d3a4f;
  --easy-table-scrollbar-thumb-color: #4c5d7a;;
  --easy-table-scrollbar-corner-color: #2d3a4f;

  --easy-table-loading-mask-background-color: #2d3a4f;
}
</style>
```