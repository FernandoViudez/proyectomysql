import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MatprimService {

  constructor(private http:HttpClient) { }

  validarMp(id) {
    return this.http.post("http://localhost:8080/api/validarMp", { id }).pipe(data=>data)
  }

  buscar(id, descripcion){
    return this.http.post("http://localhost:8080/api/getMatPri", {id, descripcion}).pipe(map(data=>data))
  }

  // buscarSinLlamadaBD(terminos, arrayAFiltrar: Array<any>){
  //   let { id, descripcion } = terminos;
  //   arrayAFiltrar.filter(item=>item.id.match(`/${id}/i`) || item.descripcion.match(`/${descripcion}/i`))
  // }

  traer(){ 
    return this.http.get("http://localhost:8080/api/getMp").pipe(map(data=>data))
  }

}
