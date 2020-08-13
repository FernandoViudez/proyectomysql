import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ListadosService } from '../listados.service';
import { NumeralPipe } from '../../../pipes/numeral.pipe';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-rolodex',
  templateUrl: './rolodex.component.html',
  styles: []
})
export class RolodexComponent implements OnInit {

  public inicio: number;
  public desde: number;
  public hasta: number;
  public fin: number;
  public nombreArchivo: string;
  public nombreHoja: string;
  sb$: Subscription;
  saldoFinalTotal: number;
  items: any[];

  //Numeral Pipe
  private numeralPipe = new NumeralPipe();

  /** Propiedades de almacenamiento de saldos */
  sumaTotal: number = 0;
  restaTotal: number = 0;

  //cuando se genera el excel
  onExcel() {
    this.sb$ = this.listadosService.generarExcel(this.items, this.nombreArchivo, this.nombreHoja, this.propiedades.tb).subscribe
      ((data: any) => {
        console.log(data);
      }, (err) => {
        console.log(err);
      })
    this.resetear()
  }

  //Propiedadesde que se mostrarán
  propiedades = {
    th: [
      "CODIGO",
      "DESCRIPCION",
      "SALDO INICIAL",
      "SUMAS",
      "RESTAS",
      "SALDO FINAL"
    ],
    tb: [
      "id",
      "descripcion",
      "saldoInicial",
      "sumas",
      "restas",
      "saldoFinal"
    ]
  }

  constructor(private listadosService: ListadosService) { }

  get isValid() {
    if (this.inicio && this.desde && this.hasta && this.fin) {
      return false;
    } else {
      return true;
    }
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.sb$ = this.listadosService.rolodex(this.desde, this.hasta, this.inicio, this.fin)
      .subscribe((data: any)=>{

        /** La data aca viene ya con todos los datos resueltos por el back */
        let response = this.setearEn0([...data.response]);
        this.agruparCalcular([...response])
        .then(res=>{
          this.iterarYAplicar(this.items);
        })
        .catch(err=>{
          console.log(err);
        })
      })

  }

  agruparCalcular(items) {
    return new Promise((resolve, reject) => {
      
      let arrayTemporal: any = [];

      /** Agrupamos codigos */
      for (let index = 0; index < items.length; index++) {
  
        /** Si no hay nada en el temporal, agregamos uno */
        if (arrayTemporal.length != 0) {
          /** Si hay algo en el arreglo, buscame si tiene algun id igual al current */
          if (arrayTemporal.find(item => item.id == items[index].id)) {
  
            /** Si encuentra algo, editale la suam/resta segun el caso */
            arrayTemporal.map(item => {
  
              if (item.id == items[index].id && items[index].tipo == "SUMA") {
                item.sumas += items[index].cantidad;
  
              } else if (item.id == items[index].id && items[index].tipo == "RESTA") {
  
                item.restas += items[index].cantidad;
  
              }
  
            })
  
          } else {
            /** Si no hay nada parecido a el, entonces agregamelo */
            if (items[index].tipo == "SUMA") {
  
              items[index].sumas = items[index].cantidad;
  
            } else {
  
              items[index].restas = items[index].cantidad;
  
            }
  
            arrayTemporal.push(items[index])
  
          }
  
        } else {
          /** Al agregar uno seteamos las sumas y restas del mismo para ya tenerlo en el temporal */
          console.log(items[index]);
          if (items[index].tipo == "SUMA") {
            items[index].sumas = items[index].cantidad;
          } else {
            items[index].restas = items[index].cantidad;
          }
  
          arrayTemporal.push(items[index]);
  
        }
  
      }
  
  
      /** Calculamos el saldo final por renglon */
  
      for (let item of arrayTemporal) {
        item.saldoFinal = item.saldoInicial + item.sumas + item.restas;
      }
  
      /** Igualamos el temporal a items */
      this.items = arrayTemporal;
      resolve("HECHO");

    });
  }

  setearEn0(items) {
    for (let item of items) {
      item.sumas = 0;
      item.restas = 0;
    }
    return items;
  }

  resetear() {
    this.desde = null;
    this.hasta = null;
    this.inicio = null;
    this.fin = null;
    this.items = [];
  }

  aplicarNumeralPipe(number) {
    return this.numeralPipe.transform(number)
  }

  iterarYAplicar(items: any[]){
    for(let item of items){
        item.saldoInicial = item.saldoInicial ? this.aplicarNumeralPipe(item.saldoInicial) : 0;
        item.sumas = item.sumas ? this.aplicarNumeralPipe(item.sumas) : 0;
        item.restas = item.restas ? this.aplicarNumeralPipe(item.restas) : 0;
        item.saldoFinal = item.saldoFinal ? this.aplicarNumeralPipe(item.saldoFinal) : 0;
    }
    this.items = items;
  }

}
