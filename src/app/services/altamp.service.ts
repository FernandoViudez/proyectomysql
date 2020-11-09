import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { obtenerPath } from '../_utils/generarBackPath';

@Injectable({
  providedIn: 'root'
})
export class AltampService {

  private url: string = obtenerPath();

  constructor(private http: HttpClient) { }

  postMp(data){
    return this.http.post(`${this.url}postMp`, data);
  }

  putMp(data){
    return this.http.put(`${this.url}putMp`, data);
  }

}
