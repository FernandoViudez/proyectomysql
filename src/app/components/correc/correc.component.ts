import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatprimService } from 'src/app/services/matprim.service';
import { obtenerPath } from 'src/app/_utils/generarBackPath';
import { Router } from '@angular/router';
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
  termino3: string;
  arrayBusqueda = [];

  constructor(private http: HttpClient, private route: Router,
    private serviceMp: MatprimService) { 
      let user_role = localStorage.getItem("user_role");
    if (user_role != "ADMIN_ROL" && user_role != "LABORATORIO" && user_role != "ENCARGADO") {
      alert("Acceso no autorizado !")
      route.navigate(['inicio'])
    }
    }

  ngOnInit(): void {
  }

  buscarMp() {
    this.serviceMp.buscar(this.termino1, this.termino2, this.termino3).
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
      return alertify.error("DATOS INCOMPLETOS, COMPLETE TODOS LOS CAMPOS");
    }

    let data = { id: this.id, cantidad: this.cantidad, usuario: localStorage.getItem("username"), motivo: this.motivo.toUpperCase() }
    this.http.post(`${obtenerPath()}correcionStock`, data).
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
        if (err.error.response) {
          let item = err.error.response;
          return alertify.error("MATERIA PRIMA CON PE = 0 !")
        } else {
          this.id = null;
          this.resetear(); // puse esto por si borra el codigo de MP
          return alertify.error("NO EXISTE ESE CODIGO DE MATERIA PRIMA !");
        }
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
    this.arrayBusqueda = [];
    this.termino1 = null;
    this.termino2 = null;
    this.termino3 = null;
    let id = document.getElementById("id");
    id.removeAttribute("disabled");
  }

}
