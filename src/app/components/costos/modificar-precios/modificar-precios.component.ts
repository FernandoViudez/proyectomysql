import { Component, OnInit } from '@angular/core';
import { MatprimService } from 'src/app/services/matprim.service';

@Component({
  selector: 'app-modificar-precios',
  templateUrl: './modificar-precios.component.html',
  styleUrls: ['./modificar-precios.component.css']
})
export class ModificarPreciosComponent implements OnInit {

  public _arrayMp: any[]

  constructor(
    private readonly mpService: MatprimService
  ) { }

  ngOnInit(): void {
    this._getAllMp()
  }

  // Get all mp
  private _getAllMp() {
    this.mpService.traer()
    .subscribe( (data: any) => {
      this._arrayMp = data.response
    })
  }

  // Modify each mp on input change
  modifySpecificMp(newPrice: number, mpid: number): void {
    // Send new price to rest api
    this.mpService.modificarAlgo({
      tabla: 'promatpri',
      atributo: 'precio',
      nuevoValor: newPrice
    }, mpid)
    .subscribe( data => {
      console.log(data);
    }, console.log)
  }

}
