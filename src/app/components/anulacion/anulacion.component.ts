import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { obtenerPath } from 'src/app/_utils/generarBackPath';
declare let alertify:any;

@Component({
  selector: 'app-anulacion',
  templateUrl: './anulacion.component.html',
  styles: []
})
export class AnulacionComponent implements OnInit {

  codpt: number;
  descripcion: string;
  batch: number;
  
  private url: string = obtenerPath();

  constructor(private http: HttpClient, private route: Router) { 
    let user_role = localStorage.getItem("user_role");
    if (user_role != "ADMIN_ROL" && user_role != "LABORATORIO") {
      alert("Acceso no autorizado !")
      route.navigate(['inicio'])
    }
   }

  ngOnInit(): void {
    let btnanular = document.getElementById("btnanular");
    btnanular.setAttribute("disabled","");
  } 

  onBatchSubmit() {
    if(!this.batch){
      return alertify.error("DEBE INGRESAR UN NUMERO DE BATCH !")
    }

    Swal.fire({ 
      title:"¿ ANULAR BT ?",
      text:"¿ Esta seguro de que desea anular el batch ?",
      icon:'error',
      showCancelButton:true,
      cancelButtonColor:"red",
      cancelButtonText:"Cancelar",
      confirmButtonColor:"green",
      confirmButtonText:"Anular BT"
    }).then(res => {
      if (res.value) {
        Swal.showLoading();
        this.http.get(`${this.url}anularBatch/${this.batch}`)
          .subscribe(data => {
            Swal.close();
            console.log(data);
            this.batch=null;
            this.descripcion=null;
            this.codpt = null;
            alertify.success("Has anulado el Batch Ticket !");
            this.ngOnInit()
          }, (err) => {
            console.log(err);
          })
      } else {
        this.batch=null;
        this.descripcion=null;
        this.codpt = null;
        this.ngOnInit()
      }
    })

  }

  onBatchChange(){
    console.log("ENTRO")
    this.http.get(`${this.url}obtenerBatch/${this.batch}`)
    .subscribe((data : any) => {
      console.log(data);
        //TRAEMOS DATA DEL CONTROL
        this.codpt = data.response.codpt;
        this.descripcion = data.response.descripcion;
        let btnanular = document.getElementById("btnanular")
        btnanular.removeAttribute("disabled");
    }, err=>{
      console.log(err);
      this.batch = null;
      this.descripcion = null;
      this.codpt = null;
      alertify.error(err.error.message);
    })
  }

  cancelar() {
    this.batch = null;
    this.descripcion = null;
    this.codpt = null;
    let btnanular = document.getElementById("btnanular");
    btnanular.setAttribute("disabled","");
  }

}
