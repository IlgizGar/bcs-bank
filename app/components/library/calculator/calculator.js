/**
 * create calculation function from string params
 * @param {args} example 'a,b,c','a+b+c' first arguments function variables , second function body
 */
export default class BankCalculator {
  constructor(...args) {
    this.function = null;
    if ('funcCounter' in window) {
      window.funcCounter += 1;
    } else {
      window.funcCounter = 0;
    }
    this.formulaString = args[args.length - 1];
    this.data = [];
    for (let i = 0; i < args.length - 1; i += 1) {
      this.data.push(args[i]);
    }
    this.count = this.parse();
  }
  static generateFunctionName() {
    return `_calc${window.funcCounter}_${Math.random().toString(36).substr(2, 9)}`;
  }
  parse() {
    const fName = BankCalculator.generateFunctionName();
    this.function = fName;
    const atobFunc = `${fName}__a`;
    window[atobFunc] = window.atob;
    const constructorFunc = `${fName}__c`;
    window[constructorFunc] = Function;
    const argsString = this.data.join(',');
    const formulaStr = `
        function ${fName}(${argsString}) {
         var call =  new ${constructorFunc}('${argsString}', 'return ' + ${atobFunc}('${this.formulaString}')+ ';' ) ;
          return call(${this.data.join(',')});
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

