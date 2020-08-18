import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  url = environment.backend;

  constructor(private http:HttpClient) { }

  downloadExcel(url: string){
    window.open(url, "_blank")
  }
  
  calcularPlan(array: any[]){
    let data = { array };
    return this.http.post(`${this.url}calcularPlanProduccion`, data);
  }
  


}
