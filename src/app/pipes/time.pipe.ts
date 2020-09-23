import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timePipe'
})
export class timePipe implements PipeTransform {

  transform(fecha: any, ...args: unknown[]): unknown {
    
    if(fecha){
      let nuevaHora=fecha.split(" ");
      let hora=nuevaHora[2].charAt(0)+nuevaHora[2].charAt(1)
      let ultimaHora=`${dia}-${nuevaHora[1]}-${nuevaHora[0]}`
      return ultimaHora;
    }else{
      return "00:00";
    }

  }

}