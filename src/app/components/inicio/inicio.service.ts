import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { obtenerPath } from 'src/app/_utils/generarBackPath';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  url: string = obtenerPath();

  constructor(private httpClient: HttpClient) { }

  login(username, password){
    return this.httpClient.get(`${this.url}login/${username}/${password}`)
  }
  
}
