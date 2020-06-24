import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MatprimService } from 'src/app/services/matprim.service';
declare let alertify: any;

@Component({
  selector: 'app-recepmp',
  templateUrl: './recepmp.component.html',
  styles: []
})
export class RecepmpComponent implements OnInit {

  id: number;
  descripcion: string;
  stock: number;
  ubicacion: string;
  ordenCompra: string;
  nroRemito: number;
  proveedor: string;
  nroPart: string;
  unidadRecibo: string;
  cantidad: number;
  cantEtiquetas: string;
  numeroLoteInt = 0;
  usuario = "MARCOS";
  fecha: string;
  lotePrint: number;

  arrayBusqueda = [];
  termino1: number;
  termino2: string;

  constructor(private http: HttpClient,
    private servicioMp: MatprimService) { }

  ngOnInit(): void {

    Swal.fire({
      title: "Eliminar etiquetas",
      text: "¿ Desea eliminar las etiquetas del archivo txt ?",
      cancelButtonColor: "red",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonText: "NO",
      confirmButtonText: "SI",
      icon: "question"
    }).then(res => {
      if (res.value) {
        this.eliminarEtiquetas();
      } else {
        return;
      }
    })

  }

  traerDatosMp() {
    this.servicioMp.validarMp(this.id).
      subscribe((data: any) => {
        let item = data.response;
        this.descripcion = item.descripcion;
        this.stock = item.stock;
        this.ubicacion = item.ubicacion;
        this.unidadRecibo = item.unidadmedidacompra;
        this.calcularLote();
      }, (err) => {
        if (err.error.response) {
          let item = err.error.response;
          this.descripcion = item.descripcion;
          this.stock = item.stock;
          this.ubicacion = item.ubicacion;
          this.unidadRecibo = item.unidadmedidacompra;
          this.calcularLote();
        } else {
          this.id = null;
          return alertify.error("NO EXISTE ESE CODIGO DE MATERIA PRIMA !")
        }
      })
  }

  calcularLote() {
    this.http.get("http://localhost:8080/api/calcularLote").
      subscribe((data: any) => {
        this.lotePrint = data.lote;
      })
  }

  finalizar() {
    if (!this.id) {
      return alertify.error("EL CODGIO DE MATERIA PRIMA ES INCORRECTO !");
    }
    if (!this.cantidad) {
      return alertify.error("LA CANTIDAD RECIBIDA ES OBLIGATORIA !");
    }
    if (this.unidadRecibo == "Lt") {
      //PASAR A KG el this.cantidad
    }

    let anio = new Date().getFullYear();
    let mes = new Date().getMonth();
    let dia = new Date().getDate();

    this.fecha = `${mes}-${dia}-${anio}`;

    this.proveedor = this.proveedor ? this.proveedor.toUpperCase() : this.proveedor;
    this.ordenCompra = this.ordenCompra ? this.ordenCompra.toUpperCase() : this.ordenCompra;
    this.nroPart = this.nroPart ? this.nroPart.toUpperCase() : this.nroPart;

    let data = {
      id: this.id, cantidad: this.cantidad, numeroComprobante: this.nroRemito, numeroLoteInt: this.numeroLoteInt,
      proveedor: this.proveedor, ordenCompra: this.ordenCompra, nroPart: this.nroPart, usuario: this.usuario,
      cantEtiquetas: this.cantEtiquetas
    };

    this.http.post("http://localhost:8080/api/postRmp", data).
      subscribe((data: any) => {
        window.print();
        this.resetear();
        return alertify.success("RECEPCIÓN CARGADA CORRECTAMENTE");
      }, (err) => {
        console.log(err);
      })

  }

  resetear() {
    this.id = null;
    this.descripcion = null;
    this.stock = null;
    this.ubicacion = null;
    this.ordenCompra = null;
    this.nroRemito = null;
    this.proveedor = null;
    this.nroPart = null;
    this.unidadRecibo = null;
    this.cantidad = null;
    this.cantEtiquetas = null;
    this.numeroLoteInt = 0;
    this.lotePrint = null;
    this.arrayBusqueda = [];
    this.termino1 = null;
    this.termino2 = null;
  }

  cancelar() {
    this.resetear()
  }

  buscarMp() {
    this.servicioMp.buscar(this.termino1, this.termino2).
      subscribe((data: any) => {
        this.arrayBusqueda = data.response;
      }, (err) => {
        console.log(err);
      })
  }

  seleccionarId(id) {
    this.id = id;
    this.traerDatosMp();
  }

  eliminarEtiquetas() {
    this.http.get("http://localhost:8080/api/eliminarEtiquetas").
      subscribe((data: any) => {
        alertify.success(data.message);
      }, (err) => {
        alertify.error(err.error.message);
      })
  }


}
