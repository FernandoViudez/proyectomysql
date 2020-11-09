import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { obtenerPath } from '../_utils/generarBackPath';

@Injectable({
  providedIn: 'root'
})
export class MatprimService {

  constructor(private http:HttpClient) { }

  private url: string = obtenerPath(); 

  validarMp(id) {
    return this.http.post(`${this.url}validarMp`, { id }).pipe(data=>data)
  }

  buscar(id, descripcion){
    return this.http.post(`${this.url}getMatPri`, {id, descripcion}).pipe(map(data=>data))
  }

  // buscarSinLlamadaBD(terminos, arrayAFiltrar: Array<any>){
  //   let { id, descripcion } = terminos;
  //   arrayAFiltrar.filter(item=>item.id.match(`/${id}/i`) || item.descripcion.match(`/${descripcion}/i`))
  // }

  traer(){ 
    return this.http.get(`${this.url}getMp`).pipe(map(data=>data))
  }

}
