/* global ymaps:true */
/* eslint no-undef: "error" */

import $ from 'jquery';
import 'jscrollpane';
import Helpers from '../../../scripts/helpers';

export default class Offices {
  constructor(offices) {
    this.appBlock = offices;
    this.pane = $('.offices__tabs.scroll-pane');
    this.currentTabId = this.getCurrentTab();
    this.map = null;
    this.markCollection = null;
    this.city = 'Москва';
    this.points = [];
    this.init();
  }

  init() {
    this.getPoints();
    Helpers.getGeolocation((location) => {
      ymaps.ready(() => {
        this.initMap();
        this.initObjectCollection();
        this.addPoints();
        this.getCurrentTab();
      });
    });
    this.setScrollPane();
  }

  initMap() {
    Helpers.getGeolocation();
    // Создание карты.
    this.map = new ymaps.Map('map-container', {
      center: [55.76, 37.57],
      zoom: 13,
      controls: [],
    });
    this.map.behaviors.disable('scrollZoom');
    this.map.options.set('suppressMapOpenBlock', true);
    this.setZoomControls();
  }

  initObjectCollection() {
    this.markCollection = new ymaps.GeoObjectCollection(null, {
      preset: 'islands#blueIcon',
    });
  }

  setZoomControls() {
    // Создадим пользовательский макет ползунка масштаба.
    const ZoomLayout = ymaps.templateLayoutFactory.createClass(`<div class='offices__zoom-controls'>
          <div id='zoom-in' class='offices__zoom-button'>
            <svg width="12px" height="12px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g transform="translate(-46.000000, -786.000000)" fill="currentColor">
                      <g transform="translate(55.000000, 791.000000) rotate(-90.000000) translate(-55.000000, -791.000000) translate(-26.000000, 766.000000)">
                          <path d="M76,24 L76,16 L78,16 L78,24 L86,24 L86,26 L78,26 L78,34 L76,34 L76,26 L68,26 L68,24 L76,24 Z" ></path>
                      </g>
                  </g>
              </g>
          </svg>
          </div>
          <div id='zoom-out' class='offices__zoom-button'>
            <svg width="12px" height="2px" viewBox="0 0 18 2" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g transform="translate(-46.000000, -844.000000)" fill="currentColor">
                        <g transform="translate(55.000000, 791.000000) rotate(-90.000000) translate(-55.000000, -791.000000) translate(-26.000000, 766.000000)">
                            <rect transform="translate(27.000000, 25.000000) rotate(-90.000000) translate(-27.000000, -25.000000) " x="18" y="24" width="18" height="2"></rect>
                        </g>
                    </g>
                </g>
            </svg>
          </div>
          </div>`, {

      // Переопределяем методы макета, чтобы выполнять дополнительные действия
      // при построении и очистке макета.
      build() {
        // Вызываем родительский метод build.
        ZoomLayout.superclass.build.call(this);

        // Привязываем функции-обработчики к контексту и сохраняем ссылки
        // на них, чтобы потом отписаться от событий.
        this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
        this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

        // Начинаем слушать клики на кнопках макета.
        $('#zoom-in').bind('click', this.zoomInCallback);
        $('#zoom-out').bind('click', this.zoomOutCallback);
      },

      clear() {
        // Снимаем обработчики кликов.
        $('#zoom-in').unbind('click', this.zoomInCallback);
        $('#zoom-out').unbind('click', this.zoomOutCallback);

        // Вызываем родительский метод clear.
        ZoomLayout.superclass.clear.call(this);
      },

      zoomIn() {
        const map = this.getData().control.getMap();
        map.setZoom(map.getZoom() + 1, { checkZoomRange: true });
      },

      zoomOut() {
        const map = this.getData().control.getMap();
        map.setZoom(map.getZoom() - 1, { checkZoomRange: true });
      },
    });
    const zoomControl = new ymaps.control.ZoomControl({
      options: {
        layout: ZoomLayout,
        position: { bottom: 80 },
      },
    });
    this.map.controls.add(zoomControl);
    zoomControl.getLayout().then((e) => {
      $(e._parentElement).addClass('offices__ymaps-zoom-wrapper');
    });
  }

  getPoints() {
    const citySelector = this.city ? `[data-city="${this.city}"]` : '';
    this.appBlock.find(`.offices__collapse${citySelector}`).children('.collapse__item').each((i, el) => {
      this.points.push({
        id: Offices.generatePointId($(el).data('coords')),
        coordinates: $(el).data('coords'),
      });
    });
  }

  addPoints() {
    Object.values(this.points).forEach((el) => {
      const placemark = new ymaps.Placemark(el.coordinates, {
        collapse_id: el.id,
      });
      placemark.events.add('click', (e) => {
        this.onPointEvent(e, el.coordinates);
      });
      this.markCollection.add(placemark);
    });
    this.map.geoObjects.add(this.markCollection);
  }

  onPointEvent(e, coordinates) {
    const currentCollapse = global.collapses[this.currentTabId];
    const target = this.appBlock.find(`#${this.currentTabId} [data-coords="[${coordinates.join()}]"] .collapse__control`);
    this.scrollToCollapse(target);
    currentCollapse.openContent(target);
    Offices.reInitScroll(this.pane, 225);
    this.togglePointState(e.get('target'), target);
  }

  togglePointState(point, collapse) {
    this.markCollection.each((el) => {
      el.options.unset('preset');
    });
    if (collapse.parent().hasClass('collapse__item_state-open')) {
      point.options.set('preset', 'islands#greenIcon');
    }
  }

  setScrollPane() {
    this.pane.jScrollPane({
      contentWidth: 100,
      verticalDragMinHeight: 16,
      verticalDragMaxHeight: 16,
      verticalGutter: 16,
      mouseWheelSpeed: 1,
      animateDuration: 1000,
    });

    // Пересчет высоты при раскрытии элементов
    $('.collapse__control').on('click', (e) => {
      this.scrollToCollapse($(e.target));
      Offices.reInitScroll(this.pane, 225);
      this.togglePointState(this.getPointById(Offices.generatePointId($(e.target).closest('.collapse__item').data('coords'))), $(e.target).closest('.collapse__control'));
    });

    // Пересчет высоты при смене таба
    $('.offices__tab-control').on('click', () => {
      Offices.reInitScroll(this.pane);
    });
  }

  static reInitScroll(pane, time = 0) {
    setTimeout(() => {
      pane.data('jsp').reinitialise();
    }, time);
  }

  scrollToCollapse(el) {
    this.pane.data('jsp').scrollToY(el.closest('.collapse__item')[0].offsetTop, 75);
  }

  getPointById(id) {
    let point = null;
    this.markCollection.each((el) => {
      if (id === el.properties.get('collapse_id')) {
        point = el;
      }
    });
    return point;
  }

  static generatePointId(coords) {
    return coords.join().replace(/[. ,]+/g, '');
  }

  getCurrentTab() {
    return this.appBlock.find('.offices__content .tabs .tabs__item:visible').attr('id');
  }
}

