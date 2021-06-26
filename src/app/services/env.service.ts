import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { obtenerPath } from '../_utils/generarBackPath';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  private url:string= obtenerPath();

  constructor(private http:HttpClient) { }


  traerTodo(){
    return this.http.get(`${this.url}getAllEnv`)
  }

  buscarpt(id, termino1, termino2, termino3){
    let data={id, termino1, termino2, termino3};
    return this.http.post(`${this.url}buscarPt`, data).pipe(map(data=>data))
  }

  detectarIdPt(idPt){
    let data={idPt};
    return this.http.post(`${this.url}detectIdPt`, data).pipe(map(data=>data))
  } 

  cargar(id, descripcion, codmp, envasado, nombreProducto){
    let data={id, descripcion, codmp, envasado, nombreProducto};
    return this.http.post(`${this.url}postRowEnv`, data).pipe(map(data=>data))
  }

  eliminarTodo(id){
    return this.http.delete(`${this.url}deleteAll2/${id}`).pipe(map(data=>data))
  }

  finalizar(id:number){
    let data={id};
    return this.http.post(`${this.url}postRowAtEnv`, data).pipe(map(data=>data))
  }

  traerPostear(id){
    let data={id};
    return this.http.post(`${this.url}traerPostearEnv`, data).pipe(map(data=>data))
  }

  detectarId(id){
    let data={id};
    return this.http.post(`${this.url}detectEnv`, data).pipe(map(data=>data));

  }

  eliminarFila(indice){
    let data={indice};
    return this.http.post(`${this.url}deleteRowEnv`, data).pipe(map(data=>data));
  }

  traerPorProps(indice){
    let data={indice};
    return this.http.post(`${this.url}getProvEnv`, data).pipe(map(data=>data))
  }

  editar(descripcion, codmp, cobarras, indice, envasado){
    let data={descripcion, codmp, cobarras, indice, envasado};
    return this.http.post(`${this.url}putRowEnv`, data).pipe(map(data=>data));
  }

  traerEnv(id){
    return this.http.get(`${this.url}getEnv/${id}`).pipe(map(data=>data))
  }

}
