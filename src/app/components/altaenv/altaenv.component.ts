import { Component, OnInit, OnDestroy } from '@angular/core';
import { EnvService } from 'src/app/services/env.service';
import Swal from 'sweetalert2';
import { subscribeOn } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MatprimService } from 'src/app/services/matprim.service';
import { Router } from '@angular/router';
declare let alertify: any;


@Component({
  selector: 'app-altaenv',
  templateUrl: './altaenv.component.html',
  styles: []
})
export class AltaenvComponent implements OnInit, OnDestroy {

  idbus: number
  array = [];
  arraypt = [];
  idprod: number;
  termino1: string;
  termino2: string;
  termino3: string;
  descripcion1: string;
  cobarras: string;
  descripcion: string;
  codmp: number;
  envasado: string;
  indice: number;

  constructor(private service: EnvService,
    private http: HttpClient,
    private servicioMp: MatprimService,
    private router: Router) {
    //let user_role = localStorage.getItem("user_role");
    //if (user_role != "ADMIN_ROL" && user_role != "LABORATORIO") {
    //  alert("Acceso no autorizado !")
    //  route.navigate(['inicio'])
    //}
  }

  ngOnInit(): void {
    this.service.traerTodo().subscribe((data: any) => {
      if (data.response.length !== 0) {
        Swal.fire({
          title: "Base de datos en uso!!",
          text: "La base de datos está siendo usada, vaya a tomar un mate y vuelva...",
          icon: "warning",
          allowEnterKey: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          confirmButtonColor: "green",
          confirmButtonText: "Presione aquí para Continuar"
        }).then(res => {
          if (res.value) {
            this.router.navigateByUrl("/app");
          }
        })
      }
    }, (err) => {
      console.log(err);
    })
  }

  ngOnDestroy(): void {
    this.eliminarTodo(true);
  }

  buscarP() {
    this.service.buscarpt(this.idbus, this.termino1, this.termino2, this.termino3).subscribe((data: any) => {
      this.arraypt = data.response;
    }, (err) => {
      return;
    })
  }

  seleccionarIdPt(id: number) {
    this.service.detectarIdPt(id).subscribe((data: any) => {
      document.getElementById("idp").setAttribute("disabled", "");
      this.idprod = id
      this.descripcion1 = `${data.desc} ${data.color} ${data.componente}`;
      this.detectarId()
    }, (err) => {
      if (err.error.response) {
        document.getElementById("idp").setAttribute("disabled", "");
        let data=err.error.response;
        this.idprod = id
        this.descripcion1 = `${data.descripcion} ${data.color} ${data.componente}`;
        this.detectarId()
      }else{
        this.resetear();
        this.resetear1();
        return alertify.error("No existe ese envasado!!");
      }
    })
  }

  resetear1() {
    document.getElementById("idp").removeAttribute("disabled");
    this.idprod = null;
    this.descripcion1 = null;
  }

  resetear() {
    this.termino1 = null;
    this.termino2 = null;
    this.termino3 = null;
    this.cobarras = null;
    this.descripcion = null;
    this.codmp = null;
    this.envasado = null;
  }

  validarmp() {
    this.servicioMp.validarMp(this.codmp).subscribe((data: any) => {
      this.descripcion = data.response.descripcion;
    }, (err) => {
      if (err.error.response) {
        this.descripcion = err.error.response.descripcion;
      } else {
        this.codmp = null;
        return alertify.error("No exite esa materia prima");
      }
    })

  }

  cargar() {
    if (this.idprod == null) {
      return alertify.error("¡ INGRESE UN CODIGO DE ENVASE !")
    }
    if (this.codmp < 39000) {
      return alertify.error("¡ INGRESE UN CODIGO VALIDO !")
    }
    if (this.descripcion == null) {
      return alertify.error("¡ INGRESE UNA DESCRIPCION VALIDA !")
    }
    if (this.envasado == null) {
      return alertify.error("¡ INGRESE UN ENVASAMIENTO VALIDO !")
    }
    this.service.cargar(this.idprod, this.descripcion, this.codmp, this.envasado)
      .subscribe((data: any) => {
        this.array = data.response;
        alertify.success("¡RENGLON AGREGADO!")
        this.resetear()
      })
  }

  eliminarTodo(destroy) {
    if (destroy) {
      return this.service.eliminarTodo(this.idprod).subscribe((data: any) => {
        alertify.success("HAS BORRADO TODAS LAS FILAS CON EXITO");
        this.resetear();
        this.resetear1()
        this.array = data.response;
      }, (err) => {
        console.log(err);
      })
    }
    Swal.fire({
      title: "¿ DESEA BORRAR TODO LO CARGADO ?",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "CANCELAR",
      confirmButtonText: "BORRAR",
      confirmButtonColor: "green",
      cancelButtonColor: "red"
    }).then(res => {
      if (!res.value) {
        return;
      }
      this.service.eliminarTodo(this.idprod).subscribe((data: any) => {
        alertify.success("HAS BORRADO TODAS LAS FILAS CON EXITO");
        this.resetear();
        this.resetear1();
        this.array = [];
      }, (err) => {
        console.log(err);
      })
    })

  }

  finalizar() {
    if (this.idprod == null) {
      return alertify.error("¡ INGRESE UN CODIGO DE ENVASE !")
    }
    Swal.showLoading();
    this.service.finalizar(this.idprod).
      subscribe((data: any) => {
        Swal.close();
        alertify.success("ENVASES CARGADOS !");
        this.array = data.response;
        this.resetear()
        this.resetear1()
      }, (err) => {
        console.log(err);
      })
  }

  traerPostearEnv() {
    this.service.traerPostear(this.idprod).
      subscribe((data: any) => {
        this.array = data.response;
      }, (err) => {
        console.log(err);
      })
  }

  detectarId() {
    this.service.detectarId(this.idprod).subscribe((data: any) => {
      if (data.response) {
        return alertify.success("Sigue adelante!");
      }
      Swal.fire({
        title: "¿EDITAR?",
        text: "¿ Desea editar el envase ?",
        cancelButtonColor: "red",
        showCancelButton: true,
        cancelButtonText: "CANCELAR",
        confirmButtonColor: "green",
        confirmButtonText: "ACEPTAR"
      }).then(res => {
        if (res.value) {
          return this.traerPostearEnv()
        }
        this.resetear()
        this.resetear1()
      })
    }, (err) => {
      console.log(err);
    })
  }

  eliminarFila(indice) {

    Swal.fire({
      title: "¿SEGURO?",
      text: "¿ Esta seguro que desea eliminar una fila ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ACEPTAR",
      cancelButtonText: "CANCELAR",
      cancelButtonColor: "red",
      confirmButtonColor: "green"
    }).then(res => {
      if (res.value) {
        this.service.eliminarFila(indice).
          subscribe((data: any) => {
            this.array = data.response;
            alertify.success("¡ Has eliminado una fila !");
          }, (err) => {
            console.log(err);
          })

      } else {
        return;
      }
    })


  }

  traerPorProps(indice) {
    this.service.traerPorProps(indice).
      subscribe((data: any) => {
        let item = data.response[0];
        this.codmp = item.codmp;
        this.envasado = item.envasado;
        this.descripcion = item.descripcion;
        this.cobarras = item.cobarras;
        this.indice = item.indice;
      }, (err) => {
        console.log(err);
      })
  }

  editar() {
    if (this.codmp < 39000) {
      return alertify.error("ARREGLA EL CODIGO ENVASE !")
    }

    this.service.editar(this.descripcion, this.codmp, this.cobarras, this.indice, this.envasado)
      .subscribe((data: any) => {
        this.array = data.response;
        this.resetear();
        alertify.success("Fila editada correctamente")
      }, (err) => {
        console.log(err);
      })

  }

} 
