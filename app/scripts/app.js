import $ from 'jquery';
import svg4everybody from 'svg4everybody';
import Header from '../components/modules/header/header';
import Contact from '../components/library/contact/contact';

$(() => {
  svg4everybody();
});

Header('.js-header');
Contact('.js-contact');
