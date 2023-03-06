<template>
  <div
    v-if="hasDoubleArrows"
    class="first-page__click-button"
    data-test-id="first-page-click-button"
    :class="{'first-page': isFirstPage}"
    @click="emits('clickFirstPage')"
  >
    <app-icon
      data-test-id="arrow-left-icon"
      class="arrow arrow-left"
      icon="angles-left"
      size="lg"
    />
  </div>
  <div
    class="previous-page__click-button"
    :class="{'first-page': isFirstPage}"
    @click="emits('clickPrevPage')"
  >
    <app-icon
      class="arrow arrow-left"
      icon="angle-left"
      size="lg"
    />
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
    <app-icon
      class="arrow arrow-right"
      icon="angle-right"
      size="lg"
    />
  </div>
  <div
    v-if="hasDoubleArrows"
    class="last-page__click-button"
    data-test-id="last-page-click-button"
    :class="{'last-page': isLastPage}"
    @click="emits('clickLastPage')"
  >
    <app-icon
      data-test-id="arrow-right-icon"
      class="arrow arrow-right"
      icon="angles-right"
      size="lg"
    />
  </div>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue';
import AppIcon from './AppIcon.vue';

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
