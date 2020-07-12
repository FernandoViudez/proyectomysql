import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-listprod',
  templateUrl: './listprod.component.html',
  styles: []
})
export class ListprodComponent implements OnInit {

  id: number;
  array = [];
  pesoespecifico = 0;
  viscosidadspindle = 0;
  viscosidaduk = 0;
  spindlenumero = 0;
  molienda = 0;
  brillo = 0;
  solidosppp = 0;
  solidosppv = 0;
  resina = 0;
  pigmento = 0;
  solvente = 0;
  precio = 0;

  descripcion: string;
  color: string;
  componente: string;


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  resetear() {
    this.id=null;
    this.pesoespecifico = null;
    this.viscosidadspindle = null;
    this.viscosidaduk = null;
    this.spindlenumero = null;
    this.molienda = null;
    this.brillo = null;
    this.solidosppp = null;
    this.solidosppv = null;
    this.resina = null;
    this.pigmento = null;
    this.solvente = null;
    this.precio = null;
  }

  resetearBusqueda() {
    this.id=1
    this.descripcion = "";
    this.color = "";
    this.componente = "";
    this.array=[];
    this.resetear();
  }

  imprimirBusqueda(){
    window.print();
  }

  buscar() {
    this.http.post("http://localhost:8080/api/buscarPt", { id: this.id, termino1: this.descripcion, termino2: this.color, termino3: this.componente }).subscribe((data: any) => {
      this.pesoespecifico = 0;
      this.solidosppp = 0;
      this.solidosppv = 0;
      this.resina = 0;
      this.pigmento = 0;
      this.solvente = 0;
      this.precio = 0;
      this.viscosidadspindle = 0;
      this.viscosidaduk = 0;
      this.spindlenumero = 0;
      this.molienda = 0;
      this.brillo = 0;
      if (data.message) {
        this.array = []
        return;
      }
      if (data.response.length == 1) {
        let datos = data.response[0];
        this.pesoespecifico = datos.pesoespecifico;
        this.solidosppp = datos.solidosppp;
        this.solidosppv = datos.solidosppv;
        this.resina = datos.resina;
        this.pigmento = datos.pigmento;
        this.solvente = datos.solvente;
        this.precio = datos.precio;
        this.viscosidadspindle = datos.viscosidadspindle;
        this.viscosidaduk = datos.viscosidaduk;
        this.spindlenumero = datos.spindlenumero;
        this.molienda = datos.molienda;
        this.brillo = datos.brillo;
      }
      this.array = data.response;
    }, (err) => {
      console.log(err);
    })
  }

  traerDf(id) {
    this.http.get(`http://localhost:8080/api/ptDf/${id}`).
      subscribe((data: any) => {
        this.pesoespecifico = data.dfpe;
        this.solidosppp = data.dfppp;
        this.solidosppv = data.dfppv;
        this.resina = data.dfre;
        this.pigmento = data.dfpi;
        this.solvente = data.dfso;
        this.viscosidadspindle = data.vspin;
        this.viscosidaduk = data.vuk;
        this.spindlenumero = data.spnd;
        this.molienda = data.mol;
        this.brillo = data.br;
        this.precio = data.pr;
      }, (err) => {
        console.log(err);
      })
  }


}
