import { Component, OnInit } from '@angular/core';
import { InicioService } from './inicio.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
declare let alertify:any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styles: []
})
export class InicioComponent implements OnInit {

  inputType:string="password";
  username:string;
  password:string;
  user_role:string;

  constructor(private inicioService:InicioService, private router: Router) { }

  ngOnInit(): void {
    this.eliminarDatos("username");
    this.eliminarDatos("user_role");
  }

  changePassword(){
    if(this.inputType=="password"){
      this.inputType="text"
    }else{
      this.inputType="password"
    }
  }

  login(){
    if(!this.username || !this.password){
      return alertify.error("DATOS INCORRECTOS");
    }
    Swal.showLoading();
    this.inicioService.login(this.username,this.password)
    .subscribe((data:any)=>{
      this.guardarDatos("username", data.username);
      this.guardarDatos("user_role", data.user_role);
      this.router.navigate(["app"]);
      Swal.close();
    },(err)=>{
      Swal.close();
      alertify.error(err.error.message);
    })

  }

  guardarDatos(datoAguardar, data){
    localStorage.setItem(`${datoAguardar}`, data );
  }

  eliminarDatos(dataAeliminar){
    localStorage.removeItem(dataAeliminar);
  }

}
