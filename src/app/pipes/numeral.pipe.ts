import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numeral'
})
export class NumeralPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
