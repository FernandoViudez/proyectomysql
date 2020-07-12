import { Component, OnInit } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
declare let alertify: any;

@Component({
  selector: 'app-listform',
  templateUrl: './listform.component.html',
  styles: []
})
export class ListformComponent implements OnInit {

  idprod: string;
  descripcion1: string;
  tintoformoalt: string;
  array = [];
  sumaTot: number;
  pesoespecifico = 0;
  solidosppp = 0;
  solidosppv = 0;
  resina = 0;
  pigmento = 0;
  solvente = 0;
  precio = 0;
  idbus: number;
  termino1: string;
  termino2: string;
  termino3: string;
  arrayBusqueda = [];

  constructor(private service: FormService) { }

  ngOnInit(): void {
  }


  buscar() {
    this.service.buscar(this.idprod, this.tintoformoalt).subscribe((data: any) => {
      this.sumaTot = 0;
      this.pesoespecifico = 0;
      this.solidosppp = 0;
      this.solidosppv = 0;
      this.resina = 0;
      this.pigmento = 0;
      this.solvente = 0;
      this.precio = 0;
      if (data.message) {
        this.array = []
        return;
      }

      if (this.idprod && this.tintoformoalt) {
        for (let item of data.response) {
          this.sumaTot += item.cantidad;
        }
        let datos = data.response2[0];
        this.pesoespecifico = datos.pesoespecifico;
        this.solidosppp = datos.solidosppp;
        this.solidosppv = datos.solidosppv;
        this.resina = datos.resina;
        this.pigmento = datos.pigmento;
        this.solvente = datos.solvente;
        this.precio = datos.precio;
      }
      this.array = data.response;
    }, (err) => {
      console.log(err);
    })
  }

  validarId() {
    this.service.validarIdProd(this.idprod).
      subscribe((data: any) => {
        alertify.success("ESTE PRODUCTO TERMINADO EXISTE, SIGUE ADELANTE !")
        this.descripcion1 = `${data.desc}  ${data.color}  ${data.componente}`;
      }, (err) => {
        if (err.error.response) {
          let data=err.error.response;
          alertify.success("ESTE PRODUCTO TERMINADO EXISTE, SIGUE ADELANTE !")
          this.descripcion1 = `${data.descripcion}  ${data.color}  ${data.componente}`;
        } else {
          alertify.error("NO EXISTE ESTE PRODUCTO TERMINADO !")
          return this.resetear1();
        }
      })
  }

  resetear() {
    this.termino1 = null;
    this.termino2 = null;
    this.termino3 = null;
    this.ngOnInit()
  }

  resetear1() {
    this.tintoformoalt = null;
    this.idprod = null;
    this.pesoespecifico = null;
    this.solidosppp = null;
    this.solidosppv = null;
    this.resina = null;
    this.pigmento = null;
    this.solvente = null;
    this.precio = null;
    this.descripcion1 = null;

  }

  buscarP() {
    this.service.buscarP(this.idbus, this.termino1, this.termino2, this.termino3).
      subscribe((data: any) => {
        this.arrayBusqueda = data;
      }, (err) => {
        console.log(err);
      })
  }

  seleccionarIdPt(id) {
    this.idprod = id;
    this.validarId()
  }

  resetearBusqueda() {
    this.arrayBusqueda = [];
    this.array=[];
    this.resetear1();
    this.resetear();
    this.ngOnInit()
  }

  imprimirBusqueda(){
    window.print();
  }

}
