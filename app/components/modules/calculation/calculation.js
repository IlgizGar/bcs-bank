/**
 * data-параметры в блоке вывода
 * data-calc формула в base64 строке
 * data-params="переменная в формуле|имя input-а , переменная в формуле|имя input-а, и т.д в зависимости от колличества переменных"
 * data-bind имя input-а в который будут отправляться результаты расчета
 * data-ordered очередность выполнения формул расчета 0 - выполнится первой 2, 3, 4 выполнятся следующими в порядке нумерации
 * data-round до скольки знаков после запятой округлять результат
 * data-bind-inputs значения каких пар инпутов нужно связать указвается 1 раз у первого по порядку расчета
 */

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
    this.bindedInputs = [];
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
    const bindedInputsStr = el.data('bind-inputs');
    if (bindedInputsStr) {
      const bindedInputs = bindedInputsStr
        .split(',')
        .map(param => param.split('|'));
      Object.keys(bindedInputs).forEach((bindedInput) => {
        this.bindedInputs.push([$(`[name="${bindedInputs[bindedInput][0]}"]`), $(`[name="${bindedInputs[bindedInput][1]}"]`)]);
      });
      this.inputsBind();
    }
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
          values.push(parseFloat(String(((this.inputs[j].attr('type') !== 'radio') && (this.inputs[j].attr('type') !== 'checkbox')) ? this.inputs[j].val() : this.inputs[j].filter(':checked').val()).replace(/ /g, '')));
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
  inputsBind() {
    Object.keys(this.bindedInputs).forEach((i) => {
      const input = this.bindedInputs[i];
      input[0].on('change', () => {
        input[1].val(input[0].val());
        input[1].trigger('blur');
      });
      input[1].on('change', () => {
        input[0].val(input[1].val());
        input[0].trigger('blur');
        input[0].trigger('change');
      });
    });
  }
}

