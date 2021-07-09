import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import numeral from 'numeral';
import { GenericService } from '../../services/generic.service';
import { ListadosService } from '../listados/listados.service';
import { obtenerPath } from 'src/app/_utils/generarBackPath';
declare let alertify;

@Component({
  selector: 'app-emision',
  templateUrl: './emision.component.html',
  styles: []
})
export class EmisionComponent implements OnInit, OnDestroy {

  //GENERALES
  id: number;
  descripcion: string;
  descripcionEtiquetas: string;
  colorEtiquetas: string;
  proximoBatch: number;
  aEnvasar: number;
  totCantidadEnvasar: number;
  tfa = "F";
  arrayConj = [];
  arrayAsoc = [];
  arrayMat = [];
  idPlani: number;
  arrayCantidadesRestadas = [];
  arrayCodMp = [];
  fechaDelDia: string;
  con: number;

  // FLAG BUTTON
  botonCancelado: boolean = false;
  cancelarPrepesado: boolean = false;

  // PANTALLAS DE PRINT
  disableYesPrint: boolean = true;

  //PRODTERM

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

  //PLANIFICACION
  lote: any;
  proceso: any;
  operario: any;
  dispersora: any;
  molino: any;
  cantidadPlani: number;
  formaenv: string;
  cliente: string;
  fechacompr: Date;
  fechafin: any;
  fechacomienzo: any;
  motivo: string;
  contemplar: string;

  //ENVASADO
  cobarras: string;
  descripcionEnv: string;
  codmp: number;
  envasado: string;
  indice: number;

  //BUSQUEDA DE PLANIFICACION
  codptB: number;
  descripcionB: string;
  clienteB: string;
  pendientes = false;
  arrayB = [];

  constructor(private http: HttpClient,
    private genericService: GenericService,
    private listadosService: ListadosService) {
    let anio = new Date().getFullYear();
    let mes = new Date().getMonth() + 1;
    let dia = new Date().getDate();

    this.fechaDelDia = `${dia}/${mes}/${anio}`;

  }

  ngOnInit(): void {
    this.generarProximoBatch();
    if (!localStorage.getItem("activo")) {
      Swal.fire({
        title: "¿Eliminar?",
        text: "¿Desea eliminar las etiquetas generadas en el archivo .txt etilatas?",
        icon: "question",
        cancelButtonColor: "red",
        confirmButtonColor: "green",
        cancelButtonText: "NO",
        confirmButtonText: "SI",
        showCancelButton: true
      }).then(res => {
        if (res.value) {
          this.http.delete(`${obtenerPath()}eliminarEtiquetasEmision`).
            subscribe((data: any) => {
              alertify.success(data.message);
            }, (err) => {
              alertify.error(err.error.message);
            })
        }
        localStorage.setItem("activo", "verdadero");
      })
    }
  }

  ngOnDestroy() {
    localStorage.removeItem("activo");
    this.onTxt();
  }

  //BUSQUEDA DE PLANIFICACION
  buscarPlan() {
    this.pendientes = false;
    let data = { codpt: this.codptB, descripcion: this.descripcionB, cliente: this.clienteB, pendientes: true }
    this.http.post(`${obtenerPath()}getPlani`, data).
      subscribe((data: any) => {
        this.arrayB = data.arrayPendientes;
      }, (err) => {
        console.log(err);
      })
  }
  //RESETEAR SOLO LA BUSQUEDA DE PLANIFICACION
  resetear1() {
    this.codptB = null;
    this.descripcionB = null;
    this.clienteB = null;
    this.arrayB = [];
    this.pendientes = false;
  }
  //CANCELAR TODO
  cancelar() {
    Swal.fire({
      title: "¿ Cancelar operación ?",
      text: "¿ Está seguro que desea cancelar la operación ?",
      cancelButtonText: "No",
      cancelButtonColor: "red",
      showCancelButton: true,
      confirmButtonColor: "green",
      confirmButtonText: "Si",
      icon: "question"
    }).then(res => {
      if (res.value) {
        this.resetearTodo();
      } else {
        return;
      }
    })

  }
  //CUANDO LE DAS A CLICK EN LA TABLA DE LUPA EN PLANIFICACION
  traerDatos(id, codpt) {

    this.http.get(`${obtenerPath()}getAll/${codpt}/${id}/${this.tfa}`).subscribe((dato: any) => {

      let item = dato.response1[0]; //PROD VIENE UNO
      this.arrayConj = dato.response2; //ENVASADOS
      let item3 = dato.response3[0]; //PLANI VIENE UNO
      this.arrayAsoc = dato.response4; //FORMULAS
      this.arrayMat = dato.response5; //MATERIAS PRIMAS DE CADA FORMULA 

      let fechacompr: Date;
      let fechacomienzo: Date;
      let fechafin: Date;

      fechacompr = item3.fechacompr ? item3.fechacompr.split("T")[0] : item3.fechacompr;
      fechacomienzo = item3.fechacomienzo ? item3.fechacomienzo.split("T")[0] : item3.fechacomienzo;
      fechafin = item3.fechafin ? item3.fechafin.split("T")[0] : item3.fechafin;

      //RESETEAMOS LOS INDICES DE PROCONJ
      for (let item of this.arrayConj) {
        item.indice = 0;
        item.indice1 = 0;
      }
      for (let item of this.arrayAsoc) {
        item.ind = 0;
      }

      this.cancelarPrepesado = true;

      //PROD
      this.idPlani = id
      this.id = codpt;
      this.descripcion = item.descripcion
      this.color = item.color;
      this.colorigual = item.colorigual;
      this.componente = item.componente;
      this.formaconjunto = item.formaconjunto;
      this.relaciondemezcla = item.relaciondemezcla;
      this.tipogenerico = item.tipogenerico;
      this.unidadmedida = item.unidadmedida;
      this.pesoespecifico = item.pesoespecifico;
      this.viscosidadspindle = item.viscosidadspindle;
      this.viscosidaduk = item.viscosidaduk;
      this.spindlenumero = item.spindlenumero;
      this.molienda = item.molienda;
      this.brillo = item.brillo;
      this.solidosppp = item.solidosppp;
      this.solidosppv = item.solidosppv;
      this.resina = item.resina;
      this.pigmento = item.pigmento;
      this.solvente = item.solvente;
      this.fechaultimaelaboracion = item.fechaultimaelaboracion;
      this.precio = item.precio;
      this.ultimamodificacion = item.ultimamodificacion;

      //PLANIFICACION

      this.lote = item3.lote;
      this.proceso = item3.proceso;
      this.operario = item3.operario;
      this.dispersora = item3.dispersora;
      this.molino = item3.molino;
      this.cantidadPlani = item3.cantidad;
      this.formaenv = item3.formaenv;
      this.cliente = item3.cliente;
      this.fechacompr = fechacompr;
      this.fechafin = fechafin;
      this.fechacomienzo = fechacomienzo;
      this.motivo = item3.motivo;

      //OTROS
      this.descripcionEtiquetas = this.descripcion;
      this.colorEtiquetas = this.color;

      this.calcularFaltantes();
    }, (err) => {
      console.log(err);
    })

  }
  //GENERA EL PROXIMO BATCH
  generarProximoBatch() {
    this.http.get(`${obtenerPath()}generarBatch`)
      .subscribe((data: any) => {
        this.proximoBatch = data.lote;
      })
  }
  //CALCULA EL TOTAL DE ENVASADO QUE INGRESA EL USUARIO 
  calcular(cantidad, index) {
    this.totCantidadEnvasar = 0;

    this.arrayConj[index].indice1 = cantidad;
    for (let item of this.arrayConj) {

      this.totCantidadEnvasar += Number(item.indice1);
    }
  }

  calcularFaltantes() {
    this.arrayCantidadesRestadas = [];
    let operacion = 0;

    for (let [index, item] of this.arrayAsoc.entries()) {
      if (item.mpi != "I") {
        if (this.unidadmedida == "LT") {
          operacion = (item.cantidad * this.cantidadPlani * this.pesoespecifico) / 100;
        } else {
          operacion = (item.cantidad * this.cantidadPlani) / 100;
        }

        let cantidadCalculada = numeral(operacion).format('0.00');

        if (this.arrayCantidadesRestadas.find(cant => cant.id == item.codmp || item.codpt)) {
          this.arrayCantidadesRestadas.map(cant => {
            if (cant.id == item.codmp || cant.id == item.codpt) {
              let tot = Number(cant.cantidadCalculada) + Number(cantidadCalculada);
              cant.cantidadCalculada = numeral(tot).format('0.00');
              cant.cantidadCalculada.toString();
            }
          })
        } else {
          this.arrayCantidadesRestadas.push({ cantidadCalculada, id: item.codmp ? item.codmp : item.codpt, tabla: item.codmp ? 'promatpri' : 'prodterm' });
        }


        for (let item2 of this.arrayMat) {
          if (item.codmp == item2.id) {
            if (item2.stock < 0) {
              item.ind = [-cantidadCalculada, `${item2.riesgo} ${item2.proteccion}`, `${item2.tipo}`];
            } else {
              item.ind = [item2.stock - cantidadCalculada, `${item2.riesgo} ${item2.proteccion}`, `${item2.tipo}`];
            }
          } else if (item.codpt == item2.id) {
            if (item2.stock < 0) {
              item.ind = [-cantidadCalculada,];
            } else {
              item.ind = [item2.stock - cantidadCalculada,];
            }
          }
        }

      }

    }


  }

  finalizar() {
    Swal.fire({
      title: "¿ Seguro ?",
      text: "¿ Está seguro que quiere emitir el Batch Ticket ?",
      showCancelButton: true,
      cancelButtonColor: "red",
      cancelButtonText: "NO",
      confirmButtonText: "SI",
      confirmButtonColor: "green",
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then(res => {
      if (res.value) {
        Swal.showLoading();
        this.disableYesPrint = false;
        this.botonCancelado = true;

        let data = {
          codpt: this.id,
          tfa: this.tfa,
          unidadmedida: this.unidadmedida,
          cantidadPlani: this.cantidadPlani,
          pesoespecifico: this.pesoespecifico,
          batch: this.proximoBatch,
          id: this.idPlani,
          descripcion: this.descripcion,
          color: this.color,
          componente: this.componente,
          cantidadRestada: this.arrayCantidadesRestadas,
          cliente: this.cliente,
          arrayCodMp: this.arrayConj,
          relaciondemezcla: this.relaciondemezcla,
          descripcionEtiquetas: this.descripcionEtiquetas,
          colorEtiquetas: this.colorEtiquetas,
          tipogenerico: this.tipogenerico,
          usuario: localStorage.getItem("username"),
          proceso: this.tfa == 'T' ? 'TINTURADO' : this.proceso,
        }

        /** DEJAMOS TIEMPO A QUE SE GUARDE LA DATA Y SE HAGA EL CAMBIO DE HTMLS POR ATRAS */
        setTimeout(() => {
          Swal.close();
          this.imprimir();

          this.http.post(`${obtenerPath()}finalizarEmision`, data).subscribe((data: any) => {
            Swal.fire({
              title: "¡ Genial !",
              text: "¡ Se ha emitido el ticket correctamente !",
              icon: "success"
            }).then(res => {
              this.resetearTodo();
            })
          }, (err) => {
            console.log(err);
          })

        }, 3000)


      } else {
        return;
      }

    })

  }

  imprimir() {
    window.print();
  }

  guardarEnvases(input: any, codmp, envasado) {
    input = Number(input);

    if (!Number.isInteger(input / envasado)) {
      return Swal.fire({
        title: "Error!",
        text: "CORREGIR CANTIDAD A ENVASAR!!!",
        icon: "error",
        confirmButtonColor: "green",
        confirmButtonText: "Aceptar",
        allowEnterKey: false,
        allowEscapeKey: false,
        allowOutsideClick: false
      })
    }

    for (let item of this.arrayConj) { //RECORRER ARREGLO QUE LLEGA Y VALIDAR SI ESTAS MODIFICANDO ENVASES
      if (item.codmp == codmp && item.envasado == envasado) {
        let envases = input / item.envasado;
        item.indice = envases;
      }
    }

  }

  listarPendientes() {
    this.pendientes = true;
    this.http.get(`${obtenerPath()}traerPendientes`).
      subscribe((data: any) => {
        this.arrayB = [];
        for (let item of data.response) {
          if (!item.lote) {
            this.arrayB.push(item);
          }
        }

      }, (err) => {
        console.log(err);
      })
  }

  calcularPlanProduccion() {
    /** Necesitamos filtrar pendientes por los que no tengan batch emitido  */
    this.arrayB.filter(item => !item.batch);

    /** Luego enviamos ese arreglo al backend para que haga las operaciones necesarias */
    this.genericService.calcularPlan(this.arrayB)
      .subscribe((data: any) => {
        this.onExcel(data.response);
      })

  }

  onExcel(items) {
    this.listadosService.generarExcel(items, 'PLANIFICACION', "Planificacion", ['idprod', 'codmp', 'descripcion', 'stock', 'cantidad']).subscribe
      ((data: any) => {
        this.genericService.downloadExcel(data.url);
      }, (err) => {
        console.log(err);
      })

  }

  imprimirEnNuevaPestana() {
    window.print();
  }

  onTxt() {
    this.genericService.downloadTxt("etilatas.txt", "<h1 style='color: white; background-color: blue; text-align: center; '>El archivo 'etilatas.txt' no existe</h1>");
  }

  calcularFechaVencimiento() {

    let diaActual = new Date();

    // dias a sumar segun el producto.  thiokol tiene 6 meses, vinilesters 3 meses, resto 1 anio

    if (this.id == 10565 || this.id == 10572 || this.id == 30644 || this.id == 30645) {
      var dias = 180;
    }
    if (this.tipogenerico.includes('VINIL ESTER') || this.tipogenerico.includes('VINILESTER')) {
      var dias = 90;
    } else {
      var dias = 365; // si quisiera agregar a mano dias usaria parseInt(numero.value);
    }

    //nueva fecha sumando los dias 
    diaActual.setDate(diaActual.getDate() + dias);
    return diaActual.getDate() + '/' + (diaActual.getMonth() + 1) + '/' + diaActual.getFullYear();
  }

  resetearTodo(): void {
    this.resetear1();
    //GENERALES
    this.id = undefined;
    this.descripcion = undefined;
    this.descripcionEtiquetas = undefined;
    this.colorEtiquetas = undefined;
    this.proximoBatch = undefined;
    this.aEnvasar = undefined;
    this.totCantidadEnvasar = undefined;
    this.tfa = "F";
    this.arrayConj = [];
    this.arrayAsoc = [];
    this.arrayMat = [];
    this.idPlani = undefined;
    this.arrayCantidadesRestadas = [];
    this.arrayCodMp = [];
    this.fechaDelDia = undefined;
    this.contemplar = undefined;

    // FLAG BUTTON
    this.botonCancelado = false;
    this.cancelarPrepesado = false;

    // PANTALLAS DE PRINT
    this.disableYesPrint = true;

    //PRODTERM

    this.color = undefined;
    this.colorigual = undefined;
    this.componente = undefined;
    this.formaconjunto = undefined;
    this.relaciondemezcla = undefined;
    this.tipogenerico = undefined;
    this.unidadmedida = undefined;
    this.pesoespecifico = 0;
    this.viscosidadspindle = undefined;
    this.viscosidaduk = undefined;
    this.spindlenumero = undefined;
    this.molienda = undefined;
    this.brillo = undefined;
    this.solidosppp = 0;
    this.solidosppv = 0;
    this.resina = 0;
    this.pigmento = 0;
    this.solvente = 0;
    this.fechaultimaelaboracion = undefined;
    this.precio = undefined;
    this.ultimamodificacion = undefined;

    //PLANIFICACION
    this.lote = undefined;
    this.proceso = undefined;
    this.operario = undefined;
    this.dispersora = undefined;
    this.molino = undefined;
    this.cantidadPlani = undefined;
    this.formaenv = undefined;
    this.cliente = undefined;
    this.fechacompr = undefined;
    this.fechafin = undefined;
    this.fechacomienzo = undefined;
    this.motivo = undefined;

    //ENVASADO
    this.cobarras = undefined;
    this.descripcionEnv = undefined;
    this.codmp = undefined;
    this.envasado = undefined;
    this.indice = undefined;

    //BUSQUEDA DE PLANIFICACION
    this.codptB = undefined;
    this.descripcionB = undefined;
    this.clienteB = undefined;
    this.pendientes = false;
    this.arrayB = [];

    // Change to the next page
    document.getElementById("hiddenButton").click();

    // Get the new batch
    this.generarProximoBatch();

  }

}




