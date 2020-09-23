import { Component, OnInit } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import Swal from 'sweetalert2';
declare let alertify: any;

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.css']
})
export class VerificacionComponent implements OnInit {

  // Fecha (Generated by the backend)
  public operario: string;
  public codigomp: number;
  public lote: number;
  public partida: number;
  public descripcion: string;
  public descripcionLote: string;

  // ok(boolean) (Sending the verification, we validate the data sent by the user,
  // and we determinate the ok field seeing the repsonse)


  constructor(private genericService: GenericService) { }

  ngOnInit(): void {
  }

  traerDescripcion() {  //tiene que traerlo de la base de datos materia prima
    this.genericService.traerDescripcion(this.codigomp)
      .subscribe((data: any) => {
        this.descripcion = data.response[0].descripcion;
      }, err => {
        alertify.error("NO EXISTE ESA MATERIA PRIMA");
      })
  }
  
  traerLote() {  //tiene que traerlo de la base de datos materia prima
    this.genericService.traerLote(this.lote)
      .subscribe((data: any) => {
        console.log(data);
      }, err => {
        alertify.error(err.error.message);
      })
  }

  enviarData() {
    let enviar: boolean = true;
    /** VALIDACION GENERICA **/
    ['codigomp', 'lote', 'operario', 'partida'].forEach((item) => {
      if (!this[item]) {
        enviar = false;
      };

    });

    if (!enviar) {
      /** Enviar feedback */
      return;
    };

    let data = {
      codigomp: this.codigomp,
      lote: this.lote,
      operario: this.operario,
      partida: this.partida,
    };

    this.genericService.agregarVerificacion(data)
      .subscribe((data: any) => {
        console.log(data);

        if (data.ok == "false") {
          return Swal.fire({
            title: "ALERTA",
            imageUrl: "./assets/imagen_NO_ok_2.jpeg",
            imageWidth: 400,
            imageHeight: 200,
            text: "NO COINCIDE MATERIA PRIMA CON NUMERO DE LOTE",
          })
        } else {
          let timerInterval
          Swal.fire({
            title: 'Verificacion correcta ',
            imageUrl: "./assets/imagen_ok.jpg",
            imageWidth: 400,
            imageHeight: 200,
            timer: 2500,
            timerProgressBar: true,
            onBeforeOpen: () => {
              Swal.showLoading()
              timerInterval = setInterval(() => {
              }, 100)
            },
            onClose: () => {
              clearInterval(timerInterval)
              this.resetear()
            }
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log('I was closed by the timer')
            }
          })
        }

      }, err => {
        console.log(err);
      })
  }

  resetear() {
    this.codigomp = null;
    this.lote = null;
    this.operario = null;
    this.partida = null;
    this.descripcion = null;
    this.descripcionLote = null;
  }
}