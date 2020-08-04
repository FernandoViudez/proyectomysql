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
  public inicio: number;
  public fin: number;
  public items: any[];
  public operacion: string;
  public nombreArchivo: string;
  public nombreHoja: string;

  //Flag
  esProveedor: boolean = false;
  sonFechas: boolean = false;
  esPlani: boolean = false;

  //Total
  sumaTotal: number;

  //Date Pipe
  datePipe = new DatePipe();

  constructor(private listadosService: ListadosService) { }

  get isValid() {
    switch (this.operacion) {

      case "RANGO":
        this.sonFechas = false;
        this.esPlani = false;
        if (this.desde && this.hasta) {
          return false;
        } else {
          return true
        }

      case "MINIMO":
        this.sonFechas = false;
        this.esPlani = false;
        return false;


      case "RANGOMOV":
        this.sonFechas = true;
        this.esPlani = false;
        if (this.desde && this.hasta && this.inicio && this.fin) {
          return false;
        } else {
          return true
        }

      case "RANGOMOVD":
        this.sonFechas = true;
        this.esPlani = false;
        if (this.desde && this.hasta && this.inicio && this.fin) {
          return false;
        } else {
          return true
        }

      case "RANGOFECHAS":
        this.sonFechas = true;
        this.esPlani = true;
        if (this.inicio && this.fin) {
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
    this.esProveedor = false;
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
        realizarOperacion ? this.rangomp$ = this.listadosService.rangoMov(this.desde, this.hasta, this.inicio, this.fin) : false;
        break;

      case "RANGOMOVD":
        this.asignarPropiedadesDeMov();
        this.esProveedor = true;
        realizarOperacion ? this.rangomp$ = this.listadosService.rangoMov(this.desde, this.hasta, this.inicio, this.fin) : false;
        break;

      case "RANGOFECHAS":
        this.asignarPropiedadesDePlan();
        realizarOperacion ? this.rangomp$ = this.listadosService.rangoFechas(this.inicio, this.fin) : false;
        break;
    }

    if (realizarOperacion) {
      this.sb$ = this.rangomp$.subscribe((data: any) => {
        data.response = this.esProveedor ? data.response.filter(this.filtrarPorProveedorYSuma) : data.response;
        for (let item of data.response) { //Aplicamos los pipes necesarios
          item.fechacomienzo = item.fechacomienzo ? this.aplicarDatePipe(item.fechacomienzo) : undefined;
          item.fechafin = item.fechafin ? this.aplicarDatePipe(item.fechafin) : undefined;
          item.fecha = item.fecha ? this.aplicarDatePipe(item.fecha) : undefined;
          if (item.fechacompr) {
            item.componente = item.descripcion.split("-")[1];
          }
        }
        console.log(data.response);
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
  //Ademas calcula la suma de todas las mnaterias primas iguales, las combina en una sola 
  // Y divide por componente para subtotales 
  calcularCantidadesFabricadasEnPlani() {
    this.sumaTotal = 0;
    let arrayTemporal: any = [];
    for (let index = 0; index < this.items.length; index++) {
      this.sumaTotal += this.items[index].cantidad;

      if (arrayTemporal.length != 0) {

        if (arrayTemporal.find(item => item.codpt == this.items[index].codpt)) {

          arrayTemporal.map(item => {

            if (item.codpt == this.items[index].codpt) {
              item.cantidad += this.items[index].cantidad

            }
          })

        } else {

          arrayTemporal.push(this.items[index])

        }

      } else {
        arrayTemporal.push(this.items[index]);
      }

    }

    this.items = [];

    for (let item of arrayTemporal) {
      switch (item.componente.trim()) {
        case "AGENTE DE CURA":
          item.bgA = true;
          this.items.push(item);
          break;
        case "DILUYENTE":
          item.bgD = true;
          this.items.push(item);
          break;
        case "ENDURECEDOR":
          item.bgE = true;
          this.items.push(item);
          break;
        case "INERTES":
          item.bgI = true;
          this.items.push(item);
          break;
        case "LÍQUIDO":
          item.bgL = true;
          this.items.push(item);
          break;
        case "MONOCOMPONENTE":
          item.bgM = true;
          this.items.push(item);
          break;
        case "POLVO":
          item.bgP = true;
          this.items.push(item);
          break;
        case "RESINA":
          item.bgR = true;
          this.items.push(item);
          break;
        case 'SEMIELABORADO':
          item.bgS = true;
          this.items.push(item);
          break
      }
    }

    this.items.sort(function (a, b) {
      if (a.componente > b.componente) {
        return 1;
      }
      if (a.componente < b.componente) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });



  }

  aplicarDatePipe(fecha) {
    return this.datePipe.transform(fecha)
  }

  ngOnDestroy() {
    this.sb$ ? this.sb$.unsubscribe() : false;
  }


}
