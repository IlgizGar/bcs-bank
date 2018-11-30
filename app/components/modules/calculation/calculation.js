import $ from 'jquery';
import BankCalculator from '../../library/calculator/calculator';

export default class Calculation {
  constructor($el) {
    this.calc = null;
    this.inputs = [];
    this.round = 0;
    this.wait = 0;
    this.resultBlock = $el;
    this.bindInput = null;
    this.initCalculator(this.resultBlock);
  }
  initCalculator(el) {
    const params = el.data('params')
      .split(',')
      .map(param => param.split('|'));
    const round = parseInt(el.data('round'), 10);
    this.round = round || 0;
    const wait = parseInt(el.data('ordered'), 10) * 10;
    this.wait = wait || 0;
    const functionArgs = [];
    Object.keys(params).forEach((param) => {
      functionArgs.push(params[param][0]);
      this.inputs.push($(`[name="${params[param][1]}"]`));
    });
    this.calc = new BankCalculator(functionArgs, el.data('calc'));
    const bind = el.data('bind');
    if (bind) {
      this.bindInput = $(`[name="${bind}"]`);
    }
    this.dataBind();
  }
  dataBind() {
    Object.keys(this.inputs).forEach((i) => {
      this.inputs[i].on('change', () => {
        const values = [];
        Object.keys(this.inputs).forEach((j) => {
          values.push(parseInt(String(this.inputs[j].val()).replace(/ /g, ''), 10));
        });
        setTimeout(() => {
          const result = (this.calc.calc(...values)).toFixed(this.round);
          if (this.bindInput) {
            this.bindInput.val(result);
            this.bindInput.trigger('change');
          }
          this.resultBlock.text(String(result.replace('.', ',')).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
        }, this.wait);
      });
    });
  }
}

