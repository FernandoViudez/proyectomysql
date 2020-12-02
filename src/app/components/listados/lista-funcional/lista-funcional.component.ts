import { Component, OnInit, OnDestroy } from '@angular/core';
import { ListadosService } from '../listados.service';
import { Subscription, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DatePipe } from '../../../pipes/date.pipe';
import { Router } from '@angular/router';
import { GenericService } from 'src/app/services/generic.service';

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
  public codmp: number;
  public items: any[];
  public operacion: string;
  public nombreArchivo: string;
  public nombreHoja: string;
  public mpDescription: string;
  public subtotales = [
    { titulo: "AGENTEDECURA", subtotal: 0 },
    { titulo: "DILUYENTE", subtotal: 0 },
    { titulo: "ENDURECEDOR", subtotal: 0 },
    { titulo: "INERTES", subtotal: 0 },
    { titulo: "LÍQUIDO", subtotal: 0 },
    { titulo: "MONOCOMPONENTE", subtotal: 0 },
    { titulo: "POLVO", subtotal: 0 },
    { titulo: "RESINA", subtotal: 0 },
    { titulo: "SEMIELABORADO", subtotal: 0 },
  ];
  saldoInicial: number;
  saldoFinal: number;

  //Flag
  esProveedor: boolean = false;
  sonFechas: boolean = false;
  esPlani: boolean = false;
  esMp: boolean = false;

  //Total
  sumaTotal: number;

  //Date Pipe
  datePipe = new DatePipe();

  constructor(private listadosService: ListadosService, private route: Router,
    private genericService: GenericService) { }

  get isValid() {
    switch (this.operacion) {

      case "RANGO":
        this.sonFechas = false;
        this.esPlani = false;
        this.esMp = false;
        if (this.desde && this.hasta) {
          return false;
        } else {
          return true
        }

      case "MINIMO":
        this.sonFechas = false;
        this.esPlani = false;
        this.esMp = false;
        return false;


      case "RANGOMOV":
        this.sonFechas = true;
        this.esPlani = false;
        this.esMp = false;
        if (this.desde && this.hasta && this.inicio && this.fin) {
          return false;
        } else {
          return true
        }

      case "RANGOMOVD":
        this.sonFechas = true;
        this.esPlani = false;
        this.esMp = false;
        if (this.desde && this.hasta && this.inicio && this.fin) {
          return false;
        } else {
          return true
        }

      case "RANGOFECHAS":
        this.sonFechas = true;
        this.esPlani = true;
        this.esMp = true;
        if (this.inicio && this.fin) {
          return false;
        } else {
          return true
        }

      case "MPENFORMULAS":
        this.sonFechas = false;
        this.esPlani = false;
        this.esMp = true;
        if (this.codmp) {
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

      case "MPENFORMULAS":
        this.asignarPropiedadesDeMpEnFormulas();
        realizarOperacion ? this.rangomp$ = this.listadosService.mpEnFormulas(this.codmp) : false;
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
            item.componente = item.descripcion?.split("-")[1];
          }
        }
        console.log(data);
        this.saldoInicial = data?.saldoInicial

        if (data.orderByDesc) {
          data.response.sort(function (a, b) {
            if (a.descripcion > b.descripcion) {
              return 1;
            }
            if (a.descripcion < b.descripcion) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });
        }

        if(data.mpDescription) {
          this.mpDescription = data.mpDescription; 
        }

        // igualacion de los datos 
        this.items = data?.response;
      })
    }
  }

  //Filtrado por proovedor y tipo de operacion: "SUMA"
  filtrarPorProveedorYSuma(item: any) {
    return item.proveedor && item.tipo == "SUMA" && item.cantidad > 0;
  }

  //cuando se genera el excel
  onExcel() { // no permito que otro que no se administrador mande estadistica produccion a excel
    if (this.operacion == "RANGOFECHAS") {
      console.log(this.operacion);
      let user_role = localStorage.getItem("user_role");
      if (user_role != "ADMIN_ROL") {
        alert("No autorizado - Realizar impresion !")
      }
    } else {
      this.sb$ = this.listadosService.generarExcel(this.items, this.nombreArchivo, this.nombreHoja, this.propiedades.tb).subscribe
        ((data: any) => {
          this.genericService.downloadExcel(data.url);
        }, (err) => {
          console.log(err);
        })
    }
    this.resetear()
  }

  //Propiedades para la tabla listado de materias primas y bajo minimo materias primas
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

  //Propiedades para la tabla compras de materias primas y movimientos materias primas por rango fechas
  asignarPropiedadesDeMov() {
    if (this.operacion == "RANGOMOV") {
      this.propiedades = {
        th: [
          "ID",
          "DESCRIPCION",
          "CANTIDAD",
          "DETALLE",
          "COMPROBANTE",
          "FECHA",
          "PROVEEDOR",
          "MOTIVO",
          "LOTE"
        ],
        tb: [
          "id",
          "descripcion",
          "cantidad",
          "detalle",
          "numeroComprobante",
          "fecha",
          "proveedor",
          "motivo",
          "numeroLoteInt"
        ]
      }
    } else {
      this.propiedades = {
        th: [
          "ID",
          "DESCRIPCION",
          "CANTIDAD",
          "DETALLE",
          "COMPROBANTE",
          "FECHA",
          "PROVEEDOR",
          //"MOTIVO",
          "LOTE"
        ],
        tb: [
          "id",
          "descripcion",
          "cantidad",
          "detalle",
          "numeroComprobante",
          "fecha",
          "proveedor",
          //"motivo",
          "numeroLoteInt"
        ]
      }
    }
  }

  //Propiedades para la tabla estadistica de produccion
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
        "codpt",
        "descripcion",
        "cantidad",
        "componente",
        "fechafin"
      ]

    }
  }

  // Propiedades que se muestran en formulas
  asignarPropiedadesDeMpEnFormulas() {
    this.propiedades = {
      th: [
        "ID",
        "DESCRIPCION",
        "COLOR",
        "CODMP",
      ],
      tb: [
        "idprod",
        "descripcion",
        "color",
        "codmp",
      ]

    }
  }

  onPrint() {
    window.print();
  }

  //Calcula cantidades fabricadas en caso que el usuario
  //desee calcularlas (Agregar boton en pantalla y lugar donde se muestra el resultado)
  //Ademas calcula la suma de todos los productos iguales, las combina en una sola 
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
      switch (item.componente?.trim()) {
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

    this.resetearSubtotales();

    /** Calculo subtotales */
    for (let item of this.items) {
      switch (item.componente.trim()) {
        case "AGENTE DE CURA":
          this.subtotales[0].subtotal += item.cantidad;
          break;
        case "DILUYENTE":
          this.subtotales[1].subtotal += item.cantidad;
          break;
        case "ENDURECEDOR":
          this.subtotales[2].subtotal += item.cantidad;
          break;
        case "INERTES":
          this.subtotales[3].subtotal += item.cantidad;
          break;
        case "LÍQUIDO":
          this.subtotales[4].subtotal += item.cantidad;
          break;
        case "MONOCOMPONENTE":
          this.subtotales[5].subtotal += item.cantidad;
          break;
        case "POLVO":
          this.subtotales[6].subtotal += item.cantidad;
          break;
        case "RESINA":
          this.subtotales[7].subtotal += item.cantidad;
          break;
        case 'SEMIELABORADO':
          this.subtotales[8].subtotal += item.cantidad;
          break
      }
    }
    console.log(this.subtotales);

  }

  aplicarDatePipe(fecha) {
    return this.datePipe.transform(fecha)
  }

  ngOnDestroy() {
    this.sb$ ? this.sb$.unsubscribe() : false;
  }

  resetear() {
    this.sonFechas = null;
    this.esPlani = null;
    this.desde = null;
    this.hasta = null;
    this.inicio = null;
    this.fin = null;
    this.items = [];
    this.operacion = null;
    this.sumaTotal = null;
    this.resetearSubtotales();
    this.esMp = null;
    this.mpDescription = null;
    this.codmp = null;
  }

  resetearSubtotales() {
    for (let i = 0; i < this.subtotales.length; i++) {
      this.subtotales[i].subtotal = 0;
    }
  }

}
