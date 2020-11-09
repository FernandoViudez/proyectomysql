import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { obtenerPath } from '../_utils/generarBackPath';

@Injectable({
  providedIn: 'root'
})
export class CertificadosService {

  url:string=obtenerPath();

  constructor(private http:HttpClient) { }

  addCertificado(data:any){
    return this.http.post(`${this.url}nuevoCertificado`, data)
  }

  updateCertificado(data:any){
    return this.http.put(`${this.url}editarCertificado`, data)
  }

  getCertificado(descripcion:string){
    return this.http.post(`${this.url}obtenerCertificado`, { descripcion })
  }

  buscarCertificado(descripcion){
    return this.http.get(`${this.url}buscarCertificado/${descripcion}`);
  }



}
