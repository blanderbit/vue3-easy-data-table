import { Plugin } from 'vue';
import { clickOutside } from './click-outside';

export const appDirectives: Required<Plugin> = {
  install(Vue): void {
    Vue.directive('click-outside', clickOutside);
  },
};
