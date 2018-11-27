/**
 * create calculation function from string params
 * @param {args} example 'a,b,c','a+b+c' first arguments function variables , second function body
 */
export default class BankCalculator {
  constructor(...args) {
    this.function = null;
    this.formulaString = args[args.length - 1];
    this.data = [];
    for (let i = 0; i < args.length - 1; i += 1) {
      this.data.push(args[i]);
    }
    this.count = this.parse();
  }
  static generateFunctionName() {
    return `_calc_${Math.random().toString(36).substr(2, 9)}`;
  }
  parse() {
    const fName = BankCalculator.generateFunctionName();
    this.function = fName;
    const formulaStr = `
        function ${fName}(${this.data.join(',')}) {
          return ${this.formulaString};
        }
    `;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = formulaStr;
    document.body.appendChild(script);
    return window[this.function];
  }
  calc(...args) {
    return this.count(...args);
  }
}

