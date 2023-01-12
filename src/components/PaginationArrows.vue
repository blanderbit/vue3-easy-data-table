<template>
  <div
    v-if="hasDoubleArrows"
    class="first-page__click-button"
    data-test-id="first-page-click-button"
    :class="{'first-page': isFirstPage}"
    @click="emits('clickFirstPage')"
  >
    <i
      data-test-id="arrow-right-icon"
      class="arrow arrow-right fa fa-angles-left fa-lg"
    />
  </div>
  <div
    class="previous-page__click-button"
    :class="{'first-page': isFirstPage}"
    @click="emits('clickPrevPage')"
  >
    <i class="arrow arrow-right fa fa-angle-left fa-lg" />
  </div>
  <slot
    v-if="slots.buttonsPagination"
    name="buttonsPagination"
  />
  <slot
    v-if="slots.paginationWithInput"
    name="paginationWithInput"
  />
  <div
    class="next-page__click-button"
    :class="{'last-page': isLastPage}"
    @click="emits('clickNextPage')"
  >
    <i class="arrow arrow-left fa fa-angle-right fa-lg" />
  </div>
  <div
    v-if="hasDoubleArrows"
    class="last-page__click-button"
    data-test-id="last-page-click-button"
    :class="{'last-page': isLastPage}"
    @click="emits('clickLastPage')"
  >
    <i
      data-test-id="arrow-left-icon"
      class="arrow arrow-left fa fa-angles-right fa-lg"
    />
  </div>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue';

defineProps({
  isFirstPage: { type: Boolean, required: false },
  isLastPage: { type: Boolean, required: false },
  hasDoubleArrows: { type: Boolean, default: false },
});

const emits = defineEmits(['clickFirstPage', 'clickPrevPage', 'clickNextPage', 'clickLastPage']);

const slots = useSlots();
</script>
<style lang="scss" scoped>
.previous-page__click-button,
.next-page__click-button,
.first-page__click-button,
.last-page__click-button {
  margin: 0 4px;

  .arrow {
    cursor: pointer;
    color: var(--easy-table-footer-pagination-arrow-background-color);
  }
}

.previous-page__click-button.first-page,
.next-page__click-button.last-page,
.first-page__click-button.first-page,
.last-page__click-button.last-page {
  .arrow {
    cursor: not-allowed;
    color: var(--easy-table-footer-pagination-arrow-disabled-background-color);
  }
}
</style>
