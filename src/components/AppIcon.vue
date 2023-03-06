<template>
  <span
    class="app-icon"
  >
    <font-awesome-icon
      :icon="faIcon"
      :class="[additionalClass, 'icon']"
      :size="size"
    />
    <slot />
  </span>
</template>

<script setup>

import { computed } from 'vue';
import { FontAwesomeIcon, iconLibrary } from '@/plugins/fontawesome';

const props = defineProps({
  namespace: {
    type: String,
    default: 'fas',
    note: 'Default namespace',
  },
  icon: {
    type: [String, Object],
    required: true,
  },
  size: {
    type: String,
    default: null,
  },
  additionalClass: {
    type: [String, Object],
    default: '',
  },
});

const faIcon = computed(() => {
  let { icon } = props;
  if (typeof icon === 'object') {
    [icon] = Object.keys(icon).filter((key) => icon[key]);
  }
  const libraryIcon = iconLibrary[props.namespace]?.[icon];
  if (!libraryIcon) {
    /* eslint-disable no-console */
    console.error('Could not find one or more icon(s)', {
      prefix: props.namespace,
      iconName: props.icon,
    });
    return {};
  }
  return libraryIcon;
});
</script>
