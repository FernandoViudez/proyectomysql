import { Component, OnInit } from '@angular/core';
import { MatprimService } from 'src/app/services/matprim.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
declare let alertify: any;

@Component({
  selector: 'app-listmp',
  templateUrl: './listmp.component.html',
  styles: []
})
export class ListmpComponent implements OnInit {
  array = [];
  id: number;
  descripcion: string;
  tipo: string;
  ubicacion: string;
  riesgo: string;
  proteccion: string;
  precio = 0;
  pesoespecifico = 0;
  ppp = 0;
  ppv = 0;
  resina = 0;
  pigmento = 0;
  solvente = 100;
  stock: number;
  stockminimo: number;
  unidadmedidacompra: string;
  codpt: number;
  condaprob1: string;
  condaprob2: string;
  condaprob3: string;
  condaprob4: string;
  info1: string;
  info2: string;
  info3: string;
  cobarras: number;
  dfpe: number;
  dfppp: number;
  dfppv: number;
  dfre: number;
  dfpi: number;
  dfso: number;
  descripcion1: string;

  constructor(private servicioMp: MatprimService, private http: HttpClient) { }

  ngOnInit(): void {
    this.servicioMp.traer().
      subscribe((data: any) => {
        this.array = data.response;
      })
  }

  resetear() {
    let datos = null
    this.id = datos;
    this.descripcion = datos; this.tipo = datos; this.ubicacion = datos; this.riesgo = datos; this.proteccion = datos; this.precio = 0;
    this.pesoespecifico = 0; this.ppp = 0; this.ppv = 0; this.resina = 0; this.pigmento = 0; this.solvente = 0;
    this.stock = datos; this.stockminimo = datos; this.unidadmedidacompra = datos; this.codpt = datos; this.condaprob1 = datos; this.condaprob2 = datos;
    this.condaprob3 = datos; this.condaprob4 = datos; this.info1 = datos; this.info2 = datos; this.info3 = datos; this.cobarras = datos;
  }

  resetearBusqueda() {
    this.resetear();
    this.ngOnInit()
  }

  buscar() {
    this.servicioMp.buscar(this.id, this.descripcion).subscribe((data: any) => {
      this.pesoespecifico = 0;
      this.ppp = 0;
      this.ppv = 0;
      this.resina = 0;
      this.pigmento = 0;
      this.solvente = 0;
      this.precio = 0;
      if (data.message) {
        this.array = []
        return;
      }
      if (data.response.length == 1) {
        let datos = data.response[0];
        this.pesoespecifico = datos.pesoespecifico;
        this.ppp = datos.solidosppp;
        this.ppv = datos.solidosppv;
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

  traerFisicos(id) {
    this.servicioMp.validarMp(id).
      subscribe((dato: any) => {
        console.log(dato);
        let data= dato.response;
        this.pesoespecifico = data.pesoespecifico;
        this.ppp = data.solidosppp;
        this.ppv = data.solidosppv;
        this.resina = data.resina;
        this.pigmento = data.pigmento;
        this.solvente = data.solvente;
      })
  }


}
