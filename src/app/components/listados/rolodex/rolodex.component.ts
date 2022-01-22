import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ListadosService } from '../listados.service';
import { NumeralPipe } from '../../../pipes/numeral.pipe';
import Swal from 'sweetalert2';
import { window } from 'rxjs/operators';
import { GenericService } from '../../../services/generic.service';
import { MatprimService } from 'src/app/services/matprim.service';

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

  //busqueda MP
  id: number;
  termino1: number;
  termino2: string;
  termino3: string;
  arrayBusqueda = [];

  /** Propiedades de almacenamiento de saldos */
  sumaTotal: number = 0;
  restaTotal: number = 0;

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

  constructor(private listadosService: ListadosService, 
    private servicioMp: MatprimService,
    private genericService: GenericService) { }

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
      .subscribe((data: any) => {
        /** La data aca viene ya con todos los datos resueltos por el back */
        Swal.showLoading();
        let response = this.setearEn0([...data.response]);
        this.agruparCalcular([...response], data.flag)
          .then(res => {
            this.iterarYAplicar(this.items);
            Swal.close();
          })
          .catch(err => {
            console.log(err);
          })
      })

  }

  agruparCalcular(items, flag) {
    return new Promise((resolve, reject) => {

      let arrayTemporal: any = [];

      // if()
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
          if (items[index].tipo == "SUMA") {
            items[index].sumas = items[index].cantidad;
          } else {
            items[index].restas = items[index].cantidad;
          }

          arrayTemporal.push(items[index]);

        }

      }

      /** si no hay movimientos en el rango de fechas solicitado */

      if (flag == true) {
        for (let item of arrayTemporal) {
          item.sumas = 0;
          item.restas = 0;
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
    this.resetearBusqueda();
  }

  resetearBusqueda() {
    this.termino1 = null;
    this.termino2 = null;
    this.termino3 = null;
    this.arrayBusqueda = [];
  }

  aplicarNumeralPipe(number) {
    return this.numeralPipe.transform(number, "true")
  }

  iterarYAplicar(items: any[]) {
    for (let item of items) {
      item.saldoInicial = item.saldoInicial ? this.aplicarNumeralPipe(item.saldoInicial) : 0;
      item.sumas = item.sumas ? this.aplicarNumeralPipe(item.sumas) : 0;
      item.restas = item.restas ? this.aplicarNumeralPipe(item.restas) : 0;
      item.saldoFinal = item.saldoFinal ? this.aplicarNumeralPipe(item.saldoFinal) : 0;
    }
    this.items = items;
  }

  //cuando se genera el excel
  onExcel() {
    this.sb$ = this.listadosService.generarExcel(this.items, this.nombreArchivo, this.nombreHoja, this.propiedades.tb).subscribe
      ((data: any) => {
        this.genericService.downloadExcel(data.url);
      }, (err) => {
        console.log(err);
      })
    this.resetear();

  }

  buscarMp() {
    this.servicioMp.buscar(this.termino1, this.termino2, this.termino3).
      subscribe((data: any) => {
        this.arrayBusqueda = data.response;
      }, (err) => {
        console.log(err);
      })
  }

  seleccionarId(desde) {
    this.desde = desde;
  }

}
