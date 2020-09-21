import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MatprimService } from 'src/app/services/matprim.service';
import numeral from 'numeral';
import { GenericService } from 'src/app/services/generic.service';
declare let alertify: any;

@Component({
  selector: 'app-recepmp',
  templateUrl: './recepmp.component.html',
  styles: []
})
export class RecepmpComponent implements OnInit, OnDestroy {

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
  cantEtiquetas: number;
  numeroLoteInt = 0;
  usuario = "MARCOS";
  fecha: string;
  lotePrint: number;
  fechaultimarecepcion: Date;
  pesoespecifico: number;

  arrayBusqueda = [];
  termino1: number;
  termino2: string;

  constructor(private http: HttpClient,
    private servicioMp: MatprimService,
    private genericService: GenericService) { }

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
        this.stock = numeral(item.stock).format('0.00');
        this.ubicacion = item.ubicacion;
        this.pesoespecifico = item.pesoespecifico;
        if (item.unidadmedidacompra == 'Lt') {
          this.stock = numeral(item.stock / item.pesoespecifico).format('0.00')
        }
        this.unidadRecibo = item.unidadmedidacompra;
        this.fechaultimarecepcion = item.fechaultimarecepcion;
        document.getElementById("id").setAttribute("disabled","");
        this.calcularLote();
        if (this.ubicacion == "SI") { // uso campo ubicacion para poner si esta obsoleto o no la MP
          setTimeout(() => {
            this.resetear();
            return alertify.error("MATERIA PRIMA OBSOLETA !");
          }, 2000)
        }
      }, (err) => {
        if (err.error.response) {
          let item = err.error.response;
          this.descripcion = item.descripcion;
          this.stock = numeral(item.stock).format('0.00');
          this.ubicacion = item.ubicacion;
          this.pesoespecifico = item.pesoespecifico;
          if (item.unidadmedidacompra == 'Lt') {
            this.stock = numeral(item.stock / item.pesoespecifico).format('0.00')
          }
          this.unidadRecibo = item.unidadmedidacompra;
          this.fechaultimarecepcion = item.fechaultimarecepcion;
          document.getElementById("id").setAttribute("disabled","");
          this.calcularLote();
        } else {
          this.id = null;
          this.resetear(); // puse esto por si borra el codigo de MP
          return alertify.error("NO EXISTE ESE CODIGO DE MATERIA PRIMA !");
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
      return alertify.error("EL CODIGO DE MATERIA PRIMA ES INCORRECTO !");
    }
    if (!this.ordenCompra) {
      return alertify.error("FALTA INGRESAR NUMERO DE O/C !");
    }
    if (!this.nroRemito) {
      return alertify.error("EL NUMERO DE REMITO ES OBLIGATORIO !");
    }
    if (!this.proveedor) {
      return alertify.error("FALTA INGRESAR EL PROVEEDOR !");
    }
    if (!this.cantidad) {
      return alertify.error("LA CANTIDAD RECIBIDA ES OBLIGATORIA !");
    }
    let anio = new Date().getFullYear();
    let mes = new Date().getMonth();
    let dia = new Date().getDate();

    this.fecha = `${mes}-${dia}-${anio}`;

    this.proveedor = this.proveedor ? this.proveedor.toUpperCase() : this.proveedor;
    this.ordenCompra = this.ordenCompra ? this.ordenCompra.toUpperCase() : this.ordenCompra;
    this.nroPart = this.nroPart ? this.nroPart.toUpperCase() : this.nroPart;
    if (this.unidadRecibo == "Lt") {
      this.cantidad = (this.cantidad * this.pesoespecifico) //PASAR A KG el this.cantidad
    }
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
    this.fechaultimarecepcion = null;
    this.pesoespecifico = null;
    let id = document.getElementById("id");
    id.removeAttribute("disabled");
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

  omit_number(event) {
    let key;
    key = event.keyCode;  //         key = event.charCode;  (Both can be used)   key == 45  // allows minus(-)
    return ((key > 47 && key < 58) || key == 46);
  }

  ngOnDestroy() {
    this.genericService.downloadTxt("RecepcionMp.txt", "<h1 style='color: white; background-color: blue; text-align: center; '>El archivo 'RecepcionMp.txt' no existe</h1>")
  }

}
