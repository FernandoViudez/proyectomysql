import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timePipe'
})
export class TimePipe implements PipeTransform {

  transform(fecha: any, ...args: unknown[]): unknown {

    if (fecha) {
      console.log(fecha);
      // return fecha;
      let fechaTotal = fecha.split("T");
      let horas = fechaTotal[1].split(":")[0];  // si la hora no sale bien cambiar por let horas = Number(fechaTotal[1].split(":")[0]) -3 ;
      let minutos = fechaTotal[1].split(":")[1];
      let ultimaHora = `${horas}:${minutos}`
      return ultimaHora;
    } else {
      return "00:00";
    }

  }

}