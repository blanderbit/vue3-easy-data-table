<template>
  <div
    ref="manageTablePropertiesRef"
    class="manage-table-properties"
  >
    <div
      class="manage-table-properties__body"
    >
      <span>{{ label }}</span>
      <div class="properties">
        <div
          v-for="column of transformedTablePropertyColumns"
          :key="column.value"
          data-test-id="property-item"
          class="properties__item"
        >
          <input
            :id="column.value"
            v-model="selectedTablePropertyColumns"
            type="checkbox"
            :value="column.value"
            :disabled="column.disabled"
            data-test-id="property-item-checkbox"
            class="properties__item__checkbox"
          >
          <label
            class="properties__item__label"
            :for="column.value"
          >
            {{ column.shortTitle }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed, PropType, ref, toRefs, watch,
} from 'vue';
import useDetectOutsideClick from '../hooks/useDetectOutsideClick';
import { HeaderForRender } from '../types/internal';

const emits = defineEmits(['set-checked-table-properties', 'close']);

const props = defineProps({
  columns: { type: Array as PropType<HeaderForRender[]>, required: true },
  modelValue: { type: Array as PropType<string[]>, required: true },
  label: { type: String, default: null },
});
const { columns, modelValue } = toRefs(props);

const COLUMN_TITLE_PROPERTY_LENGTH_LIMIT = 8;

const selectedTablePropertyColumns = ref<string[]>([]);
const manageTablePropertiesRef = ref<HTMLElement | null>(null);

const transformedTablePropertyColumns = computed(() => columns.value.map((column) => {
  const disabled = (column.groupable && column.grouped) || (selectedTablePropertyColumns.value.length === 1
          && selectedTablePropertyColumns.value[0] === column.value);
  const shortTitle = column.text.length > COLUMN_TITLE_PROPERTY_LENGTH_LIMIT
    ? `${column.text.slice(0, COLUMN_TITLE_PROPERTY_LENGTH_LIMIT)}...`
    : column.text;
  return {
    ...column,
    disabled,
    shortTitle,
  };
}));

watch(modelValue, (val) => {
  selectedTablePropertyColumns.value = val;
}, {
  immediate: true,
});

watch(selectedTablePropertyColumns, (val) => {
  emits('set-checked-table-properties', val);
});

useDetectOutsideClick(manageTablePropertiesRef, () => {
  emits('close');
});

</script>

<style lang="scss" scoped>
.manage-table-properties {
  position: relative;
  z-index: 50;

  &__body {
    right: 0.5rem;
    width: max-content;
    font-size: 0.75rem;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%);
    position: absolute;
    padding: 0.5rem;
    margin-top: 1rem;
    font-weight: 700;
    border-radius: 0.25rem;
    background-color: #fff;
  }

  .properties {
    margin-left: 0.75rem;
    margin-right: 0.5rem;
    margin-top: 0.5rem;

    &__item {
      display: flex;
      align-items: center;
      margin-top: 0.25rem;

      &__checkbox {
        vertical-align: middle;
        position: relative;
        bottom: 1px;
      }

      &__label {
        display: block;
        margin-left: 0.5rem;
      }
    }
  }
}
</style>
