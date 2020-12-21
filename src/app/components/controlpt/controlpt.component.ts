import { Component, OnInit, ɵConsole } from '@angular/core';
import { ControlService } from '../control/services/control.service';
import Swal from 'sweetalert2';
import { ProdtermService } from '../../services/prodterm.service';
import { Router } from '@angular/router';
import { GenericService } from 'src/app/services/generic.service';
declare let alertify: any;

@Component({
  selector: 'app-control',
  templateUrl: './controlpt.component.html',
  styles: []
})
export class ControlptComponent implements OnInit {

  numeroPartida: number;
  codpt: number;
  descripcion: string;
  pesoespecifico: number;
  fecha: Date;
  viscosidadcps: string;
  spindle: string;
  viscosidaduk: string;
  molienda: string;
  viscosidadcopa: string;
  brillo: string;
  solidosppp: number;
  aplicabilidad: string;
  color: string;
  curado: string;
  observaciones: string;
  aprobado: string;
  descripcionPt: string;
  descripcionOrigen: string;  //para comparar si se modifico o no para imprimir el certificado

  public colorPt: string;
  public componente: string;
  public pePt: number;
  public viscosidadPt: string;
  public moliendaPt: string;

  public descripcionInfo: string;
  public tipo: string;
  public solidos: string;
  public espesormano: string;
  public relacionmezcla: string;
  public vidamezcla: string;
  public temp1: string;
  public hra1: string;
  public secotacto: string;
  public temp2: string;
  public hra2: string;
  public secoduro: string;
  public temp3: string;
  public hra3: string;
  public pararecubrir: string;
  public temp4: string;
  public hra4: string;
  public curado2: string;
  public temp5: string;
  public hra5: string;
  public vidaalmacen: string;
  public dilucion: string;
  public limpeza: string;

  //para busqueda
  idBus: number; //NUMERO DE COMPROBANTE
  termino1: string; //DESCRIPCION
  termino2: string; //COLOR
  arrayCtp = []; //Array del control de calidad del producto

  constructor(
    private servicioControl: ControlService, 
    private prodtermService: ProdtermService, 
    private route: Router,
    private genericService: GenericService,
    ) {
    let user_role = localStorage.getItem("user_role");
    if (user_role != "ADMIN_ROL" && user_role != "LABORATORIO") {
      alert("Acceso no autorizado !")
      route.navigate(['inicio'])
    }
  }

  ngOnInit(): void {
  }

  buscarP() {
    this.servicioControl.buscarCtp(this.idBus, this.termino1, this.termino2).subscribe((data: any) => {
      this.arrayCtp = data.response;
    }, (err) => {
      console.log(err);
      alertify.error("NO EXISTE ESE NUMERO DE BATCH !");
    })
  }

  seleccionarLote(item) {
    this.numeroPartida = item.numeroPartida;
    this.onLoteChange();
  }

  async actualizarControl() {

    if (!this.aprobado) {
      return alertify.error("SE DEBE COMPLETAR EL RESULTADO !");
    }
    if (!this.fecha) {
      return alertify.error("SE DEBE COMPLETAR FECHA DE APROBACION !");
    }

    await this.obtainProd(this.codpt); //OBTENES DATOS DEL PRODUCTO


    let data = {
      numeroPartida: this.numeroPartida,
      pesoespecifico: this.pesoespecifico,
      fecha: this.fecha,
      viscosidadcps: this.viscosidadcps,
      spindle: this.spindle,
      viscosidaduk: this.viscosidaduk,
      molienda: this.molienda,
      viscosidadcopa: this.viscosidadcopa,
      brillo: this.brillo,
      solidosppp: this.solidosppp,
      aplicabilidad: this.aplicabilidad,
      color: this.color,
      curado: this.curado,
      observaciones: this.observaciones,
      aprobado: this.aprobado,
      descripcion: this.descripcionPt, //descripcion de producto, no de calidadpt 
    }

    this.servicioControl.postearDataPt(data).
      subscribe((response: any) => {
        if (this.aprobado != "RECHAZADO") {
          this.genericService.changeTittle.emit(data.numeroPartida);
          window.print();
        }
        this.resetearInputs();
        alertify.success("DATOS CARGADOS CORRECTAMENTE !");
        this.genericService.changeTittle.emit("Revesta");
      }, (err) => {
        console.log(err);
        alertify.error(err.error.message);
      })
  }

  cancelar() {
    Swal.fire({
      title: "¿ Seguro ?",
      text: "¿ Está seguro que desea cancelar la operación ?",
      showCancelButton: true,
      cancelButtonColor: "red",
      confirmButtonColor: "green",
      confirmButtonText: "SI",
      cancelButtonText: "NO"
    }).then((res) => {
      if (res.value) {
        this.resetearInputs();
      } else {
        return;
      }
    })
  }

  resetearInputs() {
    this.numeroPartida = null;
    this.codpt = null;
    this.descripcion = null;
    this.pesoespecifico = null;
    this.fecha = null;
    this.viscosidadcps = null;
    this.spindle = null;
    this.viscosidaduk = null;
    this.molienda = null;
    this.viscosidadcopa = null;
    this.brillo = null;
    this.solidosppp = null;
    this.aplicabilidad = null;
    this.color = null;
    this.curado = null;
    this.observaciones = null;
    this.aprobado = null;
    this.idBus = null;
    this.termino1 = null;
    this.termino2 = null;
    this.arrayCtp = [];
    this.descripcionOrigen = null;
  }

  //DEVUELVE DATOS DEL CERTIFICADO Y DEL CONTROL DE CALIDAD
  onLoteChange() {
    this.servicioControl.traerporLote(this.numeroPartida, "calidadpt", "numeroPartida")
      .subscribe((data: any) => {
        let item = data.response; //Data del controlpt
        let item2 = data.certificado; //Data del certificado
        //TRAEMOS DATA DEL CONTROL
        this.codpt = item.codpt;
        this.descripcion = item.descripcion;
        if (this.descripcion == "ANULADO") {
          setTimeout(() => {
            this.resetearInputs();
            return alertify.error("BATCH TICKET ANULADO !");
          }, 2000)
        }
        this.pesoespecifico = item.pesoespecifico;
        this.fecha = item.fecha ? item.fecha.split("T")[0] : item.fecha;
        this.viscosidadcps = item.viscosidadcps;
        this.spindle = item.spindle;
        this.viscosidaduk = item.viscosidaduk;
        this.molienda = item.molienda;
        this.viscosidadcopa = item.viscosidadcopa;
        this.brillo = item.brillo;
        this.solidosppp = item.solidosppp;
        this.aplicabilidad = item.aplicabilidad;
        this.color = item.color;
        this.curado = item.curado;
        this.observaciones = item.observaciones;
        this.aprobado = item.aprobado;
        this.descripcionOrigen = this.descripcion;

        //TRAEMOS DATA DE CERTIFICADO (SI ENCUENTRA)
        this.descripcionInfo = item2.descripcion;
        this.tipo = item2.tipo;
        this.solidos = item2.solidos;
        this.espesormano = item2.espesormano;
        this.relacionmezcla = item2.relacionmezcla;
        this.vidamezcla = item2.vidamezcla;
        this.temp1 = item2.temp1;
        this.hra1 = item2.hra1;
        this.secotacto = item2.secotacto;
        this.temp2 = item2.temp2;
        this.hra2 = item2.hra2;
        this.secoduro = item2.secoduro;
        this.temp3 = item2.temp3;
        this.hra3 = item2.hra3;
        this.pararecubrir = item2.pararecubrir;
        this.temp4 = item2.temp4;
        this.hra4 = item2.hra4;
        this.curado2 = item2.curado;
        this.temp5 = item2.temp5;
        this.hra5 = item2.hra5;
        this.vidaalmacen = item2.vidaalmacen;
        this.dilucion = item2.dilucion;
        this.limpeza = item2.limpeza;

      }, (err) => {
        console.log(err);
        this.resetearInputs();
        alertify.error(err.error.message)
      })
  }

  //VALIDIDPT (DEVUELVA UNICAMENTE DATOS DLE PRODUCTO)
  obtainProd(id: number) {
    return new Promise((resolve, reject) => {

      this.prodtermService.validarPt(id).subscribe((data: any) => {
        let response = data.response[0]
        this.descripcionPt = data.desc;
        this.colorPt = data.color;
        this.componente = data.componente;
        this.pePt = response.pesoespecifico;
        this.viscosidadPt = response.viscosidadspindle;
        this.moliendaPt = response.molienda;
        resolve("DONE");
      }, (err) => {
        if (err.error.response) {
          let response = err.error.response;
          this.descripcionPt = response.descripcion;
          this.colorPt = response.color;
          this.componente = response.componente;
          this.pePt = response.pesoespecifico;
          this.viscosidadPt = response.viscosidadspindle;
          this.moliendaPt = response.molienda;
          resolve("DONE");
        } else {
          console.log(err);
          return alertify.error(err.error.message);
        }
      })

    });

  }

}
