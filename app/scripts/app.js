import $ from 'jquery';
import svg4everybody from 'svg4everybody';
import Header from '../components/modules/header/header';

$(() => {
  svg4everybody();
});

Header('.js-header');
