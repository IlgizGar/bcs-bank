import $ from 'jquery';
import tablesorter from 'tablesorter'

export default class TableSort {
  constructor($table) {
    this.$table = $table.children('table');
    this.sort_case_sensitive = false;
    this.init()
  }

  init() {
    this.sortByFullDate();
    this.sortByMoney();
    this.addSortIcons();
    this.$table.tablesorter({
      headers: {
        '[data-sort="fullDate"]': { sorter:'fullDate' },
        '[data-sort="money"]': { sorter:'money' }
      }
    })
  }

  addSortIcons() {
    this.$table.find('th').each((i, el) => {
      if (el.hasAttribute('data-sort')) {
        // todo: заменить иконку
        $(el).find('.table__column-title').append('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="none" fill-rule="evenodd"><path d="M-604-2935H836v7555H-604z"/></g></svg>')
      }
    })
  }

  sortByFullDate() {
    $.tablesorter.addParser({
      id: "fullDate",
      is: function(s) {
        return false;
      },
      format: function(s) {
        s = "" + s;
        var hit = s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
        if (hit && hit.length === 4) {
          return hit[3] + hit[2] + hit[1];
        } else {
          return s;
        }
      },
      type: "text"
    });
  }

  sortByMoney() {
    $.tablesorter.addParser({
      id: 'money',
      is: function (s) {
        return false;
      },
      format: function (s) {
        return s.replace(/\s+/g, '').replace(/,/g, '.');
      },
      type: 'numeric'
    });
  }
}
