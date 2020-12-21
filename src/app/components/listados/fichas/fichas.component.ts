import { Component, OnInit } from '@angular/core';
import { ControlService } from '../../control/services/control.service';
import { DatePipe } from '../../../pipes/date.pipe';

@Component({
  selector: 'app-fichas',
  templateUrl: './fichas.component.html',
  styleUrls: ['./fichas.component.css']
})
export class FichasComponent implements OnInit {

  public desde: number;
  public hasta: number;

  //Date Pipe
  datePipe = new DatePipe();

  /** Arreglo de items */
  public items: any[];

  /** Propiedades del arreglo */
  propiedades = {
    th: [
      /** Texto que se muestra en el thead */
      "PARTIDA",
      "CODIGO PT",
      "DESCRIPCION",
      "FECHA APROBACION",
      "RESULTADO"
    ],
    tb: [
      /** Texto que se muestra en el tbody */
      "numeroPartida",
      "codpt",
      "descripcion",
      "fecha",
      "aprobado"
    ]
  }

  constructor(private controlService: ControlService) { }

  ngOnInit(): void {
  }

  get checkInputs() {
    if (this.desde != null && this.hasta != null) {
      return true;
    } else {
      return false;
    }
  }

  obtenerPorRango() {
    this.controlService.traerPorRango(this.desde, this.hasta)
      .subscribe((data: any) => {
        this.items = data.response;
        for (let item of data.response) { //Aplicamos los pipes necesarios
          item.fecha = item.fecha ? this.aplicarDatePipe(item.fecha) : undefined;
        }
      })
  }

  aplicarDatePipe(fecha) {
    return this.datePipe.transform(fecha)
  }

  onPrint() {
    window.print();
  }

  resetear() {
    this.desde = null;
    this.hasta = null;
    this.items = [];
  }

  validarDescripcion(noseimprime: string) {
    let items = ["DILUYENTE", "SEMIELABORADO", "ANULADO"];
    for(let item of items){
      if(noseimprime.includes(item)) return false;
    }
    return true;
  }

}
