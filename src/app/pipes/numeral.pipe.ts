import { Pipe, PipeTransform } from '@angular/core';
import numeral from 'numeral';

@Pipe({
  name: 'numeralPipe'
})
export class NumeralPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): any {
    let numero=Number(value);
    let numeroNuevo = numeral(numero).format('0.000');
    return numeroNuevo;
  }

}
