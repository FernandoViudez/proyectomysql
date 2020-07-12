import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanifiService {

  url: string="http://localhost:8080/api/";

  constructor(private http: HttpClient) { }

  postearPlanifi(data){
    return this.http.post(`${this.url}postPlani`, data);
  }

  updatePlanifi(data, id:number){
    return this.http.put(`${this.url}putPlani/${id}`, data);
  }
}
