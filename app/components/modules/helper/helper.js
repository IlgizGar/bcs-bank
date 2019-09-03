import $ from 'jquery';

export default class Helper {
  constructor() {
    this.ab_variable = 'ab_bonus_disable';

    this.splitTestData = [
      {
        id: 1,
        name: 'aviasales',
        linkName: '',
        percent: '2%',
        description: 'Возвращаем 2% при оплате<br> авиабилетов картой БКС',
        logo: 'http://aeroflot.aic.ru/AB_bcs_helper/images/c-aviasales.svg',
        popup: {
          title: 'Бонусы с дебетовой картой БКС',
          subtitle: 'Получить легко',
          description: 'Станьте клиентом "БКС-банка", чтобы воспользоваться предложением в мобильном банке'
        }
      },
      {
        id: 2,
        name: 'Ostrovok',
        linkName: 'https://bcs.ostrovok.ru',
        percent: '6%',
        description: 'Забронируйте отель с картой БКС,<br> и мы вернем 6% от суммы',
        logo: 'http://aeroflot.aic.ru/AB_bcs_helper/images/c-ostrovok.png',
        popup: {
          title: 'Бонусы с дебетовой картой БКС',
          subtitle: 'Получить легко',
          description: 'Просто оплачивайте покупки картами БКС Банка на специальном сайте партнёра и получайте за них бонусы. <b>1 бонус равен 1 рублю</b>. Чтобы перевести бонусы в рубли, нужно просто компенсировать стоимость одной или нескольких покупок через мобильное приложение. Деньги мгновенно зачислятся на счет. Сайт партнера: <a target="_blank" rel="nofollow" href="https://bcs.ostrovok.ru">https://bcs.ostrovok.ru</a>'
        }
      },
      {
        id: 3,
        name: 'Rentalcars',
        linkName: 'https://www.rentalcars.com/?affiliateCode=bcs627&adplat=desktop',
        percent: '7%',
        description: 'Возвращаем 7% от стоимости<br> аренды авто при оплате картой',
        logo: 'http://aeroflot.aic.ru/AB_bcs_helper/images/c-rentalcars.png',
        popup: {
          title: 'Бонусы с дебетовой картой БКС',
          subtitle: 'Получить легко',
          description: 'Просто оплачивайте покупки картами БКС Банка на специальном сайте партнёра и получайте за них бонусы. <b>1 бонус равен 1 рублю</b>. Чтобы перевести бонусы в рубли, нужно просто компенсировать стоимость одной или нескольких покупок через мобильное приложение. Деньги мгновенно зачислятся на счет. Сайт партнера: <a target="_blank" rel="nofollow" href="https://www.rentalcars.com/?affiliateCode=bcs627&adplat=desktop">https://www.rentalcars.com</a>'
        }
      },
      {
        id: 4,
        name: 'LevelTravel',
        linkName: 'https://bcs.level.travel',
        percent: '3%',
        description: 'Бронируйте туры с нами<br> и зарабатывайте бонусы.<br> 1 бонус = 1 рублю',
        logo: 'http://aeroflot.aic.ru/AB_bcs_helper/images/c-leveltravel.png',
        popup: {
          title: 'Бонусы с дебетовой картой БКС',
          subtitle: 'Получить легко',
          description: 'Просто оплачивайте покупки картами БКС Банка на специальном сайте партнёра и получайте за них бонусы. <b>1 бонус равен 1 рублю</b>. Чтобы перевести бонусы в рубли, нужно просто компенсировать стоимость одной или нескольких покупок через мобильное приложение. Деньги мгновенно зачислятся на счет. Сайт партнера: <a target="_blank" rel="nofollow" href="https://bcs.level.travel">https://bcs.level.travel</a>'
        }
      },
      {
        id: 5,
        name: 'Cherehapa',
        linkName: 'https://bcs.cherehapa.ru',
        percent: '10%',
        description: 'Получайте 10% бонусами при<br> оплате картой страховки для<br> путешествий',
        logo: 'http://aeroflot.aic.ru/AB_bcs_helper/images/c-cherehapa.png',
        popup: {
          title: 'Бонусы с дебетовой картой БКС',
          subtitle: 'Получить легко',
          description: 'Просто оплачивайте покупки картами БКС Банка на специальном сайте партнёра и получайте за них бонусы. <b>1 бонус равен 1 рублю</b>. Чтобы перевести бонусы в рубли, нужно просто компенсировать стоимость одной или нескольких покупок через мобильное приложение. Деньги мгновенно зачислятся на счет. Сайт партнера: <a target="_blank" rel="nofollow" href="https://bcs.cherehapa.ru">https://bcs.cherehapa.ru</a>'
        }
      }
    ];

    this.init();
  }

  init() {
    const self = this;
    setTimeout(function () {
      // Render a layout with random data
      // after the ready of the DOM in 5 seconds
      setTimeout(function () {
        if (!self.checkLocalStorageValue()) {
          self.renderABItem();
        }
      }, 5000);
    }, 500);
  }

  onHelperOrderButtonClick(eventLabel) {
    let dataLayer = [];
    dataLayer.push({
      'event': 'autoEvent',
      'eventCategory': 'ab',
      'eventAction': 'click_push_make_apply',
      'eventLabel': eventLabel
    });
  }

  onHelperMoreButtonClick(eventLabel) {
    let dataLayer = [];
    dataLayer.push({
      'event': 'autoEvent',
      'eventCategory': 'ab',
      'eventAction': 'click_push_detail',
      'eventLabel': eventLabel
    });
  }

  onHelperClose(eventLabel) {
    let dataLayer = [];
    dataLayer.push({
      'event': 'autoEvent',
      'eventCategory': 'ab',
      'eventAction': 'click_push_close',
      'eventLabel': eventLabel
    });
  }

  onHelperRender(eventLabel) {
    let dataLayer = [];
    dataLayer.push({
      'event': 'autoEvent',
      'eventCategory': 'ab',
      'eventAction': 'visible_push',
      'eventLabel': eventLabel
    });
  }

  onPopupOrderButtonClick(eventLabel) {
    let dataLayer = [];
    dataLayer.push({
      'event': 'autoEvent',
      'eventCategory': 'ab',
      'eventAction': 'click_popup_make_apply',
      'eventLabel': eventLabel
    });
  }

  onPopupClose(eventLabel) {
    let dataLayer = [];
    dataLayer.push({
      'event': 'autoEvent',
      'eventCategory': 'ab',
      'eventAction': 'click_popup_close',
      'eventLabel': eventLabel
    });
  }


  randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
  }

  renderABItem() {
    this.addContent();
    this.addStyles();
  }

  addLocalStorageValue() {
    localStorage.setItem(this.ab_variable, true);
  }

  checkLocalStorageValue() {
    if (localStorage.getItem(this.ab_variable)) {
      return true;
    }
    return false;
  }

  initHelperPopups() {
    let $helpers = $('[data-helper-wrapper]');
    let self = this;

    $helpers.each(function () {
      let $this = $(this);
      let $id = $(this).attr('data-helper-id');
      let $name = $(this).attr('data-helper-name');
      let $popup = $('[data-helper-popup][data-helper-id="' + $id + '"]');
      let $moreButton = $(this).find('[data-helper-more]');
      let $close = $(this).find('[data-helper-close]');
      let $logoPopup = $(this).find('.logo_popup');
      let $orderButton = $(this).find('[data-helper-order]');

      self.onHelperRender($name);

      $moreButton.click(function (e) {
        self.showHelperPopup($id);
        self.onHelperMoreButtonClick($name);

        e.preventDefault();
        return false;
      });

      $orderButton.click(function () {
        self.closeHelper($id);
        self.onHelperOrderButtonClick($name);
      });

      $close.click(function (e) {
        self.closeHelper($id);
        self.onHelperClose($name);

        e.preventDefault();
        return false;
      });

      if ($logoPopup !== undefined && $logoPopup) {
        $logoPopup.click(function () {
          $getID = $this.attr('data-helper-id');
          this.showHelperPopup($getID);
        });
      }

      $popup.each(function () {
        let $this = $(this);
        let $id = $this.attr('data-helper-id');
        let $button = $this.find('[data-helper-popup-button]');
        let $close = $this.find('[data-helper-popup-close]');

        $button.click(function (e) {
          self.closeHelperPopup($id);
          self.closeHelper($id);
          self.onPopupOrderButtonClick($name);

        });

        $close.click(function (e) {
          self.closeHelperPopup($id);
          self.onPopupClose($name);

          e.preventDefault();
          return false;
        });
      });
    });
  }

  closeHelper(helperID) {
    $('.helper[data-helper-id="' + helperID + '"]')
      .stop()
      .fadeOut(300);
    // Don't show helper or popup next time again
    this.addLocalStorageValue();
  }

  showHelperPopup(popupID) {
    $('[data-helper-popup]')
      .stop()
      .fadeIn(300);
    $('[data-helper-popup-layout]')
      .stop()
      .fadeIn(300);
    $('[data-helper-id="' + popupID + '"] [data-helper-popup-wrapper]')
      .stop()
      .fadeIn(300);
    // Don't show helper or popup next time again
    this.addLocalStorageValue();
  }

  closeHelperPopup(popupID) {
    $('[data-helper-popup]')
      .stop()
      .fadeOut(300);
    $('[data-helper-popup-layout]')
      .stop()
      .fadeOut(300);
    $('[data-helper-id="' + popupID + '"] [data-helper-popup-wrapper]')
      .stop()
      .fadeIn(300);
    // Don't show helper or popup next time again
    this.addLocalStorageValue();
  }

  closeAllHelperPopups() {
    $('[data-helper-popup]')
      .stop()
      .fadeOut(300);
    $('[data-helper-popup-layout]')
      .stop()
      .fadeOut(300);
    $('[data-helper-id] [data-helper-popup-wrapper]')
      .stop()
      .fadeIn(300);
    // Don't show helper or popup next time again
    this.addLocalStorageValue();
  }

  addContent() {
    let item = this.splitTestData[this.randomInteger(0, this.splitTestData.length - 1)];

    console.log('рандом: ', this.randomInteger(0, this.splitTestData.length - 1));
    console.log(this.splitTestData);
    console.log('Item: ', item);

    $('body')
      .append(`
        <div class="helper" data-helper-wrapper data-helper-id="${item.id}" data-helper-name="${item.name}">
          <div class="helper__top">
            <div class="helper__close" data-helper-close>
              <img src="http://aeroflot.aic.ru/AB_bcs_helper/images/i-close.svg" />
            </div>
          </div>
          <div class="helper__body">
            <div class="helper__content">
              <div class="helper__center">
                <div class="helper__logo">
                  ${item.linkName ? `
                    <a href="${item.linkName}" target="_blank">
                        <img class="helper__logo-src" alt="${item.name}" src="${item.logo}"/>
                      </a>`
        : `<img class="helper__logo-src logo_popup" data-helper-id="${item.id}" alt="${item.name}" src="${item.logo}"/>`
      }
                </div>
                <div class="helper__percent">
                  <span>${item.percent}</span>
                </div>
              </div>
              <div class="helper__description">
                <span>${item.description}</span>
              </div>
            </div>
            <div class="helper__bottom">
              <div class="helper__more">
                <a class="helper__more-link" data-helper-more href="#">Подробнее</a>
              </div>
              <div class="helper__button">
                  <a class="helper__button-item" href="#section-request" data-helper-order>Оформить карту</a>
              </div>
            </div>
          </div>
        </div>
        <div class="h-popup" data-helper-popup data-helper-id="${item.id}">
          <div class="h-popup__layout" data-helper-popup-layout></div>
          <div class="h-popup__modal" data-helper-popup-modal>
            <div class="h-popup__wrapper" data-helper-popup-wrapper>
              <div class="h-popup__close" data-helper-popup-close>
                <img src="http://aeroflot.aic.ru/AB_bcs_helper/images/i-close.svg" />
              </div>
              <div class="h-popup__title">
                <div class="h-popup__container">
                  <span>${item.popup.title}</span>
                </div>
              </div>
              <div class="h-popup__body">
                <div class="h-popup__container">
                  <div class="h-popup__about">
                    <div class="h-popup__info">
                      <div class="h-popup__logo">
                        <img src="${item.logo}" alt="${item.name}" /> 
                      </div>
                      <div class="h-popup__description">
                        <span>${item.description}</span>
                      </div>
                    </div>
                    <div class="h-popup__percent">
                      <span>${item.percent}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="h-popup__bottom">
                <div class="h-popup__container">
                  <div class="h-popup__subtitle">
                    <span>${item.popup.subtitle}</span>
                  </div>
                  <div class="h-popup__bottom-description">
                    <p>${item.popup.description}</p>
                  </div>
                  <div class="h-popup__button">
                    <a href="#section-request" class="h-popup__button-item _anchor" data-helper-popup-button>Оформить карту</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);
    // Init helper popups
    this.initHelperPopups();
  }

  addStyles() {
    $('head')
      .append(`
        <style>
          .helper {
            border-radius : 6px;
            box-shadow : rgba(82, 130, 245, 0.3) 0px 2px 10px 0px;
            background-color : rgb(255, 255, 255);
            width : 373px;
            height : 311px;
            box-sizing : border-box;
            padding : 16px 24px;
            font-family : "Opensans Regular", sans-serif;
            display : flex;
            flex-direction : column;
            justify-content : flex-start;
            align-items : flex-start;
            position : fixed;
            left : 30px;
            bottom : 10px;
            z-index : 999;
          }
          .helper__top {
            display : flex;
            flex-direction : row;
            justify-content : flex-end;
            align-items : center;
            width : 100%;
          }
          .helper__link-item {
            color : rgb(122, 129, 142);
            text-decoration-line : none;
            text-decoration-style : initial;
            text-decoration-color : initial;
            font-size : 14px;
          }
          .helper__body {
            margin-top : 8px;
            display : flex;
            flex-direction : column;
            justify-content : space-between;
            align-items : flex-start;
            flex-grow : 1;
            width : 100%;
          }
          .helper__logo {
            height : 80px;
            max-width : 147px;
            display : flex;
            flex-direction : column;
            justify-content : center;
            align-items : flex-start;
          }
          .helper__content {
            width : 100%;
          }
          .helper__logo-src {
            max-width : 100%;
            max-height : 100%;
            width : 100%;
            height : auto;
          }
          .helper__percent {
            font-family : "Formular Regular", sans-serif;
            font-size : 40px;
            color : rgb(5, 25, 50);
          }
          .helper__description {
            margin-top : 8px;
            font-size : 16px;
            color : rgb(51, 68, 88);
          }
          .helper__center {
            display : flex;
            flex-direction : row;
            justify-content : space-between;
            align-items : center;
          }
          .helper__close {
            width : 32px;
            height : 32px;
            display : flex;
            flex-direction : row;
            justify-content : center;
            align-items : center;
          }
          .helper__bottom {
            display : flex;
            flex-direction : row;
            justify-content : space-between;
            align-items : center;
            width : 100%;
          }
          .helper__more-link {
            font-family : "Opensans Bold", sans-serif;
            color : rgb(82, 130, 245);
            text-decoration-line : none;
            text-decoration-style : initial;
            text-decoration-color : initial;
          }
          .helper__button-item {
            box-sizing : border-box;
            padding : 16px 24px;
            line-height : 24px;
            font-size : 16px;
            font-weight : bold;
            font-family : "Opensans Regular", sans-serif;
            background-color : rgb(82, 130, 245);
            color : rgb(255, 255, 255);
            border-radius : 4px;
            text-decoration-line : none;
            text-decoration-style : initial;
            text-decoration-color : initial;
            display : block;
          }
          .h-popup {
            position : fixed;
            left : 0px;
            width : 100%;
            height : 100%;
            z-index : 1000;
            top : 0px !important;
            display: none;
          }
          .h-popup__layout {
            position : absolute;
            z-index : 1001;
            top : 0px;
            left : 0px;
            width : 100%;
            height : 100%;
            background-color : rgba(0, 0, 0, 0.8);
            display: none;
          }
          .h-popup__modal {
            position : absolute;
            top : 0px;
            left : 0px;
            width : 100%;
            height : 100%;
            display : flex;
            flex-direction : row;
            justify-content : center;
            align-items : center;
            z-index : 1002;
          }
          .h-popup__wrapper {
            box-sizing : border-box;
            padding : 64px 0px 48px 0px;
            background-color : rgb(255, 255, 255);
            border-radius : 6px;
            max-width : 1048px;
            position : relative;
            display: none;
          }
          .h-popup__close {
            position : absolute;
            right : 32px;
            top : 32px;
            width : 32px;
            height : 32px;
            display : flex;
            flex-direction : row;
            justify-content : center;
            align-items : center;
          }
          .h-popup__title {
            font-size : 40px;
            font-family : "Formular Bold", sans-serif;
            color : rgb(51, 68, 88);
          }
          .h-popup__container {
            padding : 0px 80px;
            margin : 0px auto;
            width : 100%;
            box-sizing : border-box;
          }
          .h-popup__body {
            display : flex;
            flex-direction : row;
            justify-content : space-between;
            align-items : center;
            margin-top : 80px;
            padding-bottom : 16px;
            border-bottom : 1px solid #d8d8d8;
          }
          .h-popup__about {
            width : 100%;
          }
          .h-popup__logo {
            max-width : 147px;
            max-height : 80px;
            display : flex;
            flex-direction : row;
            justify-content : flex-start;
            align-items : center;
          }
          .h-popup__logo img {
            max-width : 100%;
            max-height : 100%;
            height : auto;
          }
          .h-popup__info {
            display : flex;
            flex-direction : row;
            justify-content : flex-start;
            align-items : center;
          }
          .h-popup__description {
            margin-left : 80px;
            font-size: 16px;
            color: #334458;
            font-family : "Opensans Regular", sans-serif;
          }
          .h-popup__description br {
            display : none;
          }
          .h-popup__about {
            display : flex;
            flex-direction : row;
            justify-content : space-between;
            align-items : center;
          }
          .h-popup__percent{
            font-family : "Formular Regular", sans-serif;
            font-size : 40px;
            color : #051932;
            text-align : right;
            margin-left : 80px;
          }
          .h-popup__bottom{
            margin-top : 56px;
          }
          .h-popup__subtitle{
            font-family : "Formular Bold", sans-serif;
            font-size : 24px;
            color : #334458;
          }
          .h-popup__bottom-description{
            font-family : "Opensans Regular", sans-serif;
            margin-top : 32px;
            font-size : 16px;
            line-height : 28px;
            color : #334458;
          }
          .h-popup__button{
            margin-top : 48px;
          }
          .h-popup__button-item{
            padding : 16px 72px;
            /*box-sizing : border-box;*/
            color : #fff;
            background-color : #5282f5;
            border-radius : 4px;
            font-family : "Opensans Bold", sans-serif;
            font-size : 16px;
            line-height : 24px;
            color : #fff;
          }
        </style>
      `);
  }
}

