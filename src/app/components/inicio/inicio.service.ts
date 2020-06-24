import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  url: string = "http://localhost:8080/api/";

  constructor(private httpClient: HttpClient) { }

  login(username, password){
    return this.httpClient.get(`${this.url}login/${username}/${password}`)
  }
  
}
