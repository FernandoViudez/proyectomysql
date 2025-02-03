import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { obtenerPath } from 'src/app/_utils/generarBackPath';
import { GenericService } from 'src/app/services/generic.service';
import { ListadosService } from '../listados/listados.service';

interface onExcelDTO {
  ok: boolean;
  message: string;
  url: string;
}

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
  info3 = 0;
  info2 = 0;
  renglones = 100;  // pongo como default 100 lineas, pero si quieren imprimir todas que lo cambien a mano

  descripcion: string;
  color: string;
  componente: string;
  user_role: string;
  modifico: string;

  constructor(private http: HttpClient,
    private readonly genericService : GenericService,
    private readonly listadosService: ListadosService) { }

  ngOnInit(): void {
    this.user_role = localStorage.getItem("user_role")
  }

  resetearBusqueda() {
    this.id = 1
    this.descripcion = "";
    this.color = "";
    this.componente = "";
    this.array = [];
    this.id = null;
    this.pesoespecifico = null;
    this.viscosidadspindle = 0;
    this.viscosidaduk = 0;
    this.spindlenumero = 0;
    this.molienda = 0;
    this.brillo = 0;
    this.solidosppp = null;
    this.solidosppv = null;
    this.resina = null;
    this.pigmento = null;
    this.solvente = null;
    this.precio = null;
    this.modifico = null;
    this.info3 = null;
    this.info2 = null;
    this.renglones = 100;
  }

  imprimirBusqueda() {
    window.print();
  }

  buscar() {
    this.http.post(`${obtenerPath()}buscarPt`, {
      id: this.id, termino1: this.descripcion, termino2: this.color,
      termino3: this.componente, renglones: this.renglones,
    }).subscribe((data: any) => {
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
      this.info3 = 0;
      this.info2 = 0;
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
        this.modifico = datos.modifico;
        this.info3 = datos.info3;
        this.info2 = datos.info2;
      }
      this.array = data.response;
    }, (err) => {
      console.log(err);
    })
  }

  traerDf(id) {
    this.http.get(`${obtenerPath()}ptDf/${id}`).
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
        this.info3 = data.dpvc;
        this.info2 = data.voc;
      }, (err) => {
        console.log(err);
      })
  }

  onExcel() {
    this.listadosService.generarExcel(this.array,
      'Listados_Productos', 'Hoja1', [
        "id",
        "descripcion",
        "color",
        "colorigual",
        "componente",
        "pesoespecifico",
        "formaconjunto",
        "relaciondemezcla",
        "fechaultimaelaboracion",
        "ultimamodificacion",
        "modifico",
        "unidadmedida",
        "stock",
        "solidosppp",
        "solidosppv",
        "resina",
        "pigmento",
        "precio",
        "ultimocalculo",
    ])
      .subscribe((data: onExcelDTO) => {
        this.genericService.downloadExcel(data.url);
      })
  }

}
