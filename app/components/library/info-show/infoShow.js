import $ from 'jquery';


module.exports = (elem) => {
  class InfoShow {
    constructor(selector) {
      this.position = {
        x: 0,
        y: 0,
      };
      this.scroll = 0;
      this.link = $(selector);
      this.createInfoBlock();
      this.initEvents();
    }
    createInfoBlock() {
      const block = document.createElement('div');
      block.classList.add('info-tooltip');
      block.classList.add('js-info-tooltip');
      document.body.appendChild(block);
      this.infoBlock = $(block);
    }
    show(text) {
      this.infoBlock.html(text);
      this.infoBlock.addClass('state_show');
    }
    hide() {
      this.infoBlock.html('');
      this.infoBlock.removeClass('state_show');
    }
    initEvents() {
      let w = window.innerWidth;
      this.link[0].addEventListener('mousemove', (e) => {
        this.position.x = e.clientX;
        this.position.y = e.clientY;
        if (this.position.x + 200 > w) {
          this.position.x = this.position.x - 230;
        }
        this.infoBlock[0].style.transform = `translate3d(${this.position.x + 15}px,${this.position.y}px,0)`;
      }, false);
      $(window).resize(() => {
        w = window.innerWidth;
      });
      this.link.on('mouseenter', (e) => {
        $('.js-info-tooltip').removeClass('state_show');
        this.show($(e.currentTarget).find('.js-text').html());
      });
      this.link.on('mouseleave', () => {
        this.timer = setTimeout(() => {
          this.hide();
        }, 1000);
      });
      this.infoBlock.on('mouseenter', () => {
        clearTimeout(this.timer);
      });
      this.infoBlock.on('mouseleave', () => {
        this.hide();
      });
    }
  }
  return new InfoShow(elem);
};
