/* global ymaps:true */
/* eslint no-undef: "error" */

import $ from 'jquery';
import 'jscrollpane';
import Cookie from 'js-cookie';
import Helpers from '../../../scripts/helpers';
import AskQuestion from '../../library/question-popup/question-popup';

export default class Offices {
  constructor(offices) {
    this.userPos = null;
    this.appBlock = offices;
    this.pane = $('.js-tabs');
    this.content = this.pane.parent();
    this.searchTimout = null;
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
    this.iconUserPosition = {
      preset: 'islands#redIcon',
    };
    this.switcher = $('.js-offices-switcher');
    this.routeButton = $('[name=select_routeType]');
    this.detailBlock = $('.js-offices-detail');
    this.detailBlockClose = $('.js-offices-detail-close');
    this.cityInput = $('.context input[name="current-city_input"]');
    this.city = null;
    this.currentTabId = null;
    this.map = null;
    this.markCollection = null;
    this.points = [];
    this.mapContainer = document.getElementById('map-container');
    this.mapContainer.setAttribute('tab-index', '1');
    this.mapBlock = null;
    this.init();
    $('#select-city .js-context-item').on('click', () => {
      const pos = $('#map-container').offset().top;
      $('html, body').animate({
        scrollTop: pos - 150,
      }, 600);
    });
  }

  init() {
    this.onCityChange();
    this.getCurrentTab();
    Helpers.getGeolocation((location) => {
      ymaps.ready(() => {
        const savedCity = Cookie.get('select-city');
        const userCity = savedCity !== undefined ? savedCity : Offices.checkUserCity(location.GeocoderMetaData.InternalToponymInfo.geoid);
        this.initMap();
        if (savedCity === undefined) {
          this.questionHandler();
        }
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
      if (window.innerWidth > 991) {
        if (this.appBlock.hasClass('state_listed')) {
          this.appBlock.removeClass('state_listed');
        }
        if (this.appBlock.hasClass('state_explored')) {
          this.removeExploredDetail();
        }
      } else if (this.switcher.data('state') === 'list') {
        if (!this.appBlock.hasClass('state_listed')) {
          this.appBlock.addClass('state_listed');
        }
      }
    });

    this.routeButton.on('change', (e) => {
      const button = $(e.currentTarget);
      const type = button.val();
      let toPoint = button.closest('[data-coords]').attr('data-coords');
      toPoint = String(toPoint).split(',').map((el) => {
        const coords = parseFloat(el.replace('[', '').replace(']', ''));
        return coords;
      });
      this.createRoute(toPoint, type);
    });
    this.searchInit();
  }

  handleSwitch() {
    this.switcher.unbind('click');
    this.switcher.bind('click', () => {
      if (this.appBlock.hasClass('state_listed')) {
        this.appBlock.removeClass('state_listed');
        this.switcher.attr('data-state', 'map');
        // this.switcher.find('.js-button-title').html('Показать списком');
        this.mapContainer.append(this.mapBlock);
        // const pos = $('#map-container').offset().top;
        // $('html, body').animate({
        //   scrollTop: pos - 150,
        // }, 600);
      } else {
        this.appBlock.addClass('state_listed');
        this.switcher.attr('data-state', 'list');
        // this.switcher.find('.js-button-title').html('Показать на карте');
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
    this.switcher.removeClass('state_hidden');
    this.detailBlock.find('.js-detail-content').html('');
    this.detailBlock.addClass('state_hidden');
    $('.js-footer').removeClass('state_hidden');
    // $('html, body').scrollTop(0).removeClass('state_unscroll');

    this.goToPoints();
  }

  questionHandler() {
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

  static checkUserCity(id) {
    let cityId = null;
    global.contexts['select-city'].getListData().forEach((el) => {
      if (el.id.toString() === id.toString()) {
        cityId = id;
        return id;
      }
      return cityId;
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
          console.error(err);
        },
      );
    });
  }

  initMap() {
    const mapContainer = document.createElement('div');
    const mapContainerWrapper = document.getElementById('map-container');
    $(mapContainerWrapper).attr('style', '');
    mapContainerWrapper.appendChild(mapContainer);
    this.map = new ymaps.Map(mapContainer, {
      center: [61.698653, 99.505405],
      zoom: 5,
      controls: [],
    });
    this.map.behaviors.disable('scrollZoom');
    this.map.options.set('suppressMapOpenBlock', true);
    this.setZoomControls();
    this.mapBlock = document.getElementById('map-container').firstChild;
    if (window.innerWidth < 992) {
      this.map.behaviors.disable('drag');
    }
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
    const citySelector = this.city ? `[data-city="${this.city}"]` : '[data-city]';
    this.points = [];
    this.appBlock.find(`.offices__collapse${citySelector}[data-id="${this.currentTabId}"]`).find('.collapse__item[data-coords]').each((i, el) => {
      const coords = $(el).data('coords');
      $(el).removeClass('state_hidden');
      if (coords) {
        this.points.push({
          id: Offices.generatePointId(coords),
          coordinates: coords,
          element: el,
        });
      }
    });
  }

  addPoints() {
    this.clearRoute();
    this.markCollection.removeAll();
    Object.values(this.points).forEach((el) => {
      this.createPlacemark(el, this.iconNormal);
    });
    this.getUserPos().then(() => {
      this.map.geoObjects.add(this.markCollection);
      this.goToPoints();
    });
  }

  createPlacemark(el, icon, isSingle) {
    const placemark = new ymaps.Placemark(
      el.coordinates, {
        collapse_id: el.id !== undefined ? el.id : null,
      },
      icon,
    );
    if (el.id) {
      placemark.events.add('click', (e) => {
        this.onPointEvent(e, el.coordinates);
      });
    } else {
      placemark.iconReadOnly = true;
    }
    if (isSingle) {
      this.map.geoObjects.add(placemark);
    } else {
      this.markCollection.add(placemark);
    }
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

  saveUserPos(pos) {
    this.userPos = pos;
  }
  createRoute(toPoint, mode) {
    this.clearRoute();
    this.multiRoute = new ymaps.multiRouter.MultiRoute({
      referencePoints: [
        this.userPos,
        toPoint, // улица Льва Толстого.
      ],
      params: {
        routingMode: (mode !== undefined) ? mode : 'auto',
      },
    }, {
      boundsAutoApply: true,
    });
    this.map.geoObjects.add(this.multiRoute);
  }
  getUserPos() {
    function addPlacemark(self, latitude, longitude) {
      const el = {};
      el.coordinates = [latitude, longitude];
      self.saveUserPos([latitude, longitude]);
      self.createPlacemark(el, self.iconUserPosition, true);
    }
    return new Promise((resolve) => {
      if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition((position) => {
          addPlacemark(this, position.coords.latitude, position.coords.longitude);
          resolve(true);
        }, (error) => {
          console.log(error);
          resolve(false);
        });
      } else {
        ymaps.geolocation.get().then(
          (result) => {
            addPlacemark(this, result.geoObjects.position[0], result.geoObjects.position[1]);
            resolve(true);
          },
          (err) => {
            console.log(`Ошибка: ${err}`);
            resolve(false);
          },
        );
      }
    });
  }

  changeCity() {
    this.updateList();
    this.getPoints();
    this.addPoints();
    this.clearRoute();
  }

  onPointEvent(e, coordinates) {
    if (this.appBlock.hasClass('state_explored')) {
      this.removeExploredDetail();
    }
    const currentCollapse = global.collapses[this.currentTabId];
    const target = this.appBlock.find(`#${this.currentTabId} [data-coords="[${coordinates.join()}]"] .collapse__control`);
    const parentCollapse = target.parent().parent().closest('.collapse__item');
    if (parentCollapse.length) {
      parentCollapse.children('.collapse__control').trigger('click');
      this.scrollToCollapse(target);
    }
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
    this.goToPoints();
    const $collapse = $.extend(true, {}, target.parent().clone(true, true));
    $collapse.addClass('collapse__item_state-open');
    $collapse.find('.collapse__content').css({ display: 'block', height: 'auto' });
    // this.switcher.addClass('state_hidden');
    if (this.detailBlock.hasClass('state_hidden')) {
      this.detailBlock.removeClass('state_hidden').find('.js-detail-content').append($collapse);
    }
    $('.js-footer').addClass('state_hidden');
  }

  togglePointState(point, collapse) {
    this.markCollection.each((el) => {
      if (!el.iconReadOnly) {
        el.options.set('iconImageHref', this.iconNormal.iconImageHref);
        el.options.set('iconImageSize', this.iconNormal.iconImageSize);
        el.options.set('iconImageOffset', this.iconNormal.iconImageOffset);
      }
    });
    if (collapse.parent().hasClass('collapse__item_state-open')) {
      if (!point.iconReadOnly) {
        point.options.set('iconImageHref', this.iconActive.iconImageHref);
        point.options.set('iconImageSize', this.iconActive.iconImageSize);
        point.options.set('iconImageOffset', this.iconActive.iconImageOffset);
      }
      this.goToPoint(point);
    } else {
      this.goToPoints();
      this.clearRoute();
    }
  }
  clearRoute() {
    if (this.multiRoute) {
      this.map.geoObjects.remove(this.multiRoute);
    }
    this.multiRoute = null;
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

    $('.collapse__control').on('click', () => {
      if (!this.appBlock.hasClass('state_explored')) {
        Offices.reInitScroll(this.pane, 300);
      }
    });

    $('.collapse__item[data-coords] .collapse__control').on('click', (e) => {
      if (!this.appBlock.hasClass('state_explored')) {
        this.scrollToCollapse($(e.target));
        const collapseContent = $(e.target).closest('.collapse__item');
        const point = this.getPointById(Offices.generatePointId(collapseContent.data('coords')));
        // const target = this.appBlock.find(`#${this.currentTabId} [data-coords="[${$(e.target).closest('.collapse__item').data('coords')}]"] .collapse__control`);
        this.togglePointState(point, $(e.target).closest('.collapse__control'));
        if (window.innerWidth < 992) {
          if (!this.appBlock.hasClass('state_explored')) {
            // this.appBlock.removeClass('state_listed').addClass('state_explored');
            // this.initPointMobileDetail($(e.target).closest('.collapse__control'));
            //
            // this.point = point;
            // this.target = $(e.target).closest('.collapse__control');
            collapseContent.find('.js-collapse-map-wrap')[0].append(this.mapBlock);
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
      this.pane.bind('jsp-initialised', () => {
        this.pane.data('jsp').scrollToElement(el.closest('.collapse__item'), 75);
        this.pane.unbind('jsp-initialised');
      });
    }
  }

  goToPoint(point) {
    try {
      this.map.setBounds(point.geometry.getBounds(), {
        checkZoomRange: true,
        zoom: 10,
      });
    } catch (e) {
      console.warn('no points');
    }
  }

  goToPoints() {
    try {
      this.map.setBounds(this.markCollection.getBounds(), {
        checkZoomRange: true,
        zoom: 10,
      });
    } catch (e) {
      console.warn('no points');
    }
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

  searchInit() {
    $('[name=map-search]').on('keyup', (e) => {
      const searchInput = $(e.currentTarget);
      const value = searchInput.val();
      clearTimeout(this.searchTimout);
      this.searchTimout = setTimeout(() => {
        if (value) {
          this.search(value);
        } else {
          this.getPoints();
          this.addPoints();
        }
      }, 250);
    });
  }
  search(text) {
    this.getPoints();
    const result = [];
    this.points.forEach((point) => {
      $(point.element).removeClass('state_hidden');
      const elText = String($(point.element).find('.offices__info').text() + $(point.element).find('.collapse__control').text()).toLowerCase();
      if (elText.indexOf(text.toLowerCase()) + 1) {
        result.push(point);
      } else {
        $(point.element).addClass('state_hidden');
      }
    });
    this.points = result;
    this.addPoints();
  }
}
