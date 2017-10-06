import '../sass/style.scss';

import feather from 'feather-icons';
import { $, $$ } from './modules/bling';
import typeAhead from './modules/typeAhead';

document.addEventListener('touchstart', function() {}, true);

feather.replace({
  'stroke-width': 1,
  width: 24,
  height: 24
});

typeAhead($('.search'));
