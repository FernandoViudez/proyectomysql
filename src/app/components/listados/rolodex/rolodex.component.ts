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

      /** La data aca viene ya con todos los datos resueltos por el back */
      let response = this.setearEn0(data.response);
      this.agruparCalcular(response);
    })
   
  }

  agruparCalcular(items){

    let arrayTemporal: any = [];
    
    /** Agrupamos codigos */
    for (let index = 0; index < items.length; index++) {

      if (arrayTemporal.length != 0) {

        if (arrayTemporal.find(item => item.id == items[index].id)) {

          arrayTemporal.map(item => {

            if (item.id == items[index].id && item.tipo == "SUMA") {

              item.sumas += items[index].cantidad;
            
            }else if (item.id == items[index].id && item.tipo == "RESTA"){

              item.restas += items[index].cantidad;

            }

          })

        } else {
          
          if(items[index].tipo=="SUMA"){
            items[index].sumas = items[index].cantidad;
          }else{
            items[index].restas = items[index].cantidad;
          }

          arrayTemporal.push(items[index])

        }

      } else {

        if(items[index].tipo=="SUMA"){
          items[index].sumas = items[index].cantidad;
        }else{
          items[index].restas = items[index].cantidad;
        }

        arrayTemporal.push(items[index]);
      
      }

    }


    /** Calculamos el saldo final por renglon */

    for(let item of arrayTemporal){
      item.saldoFinal = item.saldoInicial + item.sumas + item.restas;
    }
    
    /** Igualamos el temporal a items */
    this.items = arrayTemporal;

  }

  setearEn0(items){
    for(let item of items){
      item.sumas = 0;
      item.restas = 0;
    }
    return items;
  }

}
