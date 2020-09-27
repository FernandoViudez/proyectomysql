import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timePipe'
})
export class TimePipe implements PipeTransform {

  transform(fecha: any, ...args: unknown[]): unknown {
    
    if(fecha){
      console.log(fecha);
      // return fecha;
      let fechaTotal = fecha.split(":");
      let horas = fechaTotal[1];
      let minutos = fechaTotal[2].split(".")[0];
      let segundos = fechaTotal[2].split(".")[1].split("Z")[0];
      let ultimaHora=`${horas}:${minutos}:${segundos}`
      return ultimaHora;
    }else{
      return "00:00";
    }

  }

}