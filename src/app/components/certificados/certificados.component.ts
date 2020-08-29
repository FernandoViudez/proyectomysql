import { Component, OnInit } from '@angular/core';
import { CertificadosService } from '../../services/certificados.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
declare let alertify: any;

@Component({
  selector: 'app-certificados',
  templateUrl: './certificados.component.html',
  styles: []
})
export class CertificadosComponent implements OnInit {


  public descripcion: string;
  public tipo: string;
  public solidos: string;
  public espesormano: string;
  public relacionmezcla: string;
  public vidamezcla: string;
  public temp1: string;
  public hra1: string;
  public secotacto: string;
  public temp2: string;
  public hra2: string;
  public secoduro: string;
  public temp3: string;
  public hra3: string;
  public pararecubrir: string;
  public temp4: string;
  public hra4: string;
  public curado: string;
  public temp5: string;
  public hra5: string;
  public vidaalmacen: string;
  public dilucion: string;
  public limpeza: string;
  
  //Flag
  private editar: boolean = false;
  
  //Arreglo busqueda
  public arrayB; 
  public descripcionB;
  
  constructor(private certificadosService: CertificadosService, private route: Router) { 
    let user_role = localStorage.getItem("user_role");
    if (user_role != "ADMIN_ROL" && user_role != "LABORATORIO") {
      alert("Acceso no autorizado !")
      route.navigate(['inicio'])
    }
  }

  ngOnInit(): void {
  }

  onDescripcionChange() {
    this.getCertificado(this.descripcion);
  }

  getCertificado(descripcion: string) {
    this.certificadosService.getCertificado(descripcion)
      .subscribe((data: any) => {
        Swal.fire({
          title: "CERTIFICADO existente",
          text: "¿ Desea editarlo ?",
          cancelButtonColor: "red",
          confirmButtonColor: "green",
          confirmButtonText: "SI",
          cancelButtonText: "NO",
          showCancelButton: true,
          icon: "question",
        }).then(res => {
          if (res.value) {
            this.tipo = data.response.tipo;
            this.solidos = data.response.solidos;
            this.espesormano = data.response.espesormano;
            this.relacionmezcla = data.response.relacionmezcla;
            this.vidamezcla = data.response.vidamezcla;
            this.temp1 = data.response.temp1;
            this.hra1 = data.response.hra1;
            this.secotacto = data.response.secotacto;
            this.temp2 = data.response.temp2;
            this.hra2 = data.response.hra2;
            this.secoduro = data.response.secoduro;
            this.temp3 = data.response.temp3;
            this.hra3 = data.response.hra3;
            this.pararecubrir = data.response.pararecubrir;
            this.temp4 = data.response.temp4;
            this.hra4 = data.response.hra4;
            this.curado = data.response.curado;
            this.temp5 = data.response.temp5;
            this.hra5 = data.response.hra5;
            this.vidaalmacen = data.response.vidaalmacen;
            this.dilucion = data.response.dilucion;
            this.limpeza = data.response.limpeza;
            this.editar = true;
          }
        })

      }, err => {
        alertify.success("Producto inexistente, complete los datos!");
        console.log(err);
      })
  }

  seleccionarItem(descripcion){
    this.descripcion = descripcion
    this.getCertificado(descripcion);
  }

  addCertificado(data) {
    this.certificadosService.addCertificado(data)
      .subscribe(data => {
        console.log(data);
      }, err => {
        console.log(err);
      })
  }

  editarCertificado(data) {
    this.certificadosService.updateCertificado(data)
      .subscribe(data => {
        console.log(data);
      }, err => {
        console.log(err);
      })
  }

  onSubmit() {
    let data = {
      descripcion: this.descripcion = this.descripcion.toUpperCase(),
      tipo: this.tipo = this.tipo.toUpperCase(),
      solidos: this.solidos = this.solidos.toUpperCase(),
      espesormano: this.espesormano,
      relacionmezcla: this.relacionmezcla,
      vidamezcla: this.vidamezcla,
      temp1: this.temp1,
      hra1: this.hra1,
      secotacto: this.secotacto,
      temp2: this.temp2,
      hra2: this.hra2,
      secoduro: this.secoduro,
      temp3: this.temp3,
      hra3: this.hra3,
      pararecubrir: this.pararecubrir,
      temp4: this.temp4,
      hra4: this.hra4,
      curado: this.curado,
      temp5: this.temp5,
      hra5: this.hra5,
      vidaalmacen: this.vidaalmacen = this.vidaalmacen.toUpperCase(),
      dilucion: this.dilucion = this.dilucion.toUpperCase(),
      limpeza: this.limpeza = this.limpeza.toUpperCase(),

    }
    if (this.editar) {
      this.editarCertificado(data);
    } else {
      this.addCertificado(data);
    }
    this.reset();
  }

  reset() {
    this.descripcion = null;
    this.tipo = null;
    this.solidos = null;
    this.espesormano = null;
    this.relacionmezcla = null;
    this.vidamezcla = null;
    this.temp1 = null;
    this.hra1 = null;
    this.secotacto = null;
    this.temp2 = null;
    this.hra2 = null;
    this.secoduro = null;
    this.temp3 = null;
    this.hra3 = null;
    this.pararecubrir = null;
    this.temp4 = null;
    this.hra4 = null;
    this.curado = null;
    this.temp5 = null;
    this.hra5 = null;
    this.vidaalmacen = null;
    this.dilucion = null;
    this.limpeza = null;
    this.editar = false;
  }

  buscarCertificado(){
    this.certificadosService.buscarCertificado(this.descripcionB)
    .subscribe((data: any) => {
      this.arrayB = data.response;
      
    }, err => {
      console.log(err);
    })

  }


}
