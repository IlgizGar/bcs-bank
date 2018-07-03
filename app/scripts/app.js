import $ from 'jquery';
import svg4everybody from 'svg4everybody';
import babelpolyfill from 'babel-polyfill';

import Header from '../components/modules/header/header';
import Contact from '../components/library/contact/contact';

$(() => {
  svg4everybody();
  babelpolyfill();
});

Header('.js-header');
Contact('.js-contact');
