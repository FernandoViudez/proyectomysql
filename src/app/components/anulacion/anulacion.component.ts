import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
declare let alertify:any;

@Component({
  selector: 'app-anulacion',
  templateUrl: './anulacion.component.html',
  styles: []
})
export class AnulacionComponent implements OnInit {

  batch: number;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  onBatchChange() {
    if(!this.batch){
      return alertify.error("BATCH OBLIGATORIO!!")
    }
    Swal.fire({ 
      title:"¿ ANULAR BT ?",
      text:"¿ Esta seguro de q ue quiere anular el batch ?",
      icon:'error',
      showCancelButton:true,
      cancelButtonColor:"red",
      cancelButtonText:"Cancelar",
      confirmButtonColor:"green",
      confirmButtonText:"Anular BT"
    }).then(res => {
      if (res.value) {
        Swal.showLoading();
        this.http.get(`http://localhost:8080/api/anularBatch/${this.batch}`)
          .subscribe(data => {
            Swal.close();
            console.log(data);
            this.batch=null;
            alertify.success("Has anulado el BT!");
          }, (err) => {
            console.log(err);
          })
      }
    })

  }


}
