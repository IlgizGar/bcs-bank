import $ from 'jquery';
import svg4everybody from 'svg4everybody';

import Header from '../components/modules/header/header';
import Contact from '../components/library/contact/contact';
import Accordion from '../components/library/accordion/accordion';
import Dropdown from '../components/library/dropdown/dropdown';
import Tabs from '../components/modules/tabbar/tabbar';

$(() => {
  svg4everybody();

  global.dropdowns = [];
  for (const dropdown of $('.js-dropdown')) {
    global.dropdowns.push(Dropdown(dropdown));
  }
});

Header('.js-header');
// Contact('.js-contact');
Tabs('.js-tabbar');
Accordion('.js-accordion');
