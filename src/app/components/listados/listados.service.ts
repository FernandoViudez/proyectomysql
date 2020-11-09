import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { obtenerPath } from 'src/app/_utils/generarBackPath';

@Injectable({
  providedIn: 'root'
})
export class ListadosService {

  private url: string = obtenerPath();

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

  rangoMov(desde: number, hasta: number, inicio: number, fin: number){
    return this.http.get(`${this.url}listarPorRangoMovimientos/${desde}/${hasta}/${inicio}/${fin}`)
  }

  rolodex(desde: number, hasta: number, inicio: number, fin: number){
    return this.http.get(`${this.url}rolodex/${desde}/${hasta}/${inicio}/${fin}`)
  }

  rangoFechas(desde: number, hasta: number){
    return this.http.get(`${this.url}listarPorRangoPlanificacion/${desde}/${hasta}`)
  }

  mpEnFormulas(mp: number){
    return this.http.get(`${this.url}getAllMpInsideProasoc/${mp}`);
  }

}
