import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eliminar-datos',
  templateUrl: './eliminar-datos.component.html',
  styleUrls: ['./eliminar-datos.component.css']
})
export class EliminarDatosComponent implements OnInit {

  public fecha: Date;
  usuario: string;

  constructor(private readonly genericService: GenericService, private route: Router,) {
    let user_role = localStorage.getItem("user_role");
    if (user_role != "ADMIN_ROL") {
      alert("Acceso no autorizado !")
      route.navigate(['inicio'])
    }
  }

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

  public eliminar(): void {
    if (!this.fecha) return;

    this.genericService.eliminarDatos(this.fecha)
      .subscribe(data => {
      }, e => {
        console.log(e);
      })
    this.resetear()
  }

  resetear() {
    this.fecha = null;
  }

}
