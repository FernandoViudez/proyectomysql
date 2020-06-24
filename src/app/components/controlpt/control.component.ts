import { Component, OnInit } from '@angular/core';
import { ControlService } from '../control/services/control.service';
import Swal from 'sweetalert2';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
declare let alertify: any;

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styles: []
})
export class ControlComponent implements OnInit {


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

  //para busqueda
  idBus: number; //NUMERO DE COMPROBANTE
  termino1: string; //DESCRIPCION
  termino2: string; //COLOR
  arrayCtp = []; //Array del control de calidad del producto

  constructor(private servicioControl: ControlService) { }

  ngOnInit(): void {
  }

  buscarP() {
    this.servicioControl.buscarCtp(this.idBus, this.termino1, this.termino2).subscribe((data: any) => {
      this.arrayCtp = data.response;
    }, (err) => {
      console.log(err);
      alertify.error("NO EXISTEN FILAS CON ESOS PARÁMETROS");
    })
  }

  seleccionarLote(item) {
    this.numeroPartida = item.numeroPartida;
    this.codpt = item.codpt;
    this.descripcion = item.descripcion;
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
  }

  actualizarControl() {
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
    }
    this.servicioControl.postearDataPt(data).
      subscribe(data => {
        this.resetearInputs();
        alertify.success("HAS EDITADOUN CONTROL DE CALIDAD CON EXITO!");
      }, (err) => {
        console.log(err);
        alertify.error("HA OCURRIDO UN ERROR EN EL SERVIDOR")
      })
  }

  cancelar() {
    Swal.fire({
      title: "¿Seguro?",
      text: "¿Está seguro que desea cancelar la operacón?",
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
    this.numeroPartida=null;
    this.codpt=null;
    this.descripcion=null;
    this.pesoespecifico=null;
    this.fecha=null;
    this.viscosidadcps=null;
    this.spindle=null;
    this.viscosidaduk=null;
    this.molienda=null;
    this.viscosidadcopa=null;
    this.brillo=null;
    this.solidosppp=null;
    this.aplicabilidad=null;
    this.color=null;
    this.curado=null;
    this.observaciones=null;
    this.aprobado=null;
    this.idBus=null; 
    this.termino1=null; 
    this.termino2=null; 
    this.arrayCtp = []; 
  
  }

}
