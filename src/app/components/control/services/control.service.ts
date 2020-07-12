import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  url = 'http://localhost:8080/api/';

  constructor(private httpClient: HttpClient) { }

  validarMp(id){
    return this.httpClient.get(`${this.url}obtenerMpControl/${id}`);
  }

  postearData(data){
    return this.httpClient.put(`${this.url}editarControlMp`, data); 
  }

  
  postearDataPt(data){
    return this.httpClient.put(`${this.url}editarControlPt`, data); 
  }

  buscarCt(id, termino1, termino2){ //BUSCARCONTROL DE CALIDAD MP
    let data={id, termino1, termino2};
    return this.httpClient.post(`${this.url}buscarControl`, data);
  }

  buscarCtp(id, termino1, termino2){ //BUSCAR CONTROL DE CALIDAD PT
    let data={id, termino1, termino2};
    return this.httpClient.post(`${this.url}buscarControlPt`, data);
  }

  traerporLote(lote:number, db:string, fila:string){
    let data = { lote, db, fila };
    return this.httpClient.post(`${this.url}getControlByLote`, data);
  }

}
