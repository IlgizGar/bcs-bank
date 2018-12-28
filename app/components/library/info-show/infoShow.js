import $ from 'jquery';


module.exports = (elem) => {
  class InfoShow {
    constructor(selector) {
      this.position = {
        x: 0,
        y: 0,
      };
      this.link = $(selector);
      this.createInfoBlock();
      this.initEvents();
      this.animate();
    }
    createInfoBlock() {
      if (this.infoBlock) {
        const block = document.createElement('div');
        block.classList.add('info-tooltip');
        document.body.appendChild(block);
        this.infoBlock = $(block);
      }
    }
    show(text) {
      this.infoBlock.html(text);
      this.infoBlock.addClass('state_show');
    }
    initEvents() {
      document.addEventListener('mousemove', (e) => {
        this.position.x = e.clientX;
        this.position.y = e.clientY;
      }, false);
    }
    animate() {
      const self = this;
      function frame() {
        self.infoBlock.css({ top: self.position.x, left: self.position.y });
        window.requestAnimationFrame(frame);
      }
      frame();
    }
  }
  return new InfoShow(elem);
};
