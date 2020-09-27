import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';

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

  constructor(private genericService: GenericService) { }

  ngOnInit(): void {
  }

  onBusqueda(){
    // if(this.codigoMp && this.lote ){
      this.genericService.listadoVerificacion(this.codigoMp, this.lote, this.operario, this.fecha, this.partida)
      .subscribe((data: any) => {
        this.arregloVerificaciones = data.response;
      },e=>{
        console.log(e);
      })
    // }
  }

  resetear() {
    this.codigoMp = null;
    this.lote = null;
    this.operario = null;
    this.partida = null;
    this.descripcion = null;
    this.arregloVerificaciones = [];
    this.fecha = null;
  }

}
