import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePipe'
})
export class DatePipe implements PipeTransform {

  transform(fecha: any): any {
    
    if(fecha){
      let nuevaFecha=fecha.split("-");
      let dia=nuevaFecha[2].charAt(0)+nuevaFecha[2].charAt(1)
      let ultimaFecha=`${dia}-${nuevaFecha[1]}-${nuevaFecha[0]}`
      return ultimaFecha;
    }else{
      return "00-00-0000";
    }

  }

}
