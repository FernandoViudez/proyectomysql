import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { obtenerPath } from '../_utils/generarBackPath';

@Injectable({
  providedIn: 'root'
})
export class ProdtermService {

  url : string = obtenerPath();

  constructor(private httpClient: HttpClient) { }

  validarPt(id: number){
    let data = { idPt: id };
    return this.httpClient.post(`${this.url}detectIdPt`, data)
  }


}
