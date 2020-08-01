import { Component, OnInit, OnDestroy } from '@angular/core';
import { ListadosService } from '../listados.service';
import { Subscription, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DatePipe } from '../../../pipes/date.pipe';

@Component({
  selector: 'app-lista-funcional',
  templateUrl: './lista-funcional.component.html',
  styleUrls: ['./lista-funcional.component.css']
})
export class ListaFuncionalComponent implements OnInit, OnDestroy {

  propiedades: {
    th: any[string],
    tb: any[string]
  };

  sb$: Subscription;
  rangomp$: Observable<any>;
  public desde: number;
  public hasta: number;
  public items: any[];
  public operacion: string;
  public nombreArchivo: string;
  public nombreHoja: string;

  //Flag
  esProveedor: boolean = false;
  sonFechas: boolean = false;

  //Total
  sumaTotal: number;

  //Date Pipe
  datePipe = new DatePipe();

  constructor(private listadosService: ListadosService) { }

  get isValid() {
    switch (this.operacion) {

      case "RANGO":
        this.sonFechas = false;
        if (this.desde && this.hasta) {
          return false;
        } else {
          return true
        }

      case "MINIMO":
        this.sonFechas = false;
        return false;


      case "RANGOMOV":
        this.sonFechas = false;
        if (this.desde && this.hasta) {
          return false;
        } else {
          return true
        }

      case "RANGOMOV":
        this.sonFechas = false;
        if (this.desde && this.hasta) {
          return false;
        } else {
          return true
        }

      case "RANGOMOVD":
        this.sonFechas = false;
        if (this.desde && this.hasta) {
          return false;
        } else {
          return true
        }

      case "RANGOFECHAS":
        this.sonFechas = true;
        if (this.desde && this.hasta) {
          return false;
        } else {
          return true
        }

      default:
        return true
    }
  }

  ngOnInit(): void {
  }

  //Realizar operacion
  onSubmit(realizarOperacion: boolean) {

    switch (this.operacion) {
      case "RANGO":
        this.asignarPropiedadesDeMp();
        realizarOperacion ? this.rangomp$ = this.listadosService.rangomp(this.desde, this.hasta) : false;
        break;
      case "MINIMO":
        this.asignarPropiedadesDeMp();
        realizarOperacion ? this.rangomp$ = this.listadosService.mpminimo() : false;
        break;
      case "RANGOMOV":
        this.asignarPropiedadesDeMov();
        realizarOperacion ? this.rangomp$ = this.listadosService.rangoMov(this.desde, this.hasta) : false;
        break;

      case "RANGOMOVD":
        this.asignarPropiedadesDeMov();
        this.esProveedor = true;
        realizarOperacion ? this.rangomp$ = this.listadosService.rangoMov(this.desde, this.hasta) : false;
        break;

      case "RANGOFECHAS":
        this.asignarPropiedadesDePlan();
        realizarOperacion ? this.rangomp$ = this.listadosService.rangoFechas(this.desde, this.hasta) : false;
        break;
    }

    if (realizarOperacion) {
      this.sb$ = this.rangomp$.subscribe((data: any) => {
        data.response = this.esProveedor ? data.response.filter(this.filtrarPorProveedorYSuma) : data.response;
        for(let item of data.response){ //Aplicamos los pipes necesarios
          item.fechacomienzo = item.fechacomienzo ? this.aplicarDatePipe(item.fechacomienzo) : undefined;
          item.fechafin = item.fechafin ? this.aplicarDatePipe(item.fechafin) : undefined;
          if(item.fechacompr) {
            item.componente = item.descripcion.split("-")[1];
          }
        }
        
        this.items = data.response;
      })
    }


  }

  //Filtrado por proovedor y tipo de operacion: "SUMA"
  filtrarPorProveedorYSuma(item: any) {
    return item.proveedor && item.tipo == "SUMA" && item.cantidad > 0;
  }

  //cuando se genera el excel
  onExcel() {
    this.sb$ = this.listadosService.generarExcel(this.items, this.nombreArchivo, this.nombreHoja, this.propiedades.tb).subscribe
      ((data: any) => {
        console.log(data);
      }, (err) => {
        console.log(err);
      })
  }

  //Propiedades para la tabla
  asignarPropiedadesDeMp() {
    this.propiedades = {
      th: [
        "ID",
        "DESCRIPCION",
        "STOCK",
        "STOCK MINIMO"
      ],
      tb: [
        "id",
        "descripcion",
        "stock",
        "stockminimo"
      ]

    }
  }

  //Propiedades para la tabla
  asignarPropiedadesDeMov() {
    this.propiedades = {
      th: [
        "ID",
        "CANTIDAD",
        "DETALLE",
        "FECHA",
        "MOTIVO"
      ],
      tb: [
        "id",
        "cantidad",
        "detalle",
        "fecha",
        "motivo"
      ]

    }
  }

  //Propiedades para la tabla
  asignarPropiedadesDePlan() {
    this.propiedades = {
      th: [
        "ID",
        "DESCRIPCION",
        "CANTIDAD",
        "COMPONENTE",
        "FECHA FIN"
      ],
      tb: [
        "id",
        "descripcion",
        "cantidad",
        "componente",
        "fechafin"
      ]

    }
  }

  //Calcula cantidades fabricadas en caso que el usuario
  //desee calcularlas (Agregar boton en pantalla y lugar donde se muestra el resultado) 
  calcularCantidadesFabricadasEnPlani() {
    this.sumaTotal = 0;
      for(let item of this.items){
        this.sumaTotal += item.cantidad;
      }
  }

  aplicarDatePipe(fecha){
    return this.datePipe.transform(fecha)
  }

  ngOnDestroy() {
    this.sb$ ? this.sb$.unsubscribe() : false;
  }


}
