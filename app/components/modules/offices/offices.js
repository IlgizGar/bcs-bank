/* global ymaps:true */
/* eslint no-undef: "error" */

import $ from 'jquery';
import 'jscrollpane';


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
    if (!$('[data-ymap]').length) {
      Offices.loadScript('https://api-maps.yandex.ru/2.1/?lang=ru_RU', () => {
        ymaps.ready(() => {
          // Создание карты.
          this.map = new ymaps.Map('map-container', {
            center: [55.76, 37.64],
            zoom: 13,
          });
          this.map.behaviors.disable('scrollZoom');
        });
      });
    }
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

  static loadScript(url, callback) {
    const script = document.createElement('script');
    script.type = 'text/javascript';

    if (script.readyState) { // IE
      script.onreadystatechange = () => {
        if (script.readyState === 'loaded' ||
          script.readyState === 'complete') {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else { // Others
      script.onload = () => {
        callback();
      };
    }

    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}
