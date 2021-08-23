import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormService } from 'src/app/services/form.service';
import { MatprimService } from 'src/app/services/matprim.service';
import { AltaMp } from './altamp.interface';
import { AltampService } from '../../services/altamp.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
declare let alertify: any;

@Component({
  selector: 'app-altamp',
  templateUrl: './altamp.component.html',
  styles: []
})
export class AltampComponent implements OnInit, OnDestroy {
  public user_role: string;
  mp: Subscription;

  id: number;
  descripcion: string;
  tipo: string;
  ubicacion: string;
  riesgo: string;
  proteccion: string;
  precio: number;
  pesoespecifico = 0;
  ppp = 0;
  ppv = 0;
  resina = 0;
  pigmento = 0;
  solvente = 100;
  stock = 0;
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
  editar = false;
  descripcion1: string;
  termino1: number;
  termino2: string;
  termino3: string;
  arrayBusqueda = [];
  fechaultimarecepcion: string;

  constructor(private http: HttpClient,
    private service: FormService,
    private servicioMp: MatprimService,
    private altampService: AltampService, private route: Router) {
    let user_role = localStorage.getItem("user_role");
    if (user_role != "ADMIN_ROL" && user_role != "LABORATORIO") {
      alert("Acceso no autorizado !")
      route.navigate(['inicio'])
    }
  }

  ngOnInit(): void {
    this.user_role = localStorage.getItem("user_role")
  }


  buscarMp() {
    this.servicioMp.buscar(this.termino1, this.termino2, this.termino3).
      subscribe((data: any) => {
        this.arrayBusqueda = data.response;
      }, (err) => {
        console.log(err);
      })
  }

  seleccionarId(id) {
    this.id = id;
    this.validarMp();
  }

  validarMp() {

    this.servicioMp.validarMp(this.id).
      subscribe((data: any) => {
        let dato: AltaMp = data.response;
        Swal.fire({
          title: "MATERIA PRIMA existente",
          text: "¿ Desea editar la materia prima ?",
          cancelButtonColor: "red",
          confirmButtonColor: "green",
          confirmButtonText: "SI",
          cancelButtonText: "NO",
          showCancelButton: true,
          icon: "question",
        }).then((res) => {
          if (res.value) {
            this.fechaultimarecepcion = dato.fechaultimarecepcion;
            this.descripcion = dato.descripcion;
            this.tipo = dato.tipo;
            this.ubicacion = dato.ubicacion;
            this.riesgo = dato.riesgo;
            this.proteccion = dato.proteccion;
            this.precio = dato.precio;
            this.pesoespecifico = dato.pesoespecifico;
            this.ppp = dato.solidosppp;
            this.ppv = dato.solidosppv;
            this.resina = dato.resina;
            this.pigmento = dato.pigmento;
            this.solvente = dato.solvente;
            this.stock = dato.stock;
            this.stockminimo = dato.stockminimo;
            this.unidadmedidacompra = dato.unidadmedidacompra;
            this.codpt = dato.codpt;
            this.condaprob1 = dato.condaprob1;
            this.condaprob2 = dato.condaprob2;
            this.condaprob3 = dato.condaprob3;
            this.condaprob4 = dato.condaprob4;
            this.info1 = dato.info1;
            this.info2 = dato.info2;
            this.info3 = dato.info3;
            this.cobarras = dato.cobarras;
            this.editar = true;
            document.getElementById("id").setAttribute("disabled", "");
            this.validarIdProd();
          } else {
            this.id = null;
          }
        })

      }, (err) => {
        alertify.success(err.error.message);

        if (err.error.response) {
          let dato: AltaMp = err.error.response;
          Swal.fire({
            title: "MATERIA PRIMA EXISTENTE",
            text: "¿ Desea editar la materia prima ?",
            cancelButtonColor: "red",
            confirmButtonColor: "green",
            confirmButtonText: "SI",
            cancelButtonText: "NO",
            showCancelButton: true,
            icon: "question",
          }).then((res) => {
            if (res.value) {
              this.fechaultimarecepcion = dato.fechaultimarecepcion;
              this.descripcion = dato.descripcion;
              this.tipo = dato.tipo;
              this.ubicacion = dato.ubicacion;
              this.riesgo = dato.riesgo;
              this.proteccion = dato.proteccion;
              this.precio = dato.precio;
              this.pesoespecifico = dato.pesoespecifico;
              this.ppp = dato.solidosppp;
              this.ppv = dato.solidosppv;
              this.resina = dato.resina;
              this.pigmento = dato.pigmento;
              this.solvente = dato.solvente;
              this.stock = dato.stock;
              this.stockminimo = dato.stockminimo;
              this.unidadmedidacompra = dato.unidadmedidacompra;
              this.codpt = dato.codpt;
              this.condaprob1 = dato.condaprob1;
              this.condaprob2 = dato.condaprob2;
              this.condaprob3 = dato.condaprob3;
              this.condaprob4 = dato.condaprob4;
              this.info1 = dato.info1;
              this.info2 = dato.info2;
              this.info3 = dato.info3;
              this.cobarras = dato.cobarras;
              this.editar = true;
              document.getElementById("id").setAttribute("disabled", "");
              this.validarIdProd();
            } else {
              this.id = null;
            }
          })

        }

      })
  }

  validarIdProd() {
    if (this.codpt == 0) {
      return alertify.success("¡ CODIGO DE SEMIELABORADO CORRECTO !")
    }
    if (this.codpt < 70000 || this.codpt > 90000) {
      this.codpt = null
      return alertify.error("EL CODIGO DE SEMIELABORADO DEBE SER ENTRE 70000 Y 90000")
    }
    this.service.validarIdProd(this.codpt).
      subscribe((data: any) => {
        if (data.desc) {
          this.descripcion1 = data.desc;
          return alertify.success("¡ CODIGO DE SEMIELABORADO CORRECTO !")
        } else {
          this.codpt = null
          return alertify.error("¡ NO EXISTE ESE CODIGO DE SEMIELABORADO !")
        }
      })
  }

  calcular() {
    if (this.resina != 0 && this.pigmento != 0) {
      this.resina = 0;
      this.pigmento = 0;
      this.solvente = 100;
      return alertify.error("¡ NO SE PUEDE CARGAR RESINA Y PIGMENTO AL MISMO TIEMPO !")
    }
    this.solvente = 100 - this.resina - this.pigmento;
  }

  finalizar() {
    if (this.id % 2 != 0 || this.id % 5 != 0 || this.id == null) {
      return alertify.error("¡ EL CODIGO DE MATERIA PRIMA ES INVÁLIDO !")
    }
    if (this.descripcion == null) {
      return alertify.error("¡ LA DESCRIPCIÓN ES INVÁLIDA !")
    }
    if (this.tipo == null) {
      return alertify.error("¡ LA TIPO DE PRODUCTO ES INVÁLIDO !")
    }
    if (this.unidadmedidacompra == null) {
      return alertify.error("¡ INGRESE UNIDAD DE MEDIDA CORRECTA !")
    }
    if (this.resina != 0 && this.pigmento != 0) {
      return alertify.error("¡ NO SE PUEDE CARGAR RESINA Y PIGMENTO AL MISMO TIEMPO !")
    }
    if (!this.stockminimo) {
      this.stockminimo = 0;
    }
    if (!this.pesoespecifico) {
      this.pesoespecifico = 0;
    }
    if (!this.ppp) {
      this.ppp = 0;
    }
    if (!this.ppv) {
      this.ppv = 0;
    }
    if (!this.resina) {
      this.resina = 0;
    }
    if (!this.pigmento) {
      this.pigmento = 0;
    }
    if (this.descripcion.trim() == "") {
      return alertify.error("¡ LA DESCRIPCION ES INVÁLIDA !")
    }

    this.condaprob1 = this.condaprob1 ? this.condaprob1.toUpperCase() : this.condaprob1;
    this.condaprob2 = this.condaprob2 ? this.condaprob2.toUpperCase() : this.condaprob2;
    this.condaprob3 = this.condaprob3 ? this.condaprob3.toUpperCase() : this.condaprob3;
    this.condaprob4 = this.condaprob4 ? this.condaprob4.toUpperCase() : this.condaprob4;
    this.info1 = this.info1 ? this.info1.toUpperCase() : this.info1;
    this.info2 = this.info2 ? this.info2.toUpperCase() : this.info2;
    this.info3 = this.info3 ? this.info3.toUpperCase() : this.info3;
    this.proteccion = this.proteccion ? this.proteccion.toUpperCase() : this.proteccion;
    let data = {
      id: this.id, descripcion: this.descripcion.toUpperCase(), tipo: this.tipo, riesgo: this.riesgo, proteccion: this.proteccion, precio: this.precio, pesoespecifico: this.pesoespecifico, ubicacion: this.ubicacion,
      solidosppp: this.ppp, solidosppv: this.ppv, resina: this.resina, pigmento: this.pigmento, solvente: this.solvente, stock: this.stock, stockminimo: this.stockminimo,
      unidadmedidacompra: this.unidadmedidacompra, codpt: this.codpt, condaprob1: this.condaprob1, condaprob2: this.condaprob2, condaprob3: this.condaprob3,
      condaprob4: this.condaprob4, info1: this.info1, info2: this.info2, info3: this.info3, cobarras: this.cobarras
    }
    Swal.showLoading();
    if (!this.editar) {
      this.mp = this.altampService.postMp(data).subscribe((data: any) => {
        Swal.close();
        this.resetear();
        this.editar = false;
        return alertify.success("¡ Materia Prima cargada correctamente !");
      }, (err) => {
        console.log(err);
      })
    } else {
      this.mp = this.altampService.putMp(data).
        subscribe((data: any) => {
          Swal.close();
          this.resetear();
          this.editar = false;
          return alertify.success("¡ Materia Prima cargada correctamente !");
        }, (err) => {
          console.log(err);
        })
    }
  }

  cancelar() {
    Swal.fire({
      title: "CANCELAR",
      text: "¿ Está seguro que desea cancelar la carga/modificación ?",
      cancelButtonColor: "red",
      confirmButtonColor: "green",
      confirmButtonText: "SI",
      cancelButtonText: "NO",
      showCancelButton: true,
      allowEnterKey: false,
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
    this.id = null;
    this.descripcion1 = null;
    this.descripcion = datos; this.tipo = datos; this.ubicacion = datos; this.riesgo = datos; this.proteccion = datos; this.precio = datos;
    this.pesoespecifico = 0; this.ppp = 0; this.ppv = 0; this.resina = 0; this.pigmento = 0; this.solvente = 0; this.fechaultimarecepcion = datos;
    this.stock = 0; this.stockminimo = datos; this.unidadmedidacompra = datos; this.codpt = datos; this.condaprob1 = datos; this.condaprob2 = datos;
    this.condaprob3 = datos; this.condaprob4 = datos; this.info1 = datos; this.info2 = datos; this.info3 = datos; this.cobarras = datos;
    this.termino1 = null;
    this.termino2 = null;
    this.arrayBusqueda = [];
    let id = document.getElementById("id");
    id.removeAttribute("disabled");
  }

  resetearBusqueda() {
    this.termino1 = null;
    this.termino2 = null;
    this.arrayBusqueda = [];
  }

  validarSolidos() {
    if (this.ppp > 100) {
      this.ppp = 0;
      return alertify.error("¡ SOLIDOS PPP NO PUEDE SER MAYOR A 100 !");
    }
    if (this.ppv > 100) {
      this.ppv = 0;
      return alertify.error("¡ SOLIDOS PPV NO PUEDE SER MAYOR A 100 !");
    }
    if (this.resina > 100) {
      this.resina = 0;
      return alertify.error("¡ % RESINA NO PUEDE SER MAYOR A 100 !");
    }
    if (this.pigmento > 100) {
      this.pigmento = 0;
      return alertify.error("¡ % PIGMENTO PPV NO PUEDE SER MAYOR A 100 !");
    }
  }

  ngOnDestroy() {
  }

}
