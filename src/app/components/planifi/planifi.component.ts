import { Component, OnInit } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from 'src/app/services/env.service';
import Swal from 'sweetalert2';
import { PlanifiService } from '../../services/planifi.service';
declare let alertify: any;

@Component({
  selector: 'app-planifi',
  templateUrl: './planifi.component.html',
  styleUrls: ['./planifi.component.css']
})

export class PlanifiComponent implements OnInit {

  //DATA ENTRY
  codpt: number;
  descripcion: string;
  cantidad: number;
  formaenv: string;
  cliente: string;
  fechacompr: Date;
  motivo: string;

  //VALIDADOR DE EDICION
  editar: boolean;
  borrar: boolean = false;

  //DATOS A PARTE
  id: number;
  lote: any;
  fechacomienzo: any;
  proceso: any;
  fechafin: any;
  operario: any;
  dispersora: any;
  molino: any;
  unidadmedida: string;

  //BUSQUEDA DE PLANIFICACION
  codptB: number;
  descripcionB: string;
  clienteB: string;
  pendientes = false;
  arrayB = [];

  //BUSQUEDA DE PRODUCTO
  idBus: number;
  termino1: string
  termino2: string;
  termino3: string;
  arraypt = [];

  constructor(private service: FormService,
    private http: HttpClient,
    private service1: EnvService,
    private planifiService: PlanifiService) { }

  ngOnInit(): void {
    this.deshabilitar();
  }
  //BUSQUEDA DE PLANIFICACION
  buscarPlan() {
    this.pendientes = false;
    let data = { codpt: this.codptB, descripcion: this.descripcionB, cliente: this.clienteB }
    this.http.post("http://localhost:8080/api/getPlani", data).
      subscribe((data: any) => {
        for (let item of data.response) {
          console.log(item);
          if (item.proceso == "ENVASADO") {
            item.isGreen = true;
          } else if (item.proceso == "FALTANTE") {
            item.isRed = true;
          } else if (item.fechafin) {
            item.isOrange = true;
          } else {
            item.isYellow = true;
          }
        }
        this.arrayB = data.response;
      }, (err) => {
        console.log(err);
      })
  }
  //BUSQUEDA DE PRODUCTO TERMINADO 
  buscarP() {
    this.service1.buscarpt(this.idBus, this.termino1, this.termino2, this.termino3).subscribe((data: any) => {
      this.arraypt = data.response;
    }, (err) => {
      return;
    })
  }
  //TRAE DATOS DE CODPT
  validarId() {

    function enviarMessage() {
      alertify.success("ESTE PRODUCTO TERMINADO EXISTE, SIGUE ADELANTE !")
    }

    this.service.validarIdProd(this.codpt).
      subscribe((data: any) => {
        let dato = data.response[0];
        enviarMessage();
        this.descripcion = `${dato.descripcion} - ${data.componente} - ${data.color}`;
        this.unidadmedida = dato.unidadmedida;
      }, (err) => {
        if (err.error.response) {
          let dato = err.error.response;
          enviarMessage();
          alertify.error(" ATENCIÓN!! PRODUCTO SIN FORMULA ")
          this.descripcion = `${dato.descripcion} - ${dato.componente} - ${dato.color}`;
          this.unidadmedida = dato.unidadmedida;
        } else {
          alertify.error(" ESTE PRODUCTO TERMINADO NO EXISTE ")
          return this.resetear();
        }

      })
  }
  //CUANDO LE DAS A CLICK EN LA TABLA DE LUPA EN PLANIFICACION
  traerDatos(id) {
    this.id = id;
    this.editar = true;
    this.borrar = true;


    this.http.get(`http://localhost:8080/api/getPlani/${id}`).subscribe((dato: any) => {
      let data = dato.response;
      let fechacompr: Date;
      let fechacomienzo: Date;
      let fechafin: Date;

      fechacompr = data.fechacompr ? data.fechacompr.split("T")[0] : data.fechacompr;
      fechacomienzo = data.fechacomienzo ? data.fechacomienzo.split("T")[0] : data.fechacomienzo;
      fechafin = data.fechafin ? data.fechafin.split("T")[0] : data.fechafin;

      if (fechafin) {
        this.resetear();
        return Swal.fire({
          title: "ALERTA",
          text: "Producto finalizado, no se puede editar",
          icon: "warning"
        })
      }

      this.codpt = data.codpt;
      this.validarId();
      this.lote = data.lote
      this.proceso = data.proceso
      this.operario = data.operario
      this.dispersora = data.dispersora
      this.molino = data.molino
      this.cantidad = data.cantidad;
      this.formaenv = data.formaenv;
      this.cliente = data.cliente;
      this.motivo = data.motivo;

      this.fechafin = fechafin;
      this.fechacomienzo = fechacomienzo;
      this.fechacompr = fechacompr;

      if (this.lote) {
        this.habilitar();
      } else {
        this.deshabilitar();
      }
    }, (err) => {
      console.log(err);
    })

  }
  //CUANDO LE DAS A CLICK EN PRODTERM
  seleccionarIdPt(id) {
    this.codpt = id;
    this.validarId();
  }
  //POSTEAMOS TODO
  finalizar() {

    function calcularFecha(fechaComparar, compararPosterior?: boolean) {

      fechaComparar = fechaComparar.toString().split("-");
      let Hoy = new Date();

      var AnyoFecha = Number(fechaComparar[0]);
      var MesFecha = Number(fechaComparar[1]);
      var DiaFecha = Number(fechaComparar[2]);

      var AnyoHoy = Hoy.getFullYear();
      var MesHoy = Hoy.getMonth() + 1;
      var DiaHoy = Hoy.getDate();

      if (compararPosterior) {
        if (AnyoFecha > AnyoHoy) {
          return false;
        } else if (MesFecha > MesHoy) {
          return false;
        } else if (MesFecha === MesHoy && DiaFecha > DiaHoy) {
          return false;
        }
      }

      if (AnyoFecha < AnyoHoy) {
        return false;
      } else if (MesFecha < MesHoy) {
        return false;
      } else if (MesFecha === MesHoy && DiaFecha < DiaHoy) {
        return false;
      } else {
        return true;
      }
    }

    if (!this.codpt) {
      return alertify.error("Código del producto incorrecto");
    }
    if (!this.cantidad || this.cantidad < 0) {
      return alertify.error("La cantidad es incorrecta");
    }
    if (!this.formaenv) {
      return alertify.error("La forma de envasado es incorrecta");
    }
    if (!this.cliente) {
      return alertify.error("El cliente es obligatorio!!");
    }
    if (!this.motivo) {
      return alertify.error("El motivo es obligatorio!!")
    }

    if (!calcularFecha(this.fechacompr) || this.fechafin && !calcularFecha(this.fechafin, true)) {
      return alertify.error("ALGUNA DE LAS FECHAS INGRESADAS ES INCORRECTA !");
    }

    if (this.fechacomienzo && !calcularFecha(this.fechacomienzo) && !this.proceso) {
      return alertify.error("ALGUNA DE LAS FECHAS INGRESADAS ES INCORRECTA !");
    } else if (!this.fechacomienzo && this.proceso) {
      return alertify.error("CARGAR FECHA DE COMIENZO !");
    }



    function cargar(codpt: number, cantidad: number, formaenv: string,
      cliente: string, motivo: string, fechacompr: Date, fechafin: Date, fechacomienzo: Date,
      proceso: string, lote: number, operario: string, dispersora: string, molino: string,
      descripcion: string, editar: boolean, planifiService, id: number) {
      console.log(cantidad);
      let data = {
        codpt,
        cantidad,
        formaenv: formaenv.toUpperCase(),
        cliente: cliente.toUpperCase(),
        fechacompr,
        lote,
        fechacomienzo,
        proceso,
        fechafin,
        operario,
        dispersora,
        molino,
        motivo,
        descripcion,
      }

      if (!editar) {
        planifiService.postearPlanifi(data).
          subscribe((data: any) => {
            alertify.success(data.message);

          }, (err) => {
            console.log(err);
          })
      } else {
        planifiService.updatePlanifi(data, id).
          subscribe((data: any) => {
            alertify.success("HAS MODIFICADO UNA PLANIFICACION !");

          }, (err) => {
            console.log(err);
          })
      }
    }

    if (this.fechafin) {
      Swal.fire({
        title: "Atención!!",
        icon: "info",
        text: "Si completa FECHA FIN, no podrá realizar más cambios.",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Aceptar",
        cancelButtonColor: "red",
        confirmButtonColor: "green",
        showCancelButton: true
      }).then(res => {
        if (res.value) {
          cargar(this.codpt, this.cantidad, this.formaenv,
            this.cliente, this.motivo, this.fechacompr, this.fechafin, this.fechacomienzo,
            this.proceso, this.lote, this.operario, this.dispersora, this.molino,
            this.descripcion, this.editar, this.planifiService, this.id)
          this.resetear();
        } else {
          return;
        }
      })
    } else {
      cargar(this.codpt, this.cantidad, this.formaenv,
        this.cliente, this.motivo, this.fechacompr, this.fechafin, this.fechacomienzo,
        this.proceso, this.lote, this.operario, this.dispersora, this.molino,
        this.descripcion, this.editar, this.planifiService, this.id)
      this.resetear()
    }




  }
  //BORRAR FILA
  borrarFila() {
    Swal.fire({
      title: "¿Borrar?",
      text: "¿ Seguro que quiere eliminar esta planificacion ?",
      showCancelButton: true,
      cancelButtonColor: "red",
      cancelButtonText: "NO",
      confirmButtonColor: "green",
      confirmButtonText: "SI",
      icon: "question"
    }).then(res => {
      if (res.value) {
        this.http.delete(`http://localhost:8080/api/deletePlani/${this.id}`).
          subscribe((data: any) => {
            alertify.success(data.message);
            this.resetear();
          }, (err) => {
            console.log(err);
          })
      } else {
        return;
      }
    })
  }
  //CANCELAR OPERACION
  cancelar() {
    Swal.fire({
      title: "¿Cancelar?",
      text: "¿ Seguro de que quiere cancelar esta operacion ?",
      showCancelButton: true,
      cancelButtonColor: "red",
      cancelButtonText: "NO",
      confirmButtonColor: "green",
      confirmButtonText: "SI",
      icon: "question"
    }).then(res => {
      if (res.value) {
        this.resetear();
      } else {
        return;
      }

    })
  }
  //LIMPIAMOS INPUTS
  resetear() {
    this.borrar = false;
    this.editar = null;
    this.codpt = null;
    this.descripcion = null;
    this.cantidad = null;
    this.formaenv = null;
    this.cliente = null;
    this.fechacompr = null;
    this.lote = null;
    this.fechacomienzo = null;
    this.proceso = null;
    this.fechafin = null;
    this.operario = null;
    this.dispersora = null;
    this.molino = null;
    this.id = null;
    this.motivo = null;
    this.codptB = null;
    this.descripcionB = null;
    this.clienteB = null;
    this.arrayB = [];
    this.pendientes = false;
    this.unidadmedida = null;
    this.deshabilitar()
  }
  //RESETEAR SOLO LA BUSQUEDA DE PLANIFICACION
  resetear1() {
    this.codptB = null;
    this.descripcionB = null;
    this.clienteB = null;
    this.arrayB = [];
    this.pendientes = false;
  }
  //HABILITAR INPUTS PARA ESCRITURA
  habilitar() {
    document.getElementById("fechacomienzo").removeAttribute("disabled");
    document.getElementById("proceso").removeAttribute("disabled");
    document.getElementById("fechafin").removeAttribute("disabled");
    document.getElementById("operario").removeAttribute("disabled");
    document.getElementById("dispersora").removeAttribute("disabled");
    document.getElementById("molino").removeAttribute("disabled");
    document.getElementById("cantidad").setAttribute("disabled", "");
  }
  //DESABILITAR INPUTS
  deshabilitar() {

    document.getElementById("fechacomienzo").setAttribute("disabled", "");
    document.getElementById("proceso").setAttribute("disabled", "");
    document.getElementById("fechafin").setAttribute("disabled", "");
    document.getElementById("operario").setAttribute("disabled", "");
    document.getElementById("dispersora").setAttribute("disabled", "");
    document.getElementById("molino").setAttribute("disabled", "");
    document.getElementById("cantidad").removeAttribute("disabled");
  }
  //IMPRIMIR LOS PRODUCTOS DEL ARRAYB
  imprimir() {
    window.print();
  }

  listarPendientes() {
    this.pendientes = true;
    this.http.get("http://localhost:8080/api/traerPendientes").
      subscribe((data: any) => {
        this.arrayB = data.response;
      }, (err) => {
        console.log(err);
      })
  }

  omit_number(event) {
    let key;
    key = event.keyCode;  //         key = event.charCode;  (Both can be used)   key == 45  // allows minus(-)
    return ((key > 47 && key < 58) || key == 46);
  }

}
