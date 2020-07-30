import { Component, OnInit, OnDestroy } from '@angular/core';
import { ListadosService } from '../listados.service';
import { Subscription, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

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

  constructor(private listadosService: ListadosService) { }

  get isValid() {
    switch (this.operacion) {

      case "RANGO":
        if (this.desde && this.hasta) {
          return false;
        } else {
          return true
        }

      case "MINIMO":
        return false;


      case "RANGOMOV":
        if (this.desde && this.hasta) {
          return false;
        } else {
          return true
        }

      case "RANGOMOV":
        if (this.desde && this.hasta) {
          return false;
        } else {
          return true
        }

      case "RANGOMOVD":
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

  onSubmit() {
    switch (this.operacion) {
      case "RANGO":
        this.asignarPropiedadesDeMp();
        this.rangomp$ = this.listadosService.rangomp(this.desde, this.hasta);
        break;
      case "MINIMO":
        this.asignarPropiedadesDeMp();
        this.rangomp$ = this.listadosService.mpminimo();
        break;
      case "RANGOMOV":
        this.asignarPropiedadesDeMov();
        this.rangomp$ = this.listadosService.rangoMov(this.desde, this.hasta);
        break;

      case "RANGOMOVD":
        this.asignarPropiedadesDeMov();
        this.esProveedor = true;
        this.rangomp$ = this.listadosService.rangoMov(this.desde, this.hasta);
        break;
    }

    this.sb$ = this.rangomp$.subscribe((data: any) => {
      data.response = this.esProveedor ? data.response.filter(this.filtrarPorProveedorYSuma) : data.response;
      console.log(data.response);
      this.items = data.response ;
    })

  }

  filtrarPorProveedorYSuma(item: any){
    console.log(item);
    return item.proveedor && item.tipo == "SUMA" && item.cantidad > 0;
  }

  onExcel() {
    this.sb$ = this.listadosService.generarExcel(this.items, this.nombreArchivo, this.nombreHoja, this.propiedades.tb).subscribe
      ((data: any) => {
        console.log(data);
      }, (err) => {
        console.log(err);
      })
  }

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

  ngOnDestroy() {
    this.sb$ ? this.sb$.unsubscribe() : false;
  }


}
