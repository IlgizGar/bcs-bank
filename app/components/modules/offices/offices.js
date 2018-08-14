/* global ymaps:true */
/* eslint no-undef: "error" */

import $ from 'jquery';
import 'jscrollpane';
import Helpers from '../../../scripts/helpers';

export default class Offices {
  constructor() {
    this.map = null;
    this.init();
  }

  init() {
    this.initMap();
    Offices.setScrollPane();
  }

  initMap() {
    Helpers.getGeolocation((location) => {
      ymaps.ready(() => {
        Helpers.getGeolocation();
        // Создание карты.
        this.map = new ymaps.Map('map-container', {
          center: [55.76, 37.57],
          zoom: 13,
          controls: [],
        });
        this.map.behaviors.disable('scrollZoom');
        this.map.options.set('suppressMapOpenBlock', true);
      });
    });
  }

  static setScrollPane() {
    const pane = $('.offices__tabs.scroll-pane');

    pane.jScrollPane({
      contentWidth: 100,
      verticalDragMinHeight: 16,
      verticalDragMaxHeight: 16,
      verticalGutter: 16,
      mouseWheelSpeed: 1,
      animateDuration: 1000,
    });

    // Пересчет высоты при раскрытии элементов
    $('.collapse__control').on('click', () => {
      Offices.reInitScroll(pane, 225);
    });

    // Пересчет высоты при смене таба
    $('.offices__tab-control').on('click', () => {
      Offices.reInitScroll(pane);
    });
  }

  static reInitScroll(pane, time = 0) {
    setTimeout(() => {
      pane.data('jsp').reinitialise();
    }, time);
  }
}
