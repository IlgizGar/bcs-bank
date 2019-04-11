/**
 * create calculation function from string params
 * @param {args} example 'a,b,c','a+b+c' first arguments function variables , second function body
 */
export default class BankCalculator {
  constructor(...args) {
    this.function = null;
    this.script = null;
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
    try {
      document.body.removeChild(this.script);
    } catch (e) {
      console.error('no formuls created');
    }
  }
  static generateFunctionName() {
    return `_calc${window.funcCounter}_${Math.random().toString(36).substr(2, 9)}`;
  }
  parse() {
    const fName = BankCalculator.generateFunctionName();
    this.function = fName;
    const argsString = this.data.join(',');
    let formulaStr = '0';
    try {
      window.atob(this.formulaString);
      const atobFunc = `${fName}__a`;
      window[atobFunc] = window.atob;
      const constructorFunc = `${fName}__c`;
      window[constructorFunc] = Function;
      formulaStr = `
                            function ${fName}(${argsString}) {
                             var call =  new ${constructorFunc}('${argsString}', 'return ' + ${atobFunc}('${this.formulaString}')+ ';' ) ;
                              return call(${this.data.join(',')});
                            }
                        `;
    } catch (e) {
      formulaStr = `
                            function ${fName}(${argsString}) {
                              return ${this.formulaString}
                            }
                        `;
    }
    this.script = document.createElement('script');
    this.script.type = 'text/javascript';
    this.script.innerHTML = formulaStr;
    document.body.appendChild(this.script);
    return window[this.function];
  }
  calc(...args) {
    return this.count(...args);
  }
}

