import { Pipe, PipeTransform } from '@angular/core';

import { Cdr } from '../models/cdr.model';

@Pipe({
    name: 'cdrfilter',
    pure: false
})
export class CdrFilterPipe implements PipeTransform {
  transform(items: Cdr[], filter: Cdr): Cdr[] {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item: Cdr) => this.applyFilter(item, filter));
  }
  
  /**
   * Perform the filtering.
   * 
   * @param {Cdr} Cdr The Contact to compare to the filter.
   * @param {Cdr} filter The filter to apply.
   * @return {boolean} True if book satisfies filters, false if not.
   */
  applyFilter(cdr: Cdr, filter: Cdr): boolean {
    for (let field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === 'string') {
          if (cdr[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
            return false;
          }
        } else if (typeof filter[field] === 'number') {
          if (cdr[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }
}