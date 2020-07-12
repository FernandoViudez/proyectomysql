import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private http: HttpClient) { }

  drop(current, prev) {
    let data = { current, prev };
    return this.http.post("http://localhost:8080/api/logOrd", data).pipe(map(data => data))
  }

  importarForm(idprod, idprod1, tintoformoalt1, componente) {
    let data = { idprod, idprod1, tintoformoalt1, componente };
    return this.http.post("http://localhost:8080/api/importarForm", data).pipe(map(data => data))
  }

  buscarP(id, termino1, termino2, termino3) {
    let data = { id, termino1, termino2, termino3 };
    return this.http.post("http://localhost:8080/api/buscarPt", data).pipe(map((data: any) => data.response));
  }

  traerEditar(idprod: number, tintoformoalt: string) {
    let data = { idprod, tintoformoalt }
    return this.http.post('http://localhost:8080/api/traerPostear', data).pipe(map((data: any) => data.response))
  }

  cargarFilas() {
    return this.http.get("http://localhost:8080/api/getAllProv").pipe(map(data => data))
  }

  editar(mpi, codmp, codpt, descripcion, cantidad, ind) {
    let data = {
      mpi, codmp, codpt, descripcion,
      cantidad, ind
    }
    return this.http.put(`http://localhost:8080/api/putRow`, data).pipe(map(data => data))
  }

  traerFilas(ind: number) {
    return this.http.get(`http://localhost:8080/api/getProv/${ind}`).pipe(map(data => data))
  }

  borrarFila(orden: number) {
    return this.http.delete(`http://localhost:8080/api/deleteRow/${orden}`).pipe(map((data: any) => data))
  }

  calcular(totCant: number, dato) {
    let data = { totCant, data: dato };
    return this.http.post("http://localhost:8080/api/operations", data)
  }

  finalizar(tintoformoalt, idprod, pe, ppp, ppv, resi, pig, pr) {
    let data = { tintoformoalt, idprod, pe, ppp, ppv, resi, pig, pr };
    return this.http.post("http://localhost:8080/api/postFor", data).pipe(map(data => data))
  }

  eliminarTodo(idprod) {
    return this.http.delete(`http://localhost:8080/api/deleteAll/${idprod}`).pipe(map(data => data))
  }

  cargar(idprod, tintoformoalt: string, mpi, codmp, codpt, descripcion, cantidad) {
    let data = { idprod, tintoformoalt, mpi, codmp, codpt, descripcion, cantidad }
    return this.http.post(`http://localhost:8080/api/postRow`, data).pipe(map(data => data))
  }

  buscar(idprod, tintoformoalt) {
    let data = { idprod, tintoformoalt };
    return this.http.post("http://localhost:8080/api/getFor", data).pipe(map((data: any) => data));
  }

  validarIdProd(idPt) {
    let data = { idPt };
    return this.http.post("http://localhost:8080/api/detectIdPt", data).pipe(data => data);
  }

}
