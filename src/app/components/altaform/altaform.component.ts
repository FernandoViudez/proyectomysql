import { Component, OnInit, OnDestroy } from '@angular/core';
declare let alertify: any;
import Swal from 'sweetalert2';
import { FormService } from 'src/app/services/form.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatprimService } from 'src/app/services/matprim.service';
import { ProdtermService } from 'src/app/services/prodterm.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-altaform',
  templateUrl: './altaform.component.html',
  styles: []
})
export class AltaformComponent implements OnInit, OnDestroy {

  public username: string;
  texto = "CAMBIAR EL ORDEN";
  mostrar = false;
  idprod: number;
  tintoformoalt: string;
  mpi: string;
  codmp: number;
  codpt: number;
  descripcion: string;
  cantidad: number;
  sumaTot: number;
  array = [];
  pe: number;
  ppp: number;
  ppv: number;
  resi: number;
  pig: number;
  pr: number;
  solv: number;
  orden: number;
  existemp: string;
  existept: string;
  orden1: number;
  descripcion1: string;
  idBus: number;
  termino1: string;
  termino2: string;
  termino3: string;
  arrayBusqueda = [];
  ind: number;
  idImport: number;
  componente: string;
  usuario: string;

  constructor(private service: FormService,
    private route: Router,
    private MatPrimService: MatprimService,
    private prodTermService: ProdtermService) {
    let user_role = localStorage.getItem("user_role");
    if (user_role != "ADMIN_ROL" && user_role != "LABORATORIO") {
      alert("Acceso no autorizado !")
      route.navigate(['inicio'])
    }
    this.usuario = localStorage.getItem("username");
  }

  cambiarTexto() {
    if (this.mostrar) {
      this.texto = "CAMBIAR ORDEN"
    } else {
      this.texto = "DEJAR DE CAMBIAR"
    }
    this.mostrar = !this.mostrar;
  }

  sumarTotal(data) {
    this.sumaTot = 0;
    for (let item of data) {
      this.sumaTot += item.cantidad;
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.idprod) {
      this.eliminarTodo(true);
    }
  }

  buscarP() {
    this.service.buscarP(this.idBus, this.termino1, this.termino2, this.termino3)
      .subscribe((data: any) => {
        this.arrayBusqueda = data
      }, (err) => {
        console.log(err);
      })
  }

  seleccionarId(id) {
    document.getElementById("idp").setAttribute("disabled", "");
    this.idprod = id;
    this.validarIdprod()
  }

  cargar() {
    if (this.idprod == this.codpt) {
      return alertify.error(" NO SE PUEDE CARGAR ESTE PRODUCTO TERMINADO !")
    }
    if (this.existemp == "noexiste") {
      return alertify.error("NO EXISTE CODIGO DE MATERIA PRIMA !")
    }
    if (this.existept == "noexiste") {
      return alertify.error("CORREGIR CODIGO DE PRODUCTO TERMINADO !")
    }
    if (!this.idprod || !this.tintoformoalt) {
      return alertify.error("ES NECESARIO INGRESAR UN CODIGO PRODUCTO Y TIPO 'F' o 'T' o 'A'")
    }
    if (!this.mpi) {
      return alertify.error("MPI INCORRECTO !")
    }

    this.mpi = this.mpi.toUpperCase()
    if (this.mpi == "M" || this.mpi == "P" || this.mpi == "I") {

      if (this.mpi == "M" && !this.codmp || this.mpi == "M" && this.codpt || this.mpi == "P" && !this.codpt || this.mpi == "P" && this.codmp) {
        return alertify.error("NO PUEDES ASIGNAR 'M' SELECCIONANDO UN PT O 'P' SELECCIONANDO UNA MP")
      }
      if (this.mpi == "M" && !this.descripcion || this.mpi == "P" && !this.descripcion) {
        return alertify.error("NO PUEDES ASIGNAR UNA DESCRIPCION NULA")
      }
      if (!this.cantidad && this.mpi == "M" || !this.cantidad && this.mpi == "P") {
        return alertify.error("ES NECESARIO INGRESAR UNA CANTIDAD !")
      }
      if (this.mpi == "I" && !this.descripcion) {
        return alertify.error("ES NECESARIO INGRESAR UNA DESCRIPCION PARA LA INSTRUCCIÓN !")
      }

      // this.service.cargar(this.idprod, this.tintoformoalt.toUpperCase(), this.mpi, this.codmp, this.codpt, this.descripcion, this.cantidad)
      //   .subscribe((data: any) => {
      //     alertify.success("¡ RENGLON AGREGADO !")
      //     this.resetear()
      //     this.sumarTotal(data.response);
      //     this.array = data.response;
      //     this.calcular(data.response);
      //   })

      /** Agregamos al this.array */
      this.array.push({
        idprod: this.idprod,
        tintoformoalt: this.tintoformoalt.toUpperCase(),
        mpi: this.mpi,
        codmp: this.codmp,
        codpt: this.codpt,
        descripcion: this.descripcion,
        cantidad: this.cantidad,
        ind: this.array.length + 1,
        orden: this.array[this.array.length - 1]?.orden + 1 || 1,
      });

      /** Calculamos */
      this.sumarTotal(this.array);
      this.calcular(this.array);
      this.resetear();

    } else {
      return alertify.error("¡ MPI INCORRECTO !")
    }
  }

  eliminarTodo(destroy) {
    if (this.idprod) {
      if (destroy) {
        alertify.success("¡ OPERACIÓN CANCELADA !")
        this.sumaTot = null;
        this.resetear()
        this.resetear1()
      }
      Swal.fire({
        title: "CANCELAR",
        text: "¿ ESTAS SEGURO QUE QUIERE CANCELAR LA OPERACIÓN ?",
        cancelButtonColor: "red",
        confirmButtonColor: "green",
        showCancelButton: true,
      }).then(res => {
        if (res.value) {
          alertify.success("¡OPERACIÓN CANCELADA!")
          this.sumaTot = null;
          this.resetear()
          this.resetear1()
        } else
          return;
      })



    } else {
      return alertify.error("¡ INGRESE UN CODIGO DE PRODUCTO !")
    }
  }

  finalizar() {

    if (!this.tintoformoalt || !this.idprod) {
      return alertify.error("¡ PARAMETROS INCORRECTOS !")
    }

    this.tintoformoalt = this.tintoformoalt.toUpperCase()

    if (this.tintoformoalt != "F" && this.tintoformoalt != "T" && this.tintoformoalt != "A") {
      return alertify.error("¡ EL DATO EN TFA ES INCORRECTO !")
    }

    if (this.array.length == 0) {
      return alertify.error("¡ NO HA CARGADO NINGUN RENGLON PARA LAS FORMULAS !")
    }

    function finalizar(sumaTot, service, tintoformoalt, idprod, pe, ppp, ppv, resi, pig, pr, array, usuario) {
      return new Promise((resolve, reject) => {
        Swal.fire({
          title: "¡¡Atención!!",
          text: `El total de la suma es ${sumaTot}`,
          icon: "info",
          showCancelButton: true,
          cancelButtonColor: "red",
          cancelButtonText: "Corregir",
          confirmButtonColor: "green",
          confirmButtonText: "Seguir"
        }).then(res => {
          if (res.value) {
            Swal.fire({
              title: "Espere un momento...",
              icon: "info",
            })
            Swal.showLoading()
            service.finalizar(tintoformoalt, idprod, pe, ppp, ppv, resi,
              pig, pr, array, usuario).subscribe((data: any) => {
                Swal.close()
                Swal.fire({
                  title: "GENIAL",
                  text: "¡ SE HA GUARDADO LA FORMULA CORRECTAMENTE !",
                  icon: "success"
                })
                resolve("SI")
              })
          } else {
            reject("NO")
          }
        })
      });

    }

    if (this.tintoformoalt == "T") {
      let response = finalizar(0, this.service, this.tintoformoalt, this.idprod, this.pe, this.ppp, this.ppv,
        this.resi, this.pig, this.pr, this.array, this.usuario);
      response.then(data => {
        this.resetear();
        this.resetear1();
      }).catch(err => {
        return;
      })
    } else if (this.sumaTot) {
      let response = finalizar(this.sumaTot, this.service, this.tintoformoalt, this.idprod, this.pe, this.ppp, this.ppv,
        this.resi, this.pig, this.pr, this.array, this.usuario);
      response.then(data => {
        this.resetear();
        this.resetear1();
      }).catch(err => {
        return;
      })
    } else {
      return alertify.error("INGRESE BIEN LOS DATOS !");
    }


  }

  calcular(formulas: any[]) {
    if (formulas.length == 0) {
      this.pe = 0;
      this.pig = 0,
        this.ppp = 0;
      this.ppv = 0;
      this.pr = 0;
      this.resi = 0;
      this.solv = 0;
      return
    }

    this.service.calcular(formulas).subscribe((data: any) => {
      this.pe = data.pe;
      this.pig = data.tpig,
        this.ppp = data.tppp;
      this.ppv = data.ttppv;
      this.pr = data.tpr;
      this.resi = data.tres;
      this.solv = data.solvente;
    })

  }

  borraFila(index) {
    Swal.fire({
      title: "ELIMINACIÓN DE FILA",
      text: "¿ ESTA SEGURO QUE DESEA ELIMINAR ESTA FILA ?",
      cancelButtonColor: "red",
      confirmButtonColor: "green",
      showCancelButton: true,
    }).then((data) => {

      if (!data.value) {
        return;
      }

      // this.service.borrarFila(orden)
      //   .subscribe((data: any) => {
      //     this.sumarTotal(data.response);
      //     this.array = data.response;
      //     this.calcular(data.response)
      //   })

      this.array.splice(index, 1);
      this.reordenar();

      /** Calcular */
      this.sumarTotal(this.array);
      this.calcular(this.array);
      alertify.success("¡ FILA BORRADA CORRECTAMENTE !")

    })



  }

  traerFilas(ind) {
    this.ind = ind;

    /** Encontramos el item con ind:  this.ind   */
    let index = this.array.map(item => item.ind).indexOf(this.ind);

    this.orden = this.array[index].orden;
    this.mpi = this.array[index].mpi;
    this.codmp = this.array[index].codmp;
    this.codpt = this.array[index].codpt;
    this.descripcion = this.array[index].descripcion;
    this.cantidad = this.array[index].cantidad;


    // this.service.traerFilas(ind)
    //   .subscribe((data: any) => {
    //     let item = data.response;
    //     this.orden = item[0].orden;
    //     this.mpi = item[0].mpi;
    //     this.codmp = item[0].codmp;
    //     this.codpt = item[0].codpt;
    //     this.descripcion = item[0].descripcion;
    //     this.cantidad = item[0].cantidad;
    //   })
  }

  editar() {

    if (this.idprod == this.codpt) {
      return alertify.error(" NO SE PUEDE CARGAR ESTE PRODUCTO TERMINADO !")
    }
    if (this.existemp == "noexiste") {
      return alertify.error("NO EXISTE CODIGO DE MATERIA PRIMA !")
    }
    if (this.existept == "noexiste") {
      return alertify.error("CORREGIR CODIGO DE PRODUCTO TERMINADO !")
    }
    if (!this.idprod || !this.tintoformoalt) {
      return alertify.error("ES NECESARIO INGRESAR UN CODIGO PRODUCTO Y TIPO 'F' o 'T' o 'A'")
    }
    if (!this.mpi) {
      return alertify.error("MPI INCORRECTO !")
    }

    this.mpi = this.mpi.toUpperCase()
    if (this.mpi == "M" || this.mpi == "P" || this.mpi == "I") {

      if (this.mpi == "M" && !this.codmp || this.mpi == "M" && this.codpt || this.mpi == "P" && !this.codpt || this.mpi == "P" && this.codmp) {
        return alertify.error("NO PUEDES ASIGNAR 'M' SELECCIONANDO UN PT O 'P' SELECCIONANDO UNA MP")
      }
      if (this.mpi == "M" && !this.descripcion || this.mpi == "P" && !this.descripcion) {
        return alertify.error("NO PUEDES ASIGNAR UNA DESCRIPCION NULA")
      }
      if (!this.cantidad && this.mpi == "M" || !this.cantidad && this.mpi == "P") {
        return alertify.error("ES NECESARIO INGRESAR UNA CANTIDAD !")
      }
      if (this.mpi == "I" && !this.descripcion) {
        return alertify.error("ES NECESARIO INGRESAR UNA DESCRIPCION PARA LA INSTRUCCIÓN !")
      }
    }


    /** Encontramos el item con ind:  this.ind   */
    let index = this.array.map(item => item.ind).indexOf(this.ind);

    /** Editamos el item en la posicicon index del this.array */
    ["mpi", "codmp", "codpt", "descripcion", "cantidad", "ind"].forEach(item => {
      this.array[index][item] = this[item];
    })

    /** Calculamos */
    this.sumarTotal(this.array);
    this.calcular(this.array);
    this.resetear();

    // this.service.editar(this.mpi, this.codmp, this.codpt, this.descripcion, this.cantidad, this.ind)
    //   .subscribe((data: any) => {
    //     this.array = data.response;
    //     this.sumarTotal(data.response);
    //     this.calcular(data.response);
    //     this.resetear();
    //   })
  }

  traerEditar() {
    this.service.traerEditar(this.idprod, this.tintoformoalt)
      .subscribe((data) => {
        this.array = data;
        this.sumarTotal(data);
        this.calcular(data)
      })
  }

  resetear() {
    this.mpi = "";
    this.codmp = null;
    this.codpt = null;
    this.descripcion = "";
    this.cantidad = null;
    this.existemp = null;
    this.existept = null;
    this.orden = null;
    this.orden1 = null;
    this.termino1 = "";
    this.termino2 = "";
    this.termino3 = "";
    this.arrayBusqueda = [];
    this.idBus = null;
  }

  resetear1() {
    this.tintoformoalt = "";
    this.idprod = null;
    this.pe = null;
    this.ppp = null;
    this.ppv = null;
    this.resi = null;
    this.pig = null;
    this.pr = null;
    this.descripcion1 = null;
    this.solv = null;
    this.array = [];
    this.usuario = null;
    document?.getElementById("idp")?.removeAttribute("disabled");
    document?.getElementById("TFA")?.removeAttribute("disabled");

  }

  validar() {
    // ACA VA LA TAREA DE MARC, ES UNA VALIDACION CON IF SOBRE this.tintoformoalt
    this.tintoformoalt = this.tintoformoalt.toUpperCase()

    if (this.tintoformoalt != "F" && this.tintoformoalt != "T" && this.tintoformoalt != "A") {
      this.resetear();
      this.resetear1();
      return alertify.error("¡ EL DATO EN TFA ES INCORRECTO !");
    }

    let data = {
      idprod: this.idprod,
      tintoformoalt: this.tintoformoalt,
    };

    fetch(`${environment.backend}detect`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then((data1) => {
        document.getElementById("TFA").setAttribute("disabled", "");
        if (data1.message == "genial") {
          alertify.success("¡ NO EXISTE, SIGUE ADELANTE !");

          let sweet = async () => {
            const { value: idImport } = await Swal.fire({
              title: '¿Desea importar una formula existente?',
              text: "Si desea importar desde otro producto, ingrese el código y oprima 'SI', sino oprima 'CANCELAR':",
              input: 'number',
              showCancelButton: true,
              cancelButtonColor: "red",
              confirmButtonColor: "green",
              confirmButtonText: "SI",
              cancelButtonText: "CANCELAR"
            })

            if (idImport) {
              if (this.idprod == idImport) {
                return alertify.error("¡ CODIGO DE PRODUCTO INCORRECTO !")
              }
              this.importarForm(idImport)
            }

          }
          sweet()


        } else {
          Swal.fire({
            title: "Formula Existente",
            text: "¿Desea editarla?",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "red",
            confirmButtonText: "Si",
            cancelButtonText: "No"
          }).then((data) => {
            if (data.value) {
              this.traerEditar();
            } else {
              this.resetear();
              this.resetear1();
              return;
            }
          })
        }
      }).catch((err) => {
        console.log(err);
      })
  }

  validarmp() {
    this.MatPrimService.validarMp(this.codmp).subscribe((data: any) => {
      this.descripcion = data.response.descripcion;
      const ubicacion = data.response.ubicacion;   // en este campo se indica si la MP es obsoleta o no

      if (ubicacion == "SI") {
        alertify.error('MATERIA PRIMA OBSOLETA');
        alertify.error('MATERIA PRIMA OBSOLETA');
        return alertify.error('MATERIA PRIMA OBSOLETA');
      }

      this.existemp = "existe";

    }, (err) => {
      this.existemp = "noexiste";
      return alertify.error(err.error.message);
    })
  }

  validarpt(esProductoDentroDeFormula: boolean) {
    this.prodTermService.validarPt(this.codpt).
      subscribe((data: any) => {

        this.existept = "existe";
        if (esProductoDentroDeFormula) {
          this.descripcion = `${data.desc}`;
          return;
        }
        this.descripcion1 = `${data.desc}  ${data.color || ''} ${data.componente}`;
      }, (err) => {
        this.existept = "noexiste";
        return alertify.error(err.error.message);
      })


  }

  validarIdprod() {
    document.getElementById("idp").setAttribute("disabled", "");
    this.service.validarIdProd(this.idprod).
      subscribe((data: any) => {

        alertify.success("ESTE PRODUCTO TERMINADO EXISTE, SIGUE ADELANTE !");
        this.descripcion1 = `${data.desc}  ${data.color || ''}  ${data.componente}`;
        this.componente = data.componente;

      }, (err) => {

        if (err.error.response) {
          let data = err.error.response;
          alertify.success("ESTE PRODUCTO TERMINADO EXISTE, SIGUE ADELANTE !");
          this.descripcion1 = `${data.descripcion}  ${data.color || ''}  ${data.componente}`;
          this.componente = data.componente;
          alertify.success("ESTE PRODUCTO TERMINADO EXISTE, SIGUE ADELANTE !");
        } else {
          this.resetear();
          this.resetear1();
          alertify.error("¡ ESTE PRODUCTO TERMINADO NO EXISTE !");
        }

      })

  }

  importarForm(id) {
    this.service.importarForm(id, this.idprod, this.tintoformoalt, this.componente).subscribe((data: any) => {

      if (data.response.length == 0) {
        return alertify.error("¡ NO HAY FORMULAS CARGADAS CON ESE CODIGO DE PRODUCTO !")
      }

      this.array = data.response;

      this.sumarTotal(data.response);
      this.calcular(data.response)

    }, (err) => {
      this.resetear();
      this.resetear1();
      alertify.error(err.error.message);
    })
  }

  dropped(event: CdkDragDrop<any>) {
    moveItemInArray(this.array, event.previousIndex, event.currentIndex);
    this.reordenar();
  }

  reordenar() {
    /** Reordenar el item.orden en base al index que provee el ciclo for */
    for (let i = 0; i < this.array.length; i++) {
      this.array[i].orden = i + 1;
      this.array[i].ind = i + 1;
    }
  }

  omit_number(event) {
    let key;
    key = event.keyCode;  //         key = event.charCode;  (Both can be used)   key == 45  // allows minus(-)
    return ((key > 47 && key < 58) || key == 46);
  }

}
