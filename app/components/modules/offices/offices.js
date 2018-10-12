/* global ymaps:true */
/* eslint no-undef: "error" */

import $ from 'jquery';
import 'jscrollpane';
import Cookie from 'js-cookie';
import Helpers from '../../../scripts/helpers';
import AskQuestion from '../../library/question-popup/question-popup';

export default class Offices {
  constructor(offices) {
    this.appBlock = offices;
    this.pane = $('.offices__tabs');
    this.content = this.pane.parent();
    this.iconNormal = {
      iconLayout: 'default#image',
      iconImageHref: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4gICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoMjR2MjRIMHoiLz4gICAgICAgIDxnPiAgICAgICAgICAgIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEyIiBmaWxsPSIjRkZGIi8+ICAgICAgICAgICAgPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiM0NTczRDkiLz4gICAgICAgICAgICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSIjRkZGIi8+ICAgICAgICA8L2c+ICAgIDwvZz48L3N2Zz4=',
      iconImageSize: [24, 24],
      iconImageOffset: [-12, -12],
    };
    this.iconActive = {
      iconLayout: 'default#image',
      iconImageHref: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSI1NiIgdmlld0JveD0iMCAwIDU2IDU2Ij4gICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoNTZ2NTZIMHoiLz4gICAgICAgIDxnIGZpbGwtcnVsZT0ibm9uemVybyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTMgNikiPiAgICAgICAgICAgIDxwYXRoIGZpbGw9IiMzQjY2QzUiIGQ9Ik0zMCAxNC45NDNjLS4wMDIuNDA5LS4wMTkuODE4LS4wNSAxLjIyNS0uNDkyIDYuMTgzLTQuNTk0IDEyLjUzMS04LjI1NiAxOC41OTRMMTUgNDVWMjkuODg2Yy04LjI4NCAwLTE1LTYuNjktMTUtMTQuOTQzUzYuNzE2IDAgMTUgMGM4LjI4NCAwIDE1IDYuNjkgMTUgMTQuOTQzeiIvPiAgICAgICAgICAgIDxjaXJjbGUgY3g9IjE1IiBjeT0iMTUiIHI9IjYiIGZpbGw9IiNGRkYiLz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==',
      iconImageSize: [56, 56],
      iconImageOffset: [-28, -44],
    };
    this.switcher = $('.js-offices-switcher');
    this.detailBlock = $('.js-offices-detail');
    this.detailBlockClose = $('.js-offices-detail-close');
    this.cityInput = $('.context input[name="current-city_input"]');
    this.city = null;
    this.currentTabId = null;
    this.map = null;
    this.markCollection = null;
    this.points = [];
    this.init();
  }

  init() {
    this.onCityChange();
    this.getCurrentTab();
    Helpers.getGeolocation((location) => {
      ymaps.ready(() => {
        const userCity = Cookie.get('select-city') !== undefined ? Cookie.get('select-city') : this.checkUserCity(location.GeocoderMetaData.InternalToponymInfo.geoid);
        this.initMap();
        this.questionHandler();
        this.initObjectCollection();
        if (userCity) {
          global.contexts['select-city'].handleNamedList($(`.js-context-item[data-value="${userCity}"]`));
        } else {
          this.changeCity();
        }
      });
    });
    this.setScrollPane();

    // Блок обработки карты и списка на мобильной версии
    this.handleSwitch();

    if (window.innerWidth > 991) {
      this.appBlock.removeClass('state_listed');
      Offices.reInitScroll(this.pane, 250);
    } else {
      this.pane.data('jsp').destroy();
    }

    $(window).on('resize', () => {
      this.handleMapSize();
      if (window.innerWidth > 991) {
        if (this.appBlock.hasClass('state_listed')) {
          this.appBlock.removeClass('state_listed');
        }
        if (this.appBlock.hasClass('state_explored')) {
          this.removeExploredDetail();
        }
      } else {
        if (this.switcher.data('state') === 'list') {
          if (!this.appBlock.hasClass('state_listed')) {
            this.appBlock.addClass('state_listed');
          }
        }
      }
    });
  }

  handleMapSize() {
    if (!this.appBlock.hasClass('state_explored')) {
      if (window.innerWidth > 991) {
        Offices.reInitScroll(this.pane);
        if (this.map.container.getSize()[1] !== 678) {
          $('#map-container').css('height', '678px');
          this.map.container.fitToViewport();
        }
      } else if (window.innerWidth < 992 && window.innerWidth > 767) {
        if (this.map.container.getSize()[1] !== 440) {
          $('#map-container').css('height', '440px');
          this.map.container.fitToViewport();
        }
      } else {
        if (this.map.container.getSize()[1] !== 330) {
          $('#map-container').css('height', '330px');
          this.map.container.fitToViewport();
        }
      }
    } else {
      if (window.innerWidth < 992 && window.innerWidth > 575) {
        $('#map-container').css('height', '300px');
        this.map.container.fitToViewport();
      } else {
        $('#map-container').css('height', '200px');
        this.map.container.fitToViewport();
      }
    }
  }

  handleSwitch() {
    this.switcher.on('click', () => {
      if (this.appBlock.hasClass('state_listed')) {
        this.appBlock.removeClass('state_listed');
        this.switcher.data('state', 'map');
        this.switcher.find('.js-button-title').html('Показать списком');
      } else {
        this.appBlock.addClass('state_listed');
        this.switcher.data('state', 'list');
        this.switcher.find('.js-button-title').html('Показать на карте');
      }
    });

    this.detailBlockClose.on('click', () => {
      this.removeExploredDetail();
    });
  }

  removeExploredDetail() {
    this.appBlock.removeClass('state_explored');
    if (this.switcher.data('state') === 'list') {
      this.appBlock.addClass('state_listed');
    }
    const currentCollapse = global.collapses[this.currentTabId];
    currentCollapse.closeContent();
    this.togglePointState(this.point, this.target);
    this.point = null;
    this.target = null;
    this.handleMapSize();
    this.switcher.removeClass('state_hidden');
    this.detailBlock.find('.js-detail-content').html('');
    this.detailBlock.addClass('state_hidden');
    $('.js-footer').removeClass('state_hidden');
    $('html, body').scrollTop(0).removeClass('state_unscroll');

    this.goToPoints();
  }

  questionHandler() {
    if (Cookie.get('select-city') !== undefined) return;

    const questionPopup = new AskQuestion('select-city', 'Мы правильно определили Ваше местоположение?');
    global.contexts['select-city'].setPosition(questionPopup.popup);

    questionPopup.popup.on('questionresolve', (e, detail) => {
      if (!detail.response) {
        setTimeout(() => {
          global.contexts['select-city'].showList();
          Cookie.remove('select-city');
        }, 10);
      } else {
        Cookie.set('select-city', this.city);
      }
    });
    questionPopup.generatePopup();
  }

  checkUserCity(id) {
    let cityId = null;
    global.contexts['select-city'].getListData().forEach((el) => {
      if (el.id.toString() === id.toString()) {
        cityId = id;
        return id;
      }
    });
    return cityId;
  }

  onCityChange() {
    this.cityInput.on('change', (e) => {
      if (e.target.value === 'all') {
        this.city = null;
        this.changeCity();
        return;
      }

      const myGeocoder = ymaps.geocode(e.target.getAttribute('data-text'), {
        kind: 'locality',
      });
      myGeocoder.then(
        (res) => {
          this.city = res.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.InternalToponymInfo.geoid;
          this.changeCity();
          Offices.reInitScroll(this.pane);
        },
        (err) => {
          console.log('Обшибка', err);
        },
      );
    });
  }

  initMap() {
    this.map = new ymaps.Map('map-container', {
      center: [61.698653, 99.505405],
      zoom: 5,
      controls: [],
    });
    this.map.behaviors.disable('scrollZoom');
    this.map.options.set('suppressMapOpenBlock', true);
    this.setZoomControls();
    this.handleMapSize();
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
        map.setZoom(map.getZoom() + 1, {checkZoomRange: true});
      },

      zoomOut() {
        const map = this.getData().control.getMap();
        map.setZoom(map.getZoom() - 1, {checkZoomRange: true});
      },
    });
    const zoomControl = new ymaps.control.ZoomControl({
      options: {
        layout: ZoomLayout,
        position: {bottom: 80},
      },
    });
    this.map.controls.add(zoomControl);
    zoomControl.getLayout().then((e) => {
      $(e._parentElement).addClass('offices__ymaps-zoom-wrapper');
    });
  }

  getPoints() {
    const citySelector = this.city ? `[data-city="${this.city}"]` : '[data-city]';
    this.points = [];
    this.appBlock.find(`.offices__collapse${citySelector}[data-id="${this.currentTabId}"]`).children('.collapse__item').each((i, el) => {
      this.points.push({
        id: Offices.generatePointId($(el).data('coords')),
        coordinates: $(el).data('coords'),
      });
    });
  }

  addPoints() {
    this.markCollection.removeAll();
    Object.values(this.points).forEach((el) => {
      const placemark = new ymaps.Placemark(
        el.coordinates, {
          collapse_id: el.id,
        },
        this.iconNormal,
      );
      placemark.events.add('click', (e) => {
        this.onPointEvent(e, el.coordinates);
      });
      this.markCollection.add(placemark);
    });
    this.map.geoObjects.add(this.markCollection);
  }

  updateList() {
    this.appBlock.find('.offices__collapse').each((i, el) => {
      if (this.city === null || el.getAttribute('data-city') === this.city.toString()) {
        $(el).show();
      } else {
        $(el).hide();
      }
    });
  }

  changeCity() {
    this.updateList();
    this.getPoints();
    this.addPoints();
    this.goToPoints();
  }

  onPointEvent(e, coordinates) {
    const currentCollapse = global.collapses[this.currentTabId];
    const target = this.appBlock.find(`#${this.currentTabId} [data-coords="[${coordinates.join()}]"] .collapse__control`);

    if (!this.appBlock.hasClass('state_explored')) {
      this.scrollToCollapse(target);
      currentCollapse.openContent(target);
      Offices.reInitScroll(this.pane, 225);
      this.togglePointState(e.get('target'), target);

      if (window.innerWidth < 992) {
        if (!this.appBlock.hasClass('state_explored')) {
          this.appBlock.addClass('state_explored');
          this.initPointMobileDetail(target);

          this.point = e.get('target');
          this.target = target;
        }
      }
    }
  }

  initPointMobileDetail(target) {
    this.handleMapSize();
    this.goToPoints();

    $('html, body').addClass('state_unscroll').animate({scrollTop: this.appBlock.offset().top}, () => {
      const $collapse = $.extend(true, {}, target.parent().clone());
      this.switcher.addClass('state_hidden');
      if (this.detailBlock.hasClass('state_hidden')) {
        this.detailBlock.removeClass('state_hidden').find('.js-detail-content').append($collapse);
      }
      $('.js-footer').addClass('state_hidden');
    });
  }

  togglePointState(point, collapse) {
    this.markCollection.each((el) => {
      el.options.set('iconImageHref', this.iconNormal.iconImageHref);
      el.options.set('iconImageSize', this.iconNormal.iconImageSize);
      el.options.set('iconImageOffset', this.iconNormal.iconImageOffset);
    });
    if (collapse.parent().hasClass('collapse__item_state-open')) {
      point.options.set('iconImageHref', this.iconActive.iconImageHref);
      point.options.set('iconImageSize', this.iconActive.iconImageSize);
      point.options.set('iconImageOffset', this.iconActive.iconImageOffset);
      this.goToPoint(point);
    } else {
      this.map.setBounds(this.markCollection.getBounds(), {
        checkZoomRange: true,
        zoom: 10,
      });
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
      if (!this.appBlock.hasClass('state_explored')) {
        const point = this.getPointById(Offices.generatePointId($(e.target).closest('.collapse__item').data('coords')));
        // const target = this.appBlock.find(`#${this.currentTabId} [data-coords="[${$(e.target).closest('.collapse__item').data('coords')}]"] .collapse__control`);
        this.scrollToCollapse($(e.target));
        Offices.reInitScroll(this.pane, 225);
        this.togglePointState(point, $(e.target).closest('.collapse__control'));

        if (window.innerWidth < 992) {
          if (!this.appBlock.hasClass('state_explored')) {
            this.appBlock.removeClass('state_listed').addClass('state_explored');
            this.initPointMobileDetail($(e.target).closest('.collapse__control'));

            this.point = point;
            this.target = $(e.target).closest('.collapse__control');
          }
        }
      }
    });

    // Пересчет высоты при смене таба
    $('.offices__tab-control').on('click', () => {
      Offices.reInitScroll(this.pane);
      this.getCurrentTab();
      this.getPoints();
      this.addPoints();
      this.goToPoints();
    });
  }

  static reInitScroll(pane, time = 0) {
    if (window.innerWidth > 991) {
      setTimeout(() => {
        pane.data('jsp').reinitialise();
      }, time);
    }
  }

  scrollToCollapse(el) {
    if (window.innerWidth > 991) {
      this.pane.data('jsp').scrollToY(el.closest('.collapse__item')[0].offsetTop, 75);
    }
  }

  goToPoint(point) {
    this.map.setBounds(point.geometry.getBounds(), {
      checkZoomRange: true,
      zoom: 10,
    });
  }

  goToPoints() {
    this.map.setBounds(this.markCollection.getBounds(), {
      checkZoomRange: true,
      zoom: 10,
    });
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
    this.currentTabId = this.appBlock.find('.offices__content .tabs .tabs__item:not(.state_invisible)').attr('id');
  }
}