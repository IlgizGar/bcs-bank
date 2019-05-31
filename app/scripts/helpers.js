/* global ymaps:true */
/* eslint no-undef: "error" */

export default class Helpers {
  static getGeolocation(callback) {
    if (typeof ymaps === 'undefined') {
      Helpers.loadScript(`https://api-maps.yandex.ru/2.1/?apikey=${window.yandexMapApiKey}&lang=ru_RU`, () => {
        Helpers.getGeolocation(callback);
      });
    } else {
      ymaps.ready(() => {
        ymaps.geolocation.get({
          // Зададим способ определения геолокации
          // на основе ip пользователя.
          provider: 'yandex',
          // Включим автоматическое геокодирование результата.
          autoReverseGeocode: true,
        }).then((result) => {
          callback(result.geoObjects.get(0).properties.get('metaDataProperty'));
        }); // Выведем результат геокодирования.
      });
    }
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
