import { Component, OnInit } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/services/env.service';
import { Router } from '@angular/router';
import { obtenerPath } from 'src/app/_utils/generarBackPath';
declare let alertify: any;

@Component({
  selector: 'app-altaprod',
  templateUrl: './altaprod.component.html',
  styles: []
})
export class AltaprodComponent implements OnInit {
  public user_role: string;
  id: number;
  descripcion: string;
  color: string;
  colorigual: string;
  componente: string;
  formaconjunto: number;
  relaciondemezcla: string;
  tipogenerico: string;
  unidadmedida: string;
  pesoespecifico = 0;
  viscosidadspindle: string;
  viscosidaduk: string;
  spindlenumero: string;
  molienda: string;
  brillo: string;
  solidosppp = 0;
  solidosppv = 0;
  resina = 0;
  pigmento = 0;
  solvente = 0;
  fechaultimaelaboracion: Date;
  precio: number;
  ultimamodificacion: Date;
  info1: string;
  info2: string;
  info3: string;
  descripForma: string;
  arraypt = [];
  idbus: number;
  termino1: string;
  termino2: string;
  termino3: string;
  stock: number;

  editar = false;

  constructor(private service: FormService, private http: HttpClient, private service1: EnvService, private route: Router) { 
    let user_role = localStorage.getItem("user_role");
    if (user_role != "ADMIN_ROL" && user_role != "LABORATORIO") {
      alert("Acceso no autorizado !")
      route.navigate(['inicio'])
    }
   }

  ngOnInit(): void {
    this.user_role = localStorage.getItem("user_role")
  }

  buscarP() {
    this.service1.buscarpt(this.idbus, this.termino1, this.termino2, this.termino3).subscribe((data: any) => {
      this.arraypt = data.response;
    }, (err) => {
      console.log(err)
      return;
    })
  }

  seleccionarIdPt(id: number) {
    this.id = id
    this.validarPt();
  }

  validarPt() {
    this.service.validarIdProd(this.id).
      subscribe((data: any) => {
        Swal.fire({
          title: "PRODUCTO TERMINADO existente",
          text: "¿ Desea editar el Producto Terminado ?",
          cancelButtonColor: "red",
          confirmButtonColor: "green",
          confirmButtonText: "SI",
          cancelButtonText: "NO",
          showCancelButton: true,
          icon: "question"
        }).then(res => {
          if (res.value) {
            let datos = data.response[0];
            this.id = datos.id;
            this.descripcion = datos.descripcion;
            this.color = datos.color;
            this.colorigual = datos.colorigual;
            this.componente = datos.componente;
            this.formaconjunto = datos.formaconjunto;
            this.relaciondemezcla = datos.relaciondemezcla;
            this.tipogenerico = datos.tipogenerico;
            this.unidadmedida = datos.unidadmedida;
            this.pesoespecifico = datos.pesoespecifico;
            this.viscosidadspindle = datos.viscosidadspindle;
            this.viscosidaduk = datos.viscosidaduk;
            this.spindlenumero = datos.spindlenumero;
            this.molienda = datos.molienda;
            this.brillo = datos.brillo;
            this.solidosppp = datos.solidosppp;
            this.solidosppv = datos.solidosppv;
            this.resina = datos.resina;
            this.pigmento = datos.pigmento;
            this.solvente = datos.solvente;
            this.fechaultimaelaboracion = datos.fechaultimaelaboracion;
            this.precio = datos.precio;
            this.ultimamodificacion = datos.ultimamodificacion;
            this.info1 = datos.info1;
            this.info2 = datos.info2;
            this.info3 = datos.info3;
            this.stock = datos.stock;
            if (this.id >= 70000) {
              document.getElementById("stock").removeAttribute("disabled");
            } else {
              document.getElementById("stock").setAttribute("disabled", "");
            }
            let id = document.getElementById("id");
            id.setAttribute("disabled", "");
            this.editar = true;
          } else {
            this.id = null;
          }
        })
      }, (err) => {
        if (err.error.response) {
          Swal.fire({
            title: "P.T. existente",
            text: "¿ Desea editar el Producto Terminado ?",
            cancelButtonColor: "red",
            confirmButtonColor: "green",
            confirmButtonText: "SI",
            cancelButtonText: "NO",
            showCancelButton: true,
            icon: "question"
          }).then(res => {
            if (res.value) {
              let datos = err.error.response;
              this.id = datos.id;
              this.descripcion = datos.descripcion;
              this.color = datos.color;
              this.colorigual = datos.colorigual;
              this.componente = datos.componente;
              this.formaconjunto = datos.formaconjunto;
              this.relaciondemezcla = datos.relaciondemezcla;
              this.tipogenerico = datos.tipogenerico;
              this.unidadmedida = datos.unidadmedida;
              this.pesoespecifico = datos.pesoespecifico;
              this.viscosidadspindle = datos.viscosidadspindle;
              this.viscosidaduk = datos.viscosidaduk;
              this.spindlenumero = datos.spindlenumero;
              this.molienda = datos.molienda;
              this.brillo = datos.brillo;
              this.solidosppp = datos.solidosppp;
              this.solidosppv = datos.solidosppv;
              this.resina = datos.resina;
              this.pigmento = datos.pigmento;
              this.solvente = datos.solvente;
              this.fechaultimaelaboracion = datos.fechaultimaelaboracion;
              this.precio = datos.precio;
              this.ultimamodificacion = datos.ultimamodificacion;
              this.info1 = datos.info1;
              this.info2 = datos.info2;
              this.info3 = datos.info3;
              this.stock = datos.stock;
              if (this.id >= 70000) {
                document.getElementById("stock").removeAttribute("disabled");
              } else {
                document.getElementById("stock").setAttribute("disabled", "");
              }
              let id = document.getElementById("id");
              id.setAttribute("disabled", "");
              this.editar = true;
            } else {
              this.id = null;
            }
          })
        } else {
          alertify.success(err.error.message);
        }
      })
  }

  validarForma() {
    this.service.validarIdProd(this.formaconjunto).
      subscribe((data: any) => {

        if (this.componente == "RESINA" && data.componente != "ENDURECEDOR") {
          this.formaconjunto = null;
          this.descripForma = null;
          return alertify.error("RESINA SOLO CON ENDURECEDOR!!");
        }
        if (this.componente == "LIQUIDO" && data.componente != "POLVO") {
          this.formaconjunto = null;
          this.descripForma = null;
          return alertify.error("LIQUIDO SOLO CON POLVO!!");
        }
        if (this.componente == "ENDURECEDOR" && data.componente != "INERTES" && data.componente != "POLVO") {
          this.formaconjunto = null;
          this.descripForma = null;
          return alertify.error("ENDURECEDOR SOLO CON INERTES O POLVO!!");
        }
        if (
          this.componente == "DILUYENTE"
          || this.componente == "SEMIELABORADO"
          || this.componente == "MONOCOMPONENTE"
          || this.componente == "AGENTE DE CURA"
          || this.componente == "INERTES"
          || this.componente == "POLVO" &&
          data.componente) {
          this.formaconjunto = null;
          this.descripForma = null;
          return alertify.error("NO SE PUEDE FORMAR CONJUNTO!!");
        }

        this.descripForma = `${data.desc} - ${data.componente}`;
        return alertify.success("EL CODIGO DE CONJUNTO EXISTE!");

      }, (err) => {
        if (err.error.response) {

          return alertify.error("¡ ATENCION !, EL CONJUNTO SOLICITADO TIENE PESO ESPECIFICO = 0");
        } else {
          this.formaconjunto = null;
          this.descripForma = null;
          return alertify.error(" NO EXISTE CONJUNTO !");
        }
      })
  }

  finalizar() {
    if (!this.id) {
      return alertify.error("Ingrese un id valido !");
    }
    if (!this.descripcion) {
      return alertify.error("Ingrese una descripción valida !");
    }
    if (!this.componente) {
      return alertify.error("Ingrese un componente valido !");
    }
    if (!this.unidadmedida) {
      return alertify.error("Ingrese una Unidad de Medida valida !");
    }
    if (this.descripcion.trim() == "") {
      return alertify.error("LA DESCRIPCION ES INVÁLIDA !")
    }
    if (this.formaconjunto == this.id) {
      return alertify.error("¡ ATENCION !, CODIGO DEL CONJUNTO ES IDÉNTICO AL CODIGO DEL PRODUCTO")
    }
    this.descripcion = this.descripcion ? this.descripcion.toUpperCase() : this.descripcion;
    this.color = this.color ? this.color.toUpperCase() : this.color;
    this.colorigual = this.colorigual ? this.colorigual.toUpperCase() : this.colorigual;
    this.relaciondemezcla = this.relaciondemezcla ? this.relaciondemezcla.toUpperCase() : this.relaciondemezcla;
    this.tipogenerico = this.tipogenerico ? this.tipogenerico.toUpperCase() : this.tipogenerico;
    this.viscosidadspindle = this.viscosidadspindle ? this.viscosidadspindle.toUpperCase() : this.viscosidadspindle;
    this.viscosidaduk = this.viscosidaduk ? this.viscosidaduk.toUpperCase() : this.viscosidaduk;
    this.spindlenumero = this.spindlenumero ? this.spindlenumero.toUpperCase() : this.spindlenumero;
    this.molienda = this.molienda ? this.molienda.toUpperCase() : this.molienda;
    this.brillo = this.brillo ? this.brillo.toUpperCase() : this.brillo;
    this.info1 = this.info1 ? this.info1.toUpperCase() : this.info1;
    this.info2 = this.info2 ? this.info2.toUpperCase() : this.info2;
    this.info3 = this.info3 ? this.info3.toUpperCase() : this.info3;

    Swal.showLoading()
    let data = {
      id: this.id, descripcion: this.descripcion, color: this.color, colorigual: this.colorigual, componente: this.componente, formaconjunto: this.formaconjunto,
      relaciondemezcla: this.relaciondemezcla, tipogenerico: this.tipogenerico, unidadmedida: this.unidadmedida,
      viscosidadspindle: this.viscosidadspindle, viscosidaduk: this.viscosidaduk, molienda: this.molienda, brillo: this.brillo,
      precio: this.precio, info1: this.info1, info2: this.info2, info3: this.info3, spindlenumero: this.spindlenumero, stock: this.stock
    }

    if (!this.editar) {
      this.http.post(`${obtenerPath()}postPt`, data).
        subscribe((data: any) => {
          Swal.close();
          this.resetear();
          this.editar = false;
          return alertify.success("¡ El producto ha sido cargado correctamente !");
        }, (err) => {
          console.log(err);
        })
    } else {
      this.http.put(`${obtenerPath()}putPt/${this.id}`, data).
        subscribe((data: any) => {
          Swal.close();
          this.resetear();
          this.editar = false;
          return alertify.success("¡ El producto ha sido modificado correctamente !");
        }, (err) => {
          console.log(err);
        })
    }
  }

  cancelar() {
    Swal.fire({
      title: "Cancelar Operación",
      text: "¿ Está seguro que desea cancelar la operación ?",
      cancelButtonColor: "red",
      confirmButtonColor: "green",
      confirmButtonText: "SI",
      cancelButtonText: "NO",
      showCancelButton: true,
      icon: "question"
    }).then(res => {
      if (res.value) {
        this.resetear()
      } else {
        return;
      }
    })
  }

  resetear() {
    let datos = null
    this.id = datos;
    this.descripcion = datos;
    this.color = datos;
    this.colorigual = datos;
    this.componente = datos;
    this.formaconjunto = datos;
    this.relaciondemezcla = datos;
    this.tipogenerico = datos;
    this.unidadmedida = datos;
    this.pesoespecifico = 0;
    this.viscosidadspindle = datos;
    this.viscosidaduk = datos;
    this.spindlenumero = datos;
    this.molienda = datos;
    this.brillo = datos;
    this.solidosppp = 0;
    this.solidosppv = 0;
    this.resina = 0;
    this.pigmento = 0;
    this.solvente = 0;
    this.fechaultimaelaboracion = datos;
    this.precio = datos;
    this.ultimamodificacion = datos;
    this.info1 = datos;
    this.info2 = datos;
    this.info3 = datos;
    this.stock = datos;
    this.editar = false;
    this.arraypt = [];
    this.idbus = null;
    this.termino1 = null;
    this.termino2 = null;
    this.termino3 = null;
    this.descripForma = null;
    document.getElementById("id").removeAttribute("disabled");
    document.getElementById("stock").setAttribute("disabled", "");
  }

}
