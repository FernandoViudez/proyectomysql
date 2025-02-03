import { Pipe, PipeTransform } from '@angular/core';
import numeral from 'numeral';

@Pipe({
  name: 'numeralPipe'
})
export class NumeralPipe implements PipeTransform {

  transform(value: unknown, arg?: string) {
    if (arg === 'entero') {
      const numero = Number(value);
      return numero.toFixed(0); // Redondea al entero más cercano
    } else if (arg) {
      const numero = Number(value);
      return numeral(numero).format('0.00');
    } else {
      const numero = Number(value);
      return numeral(numero).format('0.000');
    }
  }
}
