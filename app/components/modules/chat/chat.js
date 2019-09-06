import $ from 'jquery';
import Helpers from '../../../scripts/helpers';

export default class Chat {
  constructor() {
    this.init();
  }

  init() {
    window.yandexMapApiKey = '43aae7e6-b7a1-4f85-b4ca-242979d9dcfd';
    var currentLocation;
    Helpers.getGeolocation((curLoc) => {
      window.currentCity = curLoc.GeocoderMetaData.Address.Components[4].name;
      console.log('Ваш город: ', global.currentCity);
      window.clientChatCity = JSON.stringify(global.currentCity);
    });

    window.clientData = JSON.stringify({
      "name": "Name Surname",
      "phone": "+7-999-999-99-99",
      "email": "e@mail.com",
      "customField":"customValue"
    });
    this.initializeChat();
    $('iframe#__threadswidget_chat__iframe').contents().find('.threadswidget_welcome__form h3').css('font-weight', 600);
    global.chateg = ThreadsWidget;
    $.when(this.initializeChat()).then(function() {
      // console.log($("iframe#__threadswidget_chat__iframe").contents().find('.threadswidget_welcome__form').is(':visible'));
      $('iframe#__threadswidget_chat__iframe').contents().find('.threadswidget_welcome__form h3').css('font-weight', 600);
    })
  }


  initializeChat() {
    function doOnChatInit() {
      let iFrameChat =  $('iframe#__threadswidget_chat__iframe').contents();
      let cityInput = `<label for="city" data-size=""><input id="city" name="city" maxlength="50" placeholder="Ваш город" value="${window.currentCity ? window.currentCity : ''}" style="font-family: 'Open Sans', sans-serif; margin: 0px 0px 24px; padding: 20px 16px; background-color: rgb(255, 255, 255); color: rgb(0, 25, 52); font-size: 16px; border-radius: 4px; border-color: rgb(216, 216, 216);"></label>`;

      iFrameChat.find('.threadswidget_welcome__form h3').css('font-weight', 600);
      iFrameChat.find('button.Button').hide();
      iFrameChat.find('.threadswidget_chat__body___wrapper>.clipper').css('padding-top', 0).css('padding-bottom', 0);
      iFrameChat.find('.threadswidget_chat__body').css('padding', '24px');
      iFrameChat.find('.chat__header').css('background', '#ffffff');
      iFrameChat.find('.threadswidget_chat__welcome').css('padding', '0');
      iFrameChat.find('.threadswidget_chat__welcome p').css('line-height', '24px').css('padding', '0');
      iFrameChat.find('.threadswidget_welcome__form div:first-child').css('padding-top', '64px');
      iFrameChat.find('.threadswidget_welcome__form').css('margin', '0 auto').css('padding', '0 24px').css('max-width', '100%').css('margin', '0').css('top', 0).css('bottom', '100%');
      iFrameChat.find('label[for="phone"] input').attr('placeholder', 'Номер телефона');
      iFrameChat.find('label[for="email"] input').val('empty@email.com').hide();
      iFrameChat.find('.threadswidget_chat__wrapper .icon-close').css('top', '30px').css('right', '30px');
      iFrameChat.find('.threadswidget_welcome__form div:first-child').after(iFrameChat.find('label[for="name"]'));

      iFrameChat.find('.threadswidget_welcome__form label input').css('margin', '0');
      iFrameChat.find('.threadswidget_welcome__form label').css('margin', '0 0 24px');
      iFrameChat.find('label[for="phone"]').after(cityInput);
      iFrameChat.find('.textareaWrapper').css('max-height', '143px');
      iFrameChat.find('.textareaWrapper textarea').css('max-height', '143px');

      iFrameChat.find('.threadswidget_welcome__form label input').each(function() {
        let errorMessage;
        switch ($(this).attr('name')) {
          case 'name':
            errorMessage = 'Укажите Ваше имя';
            break;
          case 'phone':
            errorMessage = 'Укажите ваш телефон';
            break;
          case 'city':
            errorMessage = 'Укажите ваш город';
            break;
        }
        if ($(this).attr('name') != 'email') $(this).after('<span class="chat__error-message" style="position: absolute; display: none; font-size: 12px; padding-left: 16px">Ошибкен</span>');
      });

      iFrameChat.find('.textareaWrapper textarea').keyup(function(e) {
          if (localStorage.getItem('chatGotUserInfo') == null && key == "Enter") {
            e.preventDefault();
            if (iFrameChat.find('label[for="name"] input').val == '' ||
              iFrameChat.find('label[for="phone"] input').val == '' ||
               iFrameChat.find('label[for="city"] input').val == ''
            ) {
              e.preventDefault();
              showError();
            } else {
              e.preventDefault();
              iFrameChat.find('button.Button').trigger('click');
              localStorage.setItem('chatGotUserInfo', 'true');
            }
          }
        })
    }

    function showError() {
      let iFrameChat =  $('iframe#__threadswidget_chat__iframe').contents();
      iFrameChat.find('.threadswidget_welcome__form label .error-message').remove();
      iFrameChat.find('.threadswidget_welcome__form label input').each(function() {
        if ($(this).val == '' && $(this).attr('name') != 'email') {
          let errorMessage;
          switch ($(this).attr('name')) {
            case 'name':
              errorMessage = 'Укажите Ваше имя';
              break;
            case 'phone':
              errorMessage = 'Укажите ваш телефон';
              break;
            case 'city':
              errorMessage = 'Укажите ваш город';
              break;
          }
          $(this).after('<span class="chat__error-message" style="position: absolute; display: none; font-size: 12px; padding-left: 16px">' + errorMessage + '</span>');
        }
      });
    }

    !function (configurationFile, cb) {
      'use strict';
      configurationFile = configurationFile || '/settings.json';
      var e = window,
        t = document;

      function n(t, n) {
        var a = setInterval(function () {
          e.ThreadsWidget && !e.ThreadsWidget.isDummy && (clearInterval(a), e.ThreadsWidget[t] && e.ThreadsWidget[t](n));
        }, 100);
      }

      e.ThreadsWidget = {
        isDummy: !0,
        showChat: function () {
          n('showChat');
        },
        hideChat: function () {
          n('hideChat');
        },
        onHideChat: function (e) {
          n('onHideChat', e);
        },
        onScenarios: function (e) {
          n('onScenarios', e);
        }
      };
      var a,
        s = (a = new XMLHttpRequest, function (e, t, n, s) {
          a.onreadystatechange = function () {
            if (4 === a.readyState) {
              if (200 === this.status) {
                n(a.response);
              } else {
                if ('function' != typeof s) throw new Error(a.response);
                s(a);
              }
            }
          }, a.open(e, t), a.send();
        });

      function i(e) {
        if (e.webchat && (e.webchat.filename = e.filename), e.style && (e.webchat.style = e.style), sessionStorage.setItem('__threadsWidget', JSON.stringify(e.webchat)), e.filename) {
          var n = t.createElement('script');
          n.type = 'text/javascript', n.async = !0, n.src = e.filename;
          var a = t.getElementsByTagName('script')[0];
          a.onload = function() {
            $('#__threadswidget_chat__iframe').on('load', () => {
              doOnChatInit();
            })
          };
          a ? a.parentNode.insertBefore(n, a) : t.body.appendChild(n);
        } else {
          console && console.error('Invalid bundle');
        }
        if (e.style) {
          var s = t.createElement('link');
          s.type = 'text/css', s.rel = 'stylesheet', s.href = e.style, t.getElementsByTagName('head')[0].appendChild(s);
        }
      }

      function r() {
        s('GET', configurationFile + '?rnd=' + Math.random(), function (e) {
          var t = JSON.parse(e);
          i(t);
        });
      }

      'complete' === t.readyState ? r() : e.attachEvent ? e.attachEvent('onload', r) : e.addEventListener('load', r, !1);
    }("/assets/json/settings.json");
  }
}
