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
      iconImageHref: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PCEtLSBHZW5lcmF0b3I6IEdyYXZpdC5pbyAtLT48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHN0eWxlPSJpc29sYXRpb246aXNvbGF0ZSIgdmlld0JveD0iMCAwIDQwIDQwIiB3aWR0aD0iNDBwdCIgaGVpZ2h0PSI0MHB0Ij48ZGVmcz48Y2xpcFBhdGggaWQ9Il9jbGlwUGF0aF80R2x4UVlrOTdVN3JlS21jWkhZVU8wVjFIVnF5MDdPQyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIi8+PC9jbGlwUGF0aD48L2RlZnM+PGcgY2xpcC1wYXRoPSJ1cmwoI19jbGlwUGF0aF80R2x4UVlrOTdVN3JlS21jWkhZVU8wVjFIVnF5MDdPQykiPjxjaXJjbGUgdmVjdG9yLWVmZmVjdD0ibm9uLXNjYWxpbmctc3Ryb2tlIiBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9InJnYig2OSwxMTUsMjE3KSIvPjxyZWN0IHg9IjQiIHk9IjQuMDAxIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEsMCwwKSIgZmlsbD0icmdiKDI1NSwyNTUsMjU1KSIgZmlsbC1vcGFjaXR5PSIwLjAxIi8+PGcgb3BhY2l0eT0iMC40Ij48cGF0aCBkPSIgTSAyNi42MjIgMTAuMzEgQyAyNi42MzQgMTAuMzE1IDI2LjY1NyAxMC4zMjUgMjYuNjg4IDEwLjMzOSBDIDI2LjkwNiAxMC40MzQgMjcuNTA5IDEwLjY5NSAyNy4zNCAxMC40OTUgQyAyNy4xNDIgMTAuMjUyIDI2LjkwMSAxMC4wNDggMjYuNjMxIDkuODkyIEMgMTMuMDIxIDIuMDI1IDIuMzU2IDIwLjcxNyAxMi43NDEgMjkuMjA3IEwgMTIuNzc0IDI5LjIzNCBMIDEyLjc3NCAyOS4yMzQgQyAxMy4xNTIgMjkuNTQ2IDEzLjQxNCAyOS43NjIgMTMuNTAzIDI5Ljc2NiBDIDEzLjUyMyAyOS43NjggMTMuNiAyOS44MTMgMTMuNzA3IDI5Ljg3NSBDIDE0LjI2OSAzMC4yMDEgMTUuNjcgMzEuMDE1IDE0LjI0NiAyOC43NDUgQyA3LjgwNCAxOC41MDggMTUuNDUxIDQuODI3IDI2LjYyMiAxMC4zMSBaICBNIDMxLjQyOCAxOC40NCBMIDMxLjQyOCAxOC40MzUgQyAzMS4yOTggMTYuOTMyIDMwLjg4NCAxNS40NjggMzAuMjA0IDE0LjEyIEMgMjUuODAyIDguNzc4IDguODc1IDE0LjI4IDE0LjY2NSAyOC4wODggQyAxNC44NDMgMjguNTExIDE1LjA4IDI4Ljc1IDE1LjE5NSAyOC42NzIgQyAxNS4yMjIgMjguNjU0IDE1LjI3MSAyOC42MzcgMTUuMzI5IDI4LjYxOCBDIDE1LjUyNCAyOC41NTIgMTUuODI4IDI4LjQ1IDE1Ljc4NCAyOC4xMzIgQyAxNC4yNDYgMTcuMzI2IDI3LjY1OCAxNC43NDggMzEuNDI4IDE4LjQ0IFogIE0gMTcuODQyIDI5Ljg0NSBDIDE3LjgyNiAyOS43ODMgMTcuODA3IDI5LjcwOCAxNy43OCAyOS42MTYgQyAxNS41MDkgMjIuMDQgMzAuNDc5IDE5LjQ0MiAzMS4yNzkgMjIuMDQ1IEMgMzEuMjc5IDIyLjA0NSAzMS4yMTIgMjIuMTEzIDMxLjIwMiAyMi4zMjMgQyAzMC44OTQgMjMuNzQ3IDMwLjEyMSAyNC45MTUgMjkuMzU1IDI2LjA3MSBDIDI5LjMxOCAyNi4xMjcgMjkuMjgxIDI2LjE4MyAyOS4yNDQgMjYuMjM5IEMgMjguNjM3IDIzLjM4MyAxOS42NDEgMjYuODMzIDE5LjI1NSAzMC4xNjEgQyAxOS4yMjEgMzAuNDcyIDE4LjAwMSAzMC4xMDIgMTcuOTU4IDMwLjA4MyBDIDE3Ljg5NCAzMC4wNTIgMTcuODc3IDI5Ljk4NCAxNy44NDIgMjkuODQ1IFogIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9InJnYigyNTUsMjU1LDI1NSkiLz48L2c+PHBhdGggZD0iIE0gMTQuNjUzIDkuMTg5IEwgMTQuNjkzIDkuMTUyIEMgMTUuMDEgOC44NjEgMTUuMzAyIDguNTkyIDE1LjE4NyA4LjU3NCBDIDE1LjA5NSA4LjU1OSAxNC43NjggOC43MTQgMTQuMzIxIDguOTcxIEMgNS45NTEgMTMuNzY3IDcuOTIzIDI4LjY3OCAxOC44MjMgMzEuMzcyIEwgMTguODIzIDMxLjM4MiBDIDE5LjE0MSAzMS40MTEgMTkuNDYzIDMxLjQzIDE5Ljc4MSAzMS40MyBDIDIxLjA1NSAzMS40MyAyMi4zMjUgMzEuMjE3IDIzLjUyOCAzMC43OTUgQyAyNC41ODYgMzAuMzk4IDI1LjE4MyAzMC4wOTMgMjYuMTkzIDI5LjQ2MyBDIDI2LjMwNCAyOS4zOTEgMjYuNDE0IDI5LjMxMyAyNi41MiAyOS4yMzYgQyAxNy4wMTUgMzIuMjIgNi4wNjEgMTcuNDMgMTQuNjUzIDkuMTg5IFogIE0gMTYuMDk3IDEwLjMwMSBMIDE2LjA5NyAxMC4zMDEgQyAxNi4xNTggOS45ODQgMTYuMTg1IDkuODQyIDE2LjA5NiA5Ljc1NiBDIDE1Ljk5NSA5LjY1OSAxNS43NjkgOS45MDYgMTUuNDk1IDEwLjI3OSBDIDEwLjExNyAxNy43MjUgMjEuODY0IDI5LjAzNyAyOS41MDcgMjYuMTA2IEMgMzAuMzM1IDI0LjgzNyAzMC45MTcgMjMuNDE3IDMxLjIyIDIxLjkzIEwgMzEuMjIgMjEuOTI1IEMgMjcuMDI1IDI1LjE4MSAxNC43NDkgMTcuNTU2IDE2LjA3MiAxMC40MzQgQyAxNi4wODEgMTAuMzg3IDE2LjA4OSAxMC4zNDMgMTYuMDk3IDEwLjMwMSBaICBNIDE5LjIyMyA5LjMzIEMgMjAuNTM2IDExLjk3NSAyOS4yMTQgMTYuNzcxIDMwLjE0NyAxMy45ODUgQyAzMC44MyAxNS4zMjcgMzEuMjU4IDE2Ljc4NSAzMS40MDMgMTguMjg3IEMgMzEuNDI3IDE4LjM5OCAzMS40MzEgMTguNTEgMzEuNDI3IDE4LjYyMSBDIDI2LjUyIDIwLjQ0MyAxNy44ODUgMTMuMzU1IDE4LjY5NCA5LjQ0MSBDIDE4Ljc1NiA5LjEzMSAxOC44MjMgOS4wMjQgMTguOTIgOC45OTUgQyAxOC45NjggOC45NzYgMTkuMDg4IDkuMDQ0IDE5LjIyMyA5LjMzIFogIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9InJnYigyNTUsMjU1LDI1NSkiLz48L2c+PC9zdmc+',
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
    this.mapContainerId = window.innerWidth > 831 ? 'map-container' : "map-container-mobile";
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

    // $('.office-stress__load').tooltipster({
    //   theme: ['tooltipster-noir', 'tooltipster-noir-customized']
    // });

    this.lookAtTheMap();
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
        var foundDot = false;
        this.points.forEach((currentPoint) => {
          if (currentPoint.id == Offices.generatePointId(coords))
          {
            foundDot = true;
          }
        });
        if (!foundDot)
        {
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
      if (window.innerWidth < 800) {
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
      this.goToPoints();
    });
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


    $(window).click((e) => {
      $('.search-close').css({ display: 'none'});
      $('.icon-search').css({ display: 'block'});
      $('.offices__search-variations').hide();
    });


    $(document).on('click', '.offices__search-option', (e) => {
      e.preventDefault();
      $('.search-close').css({ display: 'none'});
      $('.icon-search').css({ display: 'block'});
      //добавление выбранного текста по клику в инпут
      let parent = $(e.target).closest('.offices__search-option'); //привязка к текущему элементу на который кликнули
      let text = $.trim(parent.find('.offices__search-title').text());
      $('[name=map-search]').val(text);
      $('[name=map-search]').closest('.js-input').addClass('state_filled');
      $('[name=map-search]').closest('.js-input').removeClass('state_init');
      $('.offices__search-variations').hide();
      this.search(text);
    });
  }

  //скрывает карточки и центрирует карту относительно оставшихся точек на карте
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

  autoCompleteShow(text)
  {
    this.getPoints();
    const autoCompleteResult = []; //резулттирующий массив для выпадающего списка
    this.points.forEach((point) => {
      //ищем информацию для выпадающего списка
      let metroVariantion = String($(point.element).find('.collapse__control-underground-name').text()).toLowerCase();
      let streetVariantion = String($(point.element).find('.collapse__control-title').text()).toLowerCase();

      if (metroVariantion.indexOf(text.toLowerCase()) + 1) {
        var classList = $(point.element).find('.collapse__control-underground-icon').attr('class').split(/\s+/);
        let MetrocustomPoint = {
          title: $(point.element).find('.collapse__control-underground-name').text(),
          description: 'станция метро',
          type: 'metro',
          colorMetro:  classList[1],
          svg: $('.collapse__control-underground-icon')[0]
        };
        autoCompleteResult.push(MetrocustomPoint);
      }

      if (streetVariantion.indexOf(text.toLowerCase()) + 1) {
        let StreetcustomPoint = {
          title: $(point.element).find('.collapse__control-title').text(),
          description: 'метро' + $(point.element).find('.collapse__control-underground-name').text(),
          type: 'street',
          svg: $('.collapse__control-underground-icon')[0]
        };
        autoCompleteResult.push(StreetcustomPoint);
      }
    });

    if (autoCompleteResult.length > 0) {
      $('.offices__search-variations').show();
      const searchVariationsContainer = $('.offices__search-variations');
      let searchVartiations = $('.offices__search-option').first();

      autoCompleteResult.forEach((customPoint) => {
        searchVartiations.find('.offices__search-title').text(customPoint.title);
        searchVartiations.find('.offices__search-description').text(customPoint.description);
        searchVartiations.find('.offices__search-icon').removeClass(customPoint.colorMetro);
        searchVartiations.find('.icon-street-icon').css({ display: 'none'});
        searchVartiations.find('.icon-orange').css({ display: 'none'});
        if (customPoint.type === 'street') {
          searchVartiations.find('.icon-street-icon').css({ display: 'block'})
        }
        else {
          searchVartiations.find('.offices__search-icon').addClass(customPoint.colorMetro);
          searchVartiations.find('.icon-orange').css({ display: 'block'})
        }
        searchVartiations.clone().appendTo(searchVariationsContainer);
      });
      $('.offices__search-option').first().remove();
    }
  }

  removeValueInput(searchInput) {
    $('.search-close').on('click', (e) => {
     searchInput.val('');
    })
  }

  addOrRemoveButtonClose(value) {
    if (value) {
      $('.search-close').css({ display: 'block'});
      $('.icon-search').css({ display: 'none'});
    }
    else {
      $('.search-close').css({ display: 'none'});
      $('.icon-search').css({ display: 'block'});
    }
  }

  //кнопка "показать на карте"
  lookAtTheMap() {
    $('.js-offices-button-for-map').on('click', (e) => {
      setTimeout(() => {
        $('html, body').animate({ scrollTop: $('#map-container').offset().top - ($('#map-container').height() / 3)}, 800);
      }, 200);
    });
  }
}
