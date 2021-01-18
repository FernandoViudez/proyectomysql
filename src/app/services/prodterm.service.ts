import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { obtenerPath } from '../_utils/generarBackPath';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdtermService {

  url : string = obtenerPath();

  constructor(private httpClient: HttpClient) { }

  obtenerTodosLosProductos(): Observable<any>{
    return this.httpClient.get(`${this.url}obtenerTodosLosProductos`)
  } 

  validarPt(id: number){
    let data = { idPt: id };
    return this.httpClient.post(`${this.url}detectIdPt`, data)
  }


}
