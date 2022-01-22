import { Component, OnInit } from '@angular/core';
import { ControlService } from './services/control.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
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


  constructor(private servicioControl: ControlService, private route: Router) { 
    let user_role = localStorage.getItem("user_role");
    if (user_role != "ADMIN_ROL" && user_role != "LABORATORIO") {
      alert("Acceso no autorizado !")
      route.navigate(['inicio'])
    }
  }

  ngOnInit(): void {
  }

  //BUSQUEDA DE CONTROL 
  buscarP() {
    this.servicioControl.buscarCt(this.idBus, this.termino1, this.termino2).subscribe((data: any) => {
      this.arrayCt = data.response;
    }, (err) => {
      console.log(err);
      alertify.error("NO EXISTE ESE NUMERO DE LOTE !");
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

        this.id=dato.codigoMp;
        this.descripcion = dato.descripcion;
        this.pesoespecifico = dato.peso;
        this.fecha = dato.fecha ? dato.fecha.split("T")[0] : dato.fecha;
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
    if (!this.aprobado) {
      return alertify.error("SE DEBE COMPLETAR EL RESULTADO !");
    } 
    
    if (!this.fecha) {
      return alertify.error("HAY QUE CARGAR FECHA DE APROBACION !");
    }
    	 
    let data = {
      id: this.id,
      numeroLote: this.numeroLote,
      descripcion: this.descripcion,
      pesoespecifico: this.pesoespecifico,
      fecha: this.fecha,
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
          alertify.success(" SE ACTUALIZARON LOS RESULTADOS CORRECTAMENTE !")
        }, (err) => {
          console.log(err);
          alertify.error("HA OCURRIDO UN ERROR EN EL SERVIDOR")
        })

  }

  resetearBusqueda() {
    this.termino1 = null;
    this.termino2 = null;
    this.idBus = null;
    this.arrayCt = [];
  }

  cancelar() {
    Swal.fire({
      title: "CANCELAR CARGA DATOS",
      text: "¿ Está seguro que desea cancelar la operación ?",
      showCancelButton: true,
      cancelButtonColor: "red",
      confirmButtonColor: "green",
      confirmButtonText: "SI",
      cancelButtonText: "NO",
      allowEnterKey: false,
    }).then((res) => {
      if (res.value) {
        this.resetearInputs();
        this.resetearBusqueda();
      } else {
        return;
      }
    })
  }

  onLoteChange(){
    this.servicioControl.traerporLote(this.numeroLote, "calidadmp", "numeroLote")
    .subscribe((data:any)=>{
      let item = data.response
      this.id=item.codigoMp;
      this.descripcion = item.descripcion;
      this.pesoespecifico = item.peso;
      this.fecha = item.fecha ? item.fecha.split("T")[0] : item.fecha;
      this.aprobado = item.aprobado;
      this.ensayo1 = item.ensayo1;
      this.ensayo2 = item.ensayo2;
      this.ensayo3 = item.ensayo3;
      this.ensayo4 = item.ensayo4;
      this.ensayo5 = item.ensayo5;
      this.ensayo6 = item.ensayo6;
      this.ensayo7 = item.ensayo7;
      this.ensayo8 = item.ensayo8;
      this.ensayo9 = item.ensayo9;
      this.tipo = item.tipoProd;
    }, (err)=>{
      this.resetearInputs();
      alertify.error(err.error.message)
    })
  }

}
