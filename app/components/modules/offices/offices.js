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
    this.searchPane = $('.offices__search-variations');
    this.content = this.pane.parent();
    this.searchTimout = null;
    this.iconNormal = {
      iconLayout: 'default#image',
      iconImageHref: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0NTczRDkiLz4KPHJlY3QgeD0iNCIgeT0iNC4wMDE0NiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjAxIi8+CjxwYXRoIG9wYWNpdHk9IjAuNCIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yNi42MjE5IDEwLjMxMDRDMjYuNjMzOSAxMC4zMTUyIDI2LjY1NzIgMTAuMzI1NCAyNi42ODg0IDEwLjMzODlDMjYuOTA2NCAxMC40MzM2IDI3LjUwOSAxMC42OTUzIDI3LjM0MDIgMTAuNDk1M0MyNy4xNDI2IDEwLjI1MiAyNi45MDE1IDEwLjA0NzcgMjYuNjMxNSA5Ljg5MTk2QzEzLjAyMTEgMi4wMjQ5IDIuMzU2NSAyMC43MTcxIDEyLjc0MTUgMjkuMjA2OUwxMi43NzQ0IDI5LjIzNEwxMi43NzQ0IDI5LjIzNDFDMTMuMTUyMSAyOS41NDU1IDEzLjQxNDIgMjkuNzYxNyAxMy41MDMyIDI5Ljc2NjRDMTMuNTIzNCAyOS43NjggMTMuNjAwMSAyOS44MTI1IDEzLjcwNzYgMjkuODc1QzE0LjI2OSAzMC4yMDExIDE1LjY3IDMxLjAxNDkgMTQuMjQ1NyAyOC43NDQ3QzcuODA0NTIgMTguNTA4MyAxNS40NTEgNC44MjcyNyAyNi42MjE5IDEwLjMxMDRaTTMxLjQyODcgMTguNDQwMlYxOC40MzUzQzMxLjI5ODUgMTYuOTMxOSAzMC44ODM5IDE1LjQ2NzUgMzAuMjA0MSAxNC4xMTk4QzI1LjgwMjMgOC43Nzc4MyA4Ljg3NDg0IDE0LjI4MDQgMTQuNjY1MiAyOC4wODc5QzE0Ljg0MzYgMjguNTExMiAxNS4wNzk4IDI4Ljc0OTYgMTUuMTk1NSAyOC42NzE3QzE1LjIyMjIgMjguNjUzOCAxNS4yNzA5IDI4LjYzNzQgMTUuMzI5NCAyOC42MTc3QzE1LjUyNDUgMjguNTUyIDE1LjgyODIgMjguNDQ5OSAxNS43ODM3IDI4LjEzMTdDMTQuMjQ1NyAxNy4zMjYgMjcuNjU4NSAxNC43NDc1IDMxLjQyODcgMTguNDQwMlpNMTcuODQyMiAyOS44NDQ2QzE3LjgyNjcgMjkuNzgzMSAxNy44MDc3IDI5LjcwNzggMTcuNzc5NyAyOS42MTU2QzE1LjUwODkgMjIuMDQwNCAzMC40Nzg5IDE5LjQ0MjQgMzEuMjc5MiAyMi4wNDUzQzMxLjI3OTIgMjIuMDQ1MyAzMS4yMTE3IDIyLjExMzQgMzEuMjAyMSAyMi4zMjI2QzMwLjg5NCAyMy43NDczIDMwLjEyMDggMjQuOTE1MyAyOS4zNTU2IDI2LjA3MTRDMjkuMzE4NiAyNi4xMjczIDI5LjI4MTYgMjYuMTgzMiAyOS4yNDQ2IDI2LjIzOTFDMjguNjM3MiAyMy4zODMyIDE5LjY0MDcgMjYuODMyNyAxOS4yNTUgMzAuMTYwNUMxOS4yMjEzIDMwLjQ3MTkgMTguMDAxNSAzMC4xMDIxIDE3Ljk1ODEgMzAuMDgyNkMxNy44OTQ1IDMwLjA1MjIgMTcuODc3NCAyOS45ODQzIDE3Ljg0MjIgMjkuODQ0NloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTQuNjUzMyA5LjE4OTA2TDE0LjY5MzQgOS4xNTIxOUMxNS4wMTA1IDguODYwODQgMTUuMzAyNiA4LjU5MjQxIDE1LjE4NzIgOC41NzM4MkMxNS4wOTU4IDguNTU5MjggMTQuNzY4NyA4LjcxNDMxIDE0LjMyMTMgOC45NzEwNkM1Ljk1MTI1IDEzLjc2NzEgNy45MjM1MiAyOC42Nzg0IDE4LjgyMzkgMzEuMzcxOVYzMS4zODE2QzE5LjE0MTQgMzEuNDEwNiAxOS40NjM3IDMxLjQzIDE5Ljc4MTEgMzEuNDNDMjEuMDU1OSAzMS40MyAyMi4zMjU4IDMxLjIxNjkgMjMuNTI4NCAzMC43OTU0QzI0LjU4NjcgMzAuMzk4MSAyNS4xODMyIDMwLjA5MjkgMjYuMTkzNCAyOS40NjMyQzI2LjMwNCAyOS4zOTA1IDI2LjQxNDcgMjkuMzEzIDI2LjUyMDUgMjkuMjM1NUMxNy4wMTUyIDMyLjIxOTcgNi4wNjE4OSAxNy40Mjk1IDE0LjY1MzMgOS4xODkwNlpNMTYuMDk3NiAxMC4zMDEzTDE2LjA5NzYgMTAuMzAxMUMxNi4xNTg0IDkuOTg0MiAxNi4xODU4IDkuODQxNTkgMTYuMDk2NCA5Ljc1NTg3QzE1Ljk5NTQgOS42NTg5OCAxNS43NjkzIDkuOTA2MDQgMTUuNDk1MSAxMC4yNzkxQzEwLjExNzEgMTcuNzI1IDIxLjg2NCAyOS4wMzY5IDI5LjUwNzggMjYuMTA1OUMzMC4zMzUxIDI0LjgzNjcgMzAuOTE3MiAyMy40MTczIDMxLjIyMDMgMjEuOTNWMjEuOTI1MkMyNy4wMjU2IDI1LjE4MDcgMTQuNzQ5NSAxNy41NTU1IDE2LjA3MjMgMTAuNDM0MUMxNi4wODEyIDEwLjM4NjcgMTYuMDg5NyAxMC4zNDI1IDE2LjA5NzYgMTAuMzAxM1pNMTkuMjIzMSA5LjMyOTU1QzIwLjUzNjQgMTEuOTc0NiAyOS4yMTQzIDE2Ljc3MDcgMzAuMTQ3NSAxMy45ODUxQzMwLjgzMDYgMTUuMzI3IDMxLjI1ODcgMTYuNzg1MiAzMS40MDMxIDE4LjI4N0MzMS40MjcxIDE4LjM5ODQgMzEuNDMxOSAxOC41MDk4IDMxLjQyNzEgMTguNjIxMkMyNi41MjA1IDIwLjQ0MjggMTcuODg1OCAxMy4zNTUzIDE4LjY5NCA5LjQ0MDk4QzE4Ljc1NjUgOS4xMzA5MyAxOC44MjM5IDkuMDI0MzUgMTguOTIwMSA4Ljk5NTI4QzE4Ljk2ODIgOC45NzU5MSAxOS4wODg0IDkuMDQzNzMgMTkuMjIzMSA5LjMyOTU1WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==',
      iconImageSize: [40, 40],
      iconImageOffset: [-12, -12],
    };
    this.iconActive = {
      iconLayout: 'default#image',
      iconImageHref: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSI1NiIgdmlld0JveD0iMCAwIDU2IDU2Ij4gICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoNTZ2NTZIMHoiLz4gICAgICAgIDxnIGZpbGwtcnVsZT0ibm9uemVybyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTMgNikiPiAgICAgICAgICAgIDxwYXRoIGZpbGw9IiMzQjY2QzUiIGQ9Ik0zMCAxNC45NDNjLS4wMDIuNDA5LS4wMTkuODE4LS4wNSAxLjIyNS0uNDkyIDYuMTgzLTQuNTk0IDEyLjUzMS04LjI1NiAxOC41OTRMMTUgNDVWMjkuODg2Yy04LjI4NCAwLTE1LTYuNjktMTUtMTQuOTQzUzYuNzE2IDAgMTUgMGM4LjI4NCAwIDE1IDYuNjkgMTUgMTQuOTQzeiIvPiAgICAgICAgICAgIDxjaXJjbGUgY3g9IjE1IiBjeT0iMTUiIHI9IjYiIGZpbGw9IiNGRkYiLz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==',
      iconImageSize: [56, 56],
      iconImageOffset: [-28, -44],
    };
    this.iconUserPosition = {
      iconLayout: 'default#image',
      iconImageHref: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzNCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMyLjc1MjMgMTEuOTQ2N0MzMi41ODE0IDExLjMwNjQgMzIuMjM0NSAxMC42MjQgMzEuOTc3OCAxMC4wMjY3QzI4LjkwNjQgMi42NDUzMyAyMi4xOTU0IDAgMTYuNzc2NiAwQzkuNTIyNjQgMCAxLjUzMzIxIDQuODY0MTIgMC40NjY1NTMgMTQuODkwMlYxNi45Mzg2QzAuNDY2NTUzIDE3LjAyNDEgMC40OTYwMTUgMTcuNzkyIDAuNTM3ODY0IDE4LjE3NjFDMS4xMzU4MSAyMi45NTQzIDQuOTA2MTYgMjguMDMyNSA3LjcyMjAxIDMyLjgxMDdDMTAuNzUxNSAzNy45MyAxMy44OTUgNDIuOTY2IDE3LjAwOTMgNDcuOTk5OUMxOC45Mjk3IDQ0LjcxNDkgMjAuODQzMiA0MS4zODY3IDIyLjcxOTggMzguMTg2N0MyMy4yMzEzIDM3LjI0NzYgMjMuODI1IDM2LjMwOTEgMjQuMzM3IDM1LjQxMjdDMjQuNjc4MyAzNC44MTU5IDI1LjMzMDIgMzQuMjE5MSAyNS42MjgxIDMzLjY2MzdDMjguNjU3NCAyOC4xMTc0IDMzLjUzMzUgMjIuNTI4MiAzMy41MzM1IDE3LjAyNFYxNC43NjI4QzMzLjUzMzYgMTQuMTY2MSAzMi43OTM5IDEyLjA3NTQgMzIuNzUyMyAxMS45NDY3Wk0xNi45MDk0IDIyLjIyOTZDMTQuNzc3MSAyMi4yMjk2IDEyLjQ0MzIgMjEuMTYzNCAxMS4yOTExIDE4LjIxODlDMTEuMTE5NSAxNy43NTAyIDExLjEzMzMgMTYuODEwOCAxMS4xMzMzIDE2LjcyNDhWMTUuNDAyMUMxMS4xMzMzIDExLjY0ODQgMTQuMzIwNiA5Ljk0MTQgMTcuMDkzNCA5Ljk0MTRDMjAuNTA2OSA5Ljk0MTQgMjMuMTQ3IDEyLjY3MjQgMjMuMTQ3IDE2LjA4NkMyMy4xNDcgMTkuNDk5NSAyMC4zMjMgMjIuMjI5NiAxNi45MDk0IDIyLjIyOTZaIiBmaWxsPSIjNDU3M0Q5Ii8+Cjwvc3ZnPgo=',
      iconImageSize: [33, 48],
      iconImageOffset: [-28, -44],
    };
    this.switcher = $('.js-offices-switcher');
    this.routeButton = $('.js-button-bild-route');
    this.detailBlock = $('.js-offices-detail');
    this.detailBlockClose = $('.js-offices-detail-close');
    this.cityInput = $('.context input[name="current-city_input"]');
    this.city = null;
    this.currentTabId = null;
    this.map = null;
    this.markCollection = null;
    this.points = [];
    this.mapContainerId = window.innerWidth > 831 ? 'map-container' : 'map-container-mobile';
    this.mapContainer = document.getElementById(this.mapContainerId);
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

        this.getPoints();
        this.getUserPos().then(() => {
          this.distanceCalculation(this.userPos);
        });
      });
    });
    this.setScrollPane();

    // Блок обработки карты и списка на мобильной версии
    this.handleSwitch();

    if (window.innerWidth > 800) {
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

    this.routeButton.on('click', (e) => {
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

    // $('.office-stress__load').tooltipster({
    //   theme: ['tooltipster-noir', 'tooltipster-noir-customized']
    // });
    if ($('.js-offices-button-for-map')) {
      this.lookAtTheMap();
    }
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
    const mapContainerWrapper = this.mapContainer;
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
    this.mapBlock = this.mapContainer.firstChild;
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
        position: { top: '0px' },
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
        let foundDot = false;
        this.points.forEach((currentPoint) => {
          if (currentPoint.id === Offices.generatePointId(coords)) {
            foundDot = true;
          }
        });
        if (!foundDot) {
          this.points.push({
            id: Offices.generatePointId(coords),
            coordinates: coords,
            element: el,
          });
        }
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
      // событие клика по пину
      placemark.events.add('click', (e) => {
        this.onPointEvent(e, el.coordinates);
        if (window.innerWidth > 831) {
          setTimeout(() => {
            $('html, body').animate({ scrollTop: $('.js-offices').offset().top }, 800);
          }, 200);
        } else {
          setTimeout(() => {
            $('html, body').animate({ scrollTop: $('.collapse__item_state-open').offset().top }, 800);
          }, 200);
        }
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

  // построение маршрута
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
      // self.map.setZoom(self.map.getZoom() + 5, { checkZoomRange: true });
      self.map.setCenter(el.coordinates, 12, { duration: 1000, checkZoomRange: true });
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
      // в данный момент на мобилке не нужен особенный сценарий
      // if (window.innerWidth < 800) {
      //   if (!this.appBlock.hasClass('state_explored')) {
      //     this.appBlock.addClass('state_explored');
      //     this.initPointMobileDetail(target);
      //     this.point = e.get('target');
      //     this.target = target;
      //   }
      // }
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
        point.options.set('iconImageHref', this.iconNormal.iconImageHref);
        point.options.set('iconImageSize', this.iconNormal.iconImageSize);
        point.options.set('iconImageOffset', this.iconNormal.iconImageOffset);
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
      verticalDragMaxHeight: 60,
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

    $(document).on('click', '#get-geo', () => {
      this.getUserPos();
    });

    $('.collapse__item[data-coords] .collapse__control').on('click', (e) => {
      if (!this.appBlock.hasClass('state_explored')) {
        this.scrollToCollapse($(e.target));
        const collapseContent = $(e.target).closest('.collapse__item');
        const point = this.getPointById(Offices.generatePointId(collapseContent.data('coords')));
        // const target = this.appBlock.find(`#${this.currentTabId} [data-coords="[${$(e.target).closest('.collapse__item').data('coords')}]"] .collapse__control`);
        this.togglePointState(point, $(e.target).closest('.collapse__control'));
        // if (window.innerWidth < 992) {
        //   if (!this.appBlock.hasClass('state_explored')) {
        //     // this.appBlock.removeClass('state_listed').addClass('state_explored');
        //     // this.initPointMobileDetail($(e.target).closest('.collapse__control'));
        //     //
        //     // this.point = point;
        //     // this.target = $(e.target).closest('.collapse__control');
        //     collapseContent.find('.js-collapse-map-wrap')[0].append(this.mapBlock);
        //   }
        // }
      }
    });

    // Пересчет высоты при смене таба
    $('.offices__tab-control').on('click', () => {
      Offices.reInitScroll(this.pane);
      this.getCurrentTab();
      this.getPoints();
      this.addPoints();
      // this.goToPoints();
      this.getUserPos().then(() => {
        this.distanceCalculation(this.userPos);
      });
    });
  }

  setScrollSearch() {
    if (this.searchPane.data('jsp'))
    {
      Offices.reInitScroll(this.searchPane, 250);
    }
    else
    {
      this.searchPane.jScrollPane({
        contentWidth: 100,
        verticalDragMinHeight: 16,
        verticalDragMaxHeight: 60,
        verticalGutter: 16,
        mouseWheelSpeed: 1,
        animateDuration: 1000,
      });
    }
  }

  static reInitScroll(pane, time = 0) {
    if (window.innerWidth > 800) {
      setTimeout(() => {
        pane.data('jsp').reinitialise();
      }, time);
    }
  }

  scrollToCollapse(el) {
    if (window.innerWidth > 800) {
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
      }).then(() => {
        if (Offices.getMarksCount(this.markCollection) > 1) {
          this.map.setZoom(12);
        } else {
          this.map.setZoom(15);
        }
      });
    } catch (e) {
      console.warn('no points');
    }
  }
  static getMarksCount(collection) {
    let placeCount = 0;
    collection.each(() => {
      placeCount += 1;
    });
    return placeCount;
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
      console.log($('[name=map-search]').closest('.js-input').val());
      const searchInput = $(e.currentTarget);
      const value = searchInput.val();

      this.addOrRemoveButtonClose(value);
      this.removeValueInput(searchInput);

      clearTimeout(this.searchTimout);
      this.searchTimout = setTimeout(() => {
        if (value) {
          this.removeValueInput();
          this.search(value);
          this.autoCompleteShow(value);
        } else {
          $('.offices__search-variations').hide();
          this.getPoints();
          this.addPoints();
        }
      }, 250);
    });


    $('[name=map-search]').on('change', (e) => {
      const searchInput = $(e.currentTarget);
      const value = searchInput.val();
      if (value) {
        $('.collapse__control-underground').css({ display: 'none' });
        $('.collapse__control-distance-to-bcs').css({ display: 'block' });
        const city = $('input[name=current-city_input]').attr('data-text');
        const address = city + ', ' + value;
        console.log(address);
        ymaps.geocode(address).then((res) => {
          const startPoint = res.geoObjects.get(0).geometry.getCoordinates();
          this.distanceCalculation(startPoint);
        });
      } else {
        $('.collapse__control-underground').css({ display: 'flex' });
        $('.collapse__control-distance-to-bcs').css({ display: 'none' });
        this.distanceCalculation(this.userPos);
        // скрыть метры которые про поиске
      }
    });

    $(window).click(() => {
      $('.offices__search-variations').hide();
    });

    $(document).on('click', '.offices__search-option', (e) => {
      e.preventDefault();
      $('.search-close').css({ display: 'block' });
      $('.icon-search').css({ display: 'none' });
      // добавление выбранного текста по клику в инпут
      const parent = $(e.target).closest('.offices__search-option'); // привязка к текущему элементу на который кликнули
      const text = $.trim(parent.find('.offices__search-title').text());
      $('[name=map-search]').val(text);
      $('[name=map-search]').closest('.js-input').addClass('state_filled');
      $('[name=map-search]').closest('.js-input').removeClass('state_init');
      $('.offices__search-variations').hide();
      this.search(text);
      const city = $('input[name=current-city_input]').attr('data-text');
      const address = city + ', ' + text;
      ymaps.geocode(address).then((res) => {
        const startPoint = res.geoObjects.get(0).geometry.getCoordinates();
        this.distanceCalculation(startPoint);
      });
    });
  }

  // скрывает карточки и центрирует карту относительно оставшихся точек на карте
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

  distanceCalculation(coord) {
    if ((typeof coord) !== undefined && coord != null) {
      this.points.forEach((point) => {
        const distance = Math.ceil(ymaps.coordSystem.geo.getDistance(coord, point.coordinates));
        const temp = Math.ceil((distance / 1000) * 10) / 10;
        if (distance > 1000) {
          $(point.element).find('.collapse__control-distance').text('~' + temp + 'км');
          $(point.element).find('.collapse__control-distance-metr').text('~' + temp + 'км');
        } else {
          $(point.element).find('.collapse__control-distance').text('~' + distance + 'м');
          $(point.element).find('.collapse__control-distance-metr').text('~' + distance + 'м');
        }
      });
    } else {
      console.log('Не удалось найти позицию пользователя');
    }
  }

  autoCompleteShow(text) {
    this.getPoints();
    const autoCompleteResult = []; // резулттирующий массив для выпадающего списка
    this.points.forEach((point) => {
      // ищем информацию для выпадающего списка
      const metroVariantion = String($(point.element).find('.collapse__control-underground-name').text()).toLowerCase();
      const streetVariantion = String($(point.element).find('.collapse__control-title').text()).toLowerCase();

      if (metroVariantion.indexOf(text.toLowerCase()) + 1) {
        const classList = $(point.element).find('.collapse__control-underground-icon').attr('class').split(/\s+/);
        const MetrocustomPoint = {
          title: $(point.element).find('.collapse__control-underground-name').text(),
          description: 'станция метро',
          type: 'metro',
          colorMetro: classList[1],
          svg: $('.collapse__control-underground-icon')[0],
        };
        autoCompleteResult.push(MetrocustomPoint);
      }

      if (streetVariantion.indexOf(text.toLowerCase()) + 1) {
        const StreetcustomPoint = {
          title: $(point.element).find('.collapse__control-title').text(),
          description: 'метро' + $(point.element).find('.collapse__control-underground-name').text(),
          type: 'street',
          svg: $('.collapse__control-underground-icon')[0],
        };
        autoCompleteResult.push(StreetcustomPoint);
      }
    });

    if (autoCompleteResult.length > 0) {
      $('.offices__search-variations').show();

      let searchVariationsContainer = $('.offices__search-variations');
      const searchVartiations = $('.offices__search-option[data-template]');
      $.each(searchVariationsContainer.find('.offices__search-option'), function (i, item) {
        $(item).remove();
      });
      if (searchVariationsContainer.find('.jspPane').length)
      {
        searchVariationsContainer = searchVariationsContainer.find('.jspPane');
      }
      autoCompleteResult.forEach((customPoint) => {
        var iconClassList = searchVartiations.find('.offices__search-icon').attr('class').split(' ');
        iconClassList.forEach(function (item, index) {
          if (item != 'offices__search-icon')
          {
            searchVartiations.find('.offices__search-icon').removeClass(item);
          }
        });
        searchVartiations.find('.offices__search-title').text(customPoint.title);
        searchVartiations.find('.offices__search-description').text(customPoint.description);
        searchVartiations.find('.icon-street-icon').css({ display: 'none' });
        searchVartiations.find('.icon-orange').css({ display: 'none' });
        if (customPoint.type === 'street') {
          searchVartiations.find('.icon-street-icon').css({ display: 'block' });
        } else {
          searchVartiations.find('.offices__search-icon').addClass(customPoint.colorMetro);
          searchVartiations.find('.icon-orange').css({ display: 'block' });
        }
        searchVartiations.clone().appendTo(searchVariationsContainer);
      });
      $.each(searchVariationsContainer.find('.offices__search-option'), function (i, item) {
        $(item).removeAttr('hidden');
        $(item).removeAttr('data-template');
      });
    } else {
      $('.offices__search-variations').hide();
    }
    this.setScrollSearch();
  }

  removeValueInput(searchInput) {
    $('.search-close').on('click', () => {
      searchInput.val('');
      $('.search-close').css({ display: 'none' });
      $('.icon-search').css({ display: 'block' });
      $('[name=map-search]').closest('.js-input').addClass('state_init');
      $('[name=map-search]').closest('.js-input').removeClass('state_filled');
      $('.collapse__item').removeClass('state_hidden');
      $('.collapse__item').find('.collapse__control-underground').css({ display: 'flex' });
      $('.collapse__item').find('.collapse__control-distance-to-bcs').hide();
      this.distanceCalculation(this.userPos);
      this.getPoints();
      this.addPoints();
    });
  }

  addOrRemoveButtonClose(value) {
    if (value !== '') {
      $('.search-close').css({ display: 'block' });
      $('.icon-search').css({ display: 'none' });
    } else {
      $('.search-close').css({ display: 'none' });
      $('.icon-search').css({ display: 'block' });
    }
  }

  // кнопка "показать на карте"
  lookAtTheMap() {
    $('.js-offices-button-for-map').on('click', () => {
      setTimeout(() => {
        $('html, body').animate({ scrollTop: $('.offices__search').offset().top }, 800);
      }, 200);
    });
  }
}
