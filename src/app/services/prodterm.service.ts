import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProdtermService {

  url : string = "http://localhost:8080/api/";

  constructor(private httpClient: HttpClient) { }

  validarPt(id: number){
    let data = { idPt: id };
    return this.httpClient.post(`${this.url}detectIdPt`, data)
  }


}
