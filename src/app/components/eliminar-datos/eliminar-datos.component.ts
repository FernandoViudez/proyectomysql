import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eliminar-datos',
  templateUrl: './eliminar-datos.component.html',
  styleUrls: ['./eliminar-datos.component.css']
})
export class EliminarDatosComponent implements OnInit {
  
  public fecha: Date;

  constructor(private readonly genericService: GenericService) { }

  ngOnInit(): void {
  }

  cancelar() {
    Swal.fire({
      title: "ELIMINA DATOS PERMANENTEMENTE",
      text: "¿ Está seguro que desea eliminar los DATOS DE VERIFICACIONES anteriores a esa fecha ?",
      showCancelButton: true,
      cancelButtonColor: "red",
      confirmButtonColor: "green",
      confirmButtonText: "SI",
      cancelButtonText: "NO",
      allowEnterKey: false,
    }).then((res) => {
      if (res.value) {
        this.eliminar();
      } else {
        this.resetear();
        return;
      }
    })
  }

  public eliminar(): void{
    if(!this.fecha) return;

    this.genericService.eliminarDatos(this.fecha)
    .subscribe( data => {
    }, e => {
      console.log(e);
    })
    this.resetear()
  }

  resetear() {
    this.fecha = null;
  }

}
