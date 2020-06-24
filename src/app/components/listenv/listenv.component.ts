import { Component, OnInit } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { EnvService } from 'src/app/services/env.service';
declare let alertify:any; 

@Component({
  selector: 'app-listenv',
  templateUrl: './listenv.component.html',
  styles: []
})
export class ListenvComponent implements OnInit {

  idprod: string;
  descripcion1:string;
  array = [];
  idBus:string;
  termino1:string;
  termino2:string;
  termino3:string;
  arrayBusqueda=[];

  constructor(private service: FormService, private service2:EnvService) { }

  ngOnInit(): void {
  }


  validarId(){
    this.service.validarIdProd(this.idprod).
    subscribe((data:any)=>{
      if (data.desc) {
        alertify.success("ESTE PRODUCTO TERMINADO EXISTE, SIGUE ADELANTE!!")
        this.descripcion1 = `${data.desc}  ${data.color}  ${data.componente}`;
        this.traerEnv();
      } else {
        alertify.error("NO EXISTE ESE PRODUCTO TERMINADO!!")
        return this.resetear1();
      }
    },(err)=>{
      console.log(err);
    })
  }

  resetear() {
    this.termino1="";
    this.termino2="";
    this.termino3="";
  }

  resetear1() {
    this.idprod = null;
    this.descripcion1 = null;
  }

  buscarP(){
    this.service.buscarP(this.idBus, this.termino1,this.termino2,this.termino3).
    subscribe((data:any)=>{
      this.arrayBusqueda=data;
    },(err)=>{
      console.log(err);
    })
  }

  seleccionarId(id){
    this.idprod=id;
    this.validarId()
  }

  resetearBusqueda(){
    this.array=[];
    this.arrayBusqueda=[];
    this.resetear1();
    this.resetear();
  }

  traerEnv(){
    this.service2.traerEnv(this.idprod).
    subscribe((data:any)=>{
      this.array=data.response;
    },(err)=>{
      console.log(err);
    })
  }

}
