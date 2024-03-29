import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';
import { Router } from '@angular/router';
import { ListadosService } from '../listados/listados.service';


interface onExcelDTO {
  ok: boolean;
  message: string;
  url: string;
}

@Component({
  selector: 'app-mantenimiento-listado',
  templateUrl: './mantenimiento-listado.component.html',
  styleUrls: ['./mantenimiento-listado.component.css']
})

export class MantenimientoListadoComponent implements OnInit {

  public equipo: string;
  public nroequipo: string;
  public motivo: string;
  public correas: string;
  public limpieza: string;
  public mangueras: string;
  public engrase: string;
  public lubricacion: string;
  public accesorios: string;
  public conexiones: string;
  public tableros: string;
  public cortes: string;
  public observaciones: string;
  public fecha: Date;
  public proxrevision: any;
  public usuario: string;
  public arregloMantenimiento = [];
  public proMan: number;

  constructor(private genericService: GenericService, private route: Router,
    private readonly listadosService: ListadosService,) {
    let user_role = localStorage.getItem("user_role");
    if (user_role != "ADMIN_ROL" && user_role != "MANTENIMIENTO") {
      alert("Acceso no autorizado !")
      route.navigate(['inicio'])
    }
  }

  ngOnInit(): void {
  }

  onBusqueda() {
    this.genericService.listadoMantenimiento(this.equipo, this.nroequipo, this.motivo, this.correas, this.limpieza,
      this.mangueras, this.engrase, this.lubricacion, this.accesorios, this.conexiones, this.tableros, this.cortes, this.observaciones,
      this.fecha, this.proxrevision, this.usuario)
      .subscribe((data: any) => {
        this.arregloMantenimiento = data.response;
        this.proMan = 0;
      }, e => {
        console.log(e);
      })
  }

  onBusquedaProx() {
    let Hoy = new Date();                                  // para que liste los que hay que mantener durante el mes en curso
    let mesActual = Hoy.getMonth() + 1;
    let anioActual = Hoy.getFullYear();
    let primerDiaMes = new Date(anioActual, mesActual - 1, 1);
    let ultimoDiaMes = new Date(anioActual, mesActual, 0);
    this.genericService.listadoMantenimiento(this.equipo, this.nroequipo, this.motivo, this.correas, this.limpieza,
      this.mangueras, this.engrase, this.lubricacion, this.accesorios, this.conexiones, this.tableros, this.cortes, this.observaciones,
      this.fecha, this.proxrevision, this.usuario)
      .subscribe((data: any) => {
        this.arregloMantenimiento = data.response.filter((data: any) => {
          const fechaMantenimiento = new Date(data.proxrevision);
          return fechaMantenimiento >= primerDiaMes && fechaMantenimiento <= ultimoDiaMes;
        });
        this.proMan = 1;
      }, e => {
        console.log(e);
      })
  }

  resetear() {
    this.equipo = null;
    this.nroequipo = null;
    this.motivo = null;
    this.correas = null;
    this.limpieza = null;
    this.mangueras = null;
    this.engrase = null;
    this.lubricacion = null;
    this.accesorios = null;
    this.conexiones = null;
    this.tableros = null;
    this.cortes = null;
    this.observaciones = null;
    this.fecha = null;
    this.proxrevision = null;
    this.usuario = null;
    this.arregloMantenimiento = [];
  }

  imprimirBusqueda() {
    window.print();
  }

  onExcel() {
    this.listadosService.generarExcel(this.arregloMantenimiento,
      'Listado_mantenimiento', 'Hoja1', [
      "fecha",
      "equipo",
      "nroequipo",
      "motivo",
      "correas",
      "limpieza",
      "mangueras",
      "engrase",
      "lubricacion",
      "accesorios",
      "conexiones",
      "tableros",
      "cortes",
      "observaciones",
      "proxrevision",
      "usuario"
    ])
      .subscribe((data: onExcelDTO) => {
        this.genericService.downloadExcel(data.url);
      })
  }

}
