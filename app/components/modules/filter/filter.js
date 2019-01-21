import $ from 'jquery';

module.exports = (elem) => {
  class Filter {
    constructor(selector) {
      this.inputs = [];
      this.items = [];
      this.booleanValues = [];
      this.filter = $(selector);
      if (!global.filterData) {
        global.filterData = [];
      }
      this.init();
      this.bindEvents();
    }
    init() {
      this.filter.find('[data-filter]').each((index, el) => {
        this.inputs.push({
          type: $(el).attr('data-filter'),
          param: $(el).attr('data-filter-param'),
          element: el,
        });
      });
      const items = $('[data-filter-item]');
      items.each((index, element) => {
        const data = $(element).attr('data-filter-item').split('|');
        const dataObject = {};
        Object.keys(data).forEach((item) => {
          const dataItem = data[item];
          const itemArr = dataItem.split(':');
          let arr = null;
          let isArray = false;
          if (String(itemArr[1]).indexOf(',') + 1) {
            arr = String(itemArr[1]).split(',').map((c) => {
              return String(c).replace('#', '');
            });
            const arrLength = arr.length - 1;
            arr.length = arrLength;
            isArray = true;
          }
          Object.assign(dataObject, { [itemArr[0]]: isArray ? arr : itemArr[1] });
        });
        dataObject.element = element;
        this.items.push(dataObject);
      });
      console.log(this.items);
    }
    bindEvents() {
      Object.keys(this.inputs).forEach((item) => {
        const dataItem = this.inputs[item];
        if (dataItem.type === 'value') {
          const key = dataItem.param;
          global.filterData[key] = [];
          Filter.addToFilter(key, String($(dataItem.element).find('input').val()).replace(new RegExp(' ', 'g'), ''));
          $(dataItem.element).find('input').on('change', (e) => {
            global.filterData[key] = [];
            Filter.addToFilter(key, String($(e.currentTarget).val()).replace(new RegExp(' ', 'g'), ''));
            console.log(global.filterData);
            this.applyFilter(dataItem.type);
          });
        } else if (dataItem.type === 'boolean') {
          $(dataItem.element).on('click', (e) => {
            const key = dataItem.param;
            const isValued = !!$(e.currentTarget).attr('data-value');
            if ($(e.currentTarget).hasClass('state_active')) {
              $(e.currentTarget).removeClass('state_active');
              if (global.filterData[key]) {
                Filter.removeFromFilter(key, isValued ? $(e.currentTarget).attr('data-value') : 'true');
              }
            } else {
              $(e.currentTarget).addClass('state_active');
              Filter.addToFilter(key, isValued ? $(e.currentTarget).attr('data-value') : 'true');
            }
            console.log(global.filterData);
            this.applyFilter(dataItem.type);
          });
        }
      });
    }
    static addToFilter(key, value) {
      if (!global.filterData[key]) {
        global.filterData[key] = [];
        global.filterData[key].push(value);
      } else {
        global.filterData[key].push(value);
      }
    }
    static removeFromFilter(key, value) {
      Object.keys(global.filterData[key]).forEach((item) => {
        const dataItem = global.filterData[key][item];
        if (dataItem === value) {
          global.filterData[key].splice(item, 1);
        }
      });
    }
    static checkValue(search, target, type) {
    }
    applyFilter(type) {
    }
  }
  return new Filter(elem);
};
