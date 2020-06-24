import { Component, OnInit } from '@angular/core';
import { ControlService } from './services/control.service';
import Swal from 'sweetalert2';
declare let alertify: any;

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styles: []
})
export class ControlComponent implements OnInit {

  id: number;
  descripcion: string;
  tipo: string = null;
  pesoespecifico: number = null;
  numeroLote: number = null;
  fecha: Date = null;
  aprobado: string = null;

  ensayo1: string;
  ensayo2: string;
  ensayo3: string;
  ensayo4: string;
  ensayo5: string;
  ensayo6: string;
  ensayo7: string;
  ensayo8: string;
  ensayo9: string;

  arrayCt = [];
  idBus: number = undefined; //LOTE
  termino1: string = undefined; //DESCRIPCION
  termino2: string = undefined; //TIPO


  constructor(private servicioControl: ControlService) { }

  ngOnInit(): void {
  }

  //BUSQUEDA DE CONTROL 
  buscarP() {
    this.servicioControl.buscarCt(this.idBus, this.termino1, this.termino2).subscribe((data: any) => {
      this.arrayCt = data.response;
    }, (err) => {
      console.log(err);
      alertify.error("NO EXISTEN FILAS CON ESOS PARÁMETROS");
    })
  }

  seleccionarLote(lote) {
    this.numeroLote = lote;
    this.validarMp(lote);
  }

  validarMp(lote) {
    this.servicioControl.validarMp(lote).
      subscribe((data: any) => {
        let dato=data.response;

        let fecha= dato.fecha ? dato.fecha.split("T")[0] : dato.fecha;

        this.id=dato.codigoMp;
        this.descripcion = dato.descripcion;
        this.pesoespecifico = dato.peso;
        this.fecha = fecha;
        this.aprobado = dato.aprobado;
        this.ensayo1 = dato.ensayo1;
        this.ensayo2 = dato.ensayo2;
        this.ensayo3 = dato.ensayo3;
        this.ensayo4 = dato.ensayo4;
        this.ensayo5 = dato.ensayo5;
        this.ensayo6 = dato.ensayo6;
        this.ensayo7 = dato.ensayo7;
        this.ensayo8 = dato.ensayo8;
        this.ensayo9 = dato.ensayo9;
        this.tipo = dato.tipoProd;
      }, (err) => {
        console.log(err);
      })
  }

  resetearInputs() {
    this.id = null;
    this.descripcion = null;
    this.tipo = null;
    this.pesoespecifico = null;
    this.numeroLote = null;
    this.fecha = null;
    this.aprobado = null;
    this.ensayo1 = null;
    this.ensayo2 = null;
    this.ensayo3 = null;
    this.ensayo4 = null;
    this.ensayo5 = null;
    this.ensayo6 = null;
    this.ensayo7 = null;
    this.ensayo8 = null;
    this.ensayo9 = null;
  }

  finalizar() {
    //VALIDACIONES
    //.....
    //UNA VEZ PASADAS LAS VALIDACIONES

    let data = {
      id: this.id,
      numeroLote: this.numeroLote,
      descripcion: this.descripcion,
      pesoespecifico: this.pesoespecifico,
      ensayo1: this.ensayo1,
      ensayo2: this.ensayo2,
      ensayo3: this.ensayo3,
      ensayo4: this.ensayo4,
      ensayo5: this.ensayo5,
      ensayo6: this.ensayo6,
      ensayo7: this.ensayo7,
      ensayo8: this.ensayo8,
      ensayo9: this.ensayo9,
      aprobado: this.aprobado,
    }

    this.servicioControl.postearData(data).subscribe
        ((data: any) => {
          this.resetearInputs();
          alertify.success("HAS EDITADO EL CONTROL DE CALIDAD CORRECTAMENTE!")
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


}
