import { ref } from 'vue';
import { HeaderForRender } from '../types/internal';

export default function useTableProperties() {
  const tableProperties = ref<HeaderForRender[]>([]);
  const checkedTableProperties = ref<string[]>([]);
  const isManageTablePropertiesVisible = ref(false);

  const toggleManageTablePropertiesVisibility = () => {
    isManageTablePropertiesVisible.value = !isManageTablePropertiesVisible.value;
  };

  const setCheckedTableProperties = (value: string[]) => {
    checkedTableProperties.value = value;
  };

  return {
    tableProperties,
    isManageTablePropertiesVisible,
    checkedTableProperties,
    setCheckedTableProperties,
    toggleManageTablePropertiesVisibility,
  };
}
