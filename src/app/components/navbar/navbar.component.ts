import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit {

  public user_role : string;

  constructor(private router: Router) { 
    this.user_role = localStorage.getItem("user_role")
  }

  ngOnInit(): void {
  }

  salir(){
    Swal.fire({
      title:"Salir",
      text:"¿Esta seguro que desea cerrar sesión?",
      icon:"question",
      cancelButtonColor:"red",
      cancelButtonText:"No",
      showCancelButton:true,
      confirmButtonText:"Si",
      confirmButtonColor:"green"
    }).then(res=>{
      if(res.value){
        this.router.navigate(['inicio']);
      }
    })
  }
  


}
