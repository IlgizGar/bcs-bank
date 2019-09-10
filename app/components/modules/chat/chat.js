import $ from 'jquery';
import Helpers from '../../../scripts/helpers';

export default class Chat {
  constructor() {
    this.controlButton = document.querySelector('.js-chat-call');
    this.chatOpened = false;
    this.init();
  }

  init() {
    this.initializeChat();
    this.chatControl();
  }

  chatControl() {
    this.controlButton.addEventListener('click', (e) => {
      if (!this.chatOpened) {
        ThreadsWidget.showChat();
        this.chatOpened = true;
      } else {
        ThreadsWidget.hideChat();
        this.chatOpened = false;
      }
    })
  }

  initializeChat() {

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
