import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CertificadosService {

  url:string="http://localhost:8080/api/";

  constructor(private http:HttpClient) { }

  addCertificado(data:any){
    return this.http.post(`${this.url}nuevoCertificado`, data)
  }

  updateCertificado(data:any){
    return this.http.put(`${this.url}editarCertificado`, data)
  }

  getCertificado(descripcion:string){
    return this.http.get(`${this.url}obtenerCertificado/${descripcion}`)
  }




}
