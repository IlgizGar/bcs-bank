import 'core-js/fn/symbol/iterator';
import 'core-js/es6/symbol';

import $ from 'jquery';

import svg4everybody from 'svg4everybody';
import Lottie from 'lottie-web';
import Header from '../components/modules/header/header';
import Footer from '../components/modules/footer/footer';
import Menubar from '../components/modules/menubar/menubar';
import Contact from '../components/library/contact/contact';
import Dropdown from '../components/library/dropdown/dropdown';
import Context from '../components/library/context/context';
import Carousel from '../components/library/carousel/carousel';
import { FixService, ExchangeService, ExchangeBanksService } from '../components/modules/services/services';
import MediaSlider from '../components/library/media-slider/media-slider';
import TableSort from '../components/library/table/table';
import Collapse from '../components/library/collapse/collapse';
import Modal from '../components/library/modal/modal';
import FileInput from '../components/library/file-input/file-input';
import Form from '../components/library/form/form';
import Input from '../components/library/input/input';
import Tabs from '../components/modules/tabbar/tabbar';
import Card from '../components/library/card/card';
import Checkbox from '../components/library/checkbox/checkbox';
import PageHeader from '../components/modules/page-header/page-header';
import Offices from '../components/modules/offices/offices';
import Transfer from '../components/modules/services/transfer';
import DocumentsFilter from '../components/modules/documents/documents';
import IndexSearch from '../components/modules/index-search/index-search';
import News from '../components/modules/news/news';
import Search from '../components/modules/search/search';
import Calculation from '../components/modules/calculation/calculation';
import InfoShow from '../components/library/info-show/infoShow';


require('babel-polyfill');

$(() => {
  svg4everybody();

  global.dropdowns = [];
  $('.js-dropdown').each((i, el) => {
    global.dropdowns[$(el).data('id')] = Dropdown(el);
    // global.dropdowns.push(Dropdown(el));
  });

  global.infoShows = [];

  $('.js-info-show').each((i, el) => {
    global.infoShows.push(InfoShow(el));
  });

  global.contexts = {};
  $('.js-context').each((i, el) => {
    global.contexts[$(el).data('id')] = Context(el);
  });

  global.contacts = [];
  $('.js-contact').each((i, el) => {
    global.contacts.push(Contact(el));
  });

  global.tabs = [];
  $('.js-tabbar').each((i, el) => {
    global.tabs.push(Tabs(el));
  });

  global.carousels = [];
  $('.js-carousel').each((i, el) => {
    global.carousels.push(Carousel(el));
  });

  global.inputs = [];
  $('.js-input').each((i, el) => {
    global.inputs.push(Input(el));
  });

  global.mediaSliders = [];
  if ($('.media-slider').length) {
    $('.media-slider').each((i, el) => {
      global.mediaSliders.push(MediaSlider($(el)));
    });
  }

  global.collapses = {};
  if ($('.collapse').length) {
    $('.collapse').each((i, el) => {
      global.collapses[$(el).data('id')] = new Collapse($(el));
    });
  }

  global.sortableTables = [];
  if ($('.js-table-sortable').length) {
    $('.js-table-sortable').each((i, el) => {
      global.sortableTables.push(new TableSort($(el)));
    });
  }

  global.modals = [];
  if ($('.js-open-modal').length) {
    $('.js-open-modal').each((i, el) => {
      global.modals.push(new Modal($(el)));
    });
  }

  if ($('.page-header_vacancy').length) {
    const headerHandler = new PageHeader();
    headerHandler.nav = $('.page-header_vacancy .page-header__nav');
    headerHandler.addStickyTitle();
    headerHandler.stickyHandler();
  }

  if ($('.file-input').length) {
    global.fileInput = new FileInput();
  }

  global.forms = [];
  if ($('.js-form').length) {
    $('.js-form').each((i, el) => {
      global.forms.push(new Form($(el).find('form')));
    });
  }

  global.cards = [];
  if ($('.js-card').length) {
    $('.js-card').each((i, el) => {
      global.cards.push(new Card($(el)));
    });
    $(document).on('click', '.js-card', (e) => {
      if ($(e.currentTarget).data('href')) {
        window.location.href = $(e.currentTarget).data('href');
      }
    });
  }

  global.checkboxes = [];
  if ($('.js-checkbox').length) {
    $('.js-checkbox').each((i, el) => {
      global.checkboxes.push(new Checkbox($(el)));
    });
  }

  if ($('.js-offices').length) {
    global.officesMap = new Offices($('.js-offices'));
  }

  if ($('.js-dropdown[data-id="documents-filter"]').length) {
    global.documentsFilter = DocumentsFilter(('.js-dropdown[data-id="documents-filter"]'));
  }

  if ($('.js-index-search').length) {
    global.indexSearch = IndexSearch($('.js-index-search'));
  }

  global.news = [];
  if ($('.js-news').length) {
    global.news.push(new News());
  }

  global.search = [];
  if ($('.js-search').length) {
    global.search.push(new Search());
  }

  global.transfer = [];
  if ($('.js-transfer').length) {
    global.transfer.push(new Transfer($('.js-transfer')));
  }

  global.menubar = new Menubar();

  global.header = Header('.js-header');
  global.footer = new Footer();

  if ($('[data-illustration]').length) {
    $('[data-illustration]').each((i, el) => {
      if ($(el).data('illustration').length) {
        Lottie.loadAnimation({
          container: el,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: `assets/illustrations/${$(el).data('illustration')}.json`,
        });
      }
    });
  }

  global.services = {};
  if ($('#exchange-service').length) {
    global.services.exchange = new ExchangeService('#exchange-service');
  }
  if ($('#exchange-service-bank').length) {
    global.services.exchange = new ExchangeBanksService('#exchange-service-bank');
  }
  if ($('#fix-service').length) {
    global.services.exchange = new FixService();
  }

  $('[data-scroll]').on('click', (e) => {
    const el = $(e.currentTarget).data('scroll');
    setTimeout(() => {
      if ($(el).length) {
        $('html, body').animate({ scrollTop: $(el).offset().top }, 500);
      }
    }, 200);
    return false;
  });


  if ($('.js-calc-result').length) {
    global.calculators = [];
    $('.js-calc-result').find('[data-calc]').each((index, el) => {
      global.calculators.push(new Calculation($(el)));
    });
    setTimeout(() => $('input').trigger('change'), 100); // инициализация первоначального расчета в калькуляторах
  }
  const confidencyShowLink = $('.js-confidence-policy-link');
  if (confidencyShowLink.length) {
    confidencyShowLink.on('click', (e) => {
      e.preventDefault();
      $('.js-confidence-policy').modal({
        closeExisting: false,
      });
    });
  }
  const bonusLink = $('.js-bonus-item');
  if (bonusLink.length) {
    bonusLink.on('click', (e) => {
      if ($(e.target).closest('.js-bonus-item').hasClass('js-bonus-item-show-popup')) {
        e.preventDefault();
        $('.js-bonus-modal').find('.js-bonus-modal-button').attr('href', $(e.target).closest('.js-bonus-item').attr('href'));
        $('.js-bonus-modal').modal();
      }
    });
  }

  global.setCurrency = (currency, input) => {
    const icons = String('₽,$,€,£').split(',');
    const currencyBlock = input.find('.js-title');
    const currencyResult = $('.calc-result-all').find('.icon');
    currencyResult.hide();
    const currencySpan = $('.js-currency-span');
    if (currencySpan.length) {
      currencySpan.text(icons[currency - 1]);
    } else {
      const currencyBlockText = `<span class="js-currency-span currency-span">${icons[currency - 1]}</span>`;
      $(currencyBlockText).insertBefore(currencyResult);
      currencyBlock.html(currencyBlockText);
    }
  };
});
