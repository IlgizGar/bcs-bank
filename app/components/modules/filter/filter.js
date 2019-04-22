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
            arr = String(itemArr[1]).split(',').map(c => String(c).replace('#', ''));
            arr.length -= 1;
            isArray = true;
          }
          Object.assign(dataObject, { [itemArr[0]]: isArray ? arr : itemArr[1] });
        });
        dataObject.element = element;
        this.items.push(dataObject);
      });
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
            Filter.removeFromFilter(`${key}-direction`, $(dataItem.element).attr('data-filter-direction'));
            Filter.addToFilter(`${key}-direction`, $(dataItem.element).attr('data-filter-direction'));
            Filter.removeFromFilter(`${key}-type`, 'value');
            Filter.addToFilter(`${key}-type`, 'value');
            this.applyFilter();
          });
        } else if (dataItem.type === 'boolean') {
          let defaultEvent = 'click';
          let element = $(dataItem.element);

          if (element.hasClass('js-checkbox')) {
            element = $(dataItem.element).find('[type="checkbox"]');
            defaultEvent = 'change';
          }

          element.on(defaultEvent, (e) => {
            const key = dataItem.param;
            const isValued = !!$(e.currentTarget).attr('data-value');
            console.log(e.currentTarget, isValued);
            Filter.removeFromFilter(`${key}-type`, 'boolean');
            Filter.addToFilter(`${key}-type`, 'boolean');
            if ($(e.currentTarget).hasClass('state_active')) {
              $(e.currentTarget).removeClass('state_active');
              if (global.filterData[key]) {
                Filter.removeFromFilter(key, isValued ? $(e.currentTarget).attr('data-value') : 'true');
              }
            } else {
              $(e.currentTarget).addClass('state_active');
              Filter.addToFilter(key, isValued ? $(e.currentTarget).attr('data-value') : 'true');
            }
            this.applyFilter();
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
      if (global.filterData[key]) {
        Object.keys(global.filterData[key]).forEach((item) => {
          const dataItem = global.filterData[key][item];
          if (dataItem === value) {
            global.filterData[key].splice(item, 1);
          }
        });
      }
    }
    static hasValue(arr, value) {
      let find = false;
      if (Array.isArray(arr)) {
        Object.keys(arr).forEach((item) => {
          const dataItem = arr[item];
          if (String(dataItem) === String(value)) {
            find = true;
          }
        });
      } else if (String(arr) === String(value)) {
        find = true;
      }
      return find;
    }
    static checkValue(search, key, type, valueDirection) {
      let valid = true;
      if (type) {
        if (Object.prototype.hasOwnProperty.call(global.filterData, key)) {
          Object.keys(global.filterData[key]).forEach((item) => {
            const dataItem = global.filterData[key][item];
            if (type[0] === 'boolean') {
              valid = valid && Filter.hasValue(search, dataItem);
            }
            if (valueDirection) {
              if (valueDirection[0] === '>') {
                valid = (parseFloat(search) >= parseFloat(dataItem));
              } else if (valueDirection[0] === '<') {
                valid = (parseFloat(search) <= parseFloat(dataItem));
              }
            }
          });
          return valid;
        }
      }
      return 'no-property-set';
    }
    applyFilter() {
      console.log(global.filterData);
      Object.keys(this.items).forEach((item) => {
        let valid = true;
        Object.keys(global.filterData).forEach((key) => {
          $(this.items[item].element).removeClass('state_hidden');
          if ((key !== `${key}-direction`) || (key !== `${key}-type`)) {
            const type = global.filterData[`${key}-type`];
            const direction = global.filterData[`${key}-direction`];
            const filterData = Filter.checkValue(this.items[item][key], key, type, direction);
            if (filterData !== 'no-property-set') {
              valid = (valid && filterData);
            }
          }
        });
        if (!valid) {
          $(this.items[item].element).addClass('state_hidden');
        }
      });
    }
  }
  return new Filter(elem);
};
