import { Component, OnInit } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { Router } from '@angular/router';
import { GenericService } from 'src/app/services/generic.service';
import { ListadosService } from '../listados/listados.service';

declare let alertify: any;

interface onExcelDTO {
  ok: boolean;
  message: string;
  url: string;
}

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
  info3 = 0;  // para traer el dato del PVC
  info2 = 0   // para traer el dato del VOC
  ultimamodificacion: string;
  formaconjunto: string;
  relaciondemezcla: string;
  colorigual: string;
  viscosidadspindle: string;
  spindlenumero: string;
  viscosidaduk: string;
  molienda: string;
  brillo: string;
  idbus: number;
  termino1: string;
  termino2: string;
  termino3: string;
  arrayBusqueda = [];
  user_role: string;
  stock: number;
  pvc: number;
  voc: number;

  constructor(private service: FormService, private route: Router,
    private readonly genericService: GenericService,
    private readonly listadosService: ListadosService) {
    let user_role = localStorage.getItem("user_role");
    if (user_role != "ADMIN_ROL" && user_role != "LABORATORIO" && user_role != "ENCARGADO" ) {
      alert("Acceso no autorizado !")
      route.navigate(['inicio'])
    }
  }

  ngOnInit(): void {
    this.user_role = localStorage.getItem("user_role")
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
      this.info3 = 0;
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
        this.ultimamodificacion = datos.ultimamodificacion;
        this.formaconjunto = datos.formaconjunto;
        this.relaciondemezcla = datos.relaciondemezcla;
        this.colorigual = datos.colorigual;
        this.viscosidadspindle = datos.viscosidadspindle;
        this.spindlenumero = datos.spindlenumero;
        this.viscosidaduk = datos.viscosidaduk;
        this.molienda = datos.molienda;
        this.brillo = datos.brillo;
        this.pvc = datos.info3;
        this.voc = datos.info2;
      }
      this.array = data.response;
    }, (err) => {
      console.log(err);
    })
  }

  validarId() {
    this.service.validarIdProd(this.idprod).
      subscribe((data: any) => {
        alertify.success("ESTE PRODUCTO TERMINADO EXISTE... SIGUE ADELANTE !")
        if (data.color == null) {
          this.descripcion1 = `${data.desc}  ${data.componente}`;
        } else {
          this.descripcion1 = `${data.desc}  ${data.color}  ${data.componente}`;
        }

      }, (err) => {
        if (err.error.response) {
          let data = err.error.response;
          alertify.success("ESTE PRODUCTO TERMINADO EXISTE, SIGUE ADELANTE !")
          if (data.color == null) {
            this.descripcion1 = `${data.descripcion}  ${data.componente}`;
          } else {
            this.descripcion1 = `${data.descripcion}  ${data.color}  ${data.componente}`;
          }
        } else {
          alertify.error("NO EXISTE ESTE PRODUCTO TERMINADO !")
          return this.resetear1();
        }
      })
  }

  resetear() {
    this.idbus = null;
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
    this.pvc = null;
    this.voc = null;
    this.ultimamodificacion = null;
    this.formaconjunto = null;
    this.relaciondemezcla = null;
    this.colorigual = null;
    this.viscosidadspindle = null;
    this.spindlenumero = null;
    this.viscosidaduk = null;
    this.molienda = null;
    this.brillo = null;
    this.descripcion1 = null;
    this.sumaTot = null;
    this.stock = null;
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
    this.array = [];
    this.resetear1();
    this.resetear();
    this.ngOnInit()
  }

  imprimirBusqueda() {
    let user_role = localStorage.getItem("user_role");
    if (user_role != "ADMIN_ROL" && user_role != "LABORATORIO") {
      alert("No autorizado !")
    } else {
      window.print();
    }
  }

  onExcel() {
    this.listadosService.generarExcel(this.array,
      'Listados_Formulas', 'Hoja1', [
      "idprod",
      "tintoformoalt",
      "orden",
      "mpi",
      "codmp",
      "codpt",
      "descripcion",
      "cantidad",
      "stock"
    ])
      .subscribe((data: onExcelDTO) => {
        this.genericService.downloadExcel(data.url);
      })
  }

}
