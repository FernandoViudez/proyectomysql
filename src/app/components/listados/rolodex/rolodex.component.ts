import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ListadosService } from '../listados.service';

@Component({
  selector: 'app-rolodex',
  templateUrl: './rolodex.component.html',
  styles: []
})
export class RolodexComponent implements OnInit {

  inicio: number;
  desde: number;
  hasta: number;
  fin: number;
  sb$: Subscription;
  saldoFinalTotal: number;
  items: any[];

  /** Propiedades de almacenamiento de saldos */
  sumaTotal: number = 0;
  restaTotal: number = 0;

  //Propiedadesde que se mostrarán
  propiedades = {
    th: [
      "CODIGO",
      "DETALLE",
      "SALDO INICIAL",
      "SUMAS",
      "RESTAS",
      "SALDO FINAL"
    ],
    tb: [
      "id",
      "detalle",
      "saldoInicial",
      "sumas",
      "restas",
      "saldoFinal"
    ]
  }

  constructor(private listadosService: ListadosService) { }

  get isValid() {
    if(this.inicio && this.desde && this.hasta && this.fin){
      return false;
    }else{
      return true;
    }
  }

  ngOnInit(): void {
  }
  
  onSubmit(){
    this.sb$ = this.listadosService.rolodex(this.desde, this.hasta, this.inicio, this.fin)
    .subscribe((data: any) => {

      for(let item of data.response){
        if(item.tipo == "SUMA") this.sumaTotal += item.cantidad; 
        if(item.tipo == "RESTA") this.restaTotal += item.cantidad;
      }

      for(let item of data.response){
        item.sumas = this.sumaTotal;
        item.restas = this.restaTotal;
        item.saldoFinal = item.saldoInicial + item.sumas + item.restas;
      }

      /** La data aca viene ya con todos los datos resueltos por el back */
      // console.log(data);
      this.items = data.response;



    })
   
  }

}
