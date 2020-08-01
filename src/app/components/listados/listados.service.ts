import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ListadosService {

  url: string = "http://localhost:8080/api/";

  constructor(private http: HttpClient) { }

  generarExcel(array, nombreArchivo, nombreHoja, propiedades){
    let data = { 
      array,
      nombreArchivo,
      nombreHoja,
      propiedades
   }
    return this.http.post(`${this.url}crearArchivoExcel`, data)
  }

  rangomp(desde: number, hasta: number){
    return this.http.get(`${this.url}listarPorRangoMateriasPrimas/${desde}/${hasta}`)
  }

  mpminimo(){
    return this.http.get(`${this.url}stockMenorMinimo`)
  }

  rangoMov(desde: number, hasta: number){
    return this.http.get(`${this.url}listarPorRangoMovimientos/${desde}/${hasta}`)
  }

  rangoFechas(desde: number, hasta: number){
    return this.http.get(`${this.url}listarPorRangoPlanificacion/${desde}/${hasta}`)
  }

}
