import { ref } from 'vue';
import { Header } from '../types/main';

export default function useTableProperties() {
  const tableProperties = ref<Header[]>([]);
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
