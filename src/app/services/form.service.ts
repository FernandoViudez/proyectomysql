import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { obtenerPath } from '../_utils/generarBackPath';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private http: HttpClient) { }

  private url: string = obtenerPath();

  importarForm(idprod, idprod1, tintoformoalt1, componente) {
    let data = { idprod, idprod1, tintoformoalt1, componente };
    return this.http.post(`${this.url}importarForm`, data).pipe(map(data => data))
  }

  buscarP(id, termino1, termino2, termino3) {
    let data = { id, termino1, termino2, termino3 };
    return this.http.post(`${this.url}buscarPt`, data).pipe(map((data: any) => data.response));
  }

  traerEditar(idprod: number, tintoformoalt: string) {
    let data = { idprod, tintoformoalt }
    return this.http.post(`${this.url}traerAsoc`, data).pipe(map((data: any) => data.response))
  }

  cargarFilas() {
    return this.http.get(`${this.url}getAllProv`).pipe(map(data => data))
  }

  calcular(totCant: number, dato) {
    let data = { totCant, data: dato };
    return this.http.post(`${this.url}operations`, data)
  }

  finalizar(tintoformoalt, idprod, pe, ppp, ppv, resi, pig, pr, array) {
    let data = { tintoformoalt, idprod, pe, ppp, ppv, resi, pig, pr, array };
    return this.http.post(`${this.url}postFor`, data).pipe(map(data => data))
  }

  eliminarTodo(idprod) {
    return this.http.delete(`${this.url}deleteAll${idprod}`).pipe(map(data => data))
  }

  buscar(idprod, tintoformoalt) {
    let data = { idprod, tintoformoalt };
    return this.http.post(`${this.url}getFor`, data).pipe(map((data: any) => data));
  }

  validarIdProd(idPt) {
    let data = { idPt };
    return this.http.post(`${this.url}detectIdPt`, data).pipe(data => data);
  }
  
  obtenerFormulasPorRango(
    atributos: {
          atributoAComparar: string, 
          tabla: string,
          mayorQue?: number,
          menorQue?: number,
      }
  ) {
    return this.http.post(`${this.url}obtenerFormulasPorRango`, { atributos })
  }

}
