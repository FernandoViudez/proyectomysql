import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';

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

  public eliminar(): void{
    if(!this.fecha) return;

    this.genericService.eliminarDatos(this.fecha)
    .subscribe( data => {
      console.log(data);
    }, e => {
      console.log(e);
    })
  }

}
