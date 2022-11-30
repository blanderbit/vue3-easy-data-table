import {
  type ObjectDirective,
} from 'vue';

type ClickOutside = (event: MouseEvent) => void

interface ExtendedHTMLElement extends HTMLElement {
    clickOutside: ClickOutside
}

export const clickOutside: ObjectDirective<ExtendedHTMLElement, Function> = {
  mounted(el, binding, vnode) {
    el.clickOutside = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener('click', el.clickOutside);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutside);
  },
};
