import { Pipe, PipeTransform } from '@angular/core';
import { filter, reverse } from 'lodash';

@Pipe({
  name: 'status'
})
export class Status implements PipeTransform {
    transform(items: any[]): any[] {
        if (!items) {
            return;
        }
        let result = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].status == 'online') 
                result.push(items[i]);
        }
        for (let i = 0; i < items.length; i++) {
            if (items[i].status == 'away') 
                result.push(items[i]);
        }
        for (let i = 0; i < items.length; i++) {
            if (items[i].status == 'offline') 
                result.push(items[i]);
        }

        return result;
    }
}
