import $ from 'jquery';
import BankCalculator from '../../library/calculator/calculator';

export default class Calculation {
  constructor($el) {
    this.calc = null;
    this.inputs = [];
    this.resultBlock = $el;
    this.initCalculator(this.resultBlock);
  }
  initCalculator(el) {
    const params = el.data('params')
      .split(',')
      .map(param => param.split('|'));

    const functionArgs = [];
    Object.keys(params).forEach((param) => {
      functionArgs.push(params[param][0]);
      this.inputs.push($(`[name="${params[param][1]}"]`));
    });
    console.log(this.inputs);
    this.calc = new BankCalculator(functionArgs, el.data('calc'));
    this.dataBind();
  }
  dataBind() {
    Object.keys(this.inputs).forEach((i) => {
      this.inputs[i].on('change', () => {
        const values = [];
        Object.keys(this.inputs).forEach((j) => {
          values.push(parseInt(String(this.inputs[j].val()).replace(/ /g, ''), 10));
        });
        this.resultBlock.text(String(Math.round(this.calc.calc(...values))).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
      });
    });
  }
}

