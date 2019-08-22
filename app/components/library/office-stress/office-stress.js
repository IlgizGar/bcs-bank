import $ from 'jquery';

export default class OfficeStress {
  constructor() {
    this.items = $('');
    this.currentTime = $('.js-congestion-time');
    this.resp = $('.js-congestion-resp');

    this.init();
  }

  init() {
    this.setStressData(new Date());
    setInterval(() => {
      this.setStressData(new Date());
    }, 60000)
  }

  setStressData(userDate) {
    this.currentTime.text(userDate.getHours() + ':' + userDate.getMinutes());
    if(userDate.getHours() < 10 || userDate.getHours() > 20) {
      this.currentTime.text('');
      this.resp.text('Откроется в 10:00');
    } else {
      const stressEl = $(`[data-period="${userDate.getHours()}"]`);
      if(stressEl.length) {
        switch(stressEl.data('stress')) {
          case 'min':
            this.resp.text('Сейчас низкая загруженность');
            break;
          case 'normal':
            this.resp.text('Сейчас средняя загруженность');
            break;
          case 'high':
            this.resp.text('Сейчас высокая загруженность');
            break;
        }
      }
    }
  }
}
