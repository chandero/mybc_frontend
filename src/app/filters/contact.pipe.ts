import { Pipe, PipeTransform } from '@angular/core';

import { Contact } from '../models/contact.model';

@Pipe({
    name: 'contactfilter',
    pure: false
})
export class ContactFilterPipe implements PipeTransform {
  transform(items: Contact[], filter: Contact): Contact[] {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item: Contact) => this.applyFilter(item, filter));
  }
  
  /**
   * Perform the filtering.
   * 
   * @param {Contact} Contact The Contact to compare to the filter.
   * @param {Contact} filter The filter to apply.
   * @return {boolean} True if book satisfies filters, false if not.
   */
  applyFilter(contact: Contact, filter: Contact): boolean {
    for (let field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === 'string') {
          if (contact[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
            return false;
          }
        } else if (typeof filter[field] === 'number') {
          if (contact[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }
}