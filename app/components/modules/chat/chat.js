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
      global.currentCity = curLoc.GeocoderMetaData.Address.Components[4].name;
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
    global.chateg = ThreadsWidget;
    $(document).ready(()=>{
    });
    $.when(this.initializeChat()).then(function() {
      // console.log($("iframe#__threadswidget_chat__iframe").contents().find('.threadswidget_welcome__form').is(':visible'));
      $('iframe#__threadswidget_chat__iframe').contents().find('.threadswidget_welcome__form h3').css('font-weight', 600);
    })
  }

  initializeChat() {
    !function(configurationFile){"use strict";configurationFile=configurationFile||"/settings.json";var e=window,t=document;function n(t,n){var a=setInterval(function(){e.ThreadsWidget&&!e.ThreadsWidget.isDummy&&(clearInterval(a),e.ThreadsWidget[t]&&e.ThreadsWidget[t](n))},100)}e.ThreadsWidget={isDummy:!0,showChat:function(){n("showChat")},hideChat:function(){n("hideChat")},onHideChat:function(e){n("onHideChat",e)},onScenarios:function(e){n("onScenarios",e)}};var a,s=(a=new XMLHttpRequest,function(e,t,n,s){a.onreadystatechange=function(){if(4===a.readyState)if(200===this.status)n(a.response);else{if("function"!=typeof s)throw new Error(a.response);s(a)}},a.open(e,t),a.send()});function i(e){if(e.webchat&&(e.webchat.filename=e.filename),e.style&&(e.webchat.style=e.style),sessionStorage.setItem("__threadsWidget",JSON.stringify(e.webchat)),e.filename){var n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src=e.filename;var a=t.getElementsByTagName("script")[0];a?a.parentNode.insertBefore(n,a):t.body.appendChild(n)}else console&&console.error("Invalid bundle");if(e.style){var s=t.createElement("link");s.type="text/css",s.rel="stylesheet",s.href=e.style,t.getElementsByTagName("head")[0].appendChild(s)}}function r(){s("GET",configurationFile+"?rnd="+Math.random(),function(e){var t=JSON.parse(e);i(t)})}"complete"===t.readyState?r():e.attachEvent?e.attachEvent("onload",r):e.addEventListener("load",r,!1)}("/assets/json/settings.json");
  }
  // chatIFRAMEfuncExample() {
  // // $("iframe[name='__threadswidget_chat__iframe']").contents().find('h3').css('font-weight', 600)
  // }
}
