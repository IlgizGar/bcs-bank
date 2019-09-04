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

    if (global.showHelperPopup) {
      this.init();
    }
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
    var item = this.splitTestData[this.randomInteger(0, this.splitTestData.length - 1)];

    //IE fix
    var pasteStr = '';
    if (item.linkName) {
      pasteStr =  '<a href="' + item.linkName + '" target="_blank"><img class="helper__logo-src" alt="' + item.name + '" src="' + item.logo + '"/></a>';
    } else {
      pasteStr = '<img class="helper__logo-src logo_popup" data-helper-id="' + item.id + ' alt=' + item.name + '" src="' + item.logo + '"/>';
    }
    // end of IE fix

    $("body").append('' +
    '<div class="helper" data-helper-wrapper data-helper-id="' + item.id + '" data-helper-name="' + item.name + '">' +
      '<div class="helper__top">' +
        '<div class="helper__close" data-helper-close>' +
          '<img src="http://aeroflot.aic.ru/AB_bcs_helper/images/i-close.svg" />' +
        '</div>' +
      '</div>' +
      '<div class="helper__body">' +
        '<div class="helper__content">' +
          '<div class="helper__center">' +
            '<div class="helper__logo">' +
              pasteStr +
            '</div>' +
            '<div class="helper__percent">' +
              '<span>' + item.percent + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="helper__description">' +
            '<span>' + item.description + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="helper__bottom">' +
          '<div class="helper__more">' +
            '<a class="helper__more-link" data-helper-more href="#">Подробнее</a>' +
          '</div>' +
          '<div class="helper__button">' +
              '<a class="helper__button-item" href="#section-request" data-helper-order>Оформить карту</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="h-popup" data-helper-popup data-helper-id="' + item.id + '">' +
      '<div class="h-popup__layout" data-helper-popup-layout></div>' +
      '<div class="h-popup__modal" data-helper-popup-modal>' +
        '<div class="h-popup__wrapper" data-helper-popup-wrapper>' +
          '<div class="h-popup__close" data-helper-popup-close>' +
            '<img src="http://aeroflot.aic.ru/AB_bcs_helper/images/i-close.svg" />' +
          '</div>' +
          '<div class="h-popup__title">' +
            '<div class="h-popup__container">' +
              '<span>' + item.popup.title + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="h-popup__body">' +
            '<div class="h-popup__container">' +
              '<div class="h-popup__about">' +
                '<div class="h-popup__info">' +
                  '<div class="h-popup__logo">' +
                    '<img src="' + item.logo + '" alt="' + item.name + '" />' +
                  '</div>' +
                  '<div class="h-popup__description">' +
                    '<span>' + item.description + '</span>' +
                  '</div>' +
                '</div>' +
                '<div class="h-popup__percent">' +
                  '<span>' + item.percent + '</span>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="h-popup__bottom">' +
            '<div class="h-popup__container">' +
              '<div class="h-popup__subtitle">' +
                '<span>' + item.popup.subtitle + '</span>' +
              '</div>' +
              '<div class="h-popup__bottom-description">' +
                '<p>' + item.popup.description + '</p>' +
              '</div>' +
              '<div class="h-popup__button">' +
                '<a href="#section-request" class="h-popup__button-item _anchor" data-helper-popup-button>Оформить карту</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '');
    // Init helper popups
    this.initHelperPopups();
  }
}


