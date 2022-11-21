<template>
  <div class="pagination-with-input">
    <input
      :value="currentPaginationNumber"
      class="input"
      @blur="switchToPage($event.target.value)"
      @keyup.enter="switchToPage($event.target.value)"
    />
  </div>
</template>

<script lang="ts" setup>
const emits = defineEmits(['updatePage']);

const props = defineProps({
  maxPaginationNumber: { type: Number, required: true },
  currentPaginationNumber: { type: Number, required: true },
});

const switchToPage = (page: string) => {
  const parsedPage = parseInt(page, 10);
  if (parsedPage > 0 && parsedPage <= props.maxPaginationNumber && parsedPage !== props.currentPaginationNumber) {
    emits('updatePage', parsedPage);
  }
};
</script>

<style lang="scss" scoped>
.pagination-with-input{
 .input {
   height: 28px;
   width: var(--easy-table-footer-pagination-input-width);
   outline: none;
 }
}
</style>
