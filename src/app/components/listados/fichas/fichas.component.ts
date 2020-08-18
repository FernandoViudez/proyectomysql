import { Component, OnInit } from '@angular/core';
import { ControlService } from '../../control/services/control.service';

@Component({
  selector: 'app-fichas',
  templateUrl: './fichas.component.html',
  styleUrls: ['./fichas.component.css']
})
export class FichasComponent implements OnInit {

  public desde: number;
  public hasta: number;

  /** Arreglo de items */
  public items: any[];

  /** Propiedades del arreglo */
  propiedades = {
    th:[
      /** Texto que se muestra en el thead */
      "LOTE",
      "DESCRIPCION",
      "TIPO"
    ],
    tb:[
      /** Texto que se muestra en el tbody */
      "numeroLote",
      "descripcion",
      "tipoProd"
    ]
  }

  constructor(private controlService: ControlService) { }

  ngOnInit(): void {
  }

  get checkInputs(){
    if(this.desde != null && this.hasta != null){
      return true;
    }else{
      return false;
    }
  }

  obtenerPorRango() {
    this.controlService.traerPorRango(this.desde, this.hasta)
    .subscribe((data: any)=>{
      console.log(data);
      this.items = data.response;
    })
  }

  onPrint(){
    window.print();
  }

}
