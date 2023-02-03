import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { obtenerPath } from '../_utils/generarBackPath';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  private url: string = obtenerPath();
  public changeTittle = new EventEmitter<any>();

  constructor(private http: HttpClient) { }

  downloadExcel(url: string) {
    window.open(url, "_blank")
  }

  downloadTxt(filename: string, html: string) {
    window.open(`${this.url}descargarTxt?filename=${filename}&html=${html}`, "_blank");
  }

  calcularPlan(array: any[]) {
    let data = { array };
    return this.http.post(`${this.url}calcularPlanProduccion`, data);
  }

  agregarVerificacion(data: { operario: string, codigomp: number, lote: number }) {
    return this.http.post(`${this.url}agregarVerificacion`, data);
  }

  traerDescripcion(codigomp: number) {
    return this.http.get(`${this.url}traerDescripcionDeCalidadMp/${codigomp}`);
  }

  traerLote(lote: number) {
    return this.http.get(`${this.url}traerLote/${lote}`);
  }

  traerPartida(numeroPartida: number) {
    return this.http.get(`${this.url}traerPartida/${numeroPartida}`);
  }

  listadoVerificacion(codigoMp: number, lote: number, operario: string, fecha: Date, partida: number) {
    return this.http.post(`${this.url}traerVerificacion`, { codigoMp, lote, operario, fecha, partida });
  }

  eliminarDatos(fecha: Date) {
    return this.http.post(`${this.url}eliminarDatosViejos`, { fecha });
  }

  agregarMantenimiento(data: {
    equipo: string, nroequipo: string, motivo: string, correas: string, limpieza: string,
    mangueras: string, engrase: string, lubricacion: string, accesorios: string, conexiones: string, tableros: string,
    cortes: string, observaciones: string, fecha: Date, proxrevision: Date, usuario: string }) {
     return this.http.post(`${this.url}agregarMantenimiento`, data);
  }

  listadoMantenimiento(equipo: string, nroequipo: string, motivo: string, correas: string, limpieza: string,
    mangueras: string, engrase: string, lubricacion: string, accesorios: string, conexiones: string, tableros: string,
    cortes: string, observaciones: string, fecha: Date, proxrevision: Date, usuario: string) {
    return this.http.post(`${this.url}traerMantenimiento`, { equipo, nroequipo, motivo, correas, limpieza,
      mangueras, engrase, lubricacion, accesorios, conexiones, tableros, cortes, observaciones, fecha, proxrevision, usuario });
  }

}
