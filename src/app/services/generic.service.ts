import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  url = environment.backend;

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

  listadoVerificacion(codigoMp: number, lote: number, operario: string, fecha: Date, partida: number){
    return this.http.post(`${this.url}traerVerificacion`, { codigoMp, lote, operario, fecha, partida });
  }
  
  eliminarDatos(fecha: Date){
    return this.http.post(`${this.url}eliminarDatosViejos`, { fecha });
  }


}
