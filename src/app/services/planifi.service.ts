import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { obtenerPath } from '../_utils/generarBackPath';

@Injectable({
  providedIn: 'root'
})
export class PlanifiService {

  url: string = obtenerPath();

  constructor(private http: HttpClient) { }

  postearPlanifi(data){
    return this.http.post(`${this.url}postPlani`, data);
  }

  updatePlanifi(data, id:number){
    return this.http.put(`${this.url}putPlani/${id}`, data);
  }
}
