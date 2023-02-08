import VueFaFontAwesome from 'vue-fa';
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faMinusSquare,
  faPlusSquare,
  faSlidersH,
  faSort,
  faSortDown,
  faSortUp,
  faStream,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

function collectLibrary(arr) {
  return arr.reduce((acc, currEl) => {
    acc[currEl.prefix] = !acc[currEl.prefix]
      ? { [currEl.iconName]: currEl }
      : {
        ...acc[currEl.prefix],
        [currEl.iconName]: currEl,
      };
    currEl.icon[2].forEach((iconName) => {
      if (typeof iconName === 'string') {
        acc[currEl.prefix][iconName] = currEl;
      }
    });
    return acc;
  }, {});
}

const iconsUsed = [
  faSlidersH,
  faAngleLeft,
  faAnglesLeft,
  faAngleRight,
  faAnglesRight,
  faStream,
  faTimesCircle,
  faPlusSquare,
  faMinusSquare,
  faSort,
  faSortUp,
  faSortDown,
];
export const iconLibrary = collectLibrary(iconsUsed);
export const FontAwesomeIcon = VueFaFontAwesome;
