import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AltampService {

  url: string = "http://localhost:8080/api/";

  constructor(private http: HttpClient) { }

  postMp(data){
    return this.http.post(`${this.url}postMp`, data);
  }

  putMp(data){
    return this.http.put(`${this.url}putMp`, data);
  }

}
