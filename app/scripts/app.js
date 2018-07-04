import $ from 'jquery';
import svg4everybody from 'svg4everybody';

import Header from '../components/modules/header/header';
import Contact from '../components/library/contact/contact';
import Accordion from '../components/library/accordion/accordion';

import Dropdown from '../components/library/dropdown/dropdown';

import Tabs from '../components/modules/tabbar/tabbar';

global.dropdowns = [];

$(() => {
  svg4everybody();

  for (let dropdown of $('.js-dropdown')) {
    dropdowns.push(Dropdown(dropdown));
  }
});

Header('.js-header');
Contact('.js-contact');
Tabs('.js-tabbar');
Accordion('.js-accordion');
