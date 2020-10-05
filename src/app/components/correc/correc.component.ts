import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatprimService } from 'src/app/services/matprim.service';
declare let alertify: any;

@Component({
  selector: 'app-correc',
  templateUrl: './correc.component.html',
  styles: []
})
export class CorrecComponent implements OnInit {

  id: number;
  cantidad: number;
  fecha = new Date();
  usuario: string
  alerta: string;
  descripcion: string;
  stock: number;
  ubicacion: string;
  motivo: string;
  termino1: string;
  termino2: string;
  arrayBusqueda = [];

  constructor(private http: HttpClient,
    private serviceMp: MatprimService) { }

  ngOnInit(): void {
  }

  buscarMp() {
    this.serviceMp.buscar(this.termino1, this.termino2).
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

  //CAMBIAR USUARIO CUANDO SE IMPLEMENTE EL LOGIN
  finalizar() {
    if (!this.id || !this.cantidad || !this.motivo) {
      return alertify.error("DATOS INCORRECTOS, INGRESE DATOS VÁLIDOS");
    }

    let data = { id: this.id, cantidad: this.cantidad, usuario: localStorage.getItem("username"), motivo: this.motivo.toUpperCase() }
    this.http.post(`http://localhost:8080/api/correcionStock`, data).
      subscribe((data) => {
        this.resetear();
        alertify.success("Has corregido un stock correctamente!")
      }, (err) => {
        console.log(err);
      })
  }

  validarMp() {
    this.serviceMp.validarMp(this.id).
      subscribe((data: any) => {
        let datos = data.response;
        this.descripcion = datos.descripcion;
        this.ubicacion = datos.ubicacion;
        if (this.ubicacion == "SI") { // uso campo ubicacion para poner si esta obsoleto o no la MP
          setTimeout(() => {
            this.resetear();
            return alertify.error("MATERIA PRIMA OBSOLETA !");
          }, 2000)
        }
        this.stock = datos.stock;
        document.getElementById("id").setAttribute("disabled","");
      }, (err) => {
        console.log(err);
      })
  }

  resetear() {
    this.id = null;
    this.cantidad = null;
    this.fecha = new Date();
    this.alerta = null;
    this.descripcion = null;
    this.stock = null;
    this.ubicacion = null;
    this.motivo = null;
    let id = document.getElementById("id");
    id.removeAttribute("disabled");
  }

}
