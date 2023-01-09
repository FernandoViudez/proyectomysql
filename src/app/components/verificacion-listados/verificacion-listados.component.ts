import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';
import { MatprimService } from 'src/app/services/matprim.service';
import { ListadosService } from '../listados/listados.service';


interface onExcelDTO {
  ok: boolean;
  message: string;
  url: string;
}

@Component({
  selector: 'app-verificacion-listados',
  templateUrl: './verificacion-listados.component.html',
  styles: []
})

export class VerificacionListadosComponent implements OnInit {

  public lote: number;
  public codigoMp: number;
  public operario: string;
  public arregloVerificaciones = [];
  public partida: number;
  public descripcion: string;
  public fecha: Date;

  arrayBusqueda = [];
  termino1: number;
  termino2: string;
  termino3: string;
  desde: number;

  constructor(private genericService: GenericService,
    private readonly listadosService: ListadosService,
    private servicioMp: MatprimService,) { }

  ngOnInit(): void {
  }

  onBusqueda() {
    // if(this.codigoMp && this.lote ){
    this.genericService.listadoVerificacion(this.codigoMp, this.lote, this.operario, this.fecha, this.partida)
      .subscribe((data: any) => {
        this.arregloVerificaciones = data.response;
      }, e => {
        console.log(e);
      })
    // }
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
    this.codigoMp = desde;
  }

  resetear() {
    this.codigoMp = null;
    this.lote = null;
    this.operario = null;
    this.partida = null;
    this.descripcion = null;
    this.arregloVerificaciones = [];
    this.fecha = null;
    this.resetearBusqueda();
    this.desde = null;
  }

  resetearBusqueda() {
    this.termino1 = null;
    this.termino2 = null;
    this.termino3 = null;
    this.arrayBusqueda = [];
  }

  imprimirBusqueda(){
    window.print();
  }

  onExcel() {
    this.listadosService.generarExcel(this.arregloVerificaciones,
      'Listados_verificacion', 'Hoja1', [
      "fecha",
      "operario",
      "codigomp",
      "descripcion",
      "lote",
      "partida",
      "ok"
    ])
      .subscribe((data: onExcelDTO) => {
        this.genericService.downloadExcel(data.url);
      })
  }

}